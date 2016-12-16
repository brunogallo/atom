(function() {
  var CompositeDisposable, IndentationManager;

  CompositeDisposable = require('atom').CompositeDisposable;

  IndentationManager = require('./indentation-manager');

  module.exports = {
    activate: function(state) {
      this.disposables = new CompositeDisposable;
      this.disposables.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this._handleLoad(editor);
        };
      })(this)));
      this.disposables.add(atom.commands.add('atom-text-editor', 'auto-detect-indentation:show-indentation-selector', this.createIndentationListView));
      this.indentationListView = null;
      return this.indentationStatusView = null;
    },
    _handleLoad: function(editor) {
      var onSaveDisposable, onTokenizeDisposable, _ref;
      this._attach(editor);
      onSaveDisposable = editor.buffer.onDidSave((function(_this) {
        return function() {
          var indentation;
          if (IndentationManager.isManuallyIndented(editor)) {
            return onSaveDisposable != null ? onSaveDisposable.dispose() : void 0;
          } else {
            indentation = IndentationManager.autoDetectIndentation(editor);
            return IndentationManager.setIndentation(editor, indentation, true);
          }
        };
      })(this));
      if ((_ref = editor.buffer) != null ? _ref.onDidTokenize : void 0) {
        onTokenizeDisposable = editor.buffer.onDidTokenize((function(_this) {
          return function() {
            _this._attach(editor);
            if (onTokenizeDisposable != null) {
              onTokenizeDisposable.dispose();
            }
            return onTokenizeDisposable = null;
          };
        })(this));
      } else {
        onTokenizeDisposable = null;
      }
      return editor.onDidDestroy(function() {
        if (onSaveDisposable != null) {
          onSaveDisposable.dispose();
        }
        return onTokenizeDisposable != null ? onTokenizeDisposable.dispose() : void 0;
      });
    },
    deactivate: function() {
      return this.disposables.dispose();
    },
    createIndentationListView: (function(_this) {
      return function() {
        var IndentationListView, indentationListView;
        if (_this.indentationListView == null) {
          IndentationListView = require('./indentation-list-view');
          indentationListView = new IndentationListView();
        }
        return indentationListView.toggle();
      };
    })(this),
    consumeStatusBar: function(statusBar) {
      var IndentationStatusView, indentationStatusView;
      if (this.IndentationStatusView == null) {
        IndentationStatusView = require('./indentation-status-view');
        indentationStatusView = new IndentationStatusView().initialize(statusBar);
      }
      return indentationStatusView.attach();
    },
    _attach: function(editor) {
      var indentation, originalSetSoftTabs, originalSetTabLength;
      originalSetSoftTabs = editor.setSoftTabs;
      originalSetTabLength = editor.setTabLength;
      editor.shouldUseSoftTabs = function() {
        return this.softTabs;
      };
      editor.setSoftTabs = function(softTabs) {
        var value;
        this.softTabs = softTabs;
        value = originalSetSoftTabs.call(editor, this.softTabs);
        this.emitter.emit('did-change-indentation');
        return value;
      };
      editor.setTabLength = function(tabLength) {
        var value;
        value = originalSetTabLength.call(editor, tabLength);
        this.emitter.emit('did-change-indentation');
        return value;
      };
      indentation = IndentationManager.autoDetectIndentation(editor);
      return IndentationManager.setIndentation(editor, indentation, true);
    },
    config: {
      showSpacingInStatusBar: {
        type: 'boolean',
        "default": true,
        title: 'Show spacing in status bar',
        description: 'Show current editor\'s spacing settings in status bar'
      },
      indentationTypes: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string'
            },
            softTabs: {
              type: 'boolean'
            },
            tabLength: {
              type: 'integer'
            }
          }
        },
        "default": [
          {
            name: "2 Spaces",
            softTabs: true,
            tabLength: 2
          }, {
            name: "4 Spaces",
            softTabs: true,
            tabLength: 4
          }, {
            name: "8 Spaces",
            softTabs: true,
            tabLength: 8
          }, {
            name: "Tabs (default width)",
            softTabs: false
          }, {
            name: "Tabs (2 wide)",
            softTabs: false,
            tabLength: 2
          }, {
            name: "Tabs (4 wide)",
            softTabs: false,
            tabLength: 4
          }, {
            name: "Tabs (8 wide)",
            softTabs: false,
            tabLength: 8
          }
        ]
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpdGFtaW5hZnJvbnQvLmF0b20vcGFja2FnZXMvYXV0by1kZXRlY3QtaW5kZW50YXRpb24vbGliL2F1dG8tZGV0ZWN0LWluZGVudGF0aW9uLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1Q0FBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBQ0Esa0JBQUEsR0FBcUIsT0FBQSxDQUFRLHVCQUFSLENBRHJCLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixNQUFBLElBQUMsQ0FBQSxXQUFELEdBQWUsR0FBQSxDQUFBLG1CQUFmLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFmLENBQWtDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE1BQUQsR0FBQTtpQkFDakQsS0FBQyxDQUFBLFdBQUQsQ0FBYSxNQUFiLEVBRGlEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEMsQ0FBakIsQ0FEQSxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUFzQyxtREFBdEMsRUFBMkYsSUFBQyxDQUFBLHlCQUE1RixDQUFqQixDQUhBLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxtQkFBRCxHQUF1QixJQUx2QixDQUFBO2FBTUEsSUFBQyxDQUFBLHFCQUFELEdBQXlCLEtBUGpCO0lBQUEsQ0FBVjtBQUFBLElBU0EsV0FBQSxFQUFhLFNBQUMsTUFBRCxHQUFB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

//# sourceURL=/Users/vitaminafront/.atom/packages/auto-detect-indentation/lib/auto-detect-indentation.coffee
