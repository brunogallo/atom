(function() {
  var CompositeDisposable;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    subscriptions: null,
    activate: function() {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-text-editor', {
        'multi-cursor-plus:mark': (function(_this) {
          return function() {
            return _this.mark();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-text-editor', {
        'multi-cursor-plus:move-up': (function(_this) {
          return function() {
            return _this.moveUp();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-text-editor', {
        'multi-cursor-plus:move-down': (function(_this) {
          return function() {
            return _this.moveDown();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-text-editor', {
        'multi-cursor-plus:move-left': (function(_this) {
          return function() {
            return _this.moveLeft();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-text-editor', {
        'multi-cursor-plus:move-right': (function(_this) {
          return function() {
            return _this.moveRight();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-text-editor', {
        'multi-cursor-plus:move-to-beginning-of-word': (function(_this) {
          return function() {
            return _this.moveToBeginningOfWord();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-text-editor', {
        'multi-cursor-plus:move-to-end-of-word': (function(_this) {
          return function() {
            return _this.moveToEndOfWord();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-text-editor', {
        'multi-cursor-plus:move-to-first-character-of-line': (function(_this) {
          return function() {
            return _this.moveToFirstCharacterOfLine();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-text-editor', {
        'multi-cursor-plus:move-to-end-of-line': (function(_this) {
          return function() {
            return _this.moveToEndOfLine();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-text-editor', {
        'multi-cursor-plus:move-to-top': (function(_this) {
          return function() {
            return _this.moveToTop();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-text-editor', {
        'multi-cursor-plus:move-to-bottom': (function(_this) {
          return function() {
            return _this.moveToBottom();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-text-editor', {
        'multi-cursor-plus:select-up': (function(_this) {
          return function() {
            return _this.selectUp();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-text-editor', {
        'multi-cursor-plus:select-down': (function(_this) {
          return function() {
            return _this.selectDown();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-text-editor', {
        'multi-cursor-plus:select-left': (function(_this) {
          return function() {
            return _this.selectLeft();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-text-editor', {
        'multi-cursor-plus:select-right': (function(_this) {
          return function() {
            return _this.selectRight();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-text-editor', {
        'multi-cursor-plus:select-to-beginning-of-word': (function(_this) {
          return function() {
            return _this.selectToBeginningOfWord();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-text-editor', {
        'multi-cursor-plus:select-to-end-of-word': (function(_this) {
          return function() {
            return _this.selectToEndOfWord();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-text-editor', {
        'multi-cursor-plus:select-to-first-character-of-line': (function(_this) {
          return function() {
            return _this.selectToFirstCharacterOfLine();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-text-editor', {
        'multi-cursor-plus:select-to-end-of-line': (function(_this) {
          return function() {
            return _this.selectToEndOfLine();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-text-editor', {
        'multi-cursor-plus:select-to-top': (function(_this) {
          return function() {
            return _this.selectToTop();
          };
        })(this)
      }));
      return this.subscriptions.add(atom.commands.add('atom-text-editor', {
        'multi-cursor-plus:select-to-bottom': (function(_this) {
          return function() {
            return _this.selectToBottom();
          };
        })(this)
      }));
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    getCursor: function() {
      var _ref;
      return (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getLastCursor() : void 0;
    },
    getSelection: function() {
      var _ref;
      return (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getLastSelection() : void 0;
    },
    mark: function() {
      var beginningHasCursor, column, destroyedSelection, editor, lastColumn, lastCursor, lastRow, lastSelection, range, row, selection, selectionRange, _i, _len, _ref;
      editor = atom.workspace.getActiveTextEditor();
      lastSelection = this.getSelection();
      lastCursor = this.getCursor();
      if (!editor || !lastSelection || !lastCursor) {
        return;
      }
      range = lastSelection.getBufferRange();
      row = lastCursor.getBufferRow();
      column = lastCursor.getBufferColumn();
      destroyedSelection = false;
      beginningHasCursor = false;
      _ref = editor.getSelections();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        selection = _ref[_i];
        selectionRange = selection.getBufferRange();
        if (selectionRange.start.row === 0 && selectionRange.start.column === 0) {
          beginningHasCursor = true;
        }
        if (selection === lastSelection) {
          continue;
        } else if (selection.intersectsWith(lastSelection)) {
          selection.destroy();
          destroyedSelection = true;
        }
      }
      if (destroyedSelection) {
        return;
      }
      editor.markBufferRange([[range.start.row, range.start.column], [range.end.row, range.end.column]], {
        type: 'selection',
        invalidate: 'never'
      });
      if (beginningHasCursor) {
        lastRow = editor.getLastBufferRow();
        lastColumn = editor.lineTextForBufferRow(lastRow).length;
        editor.addCursorAtBufferPosition([lastRow, lastColumn]);
      } else {
        editor.addCursorAtBufferPosition([0, 0]);
      }
      return editor.getLastSelection().cursor.setBufferPosition([row, column]);
    },
    moveUp: function() {
      var _ref;
      return (_ref = this.getCursor()) != null ? _ref.moveUp() : void 0;
    },
    moveDown: function() {
      var _ref;
      return (_ref = this.getCursor()) != null ? _ref.moveDown() : void 0;
    },
    moveLeft: function() {
      var _ref;
      return (_ref = this.getCursor()) != null ? _ref.moveLeft() : void 0;
    },
    moveRight: function() {
      var _ref;
      return (_ref = this.getCursor()) != null ? _ref.moveRight() : void 0;
    },
    moveToBeginningOfWord: function() {
      var _ref;
      return (_ref = this.getCursor()) != null ? _ref.moveToBeginningOfWord() : void 0;
    },
    moveToEndOfWord: function() {
      var _ref;
      return (_ref = this.getCursor()) != null ? _ref.moveToEndOfWord() : void 0;
    },
    moveToFirstCharacterOfLine: function() {
      var _ref;
      return (_ref = this.getCursor()) != null ? _ref.moveToFirstCharacterOfLine() : void 0;
    },
    moveToEndOfLine: function() {
      var _ref;
      return (_ref = this.getCursor()) != null ? _ref.moveToEndOfLine() : void 0;
    },
    moveToTop: function() {
      var _ref;
      return (_ref = this.getCursor()) != null ? _ref.moveToTop() : void 0;
    },
    moveToBottom: function() {
      var _ref;
      return (_ref = this.getCursor()) != null ? _ref.moveToBottom() : void 0;
    },
    selectUp: function() {
      var _ref;
      return (_ref = this.getSelection()) != null ? _ref.selectUp() : void 0;
    },
    selectDown: function() {
      var _ref;
      return (_ref = this.getSelection()) != null ? _ref.selectDown() : void 0;
    },
    selectLeft: function() {
      var _ref;
      return (_ref = this.getSelection()) != null ? _ref.selectLeft() : void 0;
    },
    selectRight: function() {
      var _ref;
      return (_ref = this.getSelection()) != null ? _ref.selectRight() : void 0;
    },
    selectToBeginningOfWord: function() {
      var _ref;
      return (_ref = this.getSelection()) != null ? _ref.selectToBeginningOfWord() : void 0;
    },
    selectToEndOfWord: function() {
      var _ref;
      return (_ref = this.getSelection()) != null ? _ref.selectToEndOfWord() : void 0;
    },
    selectToFirstCharacterOfLine: function() {
      var _ref;
      return (_ref = this.getSelection()) != null ? _ref.selectToFirstCharacterOfLine() : void 0;
    },
    selectToEndOfLine: function() {
      var _ref;
      return (_ref = this.getSelection()) != null ? _ref.selectToEndOfLine() : void 0;
    },
    selectToTop: function() {
      var _ref;
      return (_ref = this.getSelection()) != null ? _ref.selectToTop() : void 0;
    },
    selectToBottom: function() {
      var _ref;
      return (_ref = this.getSelection()) != null ? _ref.selectToBottom() : void 0;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpdGFtaW5hZnJvbnQvLmF0b20vcGFja2FnZXMvbXVsdGktY3Vyc29yLXBsdXMvbGliL211bHRpLWN1cnNvci1wbHVzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtQkFBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsYUFBQSxFQUFlLElBQWY7QUFBQSxJQUtBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDUixNQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFBakIsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFDakI7QUFBQSxRQUFBLHdCQUFBLEVBQTBCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUN4QixLQUFDLENBQUEsSUFBRCxDQUFBLEVBRHdCO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBMUI7T0FEaUIsQ0FBbkIsQ0FIQSxDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUNqQjtBQUFBLFFBQUEsMkJBQUEsRUFBNkIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQzNCLEtBQUMsQ0FBQSxNQUFELENBQUEsRUFEMkI7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE3QjtPQURpQixDQUFuQixDQU5BLENBQUE7QUFBQSxNQVNBLElBQUMsQ0FBQSxh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

//# sourceURL=/Users/vitaminafront/.atom/packages/multi-cursor-plus/lib/multi-cursor-plus.coffee
