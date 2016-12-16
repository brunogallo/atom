(function() {
  var CSON, ColorTabsRegex, CompositeDisposable, colorFile, colors, matchers, minimatch, minimatchOptions, processPath, sep;

  CompositeDisposable = require('atom').CompositeDisposable;

  CSON = require('season');

  sep = require("path").sep;

  colorFile = atom.getConfigDirPath() + ("" + sep + "color-tabs-regex.cson");

  colors = {};

  processPath = null;

  minimatch = require('minimatch');

  minimatchOptions = {
    matchBase: true
  };

  matchers = {
    minimatch: function(path, regex) {
      return minimatch(path, regex, minimatchOptions);
    },
    'String.match': function(path, regex) {
      return path.match(regex);
    }
  };

  module.exports = ColorTabsRegex = {
    config: {
      breakAfterFirstMatch: {
        type: 'boolean',
        "default": false
      },
      regexEngine: {
        title: "Regex engine",
        type: "string",
        "default": "minimatch",
        "enum": Object.keys(matchers)
      }
    },
    activate: function(state) {
      var cb;
      console.log("[color-tabs-regex] activate.");
      if (this.disposables == null) {
        this.disposables = new CompositeDisposable;
        cb = this.processAllTabs.bind(this);
        this.disposables.add(atom.workspace.onDidAddTextEditor((function(_this) {
          return function() {
            return setTimeout(cb, 10);
          };
        })(this)));
        this.disposables.add(atom.workspace.onDidDestroyPaneItem((function(_this) {
          return function() {
            return setTimeout(cb, 10);
          };
        })(this)));
        this.disposables.add(atom.commands.add('atom-workspace', {
          'color-tabs-regex:edit-rules': (function(_this) {
            return function() {
              return _this.editRules(cb);
            };
          })(this)
        }));
        this.disposables.add(atom.config.observe("color-tabs-regex.breakAfterFirstMatch", cb));
        this.disposables.add(atom.config.observe("color-tabs-regex.regexEngine", cb));
        return atom.workspace.observeTextEditors((function(_this) {
          return function(editor) {
            if (editor.getPath() === colorFile) {
              return _this.addSaveCb(editor, cb);
            }
          };
        })(this));
      }
    },
    addSaveCb: function(editor, cb) {
      return this.disposables.add(editor.onDidSave((function(_this) {
        return function() {
          return setTimeout(cb, 10);
        };
      })(this)));
    },
    editRules: function(cb) {
      atom.open({
        pathsToOpen: colorFile
      });
      return atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          if (editor.getPath() === colorFile) {
            return _this.addSaveCb(editor, cb);
          }
        };
      })(this));
    },
    deactivate: function() {
      return this.disposables.dispose();
    },
    consumeChangeColor: function(changeColor) {
      return processPath = changeColor;
    },
    expandRules: function(rules, prefix, output) {
      var rule;
      output = output || [];
      prefix = prefix || "";
      for (rule in rules) {
        if (typeof rules[rule] === "string") {
          output[prefix + rule] = rules[rule];
        } else {
          output = this.expandRules(rules[rule], prefix + rule, output);
        }
      }
      return output;
    },
    processAllTabs: function() {
      var breaks, colored, matcher, processRules;
      breaks = atom.config.get("color-tabs-regex.breakAfterFirstMatch");
      matcher = atom.config.get("color-tabs-regex.regexEngine");
      processRules = this.expandRules.bind(this);
      colored = [];
      return CSON.readFile(colorFile, (function(_this) {
        return function(err, content) {
          var color, count, error, paneItem, paneItems, path, re, rules, _i, _len, _results;
          if (!err) {
            rules = processRules(content);
            count = Object.keys(rules).length;
            if (Object.keys(colors).length !== count) {
              console.log("[color-tabs-regex] defined rules: " + count);
            }
            colors = rules;
            paneItems = atom.workspace.getPaneItems();
            _results = [];
            for (_i = 0, _len = paneItems.length; _i < _len; _i++) {
              paneItem = paneItems[_i];
              if (paneItem.getPath != null) {
                path = paneItem.getPath();
                processPath(path, false, false);
                if (path) {
                  _results.push((function() {
                    var _results1;
                    _results1 = [];
                    for (re in colors) {
                      try {
                        if (matchers[matcher](path, re)) {
                          color = colors[re];
                          if (breaks) {
                            if (colored.indexOf(path) === -1) {
                              colored.push(path);
                            } else {
                              continue;
                            }
                          }
                          console.log("[color-tabs-regex] " + path + " -> " + color + " matched by '" + re + "'");
                          _results1.push(processPath(path, color, false));
                        } else {
                          _results1.push(void 0);
                        }
                      } catch (_error) {
                        error = _error;
                        _results1.push(console.error("[color-tabs-regex] " + error));
                      }
                    }
                    return _results1;
                  })());
                } else {
                  _results.push(void 0);
                }
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          } else {
            return console.error(err);
          }
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpdGFtaW5hZnJvbnQvLmF0b20vcGFja2FnZXMvY29sb3ItdGFicy1yZWdleC9saWIvY29sb3ItdGFicy1yZWdleC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEscUhBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxHQUFBLEdBQU0sT0FBQSxDQUFRLE1BQVIsQ0FBZSxDQUFDLEdBRnRCLENBQUE7O0FBQUEsRUFHQSxTQUFBLEdBQVksSUFBSSxDQUFDLGdCQUFMLENBQUEsQ0FBQSxHQUF3QixDQUFBLEVBQUEsR0FBRyxHQUFILEdBQU8sdUJBQVAsQ0FIcEMsQ0FBQTs7QUFBQSxFQUlBLE1BQUEsR0FBUyxFQUpULENBQUE7O0FBQUEsRUFLQSxXQUFBLEdBQWMsSUFMZCxDQUFBOztBQUFBLEVBT0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSxXQUFSLENBUFosQ0FBQTs7QUFBQSxFQVFBLGdCQUFBLEdBQW1CO0FBQUEsSUFBRSxTQUFBLEVBQVcsSUFBYjtHQVJuQixDQUFBOztBQUFBLEVBVUEsUUFBQSxHQUNFO0FBQUEsSUFBQSxTQUFBLEVBQVcsU0FBQyxJQUFELEVBQU8sS0FBUCxHQUFBO0FBQ1QsYUFBTyxTQUFBLENBQVUsSUFBVixFQUFnQixLQUFoQixFQUF1QixnQkFBdkIsQ0FBUCxDQURTO0lBQUEsQ0FBWDtBQUFBLElBRUEsY0FBQSxFQUFnQixTQUFDLElBQUQsRUFBTyxLQUFQLEdBQUE7QUFDZCxhQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsS0FBWCxDQUFQLENBRGM7SUFBQSxDQUZoQjtHQVhGLENBQUE7O0FBQUEsRUFnQkEsTUFBTSxDQUFDLE9BQVAs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

//# sourceURL=/Users/vitaminafront/.atom/packages/color-tabs-regex/lib/color-tabs-regex.coffee
