(function() {
  var Color, ColorContext, ColorExpression, Emitter, VariablesCollection, nextId, registry, _ref,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = [], Emitter = _ref[0], ColorExpression = _ref[1], ColorContext = _ref[2], Color = _ref[3], registry = _ref[4];

  nextId = 0;

  module.exports = VariablesCollection = (function() {
    VariablesCollection.deserialize = function(state) {
      return new VariablesCollection(state);
    };

    Object.defineProperty(VariablesCollection.prototype, 'length', {
      get: function() {
        return this.variables.length;
      },
      enumerable: true
    });

    function VariablesCollection(state) {
      if (Emitter == null) {
        Emitter = require('atom').Emitter;
      }
      this.emitter = new Emitter;
      this.variables = [];
      this.variableNames = [];
      this.colorVariables = [];
      this.variablesByPath = {};
      this.dependencyGraph = {};
      this.initialize(state != null ? state.content : void 0);
    }

    VariablesCollection.prototype.onDidChange = function(callback) {
      return this.emitter.on('did-change', callback);
    };

    VariablesCollection.prototype.onceInitialized = function(callback) {
      var disposable;
      if (callback == null) {
        return;
      }
      if (this.initialized) {
        return callback();
      } else {
        return disposable = this.emitter.on('did-initialize', function() {
          disposable.dispose();
          return callback();
        });
      }
    };

    VariablesCollection.prototype.initialize = function(content) {
      var iteration;
      if (content == null) {
        content = [];
      }
      iteration = (function(_this) {
        return function(cb) {
          var end, start, v;
          start = new Date;
          end = new Date;
          while (content.length > 0 && end - start < 100) {
            v = content.shift();
            _this.restoreVariable(v);
          }
          if (content.length > 0) {
            return requestAnimationFrame(function() {
              return iteration(cb);
            });
          } else {
            return typeof cb === "function" ? cb() : void 0;
          }
        };
      })(this);
      return iteration((function(_this) {
        return function() {
          _this.initialized = true;
          return _this.emitter.emit('did-initialize');
        };
      })(this));
    };

    VariablesCollection.prototype.getVariables = function() {
      return this.variables.slice();
    };

    VariablesCollection.prototype.getNonColorVariables = function() {
      return this.getVariables().filter(function(v) {
        return !v.isColor;
      });
    };

    VariablesCollection.prototype.getVariablesForPath = function(path) {
      var _ref1;
      return (_ref1 = this.variablesByPath[path]) != null ? _ref1 : [];
    };

    VariablesCollection.prototype.getVariableByName = function(name) {
      return this.collectVariablesByName([name]).pop();
    };

    VariablesCollection.prototype.getVariableById = function(id) {
      var v, _i, _len, _ref1;
      _ref1 = this.variables;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        v = _ref1[_i];
        if (v.id === id) {
          return v;
        }
      }
    };

    VariablesCollection.prototype.getVariablesForPaths = function(paths) {
      var p, res, _i, _len;
      res = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        p = paths[_i];
        if (p in this.variablesByPath) {
          res = res.concat(this.variablesByPath[p]);
        }
      }
      return res;
    };

    VariablesCollection.prototype.getColorVariables = function() {
      return this.colorVariables.slice();
    };

    VariablesCollection.prototype.find = function(properties) {
      var _ref1;
      return (_ref1 = this.findAll(properties)) != null ? _ref1[0] : void 0;
    };

    VariablesCollection.prototype.findAll = function(properties) {
      var keys;
      if (properties == null) {
        properties = {};
      }
      keys = Object.keys(properties);
      if (keys.length === 0) {
        return null;
      }
      return this.variables.filter(function(v) {
        return keys.every(function(k) {
          var a, b, _ref1;
          if (((_ref1 = v[k]) != null ? _ref1.isEqual : void 0) != null) {
            return v[k].isEqual(properties[k]);
          } else if (Array.isArray(b = properties[k])) {
            a = v[k];
            return a.length === b.length && a.every(function(value) {
              return __indexOf.call(b, value) >= 0;
            });
          } else {
            return v[k] === properties[k];
          }
        });
      });
    };

    VariablesCollection.prototype.updateCollection = function(collection, paths) {
      var created, destroyed, path, pathsCollection, pathsToDestroy, remainingPaths, results, updated, v, _i, _j, _k, _len, _len1, _len2, _name, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
      pathsCollection = {};
      remainingPaths = [];
      for (_i = 0, _len = collection.length; _i < _len; _i++) {
        v = collection[_i];
        if (pathsCollection[_name = v.path] == null) {
          pathsCollection[_name] = [];
        }
        pathsCollection[v.path].push(v);
        if (_ref1 = v.path, __indexOf.call(remainingPaths, _ref1) < 0) {
          remainingPaths.push(v.path);
        }
      }
      results = {
        created: [],
        destroyed: [],
        updated: []
      };
      for (path in pathsCollection) {
        collection = pathsCollection[path];
        _ref2 = this.updatePathCollection(path, collection, true) || {}, created = _ref2.created, updated = _ref2.updated, destroyed = _ref2.destroyed;
        if (created != null) {
          results.created = results.created.concat(created);
        }
        if (updated != null) {
          results.updated = results.updated.concat(updated);
        }
        if (destroyed != null) {
          results.destroyed = results.destroyed.concat(destroyed);
        }
      }
      if (paths != null) {
        pathsToDestroy = collection.length === 0 ? paths : paths.filter(function(p) {
          return __indexOf.call(remainingPaths, p) < 0;
        });
        for (_j = 0, _len1 = pathsToDestroy.length; _j < _len1; _j++) {
          path = pathsToDestroy[_j];
          _ref3 = this.updatePathCollection(path, collection, true) || {}, created = _ref3.created, updated = _ref3.updated, destroyed = _ref3.destroyed;
          if (created != null) {
            results.created = results.created.concat(created);
          }
          if (updated != null) {
            results.updated = results.updated.concat(updated);
          }
          if (destroyed != null) {
            results.destroyed = results.destroyed.concat(destroyed);
          }
        }
      }
      results = this.updateDependencies(results);
      if (((_ref4 = results.created) != null ? _ref4.length : void 0) === 0) {
        delete results.created;
      }
      if (((_ref5 = results.updated) != null ? _ref5.length : void 0) === 0) {
        delete results.updated;
      }
      if (((_ref6 = results.destroyed) != null ? _ref6.length : void 0) === 0) {
        delete results.destroyed;
      }
      if (results.destroyed != null) {
        _ref7 = results.destroyed;
        for (_k = 0, _len2 = _ref7.length; _k < _len2; _k++) {
          v = _ref7[_k];
          this.deleteVariableReferences(v);
        }
      }
      return this.emitChangeEvent(results);
    };

    VariablesCollection.prototype.updatePathCollection = function(path, collection, batch) {
      var destroyed, pathCollection, results, status, v, _i, _j, _len, _len1;
      if (batch == null) {
        batch = false;
      }
      pathCollection = this.variablesByPath[path] || [];
      results = this.addMany(collection, true);
      destroyed = [];
      for (_i = 0, _len = pathCollection.length; _i < _len; _i++) {
        v = pathCollection[_i];
        status = this.getVariableStatusInCollection(v, collection)[0];
        if (status === 'created') {
          destroyed.push(this.remove(v, true));
        }
      }
      if (destroyed.length > 0) {
        results.destroyed = destroyed;
      }
      if (batch) {
        return results;
      } else {
        results = this.updateDependencies(results);
        for (_j = 0, _len1 = destroyed.length; _j < _len1; _j++) {
          v = destroyed[_j];
          this.deleteVariableReferences(v);
        }
        return this.emitChangeEvent(results);
      }
    };

    VariablesCollection.prototype.add = function(variable, batch) {
      var previousVariable, status, _ref1;
      if (batch == null) {
        batch = false;
      }
      _ref1 = this.getVariableStatus(variable), status = _ref1[0], previousVariable = _ref1[1];
      switch (status) {
        case 'moved':
          previousVariable.range = variable.range;
          previousVariable.bufferRange = variable.bufferRange;
          return void 0;
        case 'updated':
          return this.updateVariable(previousVariable, variable, batch);
        case 'created':
          return this.createVariable(variable, batch);
      }
    };

    VariablesCollection.prototype.addMany = function(variables, batch) {
      var res, results, status, v, variable, _i, _len;
      if (batch == null) {
        batch = false;
      }
      results = {};
      for (_i = 0, _len = variables.length; _i < _len; _i++) {
        variable = variables[_i];
        res = this.add(variable, true);
        if (res != null) {
          status = res[0], v = res[1];
          if (results[status] == null) {
            results[status] = [];
          }
          results[status].push(v);
        }
      }
      if (batch) {
        return results;
      } else {
        return this.emitChangeEvent(this.updateDependencies(results));
      }
    };

    VariablesCollection.prototype.remove = function(variable, batch) {
      var results;
      if (batch == null) {
        batch = false;
      }
      variable = this.find(variable);
      if (variable == null) {
        return;
      }
      this.variables = this.variables.filter(function(v) {
        return v !== variable;
      });
      if (variable.isColor) {
        this.colorVariables = this.colorVariables.filter(function(v) {
          return v !== variable;
        });
      }
      if (batch) {
        return variable;
      } else {
        results = this.updateDependencies({
          destroyed: [variable]
        });
        this.deleteVariableReferences(variable);
        return this.emitChangeEvent(results);
      }
    };

    VariablesCollection.prototype.removeMany = function(variables, batch) {
      var destroyed, results, v, variable, _i, _j, _len, _len1;
      if (batch == null) {
        batch = false;
      }
      destroyed = [];
      for (_i = 0, _len = variables.length; _i < _len; _i++) {
        variable = variables[_i];
        destroyed.push(this.remove(variable, true));
      }
      results = {
        destroyed: destroyed
      };
      if (batch) {
        return results;
      } else {
        results = this.updateDependencies(results);
        for (_j = 0, _len1 = destroyed.length; _j < _len1; _j++) {
          v = destroyed[_j];
          if (v != null) {
            this.deleteVariableReferences(v);
          }
        }
        return this.emitChangeEvent(results);
      }
    };

    VariablesCollection.prototype.deleteVariablesForPaths = function(paths) {
      return this.removeMany(this.getVariablesForPaths(paths));
    };

    VariablesCollection.prototype.deleteVariableReferences = function(variable) {
      var a, dependencies;
      dependencies = this.getVariableDependencies(variable);
      a = this.variablesByPath[variable.path];
      a.splice(a.indexOf(variable), 1);
      a = this.variableNames;
      a.splice(a.indexOf(variable.name), 1);
      this.removeDependencies(variable.name, dependencies);
      return delete this.dependencyGraph[variable.name];
    };

    VariablesCollection.prototype.getContext = function() {
      if (ColorContext == null) {
        ColorContext = require('./color-context');
      }
      if (registry == null) {
        registry = require('./color-expressions');
      }
      return new ColorContext({
        variables: this.variables,
        colorVariables: this.colorVariables,
        registry: registry
      });
    };

    VariablesCollection.prototype.evaluateVariables = function(variables, callback) {
      var iteration, remainingVariables, updated;
      updated = [];
      remainingVariables = variables.slice();
      iteration = (function(_this) {
        return function(cb) {
          var end, isColor, start, v, wasColor;
          start = new Date;
          end = new Date;
          while (remainingVariables.length > 0 && end - start < 100) {
            v = remainingVariables.shift();
            wasColor = v.isColor;
            _this.evaluateVariableColor(v, wasColor);
            isColor = v.isColor;
            if (isColor !== wasColor) {
              updated.push(v);
              if (isColor) {
                _this.buildDependencyGraph(v);
              }
              end = new Date;
            }
          }
          if (remainingVariables.length > 0) {
            return requestAnimationFrame(function() {
              return iteration(cb);
            });
          } else {
            return typeof cb === "function" ? cb() : void 0;
          }
        };
      })(this);
      return iteration((function(_this) {
        return function() {
          if (updated.length > 0) {
            _this.emitChangeEvent(_this.updateDependencies({
              updated: updated
            }));
          }
          return typeof callback === "function" ? callback(updated) : void 0;
        };
      })(this));
    };

    VariablesCollection.prototype.updateVariable = function(previousVariable, variable, batch) {
      var added, newDependencies, previousDependencies, removed, _ref1;
      previousDependencies = this.getVariableDependencies(previousVariable);
      previousVariable.value = variable.value;
      previousVariable.range = variable.range;
      previousVariable.bufferRange = variable.bufferRange;
      this.evaluateVariableColor(previousVariable, previousVariable.isColor);
      newDependencies = this.getVariableDependencies(previousVariable);
      _ref1 = this.diffArrays(previousDependencies, newDependencies), removed = _ref1.removed, added = _ref1.added;
      this.removeDependencies(variable.name, removed);
      this.addDependencies(variable.name, added);
      if (batch) {
        return ['updated', previousVariable];
      } else {
        return this.emitChangeEvent(this.updateDependencies({
          updated: [previousVariable]
        }));
      }
    };

    VariablesCollection.prototype.restoreVariable = function(variable) {
      var _base, _name;
      if (Color == null) {
        Color = require('./color');
      }
      this.variableNames.push(variable.name);
      this.variables.push(variable);
      variable.id = nextId++;
      if (variable.isColor) {
        variable.color = new Color(variable.color);
        variable.color.variables = variable.variables;
        this.colorVariables.push(variable);
        delete variable.variables;
      }
      if ((_base = this.variablesByPath)[_name = variable.path] == null) {
        _base[_name] = [];
      }
      this.variablesByPath[variable.path].push(variable);
      return this.buildDependencyGraph(variable);
    };

    VariablesCollection.prototype.createVariable = function(variable, batch) {
      var _base, _name;
      this.variableNames.push(variable.name);
      this.variables.push(variable);
      variable.id = nextId++;
      if ((_base = this.variablesByPath)[_name = variable.path] == null) {
        _base[_name] = [];
      }
      this.variablesByPath[variable.path].push(variable);
      this.evaluateVariableColor(variable);
      this.buildDependencyGraph(variable);
      if (batch) {
        return ['created', variable];
      } else {
        return this.emitChangeEvent(this.updateDependencies({
          created: [variable]
        }));
      }
    };

    VariablesCollection.prototype.evaluateVariableColor = function(variable, wasColor) {
      var color, context;
      if (wasColor == null) {
        wasColor = false;
      }
      context = this.getContext();
      color = context.readColor(variable.value, true);
      if (color != null) {
        if (wasColor && color.isEqual(variable.color)) {
          return false;
        }
        variable.color = color;
        variable.isColor = true;
        if (__indexOf.call(this.colorVariables, variable) < 0) {
          this.colorVariables.push(variable);
        }
        return true;
      } else if (wasColor) {
        delete variable.color;
        variable.isColor = false;
        this.colorVariables = this.colorVariables.filter(function(v) {
          return v !== variable;
        });
        return true;
      }
    };

    VariablesCollection.prototype.getVariableStatus = function(variable) {
      if (this.variablesByPath[variable.path] == null) {
        return ['created', variable];
      }
      return this.getVariableStatusInCollection(variable, this.variablesByPath[variable.path]);
    };

    VariablesCollection.prototype.getVariableStatusInCollection = function(variable, collection) {
      var status, v, _i, _len;
      for (_i = 0, _len = collection.length; _i < _len; _i++) {
        v = collection[_i];
        status = this.compareVariables(v, variable);
        switch (status) {
          case 'identical':
            return ['unchanged', v];
          case 'move':
            return ['moved', v];
          case 'update':
            return ['updated', v];
        }
      }
      return ['created', variable];
    };

    VariablesCollection.prototype.compareVariables = function(v1, v2) {
      var sameLine, sameName, sameRange, sameValue;
      sameName = v1.name === v2.name;
      sameValue = v1.value === v2.value;
      sameLine = v1.line === v2.line;
      sameRange = v1.range[0] === v2.range[0] && v1.range[1] === v2.range[1];
      if ((v1.bufferRange != null) && (v2.bufferRange != null)) {
        sameRange && (sameRange = v1.bufferRange.isEqual(v2.bufferRange));
      }
      if (sameName && sameValue) {
        if (sameRange) {
          return 'identical';
        } else {
          return 'move';
        }
      } else if (sameName) {
        if (sameRange || sameLine) {
          return 'update';
        } else {
          return 'different';
        }
      }
    };

    VariablesCollection.prototype.buildDependencyGraph = function(variable) {
      var a, dependencies, dependency, _base, _i, _len, _ref1, _results;
      dependencies = this.getVariableDependencies(variable);
      _results = [];
      for (_i = 0, _len = dependencies.length; _i < _len; _i++) {
        dependency = dependencies[_i];
        a = (_base = this.dependencyGraph)[dependency] != null ? _base[dependency] : _base[dependency] = [];
        if (_ref1 = variable.name, __indexOf.call(a, _ref1) < 0) {
          _results.push(a.push(variable.name));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    VariablesCollection.prototype.getVariableDependencies = function(variable) {
      var dependencies, v, variables, _i, _len, _ref1, _ref2, _ref3;
      dependencies = [];
      if (_ref1 = variable.value, __indexOf.call(this.variableNames, _ref1) >= 0) {
        dependencies.push(variable.value);
      }
      if (((_ref2 = variable.color) != null ? (_ref3 = _ref2.variables) != null ? _ref3.length : void 0 : void 0) > 0) {
        variables = variable.color.variables;
        for (_i = 0, _len = variables.length; _i < _len; _i++) {
          v = variables[_i];
          if (__indexOf.call(dependencies, v) < 0) {
            dependencies.push(v);
          }
        }
      }
      return dependencies;
    };

    VariablesCollection.prototype.collectVariablesByName = function(names) {
      var v, variables, _i, _len, _ref1, _ref2;
      variables = [];
      _ref1 = this.variables;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        v = _ref1[_i];
        if (_ref2 = v.name, __indexOf.call(names, _ref2) >= 0) {
          variables.push(v);
        }
      }
      return variables;
    };

    VariablesCollection.prototype.removeDependencies = function(from, to) {
      var dependencies, v, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = to.length; _i < _len; _i++) {
        v = to[_i];
        if (dependencies = this.dependencyGraph[v]) {
          dependencies.splice(dependencies.indexOf(from), 1);
          if (dependencies.length === 0) {
            _results.push(delete this.dependencyGraph[v]);
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    VariablesCollection.prototype.addDependencies = function(from, to) {
      var v, _base, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = to.length; _i < _len; _i++) {
        v = to[_i];
        if ((_base = this.dependencyGraph)[v] == null) {
          _base[v] = [];
        }
        _results.push(this.dependencyGraph[v].push(from));
      }
      return _results;
    };

    VariablesCollection.prototype.updateDependencies = function(_arg) {
      var created, createdVariableNames, dependencies, destroyed, dirtyVariableNames, dirtyVariables, name, updated, variable, variables, _i, _j, _k, _len, _len1, _len2;
      created = _arg.created, updated = _arg.updated, destroyed = _arg.destroyed;
      this.updateColorVariablesExpression();
      variables = [];
      dirtyVariableNames = [];
      if (created != null) {
        variables = variables.concat(created);
        createdVariableNames = created.map(function(v) {
          return v.name;
        });
      } else {
        createdVariableNames = [];
      }
      if (updated != null) {
        variables = variables.concat(updated);
      }
      if (destroyed != null) {
        variables = variables.concat(destroyed);
      }
      variables = variables.filter(function(v) {
        return v != null;
      });
      for (_i = 0, _len = variables.length; _i < _len; _i++) {
        variable = variables[_i];
        if (dependencies = this.dependencyGraph[variable.name]) {
          for (_j = 0, _len1 = dependencies.length; _j < _len1; _j++) {
            name = dependencies[_j];
            if (__indexOf.call(dirtyVariableNames, name) < 0 && __indexOf.call(createdVariableNames, name) < 0) {
              dirtyVariableNames.push(name);
            }
          }
        }
      }
      dirtyVariables = this.collectVariablesByName(dirtyVariableNames);
      for (_k = 0, _len2 = dirtyVariables.length; _k < _len2; _k++) {
        variable = dirtyVariables[_k];
        if (this.evaluateVariableColor(variable, variable.isColor)) {
          if (updated == null) {
            updated = [];
          }
          updated.push(variable);
        }
      }
      return {
        created: created,
        destroyed: destroyed,
        updated: updated
      };
    };

    VariablesCollection.prototype.emitChangeEvent = function(_arg) {
      var created, destroyed, updated;
      created = _arg.created, destroyed = _arg.destroyed, updated = _arg.updated;
      if ((created != null ? created.length : void 0) || (destroyed != null ? destroyed.length : void 0) || (updated != null ? updated.length : void 0)) {
        this.updateColorVariablesExpression();
        return this.emitter.emit('did-change', {
          created: created,
          destroyed: destroyed,
          updated: updated
        });
      }
    };

    VariablesCollection.prototype.updateColorVariablesExpression = function() {
      var colorVariables;
      if (registry == null) {
        registry = require('./color-expressions');
      }
      colorVariables = this.getColorVariables();
      if (colorVariables.length > 0) {
        if (ColorExpression == null) {
          ColorExpression = require('./color-expression');
        }
        return registry.addExpression(ColorExpression.colorExpressionForColorVariables(colorVariables));
      } else {
        return registry.removeExpression('pigments:variables');
      }
    };

    VariablesCollection.prototype.diffArrays = function(a, b) {
      var added, removed, v, _i, _j, _len, _len1;
      removed = [];
      added = [];
      for (_i = 0, _len = a.length; _i < _len; _i++) {
        v = a[_i];
        if (__indexOf.call(b, v) < 0) {
          removed.push(v);
        }
      }
      for (_j = 0, _len1 = b.length; _j < _len1; _j++) {
        v = b[_j];
        if (__indexOf.call(a, v) < 0) {
          added.push(v);
        }
      }
      return {
        removed: removed,
        added: added
      };
    };

    VariablesCollection.prototype.serialize = function() {
      return {
        deserializer: 'VariablesCollection',
        content: this.variables.map(function(v) {
          var res;
          res = {
            name: v.name,
            value: v.value,
            path: v.path,
            range: v.range,
            line: v.line
          };
          if (v.isAlternate) {
            res.isAlternate = true;
          }
          if (v.noNamePrefix) {
            res.noNamePrefix = true;
          }
          if (v.isColor) {
            res.isColor = true;
            res.color = v.color.serialize();
            if (v.color.variables != null) {
              res.variables = v.color.variables;
            }
          }
          return res;
        })
      };
    };

    return VariablesCollection;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpdGFtaW5hZnJvbnQvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3ZhcmlhYmxlcy1jb2xsZWN0aW9uLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwRkFBQTtJQUFBLHFKQUFBOztBQUFBLEVBQUEsT0FBNEQsRUFBNUQsRUFBQyxpQkFBRCxFQUFVLHlCQUFWLEVBQTJCLHNCQUEzQixFQUF5QyxlQUF6QyxFQUFnRCxrQkFBaEQsQ0FBQTs7QUFBQSxFQUVBLE1BQUEsR0FBUyxDQUZULENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osSUFBQSxtQkFBQyxDQUFBLFdBQUQsR0FBYyxTQUFDLEtBQUQsR0FBQTthQUNSLElBQUEsbUJBQUEsQ0FBb0IsS0FBcEIsRUFEUTtJQUFBLENBQWQsQ0FBQTs7QUFBQSxJQUdBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLG1CQUFDLENBQUEsU0FBdkIsRUFBa0MsUUFBbEMsRUFBNEM7QUFBQSxNQUMxQyxHQUFBLEVBQUssU0FBQSxHQUFBO2VBQUcsSUFBQyxDQUFBLFNBQVMsQ0FBQyxPQUFkO01BQUEsQ0FEcUM7QUFBQSxNQUUxQyxVQUFBLEVBQVksSUFGOEI7S0FBNUMsQ0FIQSxDQUFBOztBQVFhLElBQUEsNkJBQUMsS0FBRCxHQUFBOztRQUNYLFVBQVcsT0FBQSxDQUFRLE1BQVIsQ0FBZSxDQUFDO09BQTNCO0FBQUEsTUFFQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxPQUZYLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxTQUFELEdBQWEsRUFIYixDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsYUFBRCxHQUFpQixFQUpqQixDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsY0FBRCxHQUFrQixFQUxsQixDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsZUFBRCxHQUFtQixFQU5uQixDQUFBO0FBQUEsTUFPQSxJQUFDLENBQUEsZUFBRCxHQUFtQixFQVBuQixDQUFBO0FBQUEsTUFTQSxJQUFDLENBQUEsVUFBRCxpQkFBWSxLQUFLLENBQUUsZ0JBQW5CLENBVEEsQ0FEVztJQUFBLENBUmI7O0FBQUEsa0NBb0JBLFdBQUEsR0FBYSxTQUFDLFFBQUQsR0FBQTthQUNYLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLFlBQVosRUFBMEIsUUFBMUIsRUFEVztJQUFBLENBcEJiLENBQUE7O0FBQUEsa0NBdUJBLGVBQUEsR0FBaUIsU0FBQyxRQUFELEdBQUE7QUFDZixVQUFBLFVBQUE7QUFBQSxNQUFBLElBQWMsZ0JBQWQ7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUNBLE1BQUEsSUFBRyxJQUFDLENBQUEsV0FBSjtlQUNFLFFBQUEsQ0FBQSxFQURGO09BQUEsTUFBQTtlQUdFLFVBQUEsR0FBYSxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxnQkFBWixFQUE4QixTQUFBLEdBQUE7QUFDekMsVUFBQSxVQUFVLENBQUMsT0FBWCxDQUFBLENBQUEsQ0FBQTtpQkFDQSxRQUFBLENBQUEsRUFGeUM7UUFBQSxDQUE5QixFQUhmO09BRmU7SUFBQSxDQXZCakIsQ0FBQTs7QUFBQSxrQ0FnQ0EsVUFBQSxHQUFZLFNBQUMsT0FBRCxHQUFBO0FBQ1YsVUFBQSxTQUFBOztRQURXLFVBQVE7T0FDbkI7QUFBQSxNQUFBLFNBQUEsR0FBWSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxFQUFELEdBQUE7QUFDVixjQUFBLGFBQUE7QUFBQSxVQUFBLEtBQUEsR0FBUSxHQUFBLENBQUEsSUFBUixDQUFBO0FBQUEsVUFDQSxHQUFBLEdBQU0sR0FBQSxDQUFBLElBRE4sQ0FBQTtBQUdBLGlCQUFNLE9BQU8sQ0FBQyxNQUFSLEdBQWlCLENBQWpCLElBQXVCLEdBQUEsR0FBTSxLQUFOLEdBQWMsR0FBM0MsR0FBQTtBQUNFLFlBQUEsQ0FBQSxHQUFJLE9BQU8sQ0FBQyxLQUFSLENBQUEsQ0FBSixDQUFBO0FBQUEsWUFDQSxLQUFDLENBQUEsZUFBRCxDQUFpQixDQUFqQixDQURBLENBREY7VUFBQSxDQUhBO0FBT0EsVUFBQSxJQUFHLE9BQU8sQ0FBQyxNQUFSLEdBQWlCLENBQXBCO21CQUNFLHFCQUFBLENBQXNCLFNBQUEsR0FBQTtxQkFBRyxTQUFBLENBQVUsRUFBVixFQUFIO1lBQUEsQ0FBdEIsRUFERjtXQUFBLE1BQUE7OENBR0UsY0FIRjtXQVJVO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBWixDQUFBO2FBYUEsU0FBQSxDQUFVLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDUixVQUFBLEtBQUMsQ0FBQSxXQUFELEdBQWUsSUFBZixDQUFBO2lCQUNBLEtBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLGdCQUFkLEVBRlE7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFWLEVBZFU7SUFBQSxDQWhDWixDQUFBOztBQUFBLGtDQWtEQSxZQUFBLEdBQWMsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLFNBQVMsQ0FBQyxLQUFYLENBQUEsRUFBSDtJQUFBLENBbERkLENBQUE7O0FBQUEsa0NBb0RBLG9CQUFBLEdBQXNCLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxZQUFELENBQUEsQ0FBZSxDQUFDLE1BQWhCLENBQXVCLFNBQUMsQ0FBRCxHQUFBO2VBQU8sQ0FBQSxDQUFLLENBQUMsUUFBYjtNQUFBLENBQXZCLEVBQUg7SUFBQSxDQXBEdEIsQ0FBQTs7QUFBQSxrQ0FzREEsbUJBQUEsR0FBcUIsU0FBQyxJQUFELEdBQUE7QUFBVSxVQUFBLEtBQUE7b0VBQXlCLEdBQW5DO0lBQUEsQ0F0RHJCLENBQUE7O0FBQUEsa0NBd0RBLGlCQUFBLEdBQW1CLFNBQUMsSUFBRCxHQUFBO2FBQVUsSUFBQyxDQUFBLHNCQUFELENBQXdCLENBQUMsSUFBRCxDQUF4QixDQUErQixDQUFDLEdBQWhDLENBQUEsRUFBVjtJQUFBLENBeERuQixDQUFBOztBQUFBLGtDQTBEQSxlQUFBLEdBQWlCLFNBQUMsRUFBRCxHQUFBO0FBQVEsVUFBQSxrQkFBQTtBQUFBO0FBQUEsV0FBQSw0Q0FBQTtzQkFBQTtZQUFrQyxDQUFDLENBQUMsRUFBRixLQUFRO0FBQTFDLGlCQUFPLENBQVA7U0FBQTtBQUFBLE9BQVI7SUFBQSxDQTFEakIsQ0FBQTs7QUFBQSxrQ0E0REEsb0JBQUEsR0FBc0IsU0FBQyxLQUFELEdBQUE7QUFDcEIsVUFBQSxnQkFBQTtBQUFBLE1BQUEsR0FBQSxHQUFNLEVBQU4sQ0FBQTtBQUVBLFdBQUEsNENBQUE7c0JBQUE7WUFBb0IsQ0FBQSxJQUFLLElBQUMsQ0FBQTtBQUN4QixVQUFBLEdBQUEsR0FBTSxHQUFHLENBQUMsTUFBSixDQUFXLElBQUMsQ0FBQSxlQUFnQixDQUFBLENBQUEsQ0FBNUIsQ0FBTjtTQURGO0FBQUEsT0FGQTthQUtBLElBTm9CO0lBQUEsQ0E1RHRCLENBQUE7O0FBQUEsa0NBb0VBLGlCQUFBLEdBQW1CLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxjQUFjLENBQUMsS0FBaEIsQ0FBQSxFQUFIO0lBQUEsQ0FwRW5CLENBQUE7O0FBQUEsa0NBc0VBLElBQUEsR0FBTSxTQUFDLFVBQUQsR0FBQTtBQUFnQixVQUFBLEtBQUE7K0RBQXNCLENBQUEsQ0FBQSxXQUF0QztJQUFBLENBdEVOLENBQUE7O0FBQUEsa0NBd0VBLE9BQUEsR0FBUyxTQUFDLFVBQUQsR0FBQTtBQUNQLFVBQUEsSUFBQTs7UUFEUSxhQUFXO09BQ25CO0FBQUEsTUFBQSxJQUFBLEdBQU8sTUFBTSxDQUFDLElBQVAsQ0FBWSxVQUFaLENBQVAsQ0FBQTtBQUNBLE1BQUEsSUFBZSxJQUFJLENBQUMsTUFBTCxLQUFlLENBQTlCO0FBQUEsZUFBTyxJQUFQLENBQUE7T0FEQTthQUdBLElBQUMsQ0FBQSxTQUFTLENBQUMsTUFBWCxDQUFrQixTQUFDLENBQUQsR0FBQTtlQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsU0FBQyxDQUFELEdBQUE7QUFDbEMsY0FBQSxXQUFBO0FBQUEsVUFBQSxJQUFHLHlEQUFIO21CQUNFLENBQUUsQ0FBQSxDQUFBLENBQUUsQ0FBQyxPQUFMLENBQWEsVUFBVyxDQUFBLENBQUEsQ0FBeEIsRUFERjtXQUFBLE1BRUssSUFBRyxLQUFLLENBQUMsT0FBTixDQUFjLENBQUEsR0FBSSxVQUFXLENBQUEsQ0FBQSxDQUE3QixDQUFIO0FBQ0gsWUFBQSxDQUFBLEdBQUksQ0FBRSxDQUFBLENBQUEsQ0FBTixDQUFBO21CQUNBLENBQUMsQ0FBQyxNQUFGLEtBQVksQ0FBQyxDQUFDLE1BQWQsSUFBeUIsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxTQUFDLEtBQUQsR0FBQTtxQkFBVyxlQUFTLENBQVQsRUFBQSxLQUFBLE9BQVg7WUFBQSxDQUFSLEVBRnRCO1dBQUEsTUFBQTttQkFJSCxDQUFFLENBQUEsQ0FBQSxDQUFGLEtBQVEsVUFBVyxDQUFBLENBQUEsRUFKaEI7V0FINkI7UUFBQSxDQUFYLEVBQVA7TUFBQSxDQUFsQixFQUpPO0lBQUEsQ0F4RVQsQ0FBQTs7QUFBQSxrQ0FxRkEsZ0JBQUEsR0FBa0IsU0FBQyxVQUFELEVBQWEsS0FBYixHQUFBO0FBQ2hCLFVBQUEsc0xBQUE7QUFBQSxNQUFBLGVBQUEsR0FBa0IsRUFBbEIsQ0FBQTtBQUFBLE1BQ0EsY0FBQSxHQUFpQixFQURqQixDQUFBO0FBR0EsV0FBQSxpREFBQTsyQkFBQTs7VUFDRSx5QkFBMkI7U0FBM0I7QUFBQSxRQUNBLGVBQWdCLENBQUEsQ0FBQyxDQUFDLElBQUYsQ0FBTyxDQUFDLElBQXhCLENBQTZCLENBQTdCLENBREEsQ0FBQTtBQUVBLFFBQUEsWUFBbUMsQ0FBQyxDQUFDLElBQUYsRUFBQSxlQUFVLGNBQVYsRUFBQSxLQUFBLEtBQW5DO0FBQUEsVUFBQSxjQUFjLENBQUMsSUFBZixDQUFvQixDQUFDLENBQUMsSUFBdEIsQ0FBQSxDQUFBO1NBSEY7QUFBQSxPQUhBO0FBQUEsTUFRQSxPQUFBLEdBQVU7QUFBQSxRQUNSLE9BQUEsRUFBUyxFQUREO0FBQUEsUUFFUixTQUFBLEVBQVcsRUFGSDtBQUFBLFFBR1IsT0FBQSxFQUFTLEVBSEQ7T0FSVixDQUFBO0FBY0EsV0FBQSx1QkFBQTsyQ0FBQTtBQUNFLFFBQUEsUUFBZ0MsSUFBQyxDQUFBLG9CQUFELENBQXNCLElBQXRCLEVBQTRCLFVBQTVCLEVBQXdDLElBQXhDLENBQUEsSUFBaUQsRUFBakYsRUFBQyxnQkFBQSxPQUFELEVBQVUsZ0JBQUEsT0FBVixFQUFtQixrQkFBQSxTQUFuQixDQUFBO0FBRUEsUUFBQSxJQUFxRCxlQUFyRDtBQUFBLFVBQUEsT0FBTyxDQUFDLE9BQVIsR0FBa0IsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFoQixDQUF1QixPQUF2QixDQUFsQixDQUFBO1NBRkE7QUFHQSxRQUFBLElBQXFELGVBQXJEO0FBQUEsVUFBQSxPQUFPLENBQUMsT0FBUixHQUFrQixPQUFPLENBQUMsT0FBTyxDQUFDLE1BQWhCLENBQXVCLE9BQXZCLENBQWxCLENBQUE7U0FIQTtBQUlBLFFBQUEsSUFBMkQsaUJBQTNEO0FBQUEsVUFBQSxPQUFPLENBQUMsU0FBUixHQUFvQixPQUFPLENBQUMsU0FBUyxDQUFDLE1BQWxCLENBQXlCLFNBQXpCLENBQXBCLENBQUE7U0FMRjtBQUFBLE9BZEE7QUFxQkEsTUFBQSxJQUFHLGFBQUg7QUFDRSxRQUFBLGNBQUEsR0FBb0IsVUFBVSxDQUFDLE1BQVgsS0FBcUIsQ0FBeEIsR0FDZixLQURlLEdBR2YsS0FBSyxDQUFDLE1BQU4sQ0FBYSxTQUFDLENBQUQsR0FBQTtpQkFBTyxlQUFTLGNBQVQsRUFBQSxDQUFBLE1BQVA7UUFBQSxDQUFiLENBSEYsQ0FBQTtBQUtBLGFBQUEsdURBQUE7b0NBQUE7QUFDRSxVQUFBLFFBQWdDLElBQUMsQ0FBQSxvQkFBRCxDQUFzQixJQUF0QixFQUE0QixVQUE1QixFQUF3QyxJQUF4QyxDQUFBLElBQWlELEVBQWpGLEVBQUMsZ0JBQUEsT0FBRCxFQUFVLGdCQUFBLE9BQVYsRUFBbUIsa0JBQUEsU0FBbkIsQ0FBQTtBQUVBLFVBQUEsSUFBcUQsZUFBckQ7QUFBQSxZQUFBLE9BQU8sQ0FBQyxPQUFSLEdBQWtCLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBaEIsQ0FBdUIsT0FBdkIsQ0FBbEIsQ0FBQTtXQUZBO0FBR0EsVUFBQSxJQUFxRCxlQUFyRDtBQUFBLFlBQUEsT0FBTyxDQUFDLE9BQVIsR0FBa0IsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFoQixDQUF1QixPQUF2QixDQUFsQixDQUFBO1dBSEE7QUFJQSxVQUFBLElBQTJELGlCQUEzRDtBQUFBLFlBQUEsT0FBTyxDQUFDLFNBQVIsR0FBb0IsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFsQixDQUF5QixTQUF6QixDQUFwQixDQUFBO1dBTEY7QUFBQSxTQU5GO09BckJBO0FBQUEsTUFrQ0EsT0FBQSxHQUFVLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixPQUFwQixDQWxDVixDQUFBO0FBb0NBLE1BQUEsOENBQXlDLENBQUUsZ0JBQWpCLEtBQTJCLENBQXJEO0FBQUEsUUFBQSxNQUFBLENBQUEsT0FBYyxDQUFDLE9BQWYsQ0FBQTtPQXBDQTtBQXFDQSxNQUFBLDhDQUF5QyxDQUFFLGdCQUFqQixLQUEyQixDQUFyRDtBQUFBLFFBQUEsTUFBQSxDQUFBLE9BQWMsQ0FBQyxPQUFmLENBQUE7T0FyQ0E7QUFzQ0EsTUFBQSxnREFBNkMsQ0FBRSxnQkFBbkIsS0FBNkIsQ0FBekQ7QUFBQSxRQUFBLE1BQUEsQ0FBQSxPQUFjLENBQUMsU0FBZixDQUFBO09BdENBO0FBd0NBLE1BQUEsSUFBRyx5QkFBSDtBQUNFO0FBQUEsYUFBQSw4Q0FBQTt3QkFBQTtBQUFBLFVBQUEsSUFBQyxDQUFBLHdCQUFELENBQTBCLENBQTFCLENBQUEsQ0FBQTtBQUFBLFNBREY7T0F4Q0E7YUEyQ0EsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsT0FBakIsRUE1Q2dCO0lBQUEsQ0FyRmxCLENBQUE7O0FBQUEsa0NBbUlBLG9CQUFBLEdBQXNCLFNBQUMsSUFBRCxFQUFPLFVBQVAsRUFBbUIsS0FBbkIsR0FBQTtBQUNwQixVQUFBLGtFQUFBOztRQUR1QyxRQUFNO09BQzdDO0FBQUEsTUFBQSxjQUFBLEdBQWlCLElBQUMsQ0FBQSxlQUFnQixDQUFBLElBQUEsQ0FBakIsSUFBMEIsRUFBM0MsQ0FBQTtBQUFBLE1BRUEsT0FBQSxHQUFVLElBQUMsQ0FBQSxPQUFELENBQVMsVUFBVCxFQUFxQixJQUFyQixDQUZWLENBQUE7QUFBQSxNQUlBLFNBQUEsR0FBWSxFQUpaLENBQUE7QUFLQSxXQUFBLHFEQUFBOytCQUFBO0FBQ0UsUUFBQyxTQUFVLElBQUMsQ0FBQSw2QkFBRCxDQUErQixDQUEvQixFQUFrQyxVQUFsQyxJQUFYLENBQUE7QUFDQSxRQUFBLElBQW9DLE1BQUEsS0FBVSxTQUE5QztBQUFBLFVBQUEsU0FBUyxDQUFDLElBQVYsQ0FBZSxJQUFDLENBQUEsTUFBRCxDQUFRLENBQVIsRUFBVyxJQUFYLENBQWYsQ0FBQSxDQUFBO1NBRkY7QUFBQSxPQUxBO0FBU0EsTUFBQSxJQUFpQyxTQUFTLENBQUMsTUFBVixHQUFtQixDQUFwRDtBQUFBLFFBQUEsT0FBTyxDQUFDLFNBQVIsR0FBb0IsU0FBcEIsQ0FBQTtPQVRBO0FBV0EsTUFBQSxJQUFHLEtBQUg7ZUFDRSxRQURGO09BQUEsTUFBQTtBQUdFLFFBQUEsT0FBQSxHQUFVLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixPQUFwQixDQUFWLENBQUE7QUFDQSxhQUFBLGtEQUFBOzRCQUFBO0FBQUEsVUFBQSxJQUFDLENBQUEsd0JBQUQsQ0FBMEIsQ0FBMUIsQ0FBQSxDQUFBO0FBQUEsU0FEQTtlQUVBLElBQUMsQ0FBQSxlQUFELENBQWlCLE9BQWpCLEVBTEY7T0Fab0I7SUFBQSxDQW5JdEIsQ0FBQTs7QUFBQSxrQ0FzSkEsR0FBQSxHQUFLLFNBQUMsUUFBRCxFQUFXLEtBQVgsR0FBQTtBQUNILFVBQUEsK0JBQUE7O1FBRGMsUUFBTTtPQUNwQjtBQUFBLE1BQUEsUUFBNkIsSUFBQyxDQUFBLGlCQUFELENBQW1CLFFBQW5CLENBQTdCLEVBQUMsaUJBQUQsRUFBUywyQkFBVCxDQUFBO0FBRUEsY0FBTyxNQUFQO0FBQUEsYUFDTyxPQURQO0FBRUksVUFBQSxnQkFBZ0IsQ0FBQyxLQUFqQixHQUF5QixRQUFRLENBQUMsS0FBbEMsQ0FBQTtBQUFBLFVBQ0EsZ0JBQWdCLENBQUMsV0FBakIsR0FBK0IsUUFBUSxDQUFDLFdBRHhDLENBQUE7QUFFQSxpQkFBTyxNQUFQLENBSko7QUFBQSxhQUtPLFNBTFA7aUJBTUksSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsZ0JBQWhCLEVBQWtDLFFBQWxDLEVBQTRDLEtBQTVDLEVBTko7QUFBQSxhQU9PLFNBUFA7aUJBUUksSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsUUFBaEIsRUFBMEIsS0FBMUIsRUFSSjtBQUFBLE9BSEc7SUFBQSxDQXRKTCxDQUFBOztBQUFBLGtDQW1LQSxPQUFBLEdBQVMsU0FBQyxTQUFELEVBQVksS0FBWixHQUFBO0FBQ1AsVUFBQSwyQ0FBQTs7UUFEbUIsUUFBTTtPQUN6QjtBQUFBLE1BQUEsT0FBQSxHQUFVLEVBQVYsQ0FBQTtBQUVBLFdBQUEsZ0RBQUE7aUNBQUE7QUFDRSxRQUFBLEdBQUEsR0FBTSxJQUFDLENBQUEsR0FBRCxDQUFLLFFBQUwsRUFBZSxJQUFmLENBQU4sQ0FBQTtBQUNBLFFBQUEsSUFBRyxXQUFIO0FBQ0UsVUFBQyxlQUFELEVBQVMsVUFBVCxDQUFBOztZQUVBLE9BQVEsQ0FBQSxNQUFBLElBQVc7V0FGbkI7QUFBQSxVQUdBLE9BQVEsQ0FBQSxNQUFBLENBQU8sQ0FBQyxJQUFoQixDQUFxQixDQUFyQixDQUhBLENBREY7U0FGRjtBQUFBLE9BRkE7QUFVQSxNQUFBLElBQUcsS0FBSDtlQUNFLFFBREY7T0FBQSxNQUFBO2VBR0UsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsSUFBQyxDQUFBLGtCQUFELENBQW9CLE9BQXBCLENBQWpCLEVBSEY7T0FYTztJQUFBLENBbktULENBQUE7O0FBQUEsa0NBbUxBLE1BQUEsR0FBUSxTQUFDLFFBQUQsRUFBVyxLQUFYLEdBQUE7QUFDTixVQUFBLE9BQUE7O1FBRGlCLFFBQU07T0FDdkI7QUFBQSxNQUFBLFFBQUEsR0FBVyxJQUFDLENBQUEsSUFBRCxDQUFNLFFBQU4sQ0FBWCxDQUFBO0FBRUEsTUFBQSxJQUFjLGdCQUFkO0FBQUEsY0FBQSxDQUFBO09BRkE7QUFBQSxNQUlBLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxNQUFYLENBQWtCLFNBQUMsQ0FBRCxHQUFBO2VBQU8sQ0FBQSxLQUFPLFNBQWQ7TUFBQSxDQUFsQixDQUpiLENBQUE7QUFLQSxNQUFBLElBQUcsUUFBUSxDQUFDLE9BQVo7QUFDRSxRQUFBLElBQUMsQ0FBQSxjQUFELEdBQWtCLElBQUMsQ0FBQSxjQUFjLENBQUMsTUFBaEIsQ0FBdUIsU0FBQyxDQUFELEdBQUE7aUJBQU8sQ0FBQSxLQUFPLFNBQWQ7UUFBQSxDQUF2QixDQUFsQixDQURGO09BTEE7QUFRQSxNQUFBLElBQUcsS0FBSDtBQUNFLGVBQU8sUUFBUCxDQURGO09BQUEsTUFBQTtBQUdFLFFBQUEsT0FBQSxHQUFVLElBQUMsQ0FBQSxrQkFBRCxDQUFvQjtBQUFBLFVBQUEsU0FBQSxFQUFXLENBQUMsUUFBRCxDQUFYO1NBQXBCLENBQVYsQ0FBQTtBQUFBLFFBRUEsSUFBQyxDQUFBLHdCQUFELENBQTBCLFFBQTFCLENBRkEsQ0FBQTtlQUdBLElBQUMsQ0FBQSxlQUFELENBQWlCLE9BQWpCLEVBTkY7T0FUTTtJQUFBLENBbkxSLENBQUE7O0FBQUEsa0NBb01BLFVBQUEsR0FBWSxTQUFDLFNBQUQsRUFBWSxLQUFaLEdBQUE7QUFDVixVQUFBLG9EQUFBOztRQURzQixRQUFNO09BQzVCO0FBQUEsTUFBQSxTQUFBLEdBQVksRUFBWixDQUFBO0FBQ0EsV0FBQSxnREFBQTtpQ0FBQTtBQUNFLFFBQUEsU0FBUyxDQUFDLElBQVYsQ0FBZSxJQUFDLENBQUEsTUFBRCxDQUFRLFFBQVIsRUFBa0IsSUFBbEIsQ0FBZixDQUFBLENBREY7QUFBQSxPQURBO0FBQUEsTUFJQSxPQUFBLEdBQVU7QUFBQSxRQUFDLFdBQUEsU0FBRDtPQUpWLENBQUE7QUFNQSxNQUFBLElBQUcsS0FBSDtlQUNFLFFBREY7T0FBQSxNQUFBO0FBR0UsUUFBQSxPQUFBLEdBQVUsSUFBQyxDQUFBLGtCQUFELENBQW9CLE9BQXBCLENBQVYsQ0FBQTtBQUNBLGFBQUEsa0RBQUE7NEJBQUE7Y0FBcUQ7QUFBckQsWUFBQSxJQUFDLENBQUEsd0JBQUQsQ0FBMEIsQ0FBMUIsQ0FBQTtXQUFBO0FBQUEsU0FEQTtlQUVBLElBQUMsQ0FBQSxlQUFELENBQWlCLE9BQWpCLEVBTEY7T0FQVTtJQUFBLENBcE1aLENBQUE7O0FBQUEsa0NBa05BLHVCQUFBLEdBQXlCLFNBQUMsS0FBRCxHQUFBO2FBQVcsSUFBQyxDQUFBLFVBQUQsQ0FBWSxJQUFDLENBQUEsb0JBQUQsQ0FBc0IsS0FBdEIsQ0FBWixFQUFYO0lBQUEsQ0FsTnpCLENBQUE7O0FBQUEsa0NBb05BLHdCQUFBLEdBQTBCLFNBQUMsUUFBRCxHQUFBO0FBQ3hCLFVBQUEsZUFBQTtBQUFBLE1BQUEsWUFBQSxHQUFlLElBQUMsQ0FBQSx1QkFBRCxDQUF5QixRQUF6QixDQUFmLENBQUE7QUFBQSxNQUVBLENBQUEsR0FBSSxJQUFDLENBQUEsZUFBZ0IsQ0FBQSxRQUFRLENBQUMsSUFBVCxDQUZyQixDQUFBO0FBQUEsTUFHQSxDQUFDLENBQUMsTUFBRixDQUFTLENBQUMsQ0FBQyxPQUFGLENBQVUsUUFBVixDQUFULEVBQThCLENBQTlCLENBSEEsQ0FBQTtBQUFBLE1BS0EsQ0FBQSxHQUFJLElBQUMsQ0FBQSxhQUxMLENBQUE7QUFBQSxNQU1BLENBQUMsQ0FBQyxNQUFGLENBQVMsQ0FBQyxDQUFDLE9BQUYsQ0FBVSxRQUFRLENBQUMsSUFBbkIsQ0FBVCxFQUFtQyxDQUFuQyxDQU5BLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixRQUFRLENBQUMsSUFBN0IsRUFBbUMsWUFBbkMsQ0FQQSxDQUFBO2FBU0EsTUFBQSxDQUFBLElBQVEsQ0FBQSxlQUFnQixDQUFBLFFBQVEsQ0FBQyxJQUFULEVBVkE7SUFBQSxDQXBOMUIsQ0FBQTs7QUFBQSxrQ0FnT0EsVUFBQSxHQUFZLFNBQUEsR0FBQTs7UUFDVixlQUFnQixPQUFBLENBQVEsaUJBQVI7T0FBaEI7O1FBQ0EsV0FBWSxPQUFBLENBQVEscUJBQVI7T0FEWjthQUdJLElBQUEsWUFBQSxDQUFhO0FBQUEsUUFBRSxXQUFELElBQUMsQ0FBQSxTQUFGO0FBQUEsUUFBYyxnQkFBRCxJQUFDLENBQUEsY0FBZDtBQUFBLFFBQThCLFVBQUEsUUFBOUI7T0FBYixFQUpNO0lBQUEsQ0FoT1osQ0FBQTs7QUFBQSxrQ0FzT0EsaUJBQUEsR0FBbUIsU0FBQyxTQUFELEVBQVksUUFBWixHQUFBO0FBQ2pCLFVBQUEsc0NBQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxFQUFWLENBQUE7QUFBQSxNQUNBLGtCQUFBLEdBQXFCLFNBQVMsQ0FBQyxLQUFWLENBQUEsQ0FEckIsQ0FBQTtBQUFBLE1BR0EsU0FBQSxHQUFZLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEVBQUQsR0FBQTtBQUNWLGNBQUEsZ0NBQUE7QUFBQSxVQUFBLEtBQUEsR0FBUSxHQUFBLENBQUEsSUFBUixDQUFBO0FBQUEsVUFDQSxHQUFBLEdBQU0sR0FBQSxDQUFBLElBRE4sQ0FBQTtBQUdBLGlCQUFNLGtCQUFrQixDQUFDLE1BQW5CLEdBQTRCLENBQTVCLElBQWtDLEdBQUEsR0FBTSxLQUFOLEdBQWMsR0FBdEQsR0FBQTtBQUNFLFlBQUEsQ0FBQSxHQUFJLGtCQUFrQixDQUFDLEtBQW5CLENBQUEsQ0FBSixDQUFBO0FBQUEsWUFDQSxRQUFBLEdBQVcsQ0FBQyxDQUFDLE9BRGIsQ0FBQTtBQUFBLFlBRUEsS0FBQyxDQUFBLHFCQUFELENBQXVCLENBQXZCLEVBQTBCLFFBQTFCLENBRkEsQ0FBQTtBQUFBLFlBR0EsT0FBQSxHQUFVLENBQUMsQ0FBQyxPQUhaLENBQUE7QUFLQSxZQUFBLElBQUcsT0FBQSxLQUFhLFFBQWhCO0FBQ0UsY0FBQSxPQUFPLENBQUMsSUFBUixDQUFhLENBQWIsQ0FBQSxDQUFBO0FBQ0EsY0FBQSxJQUE0QixPQUE1QjtBQUFBLGdCQUFBLEtBQUMsQ0FBQSxvQkFBRCxDQUFzQixDQUF0QixDQUFBLENBQUE7ZUFEQTtBQUFBLGNBR0EsR0FBQSxHQUFNLEdBQUEsQ0FBQSxJQUhOLENBREY7YUFORjtVQUFBLENBSEE7QUFlQSxVQUFBLElBQUcsa0JBQWtCLENBQUMsTUFBbkIsR0FBNEIsQ0FBL0I7bUJBQ0UscUJBQUEsQ0FBc0IsU0FBQSxHQUFBO3FCQUFHLFNBQUEsQ0FBVSxFQUFWLEVBQUg7WUFBQSxDQUF0QixFQURGO1dBQUEsTUFBQTs4Q0FHRSxjQUhGO1dBaEJVO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FIWixDQUFBO2FBd0JBLFNBQUEsQ0FBVSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ1IsVUFBQSxJQUFvRCxPQUFPLENBQUMsTUFBUixHQUFpQixDQUFyRTtBQUFBLFlBQUEsS0FBQyxDQUFBLGVBQUQsQ0FBaUIsS0FBQyxDQUFBLGtCQUFELENBQW9CO0FBQUEsY0FBQyxTQUFBLE9BQUQ7YUFBcEIsQ0FBakIsQ0FBQSxDQUFBO1dBQUE7a0RBQ0EsU0FBVSxrQkFGRjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVYsRUF6QmlCO0lBQUEsQ0F0T25CLENBQUE7O0FBQUEsa0NBbVFBLGNBQUEsR0FBZ0IsU0FBQyxnQkFBRCxFQUFtQixRQUFuQixFQUE2QixLQUE3QixHQUFBO0FBQ2QsVUFBQSw0REFBQTtBQUFBLE1BQUEsb0JBQUEsR0FBdUIsSUFBQyxDQUFBLHVCQUFELENBQXlCLGdCQUF6QixDQUF2QixDQUFBO0FBQUEsTUFDQSxnQkFBZ0IsQ0FBQyxLQUFqQixHQUF5QixRQUFRLENBQUMsS0FEbEMsQ0FBQTtBQUFBLE1BRUEsZ0JBQWdCLENBQUMsS0FBakIsR0FBeUIsUUFBUSxDQUFDLEtBRmxDLENBQUE7QUFBQSxNQUdBLGdCQUFnQixDQUFDLFdBQWpCLEdBQStCLFFBQVEsQ0FBQyxXQUh4QyxDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEscUJBQUQsQ0FBdUIsZ0JBQXZCLEVBQXlDLGdCQUFnQixDQUFDLE9BQTFELENBTEEsQ0FBQTtBQUFBLE1BTUEsZUFBQSxHQUFrQixJQUFDLENBQUEsdUJBQUQsQ0FBeUIsZ0JBQXpCLENBTmxCLENBQUE7QUFBQSxNQVFBLFFBQW1CLElBQUMsQ0FBQSxVQUFELENBQVksb0JBQVosRUFBa0MsZUFBbEMsQ0FBbkIsRUFBQyxnQkFBQSxPQUFELEVBQVUsY0FBQSxLQVJWLENBQUE7QUFBQSxNQVNBLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixRQUFRLENBQUMsSUFBN0IsRUFBbUMsT0FBbkMsQ0FUQSxDQUFBO0FBQUEsTUFVQSxJQUFDLENBQUEsZUFBRCxDQUFpQixRQUFRLENBQUMsSUFBMUIsRUFBZ0MsS0FBaEMsQ0FWQSxDQUFBO0FBWUEsTUFBQSxJQUFHLEtBQUg7QUFDRSxlQUFPLENBQUMsU0FBRCxFQUFZLGdCQUFaLENBQVAsQ0FERjtPQUFBLE1BQUE7ZUFHRSxJQUFDLENBQUEsZUFBRCxDQUFpQixJQUFDLENBQUEsa0JBQUQsQ0FBb0I7QUFBQSxVQUFBLE9BQUEsRUFBUyxDQUFDLGdCQUFELENBQVQ7U0FBcEIsQ0FBakIsRUFIRjtPQWJjO0lBQUEsQ0FuUWhCLENBQUE7O0FBQUEsa0NBcVJBLGVBQUEsR0FBaUIsU0FBQyxRQUFELEdBQUE7QUFDZixVQUFBLFlBQUE7O1FBQUEsUUFBUyxPQUFBLENBQVEsU0FBUjtPQUFUO0FBQUEsTUFFQSxJQUFDLENBQUEsYUFBYSxDQUFDLElBQWYsQ0FBb0IsUUFBUSxDQUFDLElBQTdCLENBRkEsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxJQUFYLENBQWdCLFFBQWhCLENBSEEsQ0FBQTtBQUFBLE1BSUEsUUFBUSxDQUFDLEVBQVQsR0FBYyxNQUFBLEVBSmQsQ0FBQTtBQU1BLE1BQUEsSUFBRyxRQUFRLENBQUMsT0FBWjtBQUNFLFFBQUEsUUFBUSxDQUFDLEtBQVQsR0FBcUIsSUFBQSxLQUFBLENBQU0sUUFBUSxDQUFDLEtBQWYsQ0FBckIsQ0FBQTtBQUFBLFFBQ0EsUUFBUSxDQUFDLEtBQUssQ0FBQyxTQUFmLEdBQTJCLFFBQVEsQ0FBQyxTQURwQyxDQUFBO0FBQUEsUUFFQSxJQUFDLENBQUEsY0FBYyxDQUFDLElBQWhCLENBQXFCLFFBQXJCLENBRkEsQ0FBQTtBQUFBLFFBR0EsTUFBQSxDQUFBLFFBQWUsQ0FBQyxTQUhoQixDQURGO09BTkE7O3VCQVltQztPQVpuQztBQUFBLE1BYUEsSUFBQyxDQUFBLGVBQWdCLENBQUEsUUFBUSxDQUFDLElBQVQsQ0FBYyxDQUFDLElBQWhDLENBQXFDLFFBQXJDLENBYkEsQ0FBQTthQWVBLElBQUMsQ0FBQSxvQkFBRCxDQUFzQixRQUF0QixFQWhCZTtJQUFBLENBclJqQixDQUFBOztBQUFBLGtDQXVTQSxjQUFBLEdBQWdCLFNBQUMsUUFBRCxFQUFXLEtBQVgsR0FBQTtBQUNkLFVBQUEsWUFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxJQUFmLENBQW9CLFFBQVEsQ0FBQyxJQUE3QixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxTQUFTLENBQUMsSUFBWCxDQUFnQixRQUFoQixDQURBLENBQUE7QUFBQSxNQUVBLFFBQVEsQ0FBQyxFQUFULEdBQWMsTUFBQSxFQUZkLENBQUE7O3VCQUltQztPQUpuQztBQUFBLE1BS0EsSUFBQyxDQUFBLGVBQWdCLENBQUEsUUFBUSxDQUFDLElBQVQsQ0FBYyxDQUFDLElBQWhDLENBQXFDLFFBQXJDLENBTEEsQ0FBQTtBQUFBLE1BT0EsSUFBQyxDQUFBLHFCQUFELENBQXVCLFFBQXZCLENBUEEsQ0FBQTtBQUFBLE1BUUEsSUFBQyxDQUFBLG9CQUFELENBQXNCLFFBQXRCLENBUkEsQ0FBQTtBQVVBLE1BQUEsSUFBRyxLQUFIO0FBQ0UsZUFBTyxDQUFDLFNBQUQsRUFBWSxRQUFaLENBQVAsQ0FERjtPQUFBLE1BQUE7ZUFHRSxJQUFDLENBQUEsZUFBRCxDQUFpQixJQUFDLENBQUEsa0JBQUQsQ0FBb0I7QUFBQSxVQUFBLE9BQUEsRUFBUyxDQUFDLFFBQUQsQ0FBVDtTQUFwQixDQUFqQixFQUhGO09BWGM7SUFBQSxDQXZTaEIsQ0FBQTs7QUFBQSxrQ0F1VEEscUJBQUEsR0FBdUIsU0FBQyxRQUFELEVBQVcsUUFBWCxHQUFBO0FBQ3JCLFVBQUEsY0FBQTs7UUFEZ0MsV0FBUztPQUN6QztBQUFBLE1BQUEsT0FBQSxHQUFVLElBQUMsQ0FBQSxVQUFELENBQUEsQ0FBVixDQUFBO0FBQUEsTUFDQSxLQUFBLEdBQVEsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsUUFBUSxDQUFDLEtBQTNCLEVBQWtDLElBQWxDLENBRFIsQ0FBQTtBQUdBLE1BQUEsSUFBRyxhQUFIO0FBQ0UsUUFBQSxJQUFnQixRQUFBLElBQWEsS0FBSyxDQUFDLE9BQU4sQ0FBYyxRQUFRLENBQUMsS0FBdkIsQ0FBN0I7QUFBQSxpQkFBTyxLQUFQLENBQUE7U0FBQTtBQUFBLFFBRUEsUUFBUSxDQUFDLEtBQVQsR0FBaUIsS0FGakIsQ0FBQTtBQUFBLFFBR0EsUUFBUSxDQUFDLE9BQVQsR0FBbUIsSUFIbkIsQ0FBQTtBQUtBLFFBQUEsSUFBc0MsZUFBWSxJQUFDLENBQUEsY0FBYixFQUFBLFFBQUEsS0FBdEM7QUFBQSxVQUFBLElBQUMsQ0FBQSxjQUFjLENBQUMsSUFBaEIsQ0FBcUIsUUFBckIsQ0FBQSxDQUFBO1NBTEE7QUFNQSxlQUFPLElBQVAsQ0FQRjtPQUFBLE1BU0ssSUFBRyxRQUFIO0FBQ0gsUUFBQSxNQUFBLENBQUEsUUFBZSxDQUFDLEtBQWhCLENBQUE7QUFBQSxRQUNBLFFBQVEsQ0FBQyxPQUFULEdBQW1CLEtBRG5CLENBQUE7QUFBQSxRQUVBLElBQUMsQ0FBQSxjQUFELEdBQWtCLElBQUMsQ0FBQSxjQUFjLENBQUMsTUFBaEIsQ0FBdUIsU0FBQyxDQUFELEdBQUE7aUJBQU8sQ0FBQSxLQUFPLFNBQWQ7UUFBQSxDQUF2QixDQUZsQixDQUFBO0FBR0EsZUFBTyxJQUFQLENBSkc7T0FiZ0I7SUFBQSxDQXZUdkIsQ0FBQTs7QUFBQSxrQ0EwVUEsaUJBQUEsR0FBbUIsU0FBQyxRQUFELEdBQUE7QUFDakIsTUFBQSxJQUFvQywyQ0FBcEM7QUFBQSxlQUFPLENBQUMsU0FBRCxFQUFZLFFBQVosQ0FBUCxDQUFBO09BQUE7YUFDQSxJQUFDLENBQUEsNkJBQUQsQ0FBK0IsUUFBL0IsRUFBeUMsSUFBQyxDQUFBLGVBQWdCLENBQUEsUUFBUSxDQUFDLElBQVQsQ0FBMUQsRUFGaUI7SUFBQSxDQTFVbkIsQ0FBQTs7QUFBQSxrQ0E4VUEsNkJBQUEsR0FBK0IsU0FBQyxRQUFELEVBQVcsVUFBWCxHQUFBO0FBQzdCLFVBQUEsbUJBQUE7QUFBQSxXQUFBLGlEQUFBOzJCQUFBO0FBQ0UsUUFBQSxNQUFBLEdBQVMsSUFBQyxDQUFBLGdCQUFELENBQWtCLENBQWxCLEVBQXFCLFFBQXJCLENBQVQsQ0FBQTtBQUVBLGdCQUFPLE1BQVA7QUFBQSxlQUNPLFdBRFA7QUFDd0IsbUJBQU8sQ0FBQyxXQUFELEVBQWMsQ0FBZCxDQUFQLENBRHhCO0FBQUEsZUFFTyxNQUZQO0FBRW1CLG1CQUFPLENBQUMsT0FBRCxFQUFVLENBQVYsQ0FBUCxDQUZuQjtBQUFBLGVBR08sUUFIUDtBQUdxQixtQkFBTyxDQUFDLFNBQUQsRUFBWSxDQUFaLENBQVAsQ0FIckI7QUFBQSxTQUhGO0FBQUEsT0FBQTtBQVFBLGFBQU8sQ0FBQyxTQUFELEVBQVksUUFBWixDQUFQLENBVDZCO0lBQUEsQ0E5VS9CLENBQUE7O0FBQUEsa0NBeVZBLGdCQUFBLEdBQWtCLFNBQUMsRUFBRCxFQUFLLEVBQUwsR0FBQTtBQUNoQixVQUFBLHdDQUFBO0FBQUEsTUFBQSxRQUFBLEdBQVcsRUFBRSxDQUFDLElBQUgsS0FBVyxFQUFFLENBQUMsSUFBekIsQ0FBQTtBQUFBLE1BQ0EsU0FBQSxHQUFZLEVBQUUsQ0FBQyxLQUFILEtBQVksRUFBRSxDQUFDLEtBRDNCLENBQUE7QUFBQSxNQUVBLFFBQUEsR0FBVyxFQUFFLENBQUMsSUFBSCxLQUFXLEVBQUUsQ0FBQyxJQUZ6QixDQUFBO0FBQUEsTUFHQSxTQUFBLEdBQVksRUFBRSxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQVQsS0FBZSxFQUFFLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBeEIsSUFBK0IsRUFBRSxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQVQsS0FBZSxFQUFFLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FIbkUsQ0FBQTtBQUtBLE1BQUEsSUFBRyx3QkFBQSxJQUFvQix3QkFBdkI7QUFDRSxRQUFBLGNBQUEsWUFBYyxFQUFFLENBQUMsV0FBVyxDQUFDLE9BQWYsQ0FBdUIsRUFBRSxDQUFDLFdBQTFCLEVBQWQsQ0FERjtPQUxBO0FBUUEsTUFBQSxJQUFHLFFBQUEsSUFBYSxTQUFoQjtBQUNFLFFBQUEsSUFBRyxTQUFIO2lCQUNFLFlBREY7U0FBQSxNQUFBO2lCQUdFLE9BSEY7U0FERjtPQUFBLE1BS0ssSUFBRyxRQUFIO0FBQ0gsUUFBQSxJQUFHLFNBQUEsSUFBYSxRQUFoQjtpQkFDRSxTQURGO1NBQUEsTUFBQTtpQkFHRSxZQUhGO1NBREc7T0FkVztJQUFBLENBelZsQixDQUFBOztBQUFBLGtDQTZXQSxvQkFBQSxHQUFzQixTQUFDLFFBQUQsR0FBQTtBQUNwQixVQUFBLDZEQUFBO0FBQUEsTUFBQSxZQUFBLEdBQWUsSUFBQyxDQUFBLHVCQUFELENBQXlCLFFBQXpCLENBQWYsQ0FBQTtBQUNBO1dBQUEsbURBQUE7c0NBQUE7QUFDRSxRQUFBLENBQUEsNkRBQXFCLENBQUEsVUFBQSxTQUFBLENBQUEsVUFBQSxJQUFlLEVBQXBDLENBQUE7QUFDQSxRQUFBLFlBQTZCLFFBQVEsQ0FBQyxJQUFULEVBQUEsZUFBaUIsQ0FBakIsRUFBQSxLQUFBLEtBQTdCO3dCQUFBLENBQUMsQ0FBQyxJQUFGLENBQU8sUUFBUSxDQUFDLElBQWhCLEdBQUE7U0FBQSxNQUFBO2dDQUFBO1NBRkY7QUFBQTtzQkFGb0I7SUFBQSxDQTdXdEIsQ0FBQTs7QUFBQSxrQ0FtWEEsdUJBQUEsR0FBeUIsU0FBQyxRQUFELEdBQUE7QUFDdkIsVUFBQSx5REFBQTtBQUFBLE1BQUEsWUFBQSxHQUFlLEVBQWYsQ0FBQTtBQUNBLE1BQUEsWUFBcUMsUUFBUSxDQUFDLEtBQVQsRUFBQSxlQUFrQixJQUFDLENBQUEsYUFBbkIsRUFBQSxLQUFBLE1BQXJDO0FBQUEsUUFBQSxZQUFZLENBQUMsSUFBYixDQUFrQixRQUFRLENBQUMsS0FBM0IsQ0FBQSxDQUFBO09BREE7QUFHQSxNQUFBLGlGQUE0QixDQUFFLHlCQUEzQixHQUFvQyxDQUF2QztBQUNFLFFBQUEsU0FBQSxHQUFZLFFBQVEsQ0FBQyxLQUFLLENBQUMsU0FBM0IsQ0FBQTtBQUVBLGFBQUEsZ0RBQUE7NEJBQUE7QUFDRSxVQUFBLElBQTRCLGVBQUssWUFBTCxFQUFBLENBQUEsS0FBNUI7QUFBQSxZQUFBLFlBQVksQ0FBQyxJQUFiLENBQWtCLENBQWxCLENBQUEsQ0FBQTtXQURGO0FBQUEsU0FIRjtPQUhBO2FBU0EsYUFWdUI7SUFBQSxDQW5YekIsQ0FBQTs7QUFBQSxrQ0ErWEEsc0JBQUEsR0FBd0IsU0FBQyxLQUFELEdBQUE7QUFDdEIsVUFBQSxvQ0FBQTtBQUFBLE1BQUEsU0FBQSxHQUFZLEVBQVosQ0FBQTtBQUNBO0FBQUEsV0FBQSw0Q0FBQTtzQkFBQTtvQkFBMEMsQ0FBQyxDQUFDLElBQUYsRUFBQSxlQUFVLEtBQVYsRUFBQSxLQUFBO0FBQTFDLFVBQUEsU0FBUyxDQUFDLElBQVYsQ0FBZSxDQUFmLENBQUE7U0FBQTtBQUFBLE9BREE7YUFFQSxVQUhzQjtJQUFBLENBL1h4QixDQUFBOztBQUFBLGtDQW9ZQSxrQkFBQSxHQUFvQixTQUFDLElBQUQsRUFBTyxFQUFQLEdBQUE7QUFDbEIsVUFBQSxtQ0FBQTtBQUFBO1dBQUEseUNBQUE7bUJBQUE7QUFDRSxRQUFBLElBQUcsWUFBQSxHQUFlLElBQUMsQ0FBQSxlQUFnQixDQUFBLENBQUEsQ0FBbkM7QUFDRSxVQUFBLFlBQVksQ0FBQyxNQUFiLENBQW9CLFlBQVksQ0FBQyxPQUFiLENBQXFCLElBQXJCLENBQXBCLEVBQWdELENBQWhELENBQUEsQ0FBQTtBQUVBLFVBQUEsSUFBOEIsWUFBWSxDQUFDLE1BQWIsS0FBdUIsQ0FBckQ7MEJBQUEsTUFBQSxDQUFBLElBQVEsQ0FBQSxlQUFnQixDQUFBLENBQUEsR0FBeEI7V0FBQSxNQUFBO2tDQUFBO1dBSEY7U0FBQSxNQUFBO2dDQUFBO1NBREY7QUFBQTtzQkFEa0I7SUFBQSxDQXBZcEIsQ0FBQTs7QUFBQSxrQ0EyWUEsZUFBQSxHQUFpQixTQUFDLElBQUQsRUFBTyxFQUFQLEdBQUE7QUFDZixVQUFBLDRCQUFBO0FBQUE7V0FBQSx5Q0FBQTttQkFBQTs7ZUFDbUIsQ0FBQSxDQUFBLElBQU07U0FBdkI7QUFBQSxzQkFDQSxJQUFDLENBQUEsZUFBZ0IsQ0FBQSxDQUFBLENBQUUsQ0FBQyxJQUFwQixDQUF5QixJQUF6QixFQURBLENBREY7QUFBQTtzQkFEZTtJQUFBLENBM1lqQixDQUFBOztBQUFBLGtDQWdaQSxrQkFBQSxHQUFvQixTQUFDLElBQUQsR0FBQTtBQUNsQixVQUFBLDhKQUFBO0FBQUEsTUFEb0IsZUFBQSxTQUFTLGVBQUEsU0FBUyxpQkFBQSxTQUN0QyxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsOEJBQUQsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUVBLFNBQUEsR0FBWSxFQUZaLENBQUE7QUFBQSxNQUdBLGtCQUFBLEdBQXFCLEVBSHJCLENBQUE7QUFLQSxNQUFBLElBQUcsZUFBSDtBQUNFLFFBQUEsU0FBQSxHQUFZLFNBQVMsQ0FBQyxNQUFWLENBQWlCLE9BQWpCLENBQVosQ0FBQTtBQUFBLFFBQ0Esb0JBQUEsR0FBdUIsT0FBTyxDQUFDLEdBQVIsQ0FBWSxTQUFDLENBQUQsR0FBQTtpQkFBTyxDQUFDLENBQUMsS0FBVDtRQUFBLENBQVosQ0FEdkIsQ0FERjtPQUFBLE1BQUE7QUFJRSxRQUFBLG9CQUFBLEdBQXVCLEVBQXZCLENBSkY7T0FMQTtBQVdBLE1BQUEsSUFBeUMsZUFBekM7QUFBQSxRQUFBLFNBQUEsR0FBWSxTQUFTLENBQUMsTUFBVixDQUFpQixPQUFqQixDQUFaLENBQUE7T0FYQTtBQVlBLE1BQUEsSUFBMkMsaUJBQTNDO0FBQUEsUUFBQSxTQUFBLEdBQVksU0FBUyxDQUFDLE1BQVYsQ0FBaUIsU0FBakIsQ0FBWixDQUFBO09BWkE7QUFBQSxNQWFBLFNBQUEsR0FBWSxTQUFTLENBQUMsTUFBVixDQUFpQixTQUFDLENBQUQsR0FBQTtlQUFPLFVBQVA7TUFBQSxDQUFqQixDQWJaLENBQUE7QUFlQSxXQUFBLGdEQUFBO2lDQUFBO0FBQ0UsUUFBQSxJQUFHLFlBQUEsR0FBZSxJQUFDLENBQUEsZUFBZ0IsQ0FBQSxRQUFRLENBQUMsSUFBVCxDQUFuQztBQUNFLGVBQUEscURBQUE7b0NBQUE7QUFDRSxZQUFBLElBQUcsZUFBWSxrQkFBWixFQUFBLElBQUEsS0FBQSxJQUFtQyxlQUFZLG9CQUFaLEVBQUEsSUFBQSxLQUF0QztBQUNFLGNBQUEsa0JBQWtCLENBQUMsSUFBbkIsQ0FBd0IsSUFBeEIsQ0FBQSxDQURGO2FBREY7QUFBQSxXQURGO1NBREY7QUFBQSxPQWZBO0FBQUEsTUFxQkEsY0FBQSxHQUFpQixJQUFDLENBQUEsc0JBQUQsQ0FBd0Isa0JBQXhCLENBckJqQixDQUFBO0FBdUJBLFdBQUEsdURBQUE7c0NBQUE7QUFDRSxRQUFBLElBQUcsSUFBQyxDQUFBLHFCQUFELENBQXVCLFFBQXZCLEVBQWlDLFFBQVEsQ0FBQyxPQUExQyxDQUFIOztZQUNFLFVBQVc7V0FBWDtBQUFBLFVBQ0EsT0FBTyxDQUFDLElBQVIsQ0FBYSxRQUFiLENBREEsQ0FERjtTQURGO0FBQUEsT0F2QkE7YUE0QkE7QUFBQSxRQUFDLFNBQUEsT0FBRDtBQUFBLFFBQVUsV0FBQSxTQUFWO0FBQUEsUUFBcUIsU0FBQSxPQUFyQjtRQTdCa0I7SUFBQSxDQWhacEIsQ0FBQTs7QUFBQSxrQ0ErYUEsZUFBQSxHQUFpQixTQUFDLElBQUQsR0FBQTtBQUNmLFVBQUEsMkJBQUE7QUFBQSxNQURpQixlQUFBLFNBQVMsaUJBQUEsV0FBVyxlQUFBLE9BQ3JDLENBQUE7QUFBQSxNQUFBLHVCQUFHLE9BQU8sQ0FBRSxnQkFBVCx5QkFBbUIsU0FBUyxDQUFFLGdCQUE5Qix1QkFBd0MsT0FBTyxDQUFFLGdCQUFwRDtBQUNFLFFBQUEsSUFBQyxDQUFBLDhCQUFELENBQUEsQ0FBQSxDQUFBO2VBQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsWUFBZCxFQUE0QjtBQUFBLFVBQUMsU0FBQSxPQUFEO0FBQUEsVUFBVSxXQUFBLFNBQVY7QUFBQSxVQUFxQixTQUFBLE9BQXJCO1NBQTVCLEVBRkY7T0FEZTtJQUFBLENBL2FqQixDQUFBOztBQUFBLGtDQW9iQSw4QkFBQSxHQUFnQyxTQUFBLEdBQUE7QUFDOUIsVUFBQSxjQUFBOztRQUFBLFdBQVksT0FBQSxDQUFRLHFCQUFSO09BQVo7QUFBQSxNQUVBLGNBQUEsR0FBaUIsSUFBQyxDQUFBLGlCQUFELENBQUEsQ0FGakIsQ0FBQTtBQUdBLE1BQUEsSUFBRyxjQUFjLENBQUMsTUFBZixHQUF3QixDQUEzQjs7VUFDRSxrQkFBbUIsT0FBQSxDQUFRLG9CQUFSO1NBQW5CO2VBRUEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsZUFBZSxDQUFDLGdDQUFoQixDQUFpRCxjQUFqRCxDQUF2QixFQUhGO09BQUEsTUFBQTtlQUtFLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixvQkFBMUIsRUFMRjtPQUo4QjtJQUFBLENBcGJoQyxDQUFBOztBQUFBLGtDQStiQSxVQUFBLEdBQVksU0FBQyxDQUFELEVBQUcsQ0FBSCxHQUFBO0FBQ1YsVUFBQSxzQ0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLEVBQVYsQ0FBQTtBQUFBLE1BQ0EsS0FBQSxHQUFRLEVBRFIsQ0FBQTtBQUdBLFdBQUEsd0NBQUE7a0JBQUE7WUFBZ0MsZUFBUyxDQUFULEVBQUEsQ0FBQTtBQUFoQyxVQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsQ0FBYixDQUFBO1NBQUE7QUFBQSxPQUhBO0FBSUEsV0FBQSwwQ0FBQTtrQkFBQTtZQUE4QixlQUFTLENBQVQsRUFBQSxDQUFBO0FBQTlCLFVBQUEsS0FBSyxDQUFDLElBQU4sQ0FBVyxDQUFYLENBQUE7U0FBQTtBQUFBLE9BSkE7YUFNQTtBQUFBLFFBQUMsU0FBQSxPQUFEO0FBQUEsUUFBVSxPQUFBLEtBQVY7UUFQVTtJQUFBLENBL2JaLENBQUE7O0FBQUEsa0NBd2NBLFNBQUEsR0FBVyxTQUFBLEdBQUE7YUFDVDtBQUFBLFFBQ0UsWUFBQSxFQUFjLHFCQURoQjtBQUFBLFFBRUUsT0FBQSxFQUFTLElBQUMsQ0FBQSxTQUFTLENBQUMsR0FBWCxDQUFlLFNBQUMsQ0FBRCxHQUFBO0FBQ3RCLGNBQUEsR0FBQTtBQUFBLFVBQUEsR0FBQSxHQUFNO0FBQUEsWUFDSixJQUFBLEVBQU0sQ0FBQyxDQUFDLElBREo7QUFBQSxZQUVKLEtBQUEsRUFBTyxDQUFDLENBQUMsS0FGTDtBQUFBLFlBR0osSUFBQSxFQUFNLENBQUMsQ0FBQyxJQUhKO0FBQUEsWUFJSixLQUFBLEVBQU8sQ0FBQyxDQUFDLEtBSkw7QUFBQSxZQUtKLElBQUEsRUFBTSxDQUFDLENBQUMsSUFMSjtXQUFOLENBQUE7QUFRQSxVQUFBLElBQTBCLENBQUMsQ0FBQyxXQUE1QjtBQUFBLFlBQUEsR0FBRyxDQUFDLFdBQUosR0FBa0IsSUFBbEIsQ0FBQTtXQVJBO0FBU0EsVUFBQSxJQUEyQixDQUFDLENBQUMsWUFBN0I7QUFBQSxZQUFBLEdBQUcsQ0FBQyxZQUFKLEdBQW1CLElBQW5CLENBQUE7V0FUQTtBQVdBLFVBQUEsSUFBRyxDQUFDLENBQUMsT0FBTDtBQUNFLFlBQUEsR0FBRyxDQUFDLE9BQUosR0FBYyxJQUFkLENBQUE7QUFBQSxZQUNBLEdBQUcsQ0FBQyxLQUFKLEdBQVksQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFSLENBQUEsQ0FEWixDQUFBO0FBRUEsWUFBQSxJQUFxQyx5QkFBckM7QUFBQSxjQUFBLEdBQUcsQ0FBQyxTQUFKLEdBQWdCLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBeEIsQ0FBQTthQUhGO1dBWEE7aUJBZ0JBLElBakJzQjtRQUFBLENBQWYsQ0FGWDtRQURTO0lBQUEsQ0F4Y1gsQ0FBQTs7K0JBQUE7O01BTkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/vitaminafront/.atom/packages/pigments/lib/variables-collection.coffee
