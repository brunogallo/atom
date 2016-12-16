(function() {
  var $$, CompositeDisposable, ExposeView, View, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), View = _ref.View, $$ = _ref.$$;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = ExposeView = (function(_super) {
    __extends(ExposeView, _super);

    ExposeView.content = function(title, color) {
      return this.div({
        click: 'activateTab',
        "class": 'expose-tab'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'tab-header'
          }, function() {
            _this.div({
              "class": 'title icon-file-text',
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
      ExposeView.__super__.constructor.call(this, this.title = this.getItemTitle(item), this.color);
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
          var minimap, minimapElement, _ref1;
          if (minimapAPI.standAloneMinimapForEditor != null) {
            minimap = minimapAPI.standAloneMinimapForEditor(_this.item);
            minimapElement = atom.views.getView(minimap);
            if ((_ref1 = minimapElement.controls) != null) {
              _ref1.remove();
            }
            minimapElement.style.cssText = 'width: 190px;\nheight: 130px;\nleft: 10px;\npointer-events: none;\n// transform: scale3d(1.5, 1.5, 1) translate(-20px, 15px);';
            minimap.setCharWidth(2);
            minimap.setCharHeight(4);
            minimap.setInterline(2);
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

    ExposeView.prototype.getItemTitle = function(item) {
      var paneItem, title, _i, _len, _ref1;
      if (!(title = item != null ? item.getTitle() : void 0)) {
        return 'untitled';
      }
      _ref1 = atom.workspace.getPaneItems();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        paneItem = _ref1[_i];
        if (paneItem !== item) {
          if (paneItem.getTitle() === title && (item.getLongTitle != null)) {
            title = item.getLongTitle();
          }
        }
      }
      return title;
    };

    return ExposeView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpdGFtaW5hZnJvbnQvLmF0b20vcGFja2FnZXMvZXhwb3NlL2xpYi9leHBvc2UtdGFiLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtDQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBYSxPQUFBLENBQVEsc0JBQVIsQ0FBYixFQUFDLFlBQUEsSUFBRCxFQUFPLFVBQUEsRUFBUCxDQUFBOztBQUFBLEVBQ0Msc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQURELENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osaUNBQUEsQ0FBQTs7QUFBQSxJQUFBLFVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxLQUFELEVBQVEsS0FBUixHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsS0FBQSxFQUFPLGFBQVA7QUFBQSxRQUFzQixPQUFBLEVBQU8sWUFBN0I7T0FBTCxFQUFnRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQzlDLFVBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLFlBQVA7V0FBTCxFQUEwQixTQUFBLEdBQUE7QUFDeEIsWUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8sc0JBQVA7QUFBQSxjQUErQixXQUFBLEVBQWEsS0FBNUM7YUFBTCxFQUF3RCxLQUF4RCxDQUFBLENBQUE7bUJBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsS0FBQSxFQUFPLFVBQVA7QUFBQSxjQUFtQixPQUFBLEVBQU8sbUJBQTFCO2FBQUwsRUFGd0I7VUFBQSxDQUExQixDQUFBLENBQUE7aUJBR0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsTUFBQSxF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

//# sourceURL=/Users/vitaminafront/.atom/packages/expose/lib/expose-tab-view.coffee
