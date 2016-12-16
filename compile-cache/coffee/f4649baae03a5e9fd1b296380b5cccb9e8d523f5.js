(function() {
  var CompositeDisposable, ExposeTabView, ExposeView, Sortable, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  CompositeDisposable = require('atom').CompositeDisposable;

  Sortable = require('sortablejs');

  ExposeTabView = require('./expose-tab-view');

  module.exports = ExposeView = (function(_super) {
    __extends(ExposeView, _super);

    function ExposeView() {
      return ExposeView.__super__.constructor.apply(this, arguments);
    }

    ExposeView.prototype.tabs = [];

    ExposeView.content = function() {
      return this.div({
        "class": 'expose-view',
        tabindex: -1
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'expose-top'
          }, function() {
            _this.a({
              outlet: 'exposeSettings',
              "class": 'icon-gear'
            });
            return _this.a({
              "class": 'icon-x close-icon'
            });
          });
          return _this.div({
            outlet: 'tabList',
            "class": 'tab-list'
          });
        };
      })(this));
    };

    ExposeView.prototype.initialize = function() {
      this.disposables = new CompositeDisposable;
      this.handleEvents();
      return this.handleDrag();
    };

    ExposeView.prototype.destroy = function() {
      var _ref;
      this.remove();
      return (_ref = this.disposables) != null ? _ref.dispose() : void 0;
    };

    ExposeView.prototype.handleEvents = function() {
      this.exposeSettings.on('click', function() {
        return atom.workspace.open('atom://config/packages/expose');
      });
      this.on('click', (function(_this) {
        return function(event) {
          event.stopPropagation();
          return _this.exposeHide();
        };
      })(this));
      this.disposables.add(atom.config.observe('expose.useAnimations', (function(_this) {
        return function(value) {
          return _this.element.classList.toggle('animate', value);
        };
      })(this)));
      this.disposables.add(atom.commands.add(this.element, {
        'core:confirm': (function(_this) {
          return function() {
            return _this.exposeHide();
          };
        })(this),
        'core:cancel': (function(_this) {
          return function() {
            return _this.exposeHide();
          };
        })(this),
        'core:move-right': (function(_this) {
          return function() {
            return _this.nextTab();
          };
        })(this),
        'core:move-left': (function(_this) {
          return function() {
            return _this.nextTab(-1);
          };
        })(this),
        'expose:close': (function(_this) {
          return function() {
            return _this.exposeHide();
          };
        })(this),
        'expose:activate-1': (function(_this) {
          return function() {
            return _this.activateTab(1);
          };
        })(this),
        'expose:activate-2': (function(_this) {
          return function() {
            return _this.activateTab(2);
          };
        })(this),
        'expose:activate-3': (function(_this) {
          return function() {
            return _this.activateTab(3);
          };
        })(this),
        'expose:activate-4': (function(_this) {
          return function() {
            return _this.activateTab(4);
          };
        })(this),
        'expose:activate-5': (function(_this) {
          return function() {
            return _this.activateTab(5);
          };
        })(this),
        'expose:activate-6': (function(_this) {
          return function() {
            return _this.activateTab(6);
          };
        })(this),
        'expose:activate-7': (function(_this) {
          return function() {
            return _this.activateTab(7);
          };
        })(this),
        'expose:activate-8': (function(_this) {
          return function() {
            return _this.activateTab(8);
          };
        })(this),
        'expose:activate-9': (function(_this) {
          return function() {
            return _this.activateTab(9);
          };
        })(this)
      }));
      this.disposables.add(atom.workspace.onDidAddPaneItem((function(_this) {
        return function() {
          return _this.update();
        };
      })(this)));
      return this.disposables.add(atom.workspace.onDidDestroyPaneItem((function(_this) {
        return function() {
          return _this.update();
        };
      })(this)));
    };

    ExposeView.prototype.handleDrag = function() {
      return Sortable.create(this.tabList.context, {
        ghostClass: 'ghost',
        onEnd: (function(_this) {
          return function(evt) {
            return _this.moveTab(evt.oldIndex, evt.newIndex);
          };
        })(this)
      });
    };

    ExposeView.prototype.moveTab = function(from, to) {
      var fromItem, fromPane, i, item, toItem, toPane, toPaneIndex, _i, _len, _ref, _ref1, _ref2;
      if (!(fromItem = (_ref = this.tabs[from]) != null ? _ref.item : void 0)) {
        return;
      }
      if (!(toItem = (_ref1 = this.tabs[to]) != null ? _ref1.item : void 0)) {
        return;
      }
      fromPane = atom.workspace.paneForItem(fromItem);
      toPane = atom.workspace.paneForItem(toItem);
      toPaneIndex = 0;
      _ref2 = toPane.getItems();
      for (i = _i = 0, _len = _ref2.length; _i < _len; i = ++_i) {
        item = _ref2[i];
        if (item === toItem) {
          toPaneIndex = i;
        }
      }
      fromPane.moveItemToPane(fromItem, toPane, toPaneIndex);
      return this.update(true);
    };

    ExposeView.prototype.didChangeVisible = function(visible) {
      this.visible = visible;
      if (visible) {
        this.update();
        this.focus();
      } else {
        atom.workspace.getActivePane().activate();
      }
      return setTimeout(((function(_this) {
        return function() {
          return _this.element.classList.toggle('visible', visible);
        };
      })(this)), 0);
    };

    ExposeView.prototype.getGroupColor = function(n) {
      var colors;
      colors = ['#3498db', '#e74c3c', '#2ecc71', '#9b59b6'];
      return colors[n % colors.length];
    };

    ExposeView.prototype.update = function(force) {
      var color, exposeTabView, i, item, pane, _i, _j, _len, _len1, _ref, _ref1;
      if (!(this.visible || force)) {
        return;
      }
      this.removeTabs();
      _ref = atom.workspace.getPanes();
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        pane = _ref[i];
        color = this.getGroupColor(i);
        _ref1 = pane.getItems();
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          item = _ref1[_j];
          exposeTabView = new ExposeTabView(item, color);
          this.tabs.push(exposeTabView);
          this.tabList.append(exposeTabView);
        }
      }
      return this.focus();
    };

    ExposeView.prototype.removeTabs = function() {
      var tab, _i, _len, _ref;
      this.tabList.empty();
      _ref = this.tabs;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tab = _ref[_i];
        tab.destroy();
      }
      return this.tabs = [];
    };

    ExposeView.prototype.activateTab = function(n) {
      var _ref;
      if (n == null) {
        n = 1;
      }
      if (n < 1) {
        n = 1;
      }
      if (n > 9 || n > this.tabs.length) {
        n = this.tabs.length;
      }
      if ((_ref = this.tabs[n - 1]) != null) {
        _ref.activateTab();
      }
      return this.exposeHide();
    };

    ExposeView.prototype.nextTab = function(n) {
      var i, nextTabView, tabView, _i, _len, _ref;
      if (n == null) {
        n = 1;
      }
      _ref = this.tabs;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        tabView = _ref[i];
        if (tabView.isActiveTab()) {
          if (i + n < 0) {
            n = this.tabs.length - 1;
          }
          if (nextTabView = this.tabs[(i + n) % this.tabs.length]) {
            nextTabView.activateTab();
          }
          return this.focus();
        }
      }
    };

    ExposeView.prototype.exposeHide = function() {
      var panel, _i, _len, _ref, _results;
      _ref = atom.workspace.getModalPanels();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        panel = _ref[_i];
        if (panel.className === 'expose-panel') {
          _results.push(panel.hide());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return ExposeView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpdGFtaW5hZnJvbnQvLmF0b20vcGFja2FnZXMvZXhwb3NlL2xpYi9leHBvc2Utdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsOERBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLE9BQVEsT0FBQSxDQUFRLHNCQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBQ0Msc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQURELENBQUE7O0FBQUEsRUFFQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVIsQ0FGWCxDQUFBOztBQUFBLEVBSUEsYUFBQSxHQUFnQixPQUFBLENBQVEsbUJBQVIsQ0FKaEIsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixpQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEseUJBQUEsSUFBQSxHQUFNLEVBQU4sQ0FBQTs7QUFBQSxJQUVBLFVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLGFBQVA7QUFBQSxRQUFzQixRQUFBLEVBQVUsQ0FBQSxDQUFoQztPQUFMLEVBQXlDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDdkMsVUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sWUFBUDtXQUFMLEVBQTBCLFNBQUEsR0FBQTtBQUN4QixZQUFBLEtBQUMsQ0FBQSxDQUFELENBQUc7QUFBQSxjQUFBLE1BQUEsRUFBUSxnQkFBUjtBQUFBLGNBQTBCLE9BQUEsRUFBTyxXQUFqQzthQUFILENBQUEsQ0FBQTttQkFDQSxLQUFDLENBQUEsQ0FBRCxDQUFHO0FBQUEsY0FBQSxPQUFBLEVBQU8sbUJBQVA7YUFBSCxFQUZ3QjtVQUFBLENB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O1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUpoQjtBQUFBLFFBS0EsbUJBQUEsRUFBcUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLFdBQUQsQ0FBYSxDQUFiLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUxyQjtBQUFBLFFBTUEsbUJBQUEsRUFBcUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLFdBQUQsQ0FBYSxDQUFiLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQU5yQjtBQUFBLFFBT0EsbUJBQUEsRUFBcUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLFdBQUQsQ0FBYSxDQUFiLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQVByQjtBQUFBLFFBUUEsbUJBQUEsRUFBcUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLFdBQUQsQ0FBYSxDQUFiLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQVJyQjtBQUFBLFFBU0EsbUJBQUEsRUFBcUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLFdBQUQsQ0FBYSxDQUFiLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQVRyQjtBQUFBLFFBVUEsbUJBQUEsRUFBcUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLFdBQUQsQ0FBYSxDQUFiLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQVZyQjtBQUFBLFFBV0EsbUJBQUEsRUFBcUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7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

//# sourceURL=/Users/vitaminafront/.atom/packages/expose/lib/expose-view.coffee
