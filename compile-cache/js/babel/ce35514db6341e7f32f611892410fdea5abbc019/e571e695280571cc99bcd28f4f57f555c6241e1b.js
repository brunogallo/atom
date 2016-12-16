Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.editComponent = editComponent;
exports.activate = activate;
exports.deactivate = deactivate;
exports.provideProjects = provideProjects;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mobx = require('mobx');

var _atom = require('atom');

var _Manager = require('./Manager');

var _Manager2 = _interopRequireDefault(_Manager);

var _viewsViewUri = require('./views/view-uri');

'use babel';

var disposables = null;
var projectsListView = null;
var FileStore = null;

function editComponent() {
  var EditView = require('./views/EditView');

  return new EditView({ project: _Manager2['default'].activeProject });
}

function activate() {
  var _this = this;

  disposables = new _atom.CompositeDisposable();

  disposables.add(atom.workspace.addOpener(function (uri) {
    if (uri === _viewsViewUri.EDIT_URI || uri === _viewsViewUri.SAVE_URI) {
      return editComponent();
    }

    return null;
  }));

  disposables.add(atom.commands.add('atom-workspace', {
    'project-manager:list-projects': function projectManagerListProjects() {
      if (!_this.projectsListView) {
        var ProjectsListView = require('./views/projects-list-view');

        projectsListView = new ProjectsListView();
      }

      projectsListView.toggle();
    },
    'project-manager:edit-projects': function projectManagerEditProjects() {
      if (!FileStore) {
        FileStore = require('./stores/FileStore');
      }

      atom.workspace.open(FileStore.getPath());
    },
    'project-manager:save-project': function projectManagerSaveProject() {
      atom.workspace.open(_viewsViewUri.SAVE_URI);
    },
    'project-manager:edit-project': function projectManagerEditProject() {
      atom.workspace.open(_viewsViewUri.EDIT_URI);
    },
    'project-manager:update-projects': function projectManagerUpdateProjects() {
      _Manager2['default'].fetchProjects();
    }
  }));
}

function deactivate() {
  disposables.dispose();
}

