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
      if ((_ref = editor.displayBuffer) != null ? _ref.onDidTokenize : void 0) {
        onTokenizeDisposable = editor.displayBuffer.onDidTokenize((function(_this) {
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
