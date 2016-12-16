(function() {
  var manuallyIndented;

  manuallyIndented = new WeakSet();

  module.exports = {
    getIndentation: function(editor) {
      var indentationName, softTabs, tabLength;
      softTabs = editor.getSoftTabs();
      tabLength = editor.getTabLength();
      if (softTabs) {
        indentationName = tabLength + ' Spaces';
      } else {
        indentationName = 'Tabs (' + tabLength + ' wide)';
      }
      return indentationName;
    },
    getIndentations: function() {
      return atom.config.get("auto-detect-indentation.indentationTypes");
    },
    autoDetectIndentation: function(editor) {
      var firstSpaces, found, i, length, lineCount, numLinesWithSpaces, numLinesWithTabs, shortest, softTabs, spaceChars, tabLength, _i, _ref;
      lineCount = editor.getLineCount();
      shortest = 0;
      numLinesWithTabs = 0;
      numLinesWithSpaces = 0;
      found = false;
      for (i = _i = 0, _ref = lineCount - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (!(i < 100 || !found)) {
          continue;
        }
        if (editor.isBufferRowCommented(i)) {
          continue;
        }
        firstSpaces = editor.lineTextForBufferRow(i).match(/^([ \t]+)[^ \t]/m);
        if (firstSpaces) {
          spaceChars = firstSpaces[1];
          if (spaceChars[0] === '\t') {
            numLinesWithTabs++;
          } else {
            length = spaceChars.length;
            if (length === 1) {
              continue;
            }
            numLinesWithSpaces++;
            if (length < shortest || shortest === 0) {
              shortest = length;
            }
          }
          found = true;
        }
      }
      softTabs = null;
      tabLength = null;
      if (found) {
        if (numLinesWithTabs > numLinesWithSpaces) {
          softTabs = false;
        } else {
          softTabs = true;
          tabLength = shortest;
        }
      }
      return {
        softTabs: softTabs,
        tabLength: tabLength
      };
    },
    setIndentation: function(editor, indentation, automatic) {
      if (automatic == null) {
        automatic = false;
      }
      if (!automatic) {
        manuallyIndented.add(editor);
      }
      if ("softTabs" in indentation && indentation.softTabs !== null) {
        editor.setSoftTabs(indentation.softTabs);
      } else {
        editor.setSoftTabs(atom.config.get("editor.softTabs", {
          scope: editor.getRootScopeDescriptor().scopes
        }));
      }
      if ("tabLength" in indentation) {
        return editor.setTabLength(indentation.tabLength);
      } else {
        return editor.setTabLength(atom.config.get("editor.tabLength", {
          scope: editor.getRootScopeDescriptor().scopes
        }));
      }
    },
    isManuallyIndented: function(editor) {
      return manuallyIndented.has(editor);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpdGFtaW5hZnJvbnQvLmF0b20vcGFja2FnZXMvYXV0by1kZXRlY3QtaW5kZW50YXRpb24vbGliL2luZGVudGF0aW9uLW1hbmFnZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdCQUFBOztBQUFBLEVBQUEsZ0JBQUEsR0FBdUIsSUFBQSxPQUFBLENBQUEsQ0FBdkIsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLGNBQUEsRUFBZ0IsU0FBQyxNQUFELEdBQUE7QUFDZCxVQUFBLG9DQUFBO0FBQUEsTUFBQSxRQUFBLEdBQVcsTUFBTSxDQUFDLFdBQVAsQ0FBQSxDQUFYLENBQUE7QUFBQSxNQUNBLFNBQUEsR0FBWSxNQUFNLENBQUMsWUFBUCxDQUFBLENBRFosQ0FBQTtBQUVBLE1BQUEsSUFBRyxRQUFIO0FBQ0UsUUFBQSxlQUFBLEdBQWtCLFNBQUEsR0FBWSxTQUE5QixDQURGO09BQUEsTUFBQTtBQUdFLFFBQUEsZUFBQSxHQUFrQixRQUFBLEdBQVcsU0FBWCxHQUF1QixRQUF6QyxDQUhGO09BRkE7YUFNQSxnQkFQYztJQUFBLENBQWhCO0FBQUEsSUFTQSxlQUFBLEVBQWlCLFNBQUEsR0FBQTthQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwwQ0FBaEIsRUFEZTtJQUFBLENBVGpCO0FBQUEsSUFZQSxxQkFBQSxFQUF1QixTQUFDLE1BQUQsR0FBQTtBQUNyQixVQUFBLG1JQUFBO0FBQUEsTUFBQSxTQUFBLEdBQVksTUFBTSxDQUFDLFlBQVAsQ0FBQSxDQUFaLENBQUE7QUFBQSxNQUNBLFFBQUEsR0FBVyxDQURYLENBQUE7QUFBQSxNQUVBLGdCQUFBLEdBQW1CLENBRm5CLENBQUE7QUFBQSxNQUdBLGtCQUFBLEdBQXFCLENBSHJCLENBQUE7QUFBQSxN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

//# sourceURL=/Users/vitaminafront/.atom/packages/auto-detect-indentation/lib/indentation-manager.coffee