function provideProjects() {
  return {
    getProjects: function getProjects(callback) {
      (0, _mobx.autorun)(function () {
        callback(_Manager2['default'].projects);
      });
    },
    getProject: function getProject(callback) {
      (0, _mobx.autorun)(function () {
        callback(_Manager2['default'].activeProject);
      });
    },
    saveProject: function saveProject(project) {
      _Manager2['default'].saveProject(project);
    },
    openProject: function openProject(project) {
      _Manager2['default'].open(project);
    }
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92aXRhbWluYWZyb250Ly5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvcHJvamVjdC1tYW5hZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRXdCLE1BQU07O29CQUNNLE1BQU07O3VCQUN0QixXQUFXOzs7OzRCQUNJLGtCQUFrQjs7QUFMckQsV0FBVyxDQUFDOztBQU9aLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQztBQUN2QixJQUFJLGdCQUFnQixHQUFHLElBQUksQ0FBQztBQUM1QixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUM7O0FBRWQsU0FBUyxhQUFhLEdBQUc7QUFDOUIsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7O0FBRTdDLFNBQU8sSUFBSSxRQUFRLENBQUMsRUFBRSxPQUFPLEVBQUUscUJBQVEsYUFBYSxFQUFFLENBQUMsQ0FBQztDQUN6RDs7QUFFTSxTQUFTLFFBQVEsR0FBRzs7O0FBQ3pCLGFBQVcsR0FBRywrQkFBeUIsQ0FBQzs7QUFFeEMsYUFBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxVQUFDLEdBQUcsRUFBSztBQUNoRCxRQUFJLEdBQUcsMkJBQWEsSUFBSSxHQUFHLDJCQUFhLEVBQUU7QUFDeEMsYUFBTyxhQUFhLEVBQUUsQ0FBQztLQUN4Qjs7QUFFRCxXQUFPLElBQUksQ0FBQztHQUNiLENBQUMsQ0FBQyxDQUFDOztBQUVKLGFBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUU7QUFDbEQsbUNBQStCLEVBQUUsc0NBQU07QUFDckMsVUFBSSxDQUFDLE1BQUssZ0JBQWdCLEVBQUU7QUFDMUIsWUFBTSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQzs7QUFFL0Qsd0JBQWdCLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO09BQzNDOztBQUVELHNCQUFnQixDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQzNCO0FBQ0QsbUNBQStCLEVBQUUsc0NBQU07QUFDckMsVUFBSSxDQUFDLFNBQVMsRUFBRTtBQUNkLGlCQUFTLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7T0FDM0M7O0FBRUQsVUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7S0FDMUM7QUFDRCxrQ0FBOEIsRUFBRSxxQ0FBTTtBQUNwQyxVQUFJLENBQUMsU0FBUyxDQUFDLElBQUksd0JBQVUsQ0FBQztLQUMvQjtBQUNELGtDQUE4QixFQUFFLHFDQUFNO0FBQ3BDLFVBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSx3QkFBVSxDQUFDO0tBQy9CO0FBQ0QscUNBQWlDLEVBQUUsd0NBQU07QUFDdkMsMkJBQVEsYUFBYSxFQUFFLENBQUM7S0FDekI7R0FDRixDQUFDLENBQUMsQ0FBQztDQUNMOztBQUVNLFNBQVMsVUFBVSxHQUFHO0FBQzNCLGFBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztDQUN2Qjs7QUFFTSxTQUFTLGVBQWUsR0FBRztBQUNoQyxTQUFPO0FBQ0wsZUFBVyxFQUFFLHFCQUFDLFFBQVEsRUFBSztBQUN6Qix5QkFBUSxZQUFNO0FBQ1osZ0JBQVEsQ0FBQyxxQkFBUSxRQUFRLENBQUMsQ0FBQztPQUM1QixDQUFDLENBQUM7S0FDSjtBQUNELGNBQVUsRUFBRSxvQkFBQyxRQUFRLEVBQUs7QUFDeEIseUJBQVEsWUFBTTtBQUNaLGdCQUFRLENBQUMscUJBQVEsYUFBYSxDQUFDLENBQUM7T0FDakMsQ0FBQyxDQUFDO0tBQ0o7QUFDRCxlQUFXLEVBQUUscUJBQUMsT0FBTyxFQUFLO0FBQ3hCLDJCQUFRLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUM5QjtBQUNELGVBQVcsRUFBRSxxQkFBQyxPQUFPLEVBQUs7QUFDeEIsMkJBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ3ZCO0dBQ0YsQ0FBQztDQUNIIiwiZmlsZSI6Ii9Vc2Vycy92aXRhbWluYWZyb250Ly5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvcHJvamVjdC1tYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IGF1dG9ydW4gfSBmcm9tICdtb2J4JztcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJztcbmltcG9ydCBtYW5hZ2VyIGZyb20gJy4vTWFuYWdlcic7XG5pbXBvcnQgeyBTQVZFX1VSSSwgRURJVF9VUkkgfSBmcm9tICcuL3ZpZXdzL3ZpZXctdXJpJztcblxubGV0IGRpc3Bvc2FibGVzID0gbnVsbDtcbmxldCBwcm9qZWN0c0xpc3RWaWV3ID0gbnVsbDtcbmxldCBGaWxlU3RvcmUgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gZWRpdENvbXBvbmVudCgpIHtcbiAgY29uc3QgRWRpdFZpZXcgPSByZXF1aXJlKCcuL3ZpZXdzL0VkaXRWaWV3Jyk7XG5cbiAgcmV0dXJuIG5ldyBFZGl0Vmlldyh7IHByb2plY3Q6IG1hbmFnZXIuYWN0aXZlUHJvamVjdCB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgZGlzcG9zYWJsZXMuYWRkKGF0b20ud29ya3NwYWNlLmFkZE9wZW5lcigodXJpKSA9PiB7XG4gICAgaWYgKHVyaSA9PT0gRURJVF9VUkkgfHwgdXJpID09PSBTQVZFX1VSSSkge1xuICAgICAgcmV0dXJuIGVkaXRDb21wb25lbnQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfSkpO1xuXG4gIGRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCB7XG4gICAgJ3Byb2plY3QtbWFuYWdlcjpsaXN0LXByb2plY3RzJzogKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLnByb2plY3RzTGlzdFZpZXcpIHtcbiAgICAgICAgY29uc3QgUHJvamVjdHNMaXN0VmlldyA9IHJlcXVpcmUoJy4vdmlld3MvcHJvamVjdHMtbGlzdC12aWV3Jyk7XG5cbiAgICAgICAgcHJvamVjdHNMaXN0VmlldyA9IG5ldyBQcm9qZWN0c0xpc3RWaWV3KCk7XG4gICAgICB9XG5cbiAgICAgIHByb2plY3RzTGlzdFZpZXcudG9nZ2xlKCk7XG4gICAgfSxcbiAgICAncHJvamVjdC1tYW5hZ2VyOmVkaXQtcHJvamVjdHMnOiAoKSA9PiB7XG4gICAgICBpZiAoIUZpbGVTdG9yZSkge1xuICAgICAgICBGaWxlU3RvcmUgPSByZXF1aXJlKCcuL3N0b3Jlcy9GaWxlU3RvcmUnKTtcbiAgICAgIH1cblxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihGaWxlU3RvcmUuZ2V0UGF0aCgpKTtcbiAgICB9LFxuICAgICdwcm9qZWN0LW1hbmFnZXI6c2F2ZS1wcm9qZWN0JzogKCkgPT4ge1xuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihTQVZFX1VSSSk7XG4gICAgfSxcbiAgICAncHJvamVjdC1tYW5hZ2VyOmVkaXQtcHJvamVjdCc6ICgpID0+IHtcbiAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oRURJVF9VUkkpO1xuICAgIH0sXG4gICAgJ3Byb2plY3QtbWFuYWdlcjp1cGRhdGUtcHJvamVjdHMnOiAoKSA9PiB7XG4gICAgICBtYW5hZ2VyLmZldGNoUHJvamVjdHMoKTtcbiAgICB9LFxuICB9KSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWFjdGl2YXRlKCkge1xuICBkaXNwb3NhYmxlcy5kaXNwb3NlKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm92aWRlUHJvamVjdHMoKSB7XG4gIHJldHVybiB7XG4gICAgZ2V0UHJvamVjdHM6IChjYWxsYmFjaykgPT4ge1xuICAgICAgYXV0b3J1bigoKSA9PiB7XG4gICAgICAgIGNhbGxiYWNrKG1hbmFnZXIucHJvamVjdHMpO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBnZXRQcm9qZWN0OiAoY2FsbGJhY2spID0+IHtcbiAgICAgIGF1dG9ydW4oKCkgPT4ge1xuICAgICAgICBjYWxsYmFjayhtYW5hZ2VyLmFjdGl2ZVByb2plY3QpO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBzYXZlUHJvamVjdDogKHByb2plY3QpID0+IHtcbiAgICAgIG1hbmFnZXIuc2F2ZVByb2plY3QocHJvamVjdCk7XG4gICAgfSxcbiAgICBvcGVuUHJvamVjdDogKHByb2plY3QpID0+IHtcbiAgICAgIG1hbmFnZXIub3Blbihwcm9qZWN0KTtcbiAgICB9LFxuICB9O1xufVxuIl19
//# sourceURL=/Users/vitaminafront/.atom/packages/project-manager/lib/project-manager.js
