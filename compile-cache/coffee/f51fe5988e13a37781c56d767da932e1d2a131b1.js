(function() {
  var Settings;

  Settings = require('../lib/settings');

  describe("Settings", function() {
    describe(".load(settings)", function() {
      it("Loads the settings provided if they are flat", function() {
        var settings;
        settings = new Settings();
        settings.load({
          "foo.bar.baz": 42
        });
        return expect(atom.config.get("foo.bar.baz")).toBe(42);
      });
      return it("Loads the settings provided if they are an object", function() {
        var settings;
        settings = new Settings();
        expect(atom.config.get('foo.bar.baz')).toBe(void 0);
        settings.load({
          foo: {
            bar: {
              baz: 42
            }
          }
        });
        return expect(atom.config.get('foo.bar.baz')).toBe(42);
      });
    });
    return describe(".load(settings) with a 'scope' option", function() {
      return it("Loads the settings for the scope", function() {
        var scopedSettings, settings;
        settings = new Settings();
        scopedSettings = {
          "*": {
            "foo.bar.baz": 42
          },
          ".source.coffee": {
            "foo.bar.baz": 84
          }
        };
        settings.load(scopedSettings);
        expect(atom.config.get("foo.bar.baz")).toBe(42);
        expect(atom.config.get("foo.bar.baz", {
          scope: [".source.coffee"]
        })).toBe(84);
        return expect(atom.config.get("foo.bar.baz", {
          scope: [".text"]
        })).toBe(42);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpdGFtaW5hZnJvbnQvLmF0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL3NwZWMvc2V0dGluZ3Mtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsUUFBQTs7QUFBQSxFQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEsaUJBQVIsQ0FBWCxDQUFBOztBQUFBLEVBRUEsUUFBQSxDQUFTLFVBQVQsRUFBcUIsU0FBQSxHQUFBO0FBRW5CLElBQUEsUUFBQSxDQUFTLGlCQUFULEVBQTRCLFNBQUEsR0FBQTtBQUMxQixNQUFBLEVBQUEsQ0FBRyw4Q0FBSCxFQUFtRCxTQUFBLEdBQUE7QUFDakQsWUFBQSxRQUFBO0FBQUEsUUFBQSxRQUFBLEdBQWUsSUFBQSxRQUFBLENBQUEsQ0FBZixDQUFBO0FBQUEsUUFDQSxRQUFRLENBQUMsSUFBVCxDQUFjO0FBQUEsVUFBQyxhQUFBLEVBQWUsRUFBaEI7U0FBZCxDQURBLENBQUE7ZUFHQSxNQUFBLENBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGFBQWhCLENBQVAsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxFQUE1QyxFQUppRDtNQUFBLENBQW5ELENBQUEsQ0FBQTthQU1BLEVBQUEsQ0FBRyxtREFBSCxFQUF3RCxTQUFBLEdBQUE7QUFDdEQsWUFBQSxRQUFBO0FBQUEsUUFBQSxRQUFBLEdBQWUsSUFBQSxRQUFBLENBQUEsQ0FBZixDQUFBO0FBQUEsUUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGFBQWhCLENBQVAsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxNQUE1QyxDQURBLENBQUE7QUFBQSxRQUVBLFFBQVEsQ0FBQyxJQUFULENBQWM7QUFBQSxVQUNaLEdBQUEsRUFDRTtBQUFBLFlBQUEsR0FBQSxFQUNFO0FBQUEsY0FBQSxHQUFBLEVBQUssRUFBTDthQURGO1dBRlU7U0FBZCxDQUZBLENBQUE7ZUFPQSxNQUFBLENBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGFBQWhCLENBQVAsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxFQUE1QyxFQVJzRDtNQUFBLENBQXhELEVBUDBCO0lBQUEsQ0FBNUIsQ0FBQSxDQUFBO1dBaUJBLFFBQUEsQ0FBUyx1Q0FBVCxFQUFrRCxTQUFBLEdBQUE7YUFDaEQsRUFBQSxDQUFHLGtDQUFILEVBQXVDLFNBQUEsR0FBQTtBQUNyQyxZQUFBLHdCQUFBO0FBQUEsUUFBQSxRQUFBLEdBQWUsSUFBQSxRQUFBLENBQUEsQ0FBZixDQUFBO0FBQUEsUUFDQSxjQUFBLEdBQ0U7QUFBQSxVQUFBLEdBQUEsRUFDRTtBQUFBLFlBQUEsYUFBQSxFQUFlLEVBQWY7V0FERjtBQUFBLFVBRUEsZ0JBQUEsRUFDRTtBQUFBLFlBQUEsYUFBQSxFQUFlLEVBQWY7V0FIRjtTQUZGLENBQUE7QUFBQSxRQU1BLFFBQVEsQ0FBQyxJQUFULENBQWMsY0FBZCxDQU5BLENBQUE7QUFBQSxRQVFBLE1BQUEsQ0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsYUFBaEIsQ0FBUCxDQUFzQyxDQUFDLElBQXZDLENBQTRDLEVBQTVDLENBUkEsQ0FBQTtBQUFBLFFBU0EsTUFBQSxDQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixhQUFoQixFQUErQjtBQUFBLFVBQUMsS0FBQSxFQUFNLENBQUMsZ0JBQUQsQ0FBUDtTQUEvQixDQUFQLENBQWtFLENBQUMsSUFBbkUsQ0FBd0UsRUFBeEUsQ0FUQSxDQUFBO2VBVUEsTUFBQSxDQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixhQUFoQixFQUErQjtBQUFBLFVBQUMsS0FBQSxFQUFNLENBQUMsT0FBRCxDQUFQO1NBQS9CLENBQVAsQ0FBeUQsQ0FBQyxJQUExRCxDQUErRCxFQUEvRCxFQVhxQztNQUFBLENBQXZDLEVBRGdEO0lBQUEsQ0FBbEQsRUFuQm1CO0VBQUEsQ0FBckIsQ0FGQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vitaminafront/.atom/packages/project-manager/spec/settings-spec.coffee
