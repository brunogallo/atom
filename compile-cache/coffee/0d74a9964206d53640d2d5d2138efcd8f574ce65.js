(function() {
  var $, ProjectsListView, db, path, utils;

  utils = require('./utils');

  db = require('../lib/db');

  db.updateFilepath(utils.dbPath());

  ProjectsListView = require('../lib/projects-list-view');

  $ = require('atom-space-pen-views').$;

  path = require('path');

  describe("List View", function() {
    var filterEditorView, list, listView, workspaceElement, _ref;
    _ref = [], listView = _ref[0], workspaceElement = _ref[1], list = _ref[2], filterEditorView = _ref[3];
    beforeEach(function() {
      spyOn(db, 'readFile').andCallFake(function(callback) {
        var data, existingPath;
        existingPath = path.join(__dirname);
        data = {
          one: {
            title: 'project one',
            group: 'Test',
            paths: ['/Does/not/exist']
          },
          two: {
            title: 'project two',
            icon: 'icon-bug',
            paths: [existingPath],
            template: 'two'
          },
          three: {
            title: 'a first',
            group: 'a group',
            paths: ['/Does/not/exist/again']
          }
        };
        return callback(data);
      });
      workspaceElement = atom.views.getView(atom.workspace);
      listView = new ProjectsListView();
      return list = listView.list, filterEditorView = listView.filterEditorView, listView;
    });
    it("will list all projects", function() {
      listView.toggle();
      return expect(list.find('li').length).toBe(3);
    });
    it("will let you know if a path is not available", function() {
      listView.toggle();
      expect(list.find('li').eq(0).data('pathMissing')).toBe(true);
      return expect(list.find('li').eq(1).data('pathMissing')).toBe(false);
    });
    it("will add the correct icon to each project", function() {
      var icon1, icon2;
      listView.toggle();
      icon1 = list.find('li[data-project-id="one"]').find('.icon');
      icon2 = list.find('li[data-project-id="two"]').find('.icon');
      expect(icon1.attr('class')).toContain('icon-chevron-right');
      return expect(icon2.attr('class')).toContain('icon-bug');
    });
    describe("When the text of the mini editor changes", function() {
      beforeEach(function() {
        listView.toggle();
        return listView.isOnDom = function() {
          return true;
        };
      });
      it("will only list projects with the correct title", function() {
        filterEditorView.getModel().setText('title:one');
        window.advanceClock(listView.inputThrottle);
        expect(listView.getFilterKey()).toBe('title');
        expect(listView.getFilterQuery()).toBe('one');
        return expect(list.find('li').length).toBe(1);
      });
      it("will only list projects with the correct group", function() {
        filterEditorView.getModel().setText('group:test');
        window.advanceClock(listView.inputThrottle);
        expect(listView.getFilterKey()).toBe('group');
        expect(listView.getFilterQuery()).toBe('test');
        expect(list.find('li').length).toBe(1);
        return expect(list.find('li:eq(0)').find('.project-manager-list-group')).toHaveText('Test');
      });
      it("will only list projects with the correct template", function() {
        filterEditorView.getModel().setText('template:two');
        window.advanceClock(listView.inputThrottle);
        expect(listView.getFilterKey()).toBe('template');
        expect(listView.getFilterQuery()).toBe('two');
        return expect(list.find('li').length).toBe(1);
      });
      return it("will fall back to default filter key if it's not valid", function() {
        filterEditorView.getModel().setText('test:one');
        window.advanceClock(listView.inputThrottle);
        expect(listView.getFilterKey()).toBe(listView.defaultFilterKey);
        expect(listView.getFilterQuery()).toBe('one');
        return expect(list.find('li').length).toBe(1);
      });
    });
    return describe("It sorts the projects in correct order", function() {
      it("sorts after title", function() {
        atom.config.set('project-manager.sortBy', 'title');
        listView.toggle();
        return expect(list.find('li:eq(0)').data('projectId')).toBe("three");
      });
      return it("sort after group", function() {
        atom.config.set('project-manager.sortBy', 'group');
        listView.toggle();
        return expect(list.find('li:eq(0)').data('projectId')).toBe("three");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpdGFtaW5hZnJvbnQvLmF0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL3NwZWMvcHJvamVjdHMtbGlzdC12aWV3LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9DQUFBOztBQUFBLEVBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSLENBQVIsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsV0FBUixDQURMLENBQUE7O0FBQUEsRUFFQSxFQUFFLENBQUMsY0FBSCxDQUFrQixLQUFLLENBQUMsTUFBTixDQUFBLENBQWxCLENBRkEsQ0FBQTs7QUFBQSxFQUdBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSwyQkFBUixDQUhuQixDQUFBOztBQUFBLEVBSUMsSUFBSyxPQUFBLENBQVEsc0JBQVIsRUFBTCxDQUpELENBQUE7O0FBQUEsRUFLQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FMUCxDQUFBOztBQUFBLEVBT0EsUUFBQSxDQUFTLFdBQVQsRUFBc0IsU0FBQSxHQUFBO0FBQ3BCLFFBQUEsd0RBQUE7QUFBQSxJQUFBLE9BQXVELEVBQXZELEVBQUMsa0JBQUQsRUFBVywwQkFBWCxFQUE2QixjQUE3QixFQUFtQywwQkFBbkMsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsS0FBQSxDQUFNLEVBQU4sRUFBVSxVQUFWLENBQXFCLENBQUMsV0FBdEIsQ0FBa0MsU0FBQyxRQUFELEdBQUE7QUFDaEMsWUFBQSxrQkFBQTtBQUFBLFFBQUEsWUFBQSxHQUFlLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixDQUFmLENBQUE7QUFBQSxRQUNBLElBQUEsR0FDRTtBQUFBLFVBQUEsR0FBQSxFQUNFO0FBQUEsWUFBQSxLQUFBLEVBQU8sYUFBUDtBQUFBLFlB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

//# sourceURL=/Users/vitaminafront/.atom/packages/project-manager/spec/projects-list-view-spec.coffee
