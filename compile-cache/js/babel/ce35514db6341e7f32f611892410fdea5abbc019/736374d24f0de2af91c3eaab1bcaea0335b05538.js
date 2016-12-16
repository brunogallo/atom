Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

'use babel';
'use strict';

var utils = {
  getDB: function getDB() {
    // db.updateFilepath(utils.dbPath());
    // spyOn(db, 'readFile').andCallFake((callback) => {
    //   const props = {
    //     test: {
    //       _id: 'test',
    //       title: 'Test',
    //       paths: ['/Users/test'],
    //       icon: 'icon-test',
    //     }
    //   };
    //
    //   callback(props);
    // });

    // return db;
  },

  dbPath: function dbPath() {
    var specPath = _path2['default'].join(__dirname, 'db');
    var id = utils.id();

    return specPath + '/' + id + '.cson';
  },

  id: function id() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }
};

exports['default'] = utils;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92aXRhbWluYWZyb250Ly5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9zcGVjL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztvQkFHaUIsTUFBTTs7OztBQUh2QixXQUFXLENBQUM7QUFDWixZQUFZLENBQUM7O0FBSWIsSUFBTSxLQUFLLEdBQUc7QUFDWixPQUFLLEVBQUUsaUJBQVc7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQmpCOztBQUVELFFBQU0sRUFBRSxrQkFBVztBQUNqQixRQUFNLFFBQVEsR0FBRyxrQkFBSyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzVDLFFBQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQzs7QUFFdEIsV0FBVSxRQUFRLFNBQUksRUFBRSxXQUFRO0dBQ2pDOztBQUVELElBQUUsRUFBRSxjQUFXO0FBQ2IsV0FBTyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0dBQ3REO0NBQ0YsQ0FBQzs7cUJBRWEsS0FBSyIsImZpbGUiOiIvVXNlcnMvdml0YW1pbmFmcm9udC8uYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvc3BlYy91dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuY29uc3QgdXRpbHMgPSB7XG4gIGdldERCOiBmdW5jdGlvbigpIHtcbiAgICAvLyBkYi51cGRhdGVGaWxlcGF0aCh1dGlscy5kYlBhdGgoKSk7XG4gICAgLy8gc3B5T24oZGIsICdyZWFkRmlsZScpLmFuZENhbGxGYWtlKChjYWxsYmFjaykgPT4ge1xuICAgIC8vICAgY29uc3QgcHJvcHMgPSB7XG4gICAgLy8gICAgIHRlc3Q6IHtcbiAgICAvLyAgICAgICBfaWQ6ICd0ZXN0JyxcbiAgICAvLyAgICAgICB0aXRsZTogJ1Rlc3QnLFxuICAgIC8vICAgICAgIHBhdGhzOiBbJy9Vc2Vycy90ZXN0J10sXG4gICAgLy8gICAgICAgaWNvbjogJ2ljb24tdGVzdCcsXG4gICAgLy8gICAgIH1cbiAgICAvLyAgIH07XG4gICAgLy9cbiAgICAvLyAgIGNhbGxiYWNrKHByb3BzKTtcbiAgICAvLyB9KTtcblxuICAgIC8vIHJldHVybiBkYjtcbiAgfSxcblxuICBkYlBhdGg6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHNwZWNQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2RiJyk7XG4gICAgY29uc3QgaWQgPSB1dGlscy5pZCgpO1xuXG4gICAgcmV0dXJuIGAke3NwZWNQYXRofS8ke2lkfS5jc29uYDtcbiAgfSxcblxuICBpZDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICdfJyArIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cigyLCA5KTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgdXRpbHM7XG4iXX0=
//# sourceURL=/Users/vitaminafront/.atom/packages/project-manager/spec/utils.js
