(function() {
  var cubes, list, math, num, number, opposite, race, square,
    __slice = [].slice;

  number = 42;

  opposite = true;

  if (opposite) {
    number = -42;
  }

  square = function(x) {
    return x * x;
  };

  list = [1, 2, 3, 4, 5];

  math = {
    root: Math.sqrt,
    square: square,
    cube: function(x) {
      return x * square(x);
    }
  };

  race = function() {
    var runners, winner;
    winner = arguments[0], runners = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return print(winner, runners);
  };

  if (typeof elvis !== "undefined" && elvis !== null) {
    alert("I knew it!");
  }

  cubes = (function() {
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      num = list[_i];
      _results.push(math.cube(num));
    }
    return _results;
  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpdGFtaW5hZnJvbnQvLmF0b20vcGFja2FnZXMvc2V0aS1zeW50YXgvc2FtcGxlLWZpbGVzL0NvZmZlU2NyaXB0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUNBO0FBQUEsTUFBQSxzREFBQTtJQUFBLGtCQUFBOztBQUFBLEVBQUEsTUFBQSxHQUFXLEVBQVgsQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxJQURYLENBQUE7O0FBSUEsRUFBQSxJQUFnQixRQUFoQjtBQUFBLElBQUEsTUFBQSxHQUFTLENBQUEsRUFBVCxDQUFBO0dBSkE7O0FBQUEsRUFPQSxNQUFBLEdBQVMsU0FBQyxDQUFELEdBQUE7V0FBTyxDQUFBLEdBQUksRUFBWDtFQUFBLENBUFQsQ0FBQTs7QUFBQSxFQVVBLElBQUEsR0FBTyxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVYsRUFBYSxDQUFiLENBVlAsQ0FBQTs7QUFBQSxFQWFBLElBQUEsR0FDRTtBQUFBLElBQUEsSUFBQSxFQUFRLElBQUksQ0FBQyxJQUFiO0FBQUEsSUFDQSxNQUFBLEVBQVEsTUFEUjtBQUFBLElBRUEsSUFBQSxFQUFRLFNBQUMsQ0FBRCxHQUFBO2FBQU8sQ0FBQSxHQUFJLE1BQUEsQ0FBTyxDQUFQLEVBQVg7SUFBQSxDQUZSO0dBZEYsQ0FBQTs7QUFBQSxFQW1CQSxJQUFBLEdBQU8sU0FBQSxHQUFBO0FBQ0wsUUFBQSxlQUFBO0FBQUEsSUFETSx1QkFBUSxpRUFDZCxDQUFBO1dBQUEsS0FBQSxDQUFNLE1BQU4sRUFBYyxPQUFkLEVBREs7RUFBQSxDQW5CUCxDQUFBOztBQXVCQSxFQUFBLElBQXNCLDhDQUF0QjtBQUFBLElBQUEsS0FBQSxDQUFNLFlBQU4sQ0FBQSxDQUFBO0dBdkJBOztBQUFBLEVBMEJBLEtBQUE7O0FBQVM7U0FBQSwyQ0FBQTtxQkFBQTtBQUFBLG9CQUFBLElBQUksQ0FBQyxJQUFMLENBQVUsR0FBVixFQUFBLENBQUE7QUFBQTs7TUExQlQsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/vitaminafront/.atom/packages/seti-syntax/sample-files/CoffeScript.coffee
