Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _messageElement = require('./message-element');

'use babel';

var Interact = require('interact.js');
var Clipboard = undefined;
try {
  Clipboard = require('electron').clipboard;
} catch (_) {
  Clipboard = require('clipboard');
}

var BottomPanel = (function () {
  function BottomPanel(scope) {
    var _this = this;

    _classCallCheck(this, BottomPanel);

    this.subscriptions = new _atom.CompositeDisposable();

    this.visibility = false;
    this.visibleMessages = 0;
    this.alwaysTakeMinimumSpace = atom.config.get('linter.alwaysTakeMinimumSpace');
    this.errorPanelHeight = atom.config.get('linter.errorPanelHeight');
    this.configVisibility = atom.config.get('linter.showErrorPanel');
    this.scope = scope;
    this.editorMessages = new Map();
    this.messages = new Map();

    var element = document.createElement('linter-panel'); // TODO(steelbrain): Make this a `div`
    element.tabIndex = '-1';
    this.messagesElement = document.createElement('div');
    element.appendChild(this.messagesElement);
    this.panel = atom.workspace.addBottomPanel({ item: element, visible: false, priority: 500 });
    Interact(element).resizable({ edges: { top: true } }).on('resizemove', function (event) {
      event.target.style.height = event.rect.height + 'px';
    }).on('resizeend', function (event) {
      atom.config.set('linter.errorPanelHeight', event.target.clientHeight);
    });
    element.addEventListener('keydown', function (e) {
      if (e.which === 67 && e.ctrlKey) {
        Clipboard.writeText(getSelection().toString());
      }
    });

    this.subscriptions.add(atom.config.onDidChange('linter.alwaysTakeMinimumSpace', function (_ref) {
      var newValue = _ref.newValue;

      _this.alwaysTakeMinimumSpace = newValue;
      _this.updateHeight();
    }));

    this.subscriptions.add(atom.config.onDidChange('linter.errorPanelHeight', function (_ref2) {
      var newValue = _ref2.newValue;

      _this.errorPanelHeight = newValue;
      _this.updateHeight();
    }));

    this.subscriptions.add(atom.config.onDidChange('linter.showErrorPanel', function (_ref3) {
      var newValue = _ref3.newValue;

      _this.configVisibility = newValue;
      _this.updateVisibility();
    }));

    this.subscriptions.add(atom.workspace.observeActivePaneItem(function (paneItem) {
      _this.paneVisibility = paneItem === atom.workspace.getActiveTextEditor();
      _this.updateVisibility();
    }));

    // Container for messages with no filePath
    var defaultContainer = document.createElement('div');
    this.editorMessages.set(null, defaultContainer);
    this.messagesElement.appendChild(defaultContainer);
    if (scope !== 'Project') {
      defaultContainer.setAttribute('hidden', true);
    }
  }

  _createClass(BottomPanel, [{
    key: 'setMessages',
    value: function setMessages(_ref4) {
      var _this2 = this;

      var added = _ref4.added;
      var removed = _ref4.removed;

      if (removed.length) {
        this.removeMessages(removed);
      }
      if (added.length) {
        (function () {
          var activeFile = atom.workspace.getActiveTextEditor();
          activeFile = activeFile ? activeFile.getPath() : undefined;
          added.forEach(function (message) {
            if (!_this2.editorMessages.has(message.filePath)) {
              var container = document.createElement('div');
              _this2.editorMessages.set(message.filePath, container);
              _this2.messagesElement.appendChild(container);
              if (!(_this2.scope === 'Project' || activeFile === message.filePath)) {
                container.setAttribute('hidden', true);
              }
            }
            var messageElement = _messageElement.Message.fromMessage(message);
            _this2.messages.set(message, messageElement);
            _this2.editorMessages.get(message.filePath).appendChild(messageElement);
            if (messageElement.updateVisibility(_this2.scope).visibility) {
              _this2.visibleMessages++;
            }
          });
        })();
      }

      this.editorMessages.forEach(function (child, key) {
        // Never delete the default container
        if (key !== null && !child.childNodes.length) {
          child.remove();
          _this2.editorMessages['delete'](key);
        }
      });

      this.updateVisibility();
    }
  }, {
    key: 'removeMessages',
    value: function removeMessages(messages) {
      var _this3 = this;

      messages.forEach(function (message) {
        var messageElement = _this3.messages.get(message);
        _this3.messages['delete'](message);
        messageElement.remove();
        if (messageElement.visibility) {
          _this3.visibleMessages--;
        }
      });
    }
  }, {
    key: 'refresh',
    value: function refresh(scope) {
      var _this4 = this;

      if (scope) {
        this.scope = scope;
      } else scope = this.scope;
      this.visibleMessages = 0;

      this.messages.forEach(function (messageElement) {
        if (messageElement.updateVisibility(scope).visibility && scope === 'Line') {
          _this4.visibleMessages++;
        }
      });

      if (scope === 'File') {
        (function () {
          var activeFile = atom.workspace.getActiveTextEditor();
          activeFile = activeFile ? activeFile.getPath() : undefined;
          _this4.editorMessages.forEach(function (messagesElement, filePath) {
            if (filePath === activeFile) {
              messagesElement.removeAttribute('hidden');
              _this4.visibleMessages = messagesElement.childNodes.length;
            } else messagesElement.setAttribute('hidden', true);
          });
        })();
      } else if (scope === 'Project') {
        this.visibleMessages = this.messages.size;
        this.editorMessages.forEach(function (messageElement) {
          messageElement.removeAttribute('hidden');
        });
      }

      this.updateVisibility();
    }
  }, {
    key: 'updateHeight',
    value: function updateHeight() {
      var height = this.errorPanelHeight;

      if (this.alwaysTakeMinimumSpace) {
        // Add `1px` for the top border.
        height = Math.min(this.messagesElement.clientHeight + 1, height);
      }

      this.messagesElement.parentNode.style.height = height + 'px';
    }
  }, {
    key: 'getVisibility',
    value: function getVisibility() {
      return this.visibility;
    }
  }, {
    key: 'updateVisibility',
    value: function updateVisibility() {
      this.visibility = this.configVisibility && this.paneVisibility && this.visibleMessages > 0;

      if (this.visibility) {
        this.panel.show();
        this.updateHeight();
      } else {
        this.panel.hide();
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
      this.messages.clear();
      try {
        this.panel.destroy();
      } catch (err) {
        // Atom fails weirdly sometimes when doing this
      }
    }
  }]);

  return BottomPanel;
})();

exports['default'] = BottomPanel;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92aXRhbWluYWZyb250Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdWkvYm90dG9tLXBhbmVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O29CQVNrQyxNQUFNOzs4QkFDbEIsbUJBQW1COztBQVZ6QyxXQUFXLENBQUE7O0FBRVgsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQ3ZDLElBQUksU0FBUyxZQUFBLENBQUE7QUFDYixJQUFJO0FBQ0YsV0FBUyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxTQUFTLENBQUE7Q0FDMUMsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNWLFdBQVMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUE7Q0FDakM7O0lBSW9CLFdBQVc7QUFDbkIsV0FEUSxXQUFXLENBQ2xCLEtBQUssRUFBRTs7OzBCQURBLFdBQVc7O0FBRTVCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXVCLENBQUE7O0FBRTVDLFFBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFBO0FBQ3ZCLFFBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFBO0FBQ3hCLFFBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQyxDQUFBO0FBQzlFLFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO0FBQ2xFLFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFBO0FBQ2hFLFFBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO0FBQ2xCLFFBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUMvQixRQUFJLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7O0FBRXpC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YXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3VpL2JvdHRvbS1wYW5lbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmNvbnN0IEludGVyYWN0ID0gcmVxdWlyZSgnaW50ZXJhY3QuanMnKVxubGV0IENsaXBib2FyZFxudHJ5IHtcbiAgQ2xpcGJvYXJkID0gcmVxdWlyZSgnZWxlY3Ryb24nKS5jbGlwYm9hcmRcbn0gY2F0Y2ggKF8pIHtcbiAgQ2xpcGJvYXJkID0gcmVxdWlyZSgnY2xpcGJvYXJkJylcbn1cbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSdcbmltcG9ydCB7TWVzc2FnZX0gZnJvbSAnLi9tZXNzYWdlLWVsZW1lbnQnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJvdHRvbVBhbmVsIHtcbiAgY29uc3RydWN0b3Ioc2NvcGUpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgdGhpcy52aXNpYmlsaXR5ID0gZmFsc2VcbiAgICB0aGlzLnZpc2libGVNZXNzYWdlcyA9IDBcbiAgICB0aGlzLmFsd2F5c1Rha2VNaW5pbXVtU3BhY2UgPSBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci5hbHdheXNUYWtlTWluaW11bVNwYWNlJylcbiAgICB0aGlzLmVycm9yUGFuZWxIZWlnaHQgPSBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci5lcnJvclBhbmVsSGVpZ2h0JylcbiAgICB0aGlzLmNvbmZpZ1Zpc2liaWxpdHkgPSBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci5zaG93RXJyb3JQYW5lbCcpXG4gICAgdGhpcy5zY29wZSA9IHNjb3BlXG4gICAgdGhpcy5lZGl0b3JNZXNzYWdlcyA9IG5ldyBNYXAoKVxuICAgIHRoaXMubWVzc2FnZXMgPSBuZXcgTWFwKClcblxuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW50ZXItcGFuZWwnKSAvLyBUT0RPKHN0ZWVsYnJhaW4pOiBNYWtlIHRoaXMgYSBgZGl2YFxuICAgIGVsZW1lbnQudGFiSW5kZXggPSAnLTEnXG4gICAgdGhpcy5tZXNzYWdlc0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5tZXNzYWdlc0VsZW1lbnQpXG4gICAgdGhpcy5wYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZEJvdHRvbVBhbmVsKHtpdGVtOiBlbGVtZW50LCB2aXNpYmxlOiBmYWxzZSwgcHJpb3JpdHk6IDUwMH0pXG4gICAgSW50ZXJhY3QoZWxlbWVudCkucmVzaXphYmxlKHtlZGdlczoge3RvcDogdHJ1ZX19KVxuICAgICAgLm9uKCdyZXNpemVtb3ZlJywgZXZlbnQgPT4ge1xuICAgICAgICBldmVudC50YXJnZXQuc3R5bGUuaGVpZ2h0ID0gYCR7ZXZlbnQucmVjdC5oZWlnaHR9cHhgXG4gICAgICB9KVxuICAgICAgLm9uKCdyZXNpemVlbmQnLCBldmVudCA9PiB7XG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLmVycm9yUGFuZWxIZWlnaHQnLCBldmVudC50YXJnZXQuY2xpZW50SGVpZ2h0KVxuICAgICAgfSlcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBmdW5jdGlvbihlKSB7XG4gICAgICBpZiAoZS53aGljaCA9PT0gNjcgJiYgZS5jdHJsS2V5KSB7XG4gICAgICAgIENsaXBib2FyZC53cml0ZVRleHQoZ2V0U2VsZWN0aW9uKCkudG9TdHJpbmcoKSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnbGludGVyLmFsd2F5c1Rha2VNaW5pbXVtU3BhY2UnLCAoe25ld1ZhbHVlfSkgPT4ge1xuICAgICAgdGhpcy5hbHdheXNUYWtlTWluaW11bVNwYWNlID0gbmV3VmFsdWVcbiAgICAgIHRoaXMudXBkYXRlSGVpZ2h0KClcbiAgICB9KSlcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2xpbnRlci5lcnJvclBhbmVsSGVpZ2h0JywgKHtuZXdWYWx1ZX0pID0+IHtcbiAgICAgIHRoaXMuZXJyb3JQYW5lbEhlaWdodCA9IG5ld1ZhbHVlXG4gICAgICB0aGlzLnVwZGF0ZUhlaWdodCgpXG4gICAgfSkpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdsaW50ZXIuc2hvd0Vycm9yUGFuZWwnLCAoe25ld1ZhbHVlfSkgPT4ge1xuICAgICAgdGhpcy5jb25maWdWaXNpYmlsaXR5ID0gbmV3VmFsdWVcbiAgICAgIHRoaXMudXBkYXRlVmlzaWJpbGl0eSgpXG4gICAgfSkpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20ud29ya3NwYWNlLm9ic2VydmVBY3RpdmVQYW5lSXRlbShwYW5lSXRlbSA9PiB7XG4gICAgICB0aGlzLnBhbmVWaXNpYmlsaXR5ID0gcGFuZUl0ZW0gPT09IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgdGhpcy51cGRhdGVWaXNpYmlsaXR5KClcbiAgICB9KSlcblxuICAgIC8vIENvbnRhaW5lciBmb3IgbWVzc2FnZXMgd2l0aCBubyBmaWxlUGF0aFxuICAgIGNvbnN0IGRlZmF1bHRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIHRoaXMuZWRpdG9yTWVzc2FnZXMuc2V0KG51bGwsIGRlZmF1bHRDb250YWluZXIpXG4gICAgdGhpcy5tZXNzYWdlc0VsZW1lbnQuYXBwZW5kQ2hpbGQoZGVmYXVsdENvbnRhaW5lcilcbiAgICBpZiAoc2NvcGUgIT09ICdQcm9qZWN0Jykge1xuICAgICAgZGVmYXVsdENvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsIHRydWUpXG4gICAgfVxuICB9XG4gIHNldE1lc3NhZ2VzKHthZGRlZCwgcmVtb3ZlZH0pIHtcbiAgICBpZiAocmVtb3ZlZC5sZW5ndGgpIHtcbiAgICAgIHRoaXMucmVtb3ZlTWVzc2FnZXMocmVtb3ZlZClcbiAgICB9XG4gICAgaWYgKGFkZGVkLmxlbmd0aCkge1xuICAgICAgbGV0IGFjdGl2ZUZpbGUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIGFjdGl2ZUZpbGUgPSBhY3RpdmVGaWxlID8gYWN0aXZlRmlsZS5nZXRQYXRoKCkgOiB1bmRlZmluZWRcbiAgICAgIGFkZGVkLmZvckVhY2gobWVzc2FnZSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5lZGl0b3JNZXNzYWdlcy5oYXMobWVzc2FnZS5maWxlUGF0aCkpIHtcbiAgICAgICAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgICAgIHRoaXMuZWRpdG9yTWVzc2FnZXMuc2V0KG1lc3NhZ2UuZmlsZVBhdGgsIGNvbnRhaW5lcilcbiAgICAgICAgICB0aGlzLm1lc3NhZ2VzRWxlbWVudC5hcHBlbmRDaGlsZChjb250YWluZXIpXG4gICAgICAgICAgaWYgKCEodGhpcy5zY29wZSA9PT0gJ1Byb2plY3QnIHx8IGFjdGl2ZUZpbGUgPT09IG1lc3NhZ2UuZmlsZVBhdGgpKSB7XG4gICAgICAgICAgICBjb250YWluZXIuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCB0cnVlKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtZXNzYWdlRWxlbWVudCA9IE1lc3NhZ2UuZnJvbU1lc3NhZ2UobWVzc2FnZSlcbiAgICAgICAgdGhpcy5tZXNzYWdlcy5zZXQobWVzc2FnZSwgbWVzc2FnZUVsZW1lbnQpXG4gICAgICAgIHRoaXMuZWRpdG9yTWVzc2FnZXMuZ2V0KG1lc3NhZ2UuZmlsZVBhdGgpLmFwcGVuZENoaWxkKG1lc3NhZ2VFbGVtZW50KVxuICAgICAgICBpZiAobWVzc2FnZUVsZW1lbnQudXBkYXRlVmlzaWJpbGl0eSh0aGlzLnNjb3BlKS52aXNpYmlsaXR5KSB7XG4gICAgICAgICAgdGhpcy52aXNpYmxlTWVzc2FnZXMrK1xuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIHRoaXMuZWRpdG9yTWVzc2FnZXMuZm9yRWFjaCgoY2hpbGQsIGtleSkgPT4ge1xuICAgICAgLy8gTmV2ZXIgZGVsZXRlIHRoZSBkZWZhdWx0IGNvbnRhaW5lclxuICAgICAgaWYgKGtleSAhPT0gbnVsbCAmJiAhY2hpbGQuY2hpbGROb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgY2hpbGQucmVtb3ZlKClcbiAgICAgICAgdGhpcy5lZGl0b3JNZXNzYWdlcy5kZWxldGUoa2V5KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLnVwZGF0ZVZpc2liaWxpdHkoKVxuICB9XG4gIHJlbW92ZU1lc3NhZ2VzKG1lc3NhZ2VzKSB7XG4gICAgbWVzc2FnZXMuZm9yRWFjaChtZXNzYWdlID0+IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2VFbGVtZW50ID0gdGhpcy5tZXNzYWdlcy5nZXQobWVzc2FnZSlcbiAgICAgIHRoaXMubWVzc2FnZXMuZGVsZXRlKG1lc3NhZ2UpXG4gICAgICBtZXNzYWdlRWxlbWVudC5yZW1vdmUoKVxuICAgICAgaWYgKG1lc3NhZ2VFbGVtZW50LnZpc2liaWxpdHkpIHtcbiAgICAgICAgdGhpcy52aXNpYmxlTWVzc2FnZXMtLVxuICAgICAgfVxuICAgIH0pXG4gIH1cbiAgcmVmcmVzaChzY29wZSkge1xuICAgIGlmIChzY29wZSkge1xuICAgICAgdGhpcy5zY29wZSA9IHNjb3BlXG4gICAgfSBlbHNlIHNjb3BlID0gdGhpcy5zY29wZVxuICAgIHRoaXMudmlzaWJsZU1lc3NhZ2VzID0gMFxuXG4gICAgdGhpcy5tZXNzYWdlcy5mb3JFYWNoKG1lc3NhZ2VFbGVtZW50ID0+IHtcbiAgICAgIGlmIChtZXNzYWdlRWxlbWVudC51cGRhdGVWaXNpYmlsaXR5KHNjb3BlKS52aXNpYmlsaXR5ICYmIHNjb3BlID09PSAnTGluZScpIHtcbiAgICAgICAgdGhpcy52aXNpYmxlTWVzc2FnZXMrK1xuICAgICAgfVxuICAgIH0pXG5cbiAgICBpZiAoc2NvcGUgPT09ICdGaWxlJykge1xuICAgICAgbGV0IGFjdGl2ZUZpbGUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIGFjdGl2ZUZpbGUgPSBhY3RpdmVGaWxlID8gYWN0aXZlRmlsZS5nZXRQYXRoKCkgOiB1bmRlZmluZWRcbiAgICAgIHRoaXMuZWRpdG9yTWVzc2FnZXMuZm9yRWFjaCgobWVzc2FnZXNFbGVtZW50LCBmaWxlUGF0aCkgPT4ge1xuICAgICAgICBpZiAoZmlsZVBhdGggPT09IGFjdGl2ZUZpbGUpIHtcbiAgICAgICAgICBtZXNzYWdlc0VsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKVxuICAgICAgICAgIHRoaXMudmlzaWJsZU1lc3NhZ2VzID0gbWVzc2FnZXNFbGVtZW50LmNoaWxkTm9kZXMubGVuZ3RoXG4gICAgICAgIH0gZWxzZSBtZXNzYWdlc0VsZW1lbnQuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCB0cnVlKVxuICAgICAgfSlcbiAgICB9IGVsc2UgaWYgKHNjb3BlID09PSAnUHJvamVjdCcpIHtcbiAgICAgIHRoaXMudmlzaWJsZU1lc3NhZ2VzID0gdGhpcy5tZXNzYWdlcy5zaXplXG4gICAgICB0aGlzLmVkaXRvck1lc3NhZ2VzLmZvckVhY2gobWVzc2FnZUVsZW1lbnQgPT4ge1xuICAgICAgICBtZXNzYWdlRWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpXG4gICAgICB9KVxuICAgIH1cblxuICAgIHRoaXMudXBkYXRlVmlzaWJpbGl0eSgpXG4gIH1cbiAgdXBkYXRlSGVpZ2h0KCkge1xuICAgIGxldCBoZWlnaHQgPSB0aGlzLmVycm9yUGFuZWxIZWlnaHRcblxuICAgIGlmICh0aGlzLmFsd2F5c1Rha2VNaW5pbXVtU3BhY2UpIHtcbiAgICAgIC8vIEFkZCBgMXB4YCBmb3IgdGhlIHRvcCBib3JkZXIuXG4gICAgICBoZWlnaHQgPSBNYXRoLm1pbih0aGlzLm1lc3NhZ2VzRWxlbWVudC5jbGllbnRIZWlnaHQgKyAxLCBoZWlnaHQpXG4gICAgfVxuXG4gICAgdGhpcy5tZXNzYWdlc0VsZW1lbnQucGFyZW50Tm9kZS5zdHlsZS5oZWlnaHQgPSBgJHtoZWlnaHR9cHhgXG4gIH1cbiAgZ2V0VmlzaWJpbGl0eSgpIHtcbiAgICByZXR1cm4gdGhpcy52aXNpYmlsaXR5XG4gIH1cbiAgdXBkYXRlVmlzaWJpbGl0eSgpIHtcbiAgICB0aGlzLnZpc2liaWxpdHkgPSB0aGlzLmNvbmZpZ1Zpc2liaWxpdHkgJiYgdGhpcy5wYW5lVmlzaWJpbGl0eSAmJiB0aGlzLnZpc2libGVNZXNzYWdlcyA+IDBcblxuICAgIGlmICh0aGlzLnZpc2liaWxpdHkpIHtcbiAgICAgIHRoaXMucGFuZWwuc2hvdygpXG4gICAgICB0aGlzLnVwZGF0ZUhlaWdodCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucGFuZWwuaGlkZSgpXG4gICAgfVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIHRoaXMubWVzc2FnZXMuY2xlYXIoKVxuICAgIHRyeSB7XG4gICAgICB0aGlzLnBhbmVsLmRlc3Ryb3koKVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgLy8gQXRvbSBmYWlscyB3ZWlyZGx5IHNvbWV0aW1lcyB3aGVuIGRvaW5nIHRoaXNcbiAgICB9XG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/vitaminafront/.atom/packages/linter/lib/ui/bottom-panel.js
