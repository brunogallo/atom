(function() {
  var ColorBufferElement, ColorMarkerElement, CompositeDisposable, Emitter, EventsDelegation, nextHighlightId, registerOrUpdateElement, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require('atom-utils'), registerOrUpdateElement = _ref.registerOrUpdateElement, EventsDelegation = _ref.EventsDelegation;

  _ref1 = [], ColorMarkerElement = _ref1[0], Emitter = _ref1[1], CompositeDisposable = _ref1[2];

  nextHighlightId = 0;

  ColorBufferElement = (function(_super) {
    __extends(ColorBufferElement, _super);

    function ColorBufferElement() {
      return ColorBufferElement.__super__.constructor.apply(this, arguments);
    }

    EventsDelegation.includeInto(ColorBufferElement);

    ColorBufferElement.prototype.createdCallback = function() {
      var _ref2, _ref3;
      if (Emitter == null) {
        _ref2 = require('atom'), Emitter = _ref2.Emitter, CompositeDisposable = _ref2.CompositeDisposable;
      }
      _ref3 = [0, 0], this.editorScrollLeft = _ref3[0], this.editorScrollTop = _ref3[1];
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.shadowRoot = this.createShadowRoot();
      this.displayedMarkers = [];
      this.usedMarkers = [];
      this.unusedMarkers = [];
      return this.viewsByMarkers = new WeakMap;
    };

    ColorBufferElement.prototype.attachedCallback = function() {
      this.attached = true;
      return this.update();
    };

    ColorBufferElement.prototype.detachedCallback = function() {
      return this.attached = false;
    };

    ColorBufferElement.prototype.onDidUpdate = function(callback) {
      return this.emitter.on('did-update', callback);
    };

    ColorBufferElement.prototype.getModel = function() {
      return this.colorBuffer;
    };

    ColorBufferElement.prototype.setModel = function(colorBuffer) {
      var scrollLeftListener, scrollTopListener;
      this.colorBuffer = colorBuffer;
      this.editor = this.colorBuffer.editor;
      if (this.editor.isDestroyed()) {
        return;
      }
      this.editorElement = atom.views.getView(this.editor);
      this.colorBuffer.initialize().then((function(_this) {
        return function() {
          return _this.update();
        };
      })(this));
      this.subscriptions.add(this.colorBuffer.onDidUpdateColorMarkers((function(_this) {
        return function() {
          return _this.update();
        };
      })(this)));
      this.subscriptions.add(this.colorBuffer.onDidDestroy((function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this)));
      scrollLeftListener = (function(_this) {
        return function(editorScrollLeft) {
          _this.editorScrollLeft = editorScrollLeft;
          return _this.updateScroll();
        };
      })(this);
      scrollTopListener = (function(_this) {
        return function(editorScrollTop) {
          _this.editorScrollTop = editorScrollTop;
          if (_this.useNativeDecorations()) {
            return;
          }
          _this.updateScroll();
          return requestAnimationFrame(function() {
            return _this.updateMarkers();
          });
        };
      })(this);
      if (this.editorElement.onDidChangeScrollLeft != null) {
        this.subscriptions.add(this.editorElement.onDidChangeScrollLeft(scrollLeftListener));
        this.subscriptions.add(this.editorElement.onDidChangeScrollTop(scrollTopListener));
      } else {
        this.subscriptions.add(this.editor.onDidChangeScrollLeft(scrollLeftListener));
        this.subscriptions.add(this.editor.onDidChangeScrollTop(scrollTopListener));
      }
      this.subscriptions.add(this.editor.onDidChange((function(_this) {
        return function() {
          return _this.usedMarkers.forEach(function(marker) {
            var _ref2;
            if ((_ref2 = marker.colorMarker) != null) {
              _ref2.invalidateScreenRangeCache();
            }
            return marker.checkScreenRange();
          });
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidAddCursor((function(_this) {
        return function() {
          return _this.requestSelectionUpdate();
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidRemoveCursor((function(_this) {
        return function() {
          return _this.requestSelectionUpdate();
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidChangeCursorPosition((function(_this) {
        return function() {
          return _this.requestSelectionUpdate();
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidAddSelection((function(_this) {
        return function() {
          return _this.requestSelectionUpdate();
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidRemoveSelection((function(_this) {
        return function() {
          return _this.requestSelectionUpdate();
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidChangeSelectionRange((function(_this) {
        return function() {
          return _this.requestSelectionUpdate();
        };
      })(this)));
      if (this.editor.onDidTokenize != null) {
        this.subscriptions.add(this.editor.onDidTokenize((function(_this) {
          return function() {
            return _this.editorConfigChanged();
          };
        })(this)));
      } else {
        this.subscriptions.add(this.editor.displayBuffer.onDidTokenize((function(_this) {
          return function() {
            return _this.editorConfigChanged();
          };
        })(this)));
      }
      this.subscriptions.add(atom.config.observe('editor.fontSize', (function(_this) {
        return function() {
          return _this.editorConfigChanged();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('editor.lineHeight', (function(_this) {
        return function() {
          return _this.editorConfigChanged();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.markerType', (function(_this) {
        return function(type) {
          if (ColorMarkerElement == null) {
            ColorMarkerElement = require('./color-marker-element');
          }
          if (ColorMarkerElement.prototype.rendererType !== type) {
            ColorMarkerElement.setMarkerType(type);
          }
          if (_this.isNativeDecorationType(type)) {
            _this.initializeNativeDecorations(type);
          } else {
            if (type === 'background') {
              _this.classList.add('above-editor-content');
            } else {
              _this.classList.remove('above-editor-content');
            }
            _this.destroyNativeDecorations();
            _this.updateMarkers(type);
          }
          return _this.previousType = type;
        };
      })(this)));
      this.subscriptions.add(atom.styles.onDidAddStyleElement((function(_this) {
        return function() {
          return _this.editorConfigChanged();
        };
      })(this)));
      this.subscriptions.add(this.editorElement.onDidAttach((function(_this) {
        return function() {
          return _this.attach();
        };
      })(this)));
      return this.subscriptions.add(this.editorElement.onDidDetach((function(_this) {
        return function() {
          return _this.detach();
        };
      })(this)));
    };

    ColorBufferElement.prototype.attach = function() {
      var _ref2;
      if (this.parentNode != null) {
        return;
      }
      if (this.editorElement == null) {
        return;
      }
      return (_ref2 = this.getEditorRoot().querySelector('.lines')) != null ? _ref2.appendChild(this) : void 0;
    };

    ColorBufferElement.prototype.detach = function() {
      if (this.parentNode == null) {
        return;
      }
      return this.parentNode.removeChild(this);
    };

    ColorBufferElement.prototype.destroy = function() {
      this.detach();
      this.subscriptions.dispose();
      if (this.isNativeDecorationType()) {
        this.destroyNativeDecorations();
      } else {
        this.releaseAllMarkerViews();
      }
      return this.colorBuffer = null;
    };

    ColorBufferElement.prototype.update = function() {
      if (this.useNativeDecorations()) {
        if (this.isGutterType()) {
          return this.updateGutterDecorations();
        } else {
          return this.updateHighlightDecorations(this.previousType);
        }
      } else {
        return this.updateMarkers();
      }
    };

    ColorBufferElement.prototype.updateScroll = function() {
      if (this.editorElement.hasTiledRendering && !this.useNativeDecorations()) {
        return this.style.webkitTransform = "translate3d(" + (-this.editorScrollLeft) + "px, " + (-this.editorScrollTop) + "px, 0)";
      }
    };

    ColorBufferElement.prototype.getEditorRoot = function() {
      var _ref2;
      return (_ref2 = this.editorElement.shadowRoot) != null ? _ref2 : this.editorElement;
    };

    ColorBufferElement.prototype.editorConfigChanged = function() {
      if ((this.parentNode == null) || this.useNativeDecorations()) {
        return;
      }
      this.usedMarkers.forEach((function(_this) {
        return function(marker) {
          if (marker.colorMarker != null) {
            return marker.render();
          } else {
            console.warn("A marker view was found in the used instance pool while having a null model", marker);
            return _this.releaseMarkerElement(marker);
          }
        };
      })(this));
      return this.updateMarkers();
    };

    ColorBufferElement.prototype.isGutterType = function(type) {
      if (type == null) {
        type = this.previousType;
      }
      return type === 'gutter' || type === 'native-dot' || type === 'native-square-dot';
    };

    ColorBufferElement.prototype.isDotType = function(type) {
      if (type == null) {
        type = this.previousType;
      }
      return type === 'native-dot' || type === 'native-square-dot';
    };

    ColorBufferElement.prototype.useNativeDecorations = function() {
      return this.isNativeDecorationType(this.previousType);
    };

    ColorBufferElement.prototype.isNativeDecorationType = function(type) {
      if (ColorMarkerElement == null) {
        ColorMarkerElement = require('./color-marker-element');
      }
      return ColorMarkerElement.isNativeDecorationType(type);
    };

    ColorBufferElement.prototype.initializeNativeDecorations = function(type) {
      this.releaseAllMarkerViews();
      this.destroyNativeDecorations();
      if (this.isGutterType(type)) {
        return this.initializeGutter(type);
      } else {
        return this.updateHighlightDecorations(type);
      }
    };

    ColorBufferElement.prototype.destroyNativeDecorations = function() {
      if (this.isGutterType()) {
        return this.destroyGutter();
      } else {
        return this.destroyHighlightDecorations();
      }
    };

    ColorBufferElement.prototype.updateHighlightDecorations = function(type) {
      var className, m, markers, markersByRows, maxRowLength, style, _i, _j, _len, _len1, _ref2, _ref3, _ref4, _ref5;
      if (this.editor.isDestroyed()) {
        return;
      }
      if (this.styleByMarkerId == null) {
        this.styleByMarkerId = {};
      }
      if (this.decorationByMarkerId == null) {
        this.decorationByMarkerId = {};
      }
      markers = this.colorBuffer.getValidColorMarkers();
      _ref2 = this.displayedMarkers;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        m = _ref2[_i];
        if (!(__indexOf.call(markers, m) < 0)) {
          continue;
        }
        if ((_ref3 = this.decorationByMarkerId[m.id]) != null) {
          _ref3.destroy();
        }
        this.removeChild(this.styleByMarkerId[m.id]);
        delete this.styleByMarkerId[m.id];
        delete this.decorationByMarkerId[m.id];
      }
      markersByRows = {};
      maxRowLength = 0;
      for (_j = 0, _len1 = markers.length; _j < _len1; _j++) {
        m = markers[_j];
        if (((_ref4 = m.color) != null ? _ref4.isValid() : void 0) && __indexOf.call(this.displayedMarkers, m) < 0) {
          _ref5 = this.getHighlighDecorationCSS(m, type), className = _ref5.className, style = _ref5.style;
          this.appendChild(style);
          this.styleByMarkerId[m.id] = style;
          this.decorationByMarkerId[m.id] = this.editor.decorateMarker(m.marker, {
            type: 'highlight',
            "class": "pigments-" + type + " " + className,
            includeMarkerText: type === 'highlight'
          });
        }
      }
      this.displayedMarkers = markers;
      return this.emitter.emit('did-update');
    };

    ColorBufferElement.prototype.destroyHighlightDecorations = function() {
      var deco, id, _ref2;
      _ref2 = this.decorationByMarkerId;
      for (id in _ref2) {
        deco = _ref2[id];
        if (this.styleByMarkerId[id] != null) {
          this.removeChild(this.styleByMarkerId[id]);
        }
        deco.destroy();
      }
      delete this.decorationByMarkerId;
      delete this.styleByMarkerId;
      return this.displayedMarkers = [];
    };

    ColorBufferElement.prototype.getHighlighDecorationCSS = function(marker, type) {
      var className, l, style;
      className = "pigments-highlight-" + (nextHighlightId++);
      style = document.createElement('style');
      l = marker.color.luma;
      if (type === 'native-background') {
        style.innerHTML = "." + className + " .region {\n  background-color: " + (marker.color.toCSS()) + ";\n  color: " + (l > 0.43 ? 'black' : 'white') + ";\n}";
      } else if (type === 'native-underline') {
        style.innerHTML = "." + className + " .region {\n  background-color: " + (marker.color.toCSS()) + ";\n}";
      } else if (type === 'native-outline') {
        style.innerHTML = "." + className + " .region {\n  border-color: " + (marker.color.toCSS()) + ";\n}";
      }
      return {
        className: className,
        style: style
      };
    };

    ColorBufferElement.prototype.initializeGutter = function(type) {
      var gutterContainer, options;
      options = {
        name: "pigments-" + type
      };
      if (type !== 'gutter') {
        options.priority = 1000;
      }
      this.gutter = this.editor.addGutter(options);
      this.displayedMarkers = [];
      if (this.decorationByMarkerId == null) {
        this.decorationByMarkerId = {};
      }
      gutterContainer = this.getEditorRoot().querySelector('.gutter-container');
      this.gutterSubscription = new CompositeDisposable;
      this.gutterSubscription.add(this.subscribeTo(gutterContainer, {
        mousedown: (function(_this) {
          return function(e) {
            var colorMarker, markerId, targetDecoration;
            targetDecoration = e.path[0];
            if (!targetDecoration.matches('span')) {
              targetDecoration = targetDecoration.querySelector('span');
            }
            if (targetDecoration == null) {
              return;
            }
            markerId = targetDecoration.dataset.markerId;
            colorMarker = _this.displayedMarkers.filter(function(m) {
              return m.id === Number(markerId);
            })[0];
            if (!((colorMarker != null) && (_this.colorBuffer != null))) {
              return;
            }
            return _this.colorBuffer.selectColorMarkerAndOpenPicker(colorMarker);
          };
        })(this)
      }));
      if (this.isDotType(type)) {
        this.gutterSubscription.add(this.editor.onDidChange((function(_this) {
          return function(changes) {
            if (Array.isArray(changes)) {
              return changes != null ? changes.forEach(function(change) {
                return _this.updateDotDecorationsOffsets(change.start.row, change.newExtent.row);
              }) : void 0;
            } else {
              return _this.updateDotDecorationsOffsets(changes.start.row, changes.newExtent.row);
            }
          };
        })(this)));
      }
      return this.updateGutterDecorations(type);
    };

    ColorBufferElement.prototype.destroyGutter = function() {
      var decoration, id, _ref2;
      this.gutter.destroy();
      this.gutterSubscription.dispose();
      this.displayedMarkers = [];
      _ref2 = this.decorationByMarkerId;
      for (id in _ref2) {
        decoration = _ref2[id];
        decoration.destroy();
      }
      delete this.decorationByMarkerId;
      return delete this.gutterSubscription;
    };

    ColorBufferElement.prototype.updateGutterDecorations = function(type) {
      var deco, decoWidth, m, markers, markersByRows, maxRowLength, row, rowLength, _i, _j, _len, _len1, _ref2, _ref3, _ref4;
      if (type == null) {
        type = this.previousType;
      }
      if (this.editor.isDestroyed()) {
        return;
      }
      markers = this.colorBuffer.getValidColorMarkers();
      _ref2 = this.displayedMarkers;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        m = _ref2[_i];
        if (!(__indexOf.call(markers, m) < 0)) {
          continue;
        }
        if ((_ref3 = this.decorationByMarkerId[m.id]) != null) {
          _ref3.destroy();
        }
        delete this.decorationByMarkerId[m.id];
      }
      markersByRows = {};
      maxRowLength = 0;
      for (_j = 0, _len1 = markers.length; _j < _len1; _j++) {
        m = markers[_j];
        if (((_ref4 = m.color) != null ? _ref4.isValid() : void 0) && __indexOf.call(this.displayedMarkers, m) < 0) {
          this.decorationByMarkerId[m.id] = this.gutter.decorateMarker(m.marker, {
            type: 'gutter',
            "class": 'pigments-gutter-marker',
            item: this.getGutterDecorationItem(m)
          });
        }
        deco = this.decorationByMarkerId[m.id];
        row = m.marker.getStartScreenPosition().row;
        if (markersByRows[row] == null) {
          markersByRows[row] = 0;
        }
        rowLength = 0;
        if (type !== 'gutter') {
          rowLength = this.editorElement.pixelPositionForScreenPosition([row, Infinity]).left;
        }
        decoWidth = 14;
        deco.properties.item.style.left = "" + (rowLength + markersByRows[row] * decoWidth) + "px";
        markersByRows[row]++;
        maxRowLength = Math.max(maxRowLength, markersByRows[row]);
      }
      if (type === 'gutter') {
        atom.views.getView(this.gutter).style.minWidth = "" + (maxRowLength * decoWidth) + "px";
      } else {
        atom.views.getView(this.gutter).style.width = "0px";
      }
      this.displayedMarkers = markers;
      return this.emitter.emit('did-update');
    };

    ColorBufferElement.prototype.updateDotDecorationsOffsets = function(rowStart, rowEnd) {
      var deco, decoWidth, m, markerRow, markersByRows, row, rowLength, _i, _results;
      markersByRows = {};
      _results = [];
      for (row = _i = rowStart; rowStart <= rowEnd ? _i <= rowEnd : _i >= rowEnd; row = rowStart <= rowEnd ? ++_i : --_i) {
        _results.push((function() {
          var _j, _len, _ref2, _results1;
          _ref2 = this.displayedMarkers;
          _results1 = [];
          for (_j = 0, _len = _ref2.length; _j < _len; _j++) {
            m = _ref2[_j];
            deco = this.decorationByMarkerId[m.id];
            if (m.marker == null) {
              continue;
            }
            markerRow = m.marker.getStartScreenPosition().row;
            if (row !== markerRow) {
              continue;
            }
            if (markersByRows[row] == null) {
              markersByRows[row] = 0;
            }
            rowLength = this.editorElement.pixelPositionForScreenPosition([row, Infinity]).left;
            decoWidth = 14;
            deco.properties.item.style.left = "" + (rowLength + markersByRows[row] * decoWidth) + "px";
            _results1.push(markersByRows[row]++);
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    ColorBufferElement.prototype.getGutterDecorationItem = function(marker) {
      var div;
      div = document.createElement('div');
      div.innerHTML = "<span style='background-color: " + (marker.color.toCSS()) + ";' data-marker-id='" + marker.id + "'></span>";
      return div;
    };

    ColorBufferElement.prototype.requestMarkerUpdate = function(markers) {
      if (this.frameRequested) {
        this.dirtyMarkers = this.dirtyMarkers.concat(markers);
        return;
      } else {
        this.dirtyMarkers = markers.slice();
        this.frameRequested = true;
      }
      return requestAnimationFrame((function(_this) {
        return function() {
          var dirtyMarkers, m, _i, _len, _ref2;
          dirtyMarkers = [];
          _ref2 = _this.dirtyMarkers;
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            m = _ref2[_i];
            if (__indexOf.call(dirtyMarkers, m) < 0) {
              dirtyMarkers.push(m);
            }
          }
          delete _this.frameRequested;
          delete _this.dirtyMarkers;
          if (_this.colorBuffer == null) {
            return;
          }
          return dirtyMarkers.forEach(function(marker) {
            return marker.render();
          });
        };
      })(this));
    };

    ColorBufferElement.prototype.updateMarkers = function(type) {
      var m, markers, _base, _base1, _i, _j, _len, _len1, _ref2, _ref3, _ref4;
      if (type == null) {
        type = this.previousType;
      }
      if (this.editor.isDestroyed()) {
        return;
      }
      markers = this.colorBuffer.findValidColorMarkers({
        intersectsScreenRowRange: (_ref2 = typeof (_base = this.editorElement).getVisibleRowRange === "function" ? _base.getVisibleRowRange() : void 0) != null ? _ref2 : typeof (_base1 = this.editor).getVisibleRowRange === "function" ? _base1.getVisibleRowRange() : void 0
      });
      _ref3 = this.displayedMarkers;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        m = _ref3[_i];
        if (__indexOf.call(markers, m) < 0) {
          this.releaseMarkerView(m);
        }
      }
      for (_j = 0, _len1 = markers.length; _j < _len1; _j++) {
        m = markers[_j];
        if (((_ref4 = m.color) != null ? _ref4.isValid() : void 0) && __indexOf.call(this.displayedMarkers, m) < 0) {
          this.requestMarkerView(m);
        }
      }
      this.displayedMarkers = markers;
      return this.emitter.emit('did-update');
    };

    ColorBufferElement.prototype.requestMarkerView = function(marker) {
      var view;
      if (this.unusedMarkers.length) {
        view = this.unusedMarkers.shift();
      } else {
        if (ColorMarkerElement == null) {
          ColorMarkerElement = require('./color-marker-element');
        }
        view = new ColorMarkerElement;
        view.setContainer(this);
        view.onDidRelease((function(_this) {
          return function(_arg) {
            var marker;
            marker = _arg.marker;
            _this.displayedMarkers.splice(_this.displayedMarkers.indexOf(marker), 1);
            return _this.releaseMarkerView(marker);
          };
        })(this));
        this.shadowRoot.appendChild(view);
      }
      view.setModel(marker);
      this.hideMarkerIfInSelectionOrFold(marker, view);
      this.usedMarkers.push(view);
      this.viewsByMarkers.set(marker, view);
      return view;
    };

    ColorBufferElement.prototype.releaseMarkerView = function(markerOrView) {
      var marker, view;
      marker = markerOrView;
      view = this.viewsByMarkers.get(markerOrView);
      if (view != null) {
        if (marker != null) {
          this.viewsByMarkers["delete"](marker);
        }
        return this.releaseMarkerElement(view);
      }
    };

    ColorBufferElement.prototype.releaseMarkerElement = function(view) {
      this.usedMarkers.splice(this.usedMarkers.indexOf(view), 1);
      if (!view.isReleased()) {
        view.release(false);
      }
      return this.unusedMarkers.push(view);
    };

    ColorBufferElement.prototype.releaseAllMarkerViews = function() {
      var view, _i, _j, _len, _len1, _ref2, _ref3;
      _ref2 = this.usedMarkers;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        view = _ref2[_i];
        view.destroy();
      }
      _ref3 = this.unusedMarkers;
      for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
        view = _ref3[_j];
        view.destroy();
      }
      this.usedMarkers = [];
      this.unusedMarkers = [];
      return Array.prototype.forEach.call(this.shadowRoot.querySelectorAll('pigments-color-marker'), function(el) {
        return el.parentNode.removeChild(el);
      });
    };

    ColorBufferElement.prototype.requestSelectionUpdate = function() {
      if (this.updateRequested) {
        return;
      }
      this.updateRequested = true;
      return requestAnimationFrame((function(_this) {
        return function() {
          _this.updateRequested = false;
          if (_this.editor.getBuffer().isDestroyed()) {
            return;
          }
          return _this.updateSelections();
        };
      })(this));
    };

    ColorBufferElement.prototype.updateSelections = function() {
      var decoration, marker, view, _i, _j, _len, _len1, _ref2, _ref3, _results, _results1;
      if (this.editor.isDestroyed()) {
        return;
      }
      if (this.useNativeDecorations()) {
        _ref2 = this.displayedMarkers;
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          marker = _ref2[_i];
          decoration = this.decorationByMarkerId[marker.id];
          if (decoration != null) {
            _results.push(this.hideDecorationIfInSelection(marker, decoration));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      } else {
        _ref3 = this.displayedMarkers;
        _results1 = [];
        for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
          marker = _ref3[_j];
          view = this.viewsByMarkers.get(marker);
          if (view != null) {
            view.classList.remove('hidden');
            view.classList.remove('in-fold');
            _results1.push(this.hideMarkerIfInSelectionOrFold(marker, view));
          } else {
            _results1.push(console.warn("A color marker was found in the displayed markers array without an associated view", marker));
          }
        }
        return _results1;
      }
    };

    ColorBufferElement.prototype.hideDecorationIfInSelection = function(marker, decoration) {
      var classes, markerRange, props, range, selection, selections, _i, _len;
      selections = this.editor.getSelections();
      props = decoration.getProperties();
      classes = props["class"].split(/\s+/g);
      for (_i = 0, _len = selections.length; _i < _len; _i++) {
        selection = selections[_i];
        range = selection.getScreenRange();
        markerRange = marker.getScreenRange();
        if (!((markerRange != null) && (range != null))) {
          continue;
        }
        if (markerRange.intersectsWith(range)) {
          if (classes[0].match(/-in-selection$/) == null) {
            classes[0] += '-in-selection';
          }
          props["class"] = classes.join(' ');
          decoration.setProperties(props);
          return;
        }
      }
      classes = classes.map(function(cls) {
        return cls.replace('-in-selection', '');
      });
      props["class"] = classes.join(' ');
      return decoration.setProperties(props);
    };

    ColorBufferElement.prototype.hideMarkerIfInSelectionOrFold = function(marker, view) {
      var markerRange, range, selection, selections, _i, _len, _results;
      selections = this.editor.getSelections();
      _results = [];
      for (_i = 0, _len = selections.length; _i < _len; _i++) {
        selection = selections[_i];
        range = selection.getScreenRange();
        markerRange = marker.getScreenRange();
        if (!((markerRange != null) && (range != null))) {
          continue;
        }
        if (markerRange.intersectsWith(range)) {
          view.classList.add('hidden');
        }
        if (this.editor.isFoldedAtBufferRow(marker.getBufferRange().start.row)) {
          _results.push(view.classList.add('in-fold'));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    ColorBufferElement.prototype.colorMarkerForMouseEvent = function(event) {
      var bufferPosition, position;
      position = this.screenPositionForMouseEvent(event);
      if (position == null) {
        return;
      }
      bufferPosition = this.colorBuffer.editor.bufferPositionForScreenPosition(position);
      return this.colorBuffer.getColorMarkerAtBufferPosition(bufferPosition);
    };

    ColorBufferElement.prototype.screenPositionForMouseEvent = function(event) {
      var pixelPosition;
      pixelPosition = this.pixelPositionForMouseEvent(event);
      if (pixelPosition == null) {
        return;
      }
      if (this.editorElement.screenPositionForPixelPosition != null) {
        return this.editorElement.screenPositionForPixelPosition(pixelPosition);
      } else {
        return this.editor.screenPositionForPixelPosition(pixelPosition);
      }
    };

    ColorBufferElement.prototype.pixelPositionForMouseEvent = function(event) {
      var clientX, clientY, left, rootElement, scrollTarget, top, _ref2;
      clientX = event.clientX, clientY = event.clientY;
      scrollTarget = this.editorElement.getScrollTop != null ? this.editorElement : this.editor;
      rootElement = this.getEditorRoot();
      if (rootElement.querySelector('.lines') == null) {
        return;
      }
      _ref2 = rootElement.querySelector('.lines').getBoundingClientRect(), top = _ref2.top, left = _ref2.left;
      top = clientY - top + scrollTarget.getScrollTop();
      left = clientX - left + scrollTarget.getScrollLeft();
      return {
        top: top,
        left: left
      };
    };

    return ColorBufferElement;

  })(HTMLElement);

  module.exports = ColorBufferElement = registerOrUpdateElement('pigments-markers', ColorBufferElement.prototype);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpdGFtaW5hZnJvbnQvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL2NvbG9yLWJ1ZmZlci1lbGVtZW50LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw2SUFBQTtJQUFBOzt5SkFBQTs7QUFBQSxFQUFBLE9BQThDLE9BQUEsQ0FBUSxZQUFSLENBQTlDLEVBQUMsK0JBQUEsdUJBQUQsRUFBMEIsd0JBQUEsZ0JBQTFCLENBQUE7O0FBQUEsRUFFQSxRQUFxRCxFQUFyRCxFQUFDLDZCQUFELEVBQXFCLGtCQUFyQixFQUE4Qiw4QkFGOUIsQ0FBQTs7QUFBQSxFQUlBLGVBQUEsR0FBa0IsQ0FKbEIsQ0FBQTs7QUFBQSxFQU1NO0FBQ0oseUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsZ0JBQWdCLENBQUMsV0FBakIsQ0FBNkIsa0JBQTdCLENBQUEsQ0FBQTs7QUFBQSxpQ0FFQSxlQUFBLEdBQWlCLFNBQUEsR0FBQTtBQUNmLFVBQUEsWUFBQTtBQUFBLE1BQUEsSUFBTyxlQUFQO0FBQ0UsUUFBQSxRQUFpQyxPQUFBLENBQVEsTUFBUixDQUFqQyxFQUFDLGdCQUFBLE9BQUQsRUFBVSw0QkFBQSxtQkFBVixDQURGO09BQUE7QUFBQSxNQUdBLFFBQXdDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBeEMsRUFBQyxJQUFDLENBQUEsMkJBQUYsRUFBb0IsSUFBQyxDQUFBLDBCQUhyQixDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxPQUpYLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFMakIsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFDLENBQUEsZ0JBQUQsQ0FBQSxDQU5kLENBQUE7QUFBQSxNQU9BLElBQUMs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

//# sourceURL=/Users/vitaminafront/.atom/packages/pigments/lib/color-buffer-element.coffee
