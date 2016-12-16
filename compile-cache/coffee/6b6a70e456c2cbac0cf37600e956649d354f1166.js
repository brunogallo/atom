(function() {
  var Dom, Headers, Utility;

  Dom = require('./dom');

  Utility = require('./utility');

  Headers = require('./headers');

  module.exports = {
    init: function(state) {
      var self;
      self = this;
      self.tabSize(atom.config.get('seti-ui.compactView'));
      self.ignoredFiles(atom.config.get('seti-ui.displayIgnored'));
      self.fileIcons(atom.config.get('seti-ui.fileIcons'));
      self.hideTabs(atom.config.get('seti-ui.hideTabs'));
      self.setTheme(atom.config.get('seti-ui.themeColor'), false, false);
      self.font(atom.config.get('seti-ui.font'), false);
      self.animate(atom.config.get('seti-ui.disableAnimations'));
      atom.config.onDidChange('seti-ui.font', function(value) {
        return self.font(atom.config.get('seti-ui.font'), true);
      });
      return atom.config.onDidChange('seti-ui.themeColor', function(value) {
        return self.setTheme(value.newValue, value.oldValue, true);
      });
    },
    "package": atom.packages.getLoadedPackage('seti-ui'),
    refresh: function() {
      var self;
      self = this;
      self["package"].deactivate();
      return setImmediate(function() {
        return self["package"].activate();
      });
    },
    font: function(val, reload) {
      var el, self;
      self = this;
      el = Dom.query('atom-workspace');
      if (val === 'Roboto') {
        return el.classList.add('seti-roboto');
      } else {
        return el.classList.remove('seti-roboto');
      }
    },
    setTheme: function(theme, previous, reload) {
      var el, fs, path, pkg, self, themeData;
      self = this;
      el = Dom.query('atom-workspace');
      fs = require('fs');
      path = require('path');
      pkg = atom.packages.getLoadedPackage('seti-ui');
      themeData = '@seti-primary: @' + theme.toLowerCase() + ';';
      themeData = themeData + '@seti-primary-text: @' + theme.toLowerCase() + '-text;';
      themeData = themeData + '@seti-primary-highlight: @' + theme.toLowerCase() + '-highlight;';
      atom.config.set('seti-ui.themeColor', theme);
      return fs.writeFile(pkg.path + '/styles/user-theme.less', themeData, function(err) {
        if (!err) {
          if (previous) {
            el.classList.remove('seti-theme-' + previous.toLowerCase());
            el.classList.add('seti-theme-' + theme.toLowerCase());
          }
          if (reload) {
            return self.refresh();
          }
        }
      });
    },
    animate: function(val) {
      return Utility.applySetting({
        action: 'addWhenFalse',
        config: 'seti-ui.disableAnimations',
        el: ['atom-workspace'],
        className: 'seti-animate',
        val: val,
        cb: this.animate
      });
    },
    tabSize: function(val) {
      return Utility.applySetting({
        action: 'addWhenTrue',
        config: 'seti-ui.compactView',
        el: ['atom-workspace'],
        className: 'seti-compact',
        val: val,
        cb: this.tabSize
      });
    },
    hideTabs: function(val) {
      Utility.applySetting({
        action: 'addWhenTrue',
        config: 'seti-ui.hideTabs',
        el: ['atom-workspace'],
        className: 'seti-hide-tabs',
        val: val,
        cb: this.hideTabs
      });
    },
    fileIcons: function(val) {
      Utility.applySetting({
        action: 'addWhenTrue',
        config: 'seti-ui.fileIcons',
        el: ['atom-workspace'],
        className: 'seti-icons',
        val: val,
        cb: this.fileIcons
      });
    },
    ignoredFiles: function(val) {
      return Utility.applySetting({
        action: 'addWhenFalse',
        config: 'seti-ui.displayIgnored',
        el: ['.file.entry.list-item.status-ignored', '.directory.entry.list-nested-item.status-ignored'],
        className: 'seti-hide',
        val: val,
        cb: this.ignoredFiles
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpdGFtaW5hZnJvbnQvLmF0b20vcGFja2FnZXMvc2V0aS11aS9saWIvc2V0dGluZ3MuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFCQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxPQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUixDQURWLENBQUE7O0FBQUEsRUFFQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVIsQ0FGVixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsSUFBQSxFQUFNLFNBQUMsS0FBRCxHQUFBO0FBRUosVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sSUFBUCxDQUFBO0FBQUEsTUFHQSxJQUFJLENBQUMsT0FBTCxDQUFhLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixxQkFBaEIsQ0FBYixDQUhBLENBQUE7QUFBQSxNQUtBLElBQUksQ0FBQyxZQUFMLENBQWtCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3QkFBaEIsQ0FBbEIsQ0FMQSxDQUFBO0FBQUEsTUFPQSxJQUFJLENBQUMsU0FBTCxDQUFlLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixtQkFBaEIsQ0FBZixDQVBBLENBQUE7QUFBQSxNQVNBLElBQUksQ0FBQyxRQUFMLENBQWMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGtCQUFoQixDQUFkLENBVEEsQ0FBQTtBQUFBLE1BV0EsSUFBSSxDQUFDLFFBQUwsQ0FBYyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isb0JBQWhCLENBQWQsRUFBcUQsS0FBckQsRUFBNEQsS0FBNUQsQ0FYQSxDQUFBO0FBQUEsTUFjQSxJQUFJLENB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

//# sourceURL=/Users/vitaminafront/.atom/packages/seti-ui/lib/settings.coffee
