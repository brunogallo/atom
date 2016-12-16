(function() {
  var Disposable, IndentationManager, IndentationStatusView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Disposable = require('atom').Disposable;

  IndentationManager = require('./indentation-manager');

  IndentationStatusView = (function(_super) {
    __extends(IndentationStatusView, _super);

    function IndentationStatusView() {
      return IndentationStatusView.__super__.constructor.apply(this, arguments);
    }

    IndentationStatusView.prototype.initialize = function(statusBar) {
      this.statusBar = statusBar;
      this.classList.add('indentation-status', 'inline-block');
      this.indentationLink = document.createElement('a');
      this.indentationLink.classList.add('inline-block');
      this.indentationLink.href = '#';
      this.appendChild(this.indentationLink);
      this.handleEvents();
      return this;
    };

    IndentationStatusView.prototype.attach = function() {
      var _ref;
      if ((_ref = this.statusBarTile) != null) {
        _ref.destroy();
      }
      this.statusBarTile = atom.config.get('auto-detect-indentation.showSpacingInStatusBar') ? this.statusBar.addRightTile({
        item: this,
        priority: 10
      }) : void 0;
      return this.updateIndentationText();
    };

    IndentationStatusView.prototype.handleEvents = function() {
      var clickHandler;
      this.activeItemSubscription = atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function() {
          return _this.subscribeToActiveTextEditor();
        };
      })(this));
      this.configSubscription = atom.config.observe('auto-detect-indentation.showSpacingInStatusBar', (function(_this) {
        return function() {
          return _this.attach();
        };
      })(this));
      clickHandler = (function(_this) {
        return function() {
          return atom.commands.dispatch(atom.views.getView(_this.getActiveTextEditor()), 'auto-detect-indentation:show-indentation-selector');
        };
      })(this);
      this.addEventListener('click', clickHandler);
      this.clickSubscription = new Disposable((function(_this) {
        return function() {
          return _this.removeEventListener('click', clickHandler);
        };
      })(this));
      return this.subscribeToActiveTextEditor();
    };

    IndentationStatusView.prototype.destroy = function() {
      var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
      if ((_ref = this.activeItemSubscription) != null) {
        _ref.dispose();
      }
      if ((_ref1 = this.indentationSubscription) != null) {
        _ref1.dispose();
      }
      if ((_ref2 = this.paneOpenSubscription) != null) {
        _ref2.dispose();
      }
      if ((_ref3 = this.paneCreateSubscription) != null) {
        _ref3.dispose();
      }
      if ((_ref4 = this.paneDestroySubscription) != null) {
        _ref4.dispose();
      }
      if ((_ref5 = this.clickSubscription) != null) {
        _ref5.dispose();
      }
      if ((_ref6 = this.configSubscription) != null) {
        _ref6.dispose();
      }
      return this.statusBarTile.destroy();
    };

    IndentationStatusView.prototype.getActiveTextEditor = function() {
      return atom.workspace.getActiveTextEditor();
    };

    IndentationStatusView.prototype.subscribeToActiveTextEditor = function() {
      var editor, workspace, _ref, _ref1, _ref2, _ref3, _ref4;
      workspace = atom.workspace;
      editor = workspace.getActiveTextEditor();
      if ((_ref = this.indentationSubscription) != null) {
        _ref.dispose();
      }
      this.indentationSubscription = editor != null ? (_ref1 = editor.emitter) != null ? _ref1.on('did-change-indentation', (function(_this) {
        return function() {
          return _this.updateIndentationText();
        };
      })(this)) : void 0 : void 0;
      if ((_ref2 = this.paneOpenSubscription) != null) {
        _ref2.dispose();
      }
      this.paneOpenSubscription = workspace.onDidOpen((function(_this) {
        return function(event) {
          return _this.updateIndentationText();
        };
      })(this));
      if ((_ref3 = this.paneCreateSubscription) != null) {
        _ref3.dispose();
      }
      this.paneCreateSubscription = workspace.onDidAddPane((function(_this) {
        return function(event) {
          return _this.updateIndentationText();
        };
      })(this));
      if ((_ref4 = this.paneDestroySubscription) != null) {
        _ref4.dispose();
      }
      this.paneDestroySubscription = workspace.onDidDestroyPaneItem((function(_this) {
        return function(event) {
          return _this.updateIndentationText();
        };
      })(this));
      return this.updateIndentationText();
    };

    IndentationStatusView.prototype.updateIndentationText = function() {
      var editor, indentationName;
      editor = this.getActiveTextEditor();
      if (editor) {
        indentationName = IndentationManager.getIndentation(editor);
        this.indentationLink.textContent = indentationName;
        return this.style.display = '';
      } else {
        return this.style.display = 'none';
      }
    };

    return IndentationStatusView;

  })(HTMLDivElement);

  module.exports = document.registerElement('indentation-selector-status', {
    prototype: IndentationStatusView.prototype
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpdGFtaW5hZnJvbnQvLmF0b20vcGFja2FnZXMvYXV0by1kZXRlY3QtaW5kZW50YXRpb24vbGliL2luZGVudGF0aW9uLXN0YXR1cy12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxxREFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsYUFBYyxPQUFBLENBQVEsTUFBUixFQUFkLFVBQUQsQ0FBQTs7QUFBQSxFQUNBLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSx1QkFBUixDQURyQixDQUFBOztBQUFBLEVBR007QUFDSiw0Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsb0NBQUEsVUFBQSxHQUFZLFNBQUUsU0FBRixHQUFBO0FBQ1YsTUFEVyxJQUFDLENBQUEsWUFBQSxTQUNaLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxTQUFTLENBQUMsR0FBWCxDQUFlLG9CQUFmLEVBQXFDLGNBQXJDLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGVBQUQsR0FBbUIsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsR0FBdkIsQ0FEbkIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLGVBQWUsQ0FBQyxTQUFTLENBQUMsR0FBM0IsQ0FBK0IsY0FBL0IsQ0FGQSxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsZUFBZSxDQUFDLElBQWpCLEdBQXdCLEdBSHhCLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxXQUFELENBQWEsSUFBQyxDQUFBLGVBQWQsQ0FKQSxDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsWUFBRCxDQUFBLENBTEEsQ0FBQTthQU1BLEtBUFU7SUFBQSxDQUFaLENBQUE7O0FBQUEsb0NBU0EsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLFVBQUEsSUFBQTs7WUFBYyxDQUFFLE9BQWhCLENBQUE7T0FBQTtBQUFBLE1BQ0Es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

//# sourceURL=/Users/vitaminafront/.atom/packages/auto-detect-indentation/lib/indentation-status-view.coffee
