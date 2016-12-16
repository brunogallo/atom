(function() {
  module.exports = {
    query: function(el) {
      return document.querySelector(el);
    },
    queryAll: function(el) {
      return document.querySelectorAll(el);
    },
    addClass: function(el, className) {
      return this.toggleClass('add', el, className);
    },
    removeClass: function(el, className) {
      return this.toggleClass('remove', el, className);
    },
    toggleClass: function(action, el, className) {
      var i, _results;
      if (el !== null) {
        i = 0;
        _results = [];
        while (i < el.length) {
          el[i].classList[action](className);
          _results.push(i++);
        }
        return _results;
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpdGFtaW5hZnJvbnQvLmF0b20vcGFja2FnZXMvc2V0aS1zeW50YXgvbGliL2RvbS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsS0FBQSxFQUFPLFNBQUMsRUFBRCxHQUFBO2FBQ0wsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsRUFBdkIsRUFESztJQUFBLENBQVA7QUFBQSxJQUdBLFFBQUEsRUFBVSxTQUFDLEVBQUQsR0FBQTthQUNSLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixFQUExQixFQURRO0lBQUEsQ0FIVjtBQUFBLElBTUEsUUFBQSxFQUFVLFNBQUMsRUFBRCxFQUFLLFNBQUwsR0FBQTthQUNSLElBQUMsQ0FBQSxXQUFELENBQWEsS0FBYixFQUFvQixFQUFwQixFQUF3QixTQUF4QixFQURRO0lBQUEsQ0FOVjtBQUFBLElBU0EsV0FBQSxFQUFhLFNBQUMsRUFBRCxFQUFLLFNBQUwsR0FBQTthQUNYLElBQUMsQ0FBQSxXQUFELENBQWEsUUFBYixFQUF1QixFQUF2QixFQUEyQixTQUEzQixFQURXO0lBQUEsQ0FUYjtBQUFBLElBWUEsV0FBQSxFQUFhLFNBQUMsTUFBRCxFQUFTLEVBQVQsRUFBYSxTQUFiLEdBQUE7QUFDWCxVQUFBLFdBQUE7QUFBQSxNQUFBLElBQUcsRUFBQSxLQUFNLElBQVQ7QUFDRSxRQUFBLENBQUEsR0FBSSxDQUFKLENBQUE7QUFDQTtlQUFNLENBQUEsR0FBSSxFQUFFLENBQUMsTUFBYixHQUFBO0FBQ0UsVUFBQSxFQUFHLENBQUEsQ0FBQSxDQUFFLENBQUMsU0FBVSxDQUFBLE1BQUEsQ0FBaEIsQ0FBd0IsU0FBeEIsQ0FBQSxDQUFBO0FBQUEsd0JBQ0EsQ0FBQSxHQURBLENBREY7UUFBQSxDQUFBO3dCQUZGO09BRFc7SUFBQSxDQVpiO0dBREYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/vitaminafront/.atom/packages/seti-syntax/lib/dom.coffee
