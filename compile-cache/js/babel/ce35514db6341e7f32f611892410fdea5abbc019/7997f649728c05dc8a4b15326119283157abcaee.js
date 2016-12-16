Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

var _mobx = require('mobx');

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _atomProjectUtil = require('atom-project-util');

var _atomProjectUtil2 = _interopRequireDefault(_atomProjectUtil);

var _storesFileStore = require('./stores/FileStore');

var _storesFileStore2 = _interopRequireDefault(_storesFileStore);

var _storesGitStore = require('./stores/GitStore');

var _storesGitStore2 = _interopRequireDefault(_storesGitStore);

var _Settings = require('./Settings');

var _Settings2 = _interopRequireDefault(_Settings);

var _modelsProject = require('./models/Project');

var _modelsProject2 = _interopRequireDefault(_modelsProject);

'use babel';

var Manager = (function () {
  var _instanceInitializers = {};
  var _instanceInitializers = {};

  _createDecoratedClass(Manager, [{
    key: 'addProject',
    decorators: [_mobx.action],
    value: function addProject(props) {
      var foundProject = this.projects.find(function (project) {
        var projectRootPath = project.rootPath.toLowerCase();
        var propsRootPath = props.paths[0].toLowerCase();

        if (propsRootPath.charAt(0) === '~') {
          propsRootPath = propsRootPath.replace('~', _os2['default'].homedir()).toLowerCase();
        }

        return projectRootPath === propsRootPath;
      });

      if (!foundProject) {
        var newProject = new _modelsProject2['default'](props);
        this.projects.push(newProject);
      } else {
        if (foundProject.source === 'file' && props.source === 'file') {
          foundProject.updateProps(props);
        }

        if (props.source === 'file' || typeof props.source === 'undefined') {
          foundProject.updateProps(props);
        }
      }
    }
  }, {
    key: 'projects',
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return [];
    },
    enumerable: true
  }, {
    key: 'activePaths',
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return [];
    },

    /**
     * Create or Update a project.
     *
     * Props coming from file goes before any other source.
     */
    enumerable: true
  }], null, _instanceInitializers);

  function Manager() {
    var _this = this;

    _classCallCheck(this, Manager);

    _defineDecoratedPropertyDescriptor(this, 'projects', _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, 'activePaths', _instanceInitializers);

    this.gitStore = new _storesGitStore2['default']();
    this.fileStore = new _storesFileStore2['default']();
    this.settings = new _Settings2['default']();

    this.fetchProjects();

    atom.config.observe('project-manager.includeGitRepositories', function (include) {
      if (include) {
        _this.gitStore.fetch();
      } else {
        _this.gitStore.empty();
      }
    });

    (0, _mobx.autorun)(function () {
      for (var fileProp of _this.fileStore.data) {
        _this.addProject(fileProp);
      }

      for (var gitProp of _this.gitStore.data) {
        _this.addProject(gitProp);
      }
    });

    (0, _mobx.autorun)(function () {
      if (_this.activeProject) {
        _this.loadProject(_this.activeProject);
      }
    });

    this.activePaths = atom.project.getPaths();
    atom.project.onDidChangePaths(function () {
      _this.activePaths = atom.project.getPaths();
      var activePaths = atom.project.getPaths();

      if (_this.activeProject && _this.activeProject.rootPath === activePaths[0]) {
        if (_this.activeProject.paths.length !== activePaths.length) {
          _this.activeProject.updateProps({ paths: activePaths });
          _this.saveProjects();
        }
      }
    });
  }

  _createDecoratedClass(Manager, [{
    key: 'fetchProjects',
    value: function fetchProjects() {
      this.fileStore.fetch();

      if (atom.config.get('project-manager.includeGitRepositories')) {
        this.gitStore.fetch();
      }
    }
  }, {
    key: 'loadProject',
    value: function loadProject(project) {
      this.settings.load(project.getProps().settings);
    }
  }, {
    key: 'open',
    value: function open(project) {
      var openInSameWindow = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      if (this.isProject(project)) {
        var _project$getProps = project.getProps();

        var devMode = _project$getProps.devMode;

        if (openInSameWindow) {
          _atomProjectUtil2['default']['switch'](project.paths);
        } else {
          atom.open({
            devMode: devMode,
            pathsToOpen: project.paths
          });
        }
      }
    }
  }, {
    key: 'saveProject',
    value: function saveProject(props) {
      var propsToSave = props;
      if (this.isProject(props)) {
        propsToSave = props.getProps();
      }
      this.addProject(_extends({}, propsToSave, { source: 'file' }));
      this.saveProjects();
    }
  }, {
    key: 'saveProjects',
    value: function saveProjects() {
      var projects = this.projects.filter(function (project) {
        return project.props.source === 'file';
      });
      var arr = [];

      for (var project of projects) {
        var props = project.getChangedProps();
        delete props.source;
        arr.push(props);
      }

      this.fileStore.store(arr);
    }
  }, {
    key: 'isProject',
    value: function isProject(project) {
      if (project instanceof _modelsProject2['default']) {
        return true;
      }

      return false;
    }
  }, {
    key: 'activeProject',
    decorators: [_mobx.computed],
    get: function get() {
      var _this2 = this;

      if (this.activePaths.length === 0) {
        return null;
      }

      return this.projects.find(function (project) {
        return project.rootPath === _this2.activePaths[0];
      });
    }
  }], null, _instanceInitializers);

  return Manager;
})();

