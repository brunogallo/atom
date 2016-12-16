(function() {
  var IndentationListView, IndentationManager, SelectListView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  SelectListView = require('atom-space-pen-views').SelectListView;

  IndentationManager = require('./indentation-manager');

  module.exports = IndentationListView = (function(_super) {
    __extends(IndentationListView, _super);

    function IndentationListView() {
      return IndentationListView.__super__.constructor.apply(this, arguments);
    }

    IndentationListView.prototype.initialize = function() {
      IndentationListView.__super__.initialize.apply(this, arguments);
      this.addClass('auto-detect-indentation-selector');
      return this.list.addClass('mark-active');
    };

    IndentationListView.prototype.getFilterKey = function() {
      return 'name';
    };

    IndentationListView.prototype.destroy = function() {
      return this.cancel();
    };

    IndentationListView.prototype.viewForItem = function(indentation) {
      var element;
      element = document.createElement('li');
      if (indentation.name === this.currentIndentation) {
        element.classList.add('active');
      }
      element.textContent = indentation.name;
      return element;
    };

    IndentationListView.prototype.cancelled = function() {
      var _ref;
      if ((_ref = this.panel) != null) {
        _ref.destroy();
      }
      this.panel = null;
      return this.currentIndentation = null;
    };

    IndentationListView.prototype.confirmed = function(indentation) {
      var editor;
      editor = atom.workspace.getActiveTextEditor();
      IndentationManager.setIndentation(editor, indentation);
      return this.cancel();
    };

    IndentationListView.prototype.attach = function() {
      this.storeFocusedElement();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      return this.focusFilterEditor();
    };

    IndentationListView.prototype.toggle = function() {
      var editor;
      if (this.panel != null) {
        return this.cancel();
      } else {
        editor = atom.workspace.getActiveTextEditor();
        if (editor) {
          this.currentIndentation = IndentationManager.getIndentation(editor);
          this.setItems(IndentationManager.getIndentations());
          return this.attach();
        }
      }
    };

    return IndentationListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpdGFtaW5hZnJvbnQvLmF0b20vcGFja2FnZXMvYXV0by1kZXRlY3QtaW5kZW50YXRpb24vbGliL2luZGVudGF0aW9uLWxpc3Qtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdURBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLGlCQUFrQixPQUFBLENBQVEsc0JBQVIsRUFBbEIsY0FBRCxDQUFBOztBQUFBLEVBQ0Esa0JBQUEsR0FBcUIsT0FBQSxDQUFRLHVCQUFSLENBRHJCLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osMENBQUEsQ0FBQTs7OztLQUFBOztBQUFBLGtDQUFBLFVBQUEsR0FBWSxTQUFBLEdBQUE7QUFDVixNQUFBLHFEQUFBLFNBQUEsQ0FBQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsUUFBRCxDQUFVLGtDQUFWLENBRkEsQ0FBQTthQUdBLElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBTixDQUFlLGFBQWYsRUFKVTtJQUFBLENBQVosQ0FBQTs7QUFBQSxrQ0FNQSxZQUFBLEdBQWMsU0FBQSxHQUFBO2FBQ1osT0FEWTtJQUFBLENBTmQsQ0FBQTs7QUFBQSxrQ0FTQSxPQUFBLEdBQVMsU0FBQSxHQUFBO2FBQ1AsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQURPO0lBQUEsQ0FUVCxDQUFBOztBQUFBLGtDQVlBLFdBQUEsR0FBYSxTQUFDLFdBQUQsR0FBQTtBQUNYLFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLFFBQVEsQ0FBQyxhQUFULENBQXVCLElBQXZCLENBQVYsQ0FBQTtBQUNBLE1BQUEsSUFBbUMsV0FBVyxDQUFDLElBQVosS0FBb0IsSUFBQyxDQUFBLGtCQUF4RDtBQUFBLFFBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFsQixDQUFzQixRQUF0QixDQUFBLENBQUE7T0FEQTtBQUFBLE1BRUEsT0FBTyxDQUFDLFdBQVIsR0FBc0IsV0FBVyxDQUFDLElBRmxDLENBQUE7YUFHQSxRQUpXO0lBQUEsQ0FaYixDQUFBOztBQUFBLGtDQWtCQSxTQUFBLEdBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxJQUFBOztZQUFNLENBQUUsT0FBUixDQUFBO09BQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFEVCxDQUFBO2FBRUEsSUFBQyxDQUFBLGtCQUFELEdBQXNCLEtBSGI7SUFBQSxDQWxCWCxDQUFBOztBQUFBLGtDQXVCQSxTQUFBLEdBQVcsU0FBQyxXQUFELEdBQUE7QUFDVCxVQUFBLE1BQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBVCxDQUFBO0FBQUEsTUFDQSxrQkFBa0IsQ0FBQyxjQUFuQixDQUFrQyxNQUFsQyxFQUEwQyxXQUExQyxDQURBLENBQUE7YUFFQSxJQUFDLENBQUEsTUFBRCxDQUFBLEVBSFM7SUFBQSxDQXZCWCxDQUFBOztBQUFBLGtDQTRCQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ04sTUFBQSxJQUFDLENBQUEsbUJBQUQsQ0FBQSxDQUFBLENBQUE7O1FBQ0EsSUFBQyxDQUFBLFFBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO0FBQUEsVUFBQSxJQUFBLEVBQU0sSUFBTjtTQUE3QjtPQURWO2FBRUEsSUFBQyxDQUFBLGlCQUFELENBQUEsRUFITTtJQUFBLENBNUJSLENBQUE7O0FBQUEsa0NBaUNBLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixVQUFBLE1BQUE7QUFBQSxNQUFBLElBQUcsa0JBQUg7ZUFDRSxJQUFDLENBQUEsTUFBRCxDQUFBLEVBREY7T0FBQSxNQUFBO0FBR0UsUUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtBQUNBLFFBQUEsSUFBRyxNQUFIO0FBQ0UsVUFBQSxJQUFDLENBQUEsa0JBQUQsR0FBc0Isa0JBQWtCLENBQUMsY0FBbkIsQ0FBa0MsTUFBbEMsQ0FBdEIsQ0FBQTtBQUFBLFVBQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSxrQkFBa0IsQ0FBQyxlQUFuQixDQUFBLENBQVYsQ0FEQSxDQUFBO2lCQUVBLElBQUMsQ0FBQSxNQUFELENBQUEsRUFIRjtTQUpGO09BRE07SUFBQSxDQWpDUixDQUFBOzsrQkFBQTs7S0FEZ0MsZUFMbEMsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/vitaminafront/.atom/packages/auto-detect-indentation/lib/indentation-list-view.coffee
