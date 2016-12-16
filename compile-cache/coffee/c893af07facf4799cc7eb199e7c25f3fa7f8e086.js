(function() {
  var CompositeDisposable, Expose, ExposeView;

  CompositeDisposable = require('atom').CompositeDisposable;

  ExposeView = require('./expose-view');

  module.exports = Expose = {
    exposeView: null,
    modalPanel: null,
    config: {
      useAnimations: {
        type: 'boolean',
        "default": true
      }
    },
    activate: function() {
      this.exposeView = new ExposeView;
      this.modalPanel = atom.workspace.addModalPanel({
        item: this.exposeView,
        visible: false,
        className: 'expose-panel'
      });
      this.disposables = new CompositeDisposable;
      this.disposables.add(this.modalPanel.onDidChangeVisible((function(_this) {
        return function(visible) {
          var workspaceElement, workspaceView;
          _this.exposeView.didChangeVisible(visible);
          workspaceView = atom.views.getView(atom.workspace);
          workspaceElement = workspaceView.getElementsByTagName('atom-workspace-axis')[0];
          if (!atom.config.get('expose.useAnimations')) {
            visible = false;
          }
          return workspaceElement.classList.toggle('expose-blur', visible);
        };
      })(this)));
      return this.disposables.add(atom.commands.add('atom-workspace', {
        'expose:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      }));
    },
    deactivate: function() {
      this.exposeView.destroy();
      this.modalPanel.destroy();
      return this.disposables.dispose();
    },
    toggle: function() {
      if (this.modalPanel.isVisible()) {
        return this.modalPanel.hide();
      } else {
        return this.modalPanel.show();
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpdGFtaW5hZnJvbnQvLmF0b20vcGFja2FnZXMvZXhwb3NlL2xpYi9leHBvc2UuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVDQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFFQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FGYixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsTUFBQSxHQUNmO0FBQUEsSUFBQSxVQUFBLEVBQVksSUFBWjtBQUFBLElBQ0EsVUFBQSxFQUFZLElBRFo7QUFBQSxJQUdBLE1BQUEsRUFDRTtBQUFBLE1BQUEsYUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7T0FERjtLQUpGO0FBQUEsSUFRQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ1IsTUFBQSxJQUFDLENBQUEsVUFBRCxHQUFjLEdBQUEsQ0FBQSxVQUFkLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO0FBQUEsUUFBQSxJQUFBLEVBQU0sSUFBQyxDQUFBLFVBQVA7QUFBQSxRQUFtQixPQUFBLEVBQVMsS0FBNUI7QUFBQSxRQUFtQyxTQUFBLEVBQVcsY0FBOUM7T0FBN0IsQ0FEZCxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsV0FBRCxHQUFlLEdBQUEsQ0FBQSxtQkFIZixDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBQyxDQUFBLFVBQVUsQ0FBQyxrQkFBWixDQUErQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxPQUFELEdBQUE7QUFDOUMsY0FBQSwrQkFBQTtBQUFBLFVBQUEsS0FBQyxDQUFBLFVBQVUsQ0FBQyxnQkFBWixDQUE2QixPQUE3QixDQUFBLENBQUE7QUFBQSxVQUtBLGFBQUEsR0FBZ0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUxoQixDQUFBO0FBQUEsVUFNQSxnQkFBQSxHQUFtQixhQUFhLENBQUMsb0JBQWQsQ0FBbUMscUJBQW5DLENBQTBELENBQUEsQ0FBQSxDQU43RSxDQUFBO0FBT0EsVUFBQSxJQUFBLENBQUEsSUFBMkIsQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQkFBaEIsQ0FBdkI7QUFBQSxZQUFBLE9BQUEsR0FBVSxLQUFWLENBQUE7V0FQQTtpQkFRQSxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsTUFBM0IsQ0FBa0MsYUFBbEMsRUFBaUQsT0FBakQsRUFUOEM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEvQixDQUFqQixDQUxBLENBQUE7YUFnQkEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFDZjtBQUFBLFFBQUEsZUFBQSxFQUFpQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsTUFBRCxDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQjtPQURlLENBQWpCLEVBakJRO0lBQUEsQ0FSVjtBQUFBLElBNEJBLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixNQUFBLElBQUMsQ0FBQSxVQUFVLENBQUMsT0FBWixDQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFVBQVUsQ0FBQyxPQUFaLENBQUEsQ0FEQSxDQUFBO2FBRUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUEsRUFIVTtJQUFBLENBNUJaO0FBQUEsSUFpQ0EsTUFBQSxFQUFRLFNBQUEsR0FBQTtBQUNOLE1BQUEsSUFBRyxJQUFDLENBQUEsVUFBVSxDQUFDLFNBQVosQ0FBQSxDQUFIO2VBQ0UsSUFBQyxDQUFBLFVBQVUsQ0FBQyxJQUFaLENBQUEsRUFERjtPQUFBLE1BQUE7ZUFHRSxJQUFDLENBQUEsVUFBVSxDQUFDLElBQVosQ0FBQSxFQUhGO09BRE07SUFBQSxDQWpDUjtHQUxGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/vitaminafront/.atom/packages/expose/lib/expose.coffee
