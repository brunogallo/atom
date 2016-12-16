Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

var _mobx = require('mobx');

var _mobx2 = _interopRequireDefault(_mobx);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _season = require('season');

var _season2 = _interopRequireDefault(_season);

'use babel';

var Project = (function () {
  var _instanceInitializers = {};
  var _instanceInitializers = {};

  _createDecoratedClass(Project, [{
    key: 'props',
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return {};
    },
    enumerable: true
  }, {
    key: 'title',
    decorators: [_mobx.computed],
    get: function get() {
      return this.props.title;
    }
  }, {
    key: 'paths',
    decorators: [_mobx.computed],
    get: function get() {
      var paths = this.props.paths.map(function (path) {
        if (path.charAt(0) === '~') {
          return path.replace('~', _os2['default'].homedir());
        }

        return path;
      });

      return paths;
    }
  }, {
    key: 'group',
    decorators: [_mobx.computed],
    get: function get() {
      return this.props.group;
    }
  }, {
    key: 'rootPath',
    decorators: [_mobx.computed],
    get: function get() {
      return this.paths[0];
    }
  }, {
    key: 'isCurrent',
    decorators: [_mobx.computed],
    get: function get() {
      var activePath = atom.project.getPaths()[0];

      if (activePath === this.rootPath) {
        return true;
      }

      return false;
    }
  }], [{
    key: 'defaultProps',
    get: function get() {
      return {
        title: '',
        group: '',
        paths: [],
        icon: 'icon-chevron-right',
        settings: {},
        devMode: false,
        template: null,
        source: null
      };
    }
  }], _instanceInitializers);

  function Project(props) {
    _classCallCheck(this, Project);

    _defineDecoratedPropertyDescriptor(this, 'props', _instanceInitializers);

    (0, _mobx.extendObservable)(this.props, Project.defaultProps);
    this.updateProps(props);
  }

  _createDecoratedClass(Project, [{
    key: 'updateProps',
    value: function updateProps(props) {
      (0, _mobx.extendObservable)(this.props, props);
    }
  }, {
    key: 'getProps',
    value: function getProps() {
      return _mobx2['default'].toJS(this.props);
    }
  }, {
    key: 'getChangedProps',
    value: function getChangedProps() {
      var _getProps = this.getProps();

      var props = _objectWithoutProperties(_getProps, []);

      var defaults = Project.defaultProps;

      Object.keys(defaults).forEach(function (key) {
        switch (key) {
          case 'settings':
            {
              if (Object.keys(props[key]).length === 0) {
                delete props[key];
              }
              break;
            }

          default:
            {
              if (props[key] === defaults[key]) {
                delete props[key];
              }
            }
        }
      });

      return props;
    }
  }, {
    key: 'fetchLocalSettings',
    decorators: [_mobx.action],
    value: function fetchLocalSettings() {
      var _this = this;

      var file = this.rootPath + '/project.cson';
      _season2['default'].readFile(file, function (err, settings) {
        if (err) {
          return;
        }

        (0, _mobx.extendObservable)(_this.props.settings, settings);
      });
    }
  }, {
    key: 'lastModified',
    get: function get() {
      var mtime = 0;
      try {
        var stats = _fs2['default'].statSync(this.rootPath);
        mtime = stats.mtime;
      } catch (e) {
        mtime = new Date(0);
      }

      return mtime;
    }

    /**
     * Fetch settings that are saved locally with the project
     * if there are any.
     */
  }], null, _instanceInitializers);

  return Project;
})();

