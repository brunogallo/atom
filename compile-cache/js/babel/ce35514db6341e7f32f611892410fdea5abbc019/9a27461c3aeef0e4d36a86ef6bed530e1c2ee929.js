Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x4, _x5, _x6) { var _again = true; _function: while (_again) { var object = _x4, property = _x5, receiver = _x6; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x4 = parent; _x5 = property; _x6 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atom = require('atom');

'use babel';

var Dialog = (function (_HTMLElement) {
  _inherits(Dialog, _HTMLElement);

  function Dialog() {
    _classCallCheck(this, Dialog);

    _get(Object.getPrototypeOf(Dialog.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Dialog, [{
    key: 'createdCallback',
    value: function createdCallback() {
      var _this = this;

      this.disposables = new _atom.CompositeDisposable();

      this.classList.add('project-manager-dialog', 'overlay', 'from-top');

      this.label = document.createElement('label');
      this.label.classList.add('project-manager-dialog-label', 'icon');

      this.editor = new _atom.TextEditor({ mini: true });
      this.editorElement = atom.views.getView(this.editor);

      this.errorMessage = document.createElement('div');
      this.errorMessage.classList.add('error');

      this.appendChild(this.label);
      this.appendChild(this.editorElement);
      this.appendChild(this.errorMessage);

      this.disposables.add(atom.commands.add('project-manager-dialog', {
        'core:confirm': function coreConfirm() {
          return _this.confirm();
        },
        'core:cancel': function coreCancel() {
          return _this.cancel();
        }
      }));

      this.editorElement.addEventListener('blur', function () {
        return _this.cancel();
      });

      this.isAttached();
    }
  }, {
    key: 'attachedCallback',
    value: function attachedCallback() {
      this.editorElement.focus();
    }
  }, {
    key: 'attach',
    value: function attach() {
      atom.views.getView(atom.workspace).appendChild(this);
    }
  }, {
    key: 'detach',
    value: function detach() {
      if (this.parentNode == 'undefined' || this.parentNode == null) {
        return false;
      }

      this.disposables.dispose();
      atom.workspace.getActivePane().activate();
      this.parentNode.removeChild(this);
    }

    // attributeChangedCallback(attr, oldVal, newVal) {
    //
    // }

  }, {
    key: 'setLabel',
    value: function setLabel(text, iconClass) {
      if (text === undefined) text = '';

      this.label.textContent = text;
      if (iconClass) {
        this.label.classList.add(iconClass);
      }
    }
  }, {
    key: 'setInput',
    value: function setInput() {
      var input = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
      var select = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      this.editor.setText(input);

      if (select) {
        var range = [[0, 0], [0, input.length]];
        this.editor.setSelectedBufferRange(range);
      }
    }
  }, {
    key: 'showError',
    value: function showError() {
      var message = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

      this.errorMessage.textContent(message);
    }
  }, {
    key: 'cancel',
    value: function cancel() {
      this.detach();
    }
  }, {
    key: 'close',
    value: function close() {
      this.detach();
    }
  }]);

  return Dialog;
})(HTMLElement);

exports['default'] = Dialog;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92aXRhbWluYWZyb250Ly5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvX2RpYWxvZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7b0JBRThDLE1BQU07O0FBRnBELFdBQVcsQ0FBQzs7SUFJUyxNQUFNO1lBQU4sTUFBTTs7V0FBTixNQUFNOzBCQUFOLE1BQU07OytCQUFOLE1BQU07OztlQUFOLE1BQU07O1dBRVYsMkJBQUc7OztBQUNoQixVQUFJLENBQUMsV0FBVyxHQUFHLCtCQUF5QixDQUFDOztBQUU3QyxVQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsRUFBRSxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7O0FBRXBFLFVBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM3QyxVQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsOEJBQThCLEVBQUUsTUFBTSxDQUFDLENBQUM7O0FBRWpFLFVBQUksQ0FBQyxNQUFNLEdBQUcscUJBQWUsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztBQUMzQyxVQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFckQsVUFBSSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2xELFVBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFekMsVUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDN0IsVUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDckMsVUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7O0FBRXBDLFVBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLHdCQUF3QixFQUFFO0FBQy9ELHNCQUFjLEVBQUU7aUJBQU0sTUFBSyxPQUFPLEVBQUU7U0FBQTtBQUNwQyxxQkFBYSxFQUFFO2lCQUFNLE1BQUssTUFBTSxFQUFFO1NBQUE7T0FDbkMsQ0FBQyxDQUFDLENBQUM7O0FBRUosVUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUU7ZUFBTSxNQUFLLE1BQU0sRUFBRTtPQUFBLENBQUMsQ0FBQzs7QUFFakUsVUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0tBQ25COzs7V0FFZSw0QkFBRztBQUNqQixVQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQzVCOzs7V0FFSyxrQkFBRztBQUNQLFVBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDdEQ7OztXQUVLLGtCQUFHO0FBQ1AsVUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLFdBQVcsSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksRUFBRTtBQUM3RCxlQUFPLEtBQUssQ0FBQztPQUNkOztBQUVELFVBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDM0IsVUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUMxQyxVQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNuQzs7Ozs7Ozs7V0FNTyxrQkFBQyxJQUFJLEVBQUssU0FBUyxFQUFFO1VBQXBCLElBQUksZ0JBQUosSUFBSSxHQUFDLEVBQUU7O0FBQ2QsVUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0FBQzlCLFVBQUksU0FBUyxFQUFFO0FBQ2IsWUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO09BQ3JDO0tBQ0Y7OztXQUVPLG9CQUF5QjtVQUF4QixLQUFLLHlEQUFDLEVBQUU7VUFBRSxNQUFNLHlEQUFDLEtBQUs7O0FBQzdCLFVBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUUzQixVQUFJLE1BQU0sRUFBRTtBQUNWLFlBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDeEMsWUFBSSxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUMzQztLQUNGOzs7V0FFUSxxQkFBYTtVQUFaLE9BQU8seURBQUMsRUFBRTs7QUFDbEIsVUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDeEM7OztXQUVLLGtCQUFHO0FBQ1AsVUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQ2Y7OztXQUVJLGlCQUFHO0FBQ04sVUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQ2Y7OztTQTlFa0IsTUFBTTtHQUFTLFdBQVc7O3FCQUExQixNQUFNIiwiZmlsZSI6Ii9Vc2Vycy92aXRhbWluYWZyb250Ly5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvX2RpYWxvZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQge1RleHRFZGl0b3IsIENvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEaWFsb2cgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG4gICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdwcm9qZWN0LW1hbmFnZXItZGlhbG9nJywgJ292ZXJsYXknLCAnZnJvbS10b3AnKTtcblxuICAgIHRoaXMubGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgIHRoaXMubGFiZWwuY2xhc3NMaXN0LmFkZCgncHJvamVjdC1tYW5hZ2VyLWRpYWxvZy1sYWJlbCcsICdpY29uJyk7XG5cbiAgICB0aGlzLmVkaXRvciA9IG5ldyBUZXh0RWRpdG9yKHttaW5pOiB0cnVlfSk7XG4gICAgdGhpcy5lZGl0b3JFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KHRoaXMuZWRpdG9yKTtcblxuICAgIHRoaXMuZXJyb3JNZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5lcnJvck1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnZXJyb3InKTtcblxuICAgIHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5sYWJlbCk7XG4gICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLmVkaXRvckVsZW1lbnQpO1xuICAgIHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5lcnJvck1lc3NhZ2UpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ3Byb2plY3QtbWFuYWdlci1kaWFsb2cnLCB7XG4gICAgICAnY29yZTpjb25maXJtJzogKCkgPT4gdGhpcy5jb25maXJtKCksXG4gICAgICAnY29yZTpjYW5jZWwnOiAoKSA9PiB0aGlzLmNhbmNlbCgpXG4gICAgfSkpO1xuXG4gICAgdGhpcy5lZGl0b3JFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCAoKSA9PiB0aGlzLmNhbmNlbCgpKTtcblxuICAgIHRoaXMuaXNBdHRhY2hlZCgpO1xuICB9XG5cbiAgYXR0YWNoZWRDYWxsYmFjaygpIHtcbiAgICB0aGlzLmVkaXRvckVsZW1lbnQuZm9jdXMoKTtcbiAgfVxuXG4gIGF0dGFjaCgpIHtcbiAgICBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLmFwcGVuZENoaWxkKHRoaXMpO1xuICB9XG5cbiAgZGV0YWNoKCkge1xuICAgIGlmICh0aGlzLnBhcmVudE5vZGUgPT0gJ3VuZGVmaW5lZCcgfHwgdGhpcy5wYXJlbnROb2RlID09IG51bGwpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLmRpc3Bvc2UoKTtcbiAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkuYWN0aXZhdGUoKTtcbiAgICB0aGlzLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcyk7XG4gIH1cblxuICAvLyBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soYXR0ciwgb2xkVmFsLCBuZXdWYWwpIHtcbiAgLy9cbiAgLy8gfVxuXG4gIHNldExhYmVsKHRleHQ9JycsIGljb25DbGFzcykge1xuICAgIHRoaXMubGFiZWwudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgIGlmIChpY29uQ2xhc3MpIHtcbiAgICAgIHRoaXMubGFiZWwuY2xhc3NMaXN0LmFkZChpY29uQ2xhc3MpO1xuICAgIH1cbiAgfVxuXG4gIHNldElucHV0KGlucHV0PScnLCBzZWxlY3Q9ZmFsc2UpIHtcbiAgICB0aGlzLmVkaXRvci5zZXRUZXh0KGlucHV0KTtcblxuICAgIGlmIChzZWxlY3QpIHtcbiAgICAgIGxldCByYW5nZSA9IFtbMCwgMF0sIFswLCBpbnB1dC5sZW5ndGhdXTtcbiAgICAgIHRoaXMuZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2UocmFuZ2UpO1xuICAgIH1cbiAgfVxuXG4gIHNob3dFcnJvcihtZXNzYWdlPScnKSB7XG4gICAgdGhpcy5lcnJvck1lc3NhZ2UudGV4dENvbnRlbnQobWVzc2FnZSk7XG4gIH1cblxuICBjYW5jZWwoKSB7XG4gICAgdGhpcy5kZXRhY2goKTtcbiAgfVxuXG4gIGNsb3NlKCkge1xuICAgIHRoaXMuZGV0YWNoKCk7XG4gIH1cblxufVxuIl19
//# sourceURL=/Users/vitaminafront/.atom/packages/project-manager/lib/_dialog.js
