(function() {
  var Dialog, SaveDialog, changeCase, path, projects,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Dialog = require('./dialog');

  projects = require('./projects');

  path = require('path');

  changeCase = require('change-case');

  module.exports = SaveDialog = (function(_super) {
    __extends(SaveDialog, _super);

    SaveDialog.prototype.filePath = null;

    function SaveDialog() {
      var firstPath, title;
      firstPath = atom.project.getPaths()[0];
      title = path.basename(firstPath);
      if (atom.config.get('project-manager.prettifyTitle')) {
        title = changeCase.titleCase(title);
      }
      SaveDialog.__super__.constructor.call(this, {
        prompt: 'Enter name of project',
        input: title,
        select: true,
        iconClass: 'icon-arrow-right'
      });
      projects.getCurrent((function(_this) {
        return function(project) {
          if (project.rootPath === firstPath) {
            return _this.showError("This project is already saved as " + project.props.title);
          }
        };
      })(this));
    }

    SaveDialog.prototype.onConfirm = function(title) {
      var properties;
      if (title) {
        properties = {
          title: title,
          paths: atom.project.getPaths()
        };
        projects.addProject(properties);
        return this.close();
      } else {
        return this.showError('You need to specify a name for the project');
      }
    };

    return SaveDialog;

  })(Dialog);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpdGFtaW5hZnJvbnQvLmF0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL2xpYi9zYXZlLWRpYWxvZy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsOENBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQUFULENBQUE7O0FBQUEsRUFDQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVIsQ0FEWCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdBLFVBQUEsR0FBYSxPQUFBLENBQVEsYUFBUixDQUhiLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osaUNBQUEsQ0FBQTs7QUFBQSx5QkFBQSxRQUFBLEdBQVUsSUFBVixDQUFBOztBQUVhLElBQUEsb0JBQUEsR0FBQTtBQUNYLFVBQUEsZ0JBQUE7QUFBQSxNQUFBLFNBQUEsR0FBWSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBcEMsQ0FBQTtBQUFBLE1BQ0EsS0FBQSxHQUFRLElBQUksQ0FBQyxRQUFMLENBQWMsU0FBZCxDQURSLENBQUE7QUFHQSxNQUFBLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLCtCQUFoQixDQUFIO0FBQ0UsUUFBQSxLQUFBLEdBQVEsVUFBVSxDQUFDLFNBQVgsQ0FBcUIsS0FBckIsQ0FBUixDQURGO09BSEE7QUFBQSxNQU1BLDRDQUNFO0FBQUEsUUFBQSxNQUFBLEVBQVEsdUJBQVI7QUFBQSxRQUNBLEtBQUEsRUFBTyxLQURQO0FBQUEsUUFFQSxNQUFBLEVBQVEsSUFGUjtBQUFBLFFBR0EsU0FBQSxFQUFXLGtCQUhYO09BREYsQ0FOQSxDQUFBO0FBQUEsTUFZQSxRQUFRLENBQUMsVUFBVCxDQUFvQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxPQUFELEdBQUE7QUFDbEIsVUFBQSxJQUFHLE9BQU8sQ0FBQyxRQUFSLEtBQW9CLFNBQXZCO21CQUNFLEtBQUMsQ0FBQSxTQUFELENBQVksbUNBQUEsR0FBbUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUE3RCxFQURGO1dBRGtCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBcEIsQ0FaQSxDQURXO0lBQUEsQ0FGYjs7QUFBQSx5QkFvQkEsU0FBQSxHQUFXLFNBQUMsS0FBRCxHQUFBO0FBQ1QsVUFBQSxVQUFBO0FBQUEsTUFBQSxJQUFHLEtBQUg7QUFDRSxRQUFBLFVBQUEsR0FDRTtBQUFBLFVBQUEsS0FBQSxFQUFPLEtBQVA7QUFBQSxVQUNBLEtBQUEsRUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQURQO1NBREYsQ0FBQTtBQUFBLFFBSUEsUUFBUSxDQUFDLFVBQVQsQ0FBb0IsVUFBcEIsQ0FKQSxDQUFBO2VBTUEsSUFBQyxDQUFBLEtBQUQsQ0FBQSxFQVBGO09BQUEsTUFBQTtlQVNFLElBQUMsQ0FBQSxTQUFELENBQVcsNENBQVgsRUFURjtPQURTO0lBQUEsQ0FwQlgsQ0FBQTs7c0JBQUE7O0tBRHVCLE9BTnpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/vitaminafront/.atom/packages/project-manager/lib/save-dialog.coffee
