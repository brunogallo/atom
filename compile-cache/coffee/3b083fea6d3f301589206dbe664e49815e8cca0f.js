(function() {
  var Expose;

  Expose = require('../lib/expose');

  describe("Expose", function() {
    var activationPromise, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], activationPromise = _ref[1];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return activationPromise = atom.packages.activatePackage('expose');
    });
    return describe("when the expose:toggle event is triggered", function() {
      it("hides and shows the modal panel", function() {
        expect(workspaceElement.querySelector('.expose-view')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'expose:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var exposeModule;
          expect(workspaceElement.querySelector('.expose-view')).toExist();
          exposeModule = atom.packages.loadedPackages['expose'].mainModule;
          expect(exposeModule.modalPanel.isVisible()).toBe(true);
          atom.commands.dispatch(workspaceElement, 'expose:toggle');
          return expect(exposeModule.modalPanel.isVisible()).toBe(false);
        });
      });
      it("hides and shows the view", function() {
        jasmine.attachToDOM(workspaceElement);
        expect(workspaceElement.querySelector('.expose-view')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'expose:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var exposeElement;
          exposeElement = workspaceElement.querySelector('.expose-view');
          expect(exposeElement).toBeVisible();
          atom.commands.dispatch(workspaceElement, 'expose:toggle');
          return expect(exposeElement).not.toBeVisible();
        });
      });
      return it("disables animations with config", function() {
        atom.commands.dispatch(workspaceElement, 'expose:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var exposeElement;
          exposeElement = workspaceElement.querySelector('.expose-view');
          expect(exposeElement.classList.toString()).toContain('animate');
          atom.commands.dispatch(workspaceElement, 'expose:toggle');
          atom.config.set('expose.useAnimations', false);
          atom.commands.dispatch(workspaceElement, 'expose:toggle');
          return expect(exposeElement.classList.toString()).not.toContain('animate');
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpdGFtaW5hZnJvbnQvLmF0b20vcGFja2FnZXMvZXhwb3NlL3NwZWMvZXhwb3NlLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLE1BQUE7O0FBQUEsRUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLGVBQVIsQ0FBVCxDQUFBOztBQUFBLEVBRUEsUUFBQSxDQUFTLFFBQVQsRUFBbUIsU0FBQSxHQUFBO0FBQ2pCLFFBQUEseUNBQUE7QUFBQSxJQUFBLE9BQXdDLEVBQXhDLEVBQUMsMEJBQUQsRUFBbUIsMkJBQW5CLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FBbkIsQ0FBQTthQUNBLGlCQUFBLEdBQW9CLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixRQUE5QixFQUZYO0lBQUEsQ0FBWCxDQUZBLENBQUE7V0FNQSxRQUFBLENBQVMsMkNBQVQsRUFBc0QsU0FBQSxHQUFBO0FBQ3BELE1BQUEsRUFBQSxDQUFHLGlDQUFILEVBQXNDLFNBQUEsR0FBQTtBQUNwQyxRQUFBLE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixjQUEvQixDQUFQLENBQXNELENBQUMsR0FBRyxDQUFDLE9BQTNELENBQUEsQ0FBQSxDQUFBO0FBQUEsUUFFQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLGVBQXpDLENBRkEsQ0FBQTtBQUFBLFFBSUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7aUJBQ2Qsa0JBRGM7UUFBQSxDQUFoQixDQUpBLENBQUE7ZUFPQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsY0FBQSxZQUFBO0FBQUEsVUFB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

//# sourceURL=/Users/vitaminafront/.atom/packages/expose/spec/expose-spec.coffee
