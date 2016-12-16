(function() {
  var db, os, projects, utils;

  os = require('os');

  utils = require('./utils');

  db = require('../lib/db');

  db.updateFilepath(utils.dbPath());

  projects = {
    testproject1: {
      title: "Test project 1",
      group: "Test",
      paths: ["/Users/project-1"]
    },
    testproject2: {
      _id: 'testproject2',
      title: "Test project 2",
      paths: ["/Users/project-2"]
    }
  };

  db.writeFile(projects);

  describe("DB", function() {
    describe("::addUpdater", function() {
      it("finds project from path", function() {
        var query;
        query = {
          key: 'paths',
          value: projects.testproject2.paths
        };
        db.addUpdater('noIdMatchButPathMatch', query, (function(_this) {
          return function(props) {
            return expect(props._id).toBe('testproject2');
          };
        })(this));
        return db.emitter.emit('db-updated');
      });
      it("finds project from title", function() {
        var query;
        query = {
          key: 'title',
          value: 'Test project 1'
        };
        db.addUpdater('noIdMatchButTitleMatch', query, (function(_this) {
          return function(props) {
            return expect(props.title).toBe(query.value);
          };
        })(this));
        return db.emitter.emit('db-updated');
      });
      it("finds project from id", function() {
        var query;
        query = {
          key: '_id',
          value: 'testproject1'
        };
        db.addUpdater('shouldIdMatchButNotOnThis', query, (function(_this) {
          return function(props) {
            return expect(props._id).toBe(query.value);
          };
        })(this));
        return db.emitter.emit('db-updated');
      });
      return it("finds nothing if query is wrong", function() {
        var haveBeenChanged, query;
        query = {
          key: '_id',
          value: 'IHaveNoID'
        };
        haveBeenChanged = false;
        db.addUpdater('noIdMatch', query, (function(_this) {
          return function(props) {
            return haveBeenChanged = true;
          };
        })(this));
        db.emitter.emit('db-updated');
        return expect(haveBeenChanged).toBe(false);
      });
    });
    it("can add a project", function() {
      var newProject;
      newProject = {
        title: "New Project",
        paths: ["/Users/new-project"]
      };
      return db.add(newProject, function(id) {
        expect(id).toBe('newproject');
        return db.find(function(projects) {
          var found, project, _i, _len;
          found = false;
          for (_i = 0, _len = projects.length; _i < _len; _i++) {
            project = projects[_i];
            if (project._id = 'newproject') {
              found = true;
            }
          }
          return expect(found).toBe(true);
        });
      });
    });
    return it("can remove a project", function() {
      return db["delete"]("testproject1", function() {
        return db.find(function(projects) {
          return expect(projects.length).toBe(1);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpdGFtaW5hZnJvbnQvLmF0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL3NwZWMvZGItc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdUJBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSLENBRFIsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsV0FBUixDQUZMLENBQUE7O0FBQUEsRUFHQSxFQUFFLENBQUMsY0FBSCxDQUFrQixLQUFLLENBQUMsTUFBTixDQUFBLENBQWxCLENBSEEsQ0FBQTs7QUFBQSxFQUlBLFFBQUEsR0FDRTtBQUFBLElBQUEsWUFBQSxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU8sZ0JBQVA7QUFBQSxNQUNBLEtBQUEsRUFBTyxNQURQO0FBQUEsTUFFQSxLQUFBLEVBQU8sQ0FDTCxrQkFESyxDQUZQO0tBREY7QUFBQSxJQU1BLFlBQUEsRUFDRTtBQUFBLE1BQUEsR0FBQSxFQUFLLGNBQUw7QUFBQSxNQUNBLEtBQUEsRUFBTyxnQkFEUDtBQUFBLE1BRUEsS0FBQSxFQUFPLENBQ0wsa0JBREssQ0FGUDtLQVBGO0dBTEYsQ0FBQTs7QUFBQSxFQWtCQSxFQUFFLENBQUMsU0FBSCxDQUFhLFFBQWIsQ0FsQkEsQ0FBQTs7QUFBQSxFQW9CQSxRQUFBLENBQVMsSUFBVCxFQUFlLFNBQUEsR0FBQTtBQUNiLElBQUEsUUFBQSxDQUFTLGNBQVQsRUFBeUIsU0FBQSxHQUFBO0FBQ3ZCLE1BQUEsRUFBQSxDQUFHLHlCQUFILEVBQThCLFNBQUEsR0FBQTtBQUM1QixZQUFBLEtBQUE7QUFBQSxRQUFBLEtBQUEsR0FDRTtBQUFBLFVBQUEsR0FBQSxFQUFLLE9BQUw7QUFB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

//# sourceURL=/Users/vitaminafront/.atom/packages/project-manager/spec/db-spec.coffee
