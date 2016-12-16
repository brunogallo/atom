Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _underscorePlus = require('underscore-plus');

var _underscorePlus2 = _interopRequireDefault(_underscorePlus);

'use babel';

var Settings = (function () {
  function Settings() {
    _classCallCheck(this, Settings);
  }

  _createClass(Settings, [{
    key: 'update',
    value: function update() {
      var settings = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      this.load(settings);
    }
  }, {
    key: 'load',
    value: function load() {
      var values = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var settings = values;
      if ('global' in settings) {
        settings['*'] = settings.global;
        delete settings.global;
      }

      if ('*' in settings) {
        var scopedSettings = settings;
        settings = settings['*'];
        delete scopedSettings['*'];

        for (var scope of Object.keys(scopedSettings)) {
          var setting = scopedSettings[scope];
          this.set(setting, scope);
        }
      }

      this.set(settings);
    }
  }, {
    key: 'set',
    value: function set(settings, scope) {
      var flatSettings = {};
      var options = scope ? { scopeSelector: scope } : {};
      var value = undefined;
      options.save = false;
      this.flatten(flatSettings, settings);

      for (var key of Object.keys(flatSettings)) {
        value = flatSettings[key];
        atom.config.set(key, value, options);
      }
    }
  }, {
    key: 'flatten',
    value: function flatten(root, dict, path) {
      var value = undefined;
      var dotPath = undefined;
      var isObject = undefined;

      for (var key of Object.keys(dict)) {
        value = dict[key];
        dotPath = path ? path + '.' + key : key;
        isObject = !_underscorePlus2['default'].isArray(value) && _underscorePlus2['default'].isObject(value);

        if (isObject) {
          this.flatten(root, dict[key], dotPath);
        } else {
          root[dotPath] = value;
        }
      }
    }
  }]);

  return Settings;
})();

