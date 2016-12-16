(function() {
  var a, colors, ex, k, toCamelCase, tocamelCase, v;

  colors = {
    alice_blue: '#f0f8ff',
    antique_white: '#faebd7',
    aqua: '#00ffff',
    aquamarine: '#7fffd4',
    azure: '#f0ffff',
    beige: '#f5f5dc',
    bisque: '#ffe4c4',
    black: '#000000',
    blanched_almond: '#ffebcd',
    blue: '#0000ff',
    blue_violet: '#8a2be2',
    brown: '#a52a2a',
    burly_wood: '#deb887',
    cadet_blue: '#5f9ea0',
    chartreuse: '#7fff00',
    chocolate: '#d2691e',
    coral: '#ff7f50',
    corn_silk: '#fff8dc',
    cornflower_blue: '#6495ed',
    crimson: '#dc143c',
    cyan: '#00ffff',
    dark_blue: '#00008b',
    dark_cyan: '#008b8b',
    dark_golden_rod: '#b8860b',
    dark_gray: '#a9a9a9',
    dark_green: '#006400',
    dark_grey: '#a9a9a9',
    dark_khaki: '#bdb76b',
    dark_magenta: '#8b008b',
    dark_olive_green: '#556b2f',
    dark_orange: '#ff8c00',
    dark_orchid: '#9932cc',
    dark_red: '#8b0000',
    dark_salmon: '#e9967a',
    dark_seagreen: '#8fbc8f',
    dark_slateblue: '#483d8b',
    dark_slategray: '#2f4f4f',
    dark_slategrey: '#2f4f4f',
    dark_turquoise: '#00ced1',
    dark_violet: '#9400d3',
    deep_pink: '#ff1493',
    deep_skyblue: '#00bfff',
    dim_gray: '#696969',
    dim_grey: '#696969',
    dodger_blue: '#1e90ff',
    fire_brick: '#b22222',
    floral_white: '#fffaf0',
    forest_green: '#228b22',
    fuchsia: '#ff00ff',
    gainsboro: '#dcdcdc',
    ghost_white: '#f8f8ff',
    gold: '#ffd700',
    golden_rod: '#daa520',
    gray: '#808080',
    green: '#008000',
    green_yellow: '#adff2f',
    grey: '#808080',
    honey_dew: '#f0fff0',
    hot_pink: '#ff69b4',
    indian_red: '#cd5c5c',
    indigo: '#4b0082',
    ivory: '#fffff0',
    khaki: '#f0e68c',
    lavender: '#e6e6fa',
    lavender_blush: '#fff0f5',
    lawn_green: '#7cfc00',
    lemon_chiffon: '#fffacd',
    light_blue: '#add8e6',
    light_coral: '#f08080',
    light_cyan: '#e0ffff',
    light_golden_rod_yellow: '#fafad2',
    light_gray: '#d3d3d3',
    light_green: '#90ee90',
    light_grey: '#d3d3d3',
    light_pink: '#ffb6c1',
    light_salmon: '#ffa07a',
    light_sea_green: '#20b2aa',
    light_sky_blue: '#87cefa',
    light_slate_gray: '#778899',
    light_slate_grey: '#778899',
    light_steel_blue: '#b0c4de',
    light_yellow: '#ffffe0',
    lime: '#00ff00',
    lime_green: '#32cd32',
    linen: '#faf0e6',
    magenta: '#ff00ff',
    maroon: '#800000',
    medium_aquamarine: '#66cdaa',
    medium_blue: '#0000cd',
    medium_orchid: '#ba55d3',
    medium_purple: '#9370db',
    medium_sea_green: '#3cb371',
    medium_slate_blue: '#7b68ee',
    medium_spring_green: '#00fa9a',
    medium_turquoise: '#48d1cc',
    medium_violet_red: '#c71585',
    midnight_blue: '#191970',
    mint_cream: '#f5fffa',
    misty_rose: '#ffe4e1',
    moccasin: '#ffe4b5',
    navajo_white: '#ffdead',
    navy: '#000080',
    old_lace: '#fdf5e6',
    olive: '#808000',
    olive_drab: '#6b8e23',
    orange: '#ffa500',
    orange_red: '#ff4500',
    orchid: '#da70d6',
    pale_golden_rod: '#eee8aa',
    pale_green: '#98fb98',
    pale_turquoise: '#afeeee',
    pale_violet_red: '#db7093',
    papaya_whip: '#ffefd5',
    peach_puff: '#ffdab9',
    peru: '#cd853f',
    pink: '#ffc0cb',
    plum: '#dda0dd',
    powder_blue: '#b0e0e6',
    purple: '#800080',
    rebecca_purple: '#663399',
    red: '#ff0000',
    rosy_brown: '#bc8f8f',
    royal_blue: '#4169e1',
    saddle_brown: '#8b4513',
    salmon: '#fa8072',
    sandy_brown: '#f4a460',
    sea_green: '#2e8b57',
    sea_shell: '#fff5ee',
    sienna: '#a0522d',
    silver: '#c0c0c0',
    sky_blue: '#87ceeb',
    slate_blue: '#6a5acd',
    slate_gray: '#708090',
    slate_grey: '#708090',
    snow: '#fffafa',
    spring_green: '#00ff7f',
    steel_blue: '#4682b4',
    tan: '#d2b48c',
    teal: '#008080',
    thistle: '#d8bfd8',
    tomato: '#ff6347',
    turquoise: '#40e0d0',
    violet: '#ee82ee',
    wheat: '#f5deb3',
    white: '#ffffff',
    white_smoke: '#f5f5f5',
    yellow: '#ffff00',
    yellow_green: '#9acd32'
  };

  module.exports = ex = {
    lower_snake: colors,
    UPPER_SNAKE: {},
    lowercase: {},
    UPPERCASE: {},
    camelCase: {},
    CamelCase: {},
    allCases: {}
  };

  toCamelCase = function(s) {
    return s[0].toUpperCase() + s.slice(1);
  };

  tocamelCase = function(s, i) {
    if (i === 0) {
      return s;
    } else {
      return s[0].toUpperCase() + s.slice(1);
    }
  };

  for (k in colors) {
    v = colors[k];
    a = k.split('_');
    ex.allCases[k] = ex.allCases[a.map(toCamelCase).join('')] = ex.allCases[a.map(tocamelCase).join('')] = ex.allCases[a.join('_').toUpperCase()] = ex.allCases[a.join('')] = ex.allCases[a.join('').toUpperCase()] = ex.CamelCase[a.map(toCamelCase).join('')] = ex.camelCase[a.map(tocamelCase).join('')] = ex.UPPER_SNAKE[a.join('_').toUpperCase()] = ex.lowercase[a.join('')] = ex.UPPERCASE[a.join('').toUpperCase()] = v;
  }

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpdGFtaW5hZnJvbnQvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3N2Zy1jb2xvcnMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZDQUFBOztBQUFBLEVBQUEsTUFBQSxHQUNFO0FBQUEsSUFBQSxVQUFBLEVBQVksU0FBWjtBQUFBLElBQ0EsYUFBQSxFQUFlLFNBRGY7QUFBQSxJQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsSUFHQSxVQUFBLEVBQVksU0FIWjtBQUFBLElBSUEsS0FBQSxFQUFPLFNBSlA7QUFBQSxJQUtBLEtBQUEsRUFBTyxTQUxQO0FBQUEsSUFNQSxNQUFBLEVBQVEsU0FOUjtBQUFBLElBT0EsS0FBQSxFQUFPLFNBUFA7QUFBQSxJQVFBLGVBQUEsRUFBaUIsU0FSakI7QUFBQSxJQVNBLElBQUEsRUFBTSxTQVROO0FBQUEsSUFVQSxXQUFBLEVBQWEsU0FWYjtBQUFBLElBV0EsS0FBQSxFQUFPLFNBWFA7QUFBQSxJQVlBLFVBQUEsRUFBWSxTQVpaO0FBQUEsSUFhQSxVQUFBLEVBQVksU0FiWjtBQUFBLElBY0EsVUFBQSxFQUFZLFNBZFo7QUFBQSxJQWVBLFNBQUEsRUFBVyxTQWZYO0FBQUEsSUFnQkEsS0FBQSxFQUFPLFNBaEJQO0FBQUEsSUFpQkEsU0FBQSxFQUFXLFNBakJYO0FBQUEsSUFrQkEsZUFBQSxFQUFpQixTQWxCakI7QUFBQSxJQW1CQSxPQUFBLEVBQVMsU0FuQlQ7QUFBQSxJQW9CQSxJQUFBLEVBQU0sU0FwQk47QUFBQSxJQXFCQSxTQUFBLEVBQVcsU0FyQlg7QUFBQSxJQXNCQSxTQUFBLEVBQVcsU0F0Qlg7QUFBQSxJQXVCQSxlQUFBLEVBQWlCLFNBdkJqQjtBQUFBLElBd0JBLFNBQUEsRUFBVyxTQXhCWDtBQUFBLElBeUJBLFVBQUEsRUFBWSxTQXpCWjtBQUFBLElB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

//# sourceURL=/Users/vitaminafront/.atom/packages/pigments/lib/svg-colors.coffee
