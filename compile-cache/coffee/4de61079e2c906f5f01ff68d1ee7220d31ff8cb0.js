(function() {
  var Color;

  require('./helpers/matchers');

  Color = require('../lib/color');

  describe('Color', function() {
    var color;
    color = [][0];
    beforeEach(function() {
      return color = new Color('#66ff6933');
    });
    describe('created with separated components', function() {
      return it('creates the color with the provided components', function() {
        return expect(new Color(255, 127, 64, 0.5)).toBeColor(255, 127, 64, 0.5);
      });
    });
    describe('created with a hexa rgb string', function() {
      return it('creates the color with the provided components', function() {
        return expect(new Color('#ff6933')).toBeColor(255, 105, 51, 1);
      });
    });
    describe('created with a hexa argb string', function() {
      return it('creates the color with the provided components', function() {
        return expect(new Color('#66ff6933')).toBeColor(255, 105, 51, 0.4);
      });
    });
    describe('created with the name of a svg color', function() {
      return it('creates the color using its name', function() {
        return expect(new Color('orange')).toBeColor('#ffa500');
      });
    });
    describe('::isValid', function() {
      it('returns true when all the color components are valid', function() {
        return expect(new Color).toBeValid();
      });
      it('returns false when one component is NaN', function() {
        expect(new Color(NaN, 0, 0, 1)).not.toBeValid();
        expect(new Color(0, NaN, 0, 1)).not.toBeValid();
        expect(new Color(0, 0, NaN, 1)).not.toBeValid();
        return expect(new Color(0, 0, 1, NaN)).not.toBeValid();
      });
      return it('returns false when the color has the invalid flag', function() {
        color = new Color;
        color.invalid = true;
        return expect(color).not.toBeValid();
      });
    });
    describe('::isLiteral', function() {
      it('returns true when the color does not rely on variables', function() {
        return expect(new Color('orange').isLiteral()).toBeTruthy();
      });
      return it('returns false when the color does rely on variables', function() {
        color = new Color(0, 0, 0, 1);
        color.variables = ['foo'];
        return expect(color.isLiteral()).toBeFalsy();
      });
    });
    describe('::rgb', function() {
      it('returns an array with the color components', function() {
        return expect(color.rgb).toBeComponentArrayCloseTo([color.red, color.green, color.blue]);
      });
      return it('sets the color components based on the passed-in values', function() {
        color.rgb = [1, 2, 3];
        return expect(color).toBeColor(1, 2, 3, 0.4);
      });
    });
    describe('::rgba', function() {
      it('returns an array with the color and alpha components', function() {
        return expect(color.rgba).toBeComponentArrayCloseTo([color.red, color.green, color.blue, color.alpha]);
      });
      return it('sets the color components based on the passed-in values', function() {
        color.rgba = [1, 2, 3, 0.7];
        return expect(color).toBeColor(1, 2, 3, 0.7);
      });
    });
    describe('::argb', function() {
      it('returns an array with the alpha and color components', function() {
        return expect(color.argb).toBeComponentArrayCloseTo([color.alpha, color.red, color.green, color.blue]);
      });
      return it('sets the color components based on the passed-in values', function() {
        color.argb = [0.7, 1, 2, 3];
        return expect(color).toBeColor(1, 2, 3, 0.7);
      });
    });
    describe('::hsv', function() {
      it('returns an array with the hue, saturation and value components', function() {
        return expect(color.hsv).toBeComponentArrayCloseTo([16, 80, 100]);
      });
      return it('sets the color components based on the passed-in values', function() {
        color.hsv = [200, 50, 50];
        return expect(color).toBeColor(64, 106, 128, 0.4);
      });
    });
    describe('::hsva', function() {
      it('returns an array with the hue, saturation, value and alpha components', function() {
        return expect(color.hsva).toBeComponentArrayCloseTo([16, 80, 100, 0.4]);
      });
      return it('sets the color components based on the passed-in values', function() {
        color.hsva = [200, 50, 50, 0.7];
        return expect(color).toBeColor(64, 106, 128, 0.7);
      });
    });
    describe('::hsl', function() {
      it('returns an array with the hue, saturation and luminosity components', function() {
        return expect(color.hsl).toBeComponentArrayCloseTo([16, 100, 60]);
      });
      return it('sets the color components based on the passed-in values', function() {
        color.hsl = [200, 50, 50];
        return expect(color).toBeColor(64, 149, 191, 0.4);
      });
    });
    describe('::hsla', function() {
      it('returns an array with the hue, saturation, luminosity and alpha components', function() {
        return expect(color.hsla).toBeComponentArrayCloseTo([16, 100, 60, 0.4]);
      });
      return it('sets the color components based on the passed-in values', function() {
        color.hsla = [200, 50, 50, 0.7];
        return expect(color).toBeColor(64, 149, 191, 0.7);
      });
    });
    describe('::hwb', function() {
      it('returns an array with the hue, whiteness and blackness components', function() {
        return expect(color.hwb).toBeComponentArrayCloseTo([16, 20, 0]);
      });
      return it('sets the color components based on the passed-in values', function() {
        color.hwb = [210, 40, 40];
        return expect(color).toBeColor(102, 128, 153, 0.4);
      });
    });
    describe('::hwba', function() {
      it('returns an array with the hue, whiteness, blackness and alpha components', function() {
        return expect(color.hwba).toBeComponentArrayCloseTo([16, 20, 0, 0.4]);
      });
      return it('sets the color components based on the passed-in values', function() {
        color.hwba = [210, 40, 40, 0.7];
        return expect(color).toBeColor(102, 128, 153, 0.7);
      });
    });
    describe('::hex', function() {
      it('returns the color as a hexadecimal string', function() {
        return expect(color.hex).toEqual('ff6933');
      });
      return it('parses the string and sets the color components accordingly', function() {
        color.hex = '00ff00';
        return expect(color).toBeColor(0, 255, 0, 0.4);
      });
    });
    describe('::hexARGB', function() {
      it('returns the color component as a hexadecimal string', function() {
        return expect(color.hexARGB).toEqual('66ff6933');
      });
      return it('parses the string and sets the color components accordingly', function() {
        color.hexARGB = 'ff00ff00';
        return expect(color).toBeColor(0, 255, 0, 1);
      });
    });
    describe('::hue', function() {
      it('returns the hue component', function() {
        return expect(color.hue).toEqual(color.hsl[0]);
      });
      return it('sets the hue component', function() {
        color.hue = 20;
        return expect(color.hsl).toBeComponentArrayCloseTo([20, 100, 60]);
      });
    });
    describe('::saturation', function() {
      it('returns the saturation component', function() {
        return expect(color.saturation).toEqual(color.hsl[1]);
      });
      return it('sets the saturation component', function() {
        color.saturation = 20;
        return expect(color.hsl).toBeComponentArrayCloseTo([16, 20, 60]);
      });
    });
    describe('::lightness', function() {
      it('returns the lightness component', function() {
        return expect(color.lightness).toEqual(color.hsl[2]);
      });
      return it('sets the lightness component', function() {
        color.lightness = 20;
        return expect(color.hsl).toBeComponentArrayCloseTo([16, 100, 20]);
      });
    });
    describe('::cmyk', function() {
      it('returns an array with the color in CMYK color space', function() {
        color = new Color('#FF7F00');
        return expect(color.cmyk).toBeComponentArrayCloseTo([0, 0.5, 1, 0]);
      });
      return it('sets the color components using cmyk values', function() {
        color.alpha = 1;
        color.cmyk = [0, 0.5, 1, 0];
        return expect(color).toBeColor('#FF7F00');
      });
    });
    describe('::clone', function() {
      return it('returns a copy of the current color', function() {
        expect(color.clone()).toBeColor(color);
        return expect(color.clone()).not.toBe(color);
      });
    });
    describe('::toCSS', function() {
      describe('when the color alpha channel is not 1', function() {
        return it('returns the color as a rgba() color', function() {
          return expect(color.toCSS()).toEqual('rgba(255,105,51,0.4)');
        });
      });
      describe('when the color alpha channel is 1', function() {
        return it('returns the color as a rgb() color', function() {
          color.alpha = 1;
          return expect(color.toCSS()).toEqual('rgb(255,105,51)');
        });
      });
      return describe('when the color have a CSS name', function() {
        return it('only returns the color name', function() {
          color = new Color('orange');
          return expect(color.toCSS()).toEqual('rgb(255,165,0)');
        });
      });
    });
    describe('::interpolate', function() {
      return it('blends the passed-in color linearly based on the passed-in ratio', function() {
        var colorA, colorB, colorC;
        colorA = new Color('#ff0000');
        colorB = new Color('#0000ff');
        colorC = colorA.interpolate(colorB, 0.5);
        return expect(colorC).toBeColor('#7f007f');
      });
    });
    describe('::blend', function() {
      return it('blends the passed-in color based on the passed-in blend function', function() {
        var colorA, colorB, colorC;
        colorA = new Color('#ff0000');
        colorB = new Color('#0000ff');
        colorC = colorA.blend(colorB, function(a, b) {
          return a / 2 + b / 2;
        });
        return expect(colorC).toBeColor('#800080');
      });
    });
    describe('::transparentize', function() {
      return it('returns a new color whose alpha is the passed-in value', function() {
        expect(color.transparentize(1)).toBeColor(255, 105, 51, 1);
        expect(color.transparentize(0.7)).toBeColor(255, 105, 51, 0.7);
        return expect(color.transparentize(0.1)).toBeColor(255, 105, 51, 0.1);
      });
    });
    return describe('::luma', function() {
      return it('returns the luma value of the color', function() {
        return expect(color.luma).toBeCloseTo(0.31, 1);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpdGFtaW5hZnJvbnQvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvc3BlYy9jb2xvci1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxLQUFBOztBQUFBLEVBQUEsT0FBQSxDQUFRLG9CQUFSLENBQUEsQ0FBQTs7QUFBQSxFQUVBLEtBQUEsR0FBUSxPQUFBLENBQVEsY0FBUixDQUZSLENBQUE7O0FBQUEsRUFJQSxRQUFBLENBQVMsT0FBVCxFQUFrQixTQUFBLEdBQUE7QUFDaEIsUUFBQSxLQUFBO0FBQUEsSUFBQyxRQUFTLEtBQVYsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTthQUNULEtBQUEsR0FBWSxJQUFBLEtBQUEsQ0FBTSxXQUFOLEVBREg7SUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLElBS0EsUUFBQSxDQUFTLG1DQUFULEVBQThDLFNBQUEsR0FBQTthQUM1QyxFQUFBLENBQUcsZ0RBQUgsRUFBcUQsU0FBQSxHQUFBO2VBQ25ELE1BQUEsQ0FBVyxJQUFBLEtBQUEsQ0FBTSxHQUFOLEVBQVcsR0FBWCxFQUFnQixFQUFoQixFQUFvQixHQUFwQixDQUFYLENBQW9DLENBQUMsU0FBckMsQ0FBK0MsR0FBL0MsRUFBb0QsR0FBcEQsRUFBeUQsRUFBekQsRUFBNkQsR0FBN0QsRUFEbUQ7TUFBQSxDQUFyRCxFQUQ0QztJQUFBLENBQTlDLENBTEEsQ0FBQTtBQUFBLElBU0EsUUFBQSxDQUFTLGdDQUFULEVBQTJDLFNBQUEsR0FBQTthQUN6QyxFQUFBLENBQUcsZ0RBQUgsRUFBcUQsU0FBQSxHQUFBO2VBQ25ELE1BQUEsQ0FBVyxJQUFBLEtBQUEsQ0FBTSxTQUFOLENBQVgsQ0FBNEIsQ0FBQyxTQUE3QixDQUF1QyxHQUF2QyxFQUE0QyxHQUE1QyxFQUFpRCxFQUFqRCxFQUFxRCxDQUFyRCxFQURtRDtNQUFBLENBQXJELEVBRHlDO0lBQUEsQ0FBM0MsQ0FUQSxDQUFBO0FBQUEsSUFhQSxRQUFBLENBQVMsaUNBQVQsRUFBNEMsU0FBQSxHQUFBO2FBQzFDLEVBQUEsQ0FBRyxnREFBSCxFQUFxRCxTQUFBLEdBQUE7ZUFDbkQsTUFBQSxDQUFXLElBQUEsS0FBQSxDQUFNLFdBQU4sQ0FBWCxDQUE4QixDQUFDLFNBQS9CLENBQXlDLEdBQXpDLEVBQThDLEdBQTlDLEVBQW1ELEVBQW5ELEVBQXVELEdBQXZELEVBRG1EO01BQUEsQ0FBckQsRUFEMEM7SUFBQSxDQUE1QyxDQWJBLENBQUE7QUFBQSxJQWlCQSxRQUFBLENBQVMsc0NBQVQsRUFBaUQsU0FBQSxHQUFBO2FBQy9DLEVBQUEsQ0FBRyxrQ0FBSCxFQUF1QyxTQUFBLEdBQUE7ZUFDckMsTUFBQSxDQUFXLElBQUEsS0FBQSxDQUFNLFFBQU4sQ0FBWCxDQUEyQixDQUFDLFNBQTVCLENBQXNDLFNBQXRDLEVBRHFDO01BQUEsQ0FBdkMsRUFEK0M7SUFBQSxDQUFqRCxDQWpCQSxDQUFBO0FBQUEsSUFxQkEsUUFBQSxDQUFTLFdBQVQsRUFBc0IsU0FBQSxHQUFBO0FBQ3BCLE1BQUEsRUFBQSxDQUFHLHNEQUFILEVBQTJELFNBQUEsR0FBQTtlQUN6RCxNQUFBLENBQU8sR0FBQSxDQUFBLEtBQVAsQ0FBaUIsQ0FBQyxTQUFsQixDQUFBLEVBRHlEO01BQUEsQ0FBM0QsQ0FBQSxDQUFBO0FBQUEsTUFHQSxFQUFBLENBQUcseUNBQUgsRUFBOEMsU0FBQSxHQUFBO0FBQzVDLFFBQUEsTUFBQSxDQUFXLElBQUEsS0FBQSxDQUFNLEdBQU4sRUFBVyxDQUFYLEVBQWMsQ0FBZCxFQUFpQixDQUFqQixDQUFYLENBQThCLENBQUMsR0FBRyxDQUFDLFNBQW5DLENBQUEsQ0FBQSxDQUFBO0FBQUEsUUFDQSxNQUFBLENBQVcsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLEdBQVQsRUFBYyxDQUFkLEVBQWlCLENBQWpCLENBQVgsQ0FBOEIsQ0FBQyxHQUFHLENBQUMsU0FBbkMsQ0FBQSxDQURBLENBQUE7QUFBQSxRQUVBLE1BQUEsQ0FBVyxJQUFBLEtBQUEsQ0FBTSxDQUFOLEVBQVMsQ0FBVCxFQUFZLEdBQVosRUFBaUIsQ0FBakIsQ0FBWCxDQUE4QixDQUFDLEdBQUcsQ0FBQyxTQUFuQyxDQUFBLENBRkEsQ0FBQTtlQUdBLE1BQUEsQ0FBVyxJQUFBLEtBQUEsQ0FBTSxDQUFOLEVBQVMsQ0FBVCxFQUFZLENBQVosRUFBZSxHQUFmLENBQVgsQ0FBOEIsQ0FBQyxHQUFHLENBQUMsU0FBbkMsQ0FBQSxFQUo0QztNQUFBLENBQTlDLENBSEEsQ0FBQTthQVNBLEVBQUEsQ0FBRyxtREFBSCxFQUF3RCxTQUFBLEdBQUE7QUFDdEQsUUFBQSxLQUFBLEdBQVEsR0FBQSxDQUFBLEtBQVIsQ0FBQTtBQUFBLFFBQ0EsS0FBSyxDQUFDLE9BQU4sR0FBZ0IsSUFEaEIsQ0FBQTtlQUVBLE1BQUEsQ0FBTyxLQUFQLENBQWEsQ0FBQyxHQUFHLENBQUMsU0FBbEIsQ0FBQSxFQUhzRDtNQUFBLENBQXhELEVBVm9CO0lBQUEsQ0FBdEIsQ0FyQkEsQ0FBQTtBQUFBLElBb0NBLFFBQUEsQ0FBUyxhQUFULEVBQXdCLFNBQUEsR0FBQTtBQUN0QixNQUFBLEVBQUEsQ0FBRyx3REFBSCxFQUE2RCxTQUFBLEdBQUE7ZUFDM0QsTUFBQSxDQUFXLElBQUEsS0FBQSxDQUFNLFFBQU4sQ0FBZSxDQUFDLFNBQWhCLENBQUEsQ0FBWCxDQUF1QyxDQUFDLFVBQXhDLENBQUEsRUFEMkQ7TUFBQSxDQUE3RCxDQUFBLENBQUE7YUFHQSxFQUFBLENBQUcscURBQUgsRUFBMEQsU0FBQSxHQUFBO0FBQ3hELFFBQUEsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFNLENBQU4sRUFBUSxDQUFSLEVBQVUsQ0FBVixFQUFZLENBQVosQ0FBWixDQUFBO0FBQUEsUUFDQSxLQUFLLENBQUMsU0FBTixHQUFrQixDQUFDLEtBQUQsQ0FEbEIsQ0FBQTtlQUdBLE1BQUEsQ0FBTyxLQUFLLENBQUMsU0FBTixDQUFBLENBQVAsQ0FBeUIsQ0FBQyxTQUExQixDQUFBLEVBSndEO01BQUEsQ0FBMUQsRUFKc0I7SUFBQSxDQUF4QixDQXBDQSxDQUFBO0FBQUEsSUE4Q0EsUUFBQSxDQUFTLE9BQVQsRUFBa0IsU0FBQSxHQUFBO0FBQ2hCLE1BQUEsRUFBQSxDQUFHLDRDQUFILEVBQWlELFNBQUEsR0FBQTtlQUMvQyxNQUFBLENBQU8sS0FBSyxDQUFDLEdBQWIsQ0FBaUIsQ0FBQyx5QkFBbEIsQ0FBNEMsQ0FDMUMsS0FBSyxDQUFDLEdBRG9DLEVBRTFDLEtBQUssQ0FBQyxLQUZvQyxFQUcxQyxLQUFLLENBQUMsSUFIb0MsQ0FBNUMsRUFEK0M7TUFBQSxDQUFqRCxDQUFBLENBQUE7YUFPQSxFQUFBLENBQUcseURBQUgsRUFBOEQsU0FBQSxHQUFBO0FBQzVELFFBQUEsS0FBSyxDQUFDLEdBQU4sR0FBWSxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxDQUFaLENBQUE7ZUFFQSxNQUFBLENBQU8sS0FBUCxDQUFhLENBQUMsU0FBZCxDQUF3QixDQUF4QixFQUEwQixDQUExQixFQUE0QixDQUE1QixFQUE4QixHQUE5QixFQUg0RDtNQUFBLENBQTlELEVBUmdCO0lBQUEsQ0FBbEIsQ0E5Q0EsQ0FBQTtBQUFBLElBMkRBLFFBQUEsQ0FBUyxRQUFULEVBQW1CLFNBQUEsR0FBQTtBQUNqQixNQUFBLEVBQUEsQ0FBRyxzREFBSCxFQUEyRCxTQUFBLEdBQUE7ZUFDekQsTUFBQSxDQUFPLEtBQUssQ0FBQyxJQUFiLENBQWtCLENBQUMseUJBQW5CLENBQTZDLENBQzNDLEtBQUssQ0FBQyxHQURxQyxFQUUzQyxLQUFLLENBQUMsS0FGcUMsRUFHM0MsS0FBSyxDQUFDLElBSHFDLEVBSTNDLEtBQUssQ0FBQyxLQUpxQyxDQUE3QyxFQUR5RDtNQUFBLENBQTNELENBQUEsQ0FBQTthQVFBLEVBQUEsQ0FBRyx5REFBSCxFQUE4RCxTQUFBLEdBQUE7QUFDNUQsUUFBQSxLQUFLLENBQUMsSUFBTixHQUFhLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLEVBQU8sR0FBUCxDQUFiLENBQUE7ZUFFQSxNQUFBLENBQU8sS0FBUCxDQUFhLENBQUMsU0FBZCxDQUF3QixDQUF4QixFQUEwQixDQUExQixFQUE0QixDQUE1QixFQUE4QixHQUE5QixFQUg0RDtNQUFBLENBQTlELEVBVGlCO0lBQUEsQ0FBbkIsQ0EzREEsQ0FBQTtBQUFBLElBeUVBLFFBQUEsQ0FBUyxRQUFULEVBQW1CLFNBQUEsR0FBQTtBQUNqQixNQUFBLEVBQUEsQ0FBRyxzREFBSCxFQUEyRCxTQUFBLEdBQUE7ZUFDekQsTUFBQSxDQUFPLEtBQUssQ0FBQyxJQUFiLENBQWtCLENBQUMseUJBQW5CLENBQTZDLENBQzNDLEtBQUssQ0FBQyxLQURxQyxFQUUzQyxLQUFLLENBQUMsR0FGcUMsRUFHM0MsS0FBSyxDQUFDLEtBSHFDLEVBSTNDLEtBQUssQ0FBQyxJQUpxQyxDQUE3QyxFQUR5RDtNQUFBLENBQTNELENBQUEsQ0FBQTthQVFBLEVBQUEsQ0FBRyx5REFBSCxFQUE4RCxTQUFBLEdBQUE7QUFDNUQsUUFBQSxLQUFLLENBQUMsSUFBTixHQUFhLENBQUMsR0FBRCxFQUFLLENBQUwsRUFBTyxDQUFQLEVBQVMsQ0FBVCxDQUFiLENBQUE7ZUFFQSxNQUFBLENBQU8sS0FBUCxDQUFhLENBQUMsU0FBZCxDQUF3QixDQUF4QixFQUEwQixDQUExQixFQUE0QixDQUE1QixFQUE4QixHQUE5QixFQUg0RDtNQUFBLENBQTlELEVBVGlCO0lBQUEsQ0FBbkIsQ0F6RUEsQ0FBQTtBQUFBLElBdUZBLFFBQUEsQ0FBUyxPQUFULEVBQWtCLFNBQUEsR0FBQTtBQUNoQixNQUFBLEVBQUEsQ0FBRyxnRUFBSCxFQUFxRSxTQUFBLEdBQUE7ZUFDbkUsTUFBQSxDQUFPLEtBQUssQ0FBQyxHQUFiLENBQWlCLENBQUMseUJBQWxCLENBQTRDLENBQUMsRUFBRCxFQUFLLEVBQUwsRUFBUyxHQUFULENBQTVDLEVBRG1FO01BQUEsQ0FBckUsQ0FBQSxDQUFBO2FBR0EsRUFBQSxDQUFHLHlEQUFILEVBQThELFNBQUEsR0FBQTtBQUM1RCxRQUFBLEtBQUssQ0FBQyxHQUFOLEdBQVksQ0FBQyxHQUFELEVBQUssRUFBTCxFQUFRLEVBQVIsQ0FBWixDQUFBO2VBRUEsTUFBQSxDQUFPLEtBQVAsQ0FBYSxDQUFDLFNBQWQsQ0FBd0IsRUFBeEIsRUFBNEIsR0FBNUIsRUFBaUMsR0FBakMsRUFBc0MsR0FBdEMsRUFINEQ7TUFBQSxDQUE5RCxFQUpnQjtJQUFBLENBQWxCLENBdkZBLENBQUE7QUFBQSxJQWdHQSxRQUFBLENBQVMsUUFBVCxFQUFtQixTQUFBLEdBQUE7QUFDakIsTUFBQSxFQUFBLENBQUcsdUVBQUgsRUFBNEUsU0FBQSxHQUFBO2VBQzFFLE1BQUEsQ0FBTyxLQUFLLENBQUMsSUFBYixDQUFrQixDQUFDLHlCQUFuQixDQUE2QyxDQUFDLEVBQUQsRUFBSyxFQUFMLEVBQVMsR0FBVCxFQUFjLEdBQWQsQ0FBN0MsRUFEMEU7TUFBQSxDQUE1RSxDQUFBLENBQUE7YUFHQSxFQUFBLENBQUcseURBQUgsRUFBOEQsU0FBQSxHQUFBO0FBQzVELFFBQUEsS0FBSyxDQUFDLElBQU4sR0FBYSxDQUFDLEdBQUQsRUFBSyxFQUFMLEVBQVEsRUFBUixFQUFXLEdBQVgsQ0FBYixDQUFBO2VBRUEsTUFBQSxDQUFPLEtBQVAsQ0FBYSxDQUFDLFNBQWQsQ0FBd0IsRUFBeEIsRUFBNEIsR0FBNUIsRUFBaUMsR0FBakMsRUFBc0MsR0FBdEMsRUFINEQ7TUFBQSxDQUE5RCxFQUppQjtJQUFBLENBQW5CLENBaEdBLENBQUE7QUFBQSxJQXlHQSxRQUFBLENBQVMsT0FBVCxFQUFrQixTQUFBLEdBQUE7QUFDaEIsTUFBQSxFQUFBLENBQUcscUVBQUgsRUFBMEUsU0FBQSxHQUFBO2VBQ3hFLE1BQUEsQ0FBTyxLQUFLLENBQUMsR0FBYixDQUFpQixDQUFDLHlCQUFsQixDQUE0QyxDQUFDLEVBQUQsRUFBSyxHQUFMLEVBQVUsRUFBVixDQUE1QyxFQUR3RTtNQUFBLENBQTFFLENBQUEsQ0FBQTthQUdBLEVBQUEsQ0FBRyx5REFBSCxFQUE4RCxTQUFBLEdBQUE7QUFDNUQsUUFBQSxLQUFLLENBQUMsR0FBTixHQUFZLENBQUMsR0FBRCxFQUFLLEVBQUwsRUFBUSxFQUFSLENBQVosQ0FBQTtlQUVBLE1BQUEsQ0FBTyxLQUFQLENBQWEsQ0FBQyxTQUFkLENBQXdCLEVBQXhCLEVBQTRCLEdBQTVCLEVBQWlDLEdBQWpDLEVBQXNDLEdBQXRDLEVBSDREO01BQUEsQ0FBOUQsRUFKZ0I7SUFBQSxDQUFsQixDQXpHQSxDQUFBO0FBQUEsSUFrSEEsUUFBQSxDQUFTLFFBQVQsRUFBbUIsU0FBQSxHQUFBO0FBQ2pCLE1BQUEsRUFBQSxDQUFHLDRFQUFILEVBQWlGLFNBQUEsR0FBQTtlQUMvRSxNQUFBLENBQU8sS0FBSyxDQUFDLElBQWIsQ0FBa0IsQ0FBQyx5QkFBbkIsQ0FBNkMsQ0FBQyxFQUFELEVBQUssR0FBTCxFQUFVLEVBQVYsRUFBYyxHQUFkLENBQTdDLEVBRCtFO01BQUEsQ0FBakYsQ0FBQSxDQUFBO2FBR0EsRUFBQSxDQUFHLHlEQUFILEVBQThELFNBQUEsR0FBQTtBQUM1RCxRQUFBLEtBQUssQ0FBQyxJQUFOLEdBQWEsQ0FBQyxHQUFELEVBQUssRUFBTCxFQUFRLEVBQVIsRUFBWSxHQUFaLENBQWIsQ0FBQTtlQUVBLE1BQUEsQ0FBTyxLQUFQLENBQWEsQ0FBQyxTQUFkLENBQXdCLEVBQXhCLEVBQTRCLEdBQTVCLEVBQWlDLEdBQWpDLEVBQXNDLEdBQXRDLEVBSDREO01BQUEsQ0FBOUQsRUFKaUI7SUFBQSxDQUFuQixDQWxIQSxDQUFBO0FBQUEsSUEySEEsUUFBQSxDQUFTLE9BQVQsRUFBa0IsU0FBQSxHQUFBO0FBQ2hCLE1BQUEsRUFBQSxDQUFHLG1FQUFILEVBQXdFLFNBQUEsR0FBQTtlQUN0RSxNQUFBLENBQU8sS0FBSyxDQUFDLEdBQWIsQ0FBaUIsQ0FBQyx5QkFBbEIsQ0FBNEMsQ0FBQyxFQUFELEVBQUssRUFBTCxFQUFTLENBQVQsQ0FBNUMsRUFEc0U7TUFBQSxDQUF4RSxDQUFBLENBQUE7YUFHQSxFQUFBLENBQUcseURBQUgsRUFBOEQsU0FBQSxHQUFBO0FBQzVELFFBQUEsS0FBSyxDQUFDLEdBQU4sR0FBWSxDQUFDLEdBQUQsRUFBSyxFQUFMLEVBQVEsRUFBUixDQUFaLENBQUE7ZUFFQSxNQUFBLENBQU8sS0FBUCxDQUFhLENBQUMsU0FBZCxDQUF3QixHQUF4QixFQUE2QixHQUE3QixFQUFrQyxHQUFsQyxFQUF1QyxHQUF2QyxFQUg0RDtNQUFBLENBQTlELEVBSmdCO0lBQUEsQ0FBbEIsQ0EzSEEsQ0FBQTtBQUFBLElBb0lBLFFBQUEsQ0FBUyxRQUFULEVBQW1CLFNBQUEsR0FBQTtBQUNqQixNQUFBLEVBQUEsQ0FBRywwRUFBSCxFQUErRSxTQUFBLEdBQUE7ZUFDN0UsTUFBQSxDQUFPLEtBQUssQ0FBQyxJQUFiLENBQWtCLENBQUMseUJBQW5CLENBQTZDLENBQUMsRUFBRCxFQUFLLEVBQUwsRUFBUyxDQUFULEVBQVksR0FBWixDQUE3QyxFQUQ2RTtNQUFBLENBQS9FLENBQUEsQ0FBQTthQUdBLEVBQUEsQ0FBRyx5REFBSCxFQUE4RCxTQUFBLEdBQUE7QUFDNUQsUUFBQSxLQUFLLENBQUMsSUFBTixHQUFhLENBQUMsR0FBRCxFQUFLLEVBQUwsRUFBUSxFQUFSLEVBQVcsR0FBWCxDQUFiLENBQUE7ZUFFQSxNQUFBLENBQU8sS0FBUCxDQUFhLENBQUMsU0FBZCxDQUF3QixHQUF4QixFQUE2QixHQUE3QixFQUFrQyxHQUFsQyxFQUF1QyxHQUF2QyxFQUg0RDtNQUFBLENBQTlELEVBSmlCO0lBQUEsQ0FBbkIsQ0FwSUEsQ0FBQTtBQUFBLElBNklBLFFBQUEsQ0FBUyxPQUFULEVBQWtCLFNBQUEsR0FBQTtBQUNoQixNQUFBLEVBQUEsQ0FBRywyQ0FBSCxFQUFnRCxTQUFBLEdBQUE7ZUFDOUMsTUFBQSxDQUFPLEtBQUssQ0FBQyxHQUFiLENBQWlCLENBQUMsT0FBbEIsQ0FBMEIsUUFBMUIsRUFEOEM7TUFBQSxDQUFoRCxDQUFBLENBQUE7YUFHQSxFQUFBLENBQUcsNkRBQUgsRUFBa0UsU0FBQSxHQUFBO0FBQ2hFLFFBQUEsS0FBSyxDQUFDLEdBQU4sR0FBWSxRQUFaLENBQUE7ZUFFQSxNQUFBLENBQU8sS0FBUCxDQUFhLENBQUMsU0FBZCxDQUF3QixDQUF4QixFQUEwQixHQUExQixFQUE4QixDQUE5QixFQUFnQyxHQUFoQyxFQUhnRTtNQUFBLENBQWxFLEVBSmdCO0lBQUEsQ0FBbEIsQ0E3SUEsQ0FBQTtBQUFBLElBc0pBLFFBQUEsQ0FBUyxXQUFULEVBQXNCLFNBQUEsR0FBQTtBQUNwQixNQUFBLEVBQUEsQ0FBRyxxREFBSCxFQUEwRCxTQUFBLEdBQUE7ZUFDeEQsTUFBQSxDQUFPLEtBQUssQ0FBQyxPQUFiLENBQXFCLENBQUMsT0FBdEIsQ0FBOEIsVUFBOUIsRUFEd0Q7TUFBQSxDQUExRCxDQUFBLENBQUE7YUFHQSxFQUFBLENBQUcsNkRBQUgsRUFBa0UsU0FBQSxHQUFBO0FBQ2hFLFFBQUEsS0FBSyxDQUFDLE9BQU4sR0FBZ0IsVUFBaEIsQ0FBQTtlQUVBLE1BQUEsQ0FBTyxLQUFQLENBQWEsQ0FBQyxTQUFkLENBQXdCLENBQXhCLEVBQTBCLEdBQTFCLEVBQThCLENBQTlCLEVBQWdDLENBQWhDLEVBSGdFO01BQUEsQ0FBbEUsRUFKb0I7SUFBQSxDQUF0QixDQXRKQSxDQUFBO0FBQUEsSUErSkEsUUFBQSxDQUFTLE9BQVQsRUFBa0IsU0FBQSxHQUFBO0FBQ2hCLE1BQUEsRUFBQSxDQUFHLDJCQUFILEVBQWdDLFNBQUEsR0FBQTtlQUM5QixNQUFBLENBQU8sS0FBSyxDQUFDLEdBQWIsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQixLQUFLLENBQUMsR0FBSSxDQUFBLENBQUEsQ0FBcEMsRUFEOEI7TUFBQSxDQUFoQyxDQUFBLENBQUE7YUFHQSxFQUFBLENBQUcsd0JBQUgsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLFFBQUEsS0FBSyxDQUFDLEdBQU4sR0FBWSxFQUFaLENBQUE7ZUFFQSxNQUFBLENBQU8sS0FBSyxDQUFDLEdBQWIsQ0FBaUIsQ0FBQyx5QkFBbEIsQ0FBNEMsQ0FBQyxFQUFELEVBQUssR0FBTCxFQUFVLEVBQVYsQ0FBNUMsRUFIMkI7TUFBQSxDQUE3QixFQUpnQjtJQUFBLENBQWxCLENBL0pBLENBQUE7QUFBQSxJQXdLQSxRQUFBLENBQVMsY0FBVCxFQUF5QixTQUFBLEdBQUE7QUFDdkIsTUFBQSxFQUFBLENBQUcsa0NBQUgsRUFBdUMsU0FBQSxHQUFBO2VBQ3JDLE1BQUEsQ0FBTyxLQUFLLENBQUMsVUFBYixDQUF3QixDQUFDLE9BQXpCLENBQWlDLEtBQUssQ0FBQyxHQUFJLENBQUEsQ0FBQSxDQUEzQyxFQURxQztNQUFBLENBQXZDLENBQUEsQ0FBQTthQUdBLEVBQUEsQ0FBRywrQkFBSCxFQUFvQyxTQUFBLEdBQUE7QUFDbEMsUUFBQSxLQUFLLENBQUMsVUFBTixHQUFtQixFQUFuQixDQUFBO2VBRUEsTUFBQSxDQUFPLEtBQUssQ0FBQyxHQUFiLENBQWlCLENBQUMseUJBQWxCLENBQTRDLENBQUMsRUFBRCxFQUFLLEVBQUwsRUFBUyxFQUFULENBQTVDLEVBSGtDO01BQUEsQ0FBcEMsRUFKdUI7SUFBQSxDQUF6QixDQXhLQSxDQUFBO0FBQUEsSUFpTEEsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLE1BQUEsRUFBQSxDQUFHLGlDQUFILEVBQXNDLFNBQUEsR0FBQTtlQUNwQyxNQUFBLENBQU8sS0FBSyxDQUFDLFNBQWIsQ0FBdUIsQ0FBQyxPQUF4QixDQUFnQyxLQUFLLENBQUMsR0FBSSxDQUFBLENBQUEsQ0FBMUMsRUFEb0M7TUFBQSxDQUF0QyxDQUFBLENBQUE7YUFHQSxFQUFBLENBQUcsOEJBQUgsRUFBbUMsU0FBQSxHQUFBO0FBQ2pDLFFBQUEsS0FBSyxDQUFDLFNBQU4sR0FBa0IsRUFBbEIsQ0FBQTtlQUVBLE1BQUEsQ0FBTyxLQUFLLENBQUMsR0FBYixDQUFpQixDQUFDLHlCQUFsQixDQUE0QyxDQUFDLEVBQUQsRUFBSyxHQUFMLEVBQVUsRUFBVixDQUE1QyxFQUhpQztNQUFBLENBQW5DLEVBSnNCO0lBQUEsQ0FBeEIsQ0FqTEEsQ0FBQTtBQUFBLElBMExBLFFBQUEsQ0FBUyxRQUFULEVBQW1CLFNBQUEsR0FBQTtBQUNqQixNQUFBLEVBQUEsQ0FBRyxxREFBSCxFQUEwRCxTQUFBLEdBQUE7QUFDeEQsUUFBQSxLQUFBLEdBQVksSUFBQSxLQUFBLENBQU0sU0FBTixDQUFaLENBQUE7ZUFFQSxNQUFBLENBQU8sS0FBSyxDQUFDLElBQWIsQ0FBa0IsQ0FBQyx5QkFBbkIsQ0FBNkMsQ0FBQyxDQUFELEVBQUcsR0FBSCxFQUFPLENBQVAsRUFBUyxDQUFULENBQTdDLEVBSHdEO01BQUEsQ0FBMUQsQ0FBQSxDQUFBO2FBS0EsRUFBQSxDQUFHLDZDQUFILEVBQWtELFNBQUEsR0FBQTtBQUNoRCxRQUFBLEtBQUssQ0FBQyxLQUFOLEdBQWMsQ0FBZCxDQUFBO0FBQUEsUUFDQSxLQUFLLENBQUMsSUFBTixHQUFhLENBQUMsQ0FBRCxFQUFJLEdBQUosRUFBUyxDQUFULEVBQVksQ0FBWixDQURiLENBQUE7ZUFHQSxNQUFBLENBQU8sS0FBUCxDQUFhLENBQUMsU0FBZCxDQUF3QixTQUF4QixFQUpnRDtNQUFBLENBQWxELEVBTmlCO0lBQUEsQ0FBbkIsQ0ExTEEsQ0FBQTtBQUFBLElBc01BLFFBQUEsQ0FBUyxTQUFULEVBQW9CLFNBQUEsR0FBQTthQUNsQixFQUFBLENBQUcscUNBQUgsRUFBMEMsU0FBQSxHQUFBO0FBQ3hDLFFBQUEsTUFBQSxDQUFPLEtBQUssQ0FBQyxLQUFOLENBQUEsQ0FBUCxDQUFxQixDQUFDLFNBQXRCLENBQWdDLEtBQWhDLENBQUEsQ0FBQTtlQUNBLE1BQUEsQ0FBTyxLQUFLLENBQUMsS0FBTixDQUFBLENBQVAsQ0FBcUIsQ0FBQyxHQUFHLENBQUMsSUFBMUIsQ0FBK0IsS0FBL0IsRUFGd0M7TUFBQSxDQUExQyxFQURrQjtJQUFBLENBQXBCLENBdE1BLENBQUE7QUFBQSxJQTJNQSxRQUFBLENBQVMsU0FBVCxFQUFvQixTQUFBLEdBQUE7QUFDbEIsTUFBQSxRQUFBLENBQVMsdUNBQVQsRUFBa0QsU0FBQSxHQUFBO2VBQ2hELEVBQUEsQ0FBRyxxQ0FBSCxFQUEwQyxTQUFBLEdBQUE7aUJBQ3hDLE1BQUEsQ0FBTyxLQUFLLENBQUMsS0FBTixDQUFBLENBQVAsQ0FBcUIsQ0FBQyxPQUF0QixDQUE4QixzQkFBOUIsRUFEd0M7UUFBQSxDQUExQyxFQURnRDtNQUFBLENBQWxELENBQUEsQ0FBQTtBQUFBLE1BSUEsUUFBQSxDQUFTLG1DQUFULEVBQThDLFNBQUEsR0FBQTtlQUM1QyxFQUFBLENBQUcsb0NBQUgsRUFBeUMsU0FBQSxHQUFBO0FBQ3ZDLFVBQUEsS0FBSyxDQUFDLEtBQU4sR0FBYyxDQUFkLENBQUE7aUJBQ0EsTUFBQSxDQUFPLEtBQUssQ0FBQyxLQUFOLENBQUEsQ0FBUCxDQUFxQixDQUFDLE9BQXRCLENBQThCLGlCQUE5QixFQUZ1QztRQUFBLENBQXpDLEVBRDRDO01BQUEsQ0FBOUMsQ0FKQSxDQUFBO2FBU0EsUUFBQSxDQUFTLGdDQUFULEVBQTJDLFNBQUEsR0FBQTtlQUN6QyxFQUFBLENBQUcsNkJBQUgsRUFBa0MsU0FBQSxHQUFBO0FBQ2hDLFVBQUEsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFNLFFBQU4sQ0FBWixDQUFBO2lCQUNBLE1BQUEsQ0FBTyxLQUFLLENBQUMsS0FBTixDQUFBLENBQVAsQ0FBcUIsQ0FBQyxPQUF0QixDQUE4QixnQkFBOUIsRUFGZ0M7UUFBQSxDQUFsQyxFQUR5QztNQUFBLENBQTNDLEVBVmtCO0lBQUEsQ0FBcEIsQ0EzTUEsQ0FBQTtBQUFBLElBME5BLFFBQUEsQ0FBUyxlQUFULEVBQTBCLFNBQUEsR0FBQTthQUN4QixFQUFBLENBQUcsa0VBQUgsRUFBdUUsU0FBQSxHQUFBO0FBQ3JFLFlBQUEsc0JBQUE7QUFBQSxRQUFBLE1BQUEsR0FBYSxJQUFBLEtBQUEsQ0FBTSxTQUFOLENBQWIsQ0FBQTtBQUFBLFFBQ0EsTUFBQSxHQUFhLElBQUEsS0FBQSxDQUFNLFNBQU4sQ0FEYixDQUFBO0FBQUEsUUFFQSxNQUFBLEdBQVMsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsTUFBbkIsRUFBMkIsR0FBM0IsQ0FGVCxDQUFBO2VBSUEsTUFBQSxDQUFPLE1BQVAsQ0FBYyxDQUFDLFNBQWYsQ0FBeUIsU0FBekIsRUFMcUU7TUFBQSxDQUF2RSxFQUR3QjtJQUFBLENBQTFCLENBMU5BLENBQUE7QUFBQSxJQWtPQSxRQUFBLENBQVMsU0FBVCxFQUFvQixTQUFBLEdBQUE7YUFDbEIsRUFBQSxDQUFHLGtFQUFILEVBQXVFLFNBQUEsR0FBQTtBQUNyRSxZQUFBLHNCQUFBO0FBQUEsUUFBQSxNQUFBLEdBQWEsSUFBQSxLQUFBLENBQU0sU0FBTixDQUFiLENBQUE7QUFBQSxRQUNBLE1BQUEsR0FBYSxJQUFBLEtBQUEsQ0FBTSxTQUFOLENBRGIsQ0FBQTtBQUFBLFFBRUEsTUFBQSxHQUFTLE1BQU0sQ0FBQyxLQUFQLENBQWEsTUFBYixFQUFxQixTQUFDLENBQUQsRUFBRyxDQUFILEdBQUE7aUJBQVMsQ0FBQSxHQUFJLENBQUosR0FBUSxDQUFBLEdBQUksRUFBckI7UUFBQSxDQUFyQixDQUZULENBQUE7ZUFJQSxNQUFBLENBQU8sTUFBUCxDQUFjLENBQUMsU0FBZixDQUF5QixTQUF6QixFQUxxRTtNQUFBLENBQXZFLEVBRGtCO0lBQUEsQ0FBcEIsQ0FsT0EsQ0FBQTtBQUFBLElBME9BLFFBQUEsQ0FBUyxrQkFBVCxFQUE2QixTQUFBLEdBQUE7YUFDM0IsRUFBQSxDQUFHLHdEQUFILEVBQTZELFNBQUEsR0FBQTtBQUMzRCxRQUFBLE1BQUEsQ0FBTyxLQUFLLENBQUMsY0FBTixDQUFxQixDQUFyQixDQUFQLENBQStCLENBQUMsU0FBaEMsQ0FBMEMsR0FBMUMsRUFBOEMsR0FBOUMsRUFBa0QsRUFBbEQsRUFBcUQsQ0FBckQsQ0FBQSxDQUFBO0FBQUEsUUFDQSxNQUFBLENBQU8sS0FBSyxDQUFDLGNBQU4sQ0FBcUIsR0FBckIsQ0FBUCxDQUFpQyxDQUFDLFNBQWxDLENBQTRDLEdBQTVDLEVBQWdELEdBQWhELEVBQW9ELEVBQXBELEVBQXVELEdBQXZELENBREEsQ0FBQTtlQUVBLE1BQUEsQ0FBTyxLQUFLLENBQUMsY0FBTixDQUFxQixHQUFyQixDQUFQLENBQWlDLENBQUMsU0FBbEMsQ0FBNEMsR0FBNUMsRUFBZ0QsR0FBaEQsRUFBb0QsRUFBcEQsRUFBdUQsR0FBdkQsRUFIMkQ7TUFBQSxDQUE3RCxFQUQyQjtJQUFBLENBQTdCLENBMU9BLENBQUE7V0FnUEEsUUFBQSxDQUFTLFFBQVQsRUFBbUIsU0FBQSxHQUFBO2FBQ2pCLEVBQUEsQ0FBRyxxQ0FBSCxFQUEwQyxTQUFBLEdBQUE7ZUFDeEMsTUFBQSxDQUFPLEtBQUssQ0FBQyxJQUFiLENBQWtCLENBQUMsV0FBbkIsQ0FBK0IsSUFBL0IsRUFBcUMsQ0FBckMsRUFEd0M7TUFBQSxDQUExQyxFQURpQjtJQUFBLENBQW5CLEVBalBnQjtFQUFBLENBQWxCLENBSkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/vitaminafront/.atom/packages/pigments/spec/color-spec.coffee
