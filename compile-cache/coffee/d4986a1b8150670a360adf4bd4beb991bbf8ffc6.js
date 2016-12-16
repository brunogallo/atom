(function() {
  atom.packages.activatePackage('tree-view').then(function(tree) {
    var IS_ANCHORED_CLASSNAME, projectRoots, treeView, updateTreeViewHeaderPosition;
    IS_ANCHORED_CLASSNAME = 'is--anchored';
    treeView = tree.mainModule.treeView;
    projectRoots = treeView.roots;
    updateTreeViewHeaderPosition = function() {
      var project, projectClassList, projectHeaderHeight, projectHeight, projectOffsetY, yScrollPosition, _i, _len, _results;
      yScrollPosition = treeView.scroller[0].scrollTop;
      _results = [];
      for (_i = 0, _len = projectRoots.length; _i < _len; _i++) {
        project = projectRoots[_i];
        projectHeaderHeight = project.header.offsetHeight;
        projectClassList = project.classList;
        projectOffsetY = project.offsetTop;
        projectHeight = project.offsetHeight;
        if (yScrollPosition > projectOffsetY) {
          if (yScrollPosition > projectOffsetY + projectHeight - projectHeaderHeight) {
            project.header.style.top = 'auto';
            _results.push(projectClassList.add(IS_ANCHORED_CLASSNAME));
          } else {
            project.header.style.top = (yScrollPosition - projectOffsetY) + 'px';
            _results.push(projectClassList.remove(IS_ANCHORED_CLASSNAME));
          }
        } else {
          project.header.style.top = '0';
          _results.push(projectClassList.remove(IS_ANCHORED_CLASSNAME));
        }
      }
      return _results;
    };
    atom.project.onDidChangePaths(function() {
      projectRoots = treeView.roots;
      return updateTreeViewHeaderPosition();
    });
    atom.config.onDidChange('seti-ui', function() {
      return setTimeout(function() {
        return updateTreeViewHeaderPosition();
      });
    });
    treeView.scroller.on('scroll', updateTreeViewHeaderPosition);
    return setTimeout(function() {
      return updateTreeViewHeaderPosition();
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpdGFtaW5hZnJvbnQvLmF0b20vcGFja2FnZXMvc2V0aS11aS9saWIvaGVhZGVycy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLFdBQTlCLENBQTBDLENBQUMsSUFBM0MsQ0FBZ0QsU0FBQyxJQUFELEdBQUE7QUFDOUMsUUFBQSwyRUFBQTtBQUFBLElBQUEscUJBQUEsR0FBd0IsY0FBeEIsQ0FBQTtBQUFBLElBRUEsUUFBQSxHQUFXLElBQUksQ0FBQyxVQUFVLENBQUMsUUFGM0IsQ0FBQTtBQUFBLElBR0EsWUFBQSxHQUFlLFFBQVEsQ0FBQyxLQUh4QixDQUFBO0FBQUEsSUFLQSw0QkFBQSxHQUErQixTQUFBLEdBQUE7QUFDN0IsVUFBQSxrSEFBQTtBQUFBLE1BQUEsZUFBQSxHQUFrQixRQUFRLENBQUMsUUFBUyxDQUFBLENBQUEsQ0FBRSxDQUFDLFNBQXZDLENBQUE7QUFFQTtXQUFBLG1EQUFBO21DQUFBO0FBQ0UsUUFBQSxtQkFBQSxHQUFzQixPQUFPLENBQUMsTUFBTSxDQUFDLFlBQXJDLENBQUE7QUFBQSxRQUNBLGdCQUFBLEdBQW1CLE9BQU8sQ0FBQyxTQUQzQixDQUFBO0FBQUEsUUFFQSxjQUFBLEdBQWlCLE9BQU8sQ0FBQyxTQUZ6QixDQUFBO0FBQUEsUUFHQSxhQUFBLEdBQWdCLE9BQU8sQ0FBQyxZQUh4QixDQUFBO0FBS0EsUUFBQSxJQUFHLGVBQUEsR0FBa0IsY0FBckI7QUFDRSxVQUFBLElBQUcsZUFBQSxHQUFrQixjQUFBLEdBQWlCLGFBQWpCLEdBQWlDLG1CQUF0RDtBQUNFLFlBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBckIsR0FBMkIsTUFBM0IsQ0FBQTtBQUFBLDBCQUNBLGdCQUFnQixDQUFDLEdBQWpCLENBQXFCLHFCQUFyQixFQURBLENBREY7V0FBQSxNQUFBO0FBSUUsWUFBQSxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFyQixHQUEyQixDQUFDLGVBQUEsR0FBa0IsY0FBbkIsQ0FBQSxHQUFxQyxJQUFoRSxDQUFBO0FBQUEsMEJBQ0EsZ0JBQWdCLENBQUMsTUFBakIsQ0FBd0IscUJBQXhCLEVBREEsQ0FKRjtXQURGO1NBQUEsTUFBQTtBQVFFLFVBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBckIsR0FBMkIsR0FBM0IsQ0FBQTtBQUFBLHdCQUNBLGdCQUFnQixDQUFDLE1BQWpCLENBQXdCLHFCQUF4QixFQURBLENBUkY7U0FORjtBQUFBO3NCQUg2QjtJQUFBLENBTC9CLENBQUE7QUFBQSxJQXlCQSxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFiLENBQThCLFNBQUEsR0FBQTtBQUM1QixNQUFBLFlBQUEsR0FBZSxRQUFRLENBQUMsS0FBeEIsQ0FBQTthQUNBLDRCQUFBLENBQUEsRUFGNEI7SUFBQSxDQUE5QixDQXpCQSxDQUFBO0FBQUEsSUE2QkEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFaLENBQXdCLFNBQXhCLEVBQW1DLFNBQUEsR0FBQTthQUdqQyxVQUFBLENBQVcsU0FBQSxHQUFBO2VBQUcsNEJBQUEsQ0FBQSxFQUFIO01BQUEsQ0FBWCxFQUhpQztJQUFBLENBQW5DLENBN0JBLENBQUE7QUFBQSxJQWlDQSxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQWxCLENBQXFCLFFBQXJCLEVBQStCLDRCQUEvQixDQWpDQSxDQUFBO1dBbUNBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7YUFDVCw0QkFBQSxDQUFBLEVBRFM7SUFBQSxDQUFYLEVBcEM4QztFQUFBLENBQWhELENBQUEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/vitaminafront/.atom/packages/seti-ui/lib/headers.coffee
