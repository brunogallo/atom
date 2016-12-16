
/* global
atom
 */

(function() {
  var CompositeDisposable, Disposable, Point, QolorView, Range, md5, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require('atom'), Disposable = _ref.Disposable, CompositeDisposable = _ref.CompositeDisposable, Point = _ref.Point, Range = _ref.Range;

  md5 = require('md5');

  QolorView = (function(_super) {
    __extends(QolorView, _super);

    function QolorView() {
      return QolorView.__super__.constructor.apply(this, arguments);
    }

    QolorView.prototype.aliasesForEditor = {};

    QolorView.prototype.markersForEditor = {};

    QolorView.prototype.markers = [];

    QolorView.prototype.initialize = function() {
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var disposable;
          disposable = editor.onDidStopChanging(function() {
            var _ref1, _ref2;
            _this.testMode = (_ref1 = editor.buffer) != null ? (_ref2 = _ref1.file) != null ? _ref2.path.includes('qolor/spec/fixtures/') : void 0 : void 0;
            return _this.update(editor);
          });
          _this.subscriptions.add(disposable);
          editor.onDidDestroy(function() {
            return disposable.dispose();
          });
          _this.subscriptions.add(editor.onDidChangeGrammar(function() {
            return _this.update(editor);
          }));
          _this.subscriptions.add(atom.config.onDidChange('qolor.fourBorders', function() {
            return _this.update(editor);
          }));
          return _this.update(editor);
        };
      })(this)));
    };

    QolorView.prototype.clearAllMarkers = function() {
      var marker, _i, _len, _ref1;
      _ref1 = this.markers;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        marker = _ref1[_i];
        marker.destroy();
      }
      this.markersForEditor = {};
      this.aliasesForEditor = {};
      return this.markers = [];
    };

    QolorView.prototype.clearMarkers = function(editor) {
      var marker, _i, _len, _ref1;
      if (this.markersForEditor[editor.id]) {
        _ref1 = this.markersForEditor[editor.id];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          marker = _ref1[_i];
          marker.destroy();
        }
      }
      this.markersForEditor[editor.id] = [];
      return this.aliasesForEditor[editor.id] = {};
    };

    QolorView.prototype.turnOff = function() {
      var _ref1;
      this.clearAllMarkers();
      return (_ref1 = this.subscriptions) != null ? _ref1.dispose() : void 0;
    };

    QolorView.prototype.destroy = function() {
      return this.turnOff();
    };

    QolorView.prototype.toggle = function() {
      if (this.markers.length) {
        return this.turnOff();
      } else {
        return this.initialize();
      }
    };

    QolorView.prototype.update = function(editor) {
      var addStyle, afterAsClause, aliasesTraverser, decorateAlias, decorateNext, decorateTable, editorView, getClass, getColor, grammar, justDecorated, parseTable, registerAlias, tablesTraverser, text, traverser, _ref1;
      grammar = editor.getGrammar();
      if ((_ref1 = grammar.scopeName) !== 'source.sql' && _ref1 !== 'source.sql.mustache') {
        this.clearMarkers(editor);
        return;
      }
      this.clearMarkers(editor);
      text = editor.getText();
      editorView = atom.views.getView(editor);
      getClass = function(name) {
        return ("qolor-name-" + name).replace(/#/g, '__hash__');
      };
      getColor = function(name) {
        return md5(name).slice(0, 6);
      };
      addStyle = function(name, className, color) {
        var borderStyle, styleNode;
        styleNode = document.createElement('style');
        styleNode.type = 'text/css';
        borderStyle = "border-bottom: 4px solid #" + color + ";";
        if (atom.config.get('qolor.fourBorders')) {
          borderStyle = "border: 2px solid #" + color + ";";
        }
        styleNode.innerHTML = ".highlight." + className + " .region {\n    /* reset the values: */\n    border: none;\n    border-bottom: none;\n    /* apply new one: */\n    " + borderStyle + "\n}";
        editorView.stylesElement.appendChild(styleNode);
        return new Disposable(function() {
          styleNode.parentNode.removeChild(styleNode);
          return styleNode = null;
        });
      };
      registerAlias = (function(_this) {
        return function(tableName, alias) {
          if (alias.match(/.*\(.*\).*/)) {
            return;
          }
          if (!_this.aliasesForEditor[editor.id]) {
            _this.aliasesForEditor[editor.id] = {};
          }
          return _this.aliasesForEditor[editor.id][alias] = tableName;
        };
      })(this);
      parseTable = function(tokenValue) {
        var alias, hasBrackets, leading, matches, middle, parsedTable, tableName, trailing, _ref2;
        if (tokenValue.includes('[')) {
          hasBrackets = true;
          matches = tokenValue.match(/^(\s*)\[(\S*)\](\s*)(\S*)(\s*)$/);
        } else {
          matches = tokenValue.match(/^(\s*)(\S*)(\s*)(\S*)(\s*)$/);
        }
        if (!matches) {
          parsedTable = {
            leading: '',
            tableName: '',
            middle: '',
            alias: '',
            trailing: ''
          };
        } else {
          _ref2 = matches != null ? matches.slice(1, 6) : void 0, leading = _ref2[0], tableName = _ref2[1], middle = _ref2[2], alias = _ref2[3], trailing = _ref2[4];
          parsedTable = {
            leading: leading,
            tableName: tableName,
            middle: middle,
            alias: alias,
            trailing: trailing
          };
        }
        if (parsedTable.alias.match(/.*\(.*\).*/)) {
          parsedTable.alias = '';
        }
        parsedTable.hasBrackets = hasBrackets;
        return parsedTable;
      };
      decorateTable = (function(_this) {
        return function(lineNum, tokenPos, parsedTable) {
          var alias, className, color, finish, leading, middle, start, tableName;
          leading = parsedTable.leading, tableName = parsedTable.tableName, middle = parsedTable.middle, alias = parsedTable.alias;
          className = getClass(tableName);
          color = getColor(tableName);
          _this.subscriptions.add(addStyle(tableName, className, color));
          start = new Point(lineNum, tokenPos + leading.length);
          finish = new Point(lineNum, tokenPos + leading.length + tableName.length + (alias ? middle.length + alias.length : 0) + (parsedTable.hasBrackets ? 2 : 0));
          return [editor.markBufferRange(new Range(start, finish)), className];
        };
      })(this);
      decorateAlias = (function(_this) {
        return function(token, lineNum, tokenPos, afterAsClause) {
          var className, lengthDiff, originalTokenLength, tokenValue, tokenValueLeft;
          if (afterAsClause == null) {
            afterAsClause = false;
          }
          tokenValueLeft = token.value.trimLeft().toLowerCase();
          originalTokenLength = token.value.length;
          lengthDiff = originalTokenLength - tokenValueLeft.length;
          tokenValue = token.value.trim().toLowerCase();
          if (!_this.aliasesForEditor[editor.id][tokenValue]) {
            return [null, null];
          }
          className = getClass(_this.aliasesForEditor[editor.id][tokenValue]);
          return [
            editor.markBufferRange(new Range(new Point(lineNum, tokenPos + (afterAsClause != null ? afterAsClause : {
              lengthDiff: 0
            })), new Point(lineNum, tokenPos + originalTokenLength))), className
          ];
        };
      })(this);
      afterAsClause = false;
      decorateNext = false;
      justDecorated = '';
      tablesTraverser = (function(_this) {
        return function(token, lineNum, tokenPos) {
          var aliasReturn, parsedTable, shouldDecorateNext, tokenValue;
          shouldDecorateNext = function(tokenValue) {
            var _ref2;
            return (_ref2 = tokenValue.split(' ').slice(-1)[0]) === 'from' || _ref2 === 'join' || _ref2 === 'into';
          };
          tokenValue = token.value.trim().toLowerCase();
          if (justDecorated) {
            if (__indexOf.call(token.scopes, 'keyword.other.alias.sql') >= 0) {
              afterAsClause = true;
            } else if (token.scopes.length > 1) {
              decorateNext = shouldDecorateNext(tokenValue);
              registerAlias(justDecorated, justDecorated);
              aliasReturn = [null, null];
            } else if (tokenValue) {
              registerAlias(justDecorated, tokenValue);
              aliasReturn = decorateAlias(token, lineNum, tokenPos, afterAsClause);
            }
            if (!afterAsClause) {
              justDecorated = '';
            }
            return aliasReturn || [null, null];
          }
          if (decorateNext) {
            if (tokenValue === '' || tokenValue === '#' || tokenValue === '.') {
              return [null, null];
            } else if (__indexOf.call(token.scopes, 'constant.other.database-name.sql') >= 0) {
              return [null, null];
            } else {
              decorateNext = false;
              tokenValue = token.value.toLowerCase();
              parsedTable = parseTable(tokenValue);
              if (_this.testMode) {
                console.table([
                  {
                    token: tokenValue,
                    leading: parsedTable.leading,
                    tableName: parsedTable.tableName,
                    middle: parsedTable.middle,
                    alias: parsedTable.alias,
                    trailing: parsedTable.trailing,
                    hasBrackets: parsedTable.hasBrackets
                  }
                ]);
              }
              if (parsedTable.alias.trim() !== '') {
                registerAlias(parsedTable.tableName, parsedTable.alias);
              } else {
                justDecorated = parsedTable.tableName;
              }
              return decorateTable(lineNum, tokenPos, parsedTable);
            }
          }
          return decorateNext = shouldDecorateNext(tokenValue);
        };
      })(this);
      aliasesTraverser = function(token, lineNum, tokenPos) {
        if (__indexOf.call(token.scopes, 'constant.other.database-name.sql') >= 0) {
          return decorateAlias(token, lineNum, tokenPos);
        } else {
          return [null, null];
        }
      };
      traverser = (function(_this) {
        return function(methods) {
          var className, line, lineNum, marker, method, token, tokenPos, tokenizedLines, _i, _len, _results;
          tokenizedLines = grammar.tokenizeLines(text);
          _results = [];
          for (_i = 0, _len = methods.length; _i < _len; _i++) {
            method = methods[_i];
            _results.push((function() {
              var _j, _len1, _results1;
              _results1 = [];
              for (lineNum = _j = 0, _len1 = tokenizedLines.length; _j < _len1; lineNum = ++_j) {
                line = tokenizedLines[lineNum];
                tokenPos = 0;
                _results1.push((function() {
                  var _k, _len2, _ref2, _results2;
                  _results2 = [];
                  for (_k = 0, _len2 = line.length; _k < _len2; _k++) {
                    token = line[_k];
                    _ref2 = method(token, lineNum, tokenPos), marker = _ref2[0], className = _ref2[1];
                    tokenPos += token.value.length;
                    if (!marker) {
                      continue;
                    }
                    this.markers.push(marker);
                    this.markersForEditor[editor.id].push(marker);
                    _results2.push(editor.decorateMarker(marker, {
                      isQolor: true,
                      type: 'highlight',
                      "class": className
                    }));
                  }
                  return _results2;
                }).call(this));
              }
              return _results1;
            }).call(_this));
          }
          return _results;
        };
      })(this);
      return traverser([tablesTraverser, aliasesTraverser]);
    };

    return QolorView;

  })(HTMLElement);

  module.exports = document.registerElement('qolor-view', {
    prototype: QolorView.prototype,
    "extends": 'div'
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpdGFtaW5hZnJvbnQvLmF0b20vcGFja2FnZXMvcW9sb3IvbGliL3FvbG9yLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQTs7R0FBQTtBQUFBO0FBQUE7QUFBQSxNQUFBLG1FQUFBO0lBQUE7O3lKQUFBOztBQUFBLEVBR0EsT0FBa0QsT0FBQSxDQUFRLE1BQVIsQ0FBbEQsRUFBQyxrQkFBQSxVQUFELEVBQWEsMkJBQUEsbUJBQWIsRUFBa0MsYUFBQSxLQUFsQyxFQUF5QyxhQUFBLEtBSHpDLENBQUE7O0FBQUEsRUFJQSxHQUFBLEdBQU0sT0FBQSxDQUFRLEtBQVIsQ0FKTixDQUFBOztBQUFBLEVBTU07QUFFRixnQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsd0JBQUEsZ0JBQUEsR0FBa0IsRUFBbEIsQ0FBQTs7QUFBQSx3QkFDQSxnQkFBQSxHQUFrQixFQURsQixDQUFBOztBQUFBLHdCQUVBLE9BQUEsR0FBUyxFQUZULENBQUE7O0FBQUEsd0JBS0EsVUFBQSxHQUFZLFNBQUEsR0FBQTtBQUNSLE1BQUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUFqQixDQUFBO2FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsTUFBRCxHQUFBO0FBQ2pELGNBQUEsVUFBQTtBQUFBLFVBQUEsVUFBQSxHQUFhLE1BQU0sQ0FBQyxpQkFBUCxDQUF5QixTQUFBLEdBQUE7QUFDbEMsZ0JBQUEsWUFBQTtBQUFBLFlBQUEsS0FBQyxDQUFBLFFBQUQseUVBRVUsQ0FBRSxJQUFJLENBQUMsUUFGTCxDQUVjLHNCQUZkLG1CQUFaLENBQUE7bUJBR0EsS0FBQyxDQUFBLE1BQUQsQ0FBUSxNQUFS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

//# sourceURL=/Users/vitaminafront/.atom/packages/qolor/lib/qolor-view.coffee
