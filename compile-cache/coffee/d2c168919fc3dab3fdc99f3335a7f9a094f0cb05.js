(function() {
  var ExposeTabView, path;

  path = require('path');

  ExposeTabView = require('../lib/expose-tab-view');

  describe("ExposeTabView", function() {
    var workspaceElement;
    workspaceElement = null;
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return atom.project.setPaths([path.join(__dirname, 'fixtures')]);
    });
    describe("populateTabBody()", function() {
      it("can populate empty item", function() {
        var exposeTabView;
        exposeTabView = new ExposeTabView;
        expect(Object.getOwnPropertyNames(exposeTabView.item)).toHaveLength(0);
        expect(exposeTabView.find('.title').text()).toBe('untitled');
        expect(exposeTabView.tabBody.find('a')).toHaveLength(1);
        expect(exposeTabView.tabBody.find('a').attr('class')).toContain('text');
        return expect(exposeTabView.pending).toBe(false);
      });
      it("populates normal text editor", function() {
        waitsForPromise(function() {
          return atom.workspace.open('sample1.txt');
        });
        return runs(function() {
          var exposeTabView, item;
          item = atom.workspace.getActivePaneItem();
          exposeTabView = new ExposeTabView(item);
          expect(exposeTabView.item).toBeDefined();
          expect(exposeTabView.title).toBe('sample1.txt');
          expect(exposeTabView.tabBody.find('a')).toHaveLength(1);
          return expect(exposeTabView.tabBody.find('a').attr('class')).toContain('code');
        });
      });
      it("populates image editor", function() {
        waitsForPromise(function() {
          atom.packages.activatePackage('image-view');
          return atom.workspace.open('../../screenshots/preview.png');
        });
        return runs(function() {
          var exposeTabView, item;
          item = atom.workspace.getActivePaneItem();
          exposeTabView = new ExposeTabView(item);
          expect(exposeTabView.item).toBeDefined();
          expect(exposeTabView.title).toBe('preview.png');
          expect(exposeTabView.tabBody.find('img')).toHaveLength(1);
          return expect(exposeTabView.tabBody.find('img').attr('src')).toBeDefined();
        });
      });
      it("populates settings view", function() {
        waitsForPromise(function() {
          jasmine.attachToDOM(workspaceElement);
          return atom.packages.activatePackage('settings-view');
        });
        return runs(function() {
          atom.commands.dispatch(workspaceElement, 'settings-view:open');
          waitsFor(function() {
            return atom.workspace.getActivePaneItem();
          });
          return runs(function() {
            var exposeTabView, item;
            item = atom.workspace.getActivePaneItem();
            exposeTabView = new ExposeTabView(item);
            expect(exposeTabView.title).toBe('Settings');
            expect(exposeTabView.tabBody.find('a')).toHaveLength(1);
            return expect(exposeTabView.tabBody.find('a').attr('class')).toContain('tools');
          });
        });
      });
      it("populates archive view", function() {
        waitsForPromise(function() {
          atom.packages.activatePackage('archive-view');
          return atom.workspace.open('archive.zip');
        });
        return runs(function() {
          var exposeTabView, item;
          item = atom.workspace.getActivePaneItem();
          exposeTabView = new ExposeTabView(item);
          expect(exposeTabView.title).toBe('archive.zip');
          expect(exposeTabView.tabBody.find('a')).toHaveLength(1);
          return expect(exposeTabView.tabBody.find('a').attr('class')).toContain('zip');
        });
      });
      it("populates markdown view", function() {
        waitsForPromise(function() {
          atom.packages.activatePackage('markdown-preview');
          return atom.workspace.open('../../README.md');
        });
        return runs(function() {
          var item;
          item = null;
          atom.commands.dispatch(workspaceElement, 'markdown-preview:toggle');
          waitsFor(function() {
            return item = atom.workspace.getPaneItems()[1];
          });
          return runs(function() {
            var exposeTabView;
            exposeTabView = new ExposeTabView(item);
            expect(exposeTabView.title).toBe('Markdown Preview');
            expect(exposeTabView.tabBody.find('a')).toHaveLength(1);
            return expect(exposeTabView.tabBody.find('a').attr('class')).toContain('markdown');
          });
        });
      });
      it("populates text editor with minimap activated", function() {
        waitsForPromise(function() {
          atom.packages.activatePackage('minimap');
          jasmine.attachToDOM(workspaceElement);
          return atom.workspace.open('sample1.txt');
        });
        return runs(function() {
          var exposeTabView, item;
          item = atom.workspace.getActivePaneItem();
          exposeTabView = new ExposeTabView(item);
          waitsFor(function() {
            return exposeTabView.tabBody.html();
          });
          return runs(function() {
            expect(exposeTabView.item).toBeDefined();
            expect(exposeTabView.title).toBe('sample1.txt');
            return expect(exposeTabView.tabBody.find('atom-text-editor-minimap')).toHaveLength(1);
          });
        });
      });
      return it("marks pending tabs", function() {
        waitsForPromise(function() {
          return atom.workspace.open('sample1.txt', {
            pending: true
          });
        });
        return runs(function() {
          var exposeTabView, item;
          item = atom.workspace.getActivePaneItem();
          exposeTabView = new ExposeTabView(item);
          expect(exposeTabView.title).toBe('sample1.txt');
          return expect(exposeTabView.pending).toBe(true);
        });
      });
    });
    describe("closeTab()", function() {
      return it("destroys selected tab item", function() {
        waitsForPromise(function() {
          return atom.workspace.open('sample1.txt');
        });
        return runs(function() {
          var exposeTabView, item;
          item = atom.workspace.getActivePaneItem();
          exposeTabView = new ExposeTabView(item);
          expect(atom.workspace.getTextEditors()).toHaveLength(1);
          expect(exposeTabView.title).toBe('sample1.txt');
          expect(exposeTabView.destroyed).toBeFalsy();
          exposeTabView.closeTab();
          expect(atom.workspace.getTextEditors()).toHaveLength(0);
          return expect(exposeTabView.destroyed).toBeTruthy();
        });
      });
    });
    return describe("activateTab()", function() {
      return it("activates selected tab item", function() {
        waitsForPromise(function() {
          atom.workspace.open('sample1.txt');
          return atom.workspace.open('sample2.txt');
        });
        return runs(function() {
          var activeItem, exposeTabView, items;
          items = atom.workspace.getPaneItems();
          activeItem = atom.workspace.getActivePaneItem();
          exposeTabView = new ExposeTabView(items[0]);
          expect(items).toHaveLength(2);
          expect(activeItem.getTitle()).toBe('sample2.txt');
          expect(exposeTabView.title).toBe('sample1.txt');
          exposeTabView.activateTab();
          activeItem = atom.workspace.getActivePaneItem();
          return expect(activeItem.getTitle()).toBe('sample1.txt');
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpdGFtaW5hZnJvbnQvLmF0b20vcGFja2FnZXMvZXhwb3NlL3NwZWMvZXhwb3NlLXRhYi12aWV3LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUVBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLHdCQUFSLENBRmhCLENBQUE7O0FBQUEsRUFJQSxRQUFBLENBQVMsZUFBVCxFQUEwQixTQUFBLEdBQUE7QUFDeEIsUUFBQSxnQkFBQTtBQUFBLElBQUEsZ0JBQUEsR0FBbUIsSUFBbkIsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUFuQixDQUFBO2FBQ0EsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQXNCLENBQUMsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLFVBQXJCLENBQUQsQ0FBdEIsRUFGUztJQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsSUFNQSxRQUFBLENBQVMsbUJBQVQsRUFBOEIsU0FBQSxHQUFBO0FBQzVCLE1BQUEsRUFBQSxDQUFHLHlCQUFILEVBQThCLFNBQUEsR0FBQTtBQUM1QixZQUFBLGFBQUE7QUFBQSxRQUFBLGFBQUEsR0FBZ0IsR0FBQSxDQUFBLGFBQWhCLENBQUE7QUFBQSxRQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsbUJBQVAsQ0FBMkIsYUFBYSxDQUFDLElBQXpDLENBQVAsQ0FBc0QsQ0FBQyxZQUF2RCxDQUFvRSxDQUFwRSxDQURBLENBQUE7QUFBQSxRQUVBLE1BQUEsQ0FBTyxhQUFhLENBQUMsSUFBZCxDQUFt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

//# sourceURL=/Users/vitaminafront/.atom/packages/expose/spec/expose-tab-view-spec.coffee