exports['default'] = Project;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92aXRhbWluYWZyb250Ly5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvbW9kZWxzL1Byb2plY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7b0JBRXFFLE1BQU07Ozs7a0JBQzVELElBQUk7Ozs7a0JBQ0osSUFBSTs7OztzQkFDRixRQUFROzs7O0FBTHpCLFdBQVcsQ0FBQzs7SUFPUyxPQUFPOzs7O3dCQUFQLE9BQU87Ozs7YUFDTixFQUFFOzs7Ozs7U0FFSCxlQUFHO0FBQ3BCLGFBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7S0FDekI7Ozs7U0FFa0IsZUFBRztBQUNwQixVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxJQUFJLEVBQUk7QUFDekMsWUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRTtBQUMxQixpQkFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxnQkFBRyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1NBQ3hDOztBQUVELGVBQU8sSUFBSSxDQUFDO09BQ2IsQ0FBQyxDQUFDOztBQUVILGFBQU8sS0FBSyxDQUFDO0tBQ2Q7Ozs7U0FFa0IsZUFBRztBQUNwQixhQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO0tBQ3pCOzs7O1NBRXFCLGVBQUc7QUFDdkIsYUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3RCOzs7O1NBRXNCLGVBQUc7QUFDeEIsVUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFOUMsVUFBSSxVQUFVLEtBQUssSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNoQyxlQUFPLElBQUksQ0FBQztPQUNiOztBQUVELGFBQU8sS0FBSyxDQUFDO0tBQ2Q7OztTQUVzQixlQUFHO0FBQ3hCLGFBQU87QUFDTCxhQUFLLEVBQUUsRUFBRTtBQUNULGFBQUssRUFBRSxFQUFFO0FBQ1QsYUFBSyxFQUFFLEVBQUU7QUFDVCxZQUFJLEVBQUUsb0JBQW9CO0FBQzFCLGdCQUFRLEVBQUUsRUFBRTtBQUNaLGVBQU8sRUFBRSxLQUFLO0FBQ2QsZ0JBQVEsRUFBRSxJQUFJO0FBQ2QsY0FBTSxFQUFFLElBQUk7T0FDYixDQUFDO0tBQ0g7OztBQUVVLFdBbERRLE9BQU8sQ0FrRGQsS0FBSyxFQUFFOzBCQWxEQSxPQUFPOzs7O0FBbUR4QixnQ0FBaUIsSUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDbkQsUUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUN6Qjs7d0JBckRrQixPQUFPOztXQXVEZixxQkFBQyxLQUFLLEVBQUU7QUFDakIsa0NBQWlCLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDckM7OztXQUVPLG9CQUFHO0FBQ1QsYUFBTyxrQkFBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzlCOzs7V0FFYywyQkFBRztzQkFDSyxJQUFJLENBQUMsUUFBUSxFQUFFOztVQUF6QixLQUFLOztBQUNoQixVQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDOztBQUV0QyxZQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUcsRUFBSztBQUNyQyxnQkFBUSxHQUFHO0FBQ1QsZUFBSyxVQUFVO0FBQUU7QUFDZixrQkFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDeEMsdUJBQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2VBQ25CO0FBQ0Qsb0JBQU07YUFDUDs7QUFBQSxBQUVEO0FBQVM7QUFDUCxrQkFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ2hDLHVCQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztlQUNuQjthQUNGO0FBQUEsU0FDRjtPQUNGLENBQUMsQ0FBQzs7QUFFSCxhQUFPLEtBQUssQ0FBQztLQUNkOzs7O1dBa0J5Qiw4QkFBRzs7O0FBQzNCLFVBQU0sSUFBSSxHQUFNLElBQUksQ0FBQyxRQUFRLGtCQUFlLENBQUM7QUFDN0MsMEJBQUssUUFBUSxDQUFDLElBQUksRUFBRSxVQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUs7QUFDckMsWUFBSSxHQUFHLEVBQUU7QUFDUCxpQkFBTztTQUNSOztBQUVELG9DQUFpQixNQUFLLEtBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7T0FDakQsQ0FBQyxDQUFDO0tBQ0o7OztTQXpCZSxlQUFHO0FBQ2pCLFVBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztBQUNkLFVBQUk7QUFDRixZQUFNLEtBQUssR0FBRyxnQkFBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3pDLGFBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO09BQ3JCLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDVixhQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7T0FDckI7O0FBRUQsYUFBTyxLQUFLLENBQUM7S0FDZDs7Ozs7Ozs7U0FqR2tCLE9BQU87OztxQkFBUCxPQUFPIiwiZmlsZSI6Ii9Vc2Vycy92aXRhbWluYWZyb250Ly5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvbW9kZWxzL1Byb2plY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IG1vYngsIHsgb2JzZXJ2YWJsZSwgY29tcHV0ZWQsIGV4dGVuZE9ic2VydmFibGUsIGFjdGlvbiB9IGZyb20gJ21vYngnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBvcyBmcm9tICdvcyc7XG5pbXBvcnQgQ1NPTiBmcm9tICdzZWFzb24nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcm9qZWN0IHtcbiAgQG9ic2VydmFibGUgcHJvcHMgPSB7fVxuXG4gIEBjb21wdXRlZCBnZXQgdGl0bGUoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMudGl0bGU7XG4gIH1cblxuICBAY29tcHV0ZWQgZ2V0IHBhdGhzKCkge1xuICAgIGNvbnN0IHBhdGhzID0gdGhpcy5wcm9wcy5wYXRocy5tYXAocGF0aCA9PiB7XG4gICAgICBpZiAocGF0aC5jaGFyQXQoMCkgPT09ICd+Jykge1xuICAgICAgICByZXR1cm4gcGF0aC5yZXBsYWNlKCd+Jywgb3MuaG9tZWRpcigpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHBhdGg7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcGF0aHM7XG4gIH1cblxuICBAY29tcHV0ZWQgZ2V0IGdyb3VwKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLmdyb3VwO1xuICB9XG5cbiAgQGNvbXB1dGVkIGdldCByb290UGF0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXRoc1swXTtcbiAgfVxuXG4gIEBjb21wdXRlZCBnZXQgaXNDdXJyZW50KCkge1xuICAgIGNvbnN0IGFjdGl2ZVBhdGggPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXTtcblxuICAgIGlmIChhY3RpdmVQYXRoID09PSB0aGlzLnJvb3RQYXRoKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzdGF0aWMgZ2V0IGRlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdGl0bGU6ICcnLFxuICAgICAgZ3JvdXA6ICcnLFxuICAgICAgcGF0aHM6IFtdLFxuICAgICAgaWNvbjogJ2ljb24tY2hldnJvbi1yaWdodCcsXG4gICAgICBzZXR0aW5nczoge30sXG4gICAgICBkZXZNb2RlOiBmYWxzZSxcbiAgICAgIHRlbXBsYXRlOiBudWxsLFxuICAgICAgc291cmNlOiBudWxsLFxuICAgIH07XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIGV4dGVuZE9ic2VydmFibGUodGhpcy5wcm9wcywgUHJvamVjdC5kZWZhdWx0UHJvcHMpO1xuICAgIHRoaXMudXBkYXRlUHJvcHMocHJvcHMpO1xuICB9XG5cbiAgdXBkYXRlUHJvcHMocHJvcHMpIHtcbiAgICBleHRlbmRPYnNlcnZhYmxlKHRoaXMucHJvcHMsIHByb3BzKTtcbiAgfVxuXG4gIGdldFByb3BzKCkge1xuICAgIHJldHVybiBtb2J4LnRvSlModGhpcy5wcm9wcyk7XG4gIH1cblxuICBnZXRDaGFuZ2VkUHJvcHMoKSB7XG4gICAgY29uc3QgeyAuLi5wcm9wcyB9ID0gdGhpcy5nZXRQcm9wcygpO1xuICAgIGNvbnN0IGRlZmF1bHRzID0gUHJvamVjdC5kZWZhdWx0UHJvcHM7XG5cbiAgICBPYmplY3Qua2V5cyhkZWZhdWx0cykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgICBjYXNlICdzZXR0aW5ncyc6IHtcbiAgICAgICAgICBpZiAoT2JqZWN0LmtleXMocHJvcHNba2V5XSkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBkZWxldGUgcHJvcHNba2V5XTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgaWYgKHByb3BzW2tleV0gPT09IGRlZmF1bHRzW2tleV0pIHtcbiAgICAgICAgICAgIGRlbGV0ZSBwcm9wc1trZXldO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb3BzO1xuICB9XG5cbiAgZ2V0IGxhc3RNb2RpZmllZCgpIHtcbiAgICBsZXQgbXRpbWUgPSAwO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBzdGF0cyA9IGZzLnN0YXRTeW5jKHRoaXMucm9vdFBhdGgpO1xuICAgICAgbXRpbWUgPSBzdGF0cy5tdGltZTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBtdGltZSA9IG5ldyBEYXRlKDApO1xuICAgIH1cblxuICAgIHJldHVybiBtdGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGZXRjaCBzZXR0aW5ncyB0aGF0IGFyZSBzYXZlZCBsb2NhbGx5IHdpdGggdGhlIHByb2plY3RcbiAgICogaWYgdGhlcmUgYXJlIGFueS5cbiAgICovXG4gIEBhY3Rpb24gZmV0Y2hMb2NhbFNldHRpbmdzKCkge1xuICAgIGNvbnN0IGZpbGUgPSBgJHt0aGlzLnJvb3RQYXRofS9wcm9qZWN0LmNzb25gO1xuICAgIENTT04ucmVhZEZpbGUoZmlsZSwgKGVyciwgc2V0dGluZ3MpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBleHRlbmRPYnNlcnZhYmxlKHRoaXMucHJvcHMuc2V0dGluZ3MsIHNldHRpbmdzKTtcbiAgICB9KTtcbiAgfVxufVxuIl19
//# sourceURL=/Users/vitaminafront/.atom/packages/project-manager/lib/models/Project.js
