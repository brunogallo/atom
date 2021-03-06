(function() {
  "use strict";
  var Beautifier, TypeScriptFormatter,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = TypeScriptFormatter = (function(_super) {
    __extends(TypeScriptFormatter, _super);

    function TypeScriptFormatter() {
      return TypeScriptFormatter.__super__.constructor.apply(this, arguments);
    }

    TypeScriptFormatter.prototype.name = "TypeScript Formatter";

    TypeScriptFormatter.prototype.options = {
      TypeScript: true
    };

    TypeScriptFormatter.prototype.beautify = function(text, language, options) {
      return new this.Promise((function(_this) {
        return function(resolve, reject) {
          var e, format, formatterUtils, opts, result;
          try {
            format = require("typescript-formatter/lib/formatter")["default"];
            formatterUtils = require("typescript-formatter/lib/utils");
            opts = formatterUtils.createDefaultFormatCodeOptions();
            if (options.indent_with_tabs) {
              opts.ConvertTabsToSpaces = false;
            } else {
              opts.TabSize = options.tab_width || options.indent_size;
              opts.IndentSize = options.indent_size;
              opts.IndentStyle = 'space';
            }
            _this.verbose('typescript', text, opts);
            result = format('', text, opts);
            _this.verbose(result);
            return resolve(result);
          } catch (_error) {
            e = _error;
            return reject(e);
          }
        };
      })(this));
    };

    return TypeScriptFormatter;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpdGFtaW5hZnJvbnQvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvdHlwZXNjcmlwdC1mb3JtYXR0ZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLFlBQUEsQ0FBQTtBQUFBLE1BQUEsK0JBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUixDQURiLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUNyQiwwQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsa0NBQUEsSUFBQSxHQUFNLHNCQUFOLENBQUE7O0FBQUEsa0NBQ0EsT0FBQSxHQUFTO0FBQUEsTUFDUCxVQUFBLEVBQVksSUFETDtLQURULENBQUE7O0FBQUEsa0NBS0EsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakIsR0FBQTtBQUNSLGFBQVcsSUFBQSxJQUFDLENBQUEsT0FBRCxDQUFTLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE9BQUQsRUFBVSxNQUFWLEdBQUE7QUFFbEIsY0FBQSx1Q0FBQTtBQUFBO0FBQ0UsWUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLG9DQUFSLENBQTZDLENBQUMsU0FBRCxDQUF0RCxDQUFBO0FBQUEsWUFDQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxnQ0FBUixDQURqQixDQUFBO0FBQUEsWUFJQSxJQUFBLEdBQU8sY0FBYyxDQUFDLDhCQUFmLENBQUEsQ0FKUCxDQUFBO0FBTUEsWUFBQSxJQUFHLE9BQU8sQ0FBQyxnQkFBWDtBQUNFLGNBQUEsSUFBSSxDQUFDLG1CQUFMLEdBQTJCLEtBQTNCLENBREY7YUFBQSxNQUFBO0FBR0UsY0FBQSxJQUFJLENBQUMsT0FBTCxHQUFlLE9BQU8sQ0FBQyxTQUFSLElBQXFCLE9BQU8sQ0FBQyxXQUE1QyxDQUFBO0FBQUEsY0FDQSxJQUFJLENBQUMsVUFBTCxHQUFrQixPQUFPLENBQUMsV0FEMUIsQ0FBQTtBQUFBLGNBRUEsSUFBSSxDQUFDLFdBQUwsR0FBbUIsT0FGbkIsQ0FIRjthQU5BO0FBQUEsWUFhQSxLQUFDLENBQUEsT0FBRCxDQUFTLFlBQVQsRUFBdUIsSUFBdkIsRUFBNkIsSUFBN0IsQ0FiQSxDQUFBO0FBQUEsWUFjQSxNQUFBLEdBQVMsTUFBQSxDQUFPLEVBQVAsRUFBVyxJQUFYLEVBQWlCLElBQWpCLENBZFQsQ0FBQTtBQUFBLFlBZUEsS0FBQyxDQUFBLE9BQUQsQ0FBUyxNQUFULENBZkEsQ0FBQTttQkFnQkEsT0FBQSxDQUFRLE1BQVIsRUFqQkY7V0FBQSxjQUFBO0FBbUJFLFlBREksVUFDSixDQUFBO0FBQUEsbUJBQU8sTUFBQSxDQUFPLENBQVAsQ0FBUCxDQW5CRjtXQUZrQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVQsQ0FBWCxDQURRO0lBQUEsQ0FMVixDQUFBOzsrQkFBQTs7S0FEaUQsV0FIbkQsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/vitaminafront/.atom/packages/atom-beautify/src/beautifiers/typescript-formatter.coffee
