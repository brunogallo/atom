(function() {
  var VariableParser, registry;

  VariableParser = require('../lib/variable-parser');

  registry = require('../lib/variable-expressions');

  describe('VariableParser', function() {
    var itParses, parser;
    parser = [][0];
    itParses = function(expression) {
      return {
        as: function(variables) {
          it("parses '" + expression + "' as variables " + (jasmine.pp(variables)), function() {
            var expected, name, range, results, value, _i, _len, _ref, _results;
            results = parser.parse(expression);
            expect(results.length).toEqual(Object.keys(variables).length);
            _results = [];
            for (_i = 0, _len = results.length; _i < _len; _i++) {
              _ref = results[_i], name = _ref.name, value = _ref.value, range = _ref.range;
              expected = variables[name];
              if (expected.value != null) {
                _results.push(expect(value).toEqual(expected.value));
              } else if (expected.range != null) {
                _results.push(expect(range).toEqual(expected.range));
              } else {
                _results.push(expect(value).toEqual(expected));
              }
            }
            return _results;
          });
          return this;
        },
        asUndefined: function() {
          return it("does not parse '" + expression + "' as a variable expression", function() {
            var results;
            results = parser.parse(expression);
            return expect(results).toBeUndefined();
          });
        }
      };
    };
    beforeEach(function() {
      return parser = new VariableParser(registry);
    });
    itParses('color = white').as({
      'color': 'white'
    });
    itParses('non-color = 10px').as({
      'non-color': '10px'
    });
    itParses('$color: white').as({
      '$color': 'white'
    });
    itParses('$color  : white').as({
      '$color': 'white'
    });
    itParses('$some-color: white;').as({
      '$some-color': 'white',
      '$some_color': 'white'
    });
    itParses('$some_color  : white').as({
      '$some-color': 'white',
      '$some_color': 'white'
    });
    itParses('$non-color: 10px;').as({
      '$non-color': '10px',
      '$non_color': '10px'
    });
    itParses('$non_color: 10px').as({
      '$non-color': '10px',
      '$non_color': '10px'
    });
    itParses('@color: white;').as({
      '@color': 'white'
    });
    itParses('@non-color: 10px;').as({
      '@non-color': '10px'
    });
    itParses('@non--color: 10px;').as({
      '@non--color': '10px'
    });
    itParses('--color: white;').as({
      'var(--color)': 'white'
    });
    itParses('--non-color: 10px;').as({
      'var(--non-color)': '10px'
    });
    itParses('\n.error--large(@color: red) {\n  background-color: @color;\n}').asUndefined();
    return itParses("colors = {\n  red: rgb(255,0,0),\n  green: rgb(0,255,0),\n  blue: rgb(0,0,255)\n  value: 10px\n  light: {\n    base: lightgrey\n  }\n  dark: {\n    base: slategrey\n  }\n}").as({
      'colors.red': {
        value: 'rgb(255,0,0)',
        range: [[1, 2], [1, 14]]
      },
      'colors.green': {
        value: 'rgb(0,255,0)',
        range: [[2, 2], [2, 16]]
      },
      'colors.blue': {
        value: 'rgb(0,0,255)',
        range: [[3, 2], [3, 15]]
      },
      'colors.value': {
        value: '10px',
        range: [[4, 2], [4, 13]]
      },
      'colors.light.base': {
        value: 'lightgrey',
        range: [[9, 4], [9, 17]]
      },
      'colors.dark.base': {
        value: 'slategrey',
        range: [[12, 4], [12, 14]]
      }
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpdGFtaW5hZnJvbnQvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvc3BlYy92YXJpYWJsZS1wYXJzZXItc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0JBQUE7O0FBQUEsRUFBQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSx3QkFBUixDQUFqQixDQUFBOztBQUFBLEVBQ0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSw2QkFBUixDQURYLENBQUE7O0FBQUEsRUFHQSxRQUFBLENBQVMsZ0JBQVQsRUFBMkIsU0FBQSxHQUFBO0FBQ3pCLFFBQUEsZ0JBQUE7QUFBQSxJQUFDLFNBQVUsS0FBWCxDQUFBO0FBQUEsSUFFQSxRQUFBLEdBQVcsU0FBQyxVQUFELEdBQUE7YUFDVDtBQUFBLFFBQUEsRUFBQSxFQUFJLFNBQUMsU0FBRCxHQUFBO0FBQ0YsVUFBQSxFQUFBLENBQUksVUFBQSxHQUFVLFVBQVYsR0FBcUIsaUJBQXJCLEdBQXFDLENBQUMsT0FBTyxDQUFDLEVBQVIsQ0FBVyxTQUFYLENBQUQsQ0FBekMsRUFBbUUsU0FBQSxHQUFBO0FBQ2pFLGdCQUFBLCtEQUFBO0FBQUEsWUFBQSxPQUFBLEdBQVUsTUFBTSxDQUFDLEtBQVAsQ0FBYSxVQUFiLENBQVYsQ0FBQTtBQUFBLFlBRUEsTUFBQSxDQUFPLE9BQU8sQ0FBQyxNQUFmLENBQXNCLENBQUMsT0FBdkIsQ0FBK0IsTUFBTSxDQUFDLElBQVAsQ0FBWSxTQUFaLENBQXNCLENBQUMsTUFBdEQsQ0FGQSxDQUFBO0FBR0E7aUJBQUEsOENBQUEsR0FBQTtBQUNFLGtDQURHLFlBQUEsTUFBTSxhQUFBLE9BQU8sYUFBQSxLQUNoQixDQUFBO0FBQUEsY0FBQSxRQUFBLEdBQVcsU0FBVSxDQUFBLElBQUEsQ0FBckIsQ0FBQTtBQUNBLGNBQUEsSUFBRyxzQkFBSDs4QkFDRSxN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

//# sourceURL=/Users/vitaminafront/.atom/packages/pigments/spec/variable-parser-spec.coffee
