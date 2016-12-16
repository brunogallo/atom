(function() {
  var Dom;

  Dom = require('./dom');

  module.exports = {
    init: function(state) {
      var self;
      self = this;
      this.themeSet = false;
      if (self.isLoaded('seti-syntax')) {
        atom.config.onDidChange('seti-syntax.themeColor', function(value) {
          return self.setTheme(value.newValue, value.oldValue, true);
        });
        atom.config.onDidChange('seti-syntax.dynamicColor', function(value) {
          var newColor;
          if (value.newValue) {
            newColor = atom.config.get('seti-ui.themeColor');
            return self.setTheme(newColor, false, true);
          } else {
            if (atom.config.get('seti-syntax.themeColor')) {
              newColor = atom.config.get('seti-syntax.themeColor');
            } else {
              newColor = 'default';
            }
            return self.setTheme(newColor, false, true);
          }
        });
        if (self.isLoaded('seti-ui')) {
          if (atom.config.get('seti-syntax.dynamicColor') && !this.themeSet) {
            self.setTheme(atom.config.get('seti-ui.themeColor'), false, false);
          }
          atom.config.onDidChange('seti-ui.themeColor', function(value) {
            if (atom.config.get('seti-syntax.dynamicColor')) {
              return self.setTheme(value.newValue, value.oldValue, false);
            }
          });
          self.onDeactivate('seti-ui', function() {
            if (atom.config.get('seti-syntax.dynamicColor')) {
              return self.setTheme('default', false, false);
            }
          });
        }
        if ((atom.config.get('seti-syntax.themeColor')) && !this.themeSet) {
          return self.setTheme(atom.config.get('seti-syntax.themeColor'), false, false);
        } else if (!this.themeSet) {
          return self.setTheme('default', false, false);
        }
      }
    },
    isLoaded: function(which) {
      return atom.packages.isPackageLoaded(which);
    },
    onActivate: function(which, cb) {
      return atom.packages.onDidActivatePackage(function(pkg) {
        if (pkg.name === which) {
          return cb(pkg);
        }
      });
    },
    onDeactivate: function(which, cb) {
      return atom.packages.onDidDeactivatePackage(function(pkg) {
        if (pkg.name === which) {
          return cb(pkg);
        }
      });
    },
    "package": atom.packages.getLoadedPackage('seti-syntax'),
    packageInfo: function(which) {
      return atom.packages.getLoadedPackage(which);
    },
    refresh: function() {
      var self;
      self = this;
      self["package"].deactivate();
      return setImmediate(function() {
        return self["package"].activate();
      });
    },
    setTheme: function(theme, previous, reload) {
      var fs, pkg, self, themeData;
      self = this;
      fs = require('fs');
      pkg = this["package"];
      themeData = '@import "themes/' + theme.toLowerCase() + '";';
      this.themeSet = true;
      return fs.readFile(pkg.path + '/styles/user-theme.less', 'utf8', function(err, fileData) {
        if (fileData !== themeData) {
          return fs.writeFile(pkg.path + '/styles/user-theme.less', themeData, function(err) {
            if (!err) {
              return self.refresh();
            }
          });
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpdGFtaW5hZnJvbnQvLmF0b20vcGFja2FnZXMvc2V0aS1zeW50YXgvbGliL3NldHRpbmdzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxHQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxPQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLElBQUEsRUFBTSxTQUFDLEtBQUQsR0FBQTtBQUVKLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLElBQVAsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFFBQUQsR0FBWSxLQURaLENBQUE7QUFJQSxNQUFBLElBQUcsSUFBSSxDQUFDLFFBQUwsQ0FBYyxhQUFkLENBQUg7QUFHRSxRQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBWixDQUF3Qix3QkFBeEIsRUFBa0QsU0FBQyxLQUFELEdBQUE7aUJBQ2hELElBQUksQ0FBQyxRQUFMLENBQWMsS0FBSyxDQUFDLFFBQXBCLEVBQThCLEtBQUssQ0FBQyxRQUFwQyxFQUE4QyxJQUE5QyxFQURnRDtRQUFBLENBQWxELENBQUEsQ0FBQTtBQUFBLFFBSUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFaLENBQXdCLDBCQUF4QixFQUFvRCxTQUFDLEtBQUQsR0FBQTtBQUVsRCxjQUFBLFFBQUE7QUFBQSxVQUFBLElBQUksS0FBSyxDQUFDLFFBQVY7QUFDRSxZQUFBLFFBQUEsR0FBVyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isb0JBQWhCLENBQVgsQ0FBQTttQkFDQSxJQUFJLENBQUMsUUFBTCxDQUFjLFFBQWQsRUFBd0IsS0FBeEIsRUFBK0IsSUFBL0IsRUFGRjtXQUFBLE1BQUE7QUFNRSxZQUFBLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxH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

//# sourceURL=/Users/vitaminafront/.atom/packages/seti-syntax/lib/settings.coffee
