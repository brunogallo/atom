(function() {
  var Dom, Utility;

  Dom = require('./dom');

  Utility = require('./utility');

  module.exports = {
    init: function(state) {
      var self;
      self = this;
      self.tabSize(atom.config.get('seti-ui.compactView'));
      self.ignoredFiles(atom.config.get('seti-ui.displayIgnored'));
      self.fileIcons(atom.config.get('seti-ui.fileIcons'));
      self.hideTabs(atom.config.get('seti-ui.hideTabs'));
      self.setTheme(atom.config.get('seti-ui.themeColor'), false, false);
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
          }
          el.classList.add('seti-theme-' + theme.toLowerCase());
          if (reload) {
            return self.refresh();
          }
        }
      });
    },
    tabSize: function(val) {
      return Utility.applySetting({
        action: 'addWhenTrue',
        config: 'seti-ui.compactView',
        el: ['atom-workspace-axis.vertical .tab-bar', 'atom-workspace-axis.vertical .tabs-bar', 'atom-panel-container.left', 'atom-panel-container.left .project-root > .header', '.entries.list-tree'],
        className: 'seti-compact',
        val: val,
        cb: this.tabSize
      });
    },
    hideTabs: function(val) {
      Utility.applySetting({
        action: 'addWhenTrue',
        config: 'seti-ui.hideTabs',
        el: ['.tab-bar', '.tabs-bar'],
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpdGFtaW5hZnJvbnQvLmF0b20vcGFja2FnZXMvc2V0aS11aS9saWIvc2V0dGluZ3MuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFlBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLE9BQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSLENBRFYsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLElBQUEsRUFBTSxTQUFDLEtBQUQsR0FBQTtBQUVKLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLElBQVAsQ0FBQTtBQUFBLE1BR0EsSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IscUJBQWhCLENBQWIsQ0FIQSxDQUFBO0FBQUEsTUFLQSxJQUFJLENBQUMsWUFBTCxDQUFrQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0JBQWhCLENBQWxCLENBTEEsQ0FBQTtBQUFBLE1BT0EsSUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsbUJBQWhCLENBQWYsQ0FQQSxDQUFBO0FBQUEsTUFTQSxJQUFJLENBQUMsUUFBTCxDQUFjLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixrQkFBaEIsQ0FBZCxDQVRBLENBQUE7QUFBQSxNQVdBLElBQUksQ0FBQyxRQUFMLENBQWMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG9CQUFoQixDQUFkLEVBQXFELEtBQXJELEVBQTRELEtBQTVELENBWEEsQ0FBQTthQVlBLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBWixDQUF3QixvQkFBeEIsRUFBOEMsU0FBQyxLQUFELEdBQUE7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

//# sourceURL=/Users/vitaminafront/.atom/packages/seti-ui/lib/settings.coffee
