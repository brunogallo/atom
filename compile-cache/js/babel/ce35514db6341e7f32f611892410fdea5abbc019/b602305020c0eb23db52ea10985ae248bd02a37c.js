var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _dialog = require('./dialog');

var _dialog2 = _interopRequireDefault(_dialog);

var _project = require('./project');

var _project2 = _interopRequireDefault(_project);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

'use babel';

var SaveDialog = (function (_Dialog) {
  _inherits(SaveDialog, _Dialog);

  function SaveDialog() {
    _classCallCheck(this, SaveDialog);

    _get(Object.getPrototypeOf(SaveDialog.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(SaveDialog, [{
    key: 'isAttached',
    value: function isAttached() {
      var firstPath = atom.project.getPaths()[0];
      var title = _path2['default'].basename(firstPath);
      this.setLabel('Enter name of project', 'icon-arrow-right');
      this.setInput(title, true);
    }
  }, {
    key: 'confirm',
    value: function confirm() {
      var input = this.editor.getText();

      if (input) {
        var properties = {
          title: input,
          paths: atom.project.getPaths()
        };

        var project = new _project2['default'](properties);
        project.save();

        this.close();
      }
    }
  }]);

  return SaveDialog;
})(_dialog2['default']);

module.exports = SaveDialog = document.registerElement('project-manager-dialog', SaveDialog);

// atom.commands.add('project-manager-dialog', {
//   'core:confirm': () => this.confirm(),
//   'core:cancel': () => this.cancel()
// });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92aXRhbWluYWZyb250Ly5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvX3NhdmUtZGlhbG9nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7c0JBRW1CLFVBQVU7Ozs7dUJBQ1QsV0FBVzs7OztvQkFDZCxNQUFNOzs7O0FBSnZCLFdBQVcsQ0FBQzs7SUFNTixVQUFVO1lBQVYsVUFBVTs7V0FBVixVQUFVOzBCQUFWLFVBQVU7OytCQUFWLFVBQVU7OztlQUFWLFVBQVU7O1dBRUosc0JBQUc7QUFDWCxVQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNDLFVBQUksS0FBSyxHQUFHLGtCQUFLLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNyQyxVQUFJLENBQUMsUUFBUSxDQUFDLHVCQUF1QixFQUFFLGtCQUFrQixDQUFDLENBQUM7QUFDM0QsVUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDNUI7OztXQUVNLG1CQUFHO0FBQ1IsVUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7QUFFbEMsVUFBSSxLQUFLLEVBQUU7QUFDVCxZQUFJLFVBQVUsR0FBRztBQUNmLGVBQUssRUFBRSxLQUFLO0FBQ1osZUFBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFO1NBQy9CLENBQUM7O0FBRUYsWUFBSSxPQUFPLEdBQUcseUJBQVksVUFBVSxDQUFDLENBQUM7QUFDdEMsZUFBTyxDQUFDLElBQUksRUFBRSxDQUFDOztBQUVmLFlBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztPQUNkO0tBQ0Y7OztTQXZCRyxVQUFVOzs7QUEwQmhCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVSxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsd0JBQXdCLEVBQUUsVUFBVSxDQUFDLENBQUMiLCJmaWxlIjoiL1VzZXJzL3ZpdGFtaW5hZnJvbnQvLmF0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL2xpYi9fc2F2ZS1kaWFsb2cuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IERpYWxvZyBmcm9tICcuL2RpYWxvZyc7XG5pbXBvcnQgUHJvamVjdCBmcm9tICcuL3Byb2plY3QnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmNsYXNzIFNhdmVEaWFsb2cgZXh0ZW5kcyBEaWFsb2cge1xuXG4gIGlzQXR0YWNoZWQoKSB7XG4gICAgbGV0IGZpcnN0UGF0aCA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdO1xuICAgIGxldCB0aXRsZSA9IHBhdGguYmFzZW5hbWUoZmlyc3RQYXRoKTtcbiAgICB0aGlzLnNldExhYmVsKCdFbnRlciBuYW1lIG9mIHByb2plY3QnLCAnaWNvbi1hcnJvdy1yaWdodCcpO1xuICAgIHRoaXMuc2V0SW5wdXQodGl0bGUsIHRydWUpO1xuICB9XG5cbiAgY29uZmlybSgpIHtcbiAgICBsZXQgaW5wdXQgPSB0aGlzLmVkaXRvci5nZXRUZXh0KCk7XG5cbiAgICBpZiAoaW5wdXQpIHtcbiAgICAgIGxldCBwcm9wZXJ0aWVzID0ge1xuICAgICAgICB0aXRsZTogaW5wdXQsXG4gICAgICAgIHBhdGhzOiBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVxuICAgICAgfTtcblxuICAgICAgbGV0IHByb2plY3QgPSBuZXcgUHJvamVjdChwcm9wZXJ0aWVzKTtcbiAgICAgIHByb2plY3Quc2F2ZSgpO1xuXG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2F2ZURpYWxvZyA9IGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgncHJvamVjdC1tYW5hZ2VyLWRpYWxvZycsIFNhdmVEaWFsb2cpO1xuXG4vLyBhdG9tLmNvbW1hbmRzLmFkZCgncHJvamVjdC1tYW5hZ2VyLWRpYWxvZycsIHtcbi8vICAgJ2NvcmU6Y29uZmlybSc6ICgpID0+IHRoaXMuY29uZmlybSgpLFxuLy8gICAnY29yZTpjYW5jZWwnOiAoKSA9PiB0aGlzLmNhbmNlbCgpXG4vLyB9KTtcbiJdfQ==
//# sourceURL=/Users/vitaminafront/.atom/packages/project-manager/lib/_save-dialog.js
