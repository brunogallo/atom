Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

var _mobx = require('mobx');

var _season = require('season');

var _season2 = _interopRequireDefault(_season);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _underscorePlus = require('underscore-plus');

var _underscorePlus2 = _interopRequireDefault(_underscorePlus);

'use babel';

var FileStore = (function () {
  var _instanceInitializers = {};
  var _instanceInitializers = {};

  _createDecoratedClass(FileStore, [{
    key: 'data',
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return (0, _mobx.asFlat)([]);
    },
    enumerable: true
  }], null, _instanceInitializers);

  function FileStore() {
    var _this = this;

    _classCallCheck(this, FileStore);

    _defineDecoratedPropertyDescriptor(this, 'data', _instanceInitializers);

    this.templates = [];

    _fs2['default'].exists(FileStore.getPath(), function (exists) {
      if (exists) {
        _this.observeFile();
      } else {
        _this.store([]);
        _this.observeFile();
      }
    });
  }

  _createDecoratedClass(FileStore, [{
    key: 'fetch',
    decorators: [_mobx.action],
    value: function fetch() {
      var _this2 = this;

      _season2['default'].readFile(FileStore.getPath(), function (err, data) {
        var results = [];
        if (err) {
          _this2.handleError(err);
        }
        if (!err) {
          results = data;
        }

        _this2.data.clear();
        _this2.templates = [];

        // Support for old structure.
        if (Array.isArray(results) === false) {
          results = Object.keys(results).map(function (k) {
            return results[k];
          });
        }

        // Make sure we have an array.
        if (Array.isArray(results) === false) {
          results = [];
        }

        var _loop = function (_result) {
          var templateName = _result.template || null;

          if (templateName) {
            var template = results.filter(function (props) {
              return props.title === templateName;
            });

            if (template.length) {
              _result = _underscorePlus2['default'].deepExtend({}, template[0], _result);
            }
          }

          if (_this2.isProject(_result)) {
            _result.source = 'file';

            _this2.data.push(_result);
          } else {
            _this2.templates.push(_result);
          }
          result = _result;
        };

        for (var result of results) {
          _loop(result);
        }
      });
    }
  }, {
    key: 'handleError',
    value: function handleError(err) {
      switch (err.name) {
        case 'SyntaxError':
          {
            atom.notifications.addError('There is a syntax error in your projects file. Run **Project Manager: Edit Projects** to open and fix the issue.', {
              detail: err.message,
              description: 'Line: ' + err.location.first_line + ' Row: ' + err.location.first_column,
              dismissable: true
            });
            break;
          }

        default:
          {
            // No default.
          }
      }
    }
  }, {
    key: 'isProject',
    value: function isProject(settings) {
      if (typeof settings.paths === 'undefined') {
        return false;
      }

      if (settings.paths.length === 0) {
        return false;
      }

      return true;
    }
  }, {
    key: 'store',
    value: function store(projects) {
      var store = projects.concat(this.templates);
      try {
        _season2['default'].writeFileSync(FileStore.getPath(), store);
      } catch (e) {
        // console.log(e);
      }
    }
  }, {
    key: 'observeFile',
    value: function observeFile() {
      var _this3 = this;

      if (this.fileWatcher) {
        this.fileWatcher.close();
      }

      try {
        this.fileWatcher = _fs2['default'].watch(FileStore.getPath(), function () {
          _this3.fetch();
        });
      } catch (error) {
        // console.log(error);
      }
    }
  }], [{
    key: 'getPath',
    value: function getPath() {
      var filedir = atom.getConfigDirPath();
      var envSettings = atom.config.get('project-manager.environmentSpecificProjects');
      var filename = 'projects.cson';

      if (envSettings) {
        var hostname = _os2['default'].hostname().split('.').shift().toLowerCase();
        filename = 'projects.' + hostname + '.cson';
      }

      return filedir + '/' + filename;
    }
  }], _instanceInitializers);

  return FileStore;
})();

