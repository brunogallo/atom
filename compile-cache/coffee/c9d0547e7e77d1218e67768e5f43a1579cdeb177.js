(function() {
  var $$, CompositeDisposable, ExposeView, View, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), View = _ref.View, $$ = _ref.$$;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = ExposeView = (function(_super) {
    __extends(ExposeView, _super);

    ExposeView.content = function(title, color, pending) {
      var titleClass;
      titleClass = 'title icon-file-text';
      if (pending) {
        titleClass += ' pending';
      }
      return this.div({
        click: 'activateTab',
        "class": 'expose-tab'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'tab-header'
          }, function() {
            _this.div({
              "class": titleClass,
              'data-name': title
            }, title);
            return _this.div({
              click: 'closeTab',
              "class": 'close-icon icon-x'
            });
          });
          return _this.div({
            outlet: 'tabBody',
            "class": 'tab-body',
            style: "border-color: " + color
          });
        };
      })(this));
    };

    function ExposeView(item, color) {
      this.item = item != null ? item : {};
      this.color = color != null ? color : '#000';
      this.toggleActive = __bind(this.toggleActive, this);
      this.refreshTab = __bind(this.refreshTab, this);
      this.title = this.getItemTitle();
      this.pending = this.isItemPending();
      ExposeView.__super__.constructor.call(this, this.title, this.color, this.pending);
    }

    ExposeView.prototype.initialize = function() {
      this.disposables = new CompositeDisposable;
      this.handleEvents();
      return this.populateTabBody();
    };

    ExposeView.prototype.handleEvents = function() {
      this.on('click', '.icon-sync', this.refreshTab);
      this.disposables.add(atom.commands.add(this.element, {
        'expose:close-tab': (function(_this) {
          return function(e) {
            return _this.closeTab(e);
          };
        })(this)
      }));
      return atom.workspace.observeActivePaneItem(this.toggleActive);
    };

    ExposeView.prototype.destroy = function() {
      var _ref1;
      this.destroyed = true;
      this.remove();
      return (_ref1 = this.disposables) != null ? _ref1.dispose() : void 0;
    };

    ExposeView.prototype.populateTabBody = function() {
      if (this.drawImage()) {
        return;
      }
      if (this.drawMinimap()) {
        return;
      }
      return this.drawFallback();
    };

    ExposeView.prototype.drawFallback = function() {
      var iconClass, objectClass;
      objectClass = this.item.constructor.name;
      if (this.item.getIconName) {
        iconClass = 'icon-' + this.item.getIconName();
      }
      return this.tabBody.html($$(function() {
        return this.a({
          "class": iconClass || (function() {
            switch (objectClass) {
              case 'TextEditor':
                return 'icon-file-code';
              case 'ArchiveEditor':
                return 'icon-file-zip';
              default:
                return 'icon-file-text';
            }
          })()
        });
      }));
    };

    ExposeView.prototype.drawImage = function() {
      var filePath;
      if (this.item.constructor.name !== 'ImageEditor') {
        return;
      }
      filePath = this.item.file.path;
      return this.tabBody.html($$(function() {
        return this.img({
          src: filePath
        });
      }));
    };

    ExposeView.prototype.drawMinimap = function() {
      if (this.item.constructor.name !== 'TextEditor') {
        return;
      }
      if (!atom.packages.loadedPackages.minimap) {
        return;
      }
      return atom.packages.serviceHub.consume('minimap', '1.0.0', (function(_this) {
        return function(minimapAPI) {
          var minimap, minimapElement;
          if (minimapAPI.standAloneMinimapForEditor != null) {
            minimap = minimapAPI.standAloneMinimapForEditor(_this.item);
            minimapElement = atom.views.getView(minimap);
            minimapElement.style.cssText = 'width: 190px;\nheight: 130px;\nleft: 10px;\npointer-events: none;\nposition: absolute;';
            if (typeof minimap.setCharWidth === "function") {
              minimap.setCharWidth(2);
            }
            if (typeof minimap.setCharHeight === "function") {
              minimap.setCharHeight(4);
            }
            if (typeof minimap.setInterline === "function") {
              minimap.setInterline(2);
            }
            return _this.tabBody.html(minimapElement);
          } else {
            return _this.tabBody.html($$(function() {
              return this.a({
                "class": 'icon-sync'
              });
            }));
          }
        };
      })(this));
    };

    ExposeView.prototype.refreshTab = function(event) {
      event.stopPropagation();
      event.target.className += ' animate';
      atom.workspace.paneForItem(this.item).activateItem(this.item);
      return setTimeout(((function(_this) {
        return function() {
          return _this.populateTabBody();
        };
      })(this)), 1000);
    };

    ExposeView.prototype.activateTab = function() {
      var pane;
      pane = atom.workspace.paneForItem(this.item);
      pane.activate();
      return pane.activateItem(this.item);
    };

    ExposeView.prototype.toggleActive = function(item) {
      return this.toggleClass('active', item === this.item);
    };

    ExposeView.prototype.isActiveTab = function() {
      return atom.workspace.getActivePaneItem() === this.item;
    };

    ExposeView.prototype.closeTab = function(event) {
      if (event != null) {
        event.stopPropagation();
      }
      atom.workspace.paneForItem(this.item).destroyItem(this.item);
      return this.destroy();
    };

    ExposeView.prototype.getItemTitle = function() {
      var paneItem, title, _base, _i, _len, _ref1;
      if (!(title = typeof (_base = this.item).getTitle === "function" ? _base.getTitle() : void 0)) {
        return 'untitled';
      }
      _ref1 = atom.workspace.getPaneItems();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        paneItem = _ref1[_i];
        if (paneItem !== this.item) {
          if (paneItem.getTitle() === title && (this.item.getLongTitle != null)) {
            title = this.item.getLongTitle();
          }
        }
      }
      return title;
    };

    ExposeView.prototype.isItemPending = function() {
      var pane;
      if (!(pane = atom.workspace.paneForItem(this.item))) {
        return false;
      }
      if (pane.getPendingItem != null) {
        return pane.getPendingItem() === this.item;
      } else if (this.item.isPending != null) {
        return this.item.isPending();
      }
    };

    return ExposeView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpdGFtaW5hZnJvbnQvLmF0b20vcGFja2FnZXMvZXhwb3NlL2xpYi9leHBvc2UtdGFiLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtDQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBYSxPQUFBLENBQVEsc0JBQVIsQ0FBYixFQUFDLFlBQUEsSUFBRCxFQUFPLFVBQUEsRUFBUCxDQUFBOztBQUFBLEVBQ0Msc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQURELENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osaUNBQUEsQ0FBQTs7QUFBQSxJQUFBLFVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxLQUFELEVBQVEsS0FBUixFQUFlLE9BQWYsR0FBQTtBQUNSLFVBQUEsVUFBQTtBQUFBLE1BQUEsVUFBQSxHQUFhLHNCQUFiLENBQUE7QUFDQSxNQUFBLElBQTRCLE9BQTVCO0FBQUEsUUFBQSxVQUFBLElBQWMsVUFBZCxDQUFBO09BREE7YUFHQSxJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxLQUFBLEVBQU8sYUFBUDtBQUFBLFFBQXNCLE9BQUEsRUFBTyxZQUE3QjtPQUFMLEVBQWdELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDOUMsVUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sWUFBUDtXQUFMLEVBQTBCLFNBQUEsR0FBQTtBQUN4QixZQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxVQUFQO0FBQUEsY0FBbUIsV0FBQSxFQUFhLEtBQWhDO2FBQUwsRUFBNEMsS0FBNUMsQ0FBQSxDQUFBO21CQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLEtBQUEs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

//# sourceURL=/Users/vitaminafront/.atom/packages/expose/lib/expose-tab-view.coffee