exports['default'] = Settings;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92aXRhbWluYWZyb250Ly5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvU2V0dGluZ3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs4QkFFYyxpQkFBaUI7Ozs7QUFGL0IsV0FBVyxDQUFDOztJQUlTLFFBQVE7V0FBUixRQUFROzBCQUFSLFFBQVE7OztlQUFSLFFBQVE7O1dBQ3JCLGtCQUFnQjtVQUFmLFFBQVEseURBQUcsRUFBRTs7QUFDbEIsVUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNyQjs7O1dBRUcsZ0JBQWM7VUFBYixNQUFNLHlEQUFHLEVBQUU7O0FBQ2QsVUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDO0FBQ3RCLFVBQUksUUFBUSxJQUFJLFFBQVEsRUFBRTtBQUN4QixnQkFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7QUFDaEMsZUFBTyxRQUFRLENBQUMsTUFBTSxDQUFDO09BQ3hCOztBQUVELFVBQUksR0FBRyxJQUFJLFFBQVEsRUFBRTtBQUNuQixZQUFNLGNBQWMsR0FBRyxRQUFRLENBQUM7QUFDaEMsZ0JBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekIsZUFBTyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRTNCLGFBQUssSUFBTSxLQUFLLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsRUFBRTtBQUMvQyxjQUFNLE9BQU8sR0FBRyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdEMsY0FBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDMUI7T0FDRjs7QUFFRCxVQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ3BCOzs7V0FFRSxhQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUU7QUFDbkIsVUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDO0FBQ3hCLFVBQU0sT0FBTyxHQUFHLEtBQUssR0FBRyxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDdEQsVUFBSSxLQUFLLFlBQUEsQ0FBQztBQUNWLGFBQU8sQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO0FBQ3JCLFVBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDOztBQUVyQyxXQUFLLElBQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUU7QUFDM0MsYUFBSyxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMxQixZQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO09BQ3RDO0tBQ0Y7OztXQUVNLGlCQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQ3hCLFVBQUksS0FBSyxZQUFBLENBQUM7QUFDVixVQUFJLE9BQU8sWUFBQSxDQUFDO0FBQ1osVUFBSSxRQUFRLFlBQUEsQ0FBQzs7QUFFYixXQUFLLElBQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDbkMsYUFBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsQixlQUFPLEdBQUcsSUFBSSxHQUFNLElBQUksU0FBSSxHQUFHLEdBQUssR0FBRyxDQUFDO0FBQ3hDLGdCQUFRLEdBQUcsQ0FBQyw0QkFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksNEJBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVsRCxZQUFJLFFBQVEsRUFBRTtBQUNaLGNBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUN4QyxNQUFNO0FBQ0wsY0FBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEtBQUssQ0FBQztTQUN2QjtPQUNGO0tBQ0Y7OztTQXZEa0IsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoiL1VzZXJzL3ZpdGFtaW5hZnJvbnQvLmF0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL2xpYi9TZXR0aW5ncy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlLXBsdXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXR0aW5ncyB7XG4gIHVwZGF0ZShzZXR0aW5ncyA9IHt9KSB7XG4gICAgdGhpcy5sb2FkKHNldHRpbmdzKTtcbiAgfVxuXG4gIGxvYWQodmFsdWVzID0ge30pIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB2YWx1ZXM7XG4gICAgaWYgKCdnbG9iYWwnIGluIHNldHRpbmdzKSB7XG4gICAgICBzZXR0aW5nc1snKiddID0gc2V0dGluZ3MuZ2xvYmFsO1xuICAgICAgZGVsZXRlIHNldHRpbmdzLmdsb2JhbDtcbiAgICB9XG5cbiAgICBpZiAoJyonIGluIHNldHRpbmdzKSB7XG4gICAgICBjb25zdCBzY29wZWRTZXR0aW5ncyA9IHNldHRpbmdzO1xuICAgICAgc2V0dGluZ3MgPSBzZXR0aW5nc1snKiddO1xuICAgICAgZGVsZXRlIHNjb3BlZFNldHRpbmdzWycqJ107XG5cbiAgICAgIGZvciAoY29uc3Qgc2NvcGUgb2YgT2JqZWN0LmtleXMoc2NvcGVkU2V0dGluZ3MpKSB7XG4gICAgICAgIGNvbnN0IHNldHRpbmcgPSBzY29wZWRTZXR0aW5nc1tzY29wZV07XG4gICAgICAgIHRoaXMuc2V0KHNldHRpbmcsIHNjb3BlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNldChzZXR0aW5ncyk7XG4gIH1cblxuICBzZXQoc2V0dGluZ3MsIHNjb3BlKSB7XG4gICAgY29uc3QgZmxhdFNldHRpbmdzID0ge307XG4gICAgY29uc3Qgb3B0aW9ucyA9IHNjb3BlID8geyBzY29wZVNlbGVjdG9yOiBzY29wZSB9IDoge307XG4gICAgbGV0IHZhbHVlO1xuICAgIG9wdGlvbnMuc2F2ZSA9IGZhbHNlO1xuICAgIHRoaXMuZmxhdHRlbihmbGF0U2V0dGluZ3MsIHNldHRpbmdzKTtcblxuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKGZsYXRTZXR0aW5ncykpIHtcbiAgICAgIHZhbHVlID0gZmxhdFNldHRpbmdzW2tleV07XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoa2V5LCB2YWx1ZSwgb3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgZmxhdHRlbihyb290LCBkaWN0LCBwYXRoKSB7XG4gICAgbGV0IHZhbHVlO1xuICAgIGxldCBkb3RQYXRoO1xuICAgIGxldCBpc09iamVjdDtcblxuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKGRpY3QpKSB7XG4gICAgICB2YWx1ZSA9IGRpY3Rba2V5XTtcbiAgICAgIGRvdFBhdGggPSBwYXRoID8gYCR7cGF0aH0uJHtrZXl9YCA6IGtleTtcbiAgICAgIGlzT2JqZWN0ID0gIV8uaXNBcnJheSh2YWx1ZSkgJiYgXy5pc09iamVjdCh2YWx1ZSk7XG5cbiAgICAgIGlmIChpc09iamVjdCkge1xuICAgICAgICB0aGlzLmZsYXR0ZW4ocm9vdCwgZGljdFtrZXldLCBkb3RQYXRoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJvb3RbZG90UGF0aF0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/vitaminafront/.atom/packages/project-manager/lib/Settings.js