exports['default'] = FileStore;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92aXRhbWluYWZyb250Ly5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvc3RvcmVzL0ZpbGVTdG9yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7b0JBRTJDLE1BQU07O3NCQUNoQyxRQUFROzs7O2tCQUNWLElBQUk7Ozs7a0JBQ0osSUFBSTs7Ozs4QkFDTCxpQkFBaUI7Ozs7QUFOL0IsV0FBVyxDQUFDOztJQVFTLFNBQVM7Ozs7d0JBQVQsU0FBUzs7OzthQUNULGtCQUFPLEVBQUUsQ0FBQzs7Ozs7QUFHbEIsV0FKUSxTQUFTLEdBSWQ7OzswQkFKSyxTQUFTOzs7O1NBRTVCLFNBQVMsR0FBRyxFQUFFOztBQUdaLG9CQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLEVBQUUsVUFBQSxNQUFNLEVBQUk7QUFDdkMsVUFBSSxNQUFNLEVBQUU7QUFDVixjQUFLLFdBQVcsRUFBRSxDQUFDO09BQ3BCLE1BQU07QUFDTCxjQUFLLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNmLGNBQUssV0FBVyxFQUFFLENBQUM7T0FDcEI7S0FDRixDQUFDLENBQUM7R0FDSjs7d0JBYmtCLFNBQVM7OztXQTRCZixpQkFBRzs7O0FBQ2QsMEJBQUssUUFBUSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxVQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUs7QUFDaEQsWUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLFlBQUksR0FBRyxFQUFFO0FBQ1AsaUJBQUssV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3ZCO0FBQ0QsWUFBSSxDQUFDLEdBQUcsRUFBRTtBQUNSLGlCQUFPLEdBQUcsSUFBSSxDQUFDO1NBQ2hCOztBQUVELGVBQUssSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2xCLGVBQUssU0FBUyxHQUFHLEVBQUUsQ0FBQzs7O0FBR3BCLFlBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENB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QUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0FBQ3hDLFVBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7QUFDbkYsVUFBSSxRQUFRLEdBQUcsZUFBZSxDQUFDOztBQUUvQixVQUFJLFdBQVcsRUFBRTtBQUNmLFlBQU0sUUFBUSxHQUFHLGdCQUFHLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUNoRSxnQkFBUSxpQkFBZSxRQUFRLFVBQU8sQ0FBQztPQUN4Qzs7QUFFRCxhQUFVLE9BQU8sU0FBSSxRQUFRLENBQUc7S0FDakM7OztTQTFCa0IsU0FBUzs7O3FCQUFULFNBQVMiLCJmaWxlIjoiL1VzZXJzL3ZpdGFtaW5hZnJvbnQvLmF0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL2xpYi9zdG9yZXMvRmlsZVN0b3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IG9ic2VydmFibGUsIGFjdGlvbiwgYXNGbGF0IH0gZnJvbSAnbW9ieCc7XG5pbXBvcnQgQ1NPTiBmcm9tICdzZWFzb24nO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBvcyBmcm9tICdvcyc7XG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlLXBsdXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaWxlU3RvcmUge1xuICBAb2JzZXJ2YWJsZSBkYXRhID0gYXNGbGF0KFtdKTtcbiAgdGVtcGxhdGVzID0gW107XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgZnMuZXhpc3RzKEZpbGVTdG9yZS5nZXRQYXRoKCksIGV4aXN0cyA9PiB7XG4gICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgIHRoaXMub2JzZXJ2ZUZpbGUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RvcmUoW10pO1xuICAgICAgICB0aGlzLm9ic2VydmVGaWxlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgZ2V0UGF0aCgpIHtcbiAgICBjb25zdCBmaWxlZGlyID0gYXRvbS5nZXRDb25maWdEaXJQYXRoKCk7XG4gICAgY29uc3QgZW52U2V0dGluZ3MgPSBhdG9tLmNvbmZpZy5nZXQoJ3Byb2plY3QtbWFuYWdlci5lbnZpcm9ubWVudFNwZWNpZmljUHJvamVjdHMnKTtcbiAgICBsZXQgZmlsZW5hbWUgPSAncHJvamVjdHMuY3Nvbic7XG5cbiAgICBpZiAoZW52U2V0dGluZ3MpIHtcbiAgICAgIGNvbnN0IGhvc3RuYW1lID0gb3MuaG9zdG5hbWUoKS5zcGxpdCgnLicpLnNoaWZ0KCkudG9Mb3dlckNhc2UoKTtcbiAgICAgIGZpbGVuYW1lID0gYHByb2plY3RzLiR7aG9zdG5hbWV9LmNzb25gO1xuICAgIH1cblxuICAgIHJldHVybiBgJHtmaWxlZGlyfS8ke2ZpbGVuYW1lfWA7XG4gIH1cblxuICBAYWN0aW9uIGZldGNoKCkge1xuICAgIENTT04ucmVhZEZpbGUoRmlsZVN0b3JlLmdldFBhdGgoKSwgKGVyciwgZGF0YSkgPT4ge1xuICAgICAgbGV0IHJlc3VsdHMgPSBbXTtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVFcnJvcihlcnIpO1xuICAgICAgfVxuICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgcmVzdWx0cyA9IGRhdGE7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZGF0YS5jbGVhcigpO1xuICAgICAgdGhpcy50ZW1wbGF0ZXMgPSBbXTtcblxuICAgICAgLy8gU3VwcG9ydCBmb3Igb2xkIHN0cnVjdHVyZS5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHJlc3VsdHMpID09PSBmYWxzZSkge1xuICAgICAgICByZXN1bHRzID0gT2JqZWN0LmtleXMocmVzdWx0cykubWFwKGsgPT4gcmVzdWx0c1trXSk7XG4gICAgICB9XG5cbiAgICAgIC8vIE1ha2Ugc3VyZSB3ZSBoYXZlIGFuIGFycmF5LlxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVzdWx0cykgPT09IGZhbHNlKSB7XG4gICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgcmVzdWx0IG9mIHJlc3VsdHMpIHtcbiAgICAgICAgY29uc3QgdGVtcGxhdGVOYW1lID0gcmVzdWx0LnRlbXBsYXRlIHx8IG51bGw7XG5cbiAgICAgICAgaWYgKHRlbXBsYXRlTmFtZSkge1xuICAgICAgICAgIGNvbnN0IHRlbXBsYXRlID0gcmVzdWx0cy5maWx0ZXIocHJvcHMgPT4gcHJvcHMudGl0bGUgPT09IHRlbXBsYXRlTmFtZSk7XG5cbiAgICAgICAgICBpZiAodGVtcGxhdGUubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBfLmRlZXBFeHRlbmQoe30sIHRlbXBsYXRlWzBdLCByZXN1bHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmlzUHJvamVjdChyZXN1bHQpKSB7XG4gICAgICAgICAgcmVzdWx0LnNvdXJjZSA9ICdmaWxlJztcblxuICAgICAgICAgIHRoaXMuZGF0YS5wdXNoKHJlc3VsdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy50ZW1wbGF0ZXMucHVzaChyZXN1bHQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBoYW5kbGVFcnJvcihlcnIpIHtcbiAgICBzd2l0Y2ggKGVyci5uYW1lKSB7XG4gICAgICBjYXNlICdTeW50YXhFcnJvcic6IHtcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdUaGVyZSBpcyBhIHN5bnRheCBlcnJvciBpbiB5b3VyIHByb2plY3RzIGZpbGUuIFJ1biAqKlByb2plY3QgTWFuYWdlcjogRWRpdCBQcm9qZWN0cyoqIHRvIG9wZW4gYW5kIGZpeCB0aGUgaXNzdWUuJywge1xuICAgICAgICAgIGRldGFpbDogZXJyLm1lc3NhZ2UsXG4gICAgICAgICAgZGVzY3JpcHRpb246IGBMaW5lOiAke2Vyci5sb2NhdGlvbi5maXJzdF9saW5lfSBSb3c6ICR7ZXJyLmxvY2F0aW9uLmZpcnN0X2NvbHVtbn1gLFxuICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgLy8gTm8gZGVmYXVsdC5cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpc1Byb2plY3Qoc2V0dGluZ3MpIHtcbiAgICBpZiAodHlwZW9mIHNldHRpbmdzLnBhdGhzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChzZXR0aW5ncy5wYXRocy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHN0b3JlKHByb2plY3RzKSB7XG4gICAgY29uc3Qgc3RvcmUgPSBwcm9qZWN0cy5jb25jYXQodGhpcy50ZW1wbGF0ZXMpO1xuICAgIHRyeSB7XG4gICAgICBDU09OLndyaXRlRmlsZVN5bmMoRmlsZVN0b3JlLmdldFBhdGgoKSwgc3RvcmUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGUpO1xuICAgIH1cbiAgfVxuXG4gIG9ic2VydmVGaWxlKCkge1xuICAgIGlmICh0aGlzLmZpbGVXYXRjaGVyKSB7XG4gICAgICB0aGlzLmZpbGVXYXRjaGVyLmNsb3NlKCk7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuZmlsZVdhdGNoZXIgPSBmcy53YXRjaChGaWxlU3RvcmUuZ2V0UGF0aCgpLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuZmV0Y2goKTtcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAvLyBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfVxuICB9XG59XG4iXX0=
//# sourceURL=/Users/vitaminafront/.atom/packages/project-manager/lib/stores/FileStore.js
