
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
      var addStyle, aliasesTraverser, decorateAlias, decorateNext, decorateTable, editorView, getClass, getColor, grammar, justDecorated, parseTable, registerAlias, tablesTraverser, text, traverser, _ref1;
      grammar = editor.getGrammar();
      if ((_ref1 = grammar.scopeName) !== 'source.sql' && _ref1 !== 'source.sql.mustache') {
        this.clearMarkers(editor);
        return;
      }
      this.clearMarkers(editor);
      text = editor.getText();
      editorView = atom.views.getView(editor);
      getClass = function(name) {
        return "qolor-name-" + name;
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
          return [
            editor.markBufferRange(new Range(start, finish), {
              type: 'qolor'
            }), className
          ];
        };
      })(this);
      decorateAlias = (function(_this) {
        return function(token, lineNum, tokenPos) {
          var className, originalTokenLength, tokenValue;
          tokenValue = token.value.trim().toLowerCase();
          originalTokenLength = token.value.length;
          if (!_this.aliasesForEditor[editor.id][tokenValue]) {
            return [null, null];
          }
          className = getClass(_this.aliasesForEditor[editor.id][tokenValue]);
          return [
            editor.markBufferRange(new Range(new Point(lineNum, tokenPos), new Point(lineNum, tokenPos + originalTokenLength)), {
              type: 'qolor'
            }), className
          ];
        };
      })(this);
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
            if (token.scopes.length > 1) {
              decorateNext = shouldDecorateNext(tokenValue);
              registerAlias(justDecorated, justDecorated);
              aliasReturn = [null, null];
            } else if (tokenValue) {
              registerAlias(justDecorated, tokenValue);
              aliasReturn = decorateAlias(token, lineNum, tokenPos);
            }
            justDecorated = '';
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
