(function() {
  var Path;

  Path = require('path');

  describe('auto-detect-indentation', function() {
    var activationPromise, editor, workspace, _ref;
    _ref = [], editor = _ref[0], workspace = _ref[1], activationPromise = _ref[2];
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.packages.activatePackage("auto-detect-indentation");
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage("language-c");
      });
      return waitsForPromise(function() {
        return atom.packages.activatePackage("language-sass");
      });
    });
    describe('when a file is opened with 4 spaces', function() {
      beforeEach(function() {
        atom.config.set("editor.tabLength", 2);
        atom.config.set("editor.softTabs", false);
        waitsForPromise(function() {
          return atom.workspace.open(Path.join(__dirname, './fixtures/4-spaces.rb'));
        });
        return runs(function() {
          return editor = atom.workspace.getActiveTextEditor();
        });
      });
      it("will report 4 spaces", function() {
        return expect(editor.getTabLength()).toBe(4);
      });
      return it("will report soft tabs", function() {
        return expect(editor.getSoftTabs()).toBe(true);
      });
    });
    describe('when a file is opened with 2 spaces', function() {
      beforeEach(function() {
        atom.config.set("editor.tabLength", 4);
        atom.config.set("editor.softTabs", false);
        waitsForPromise(function() {
          return atom.workspace.open(Path.join(__dirname, './fixtures/2-spaces.py'));
        });
        return runs(function() {
          return editor = atom.workspace.getActiveTextEditor();
        });
      });
      it("will report 2 spaces", function() {
        return expect(editor.getTabLength()).toBe(2);
      });
      return it("will report soft tabs", function() {
        return expect(editor.getSoftTabs()).toBe(true);
      });
    });
    describe('when a file is opened with 4 spaces but first spacing is longer', function() {
      beforeEach(function() {
        atom.config.set("editor.tabLength", 2);
        atom.config.set("editor.softTabs", false);
        waitsForPromise(function() {
          return atom.workspace.open(Path.join(__dirname, './fixtures/lined-up-params.py'));
        });
        return runs(function() {
          return editor = atom.workspace.getActiveTextEditor();
        });
      });
      it("will report 4 spaces", function() {
        return expect(editor.getTabLength()).toBe(4);
      });
      return it("will report soft tabs", function() {
        return expect(editor.getSoftTabs()).toBe(true);
      });
    });
    describe('when a file is opened with tabs', function() {
      beforeEach(function() {
        atom.config.set("editor.tabLength", 4);
        atom.config.set("editor.softTabs", true);
        waitsForPromise(function() {
          return atom.workspace.open(Path.join(__dirname, './fixtures/tabs.rb'));
        });
        return runs(function() {
          return editor = atom.workspace.getActiveTextEditor();
        });
      });
      it("will report hard tabs", function() {
        return expect(editor.getSoftTabs()).toBe(false);
      });
      return it("will report tab length of 4", function() {
        return expect(editor.getTabLength()).toBe(4);
      });
    });
    describe('when a file is opened with mostly tabs but has one line with spaces', function() {
      beforeEach(function() {
        atom.config.set("editor.tabLength", 2);
        atom.config.set("editor.softTabs", true);
        waitsForPromise(function() {
          return atom.workspace.open(Path.join(__dirname, './fixtures/mostly-tabs.rb'));
        });
        return runs(function() {
          return editor = atom.workspace.getActiveTextEditor();
        });
      });
      it("will report hard tabs", function() {
        return expect(editor.getSoftTabs()).toBe(false);
      });
      return it("will report tab length of 2", function() {
        return expect(editor.getTabLength()).toBe(2);
      });
    });
    describe('when a file is opened with mostly spaces but a couple lines have tabs', function() {
      beforeEach(function() {
        atom.config.set("editor.tabLength", 2);
        atom.config.set("editor.softTabs", false);
        waitsForPromise(function() {
          return atom.workspace.open(Path.join(__dirname, './fixtures/mostly-spaces.rb'));
        });
        return runs(function() {
          return editor = atom.workspace.getActiveTextEditor();
        });
      });
      it("will report 6 spaces", function() {
        return expect(editor.getTabLength()).toBe(6);
      });
      return it("will report soft tabs", function() {
        return expect(editor.getSoftTabs()).toBe(true);
      });
    });
    describe('when a file is opened with c style block comments', function() {
      beforeEach(function() {
        atom.config.set("editor.tabLength", 4);
        atom.config.set("editor.softTabs", false);
        waitsForPromise(function() {
          return atom.workspace.open(Path.join(__dirname, './fixtures/c-style-block-comments.c'));
        });
        return runs(function() {
          return editor = atom.workspace.getActiveTextEditor();
        });
      });
      it("will report 2 spaces", function() {
        return expect(editor.getTabLength()).toBe(2);
      });
      return it("will report soft tabs", function() {
        return expect(editor.getSoftTabs()).toBe(true);
      });
    });
    describe('when a file is opened with c style block comments near the end or line 100', function() {
      beforeEach(function() {
        atom.config.set("editor.tabLength", 4);
        atom.config.set("editor.softTabs", false);
        waitsForPromise(function() {
          return atom.workspace.open(Path.join(__dirname, './fixtures/c-style-block-comments-at-end.c'));
        });
        return runs(function() {
          return editor = atom.workspace.getActiveTextEditor();
        });
      });
      it("will report 2 spaces", function() {
        return expect(editor.getTabLength()).toBe(2);
      });
      return it("will report soft tabs", function() {
        return expect(editor.getSoftTabs()).toBe(true);
      });
    });
    return describe('when a file is opened only comments', function() {
      beforeEach(function() {
        atom.config.set("editor.tabLength", 4);
        atom.config.set("editor.softTabs", false);
        waitsForPromise(function() {
          return atom.workspace.open(Path.join(__dirname, './fixtures/only-comments.scss'));
        });
        return runs(function() {
          return editor = atom.workspace.getActiveTextEditor();
        });
      });
      it("will pass this test because it didn't infinite loop", function() {
        return expect(true).toBe(true);
      });
      it("will report 4 spaces", function() {
        return expect(editor.getTabLength()).toBe(4);
      });
      return it("will report tabs", function() {
        return expect(editor.getSoftTabs()).toBe(false);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpdGFtaW5hZnJvbnQvLmF0b20vcGFja2FnZXMvYXV0by1kZXRlY3QtaW5kZW50YXRpb24vc3BlYy9hdXRvLWRldGVjdC1pbmRlbnRhdGlvbi1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxJQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsQ0FBUyx5QkFBVCxFQUFvQyxTQUFBLEdBQUE7QUFDbEMsUUFBQSwwQ0FBQTtBQUFBLElBQUEsT0FBeUMsRUFBekMsRUFBQyxnQkFBRCxFQUFTLG1CQUFULEVBQW9CLDJCQUFwQixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBRVQsTUFBQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4Qix5QkFBOUIsRUFEYztNQUFBLENBQWhCLENBQUEsQ0FBQTtBQUFBLE1BSUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsWUFBOUIsRUFEYztNQUFBLENBQWhCLENBSkEsQ0FBQTthQU9BLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLGVBQTlCLEVBRGM7TUFBQSxDQUFoQixFQVRTO0lBQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxJQWNBLFFBQUEsQ0FBUyxxQ0FBVCxFQUFnRCxTQUFBLEdBQUE7QUFFOUMsTUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsUUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isa0JBQWhCLEVBQW9DLENBQXBDLENBQUEsQ0FBQTtBQUFBLFFBQ0EsSUFBSSxDQUFDLE1B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

//# sourceURL=/Users/vitaminafront/.atom/packages/auto-detect-indentation/spec/auto-detect-indentation-spec.coffee