var manager = new Manager();
exports['default'] = manager;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92aXRhbWluYWZyb250Ly5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvTWFuYWdlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztvQkFFc0QsTUFBTTs7a0JBQzdDLElBQUk7Ozs7K0JBQ0ssbUJBQW1COzs7OytCQUNyQixvQkFBb0I7Ozs7OEJBQ3JCLG1CQUFtQjs7Ozt3QkFDbkIsWUFBWTs7Ozs2QkFDYixrQkFBa0I7Ozs7QUFSdEMsV0FBVyxDQUFDOztJQVVOLE9BQU87Ozs7d0JBQVAsT0FBTzs7O1dBU08sb0JBQUMsS0FBSyxFQUFFO0FBQ3hCLFVBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQUEsT0FBTyxFQUFJO0FBQ2pELFlBQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDdkQsWUFBSSxhQUFhLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQzs7QUFFakQsWUFBSSxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRTtBQUNuQyx1QkFBYSxHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLGdCQUFHLE9BQU8sRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDeEU7O0FBRUQsZUFBTyxlQUFlLEtBQUssYUFBYSxDQUFDO09BQzFDLENBQUMsQ0FBQzs7QUFFSCxVQUFJLENBQUMsWUFBWSxFQUFFO0FBQ2pCLFlBQU0sVUFBVSxHQUFHLCtCQUFZLEtBQUssQ0FBQyxDQUFDO0FBQ3RDLFlBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO09BQ2hDLE1BQU07QUFDTCxZQUFJLFlBQVksQ0FBQyxNQUFNLEtBQUssTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssTUFBTSxFQUFFO0FBQzdE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T0FDYjs7QUFFRCxhQUFPLEtBQUssQ0FBQztLQUNkOzs7O1NBL0QwQixlQUFHOzs7QUFDNUIsVUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDakMsZUFBTyxJQUFJLENBQUM7T0FDYjs7QUFFRCxhQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQUEsT0FBTztlQUFJLE9BQU8sQ0FBQyxRQUFRLEtBQUssT0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDO09BQUEsQ0FBQyxDQUFDO0tBQ2hGOzs7U0F2RkcsT0FBTzs7O0FBbUpiLElBQU0sT0FBTyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7cUJBQ2YsT0FBTyIsImZpbGUiOiIvVXNlcnMvdml0YW1pbmFmcm9udC8uYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL01hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgb2JzZXJ2YWJsZSwgYXV0b3J1biwgY29tcHV0ZWQsIGFjdGlvbiB9IGZyb20gJ21vYngnO1xuaW1wb3J0IG9zIGZyb20gJ29zJztcbmltcG9ydCBwcm9qZWN0VXRpbCBmcm9tICdhdG9tLXByb2plY3QtdXRpbCc7XG5pbXBvcnQgRmlsZVN0b3JlIGZyb20gJy4vc3RvcmVzL0ZpbGVTdG9yZSc7XG5pbXBvcnQgR2l0U3RvcmUgZnJvbSAnLi9zdG9yZXMvR2l0U3RvcmUnO1xuaW1wb3J0IFNldHRpbmdzIGZyb20gJy4vU2V0dGluZ3MnO1xuaW1wb3J0IFByb2plY3QgZnJvbSAnLi9tb2RlbHMvUHJvamVjdCc7XG5cbmNsYXNzIE1hbmFnZXIge1xuICBAb2JzZXJ2YWJsZSBwcm9qZWN0cyA9IFtdO1xuICBAb2JzZXJ2YWJsZSBhY3RpdmVQYXRocyA9IFtdO1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgb3IgVXBkYXRlIGEgcHJvamVjdC5cbiAgICpcbiAgICogUHJvcHMgY29taW5nIGZyb20gZmlsZSBnb2VzIGJlZm9yZSBhbnkgb3RoZXIgc291cmNlLlxuICAgKi9cbiAgQGFjdGlvbiBhZGRQcm9qZWN0KHByb3BzKSB7XG4gICAgY29uc3QgZm91bmRQcm9qZWN0ID0gdGhpcy5wcm9qZWN0cy5maW5kKHByb2plY3QgPT4ge1xuICAgICAgY29uc3QgcHJvamVjdFJvb3RQYXRoID0gcHJvamVjdC5yb290UGF0aC50b0xvd2VyQ2FzZSgpO1xuICAgICAgbGV0IHByb3BzUm9vdFBhdGggPSBwcm9wcy5wYXRoc1swXS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICBpZiAocHJvcHNSb290UGF0aC5jaGFyQXQoMCkgPT09ICd+Jykge1xuICAgICAgICBwcm9wc1Jvb3RQYXRoID0gcHJvcHNSb290UGF0aC5yZXBsYWNlKCd+Jywgb3MuaG9tZWRpcigpKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJvamVjdFJvb3RQYXRoID09PSBwcm9wc1Jvb3RQYXRoO1xuICAgIH0pO1xuXG4gICAgaWYgKCFmb3VuZFByb2plY3QpIHtcbiAgICAgIGNvbnN0IG5ld1Byb2plY3QgPSBuZXcgUHJvamVjdChwcm9wcyk7XG4gICAgICB0aGlzLnByb2plY3RzLnB1c2gobmV3UHJvamVjdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChmb3VuZFByb2plY3Quc291cmNlID09PSAnZmlsZScgJiYgcHJvcHMuc291cmNlID09PSAnZmlsZScpIHtcbiAgICAgICAgZm91bmRQcm9qZWN0LnVwZGF0ZVByb3BzKHByb3BzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHByb3BzLnNvdXJjZSA9PT0gJ2ZpbGUnIHx8IHR5cGVvZiBwcm9wcy5zb3VyY2UgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGZvdW5kUHJvamVjdC51cGRhdGVQcm9wcyhwcm9wcyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5naXRTdG9yZSA9IG5ldyBHaXRTdG9yZSgpO1xuICAgIHRoaXMuZmlsZVN0b3JlID0gbmV3IEZpbGVTdG9yZSgpO1xuICAgIHRoaXMuc2V0dGluZ3MgPSBuZXcgU2V0dGluZ3MoKTtcblxuICAgIHRoaXMuZmV0Y2hQcm9qZWN0cygpO1xuXG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSgncHJvamVjdC1tYW5hZ2VyLmluY2x1ZGVHaXRSZXBvc2l0b3JpZXMnLCAoaW5jbHVkZSkgPT4ge1xuICAgICAgaWYgKGluY2x1ZGUpIHtcbiAgICAgICAgdGhpcy5naXRTdG9yZS5mZXRjaCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5naXRTdG9yZS5lbXB0eSgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgYXV0b3J1bigoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGZpbGVQcm9wIG9mIHRoaXMuZmlsZVN0b3JlLmRhdGEpIHtcbiAgICAgICAgdGhpcy5hZGRQcm9qZWN0KGZpbGVQcm9wKTtcbiAgICAgIH1cblxuICAgICAgZm9yIChjb25zdCBnaXRQcm9wIG9mIHRoaXMuZ2l0U3RvcmUuZGF0YSkge1xuICAgICAgICB0aGlzLmFkZFByb2plY3QoZ2l0UHJvcCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBhdXRvcnVuKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmFjdGl2ZVByb2plY3QpIHtcbiAgICAgICAgdGhpcy5sb2FkUHJvamVjdCh0aGlzLmFjdGl2ZVByb2plY3QpO1xuICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICB0aGlzLmFjdGl2ZVBhdGhzID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKCk7XG4gICAgYXRvbS5wcm9qZWN0Lm9uRGlkQ2hhbmdlUGF0aHMoKCkgPT4ge1xuICAgICAgdGhpcy5hY3RpdmVQYXRocyA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpO1xuICAgICAgY29uc3QgYWN0aXZlUGF0aHMgPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKTtcblxuICAgICAgaWYgKHRoaXMuYWN0aXZlUHJvamVjdCAmJiB0aGlzLmFjdGl2ZVByb2plY3Qucm9vdFBhdGggPT09IGFjdGl2ZVBhdGhzWzBdKSB7XG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZVByb2plY3QucGF0aHMubGVuZ3RoICE9PSBhY3RpdmVQYXRocy5sZW5ndGgpIHtcbiAgICAgICAgICB0aGlzLmFjdGl2ZVByb2plY3QudXBkYXRlUHJvcHMoeyBwYXRoczogYWN0aXZlUGF0aHMgfSk7XG4gICAgICAgICAgdGhpcy5zYXZlUHJvamVjdHMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgQGNvbXB1dGVkIGdldCBhY3RpdmVQcm9qZWN0KCkge1xuICAgIGlmICh0aGlzLmFjdGl2ZVBhdGhzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucHJvamVjdHMuZmluZChwcm9qZWN0ID0+IHByb2plY3Qucm9vdFBhdGggPT09IHRoaXMuYWN0aXZlUGF0aHNbMF0pO1xuICB9XG5cbiAgZmV0Y2hQcm9qZWN0cygpIHtcbiAgICB0aGlzLmZpbGVTdG9yZS5mZXRjaCgpO1xuXG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgncHJvamVjdC1tYW5hZ2VyLmluY2x1ZGVHaXRSZXBvc2l0b3JpZXMnKSkge1xuICAgICAgdGhpcy5naXRTdG9yZS5mZXRjaCgpO1xuICAgIH1cbiAgfVxuXG4gIGxvYWRQcm9qZWN0KHByb2plY3QpIHtcbiAgICB0aGlzLnNldHRpbmdzLmxvYWQocHJvamVjdC5nZXRQcm9wcygpLnNldHRpbmdzKTtcbiAgfVxuXG4gIG9wZW4ocHJvamVjdCwgb3BlbkluU2FtZVdpbmRvdyA9IGZhbHNlKSB7XG4gICAgaWYgKHRoaXMuaXNQcm9qZWN0KHByb2plY3QpKSB7XG4gICAgICBjb25zdCB7IGRldk1vZGUgfSA9IHByb2plY3QuZ2V0UHJvcHMoKTtcblxuICAgICAgaWYgKG9wZW5JblNhbWVXaW5kb3cpIHtcbiAgICAgICAgcHJvamVjdFV0aWwuc3dpdGNoKHByb2plY3QucGF0aHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXRvbS5vcGVuKHtcbiAgICAgICAgICBkZXZNb2RlLFxuICAgICAgICAgIHBhdGhzVG9PcGVuOiBwcm9qZWN0LnBhdGhzLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzYXZlUHJvamVjdChwcm9wcykge1xuICAgIGxldCBwcm9wc1RvU2F2ZSA9IHByb3BzO1xuICAgIGlmICh0aGlzLmlzUHJvamVjdChwcm9wcykpIHtcbiAgICAgIHByb3BzVG9TYXZlID0gcHJvcHMuZ2V0UHJvcHMoKTtcbiAgICB9XG4gICAgdGhpcy5hZGRQcm9qZWN0KHsgLi4ucHJvcHNUb1NhdmUsIHNvdXJjZTogJ2ZpbGUnIH0pO1xuICAgIHRoaXMuc2F2ZVByb2plY3RzKCk7XG4gIH1cblxuICBzYXZlUHJvamVjdHMoKSB7XG4gICAgY29uc3QgcHJvamVjdHMgPSB0aGlzLnByb2plY3RzLmZpbHRlcihwcm9qZWN0ID0+IHByb2plY3QucHJvcHMuc291cmNlID09PSAnZmlsZScpO1xuICAgIGNvbnN0IGFyciA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBwcm9qZWN0IG9mIHByb2plY3RzKSB7XG4gICAgICBjb25zdCBwcm9wcyA9IHByb2plY3QuZ2V0Q2hhbmdlZFByb3BzKCk7XG4gICAgICBkZWxldGUgcHJvcHMuc291cmNlO1xuICAgICAgYXJyLnB1c2gocHJvcHMpO1xuICAgIH1cblxuICAgIHRoaXMuZmlsZVN0b3JlLnN0b3JlKGFycik7XG4gIH1cblxuICBpc1Byb2plY3QocHJvamVjdCkge1xuICAgIGlmIChwcm9qZWN0IGluc3RhbmNlb2YgUHJvamVjdCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmNvbnN0IG1hbmFnZXIgPSBuZXcgTWFuYWdlcigpO1xuZXhwb3J0IGRlZmF1bHQgbWFuYWdlcjtcbiJdfQ==
//# sourceURL=/Users/vitaminafront/.atom/packages/project-manager/lib/Manager.js
