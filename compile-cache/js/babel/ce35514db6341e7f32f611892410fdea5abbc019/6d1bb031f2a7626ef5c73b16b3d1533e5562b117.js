Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

var _mobx = require('mobx');

var _findit = require('findit');

var _findit2 = _interopRequireDefault(_findit);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

'use babel';

var GitStore = (function () {
  var _instanceInitializers = {};
  var _instanceInitializers = {};

  _createDecoratedClass(GitStore, [{
    key: 'data',
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return (0, _mobx.asFlat)([]);
    },
    enumerable: true
  }], null, _instanceInitializers);

  function GitStore() {
    _classCallCheck(this, GitStore);

    _defineDecoratedPropertyDescriptor(this, 'data', _instanceInitializers);

    var ignoreDirectories = atom.config.get('project-manager.ignoreDirectories');
    this.ignore = ignoreDirectories.replace(/ /g, '').split(',');
  }

  _createDecoratedClass(GitStore, [{
    key: 'fetch',
    decorators: [_mobx.action],
    value: function fetch() {
      var _this = this;

      var projectHome = atom.config.get('core.projectHome');
      var finder = (0, _findit2['default'])(projectHome);
      this.data.clear();

      finder.on('directory', function (dir, stat, stop) {
        var base = _path2['default'].basename(dir);
        var projectPath = _path2['default'].dirname(dir);
        var projectName = _path2['default'].basename(projectPath);

        if (base === '.git') {
          _this.data.push({
            title: projectName,
            paths: [projectPath],
            source: 'git',
            icon: 'icon-repo'
          });
        }

        if (_this.ignore.includes(base)) {
          stop();
        }
      });
    }
  }, {
    key: 'empty',
    decorators: [_mobx.action],
    value: function empty() {
      this.data.clear();
    }
  }], null, _instanceInitializers);

  return GitStore;
})();

exports['default'] = GitStore;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92aXRhbWluYWZyb250Ly5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvc3RvcmVzL0dpdFN0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztvQkFFMkMsTUFBTTs7c0JBQzlCLFFBQVE7Ozs7b0JBQ1YsTUFBTTs7OztBQUp2QixXQUFXLENBQUM7O0lBTVMsUUFBUTs7Ozt3QkFBUixRQUFROzs7O2FBQ1Isa0JBQU8sRUFBRSxDQUFDOzs7OztBQUVsQixXQUhRLFFBQVEsR0FHYjswQkFISyxRQUFROzs7O0FBSXpCLFFBQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUNBQW1DLENBQUMsQ0FBQztBQUMvRSxRQUFJLENBQUMsTUFBTSxHQUFHLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0dBQzlEOzt3QkFOa0IsUUFBUTs7O1dBUWQsaUJBQUc7OztBQUNkLFVBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDeEQsVUFBTSxNQUFNLEdBQUcseUJBQU8sV0FBVyxDQUFDLENBQUM7QUFDbkMsVUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQzs7QUFFbEIsWUFBTSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsVUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBSztBQUMxQyxZQUFNLElBQUksR0FBRyxrQkFBSyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDaEMsWUFBTSxXQUFXLEdBQUcsa0JBQUssT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3RDLFlBQU0sV0FBVyxHQUFHLGtCQUFLLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFL0MsWUFBSSxJQUFJLEtBQUssTUFBTSxFQUFFO0FBQ25CLGdCQUFLLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDYixpQkFBSyxFQUFFLFdBQVc7QUFDbEIsaUJBQUssRUFBRSxDQUFDLFdBQVcsQ0FBQztBQUNwQixrQkFBTSxFQUFFLEtBQUs7QUFDYixnQkFBSSxFQUFFLFdBQVc7V0FDbEIsQ0FBQyxDQUFDO1NBQ0o7O0FBRUQsWUFBSSxNQUFLLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDOUIsY0FBSSxFQUFFLENBQUM7U0FDUjtPQUNGLENBQUMsQ0FBQztLQUNKOzs7O1dBRVksaUJBQUc7QUFDZCxVQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ25COzs7U0FuQ2tCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6Ii9Vc2Vycy92aXRhbWluYWZyb250Ly5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvc3RvcmVzL0dpdFN0b3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IG9ic2VydmFibGUsIGFjdGlvbiwgYXNGbGF0IH0gZnJvbSAnbW9ieCc7XG5pbXBvcnQgZmluZGl0IGZyb20gJ2ZpbmRpdCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2l0U3RvcmUge1xuICBAb2JzZXJ2YWJsZSBkYXRhID0gYXNGbGF0KFtdKTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBjb25zdCBpZ25vcmVEaXJlY3RvcmllcyA9IGF0b20uY29uZmlnLmdldCgncHJvamVjdC1tYW5hZ2VyLmlnbm9yZURpcmVjdG9yaWVzJyk7XG4gICAgdGhpcy5pZ25vcmUgPSBpZ25vcmVEaXJlY3Rvcmllcy5yZXBsYWNlKC8gL2csICcnKS5zcGxpdCgnLCcpO1xuICB9XG5cbiAgQGFjdGlvbiBmZXRjaCgpIHtcbiAgICBjb25zdCBwcm9qZWN0SG9tZSA9IGF0b20uY29uZmlnLmdldCgnY29yZS5wcm9qZWN0SG9tZScpO1xuICAgIGNvbnN0IGZpbmRlciA9IGZpbmRpdChwcm9qZWN0SG9tZSk7XG4gICAgdGhpcy5kYXRhLmNsZWFyKCk7XG5cbiAgICBmaW5kZXIub24oJ2RpcmVjdG9yeScsIChkaXIsIHN0YXQsIHN0b3ApID0+IHtcbiAgICAgIGNvbnN0IGJhc2UgPSBwYXRoLmJhc2VuYW1lKGRpcik7XG4gICAgICBjb25zdCBwcm9qZWN0UGF0aCA9IHBhdGguZGlybmFtZShkaXIpO1xuICAgICAgY29uc3QgcHJvamVjdE5hbWUgPSBwYXRoLmJhc2VuYW1lKHByb2plY3RQYXRoKTtcblxuICAgICAgaWYgKGJhc2UgPT09ICcuZ2l0Jykge1xuICAgICAgICB0aGlzLmRhdGEucHVzaCh7XG4gICAgICAgICAgdGl0bGU6IHByb2plY3ROYW1lLFxuICAgICAgICAgIHBhdGhzOiBbcHJvamVjdFBhdGhdLFxuICAgICAgICAgIHNvdXJjZTogJ2dpdCcsXG4gICAgICAgICAgaWNvbjogJ2ljb24tcmVwbycsXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5pZ25vcmUuaW5jbHVkZXMoYmFzZSkpIHtcbiAgICAgICAgc3RvcCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgQGFjdGlvbiBlbXB0eSgpIHtcbiAgICB0aGlzLmRhdGEuY2xlYXIoKTtcbiAgfVxufVxuIl19
//# sourceURL=/Users/vitaminafront/.atom/packages/project-manager/lib/stores/GitStore.js
