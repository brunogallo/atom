
/* global
atom
 */

(function() {
  var CompositeDisposable, Qolor, QolorView;

  CompositeDisposable = require('atom').CompositeDisposable;

  QolorView = require('./qolor-view');

  Qolor = (function() {
    function Qolor() {}

    Qolor.prototype.config = {
      fourBorders: {
        type: 'boolean',
        "default": false
      }
    };

    Qolor.prototype.view = null;

    Qolor.prototype.activate = function() {
      this.view = new QolorView;
      this.view.initialize();
      this.commands = new CompositeDisposable;
      return this.commands.add(atom.commands.add('atom-workspace', {
        'qolor:toggle': (function(_this) {
          return function() {
            return _this.view.toggle();
          };
        })(this)
      }));
    };

    Qolor.prototype.deactivate = function() {
      var _ref, _ref1;
      if ((_ref = this.commands) != null) {
        _ref.dispose();
      }
      if ((_ref1 = this.view) != null) {
        _ref1.destroy();
      }
      return this.view = null;
    };

    return Qolor;

  })();

  module.exports = new Qolor;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpdGFtaW5hZnJvbnQvLmF0b20vcGFja2FnZXMvcW9sb3IvbGliL3FvbG9yLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUE7O0dBQUE7QUFBQTtBQUFBO0FBQUEsTUFBQSxxQ0FBQTs7QUFBQSxFQUdDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFIRCxDQUFBOztBQUFBLEVBSUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSLENBSlosQ0FBQTs7QUFBQSxFQU1NO3VCQUNGOztBQUFBLG9CQUFBLE1BQUEsR0FDSTtBQUFBLE1BQUEsV0FBQSxFQUNJO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7T0FESjtLQURKLENBQUE7O0FBQUEsb0JBTUEsSUFBQSxHQUFNLElBTk4sQ0FBQTs7QUFBQSxvQkFTQSxRQUFBLEdBQVUsU0FBQSxHQUFBO0FBQ04sTUFBQSxJQUFDLENBQUEsSUFBRCxHQUFRLEdBQUEsQ0FBQSxTQUFSLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsVUFBTixDQUFBLENBREEsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFFBQUQsR0FBWSxHQUFBLENBQUEsbUJBSFosQ0FBQTthQUtBLElBQUMsQ0FBQSxRQUFRLENBQUMsR0FBVixDQUFjLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFDVjtBQUFBLFFBQUEsY0FBQSxFQUFnQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsSUFBSSxDQUFDLE1BQU4sQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEI7T0FEVSxDQUFkLEVBTk07SUFBQSxDQVRWLENBQUE7O0FBQUEsb0JBbUJBLFVBQUEsR0FBWSxTQUFBLEdBQUE7QUFDUixVQUFBLFdBQUE7O1lBQVMsQ0FBRSxPQUFYLENBQUE7T0FBQTs7YUFDSyxDQUFFLE9BQVAsQ0FBQTtPQURBO2FBRUEsSUFBQyxDQUFBLElBQUQsR0FBUSxLQUhBO0lBQUEsQ0FuQlosQ0FBQTs7aUJBQUE7O01BUEosQ0FBQTs7QUFBQSxFQStCQSxNQUFNLENBQUMsT0FBUCxHQUFpQixHQUFBLENBQUEsS0EvQmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/vitaminafront/.atom/packages/qolor/lib/qolor.coffee
