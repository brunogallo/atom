(function() {
  var Project, db, utils;

  Project = require('../lib/project');

  utils = require('./utils');

  db = require('../lib/db');

  db.updateFilepath(utils.dbPath());

  describe("Project", function() {
    beforeEach(function() {});
    it("recieves default properties", function() {
      var project, properties;
      properties = {
        title: "Test",
        paths: ["/Users/"]
      };
      project = new Project(properties);
      return expect(project.props.icon).toBe('icon-chevron-right');
    });
    it("does not validate without proper properties", function() {
      var project, properties;
      properties = {
        title: "Test"
      };
      project = new Project(properties);
      return expect(project.isValid()).toBe(false);
    });
    it("automatically updates it's properties", function() {
      var project, props;
      props = {
        title: "testAutomaticUpdates",
        paths: ["/Users/test-automatic-updates"]
      };
      project = new Project(props);
      project.save();
      spyOn(project, 'updateProps').andCallThrough();
      expect(project.props.icon).toBe('icon-chevron-right');
      props.icon = 'icon-test';
      db.add(props);
      return project.onUpdate(function() {
        expect(project.updateProps).toHaveBeenCalled();
        return expect(project.props.icon).toBe('icon-test');
      });
    });
    return describe("::save", function() {
      it("does not save if not valid", function() {
        var project;
        project = new Project();
        return expect(project.save()).toBe(false);
      });
      it("only saves settings that isn't default", function() {
        var project, props;
        props = {
          title: 'Test',
          paths: ['/Users/test']
        };
        project = new Project(props);
        return expect(project.getPropsToSave()).toEqual(props);
      });
      it("saves project if _id isn't set", function() {
        var project;
        project = new Project({
          title: 'saveProjectIfIDIsntSet',
          paths: ['/Test/']
        });
        spyOn(db, 'add').andCallThrough();
        spyOn(db, 'update').andCallThrough();
        project.save();
        expect(db.add).toHaveBeenCalled();
        return expect(db.update).not.toHaveBeenCalled();
      });
      return it("updates project if _id is set", function() {
        var props;
        props = {
          title: 'updateProjectIfIDIsSet',
          paths: ['/Test/']
        };
        spyOn(db, 'update').andCallThrough();
        return db.add(props, function(id) {
          var project;
          props._id = id;
          project = new Project(props);
          project.save();
          return expect(db.update).toHaveBeenCalled();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpdGFtaW5hZnJvbnQvLmF0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL3NwZWMvcHJvamVjdC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrQkFBQTs7QUFBQSxFQUFBLE9BQUEsR0FBVSxPQUFBLENBQVEsZ0JBQVIsQ0FBVixDQUFBOztBQUFBLEVBQ0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSLENBRFIsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsV0FBUixDQUZMLENBQUE7O0FBQUEsRUFHQSxFQUFFLENBQUMsY0FBSCxDQUFrQixLQUFLLENBQUMsTUFBTixDQUFBLENBQWxCLENBSEEsQ0FBQTs7QUFBQSxFQUtBLFFBQUEsQ0FBUyxTQUFULEVBQW9CLFNBQUEsR0FBQTtBQUVsQixJQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxJQUVBLEVBQUEsQ0FBRyw2QkFBSCxFQUFrQyxTQUFBLEdBQUE7QUFDaEMsVUFBQSxtQkFBQTtBQUFBLE1BQUEsVUFBQSxHQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sTUFBUDtBQUFBLFFBQ0EsS0FBQSxFQUFPLENBQUMsU0FBRCxDQURQO09BREYsQ0FBQTtBQUFBLE1BR0EsT0FBQSxHQUFjLElBQUEsT0FBQSxDQUFRLFVBQVIsQ0FIZCxDQUFBO2FBS0EsTUFBQSxDQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBckIsQ0FBMEIsQ0FBQyxJQUEzQixDQUFnQyxvQkFBaEMsRUFOZ0M7SUFBQSxDQUFsQyxDQUZBLENBQUE7QUFBQSxJQVVBLEVBQUEsQ0FBRyw2Q0FBSCxFQUFrRCxTQUFBLEdBQUE7QUFDaEQsVUFBQSxtQkFBQTtBQUFBLE1BQUEsVUFBQSxHQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sTUFB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

//# sourceURL=/Users/vitaminafront/.atom/packages/project-manager/spec/project-spec.coffee