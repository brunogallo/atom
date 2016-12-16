Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomSpacePenViews = require('atom-space-pen-views');

var _underscorePlus = require('underscore-plus');

var _underscorePlus2 = _interopRequireDefault(_underscorePlus);

var _projects = require('./projects');

var _projects2 = _interopRequireDefault(_projects);

'use babel';

var ProjectsListView = (function (_SelectListView) {
  _inherits(ProjectsListView, _SelectListView);

  function ProjectsListView() {
    _classCallCheck(this, ProjectsListView);

    _get(Object.getPrototypeOf(ProjectsListView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ProjectsListView, [{
    key: 'initialize',
    value: function initialize() {
      _get(Object.getPrototypeOf(ProjectsListView.prototype), 'initialize', this).call(this);
      this.addClass('project-manager');
    }
  }, {
    key: 'activate',
    value: function activate() {}
  }, {
    key: 'getFilterKey',
    value: function getFilterKey() {
      var input = this.filterEditorView.getText();
      var inputArr = input.split(':');
      var isFilterKey = _underscorePlus2['default'].contains(this.possibleFilterKeys, inputArr[0]);
      var filter = this.defaultFilterKey;

      if (inputArr.length > 1 && isFilterKey) {
        filter = inputArr[0];
      }

      return filter;
    }
  }, {
    key: 'getFilterQuery',
    value: function getFilterQuery() {
      var input = this.filterEditorView.getText();
      var inputArr = input.split(':');
      var filter = input;

      if (inputArr.length > 1) {
        filter = inputArr[1];
      }

      return filter;
    }
  }, {
    key: 'getEmptyMessage',
    value: function getEmptyMessage(itemCount, filteredItemCount) {
      if (itemCount === 0) {
        return 'No projects saved yet';
      } else {
        _get(Object.getPrototypeOf(ProjectsListView.prototype), 'getEmptyMessage', this).call(this, itemCount, filteredItemCount);
      }
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      var _this = this;

      if (this.panel && this.panel.isVisible()) {
        this.close();
      } else {
        _projects2['default'].getAll(function (projects) {
          return _this.show(projects);
        });
      }
    }
  }, {
    key: 'show',
    value: function show(projects) {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({ item: this });
      }

      var items = [];
      for (var project of projects) {
        var item = _underscorePlus2['default'].clone(project.props);
        item.project = project;
        items.push(item);
      }

      this.panel.show();
      items = this.sortItems(items);
      this.setItems(items);
      this.focusFilterEditor();
    }
  }, {
    key: 'confirmed',
    value: function confirmed(item) {
      if (item && item.project.stats) {
        item.project.open();
        this.close();
      }
    }
  }, {
    key: 'close',
    value: function close() {
      if (this.panel) {
        this.panel.destroy();
        this.panel = null;
      }

      atom.workspace.getActivePane().activate();
    }
  }, {
    key: 'cancelled',
    value: function cancelled() {
      this.close();
    }
  }, {
    key: 'viewForItem',
    value: function viewForItem(_ref) {
      var _id = _ref._id;
      var title = _ref.title;
      var group = _ref.group;
      var icon = _ref.icon;
      var devMode = _ref.devMode;
      var paths = _ref.paths;
      var project = _ref.project;

      var showPath = this.showPath;
      var projectMissing = project.stats ? false : true;

      return (0, _atomSpacePenViews.$$)(function () {
        var _this2 = this;

        this.li({ 'class': 'two-lines' }, { 'data-project-id': _id, 'data-path-missing': projectMissing }, function () {
          _this2.div({ 'class': 'primary-line' }, function () {
            if (devMode) {
              _this2.span({ 'class': 'project-manager-devmode' });
            }

            _this2.div({ 'class': 'icon ' + icon }, function () {
              _this2.span(title);
              if (group != null) {
                _this2.span({ 'class': 'project-manager-list-group' }, group);
              }
            });
          });
          _this2.div({ 'class': 'secondary-line' }, function () {
            if (projectMissing) {
              _this2.div({ 'class': 'icon icon-alert' }, 'Path is not available');
            } else if (showPath) {
              var path = undefined;
              for (path of paths) {
                _this2.div({ 'class': 'no-icon' }, path);
              }
            }
          });
        });
      });
    }
  }, {
    key: 'sortItems',
    value: function sortItems(items) {
      var key = this.sortBy;
      if (key === 'default') {
        return items;
      } else if (key === 'last modified') {
        items.sort(function (a, b) {
          a = a.project.lastModified.getTime();
          b = b.project.lastModified.getTime();

          return a > b ? -1 : 1;
        });
      } else {
        items.sort(function (a, b) {
          a = (a[key] || '￿').toUpperCase();
          b = (b[key] || '￿').toUpperCase();

          return a > b ? 1 : -1;
        });
      }

      return items;
    }
  }, {
    key: 'possibleFilterKeys',
    get: function get() {
      return ['title', 'group', 'template'];
    }
  }, {
    key: 'defaultFilterKey',
    get: function get() {
      return 'title';
    }
  }, {
    key: 'sortBy',
    get: function get() {
      return atom.config.get('project-manager.sortBy');
    }
  }, {
    key: 'showPath',
    get: function get() {
      return atom.config.get('project-manager.showPath');
    }
  }]);

  return ProjectsListView;
})(_atomSpacePenViews.SelectListView);

exports['default'] = ProjectsListView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92aXRhbWluYWZyb250Ly5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvcHJvamVjdHMtbGlzdC12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O2lDQUVpQyxzQkFBc0I7OzhCQUN6QyxpQkFBaUI7Ozs7d0JBQ1YsWUFBWTs7OztBQUpqQyxXQUFXLENBQUM7O0lBTVMsZ0JBQWdCO1lBQWhCLGdCQUFnQjs7V0FBaEIsZ0JBQWdCOzBCQUFoQixnQkFBZ0I7OytCQUFoQixnQkFBZ0I7OztlQUFoQixnQkFBZ0I7O1dBQ3pCLHNCQUFHO0FBQ1gsaUNBRmlCLGdCQUFnQiw0Q0FFZDtBQUNuQixVQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLENBQUM7S0FDbEM7OztXQUVPLG9CQUFHLEVBQ1Y7OztXQWtCVyx3QkFBRztBQUNiLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUM5QyxVQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2xDLFVBQU0sV0FBVyxHQUFHLDRCQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckUsVUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDOztBQUVuQyxVQUFJLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLFdBQVcsRUFBRTtBQUN0QyxjQUFNLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO09BQ3RCOztBQUVELGFBQU8sTUFBTSxDQUFDO0tBQ2Y7OztXQUVhLDBCQUFHO0FBQ2YsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzlDLFVBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENB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MEJBQTBCLENBQUMsQ0FBQztLQUNwRDs7O1NBdkJrQixnQkFBZ0I7OztxQkFBaEIsZ0JBQWdCIiwiZmlsZSI6Ii9Vc2Vycy92aXRhbWluYWZyb250Ly5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvcHJvamVjdHMtbGlzdC12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7U2VsZWN0TGlzdFZpZXcsICQkfSBmcm9tICdhdG9tLXNwYWNlLXBlbi12aWV3cyc7XG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlLXBsdXMnO1xuaW1wb3J0IHByb2plY3RzIGZyb20gJy4vcHJvamVjdHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcm9qZWN0c0xpc3RWaWV3IGV4dGVuZHMgU2VsZWN0TGlzdFZpZXcge1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLmFkZENsYXNzKCdwcm9qZWN0LW1hbmFnZXInKTtcbiAgfVxuXG4gIGFjdGl2YXRlKCkge1xuICB9XG5cbiAgZ2V0IHBvc3NpYmxlRmlsdGVyS2V5cygpIHtcbiAgICByZXR1cm4gWyd0aXRsZScsICdncm91cCcsICd0ZW1wbGF0ZSddO1xuICB9XG5cbiAgZ2V0IGRlZmF1bHRGaWx0ZXJLZXkoKSB7XG4gICAgcmV0dXJuICd0aXRsZSc7XG4gIH1cblxuICBnZXQgc29ydEJ5KCkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ3Byb2plY3QtbWFuYWdlci5zb3J0QnknKTtcbiAgfVxuXG4gIGdldCBzaG93UGF0aCgpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdwcm9qZWN0LW1hbmFnZXIuc2hvd1BhdGgnKTtcbiAgfVxuXG4gIGdldEZpbHRlcktleSgpIHtcbiAgICBjb25zdCBpbnB1dCA9IHRoaXMuZmlsdGVyRWRpdG9yVmlldy5nZXRUZXh0KCk7XG4gICAgY29uc3QgaW5wdXRBcnIgPSBpbnB1dC5zcGxpdCgnOicpO1xuICAgIGNvbnN0IGlzRmlsdGVyS2V5ID0gXy5jb250YWlucyh0aGlzLnBvc3NpYmxlRmlsdGVyS2V5cywgaW5wdXRBcnJbMF0pO1xuICAgIGxldCBmaWx0ZXIgPSB0aGlzLmRlZmF1bHRGaWx0ZXJLZXk7XG5cbiAgICBpZiAoaW5wdXRBcnIubGVuZ3RoID4gMSAmJiBpc0ZpbHRlcktleSkge1xuICAgICAgZmlsdGVyID0gaW5wdXRBcnJbMF07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZpbHRlcjtcbiAgfVxuXG4gIGdldEZpbHRlclF1ZXJ5KCkge1xuICAgIGNvbnN0IGlucHV0ID0gdGhpcy5maWx0ZXJFZGl0b3JWaWV3LmdldFRleHQoKTtcbiAgICBjb25zdCBpbnB1dEFyciA9IGlucHV0LnNwbGl0KCc6Jyk7XG4gICAgbGV0IGZpbHRlciA9IGlucHV0O1xuXG4gICAgaWYgKGlucHV0QXJyLmxlbmd0aCA+IDEpIHtcbiAgICAgIGZpbHRlciA9IGlucHV0QXJyWzFdO1xuICAgIH1cblxuICAgIHJldHVybiBmaWx0ZXI7XG4gIH1cblxuICBnZXRFbXB0eU1lc3NhZ2UoaXRlbUNvdW50LCBmaWx0ZXJlZEl0ZW1Db3VudCkge1xuICAgIGlmIChpdGVtQ291bnQgPT09IDApIHtcbiAgICAgIHJldHVybiAnTm8gcHJvamVjdHMgc2F2ZWQgeWV0JztcbiAgICB9IGVsc2Uge1xuICAgICAgc3VwZXIuZ2V0RW1wdHlNZXNzYWdlKGl0ZW1Db3VudCwgZmlsdGVyZWRJdGVtQ291bnQpO1xuICAgIH1cbiAgfVxuXG4gIHRvZ2dsZSgpIHtcbiAgICBpZiAodGhpcy5wYW5lbCAmJiB0aGlzLnBhbmVsLmlzVmlzaWJsZSgpKSB7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb2plY3RzLmdldEFsbCgocHJvamVjdHMpID0+IHRoaXMuc2hvdyhwcm9qZWN0cykpO1xuICAgIH1cbiAgfVxuXG4gIHNob3cocHJvamVjdHMpIHtcbiAgICBpZiAodGhpcy5wYW5lbCA9PSBudWxsKSB7XG4gICAgICB0aGlzLnBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbCh7aXRlbTogdGhpc30pO1xuICAgIH1cblxuICAgIGxldCBpdGVtcyA9IFtdO1xuICAgIGZvciAobGV0IHByb2plY3Qgb2YgcHJvamVjdHMpIHtcbiAgICAgIGNvbnN0IGl0ZW0gPSBfLmNsb25lKHByb2plY3QucHJvcHMpO1xuICAgICAgaXRlbS5wcm9qZWN0ID0gcHJvamVjdDtcbiAgICAgIGl0ZW1zLnB1c2goaXRlbSk7XG4gICAgfVxuXG4gICAgdGhpcy5wYW5lbC5zaG93KCk7XG4gICAgaXRlbXMgPSB0aGlzLnNvcnRJdGVtcyhpdGVtcyk7XG4gICAgdGhpcy5zZXRJdGVtcyhpdGVtcyk7XG4gICAgdGhpcy5mb2N1c0ZpbHRlckVkaXRvcigpO1xuICB9XG5cbiAgY29uZmlybWVkKGl0ZW0pIHtcbiAgICBpZiAoaXRlbSAmJiBpdGVtLnByb2plY3Quc3RhdHMpIHtcbiAgICAgIGl0ZW0ucHJvamVjdC5vcGVuKCk7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfVxuICB9XG5cbiAgY2xvc2UoKSB7XG4gICAgaWYgKHRoaXMucGFuZWwpIHtcbiAgICAgIHRoaXMucGFuZWwuZGVzdHJveSgpO1xuICAgICAgdGhpcy5wYW5lbCA9IG51bGw7XG4gICAgfVxuXG4gICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpLmFjdGl2YXRlKCk7XG4gIH1cblxuICBjYW5jZWxsZWQoKSB7XG4gICAgdGhpcy5jbG9zZSgpO1xuICB9XG5cbiAgdmlld0Zvckl0ZW0oe19pZCwgdGl0bGUsIGdyb3VwLCBpY29uLCBkZXZNb2RlLCBwYXRocywgcHJvamVjdH0pIHtcbiAgICBjb25zdCBzaG93UGF0aCA9IHRoaXMuc2hvd1BhdGg7XG4gICAgY29uc3QgcHJvamVjdE1pc3NpbmcgPSBwcm9qZWN0LnN0YXRzID8gZmFsc2UgOiB0cnVlO1xuXG4gICAgcmV0dXJuICQkKGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMubGkoe2NsYXNzOiAndHdvLWxpbmVzJ30sXG4gICAgICB7J2RhdGEtcHJvamVjdC1pZCc6IF9pZCwgJ2RhdGEtcGF0aC1taXNzaW5nJzogcHJvamVjdE1pc3Npbmd9LCAoKSA9PiB7XG4gICAgICAgIHRoaXMuZGl2KHtjbGFzczogJ3ByaW1hcnktbGluZSd9LCAoKSA9PiB7XG4gICAgICAgICAgaWYgKGRldk1vZGUpIHtcbiAgICAgICAgICAgIHRoaXMuc3Bhbih7Y2xhc3M6ICdwcm9qZWN0LW1hbmFnZXItZGV2bW9kZSd9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmRpdih7Y2xhc3M6IGBpY29uICR7aWNvbn1gfSwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zcGFuKHRpdGxlKTtcbiAgICAgICAgICAgIGlmIChncm91cCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIHRoaXMuc3Bhbih7Y2xhc3M6ICdwcm9qZWN0LW1hbmFnZXItbGlzdC1ncm91cCd9LCBncm91cCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmRpdih7Y2xhc3M6ICdzZWNvbmRhcnktbGluZSd9LCAoKSA9PiB7XG4gICAgICAgICAgaWYgKHByb2plY3RNaXNzaW5nKSB7XG4gICAgICAgICAgICB0aGlzLmRpdih7Y2xhc3M6ICdpY29uIGljb24tYWxlcnQnfSwgJ1BhdGggaXMgbm90IGF2YWlsYWJsZScpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc2hvd1BhdGgpIHtcbiAgICAgICAgICAgIGxldCBwYXRoO1xuICAgICAgICAgICAgZm9yIChwYXRoIG9mIHBhdGhzKSB7XG4gICAgICAgICAgICAgIHRoaXMuZGl2KHtjbGFzczogJ25vLWljb24nfSwgcGF0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgc29ydEl0ZW1zKGl0ZW1zKSB7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5zb3J0Qnk7XG4gICAgaWYgKGtleSA9PT0gJ2RlZmF1bHQnKSB7XG4gICAgICByZXR1cm4gaXRlbXM7XG4gICAgfSBlbHNlIGlmIChrZXkgPT09ICdsYXN0IG1vZGlmaWVkJykge1xuICAgICAgaXRlbXMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICBhID0gYS5wcm9qZWN0Lmxhc3RNb2RpZmllZC5nZXRUaW1lKCk7XG4gICAgICAgIGIgPSBiLnByb2plY3QubGFzdE1vZGlmaWVkLmdldFRpbWUoKTtcblxuICAgICAgICByZXR1cm4gYSA+IGIgPyAtMSA6IDE7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaXRlbXMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICBhID0gKGFba2V5XSB8fCAnXFx1ZmZmZicpLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIGIgPSAoYltrZXldIHx8ICdcXHVmZmZmJykudG9VcHBlckNhc2UoKTtcblxuICAgICAgICByZXR1cm4gYSA+IGIgPyAxIDogLTE7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gaXRlbXM7XG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/vitaminafront/.atom/packages/project-manager/lib/projects-list-view.js
