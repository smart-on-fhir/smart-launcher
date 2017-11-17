webpackJsonp([0],{

/***/ "../node_modules/ansi-html/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = ansiHTML

// Reference to https://github.com/sindresorhus/ansi-regex
var _regANSI = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/

var _defColors = {
  reset: ['fff', '000'], // [FOREGROUD_COLOR, BACKGROUND_COLOR]
  black: '000',
  red: 'ff0000',
  green: '209805',
  yellow: 'e8bf03',
  blue: '0000ff',
  magenta: 'ff00ff',
  cyan: '00ffee',
  lightgrey: 'f0f0f0',
  darkgrey: '888'
}
var _styles = {
  30: 'black',
  31: 'red',
  32: 'green',
  33: 'yellow',
  34: 'blue',
  35: 'magenta',
  36: 'cyan',
  37: 'lightgrey'
}
var _openTags = {
  '1': 'font-weight:bold', // bold
  '2': 'opacity:0.5', // dim
  '3': '<i>', // italic
  '4': '<u>', // underscore
  '8': 'display:none', // hidden
  '9': '<del>' // delete
}
var _closeTags = {
  '23': '</i>', // reset italic
  '24': '</u>', // reset underscore
  '29': '</del>' // reset delete
}

;[0, 21, 22, 27, 28, 39, 49].forEach(function (n) {
  _closeTags[n] = '</span>'
})

/**
 * Converts text with ANSI color codes to HTML markup.
 * @param {String} text
 * @returns {*}
 */
function ansiHTML (text) {
  // Returns the text if the string has no ANSI escape code.
  if (!_regANSI.test(text)) {
    return text
  }

  // Cache opened sequence.
  var ansiCodes = []
  // Replace with markup.
  var ret = text.replace(/\033\[(\d+)*m/g, function (match, seq) {
    var ot = _openTags[seq]
    if (ot) {
      // If current sequence has been opened, close it.
      if (!!~ansiCodes.indexOf(seq)) { // eslint-disable-line no-extra-boolean-cast
        ansiCodes.pop()
        return '</span>'
      }
      // Open tag.
      ansiCodes.push(seq)
      return ot[0] === '<' ? ot : '<span style="' + ot + ';">'
    }

    var ct = _closeTags[seq]
    if (ct) {
      // Pop sequence
      ansiCodes.pop()
      return ct
    }
    return ''
  })

  // Make sure tags are closed.
  var l = ansiCodes.length
  ;(l > 0) && (ret += Array(l + 1).join('</span>'))

  return ret
}

/**
 * Customize colors.
 * @param {Object} colors reference to _defColors
 */
ansiHTML.setColors = function (colors) {
  if (typeof colors !== 'object') {
    throw new Error('`colors` parameter must be an Object.')
  }

  var _finalColors = {}
  for (var key in _defColors) {
    var hex = colors.hasOwnProperty(key) ? colors[key] : null
    if (!hex) {
      _finalColors[key] = _defColors[key]
      continue
    }
    if ('reset' === key) {
      if (typeof hex === 'string') {
        hex = [hex]
      }
      if (!Array.isArray(hex) || hex.length === 0 || hex.some(function (h) {
        return typeof h !== 'string'
      })) {
        throw new Error('The value of `' + key + '` property must be an Array and each item could only be a hex string, e.g.: FF0000')
      }
      var defHexColor = _defColors[key]
      if (!hex[0]) {
        hex[0] = defHexColor[0]
      }
      if (hex.length === 1 || !hex[1]) {
        hex = [hex[0]]
        hex.push(defHexColor[1])
      }

      hex = hex.slice(0, 2)
    } else if (typeof hex !== 'string') {
      throw new Error('The value of `' + key + '` property must be a hex string, e.g.: FF0000')
    }
    _finalColors[key] = hex
  }
  _setTags(_finalColors)
}

/**
 * Reset colors.
 */
ansiHTML.reset = function () {
  _setTags(_defColors)
}

/**
 * Expose tags, including open and close.
 * @type {Object}
 */
ansiHTML.tags = {}

if (Object.defineProperty) {
  Object.defineProperty(ansiHTML.tags, 'open', {
    get: function () { return _openTags }
  })
  Object.defineProperty(ansiHTML.tags, 'close', {
    get: function () { return _closeTags }
  })
} else {
  ansiHTML.tags.open = _openTags
  ansiHTML.tags.close = _closeTags
}

function _setTags (colors) {
  // reset all
  _openTags['0'] = 'font-weight:normal;opacity:1;color:#' + colors.reset[0] + ';background:#' + colors.reset[1]
  // inverse
  _openTags['7'] = 'color:#' + colors.reset[1] + ';background:#' + colors.reset[0]
  // dark grey
  _openTags['90'] = 'color:#' + colors.darkgrey

  for (var code in _styles) {
    var color = _styles[code]
    var oriColor = colors[color] || '000'
    _openTags[code] = 'color:#' + oriColor
    code = parseInt(code)
    _openTags[(code + 10).toString()] = 'background:#' + oriColor
  }
}

ansiHTML.reset()


/***/ }),

/***/ "../node_modules/ansi-regex/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function () {
	return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;
};


/***/ }),

/***/ "../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/AgeSelector/AgeSelector.less":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, ".age-widget-wrap {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: nowrap;\n  white-space: nowrap;\n  padding: 0;\n  position: relative;\n  font-size: 12px;\n}\n.age-widget-wrap > * {\n  display: flex;\n  flex-grow: 1;\n  flex-shrink: 1;\n  margin: 0;\n  height: 100%;\n  font-size: 13px;\n}\n.age-widget-wrap select {\n  border: 1px solid transparent;\n  border-radius: 4px;\n  height: 100%;\n}\n.age-widget-wrap.custom > select {\n  flex-grow: 0;\n  min-width: 0;\n  flex-basis: 180px;\n}\n.age-widget-wrap input {\n  height: 100%;\n  border: 1px solid transparent;\n}\n.age-widget {\n  display: flex;\n  flex-basis: 30%;\n  min-width: 0;\n  overflow: hidden;\n  align-items: center;\n  box-shadow: 2px 1px 2px -2px #BBB inset;\n}\n.age-widget:last-of-type {\n  border-radius: 0 3px 3px 0;\n}\n.age-widget span {\n  display: flex;\n  white-space: nowrap;\n  flex-basis: 7ex;\n  flex-shrink: 0;\n  flex-grow: 0;\n  margin: 0 1ex 0 0;\n  flex-direction: column;\n  align-content: flex-end;\n  background: rgba(0, 0, 0, 0.06);\n  box-shadow: 1px 0 0 0 rgba(0, 0, 0, 0.1), 1px 0 2px 0px rgba(0, 0, 0, 0.1);\n  line-height: 2.1em;\n  padding: 0 1ex;\n  text-align: right;\n  height: 100%;\n  font-weight: 500;\n}\n.age-widget input {\n  flex-shrink: 1;\n  flex-grow: 2;\n  flex-basis: 30px;\n  display: flex;\n  margin: 0;\n  background: transparent;\n  min-width: 32px;\n  border-right: 1px dotted rgba(0, 0, 0, 0.2);\n}\n.age-widget select {\n  display: flex;\n  flex-shrink: 1;\n  flex-grow: 1;\n  flex-basis: 6em;\n  min-width: 6em;\n}\n.age-widget:hover {\n  box-shadow: 0 0 0 1px #369;\n  background: #ebf0f5;\n}\n.age-widget.invalid {\n  background: rgba(255, 0, 0, 0.1);\n  background: rgba(255, 0, 0, 0.03) repeating-linear-gradient(-45deg, rgba(255, 50, 0, 0), rgba(255, 50, 0, 0) 2.5px, rgba(255, 0, 0, 0.2) 3px, rgba(255, 50, 0, 0) 3.5px);\n  background-size: 40px 40px;\n}\n@media (max-width: 600px) {\n  .age-widget-wrap.custom {\n    flex-wrap: wrap;\n    white-space: normal;\n    height: auto;\n  }\n  .age-widget-wrap.custom > select {\n    flex-basis: 600px;\n    flex-grow: 1;\n    flex-shrink: 1;\n    width: 100%;\n    line-height: 2.1em;\n    height: 2.1em;\n  }\n  .age-widget-wrap.custom .age-widget {\n    flex-basis: 50%;\n    flex-grow: 1;\n    min-width: none;\n    box-shadow: 0px 3px 0px -2px #DDD inset;\n  }\n  .age-widget-wrap.custom .age-widget:hover {\n    box-shadow: 0 0 0 1px #369;\n    background: #ebf0f5;\n  }\n  .age-widget-wrap.custom .age-widget:last-of-type {\n    border-radius: 0 0 3px 0;\n  }\n  .age-widget-wrap.custom .age-widget ~ .age-widget span {\n    box-shadow: 1px 0 0 0 rgba(0, 0, 0, 0.1), 1px 0 0 0 rgba(0, 0, 0, 0.1) inset, 1px 0 2px 0px rgba(0, 0, 0, 0.1);\n  }\n}\n", ""]);

// exports


/***/ }),

/***/ "../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/App/App.less":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "* {\n  box-sizing: border-box;\n}\nhtml {\n  height: 100%;\n  display: block;\n}\nbody {\n  background: linear-gradient(#F6F6F6, #FFF);\n  color: #444;\n  margin: 0;\n  padding: 0;\n  overflow: hidden;\n  height: 100%;\n  font-family: \"Helvetica Neue\", Arial, sans-serif;\n  font-size: 14px;\n  line-height: normal;\n}\na {\n  text-decoration: none;\n  color: #369;\n}\na:disabled,\na[disabled] {\n  pointer-events: none;\n  opacity: 0.4 !important;\n}\nhr {\n  border-top: 1px solid rgba(0, 0, 0, 0.1);\n  border-bottom: 1px solid rgba(255, 255, 255, 0.9);\n}\n*:focus {\n  outline: none !important;\n}\n.tab-content {\n  background: linear-gradient(#FFF, transparent);\n  border: 1px solid #DDD;\n  border-top: 0;\n  padding: 15px 15px 0;\n  border-radius: 0 0 5px 5px;\n}\n#overlay {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: rgba(150, 150, 150, 0.1);\n  z-index: 1000000000;\n}\n#main {\n  height: 100%;\n}\n.app {\n  display: flex;\n  flex-direction: column;\n  flex-shrink: 0;\n  height: 100%;\n}\n.page {\n  display: flex;\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n}\n.page {\n  display: flex;\n}\n.patient-search-loading {\n  display: flex;\n  flex-grow: 1;\n  align-content: center;\n  align-items: center;\n  align-self: center;\n}\n.patient-search-loading .fa {\n  margin: 1ex;\n}\n.spin {\n  animation: spin 2s linear infinite;\n}\n@keyframes spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(359deg);\n  }\n}\n.page {\n  display: flex;\n  flex-grow: 1;\n  flex-direction: column;\n  height: 100%;\n}\n.pre {\n  white-space: pre;\n  font-family: monospace;\n  font-size: 12px;\n  display: block;\n}\n.search-match {\n  background: #FFCF39;\n  box-shadow: 0 0 1px rgba(255, 255, 255, 0.8) inset, 0 0 1px rgba(0, 0, 0, 0.99) !important;\n  border-radius: 2px;\n  text-shadow: 0 0 1px #FFF !important;\n  color: #000 !important;\n}\n.small.pull-left,\n.small.pull-right,\nsmall.pull-left,\nsmall.pull-right {\n  margin-top: 0.5ex;\n}\nlabel[disabled] {\n  color: rgba(0, 0, 0, 0.4);\n  cursor: not-allowed;\n  user-select: none;\n}\n.deceased-label {\n  vertical-align: baseline;\n  color: #e45f00;\n  font-size: 11px;\n  padding: 0px 4px 1px;\n  border-radius: 3px;\n  border: 1px solid #ff6a00;\n  box-shadow: 0 1px 4px 0px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(255, 255, 255, 0.31) inset;\n}\nselect,\nselect.form-control {\n  padding: 0 10px;\n  line-height: 30px;\n  font: inherit;\n  background-color: transparent;\n  background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwMCIgaGVpZ2h0PSI1MTIiIHZpZXdCb3g9IjAgMCAxMDAwIDUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgZmlsbD0iIzAwMDAwMCI+PHBhdGggZD0iTSA5Ni4wMCw5Ni4wMGwtOTYuMDAsOTYuMDBsIDI1Ni4wMCwyNTYuMDBsIDI1Ni4wMC0yNTYuMDBsLTk2LjAwLTk2LjAwTCAyNTYuMDAsMjU2LjAwTCA5Ni4wMCw5Ni4wMHoiID48L3BhdGg+PC9zdmc+');\n  background-position: 100% 50%;\n  background-repeat: no-repeat;\n  background-size: 15px;\n  position: relative;\n  padding-right: 20px;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  -ms-appearance: none;\n}\nselect::-ms-expand,\nselect.form-control::-ms-expand {\n  display: none;\n}\n", ""]);

// exports


/***/ }),

/***/ "../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/DialogFooter/DialogFooter.less":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, ".dialog-buttons button {\n  min-width: 10em;\n  margin: 0 0 0 1em;\n}\n.dialog-buttons label {\n  margin: 2px 0;\n  display: flex;\n  align-items: center;\n  min-height: 30px;\n}\n.dialog-buttons .btn-group {\n  display: inline-flex;\n  flex: 0 1 18em;\n  line-height: 1;\n  flex-direction: row;\n  box-shadow: 0 1px 1px #FFF;\n  margin: 0 6px;\n}\n.dialog-buttons .btn-group > .btn {\n  display: flex;\n  flex: 1 1 120px;\n  align-items: center;\n  align-content: center;\n  align-self: center;\n  flex-direction: column;\n  min-width: 4em;\n  margin: 0;\n  border: 1px solid #BBB;\n  padding: 4px 2ex;\n  background: linear-gradient(#F9F9F9, #E9E9E9);\n  font-weight: normal;\n  color: #666;\n  text-shadow: 0 1px 0 #FFF;\n  box-shadow: 0 1px 1px #FFF inset;\n  overflow: hidden;\n}\n.dialog-buttons .btn-group > .btn:hover {\n  background: linear-gradient(#FFF, #EEE);\n}\n.dialog-buttons .btn-group > .btn:active,\n.dialog-buttons .btn-group > .btn.active {\n  background: linear-gradient(#CCC, #DDD);\n  box-shadow: 0 1px 1px #BBB inset;\n  border-color: #999 #AAA #BBB;\n}\n.dialog-buttons .btn-group > .btn + .btn {\n  margin-left: -1px;\n}\n.dialog-buttons .btn-group > .btn:first-child {\n  border-radius: 4px 0 0 4px;\n}\n.dialog-buttons .btn-group > .btn:last-child {\n  border-radius: 0 4px 4px 0;\n}\n.dialog-buttons :disabled .btn-group,\n.dialog-buttons [disabled] .btn-group,\n.dialog-buttons .disabled .btn-group {\n  opacity: 0.5;\n  pointer-events: none;\n}\n", ""]);

// exports


/***/ }),

/***/ "../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/Footer/Footer.less":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, ".app-footer {\n  position: relative;\n  z-index: 3;\n  display: flex;\n  flex-grow: 0;\n  flex-shrink: 0;\n  justify-content: center;\n  align-items: center;\n  box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.2), 0 0 5px 0 rgba(0, 0, 0, 0.25);\n  text-shadow: 0 1px 0 #FFF;\n  background: #F0F0F0;\n  white-space: nowrap;\n}\n.app-footer .row {\n  padding: 4px 0;\n  box-shadow: 0 -1px 0 0 rgba(0, 0, 0, 0.1) inset;\n}\n.app-footer .row + .row {\n  box-shadow: 0 -1px 0 0 rgba(0, 0, 0, 0.1) inset, 0 1px 0 0 rgba(255, 255, 255, 0.9) inset;\n}\n.app-footer .row:first-child .col-xs-6 {\n  padding: 6px 0px;\n}\n.app-footer a {\n  display: block;\n  padding: 5px 0px;\n  text-align: center;\n  border-radius: 4px;\n  border: 1px solid transparent;\n}\n.app-footer a:hover {\n  background: rgba(51, 122, 183, 0.15);\n  border: 1px solid rgba(51, 122, 183, 0.29);\n}\n", ""]);

// exports


/***/ }),

/***/ "../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/Header/Header.less":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, ".app-header {\n  color: #1f3d5c;\n  padding: 5px 0 0;\n  background: linear-gradient(#DFDFDF, #EEE 5px, #e2e2e2);\n  position: relative;\n  z-index: 3;\n  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2), 0 0 5px 0 rgba(0, 0, 0, 0.5);\n  text-shadow: 0 1px 0 #FFF;\n  display: flex;\n  flex-shrink: 0;\n  flex-direction: column;\n}\n.app-header .nav.nav-tabs {\n  padding-left: 5px;\n}\n.app-header .nav.nav-tabs a {\n  padding: 5px 10px;\n}\n.app-header .tab-content {\n  background: linear-gradient(#FFF, #F6F6F6);\n  border: 0;\n  border-bottom: 1px solid #BBB;\n  padding: 5px 5px 0;\n  border-radius: 0;\n  font-size: small;\n  box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.1);\n}\n.app-header .badge {\n  text-shadow: 0 0 1px #FFF;\n  background: rgba(0, 0, 0, 0.08);\n  color: #444;\n  font-weight: 400;\n  box-shadow: 0 0 0.5px 0 rgba(0, 0, 0, 0.2) inset;\n}\n.app-header .advanced-label {\n  margin: 7px 6px 0 0;\n}\n.app-header .advanced-label input[type=\"checkbox\"] {\n  margin: 0;\n  vertical-align: middle;\n}\n.app-header .form-group {\n  margin-bottom: 5px;\n}\n.app-header label,\n.app-header .alert {\n  margin-bottom: 3px;\n}\n.app-header .alert {\n  padding: 5px 10px;\n}\n.app-header .btn-submit {\n  margin: 4px 5px 0 auto;\n  padding: 3px 8px;\n  box-shadow: -13px 3px 0px -6px #e3e3e3, 13px 3px 0px -6px #e3e3e3, 0px 1px 0px 2px #e3e3e3, 0 2px 0 2px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.4), 0px 1px 1px -1px #FFF inset, 0px -17px 0px -5px rgba(0, 0, 0, 0.05) inset;\n  border-radius: 30px;\n  text-shadow: 0 -1px 1px rgba(0, 0, 0, 0.25), 0 0 1px rgba(0, 0, 0, 0.5);\n  border-color: rgba(0, 0, 0, 0.5);\n  position: relative;\n  z-index: 100000000;\n  min-width: 10%;\n}\n", ""]);

// exports


/***/ }),

/***/ "../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/Loader/Loader.less":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, ".loader {\n  background: rgba(255, 255, 255, 0.5);\n  text-align: center;\n  position: absolute;\n  z-index: 2;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  border-radius: inherit;\n}\n.loader div {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  font-size: 18px;\n  transform: translate(-50%, -50%);\n  background: #FFF;\n  border-radius: 5px;\n  padding: 1ex 2em;\n  box-shadow: 0 0 1px 0px rgba(0, 0, 0, 0.5), 0 0 15px 1px rgba(0, 0, 0, 0.15);\n}\n", ""]);

// exports


/***/ }),

/***/ "../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/PatientDetail/PatientDetail.less":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, ".patient-detail-page {\n  overflow: auto;\n  padding: 65px 0 50px;\n  display: block;\n  -webkit-overflow-scrolling: touch;\n}\n.patient-detail-page > .container {\n  width: 100%;\n}\n.patient-detail-page .navigator {\n  color: #FFF;\n}\n.patient-detail-page .navigator a {\n  white-space: nowrap;\n  padding: 8px 15px;\n  margin: 5px 0;\n  color: #FFF;\n}\n.patient-detail-page .navigator a:hover {\n  background: rgba(0, 0, 0, 0.05);\n}\n.patient-detail-page .navigator .fa {\n  margin: 0 5px;\n}\n.patient-detail-page .embed-responsive {\n  padding-bottom: 100%;\n}\n.patient-detail-page .page-header {\n  margin: 0;\n  padding-bottom: 1.5ex;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.1);\n}\n.patient-detail-page .patient {\n  background: transparent;\n  padding: 0;\n  border: 0;\n  box-shadow: none;\n  position: relative;\n}\n.patient-detail-page .patient .text-left {\n  text-shadow: 0 0 1px rgba(0, 0, 0, 0.1);\n}\n.patient-detail-page .patient-row {\n  background: rgba(0, 0, 0, 0.05);\n  border-radius: 3px;\n  margin-bottom: 5px;\n  padding: 5px;\n}\n.patient-detail-page .patient-row:after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n.patient-detail-page .patient-row ~ .row > div {\n  padding: 3px 5px;\n}\n.patient-detail-page .patient-row h3 {\n  margin: 0;\n  line-height: 1.45em;\n}\n.patient-detail-page .patient-row .label {\n  margin: 8px 0 0 12px;\n  font-size: 13px;\n}\n.patient-detail-page .patient-row .btn {\n  min-width: 7em;\n  margin: 2px;\n}\n.patient-detail-page .patient-image-wrap {\n  margin-right: 1ex;\n}\n.patient-detail-page .patient-name {\n  font-size: 24px;\n}\n.patient-detail-page td,\n.patient-detail-page th {\n  font-size: 13px;\n  line-height: 16px;\n}\n.patient-detail-page td .text-muted,\n.patient-detail-page th .text-muted {\n  font-weight: 400;\n}\n.patient-detail-page td b,\n.patient-detail-page th b {\n  font-weight: 500;\n}\n.patient-detail-page td label,\n.patient-detail-page th label {\n  margin-bottom: 0;\n}\n.patient-detail-page td td,\n.patient-detail-page th td {\n  vertical-align: top;\n  font-size: 12px;\n  line-height: 16px;\n}\n.patient-detail-page td .label-cell,\n.patient-detail-page th .label-cell {\n  color: #888;\n  white-space: nowrap;\n  text-align: right;\n  font-weight: 400;\n  padding-right: 1ex;\n}\n.patient-detail-page td .label-cell:after,\n.patient-detail-page th .label-cell:after {\n  content: \": \";\n}\n.patient-detail-page td {\n  font-weight: 500;\n}\n.patient-detail-page th {\n  font-weight: 700;\n}\n.patient-detail-page thead th .glyphicon,\n.patient-detail-page thead th .fa {\n  text-shadow: 0 1px 2px #FFF, 0 0 0px #214b6f;\n  color: rgba(51, 122, 183, 0.3);\n}\n.patient-detail-page .patient-details {\n  white-space: normal;\n  word-wrap: break-word;\n}\n.patient-detail-page .patient-details .badge {\n  opacity: 0.75;\n  margin: 0 0 0 2px;\n}\n.patient-detail-page .patient-details table a {\n  white-space: normal;\n  word-break: break-all;\n  word-wrap: break-word;\n}\n.patient-detail-page .patient-details .panel-heading {\n  text-shadow: 0 1px 0 #FFF;\n}\n.patient-detail-page .list-group-item {\n  padding-top: 7px;\n  padding-bottom: 7px;\n}\n.patient-detail-page .group-header {\n  cursor: pointer;\n  background: linear-gradient(90deg, #ebf2f8, #f5f8fb);\n  text-indent: 0;\n}\n.patient-detail-page .group-header .glyphicon-triangle-bottom {\n  position: relative;\n  top: 2px;\n}\n.patient-detail-page .group-header ~ tr > td:first-child {\n  text-indent: 17px;\n}\n.patient-detail-page .group-clear + tr > td:first-child {\n  text-indent: 0;\n}\n.patient-detail-page .group-clear + tr > td:first-child:before {\n  content: \"\\E250\";\n  position: relative;\n  top: 1px;\n  display: inline-block;\n  font-family: 'Glyphicons Halflings';\n  font-style: normal;\n  font-weight: 400;\n  line-height: 1;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  margin-right: 3px;\n  opacity: 0.3;\n}\n.patient-detail-page .table-responsive {\n  border: none !important;\n}\n", ""]);

// exports


/***/ }),

/***/ "../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/PatientImage/PatientImage.less":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, ".patient-image-wrap {\n  height: 80px;\n  width: 80px;\n  background: #F6F6F6;\n  border-radius: 3px;\n  text-align: center;\n  position: relative;\n  box-shadow: 0 0 0.5px 0 rgba(0, 0, 0, 0.5) inset, 0 0 1px 1px #FFF;\n  background-size: cover;\n  background-position: center;\n  flex-shrink: 0;\n  flex-grow: 0;\n}\n", ""]);

// exports


/***/ }),

/***/ "../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/PatientList/PatientList.less":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, ".patient-search-results {\n  display: flex;\n  flex-grow: 1;\n  flex-direction: column;\n  background: #FFF;\n  overflow: auto;\n  -webkit-overflow-scrolling: touch;\n}\n.patient-search-results .male {\n  color: #369;\n}\n.patient-search-results .female {\n  color: #936;\n}\n.patient-search-results .patient {\n  position: relative;\n  padding: 1ex;\n  cursor: pointer;\n  flex-flow: 0;\n  flex-shrink: 0;\n  align-items: center;\n  display: flex;\n  transition: background 0.1s;\n  color: #444;\n  text-decoration: none;\n  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.85) inset, 0 -1px 0 rgba(0, 0, 0, 0.15) inset;\n}\n.patient-search-results .patient:hover {\n  background: rgba(0, 0, 0, 0.05);\n}\n.patient-search-results .patient .patient-select-zone {\n  display: inline-block;\n  vertical-align: middle;\n  height: 54px;\n  line-height: 54px;\n  width: 30px;\n  border-radius: 3px;\n  text-align: center;\n  color: #369;\n  min-width: 30px;\n}\n.patient-search-results .patient .patient-select-zone:hover {\n  background: rgba(51, 102, 153, 0.1);\n}\n.patient-search-results .patient .fa-angle-right {\n  opacity: 0.5;\n  font-size: 20px;\n  display: flex;\n  flex-basis: 1em;\n}\n.patient-search-results .patient .patient-image-wrap {\n  height: 54px;\n  width: 54px;\n  margin: 0 1ex;\n}\n.patient-search-results .patient .patient-info {\n  flex-grow: 1;\n}\n.patient-search-results .patient .patient-info > b {\n  font-size: 16px;\n  line-height: 1;\n  display: block;\n  margin-bottom: 2px;\n}\n.patient-search-results .patient .patient-info small {\n  opacity: 0.7;\n  display: block;\n}\n.patient-search-results .patient .patient-info footer {\n  opacity: 0.7;\n  display: flex;\n  flex-direction: row;\n  margin-top: 5px;\n}\n.patient-search-results .patient .patient-info footer > span {\n  display: flex;\n  flex-basis: 14em;\n  flex-grow: 1;\n}\n.patient-search-results .patient .patient-info footer > span + span {\n  margin-left: 2em;\n}\n.patient-search-results .patient.selected {\n  background: #369;\n  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.05) inset, 0 -1px 0 rgba(0, 0, 0, 0.15) inset;\n  text-shadow: 0 0 1px #000;\n}\n.patient-search-results .patient.selected,\n.patient-search-results .patient.selected * {\n  color: #FFF;\n}\n.patient-search-results .patient.selected .patient-image-wrap {\n  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3), 0 0 0 0.5px rgba(255, 255, 255, 0.5) inset;\n}\n.patient-search-results .patient.selected .patient-select-zone:hover {\n  background: rgba(255, 255, 255, 0.07);\n}\n.patient-search-results .patient.selected:hover {\n  background: #2f5e8e;\n}\n@media (max-width: 480px) {\n  .patient-search-results .patient .patient-info footer span + span {\n    display: none;\n  }\n}\n", ""]);

// exports


/***/ }),

/***/ "../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/SortWidget/SortWidget.less":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, ".sort-widget {\n  padding: 0 5px;\n  float: left;\n  width: 100%;\n}\n.sort-widget > span {\n  padding: 6px 1ex 0 0;\n  font-weight: bold;\n}\n.sort-widget .nav.nav-pills li {\n  margin: 3px 3px 3px 0;\n}\n.sort-widget .nav.nav-pills li a {\n  padding: 4px 8px;\n}\n.sort-widget .nav.nav-pills li a .sort {\n  opacity: 0.6;\n}\n.sort-widget .nav.nav-pills li.active a,\n.sort-widget .nav.nav-pills li:hover a,\n.sort-widget .nav.nav-pills li:active a,\n.sort-widget .nav.nav-pills li a:focus {\n  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2) inset;\n}\n.sort-widget .nav.nav-pills li.active a {\n  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.3);\n}\n", ""]);

// exports


/***/ }),

/***/ "../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/TagSelector/TagSelector.less":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, ".tag-selector {\n  position: relative;\n  display: block;\n  width: 100%;\n  color: #000;\n  min-width: 200px;\n  font-size: small;\n}\n.tag-selector .tags {\n  margin-bottom: 4px;\n}\n.tag-selector input {\n  padding-right: 24px;\n}\n.tag-selector .tag {\n  margin: 1px 6px 1px 0px;\n  padding: 3px 26px 3px 6px;\n  background: #DC9;\n  box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.5) inset;\n  border-radius: 3px;\n  color: #520;\n  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.3);\n  display: inline-block;\n  position: relative;\n  font-weight: 500;\n  line-height: 1.2;\n  font-size: 12px;\n  cursor: default;\n}\n.tag-selector .tag:last-of-type {\n  margin-right: 0;\n}\n.tag-selector .tag .tag-remove {\n  position: absolute;\n  top: 4px;\n  right: 5px;\n  color: rgba(0, 0, 0, 0.4);\n  text-shadow: none;\n  opacity: 0.6;\n}\n.tag-selector .tag:hover {\n  background-color: #d7c286;\n}\n.tag-selector .tag:hover .tag-remove {\n  opacity: 0.5;\n}\n.tag-selector .tag:hover .tag-remove:hover {\n  opacity: 1;\n  color: #900;\n}\n.tag-selector .tag.custom {\n  background: #adc2d6;\n  color: #19334d;\n}\n.tag-selector .tag.custom:hover {\n  background-color: #9cb5ce;\n}\n.tag-selector .menu {\n  padding: 4px;\n  top: 100%;\n  width: 100%;\n  text-align: left;\n  max-height: 50vh;\n  overflow: auto;\n  z-index: 10000000000;\n}\n.tag-selector .menu-item {\n  padding: 5px 10px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  cursor: default;\n}\n.tag-selector .menu-item small {\n  line-height: 1.4;\n  font-weight: 400;\n}\n.tag-selector .menu-item .code {\n  width: 110px;\n  display: inline-block;\n  text-align: right;\n  padding-right: 1ex;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  float: left;\n  margin: 1px 0 -1px;\n}\n.tag-selector .menu-item:hover {\n  background: rgba(0, 0, 0, 0.1);\n}\n.tag-selector .menu-item.selected {\n  color: #FFF;\n  background: #369;\n  text-shadow: 0 0 1px #000000;\n}\n.tag-selector .menu-item.selected small {\n  color: rgba(255, 255, 255, 0.6);\n  text-shadow: none;\n}\n.tag-selector .menu-item.selected .tag.custom {\n  box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.5);\n}\n.tag-selector .menu-item.custom {\n  font-weight: bold;\n  cursor: pointer;\n  padding: 3px 10px;\n}\n.tag-selector .menu-item.custom + .menu-item {\n  position: relative;\n  overflow: visible;\n  margin-top: 9px;\n}\n.tag-selector .menu-item.custom + .menu-item:before {\n  content: \"\";\n  display: block;\n  height: 1px;\n  background: #CCC;\n  position: absolute;\n  top: -5px;\n  left: 0;\n  right: 0;\n}\n.tag-selector .menu-item.custom .tag {\n  margin: 0 1px;\n  padding: 3px 6px;\n  line-height: 1;\n}\n.tag-selector.open {\n  outline: none;\n}\n.tag-selector .fa.fa-caret-down {\n  position: absolute;\n  right: 10px;\n  bottom: 10px;\n  pointer-events: none;\n}\n", ""]);

// exports


/***/ }),

/***/ "../node_modules/css-loader/lib/css-base.js":
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ "../node_modules/debug/src/browser.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__("../node_modules/debug/src/debug.js");
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/process/browser.js")))

/***/ }),

/***/ "../node_modules/debug/src/debug.js":
/***/ (function(module, exports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__("../node_modules/ms/index.js");

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  return debug;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}


/***/ }),

/***/ "../node_modules/events/events.js":
/***/ (function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ }),

/***/ "../node_modules/for-in/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * for-in <https://github.com/jonschlinkert/for-in>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */



module.exports = function forIn(obj, fn, thisArg) {
  for (var key in obj) {
    if (fn.call(thisArg, obj[key], key, obj) === false) {
      break;
    }
  }
};


/***/ }),

/***/ "../node_modules/html-entities/index.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  XmlEntities: __webpack_require__("../node_modules/html-entities/lib/xml-entities.js"),
  Html4Entities: __webpack_require__("../node_modules/html-entities/lib/html4-entities.js"),
  Html5Entities: __webpack_require__("../node_modules/html-entities/lib/html5-entities.js"),
  AllHtmlEntities: __webpack_require__("../node_modules/html-entities/lib/html5-entities.js")
};


/***/ }),

/***/ "../node_modules/html-entities/lib/html4-entities.js":
/***/ (function(module, exports) {

var HTML_ALPHA = ['apos', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'Aelig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'acirc', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'quot', 'amp', 'lt', 'gt', 'OElig', 'oelig', 'Scaron', 'scaron', 'Yuml', 'circ', 'tilde', 'ensp', 'emsp', 'thinsp', 'zwnj', 'zwj', 'lrm', 'rlm', 'ndash', 'mdash', 'lsquo', 'rsquo', 'sbquo', 'ldquo', 'rdquo', 'bdquo', 'dagger', 'Dagger', 'permil', 'lsaquo', 'rsaquo', 'euro', 'fnof', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigmaf', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'thetasym', 'upsih', 'piv', 'bull', 'hellip', 'prime', 'Prime', 'oline', 'frasl', 'weierp', 'image', 'real', 'trade', 'alefsym', 'larr', 'uarr', 'rarr', 'darr', 'harr', 'crarr', 'lArr', 'uArr', 'rArr', 'dArr', 'hArr', 'forall', 'part', 'exist', 'empty', 'nabla', 'isin', 'notin', 'ni', 'prod', 'sum', 'minus', 'lowast', 'radic', 'prop', 'infin', 'ang', 'and', 'or', 'cap', 'cup', 'int', 'there4', 'sim', 'cong', 'asymp', 'ne', 'equiv', 'le', 'ge', 'sub', 'sup', 'nsub', 'sube', 'supe', 'oplus', 'otimes', 'perp', 'sdot', 'lceil', 'rceil', 'lfloor', 'rfloor', 'lang', 'rang', 'loz', 'spades', 'clubs', 'hearts', 'diams'];
var HTML_CODES = [39, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 34, 38, 60, 62, 338, 339, 352, 353, 376, 710, 732, 8194, 8195, 8201, 8204, 8205, 8206, 8207, 8211, 8212, 8216, 8217, 8218, 8220, 8221, 8222, 8224, 8225, 8240, 8249, 8250, 8364, 402, 913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 931, 932, 933, 934, 935, 936, 937, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 977, 978, 982, 8226, 8230, 8242, 8243, 8254, 8260, 8472, 8465, 8476, 8482, 8501, 8592, 8593, 8594, 8595, 8596, 8629, 8656, 8657, 8658, 8659, 8660, 8704, 8706, 8707, 8709, 8711, 8712, 8713, 8715, 8719, 8721, 8722, 8727, 8730, 8733, 8734, 8736, 8743, 8744, 8745, 8746, 8747, 8756, 8764, 8773, 8776, 8800, 8801, 8804, 8805, 8834, 8835, 8836, 8838, 8839, 8853, 8855, 8869, 8901, 8968, 8969, 8970, 8971, 9001, 9002, 9674, 9824, 9827, 9829, 9830];

var alphaIndex = {};
var numIndex = {};

var i = 0;
var length = HTML_ALPHA.length;
while (i < length) {
    var a = HTML_ALPHA[i];
    var c = HTML_CODES[i];
    alphaIndex[a] = String.fromCharCode(c);
    numIndex[c] = a;
    i++;
}

/**
 * @constructor
 */
function Html4Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1).toLowerCase() === 'x' ?
                parseInt(entity.substr(2), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.decode = function(str) {
    return new Html4Entities().decode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var alpha = numIndex[str.charCodeAt(i)];
        result += alpha ? "&" + alpha + ";" : str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encode = function(str) {
    return new Html4Entities().encode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var cc = str.charCodeAt(i);
        var alpha = numIndex[cc];
        if (alpha) {
            result += "&" + alpha + ";";
        } else if (cc < 32 || cc > 126) {
            result += "&#" + cc + ";";
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonUTF = function(str) {
    return new Html4Entities().encodeNonUTF(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonASCII = function(str) {
    return new Html4Entities().encodeNonASCII(str);
};

module.exports = Html4Entities;


/***/ }),

/***/ "../node_modules/html-entities/lib/html5-entities.js":
/***/ (function(module, exports) {

var ENTITIES = [['Aacute', [193]], ['aacute', [225]], ['Abreve', [258]], ['abreve', [259]], ['ac', [8766]], ['acd', [8767]], ['acE', [8766, 819]], ['Acirc', [194]], ['acirc', [226]], ['acute', [180]], ['Acy', [1040]], ['acy', [1072]], ['AElig', [198]], ['aelig', [230]], ['af', [8289]], ['Afr', [120068]], ['afr', [120094]], ['Agrave', [192]], ['agrave', [224]], ['alefsym', [8501]], ['aleph', [8501]], ['Alpha', [913]], ['alpha', [945]], ['Amacr', [256]], ['amacr', [257]], ['amalg', [10815]], ['amp', [38]], ['AMP', [38]], ['andand', [10837]], ['And', [10835]], ['and', [8743]], ['andd', [10844]], ['andslope', [10840]], ['andv', [10842]], ['ang', [8736]], ['ange', [10660]], ['angle', [8736]], ['angmsdaa', [10664]], ['angmsdab', [10665]], ['angmsdac', [10666]], ['angmsdad', [10667]], ['angmsdae', [10668]], ['angmsdaf', [10669]], ['angmsdag', [10670]], ['angmsdah', [10671]], ['angmsd', [8737]], ['angrt', [8735]], ['angrtvb', [8894]], ['angrtvbd', [10653]], ['angsph', [8738]], ['angst', [197]], ['angzarr', [9084]], ['Aogon', [260]], ['aogon', [261]], ['Aopf', [120120]], ['aopf', [120146]], ['apacir', [10863]], ['ap', [8776]], ['apE', [10864]], ['ape', [8778]], ['apid', [8779]], ['apos', [39]], ['ApplyFunction', [8289]], ['approx', [8776]], ['approxeq', [8778]], ['Aring', [197]], ['aring', [229]], ['Ascr', [119964]], ['ascr', [119990]], ['Assign', [8788]], ['ast', [42]], ['asymp', [8776]], ['asympeq', [8781]], ['Atilde', [195]], ['atilde', [227]], ['Auml', [196]], ['auml', [228]], ['awconint', [8755]], ['awint', [10769]], ['backcong', [8780]], ['backepsilon', [1014]], ['backprime', [8245]], ['backsim', [8765]], ['backsimeq', [8909]], ['Backslash', [8726]], ['Barv', [10983]], ['barvee', [8893]], ['barwed', [8965]], ['Barwed', [8966]], ['barwedge', [8965]], ['bbrk', [9141]], ['bbrktbrk', [9142]], ['bcong', [8780]], ['Bcy', [1041]], ['bcy', [1073]], ['bdquo', [8222]], ['becaus', [8757]], ['because', [8757]], ['Because', [8757]], ['bemptyv', [10672]], ['bepsi', [1014]], ['bernou', [8492]], ['Bernoullis', [8492]], ['Beta', [914]], ['beta', [946]], ['beth', [8502]], ['between', [8812]], ['Bfr', [120069]], ['bfr', [120095]], ['bigcap', [8898]], ['bigcirc', [9711]], ['bigcup', [8899]], ['bigodot', [10752]], ['bigoplus', [10753]], ['bigotimes', [10754]], ['bigsqcup', [10758]], ['bigstar', [9733]], ['bigtriangledown', [9661]], ['bigtriangleup', [9651]], ['biguplus', [10756]], ['bigvee', [8897]], ['bigwedge', [8896]], ['bkarow', [10509]], ['blacklozenge', [10731]], ['blacksquare', [9642]], ['blacktriangle', [9652]], ['blacktriangledown', [9662]], ['blacktriangleleft', [9666]], ['blacktriangleright', [9656]], ['blank', [9251]], ['blk12', [9618]], ['blk14', [9617]], ['blk34', [9619]], ['block', [9608]], ['bne', [61, 8421]], ['bnequiv', [8801, 8421]], ['bNot', [10989]], ['bnot', [8976]], ['Bopf', [120121]], ['bopf', [120147]], ['bot', [8869]], ['bottom', [8869]], ['bowtie', [8904]], ['boxbox', [10697]], ['boxdl', [9488]], ['boxdL', [9557]], ['boxDl', [9558]], ['boxDL', [9559]], ['boxdr', [9484]], ['boxdR', [9554]], ['boxDr', [9555]], ['boxDR', [9556]], ['boxh', [9472]], ['boxH', [9552]], ['boxhd', [9516]], ['boxHd', [9572]], ['boxhD', [9573]], ['boxHD', [9574]], ['boxhu', [9524]], ['boxHu', [9575]], ['boxhU', [9576]], ['boxHU', [9577]], ['boxminus', [8863]], ['boxplus', [8862]], ['boxtimes', [8864]], ['boxul', [9496]], ['boxuL', [9563]], ['boxUl', [9564]], ['boxUL', [9565]], ['boxur', [9492]], ['boxuR', [9560]], ['boxUr', [9561]], ['boxUR', [9562]], ['boxv', [9474]], ['boxV', [9553]], ['boxvh', [9532]], ['boxvH', [9578]], ['boxVh', [9579]], ['boxVH', [9580]], ['boxvl', [9508]], ['boxvL', [9569]], ['boxVl', [9570]], ['boxVL', [9571]], ['boxvr', [9500]], ['boxvR', [9566]], ['boxVr', [9567]], ['boxVR', [9568]], ['bprime', [8245]], ['breve', [728]], ['Breve', [728]], ['brvbar', [166]], ['bscr', [119991]], ['Bscr', [8492]], ['bsemi', [8271]], ['bsim', [8765]], ['bsime', [8909]], ['bsolb', [10693]], ['bsol', [92]], ['bsolhsub', [10184]], ['bull', [8226]], ['bullet', [8226]], ['bump', [8782]], ['bumpE', [10926]], ['bumpe', [8783]], ['Bumpeq', [8782]], ['bumpeq', [8783]], ['Cacute', [262]], ['cacute', [263]], ['capand', [10820]], ['capbrcup', [10825]], ['capcap', [10827]], ['cap', [8745]], ['Cap', [8914]], ['capcup', [10823]], ['capdot', [10816]], ['CapitalDifferentialD', [8517]], ['caps', [8745, 65024]], ['caret', [8257]], ['caron', [711]], ['Cayleys', [8493]], ['ccaps', [10829]], ['Ccaron', [268]], ['ccaron', [269]], ['Ccedil', [199]], ['ccedil', [231]], ['Ccirc', [264]], ['ccirc', [265]], ['Cconint', [8752]], ['ccups', [10828]], ['ccupssm', [10832]], ['Cdot', [266]], ['cdot', [267]], ['cedil', [184]], ['Cedilla', [184]], ['cemptyv', [10674]], ['cent', [162]], ['centerdot', [183]], ['CenterDot', [183]], ['cfr', [120096]], ['Cfr', [8493]], ['CHcy', [1063]], ['chcy', [1095]], ['check', [10003]], ['checkmark', [10003]], ['Chi', [935]], ['chi', [967]], ['circ', [710]], ['circeq', [8791]], ['circlearrowleft', [8634]], ['circlearrowright', [8635]], ['circledast', [8859]], ['circledcirc', [8858]], ['circleddash', [8861]], ['CircleDot', [8857]], ['circledR', [174]], ['circledS', [9416]], ['CircleMinus', [8854]], ['CirclePlus', [8853]], ['CircleTimes', [8855]], ['cir', [9675]], ['cirE', [10691]], ['cire', [8791]], ['cirfnint', [10768]], ['cirmid', [10991]], ['cirscir', [10690]], ['ClockwiseContourIntegral', [8754]], ['clubs', [9827]], ['clubsuit', [9827]], ['colon', [58]], ['Colon', [8759]], ['Colone', [10868]], ['colone', [8788]], ['coloneq', [8788]], ['comma', [44]], ['commat', [64]], ['comp', [8705]], ['compfn', [8728]], ['complement', [8705]], ['complexes', [8450]], ['cong', [8773]], ['congdot', [10861]], ['Congruent', [8801]], ['conint', [8750]], ['Conint', [8751]], ['ContourIntegral', [8750]], ['copf', [120148]], ['Copf', [8450]], ['coprod', [8720]], ['Coproduct', [8720]], ['copy', [169]], ['COPY', [169]], ['copysr', [8471]], ['CounterClockwiseContourIntegral', [8755]], ['crarr', [8629]], ['cross', [10007]], ['Cross', [10799]], ['Cscr', [119966]], ['cscr', [119992]], ['csub', [10959]], ['csube', [10961]], ['csup', [10960]], ['csupe', [10962]], ['ctdot', [8943]], ['cudarrl', [10552]], ['cudarrr', [10549]], ['cuepr', [8926]], ['cuesc', [8927]], ['cularr', [8630]], ['cularrp', [10557]], ['cupbrcap', [10824]], ['cupcap', [10822]], ['CupCap', [8781]], ['cup', [8746]], ['Cup', [8915]], ['cupcup', [10826]], ['cupdot', [8845]], ['cupor', [10821]], ['cups', [8746, 65024]], ['curarr', [8631]], ['curarrm', [10556]], ['curlyeqprec', [8926]], ['curlyeqsucc', [8927]], ['curlyvee', [8910]], ['curlywedge', [8911]], ['curren', [164]], ['curvearrowleft', [8630]], ['curvearrowright', [8631]], ['cuvee', [8910]], ['cuwed', [8911]], ['cwconint', [8754]], ['cwint', [8753]], ['cylcty', [9005]], ['dagger', [8224]], ['Dagger', [8225]], ['daleth', [8504]], ['darr', [8595]], ['Darr', [8609]], ['dArr', [8659]], ['dash', [8208]], ['Dashv', [10980]], ['dashv', [8867]], ['dbkarow', [10511]], ['dblac', [733]], ['Dcaron', [270]], ['dcaron', [271]], ['Dcy', [1044]], ['dcy', [1076]], ['ddagger', [8225]], ['ddarr', [8650]], ['DD', [8517]], ['dd', [8518]], ['DDotrahd', [10513]], ['ddotseq', [10871]], ['deg', [176]], ['Del', [8711]], ['Delta', [916]], ['delta', [948]], ['demptyv', [10673]], ['dfisht', [10623]], ['Dfr', [120071]], ['dfr', [120097]], ['dHar', [10597]], ['dharl', [8643]], ['dharr', [8642]], ['DiacriticalAcute', [180]], ['DiacriticalDot', [729]], ['DiacriticalDoubleAcute', [733]], ['DiacriticalGrave', [96]], ['DiacriticalTilde', [732]], ['diam', [8900]], ['diamond', [8900]], ['Diamond', [8900]], ['diamondsuit', [9830]], ['diams', [9830]], ['die', [168]], ['DifferentialD', [8518]], ['digamma', [989]], ['disin', [8946]], ['div', [247]], ['divide', [247]], ['divideontimes', [8903]], ['divonx', [8903]], ['DJcy', [1026]], ['djcy', [1106]], ['dlcorn', [8990]], ['dlcrop', [8973]], ['dollar', [36]], ['Dopf', [120123]], ['dopf', [120149]], ['Dot', [168]], ['dot', [729]], ['DotDot', [8412]], ['doteq', [8784]], ['doteqdot', [8785]], ['DotEqual', [8784]], ['dotminus', [8760]], ['dotplus', [8724]], ['dotsquare', [8865]], ['doublebarwedge', [8966]], ['DoubleContourIntegral', [8751]], ['DoubleDot', [168]], ['DoubleDownArrow', [8659]], ['DoubleLeftArrow', [8656]], ['DoubleLeftRightArrow', [8660]], ['DoubleLeftTee', [10980]], ['DoubleLongLeftArrow', [10232]], ['DoubleLongLeftRightArrow', [10234]], ['DoubleLongRightArrow', [10233]], ['DoubleRightArrow', [8658]], ['DoubleRightTee', [8872]], ['DoubleUpArrow', [8657]], ['DoubleUpDownArrow', [8661]], ['DoubleVerticalBar', [8741]], ['DownArrowBar', [10515]], ['downarrow', [8595]], ['DownArrow', [8595]], ['Downarrow', [8659]], ['DownArrowUpArrow', [8693]], ['DownBreve', [785]], ['downdownarrows', [8650]], ['downharpoonleft', [8643]], ['downharpoonright', [8642]], ['DownLeftRightVector', [10576]], ['DownLeftTeeVector', [10590]], ['DownLeftVectorBar', [10582]], ['DownLeftVector', [8637]], ['DownRightTeeVector', [10591]], ['DownRightVectorBar', [10583]], ['DownRightVector', [8641]], ['DownTeeArrow', [8615]], ['DownTee', [8868]], ['drbkarow', [10512]], ['drcorn', [8991]], ['drcrop', [8972]], ['Dscr', [119967]], ['dscr', [119993]], ['DScy', [1029]], ['dscy', [1109]], ['dsol', [10742]], ['Dstrok', [272]], ['dstrok', [273]], ['dtdot', [8945]], ['dtri', [9663]], ['dtrif', [9662]], ['duarr', [8693]], ['duhar', [10607]], ['dwangle', [10662]], ['DZcy', [1039]], ['dzcy', [1119]], ['dzigrarr', [10239]], ['Eacute', [201]], ['eacute', [233]], ['easter', [10862]], ['Ecaron', [282]], ['ecaron', [283]], ['Ecirc', [202]], ['ecirc', [234]], ['ecir', [8790]], ['ecolon', [8789]], ['Ecy', [1069]], ['ecy', [1101]], ['eDDot', [10871]], ['Edot', [278]], ['edot', [279]], ['eDot', [8785]], ['ee', [8519]], ['efDot', [8786]], ['Efr', [120072]], ['efr', [120098]], ['eg', [10906]], ['Egrave', [200]], ['egrave', [232]], ['egs', [10902]], ['egsdot', [10904]], ['el', [10905]], ['Element', [8712]], ['elinters', [9191]], ['ell', [8467]], ['els', [10901]], ['elsdot', [10903]], ['Emacr', [274]], ['emacr', [275]], ['empty', [8709]], ['emptyset', [8709]], ['EmptySmallSquare', [9723]], ['emptyv', [8709]], ['EmptyVerySmallSquare', [9643]], ['emsp13', [8196]], ['emsp14', [8197]], ['emsp', [8195]], ['ENG', [330]], ['eng', [331]], ['ensp', [8194]], ['Eogon', [280]], ['eogon', [281]], ['Eopf', [120124]], ['eopf', [120150]], ['epar', [8917]], ['eparsl', [10723]], ['eplus', [10865]], ['epsi', [949]], ['Epsilon', [917]], ['epsilon', [949]], ['epsiv', [1013]], ['eqcirc', [8790]], ['eqcolon', [8789]], ['eqsim', [8770]], ['eqslantgtr', [10902]], ['eqslantless', [10901]], ['Equal', [10869]], ['equals', [61]], ['EqualTilde', [8770]], ['equest', [8799]], ['Equilibrium', [8652]], ['equiv', [8801]], ['equivDD', [10872]], ['eqvparsl', [10725]], ['erarr', [10609]], ['erDot', [8787]], ['escr', [8495]], ['Escr', [8496]], ['esdot', [8784]], ['Esim', [10867]], ['esim', [8770]], ['Eta', [919]], ['eta', [951]], ['ETH', [208]], ['eth', [240]], ['Euml', [203]], ['euml', [235]], ['euro', [8364]], ['excl', [33]], ['exist', [8707]], ['Exists', [8707]], ['expectation', [8496]], ['exponentiale', [8519]], ['ExponentialE', [8519]], ['fallingdotseq', [8786]], ['Fcy', [1060]], ['fcy', [1092]], ['female', [9792]], ['ffilig', [64259]], ['fflig', [64256]], ['ffllig', [64260]], ['Ffr', [120073]], ['ffr', [120099]], ['filig', [64257]], ['FilledSmallSquare', [9724]], ['FilledVerySmallSquare', [9642]], ['fjlig', [102, 106]], ['flat', [9837]], ['fllig', [64258]], ['fltns', [9649]], ['fnof', [402]], ['Fopf', [120125]], ['fopf', [120151]], ['forall', [8704]], ['ForAll', [8704]], ['fork', [8916]], ['forkv', [10969]], ['Fouriertrf', [8497]], ['fpartint', [10765]], ['frac12', [189]], ['frac13', [8531]], ['frac14', [188]], ['frac15', [8533]], ['frac16', [8537]], ['frac18', [8539]], ['frac23', [8532]], ['frac25', [8534]], ['frac34', [190]], ['frac35', [8535]], ['frac38', [8540]], ['frac45', [8536]], ['frac56', [8538]], ['frac58', [8541]], ['frac78', [8542]], ['frasl', [8260]], ['frown', [8994]], ['fscr', [119995]], ['Fscr', [8497]], ['gacute', [501]], ['Gamma', [915]], ['gamma', [947]], ['Gammad', [988]], ['gammad', [989]], ['gap', [10886]], ['Gbreve', [286]], ['gbreve', [287]], ['Gcedil', [290]], ['Gcirc', [284]], ['gcirc', [285]], ['Gcy', [1043]], ['gcy', [1075]], ['Gdot', [288]], ['gdot', [289]], ['ge', [8805]], ['gE', [8807]], ['gEl', [10892]], ['gel', [8923]], ['geq', [8805]], ['geqq', [8807]], ['geqslant', [10878]], ['gescc', [10921]], ['ges', [10878]], ['gesdot', [10880]], ['gesdoto', [10882]], ['gesdotol', [10884]], ['gesl', [8923, 65024]], ['gesles', [10900]], ['Gfr', [120074]], ['gfr', [120100]], ['gg', [8811]], ['Gg', [8921]], ['ggg', [8921]], ['gimel', [8503]], ['GJcy', [1027]], ['gjcy', [1107]], ['gla', [10917]], ['gl', [8823]], ['glE', [10898]], ['glj', [10916]], ['gnap', [10890]], ['gnapprox', [10890]], ['gne', [10888]], ['gnE', [8809]], ['gneq', [10888]], ['gneqq', [8809]], ['gnsim', [8935]], ['Gopf', [120126]], ['gopf', [120152]], ['grave', [96]], ['GreaterEqual', [8805]], ['GreaterEqualLess', [8923]], ['GreaterFullEqual', [8807]], ['GreaterGreater', [10914]], ['GreaterLess', [8823]], ['GreaterSlantEqual', [10878]], ['GreaterTilde', [8819]], ['Gscr', [119970]], ['gscr', [8458]], ['gsim', [8819]], ['gsime', [10894]], ['gsiml', [10896]], ['gtcc', [10919]], ['gtcir', [10874]], ['gt', [62]], ['GT', [62]], ['Gt', [8811]], ['gtdot', [8919]], ['gtlPar', [10645]], ['gtquest', [10876]], ['gtrapprox', [10886]], ['gtrarr', [10616]], ['gtrdot', [8919]], ['gtreqless', [8923]], ['gtreqqless', [10892]], ['gtrless', [8823]], ['gtrsim', [8819]], ['gvertneqq', [8809, 65024]], ['gvnE', [8809, 65024]], ['Hacek', [711]], ['hairsp', [8202]], ['half', [189]], ['hamilt', [8459]], ['HARDcy', [1066]], ['hardcy', [1098]], ['harrcir', [10568]], ['harr', [8596]], ['hArr', [8660]], ['harrw', [8621]], ['Hat', [94]], ['hbar', [8463]], ['Hcirc', [292]], ['hcirc', [293]], ['hearts', [9829]], ['heartsuit', [9829]], ['hellip', [8230]], ['hercon', [8889]], ['hfr', [120101]], ['Hfr', [8460]], ['HilbertSpace', [8459]], ['hksearow', [10533]], ['hkswarow', [10534]], ['hoarr', [8703]], ['homtht', [8763]], ['hookleftarrow', [8617]], ['hookrightarrow', [8618]], ['hopf', [120153]], ['Hopf', [8461]], ['horbar', [8213]], ['HorizontalLine', [9472]], ['hscr', [119997]], ['Hscr', [8459]], ['hslash', [8463]], ['Hstrok', [294]], ['hstrok', [295]], ['HumpDownHump', [8782]], ['HumpEqual', [8783]], ['hybull', [8259]], ['hyphen', [8208]], ['Iacute', [205]], ['iacute', [237]], ['ic', [8291]], ['Icirc', [206]], ['icirc', [238]], ['Icy', [1048]], ['icy', [1080]], ['Idot', [304]], ['IEcy', [1045]], ['iecy', [1077]], ['iexcl', [161]], ['iff', [8660]], ['ifr', [120102]], ['Ifr', [8465]], ['Igrave', [204]], ['igrave', [236]], ['ii', [8520]], ['iiiint', [10764]], ['iiint', [8749]], ['iinfin', [10716]], ['iiota', [8489]], ['IJlig', [306]], ['ijlig', [307]], ['Imacr', [298]], ['imacr', [299]], ['image', [8465]], ['ImaginaryI', [8520]], ['imagline', [8464]], ['imagpart', [8465]], ['imath', [305]], ['Im', [8465]], ['imof', [8887]], ['imped', [437]], ['Implies', [8658]], ['incare', [8453]], ['in', [8712]], ['infin', [8734]], ['infintie', [10717]], ['inodot', [305]], ['intcal', [8890]], ['int', [8747]], ['Int', [8748]], ['integers', [8484]], ['Integral', [8747]], ['intercal', [8890]], ['Intersection', [8898]], ['intlarhk', [10775]], ['intprod', [10812]], ['InvisibleComma', [8291]], ['InvisibleTimes', [8290]], ['IOcy', [1025]], ['iocy', [1105]], ['Iogon', [302]], ['iogon', [303]], ['Iopf', [120128]], ['iopf', [120154]], ['Iota', [921]], ['iota', [953]], ['iprod', [10812]], ['iquest', [191]], ['iscr', [119998]], ['Iscr', [8464]], ['isin', [8712]], ['isindot', [8949]], ['isinE', [8953]], ['isins', [8948]], ['isinsv', [8947]], ['isinv', [8712]], ['it', [8290]], ['Itilde', [296]], ['itilde', [297]], ['Iukcy', [1030]], ['iukcy', [1110]], ['Iuml', [207]], ['iuml', [239]], ['Jcirc', [308]], ['jcirc', [309]], ['Jcy', [1049]], ['jcy', [1081]], ['Jfr', [120077]], ['jfr', [120103]], ['jmath', [567]], ['Jopf', [120129]], ['jopf', [120155]], ['Jscr', [119973]], ['jscr', [119999]], ['Jsercy', [1032]], ['jsercy', [1112]], ['Jukcy', [1028]], ['jukcy', [1108]], ['Kappa', [922]], ['kappa', [954]], ['kappav', [1008]], ['Kcedil', [310]], ['kcedil', [311]], ['Kcy', [1050]], ['kcy', [1082]], ['Kfr', [120078]], ['kfr', [120104]], ['kgreen', [312]], ['KHcy', [1061]], ['khcy', [1093]], ['KJcy', [1036]], ['kjcy', [1116]], ['Kopf', [120130]], ['kopf', [120156]], ['Kscr', [119974]], ['kscr', [120000]], ['lAarr', [8666]], ['Lacute', [313]], ['lacute', [314]], ['laemptyv', [10676]], ['lagran', [8466]], ['Lambda', [923]], ['lambda', [955]], ['lang', [10216]], ['Lang', [10218]], ['langd', [10641]], ['langle', [10216]], ['lap', [10885]], ['Laplacetrf', [8466]], ['laquo', [171]], ['larrb', [8676]], ['larrbfs', [10527]], ['larr', [8592]], ['Larr', [8606]], ['lArr', [8656]], ['larrfs', [10525]], ['larrhk', [8617]], ['larrlp', [8619]], ['larrpl', [10553]], ['larrsim', [10611]], ['larrtl', [8610]], ['latail', [10521]], ['lAtail', [10523]], ['lat', [10923]], ['late', [10925]], ['lates', [10925, 65024]], ['lbarr', [10508]], ['lBarr', [10510]], ['lbbrk', [10098]], ['lbrace', [123]], ['lbrack', [91]], ['lbrke', [10635]], ['lbrksld', [10639]], ['lbrkslu', [10637]], ['Lcaron', [317]], ['lcaron', [318]], ['Lcedil', [315]], ['lcedil', [316]], ['lceil', [8968]], ['lcub', [123]], ['Lcy', [1051]], ['lcy', [1083]], ['ldca', [10550]], ['ldquo', [8220]], ['ldquor', [8222]], ['ldrdhar', [10599]], ['ldrushar', [10571]], ['ldsh', [8626]], ['le', [8804]], ['lE', [8806]], ['LeftAngleBracket', [10216]], ['LeftArrowBar', [8676]], ['leftarrow', [8592]], ['LeftArrow', [8592]], ['Leftarrow', [8656]], ['LeftArrowRightArrow', [8646]], ['leftarrowtail', [8610]], ['LeftCeiling', [8968]], ['LeftDoubleBracket', [10214]], ['LeftDownTeeVector', [10593]], ['LeftDownVectorBar', [10585]], ['LeftDownVector', [8643]], ['LeftFloor', [8970]], ['leftharpoondown', [8637]], ['leftharpoonup', [8636]], ['leftleftarrows', [8647]], ['leftrightarrow', [8596]], ['LeftRightArrow', [8596]], ['Leftrightarrow', [8660]], ['leftrightarrows', [8646]], ['leftrightharpoons', [8651]], ['leftrightsquigarrow', [8621]], ['LeftRightVector', [10574]], ['LeftTeeArrow', [8612]], ['LeftTee', [8867]], ['LeftTeeVector', [10586]], ['leftthreetimes', [8907]], ['LeftTriangleBar', [10703]], ['LeftTriangle', [8882]], ['LeftTriangleEqual', [8884]], ['LeftUpDownVector', [10577]], ['LeftUpTeeVector', [10592]], ['LeftUpVectorBar', [10584]], ['LeftUpVector', [8639]], ['LeftVectorBar', [10578]], ['LeftVector', [8636]], ['lEg', [10891]], ['leg', [8922]], ['leq', [8804]], ['leqq', [8806]], ['leqslant', [10877]], ['lescc', [10920]], ['les', [10877]], ['lesdot', [10879]], ['lesdoto', [10881]], ['lesdotor', [10883]], ['lesg', [8922, 65024]], ['lesges', [10899]], ['lessapprox', [10885]], ['lessdot', [8918]], ['lesseqgtr', [8922]], ['lesseqqgtr', [10891]], ['LessEqualGreater', [8922]], ['LessFullEqual', [8806]], ['LessGreater', [8822]], ['lessgtr', [8822]], ['LessLess', [10913]], ['lesssim', [8818]], ['LessSlantEqual', [10877]], ['LessTilde', [8818]], ['lfisht', [10620]], ['lfloor', [8970]], ['Lfr', [120079]], ['lfr', [120105]], ['lg', [8822]], ['lgE', [10897]], ['lHar', [10594]], ['lhard', [8637]], ['lharu', [8636]], ['lharul', [10602]], ['lhblk', [9604]], ['LJcy', [1033]], ['ljcy', [1113]], ['llarr', [8647]], ['ll', [8810]], ['Ll', [8920]], ['llcorner', [8990]], ['Lleftarrow', [8666]], ['llhard', [10603]], ['lltri', [9722]], ['Lmidot', [319]], ['lmidot', [320]], ['lmoustache', [9136]], ['lmoust', [9136]], ['lnap', [10889]], ['lnapprox', [10889]], ['lne', [10887]], ['lnE', [8808]], ['lneq', [10887]], ['lneqq', [8808]], ['lnsim', [8934]], ['loang', [10220]], ['loarr', [8701]], ['lobrk', [10214]], ['longleftarrow', [10229]], ['LongLeftArrow', [10229]], ['Longleftarrow', [10232]], ['longleftrightarrow', [10231]], ['LongLeftRightArrow', [10231]], ['Longleftrightarrow', [10234]], ['longmapsto', [10236]], ['longrightarrow', [10230]], ['LongRightArrow', [10230]], ['Longrightarrow', [10233]], ['looparrowleft', [8619]], ['looparrowright', [8620]], ['lopar', [10629]], ['Lopf', [120131]], ['lopf', [120157]], ['loplus', [10797]], ['lotimes', [10804]], ['lowast', [8727]], ['lowbar', [95]], ['LowerLeftArrow', [8601]], ['LowerRightArrow', [8600]], ['loz', [9674]], ['lozenge', [9674]], ['lozf', [10731]], ['lpar', [40]], ['lparlt', [10643]], ['lrarr', [8646]], ['lrcorner', [8991]], ['lrhar', [8651]], ['lrhard', [10605]], ['lrm', [8206]], ['lrtri', [8895]], ['lsaquo', [8249]], ['lscr', [120001]], ['Lscr', [8466]], ['lsh', [8624]], ['Lsh', [8624]], ['lsim', [8818]], ['lsime', [10893]], ['lsimg', [10895]], ['lsqb', [91]], ['lsquo', [8216]], ['lsquor', [8218]], ['Lstrok', [321]], ['lstrok', [322]], ['ltcc', [10918]], ['ltcir', [10873]], ['lt', [60]], ['LT', [60]], ['Lt', [8810]], ['ltdot', [8918]], ['lthree', [8907]], ['ltimes', [8905]], ['ltlarr', [10614]], ['ltquest', [10875]], ['ltri', [9667]], ['ltrie', [8884]], ['ltrif', [9666]], ['ltrPar', [10646]], ['lurdshar', [10570]], ['luruhar', [10598]], ['lvertneqq', [8808, 65024]], ['lvnE', [8808, 65024]], ['macr', [175]], ['male', [9794]], ['malt', [10016]], ['maltese', [10016]], ['Map', [10501]], ['map', [8614]], ['mapsto', [8614]], ['mapstodown', [8615]], ['mapstoleft', [8612]], ['mapstoup', [8613]], ['marker', [9646]], ['mcomma', [10793]], ['Mcy', [1052]], ['mcy', [1084]], ['mdash', [8212]], ['mDDot', [8762]], ['measuredangle', [8737]], ['MediumSpace', [8287]], ['Mellintrf', [8499]], ['Mfr', [120080]], ['mfr', [120106]], ['mho', [8487]], ['micro', [181]], ['midast', [42]], ['midcir', [10992]], ['mid', [8739]], ['middot', [183]], ['minusb', [8863]], ['minus', [8722]], ['minusd', [8760]], ['minusdu', [10794]], ['MinusPlus', [8723]], ['mlcp', [10971]], ['mldr', [8230]], ['mnplus', [8723]], ['models', [8871]], ['Mopf', [120132]], ['mopf', [120158]], ['mp', [8723]], ['mscr', [120002]], ['Mscr', [8499]], ['mstpos', [8766]], ['Mu', [924]], ['mu', [956]], ['multimap', [8888]], ['mumap', [8888]], ['nabla', [8711]], ['Nacute', [323]], ['nacute', [324]], ['nang', [8736, 8402]], ['nap', [8777]], ['napE', [10864, 824]], ['napid', [8779, 824]], ['napos', [329]], ['napprox', [8777]], ['natural', [9838]], ['naturals', [8469]], ['natur', [9838]], ['nbsp', [160]], ['nbump', [8782, 824]], ['nbumpe', [8783, 824]], ['ncap', [10819]], ['Ncaron', [327]], ['ncaron', [328]], ['Ncedil', [325]], ['ncedil', [326]], ['ncong', [8775]], ['ncongdot', [10861, 824]], ['ncup', [10818]], ['Ncy', [1053]], ['ncy', [1085]], ['ndash', [8211]], ['nearhk', [10532]], ['nearr', [8599]], ['neArr', [8663]], ['nearrow', [8599]], ['ne', [8800]], ['nedot', [8784, 824]], ['NegativeMediumSpace', [8203]], ['NegativeThickSpace', [8203]], ['NegativeThinSpace', [8203]], ['NegativeVeryThinSpace', [8203]], ['nequiv', [8802]], ['nesear', [10536]], ['nesim', [8770, 824]], ['NestedGreaterGreater', [8811]], ['NestedLessLess', [8810]], ['nexist', [8708]], ['nexists', [8708]], ['Nfr', [120081]], ['nfr', [120107]], ['ngE', [8807, 824]], ['nge', [8817]], ['ngeq', [8817]], ['ngeqq', [8807, 824]], ['ngeqslant', [10878, 824]], ['nges', [10878, 824]], ['nGg', [8921, 824]], ['ngsim', [8821]], ['nGt', [8811, 8402]], ['ngt', [8815]], ['ngtr', [8815]], ['nGtv', [8811, 824]], ['nharr', [8622]], ['nhArr', [8654]], ['nhpar', [10994]], ['ni', [8715]], ['nis', [8956]], ['nisd', [8954]], ['niv', [8715]], ['NJcy', [1034]], ['njcy', [1114]], ['nlarr', [8602]], ['nlArr', [8653]], ['nldr', [8229]], ['nlE', [8806, 824]], ['nle', [8816]], ['nleftarrow', [8602]], ['nLeftarrow', [8653]], ['nleftrightarrow', [8622]], ['nLeftrightarrow', [8654]], ['nleq', [8816]], ['nleqq', [8806, 824]], ['nleqslant', [10877, 824]], ['nles', [10877, 824]], ['nless', [8814]], ['nLl', [8920, 824]], ['nlsim', [8820]], ['nLt', [8810, 8402]], ['nlt', [8814]], ['nltri', [8938]], ['nltrie', [8940]], ['nLtv', [8810, 824]], ['nmid', [8740]], ['NoBreak', [8288]], ['NonBreakingSpace', [160]], ['nopf', [120159]], ['Nopf', [8469]], ['Not', [10988]], ['not', [172]], ['NotCongruent', [8802]], ['NotCupCap', [8813]], ['NotDoubleVerticalBar', [8742]], ['NotElement', [8713]], ['NotEqual', [8800]], ['NotEqualTilde', [8770, 824]], ['NotExists', [8708]], ['NotGreater', [8815]], ['NotGreaterEqual', [8817]], ['NotGreaterFullEqual', [8807, 824]], ['NotGreaterGreater', [8811, 824]], ['NotGreaterLess', [8825]], ['NotGreaterSlantEqual', [10878, 824]], ['NotGreaterTilde', [8821]], ['NotHumpDownHump', [8782, 824]], ['NotHumpEqual', [8783, 824]], ['notin', [8713]], ['notindot', [8949, 824]], ['notinE', [8953, 824]], ['notinva', [8713]], ['notinvb', [8951]], ['notinvc', [8950]], ['NotLeftTriangleBar', [10703, 824]], ['NotLeftTriangle', [8938]], ['NotLeftTriangleEqual', [8940]], ['NotLess', [8814]], ['NotLessEqual', [8816]], ['NotLessGreater', [8824]], ['NotLessLess', [8810, 824]], ['NotLessSlantEqual', [10877, 824]], ['NotLessTilde', [8820]], ['NotNestedGreaterGreater', [10914, 824]], ['NotNestedLessLess', [10913, 824]], ['notni', [8716]], ['notniva', [8716]], ['notnivb', [8958]], ['notnivc', [8957]], ['NotPrecedes', [8832]], ['NotPrecedesEqual', [10927, 824]], ['NotPrecedesSlantEqual', [8928]], ['NotReverseElement', [8716]], ['NotRightTriangleBar', [10704, 824]], ['NotRightTriangle', [8939]], ['NotRightTriangleEqual', [8941]], ['NotSquareSubset', [8847, 824]], ['NotSquareSubsetEqual', [8930]], ['NotSquareSuperset', [8848, 824]], ['NotSquareSupersetEqual', [8931]], ['NotSubset', [8834, 8402]], ['NotSubsetEqual', [8840]], ['NotSucceeds', [8833]], ['NotSucceedsEqual', [10928, 824]], ['NotSucceedsSlantEqual', [8929]], ['NotSucceedsTilde', [8831, 824]], ['NotSuperset', [8835, 8402]], ['NotSupersetEqual', [8841]], ['NotTilde', [8769]], ['NotTildeEqual', [8772]], ['NotTildeFullEqual', [8775]], ['NotTildeTilde', [8777]], ['NotVerticalBar', [8740]], ['nparallel', [8742]], ['npar', [8742]], ['nparsl', [11005, 8421]], ['npart', [8706, 824]], ['npolint', [10772]], ['npr', [8832]], ['nprcue', [8928]], ['nprec', [8832]], ['npreceq', [10927, 824]], ['npre', [10927, 824]], ['nrarrc', [10547, 824]], ['nrarr', [8603]], ['nrArr', [8655]], ['nrarrw', [8605, 824]], ['nrightarrow', [8603]], ['nRightarrow', [8655]], ['nrtri', [8939]], ['nrtrie', [8941]], ['nsc', [8833]], ['nsccue', [8929]], ['nsce', [10928, 824]], ['Nscr', [119977]], ['nscr', [120003]], ['nshortmid', [8740]], ['nshortparallel', [8742]], ['nsim', [8769]], ['nsime', [8772]], ['nsimeq', [8772]], ['nsmid', [8740]], ['nspar', [8742]], ['nsqsube', [8930]], ['nsqsupe', [8931]], ['nsub', [8836]], ['nsubE', [10949, 824]], ['nsube', [8840]], ['nsubset', [8834, 8402]], ['nsubseteq', [8840]], ['nsubseteqq', [10949, 824]], ['nsucc', [8833]], ['nsucceq', [10928, 824]], ['nsup', [8837]], ['nsupE', [10950, 824]], ['nsupe', [8841]], ['nsupset', [8835, 8402]], ['nsupseteq', [8841]], ['nsupseteqq', [10950, 824]], ['ntgl', [8825]], ['Ntilde', [209]], ['ntilde', [241]], ['ntlg', [8824]], ['ntriangleleft', [8938]], ['ntrianglelefteq', [8940]], ['ntriangleright', [8939]], ['ntrianglerighteq', [8941]], ['Nu', [925]], ['nu', [957]], ['num', [35]], ['numero', [8470]], ['numsp', [8199]], ['nvap', [8781, 8402]], ['nvdash', [8876]], ['nvDash', [8877]], ['nVdash', [8878]], ['nVDash', [8879]], ['nvge', [8805, 8402]], ['nvgt', [62, 8402]], ['nvHarr', [10500]], ['nvinfin', [10718]], ['nvlArr', [10498]], ['nvle', [8804, 8402]], ['nvlt', [60, 8402]], ['nvltrie', [8884, 8402]], ['nvrArr', [10499]], ['nvrtrie', [8885, 8402]], ['nvsim', [8764, 8402]], ['nwarhk', [10531]], ['nwarr', [8598]], ['nwArr', [8662]], ['nwarrow', [8598]], ['nwnear', [10535]], ['Oacute', [211]], ['oacute', [243]], ['oast', [8859]], ['Ocirc', [212]], ['ocirc', [244]], ['ocir', [8858]], ['Ocy', [1054]], ['ocy', [1086]], ['odash', [8861]], ['Odblac', [336]], ['odblac', [337]], ['odiv', [10808]], ['odot', [8857]], ['odsold', [10684]], ['OElig', [338]], ['oelig', [339]], ['ofcir', [10687]], ['Ofr', [120082]], ['ofr', [120108]], ['ogon', [731]], ['Ograve', [210]], ['ograve', [242]], ['ogt', [10689]], ['ohbar', [10677]], ['ohm', [937]], ['oint', [8750]], ['olarr', [8634]], ['olcir', [10686]], ['olcross', [10683]], ['oline', [8254]], ['olt', [10688]], ['Omacr', [332]], ['omacr', [333]], ['Omega', [937]], ['omega', [969]], ['Omicron', [927]], ['omicron', [959]], ['omid', [10678]], ['ominus', [8854]], ['Oopf', [120134]], ['oopf', [120160]], ['opar', [10679]], ['OpenCurlyDoubleQuote', [8220]], ['OpenCurlyQuote', [8216]], ['operp', [10681]], ['oplus', [8853]], ['orarr', [8635]], ['Or', [10836]], ['or', [8744]], ['ord', [10845]], ['order', [8500]], ['orderof', [8500]], ['ordf', [170]], ['ordm', [186]], ['origof', [8886]], ['oror', [10838]], ['orslope', [10839]], ['orv', [10843]], ['oS', [9416]], ['Oscr', [119978]], ['oscr', [8500]], ['Oslash', [216]], ['oslash', [248]], ['osol', [8856]], ['Otilde', [213]], ['otilde', [245]], ['otimesas', [10806]], ['Otimes', [10807]], ['otimes', [8855]], ['Ouml', [214]], ['ouml', [246]], ['ovbar', [9021]], ['OverBar', [8254]], ['OverBrace', [9182]], ['OverBracket', [9140]], ['OverParenthesis', [9180]], ['para', [182]], ['parallel', [8741]], ['par', [8741]], ['parsim', [10995]], ['parsl', [11005]], ['part', [8706]], ['PartialD', [8706]], ['Pcy', [1055]], ['pcy', [1087]], ['percnt', [37]], ['period', [46]], ['permil', [8240]], ['perp', [8869]], ['pertenk', [8241]], ['Pfr', [120083]], ['pfr', [120109]], ['Phi', [934]], ['phi', [966]], ['phiv', [981]], ['phmmat', [8499]], ['phone', [9742]], ['Pi', [928]], ['pi', [960]], ['pitchfork', [8916]], ['piv', [982]], ['planck', [8463]], ['planckh', [8462]], ['plankv', [8463]], ['plusacir', [10787]], ['plusb', [8862]], ['pluscir', [10786]], ['plus', [43]], ['plusdo', [8724]], ['plusdu', [10789]], ['pluse', [10866]], ['PlusMinus', [177]], ['plusmn', [177]], ['plussim', [10790]], ['plustwo', [10791]], ['pm', [177]], ['Poincareplane', [8460]], ['pointint', [10773]], ['popf', [120161]], ['Popf', [8473]], ['pound', [163]], ['prap', [10935]], ['Pr', [10939]], ['pr', [8826]], ['prcue', [8828]], ['precapprox', [10935]], ['prec', [8826]], ['preccurlyeq', [8828]], ['Precedes', [8826]], ['PrecedesEqual', [10927]], ['PrecedesSlantEqual', [8828]], ['PrecedesTilde', [8830]], ['preceq', [10927]], ['precnapprox', [10937]], ['precneqq', [10933]], ['precnsim', [8936]], ['pre', [10927]], ['prE', [10931]], ['precsim', [8830]], ['prime', [8242]], ['Prime', [8243]], ['primes', [8473]], ['prnap', [10937]], ['prnE', [10933]], ['prnsim', [8936]], ['prod', [8719]], ['Product', [8719]], ['profalar', [9006]], ['profline', [8978]], ['profsurf', [8979]], ['prop', [8733]], ['Proportional', [8733]], ['Proportion', [8759]], ['propto', [8733]], ['prsim', [8830]], ['prurel', [8880]], ['Pscr', [119979]], ['pscr', [120005]], ['Psi', [936]], ['psi', [968]], ['puncsp', [8200]], ['Qfr', [120084]], ['qfr', [120110]], ['qint', [10764]], ['qopf', [120162]], ['Qopf', [8474]], ['qprime', [8279]], ['Qscr', [119980]], ['qscr', [120006]], ['quaternions', [8461]], ['quatint', [10774]], ['quest', [63]], ['questeq', [8799]], ['quot', [34]], ['QUOT', [34]], ['rAarr', [8667]], ['race', [8765, 817]], ['Racute', [340]], ['racute', [341]], ['radic', [8730]], ['raemptyv', [10675]], ['rang', [10217]], ['Rang', [10219]], ['rangd', [10642]], ['range', [10661]], ['rangle', [10217]], ['raquo', [187]], ['rarrap', [10613]], ['rarrb', [8677]], ['rarrbfs', [10528]], ['rarrc', [10547]], ['rarr', [8594]], ['Rarr', [8608]], ['rArr', [8658]], ['rarrfs', [10526]], ['rarrhk', [8618]], ['rarrlp', [8620]], ['rarrpl', [10565]], ['rarrsim', [10612]], ['Rarrtl', [10518]], ['rarrtl', [8611]], ['rarrw', [8605]], ['ratail', [10522]], ['rAtail', [10524]], ['ratio', [8758]], ['rationals', [8474]], ['rbarr', [10509]], ['rBarr', [10511]], ['RBarr', [10512]], ['rbbrk', [10099]], ['rbrace', [125]], ['rbrack', [93]], ['rbrke', [10636]], ['rbrksld', [10638]], ['rbrkslu', [10640]], ['Rcaron', [344]], ['rcaron', [345]], ['Rcedil', [342]], ['rcedil', [343]], ['rceil', [8969]], ['rcub', [125]], ['Rcy', [1056]], ['rcy', [1088]], ['rdca', [10551]], ['rdldhar', [10601]], ['rdquo', [8221]], ['rdquor', [8221]], ['CloseCurlyDoubleQuote', [8221]], ['rdsh', [8627]], ['real', [8476]], ['realine', [8475]], ['realpart', [8476]], ['reals', [8477]], ['Re', [8476]], ['rect', [9645]], ['reg', [174]], ['REG', [174]], ['ReverseElement', [8715]], ['ReverseEquilibrium', [8651]], ['ReverseUpEquilibrium', [10607]], ['rfisht', [10621]], ['rfloor', [8971]], ['rfr', [120111]], ['Rfr', [8476]], ['rHar', [10596]], ['rhard', [8641]], ['rharu', [8640]], ['rharul', [10604]], ['Rho', [929]], ['rho', [961]], ['rhov', [1009]], ['RightAngleBracket', [10217]], ['RightArrowBar', [8677]], ['rightarrow', [8594]], ['RightArrow', [8594]], ['Rightarrow', [8658]], ['RightArrowLeftArrow', [8644]], ['rightarrowtail', [8611]], ['RightCeiling', [8969]], ['RightDoubleBracket', [10215]], ['RightDownTeeVector', [10589]], ['RightDownVectorBar', [10581]], ['RightDownVector', [8642]], ['RightFloor', [8971]], ['rightharpoondown', [8641]], ['rightharpoonup', [8640]], ['rightleftarrows', [8644]], ['rightleftharpoons', [8652]], ['rightrightarrows', [8649]], ['rightsquigarrow', [8605]], ['RightTeeArrow', [8614]], ['RightTee', [8866]], ['RightTeeVector', [10587]], ['rightthreetimes', [8908]], ['RightTriangleBar', [10704]], ['RightTriangle', [8883]], ['RightTriangleEqual', [8885]], ['RightUpDownVector', [10575]], ['RightUpTeeVector', [10588]], ['RightUpVectorBar', [10580]], ['RightUpVector', [8638]], ['RightVectorBar', [10579]], ['RightVector', [8640]], ['ring', [730]], ['risingdotseq', [8787]], ['rlarr', [8644]], ['rlhar', [8652]], ['rlm', [8207]], ['rmoustache', [9137]], ['rmoust', [9137]], ['rnmid', [10990]], ['roang', [10221]], ['roarr', [8702]], ['robrk', [10215]], ['ropar', [10630]], ['ropf', [120163]], ['Ropf', [8477]], ['roplus', [10798]], ['rotimes', [10805]], ['RoundImplies', [10608]], ['rpar', [41]], ['rpargt', [10644]], ['rppolint', [10770]], ['rrarr', [8649]], ['Rrightarrow', [8667]], ['rsaquo', [8250]], ['rscr', [120007]], ['Rscr', [8475]], ['rsh', [8625]], ['Rsh', [8625]], ['rsqb', [93]], ['rsquo', [8217]], ['rsquor', [8217]], ['CloseCurlyQuote', [8217]], ['rthree', [8908]], ['rtimes', [8906]], ['rtri', [9657]], ['rtrie', [8885]], ['rtrif', [9656]], ['rtriltri', [10702]], ['RuleDelayed', [10740]], ['ruluhar', [10600]], ['rx', [8478]], ['Sacute', [346]], ['sacute', [347]], ['sbquo', [8218]], ['scap', [10936]], ['Scaron', [352]], ['scaron', [353]], ['Sc', [10940]], ['sc', [8827]], ['sccue', [8829]], ['sce', [10928]], ['scE', [10932]], ['Scedil', [350]], ['scedil', [351]], ['Scirc', [348]], ['scirc', [349]], ['scnap', [10938]], ['scnE', [10934]], ['scnsim', [8937]], ['scpolint', [10771]], ['scsim', [8831]], ['Scy', [1057]], ['scy', [1089]], ['sdotb', [8865]], ['sdot', [8901]], ['sdote', [10854]], ['searhk', [10533]], ['searr', [8600]], ['seArr', [8664]], ['searrow', [8600]], ['sect', [167]], ['semi', [59]], ['seswar', [10537]], ['setminus', [8726]], ['setmn', [8726]], ['sext', [10038]], ['Sfr', [120086]], ['sfr', [120112]], ['sfrown', [8994]], ['sharp', [9839]], ['SHCHcy', [1065]], ['shchcy', [1097]], ['SHcy', [1064]], ['shcy', [1096]], ['ShortDownArrow', [8595]], ['ShortLeftArrow', [8592]], ['shortmid', [8739]], ['shortparallel', [8741]], ['ShortRightArrow', [8594]], ['ShortUpArrow', [8593]], ['shy', [173]], ['Sigma', [931]], ['sigma', [963]], ['sigmaf', [962]], ['sigmav', [962]], ['sim', [8764]], ['simdot', [10858]], ['sime', [8771]], ['simeq', [8771]], ['simg', [10910]], ['simgE', [10912]], ['siml', [10909]], ['simlE', [10911]], ['simne', [8774]], ['simplus', [10788]], ['simrarr', [10610]], ['slarr', [8592]], ['SmallCircle', [8728]], ['smallsetminus', [8726]], ['smashp', [10803]], ['smeparsl', [10724]], ['smid', [8739]], ['smile', [8995]], ['smt', [10922]], ['smte', [10924]], ['smtes', [10924, 65024]], ['SOFTcy', [1068]], ['softcy', [1100]], ['solbar', [9023]], ['solb', [10692]], ['sol', [47]], ['Sopf', [120138]], ['sopf', [120164]], ['spades', [9824]], ['spadesuit', [9824]], ['spar', [8741]], ['sqcap', [8851]], ['sqcaps', [8851, 65024]], ['sqcup', [8852]], ['sqcups', [8852, 65024]], ['Sqrt', [8730]], ['sqsub', [8847]], ['sqsube', [8849]], ['sqsubset', [8847]], ['sqsubseteq', [8849]], ['sqsup', [8848]], ['sqsupe', [8850]], ['sqsupset', [8848]], ['sqsupseteq', [8850]], ['square', [9633]], ['Square', [9633]], ['SquareIntersection', [8851]], ['SquareSubset', [8847]], ['SquareSubsetEqual', [8849]], ['SquareSuperset', [8848]], ['SquareSupersetEqual', [8850]], ['SquareUnion', [8852]], ['squarf', [9642]], ['squ', [9633]], ['squf', [9642]], ['srarr', [8594]], ['Sscr', [119982]], ['sscr', [120008]], ['ssetmn', [8726]], ['ssmile', [8995]], ['sstarf', [8902]], ['Star', [8902]], ['star', [9734]], ['starf', [9733]], ['straightepsilon', [1013]], ['straightphi', [981]], ['strns', [175]], ['sub', [8834]], ['Sub', [8912]], ['subdot', [10941]], ['subE', [10949]], ['sube', [8838]], ['subedot', [10947]], ['submult', [10945]], ['subnE', [10955]], ['subne', [8842]], ['subplus', [10943]], ['subrarr', [10617]], ['subset', [8834]], ['Subset', [8912]], ['subseteq', [8838]], ['subseteqq', [10949]], ['SubsetEqual', [8838]], ['subsetneq', [8842]], ['subsetneqq', [10955]], ['subsim', [10951]], ['subsub', [10965]], ['subsup', [10963]], ['succapprox', [10936]], ['succ', [8827]], ['succcurlyeq', [8829]], ['Succeeds', [8827]], ['SucceedsEqual', [10928]], ['SucceedsSlantEqual', [8829]], ['SucceedsTilde', [8831]], ['succeq', [10928]], ['succnapprox', [10938]], ['succneqq', [10934]], ['succnsim', [8937]], ['succsim', [8831]], ['SuchThat', [8715]], ['sum', [8721]], ['Sum', [8721]], ['sung', [9834]], ['sup1', [185]], ['sup2', [178]], ['sup3', [179]], ['sup', [8835]], ['Sup', [8913]], ['supdot', [10942]], ['supdsub', [10968]], ['supE', [10950]], ['supe', [8839]], ['supedot', [10948]], ['Superset', [8835]], ['SupersetEqual', [8839]], ['suphsol', [10185]], ['suphsub', [10967]], ['suplarr', [10619]], ['supmult', [10946]], ['supnE', [10956]], ['supne', [8843]], ['supplus', [10944]], ['supset', [8835]], ['Supset', [8913]], ['supseteq', [8839]], ['supseteqq', [10950]], ['supsetneq', [8843]], ['supsetneqq', [10956]], ['supsim', [10952]], ['supsub', [10964]], ['supsup', [10966]], ['swarhk', [10534]], ['swarr', [8601]], ['swArr', [8665]], ['swarrow', [8601]], ['swnwar', [10538]], ['szlig', [223]], ['Tab', [9]], ['target', [8982]], ['Tau', [932]], ['tau', [964]], ['tbrk', [9140]], ['Tcaron', [356]], ['tcaron', [357]], ['Tcedil', [354]], ['tcedil', [355]], ['Tcy', [1058]], ['tcy', [1090]], ['tdot', [8411]], ['telrec', [8981]], ['Tfr', [120087]], ['tfr', [120113]], ['there4', [8756]], ['therefore', [8756]], ['Therefore', [8756]], ['Theta', [920]], ['theta', [952]], ['thetasym', [977]], ['thetav', [977]], ['thickapprox', [8776]], ['thicksim', [8764]], ['ThickSpace', [8287, 8202]], ['ThinSpace', [8201]], ['thinsp', [8201]], ['thkap', [8776]], ['thksim', [8764]], ['THORN', [222]], ['thorn', [254]], ['tilde', [732]], ['Tilde', [8764]], ['TildeEqual', [8771]], ['TildeFullEqual', [8773]], ['TildeTilde', [8776]], ['timesbar', [10801]], ['timesb', [8864]], ['times', [215]], ['timesd', [10800]], ['tint', [8749]], ['toea', [10536]], ['topbot', [9014]], ['topcir', [10993]], ['top', [8868]], ['Topf', [120139]], ['topf', [120165]], ['topfork', [10970]], ['tosa', [10537]], ['tprime', [8244]], ['trade', [8482]], ['TRADE', [8482]], ['triangle', [9653]], ['triangledown', [9663]], ['triangleleft', [9667]], ['trianglelefteq', [8884]], ['triangleq', [8796]], ['triangleright', [9657]], ['trianglerighteq', [8885]], ['tridot', [9708]], ['trie', [8796]], ['triminus', [10810]], ['TripleDot', [8411]], ['triplus', [10809]], ['trisb', [10701]], ['tritime', [10811]], ['trpezium', [9186]], ['Tscr', [119983]], ['tscr', [120009]], ['TScy', [1062]], ['tscy', [1094]], ['TSHcy', [1035]], ['tshcy', [1115]], ['Tstrok', [358]], ['tstrok', [359]], ['twixt', [8812]], ['twoheadleftarrow', [8606]], ['twoheadrightarrow', [8608]], ['Uacute', [218]], ['uacute', [250]], ['uarr', [8593]], ['Uarr', [8607]], ['uArr', [8657]], ['Uarrocir', [10569]], ['Ubrcy', [1038]], ['ubrcy', [1118]], ['Ubreve', [364]], ['ubreve', [365]], ['Ucirc', [219]], ['ucirc', [251]], ['Ucy', [1059]], ['ucy', [1091]], ['udarr', [8645]], ['Udblac', [368]], ['udblac', [369]], ['udhar', [10606]], ['ufisht', [10622]], ['Ufr', [120088]], ['ufr', [120114]], ['Ugrave', [217]], ['ugrave', [249]], ['uHar', [10595]], ['uharl', [8639]], ['uharr', [8638]], ['uhblk', [9600]], ['ulcorn', [8988]], ['ulcorner', [8988]], ['ulcrop', [8975]], ['ultri', [9720]], ['Umacr', [362]], ['umacr', [363]], ['uml', [168]], ['UnderBar', [95]], ['UnderBrace', [9183]], ['UnderBracket', [9141]], ['UnderParenthesis', [9181]], ['Union', [8899]], ['UnionPlus', [8846]], ['Uogon', [370]], ['uogon', [371]], ['Uopf', [120140]], ['uopf', [120166]], ['UpArrowBar', [10514]], ['uparrow', [8593]], ['UpArrow', [8593]], ['Uparrow', [8657]], ['UpArrowDownArrow', [8645]], ['updownarrow', [8597]], ['UpDownArrow', [8597]], ['Updownarrow', [8661]], ['UpEquilibrium', [10606]], ['upharpoonleft', [8639]], ['upharpoonright', [8638]], ['uplus', [8846]], ['UpperLeftArrow', [8598]], ['UpperRightArrow', [8599]], ['upsi', [965]], ['Upsi', [978]], ['upsih', [978]], ['Upsilon', [933]], ['upsilon', [965]], ['UpTeeArrow', [8613]], ['UpTee', [8869]], ['upuparrows', [8648]], ['urcorn', [8989]], ['urcorner', [8989]], ['urcrop', [8974]], ['Uring', [366]], ['uring', [367]], ['urtri', [9721]], ['Uscr', [119984]], ['uscr', [120010]], ['utdot', [8944]], ['Utilde', [360]], ['utilde', [361]], ['utri', [9653]], ['utrif', [9652]], ['uuarr', [8648]], ['Uuml', [220]], ['uuml', [252]], ['uwangle', [10663]], ['vangrt', [10652]], ['varepsilon', [1013]], ['varkappa', [1008]], ['varnothing', [8709]], ['varphi', [981]], ['varpi', [982]], ['varpropto', [8733]], ['varr', [8597]], ['vArr', [8661]], ['varrho', [1009]], ['varsigma', [962]], ['varsubsetneq', [8842, 65024]], ['varsubsetneqq', [10955, 65024]], ['varsupsetneq', [8843, 65024]], ['varsupsetneqq', [10956, 65024]], ['vartheta', [977]], ['vartriangleleft', [8882]], ['vartriangleright', [8883]], ['vBar', [10984]], ['Vbar', [10987]], ['vBarv', [10985]], ['Vcy', [1042]], ['vcy', [1074]], ['vdash', [8866]], ['vDash', [8872]], ['Vdash', [8873]], ['VDash', [8875]], ['Vdashl', [10982]], ['veebar', [8891]], ['vee', [8744]], ['Vee', [8897]], ['veeeq', [8794]], ['vellip', [8942]], ['verbar', [124]], ['Verbar', [8214]], ['vert', [124]], ['Vert', [8214]], ['VerticalBar', [8739]], ['VerticalLine', [124]], ['VerticalSeparator', [10072]], ['VerticalTilde', [8768]], ['VeryThinSpace', [8202]], ['Vfr', [120089]], ['vfr', [120115]], ['vltri', [8882]], ['vnsub', [8834, 8402]], ['vnsup', [8835, 8402]], ['Vopf', [120141]], ['vopf', [120167]], ['vprop', [8733]], ['vrtri', [8883]], ['Vscr', [119985]], ['vscr', [120011]], ['vsubnE', [10955, 65024]], ['vsubne', [8842, 65024]], ['vsupnE', [10956, 65024]], ['vsupne', [8843, 65024]], ['Vvdash', [8874]], ['vzigzag', [10650]], ['Wcirc', [372]], ['wcirc', [373]], ['wedbar', [10847]], ['wedge', [8743]], ['Wedge', [8896]], ['wedgeq', [8793]], ['weierp', [8472]], ['Wfr', [120090]], ['wfr', [120116]], ['Wopf', [120142]], ['wopf', [120168]], ['wp', [8472]], ['wr', [8768]], ['wreath', [8768]], ['Wscr', [119986]], ['wscr', [120012]], ['xcap', [8898]], ['xcirc', [9711]], ['xcup', [8899]], ['xdtri', [9661]], ['Xfr', [120091]], ['xfr', [120117]], ['xharr', [10231]], ['xhArr', [10234]], ['Xi', [926]], ['xi', [958]], ['xlarr', [10229]], ['xlArr', [10232]], ['xmap', [10236]], ['xnis', [8955]], ['xodot', [10752]], ['Xopf', [120143]], ['xopf', [120169]], ['xoplus', [10753]], ['xotime', [10754]], ['xrarr', [10230]], ['xrArr', [10233]], ['Xscr', [119987]], ['xscr', [120013]], ['xsqcup', [10758]], ['xuplus', [10756]], ['xutri', [9651]], ['xvee', [8897]], ['xwedge', [8896]], ['Yacute', [221]], ['yacute', [253]], ['YAcy', [1071]], ['yacy', [1103]], ['Ycirc', [374]], ['ycirc', [375]], ['Ycy', [1067]], ['ycy', [1099]], ['yen', [165]], ['Yfr', [120092]], ['yfr', [120118]], ['YIcy', [1031]], ['yicy', [1111]], ['Yopf', [120144]], ['yopf', [120170]], ['Yscr', [119988]], ['yscr', [120014]], ['YUcy', [1070]], ['yucy', [1102]], ['yuml', [255]], ['Yuml', [376]], ['Zacute', [377]], ['zacute', [378]], ['Zcaron', [381]], ['zcaron', [382]], ['Zcy', [1047]], ['zcy', [1079]], ['Zdot', [379]], ['zdot', [380]], ['zeetrf', [8488]], ['ZeroWidthSpace', [8203]], ['Zeta', [918]], ['zeta', [950]], ['zfr', [120119]], ['Zfr', [8488]], ['ZHcy', [1046]], ['zhcy', [1078]], ['zigrarr', [8669]], ['zopf', [120171]], ['Zopf', [8484]], ['Zscr', [119989]], ['zscr', [120015]], ['zwj', [8205]], ['zwnj', [8204]]];

var alphaIndex = {};
var charIndex = {};

createIndexes(alphaIndex, charIndex);

/**
 * @constructor
 */
function Html5Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1) === 'x' ?
                parseInt(entity.substr(2).toLowerCase(), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.decode = function(str) {
    return new Html5Entities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var charInfo = charIndex[str.charCodeAt(i)];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        result += str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encode = function(str) {
    return new Html5Entities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var charInfo = charIndex[c];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonUTF = function(str) {
    return new Html5Entities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonASCII = function(str) {
    return new Html5Entities().encodeNonASCII(str);
 };

/**
 * @param {Object} alphaIndex Passed by reference.
 * @param {Object} charIndex Passed by reference.
 */
function createIndexes(alphaIndex, charIndex) {
    var i = ENTITIES.length;
    var _results = [];
    while (i--) {
        var e = ENTITIES[i];
        var alpha = e[0];
        var chars = e[1];
        var chr = chars[0];
        var addChar = (chr < 32 || chr > 126) || chr === 62 || chr === 60 || chr === 38 || chr === 34 || chr === 39;
        var charInfo;
        if (addChar) {
            charInfo = charIndex[chr] = charIndex[chr] || {};
        }
        if (chars[1]) {
            var chr2 = chars[1];
            alphaIndex[alpha] = String.fromCharCode(chr) + String.fromCharCode(chr2);
            _results.push(addChar && (charInfo[chr2] = alpha));
        } else {
            alphaIndex[alpha] = String.fromCharCode(chr);
            _results.push(addChar && (charInfo[''] = alpha));
        }
    }
}

module.exports = Html5Entities;


/***/ }),

/***/ "../node_modules/html-entities/lib/xml-entities.js":
/***/ (function(module, exports) {

var ALPHA_INDEX = {
    '&lt': '<',
    '&gt': '>',
    '&quot': '"',
    '&apos': '\'',
    '&amp': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': '\'',
    '&amp;': '&'
};

var CHAR_INDEX = {
    60: 'lt',
    62: 'gt',
    34: 'quot',
    39: 'apos',
    38: 'amp'
};

var CHAR_S_INDEX = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&apos;',
    '&': '&amp;'
};

/**
 * @constructor
 */
function XmlEntities() {}

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/<|>|"|'|&/g, function(s) {
        return CHAR_S_INDEX[s];
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encode = function(str) {
    return new XmlEntities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&#?[0-9a-zA-Z]+;?/g, function(s) {
        if (s.charAt(1) === '#') {
            var code = s.charAt(2).toLowerCase() === 'x' ?
                parseInt(s.substr(3), 16) :
                parseInt(s.substr(2));

            if (isNaN(code) || code < -32768 || code > 65535) {
                return '';
            }
            return String.fromCharCode(code);
        }
        return ALPHA_INDEX[s] || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.decode = function(str) {
    return new XmlEntities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var alpha = CHAR_INDEX[c];
        if (alpha) {
            result += "&" + alpha + ";";
            i++;
            continue;
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonUTF = function(str) {
    return new XmlEntities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLenght = str.length;
    var result = '';
    var i = 0;
    while (i < strLenght) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonASCII = function(str) {
    return new XmlEntities().encodeNonASCII(str);
 };

module.exports = XmlEntities;


/***/ }),

/***/ "../node_modules/inherits/inherits_browser.js":
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),

/***/ "../node_modules/is-extendable/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * is-extendable <https://github.com/jonschlinkert/is-extendable>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */



module.exports = function isExtendable(val) {
  return typeof val !== 'undefined' && val !== null
    && (typeof val === 'object' || typeof val === 'function');
};


/***/ }),

/***/ "../node_modules/json3/lib/json3.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*! JSON v3.3.2 | http://bestiejs.github.io/json3 | Copyright 2012-2014, Kit Cambridge | http://kit.mit-license.org */
;(function () {
  // Detect the `define` function exposed by asynchronous module loaders. The
  // strict `define` check is necessary for compatibility with `r.js`.
  var isLoader = "function" === "function" && __webpack_require__("../node_modules/webpack/buildin/amd-options.js");

  // A set of types used to distinguish objects from primitives.
  var objectTypes = {
    "function": true,
    "object": true
  };

  // Detect the `exports` object exposed by CommonJS implementations.
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  // Use the `global` object exposed by Node (including Browserify via
  // `insert-module-globals`), Narwhal, and Ringo as the default context,
  // and the `window` object in browsers. Rhino exports a `global` function
  // instead.
  var root = objectTypes[typeof window] && window || this,
      freeGlobal = freeExports && objectTypes[typeof module] && module && !module.nodeType && typeof global == "object" && global;

  if (freeGlobal && (freeGlobal["global"] === freeGlobal || freeGlobal["window"] === freeGlobal || freeGlobal["self"] === freeGlobal)) {
    root = freeGlobal;
  }

  // Public: Initializes JSON 3 using the given `context` object, attaching the
  // `stringify` and `parse` functions to the specified `exports` object.
  function runInContext(context, exports) {
    context || (context = root["Object"]());
    exports || (exports = root["Object"]());

    // Native constructor aliases.
    var Number = context["Number"] || root["Number"],
        String = context["String"] || root["String"],
        Object = context["Object"] || root["Object"],
        Date = context["Date"] || root["Date"],
        SyntaxError = context["SyntaxError"] || root["SyntaxError"],
        TypeError = context["TypeError"] || root["TypeError"],
        Math = context["Math"] || root["Math"],
        nativeJSON = context["JSON"] || root["JSON"];

    // Delegate to the native `stringify` and `parse` implementations.
    if (typeof nativeJSON == "object" && nativeJSON) {
      exports.stringify = nativeJSON.stringify;
      exports.parse = nativeJSON.parse;
    }

    // Convenience aliases.
    var objectProto = Object.prototype,
        getClass = objectProto.toString,
        isProperty, forEach, undef;

    // Test the `Date#getUTC*` methods. Based on work by @Yaffle.
    var isExtended = new Date(-3509827334573292);
    try {
      // The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
      // results for certain dates in Opera >= 10.53.
      isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&
        // Safari < 2.0.2 stores the internal millisecond time value correctly,
        // but clips the values returned by the date methods to the range of
        // signed 32-bit integers ([-2 ** 31, 2 ** 31 - 1]).
        isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
    } catch (exception) {}

    // Internal: Determines whether the native `JSON.stringify` and `parse`
    // implementations are spec-compliant. Based on work by Ken Snyder.
    function has(name) {
      if (has[name] !== undef) {
        // Return cached feature test result.
        return has[name];
      }
      var isSupported;
      if (name == "bug-string-char-index") {
        // IE <= 7 doesn't support accessing string characters using square
        // bracket notation. IE 8 only supports this for primitives.
        isSupported = "a"[0] != "a";
      } else if (name == "json") {
        // Indicates whether both `JSON.stringify` and `JSON.parse` are
        // supported.
        isSupported = has("json-stringify") && has("json-parse");
      } else {
        var value, serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
        // Test `JSON.stringify`.
        if (name == "json-stringify") {
          var stringify = exports.stringify, stringifySupported = typeof stringify == "function" && isExtended;
          if (stringifySupported) {
            // A test function object with a custom `toJSON` method.
            (value = function () {
              return 1;
            }).toJSON = value;
            try {
              stringifySupported =
                // Firefox 3.1b1 and b2 serialize string, number, and boolean
                // primitives as object literals.
                stringify(0) === "0" &&
                // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
                // literals.
                stringify(new Number()) === "0" &&
                stringify(new String()) == '""' &&
                // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
                // does not define a canonical JSON representation (this applies to
                // objects with `toJSON` properties as well, *unless* they are nested
                // within an object or array).
                stringify(getClass) === undef &&
                // IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
                // FF 3.1b3 pass this test.
                stringify(undef) === undef &&
                // Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
                // respectively, if the value is omitted entirely.
                stringify() === undef &&
                // FF 3.1b1, 2 throw an error if the given value is not a number,
                // string, array, object, Boolean, or `null` literal. This applies to
                // objects with custom `toJSON` methods as well, unless they are nested
                // inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
                // methods entirely.
                stringify(value) === "1" &&
                stringify([value]) == "[1]" &&
                // Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
                // `"[null]"`.
                stringify([undef]) == "[null]" &&
                // YUI 3.0.0b1 fails to serialize `null` literals.
                stringify(null) == "null" &&
                // FF 3.1b1, 2 halts serialization if an array contains a function:
                // `[1, true, getClass, 1]` serializes as "[1,true,],". FF 3.1b3
                // elides non-JSON values from objects and arrays, unless they
                // define custom `toJSON` methods.
                stringify([undef, getClass, null]) == "[null,null,null]" &&
                // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
                // where character escape codes are expected (e.g., `\b` => `\u0008`).
                stringify({ "a": [value, true, false, null, "\x00\b\n\f\r\t"] }) == serialized &&
                // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
                stringify(null, value) === "1" &&
                stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" &&
                // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
                // serialize extended years.
                stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
                // The milliseconds are optional in ES 5, but required in 5.1.
                stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
                // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
                // four-digit years instead of six-digit years. Credits: @Yaffle.
                stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
                // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
                // values less than 1000. Credits: @Yaffle.
                stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
            } catch (exception) {
              stringifySupported = false;
            }
          }
          isSupported = stringifySupported;
        }
        // Test `JSON.parse`.
        if (name == "json-parse") {
          var parse = exports.parse;
          if (typeof parse == "function") {
            try {
              // FF 3.1b1, b2 will throw an exception if a bare literal is provided.
              // Conforming implementations should also coerce the initial argument to
              // a string prior to parsing.
              if (parse("0") === 0 && !parse(false)) {
                // Simple parsing test.
                value = parse(serialized);
                var parseSupported = value["a"].length == 5 && value["a"][0] === 1;
                if (parseSupported) {
                  try {
                    // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
                    parseSupported = !parse('"\t"');
                  } catch (exception) {}
                  if (parseSupported) {
                    try {
                      // FF 4.0 and 4.0.1 allow leading `+` signs and leading
                      // decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow
                      // certain octal literals.
                      parseSupported = parse("01") !== 1;
                    } catch (exception) {}
                  }
                  if (parseSupported) {
                    try {
                      // FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal
                      // points. These environments, along with FF 3.1b1 and 2,
                      // also allow trailing commas in JSON objects and arrays.
                      parseSupported = parse("1.") !== 1;
                    } catch (exception) {}
                  }
                }
              }
            } catch (exception) {
              parseSupported = false;
            }
          }
          isSupported = parseSupported;
        }
      }
      return has[name] = !!isSupported;
    }

    if (!has("json")) {
      // Common `[[Class]]` name aliases.
      var functionClass = "[object Function]",
          dateClass = "[object Date]",
          numberClass = "[object Number]",
          stringClass = "[object String]",
          arrayClass = "[object Array]",
          booleanClass = "[object Boolean]";

      // Detect incomplete support for accessing string characters by index.
      var charIndexBuggy = has("bug-string-char-index");

      // Define additional utility methods if the `Date` methods are buggy.
      if (!isExtended) {
        var floor = Math.floor;
        // A mapping between the months of the year and the number of days between
        // January 1st and the first of the respective month.
        var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        // Internal: Calculates the number of days between the Unix epoch and the
        // first day of the given month.
        var getDay = function (year, month) {
          return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
        };
      }

      // Internal: Determines if a property is a direct property of the given
      // object. Delegates to the native `Object#hasOwnProperty` method.
      if (!(isProperty = objectProto.hasOwnProperty)) {
        isProperty = function (property) {
          var members = {}, constructor;
          if ((members.__proto__ = null, members.__proto__ = {
            // The *proto* property cannot be set multiple times in recent
            // versions of Firefox and SeaMonkey.
            "toString": 1
          }, members).toString != getClass) {
            // Safari <= 2.0.3 doesn't implement `Object#hasOwnProperty`, but
            // supports the mutable *proto* property.
            isProperty = function (property) {
              // Capture and break the object's prototype chain (see section 8.6.2
              // of the ES 5.1 spec). The parenthesized expression prevents an
              // unsafe transformation by the Closure Compiler.
              var original = this.__proto__, result = property in (this.__proto__ = null, this);
              // Restore the original prototype chain.
              this.__proto__ = original;
              return result;
            };
          } else {
            // Capture a reference to the top-level `Object` constructor.
            constructor = members.constructor;
            // Use the `constructor` property to simulate `Object#hasOwnProperty` in
            // other environments.
            isProperty = function (property) {
              var parent = (this.constructor || constructor).prototype;
              return property in this && !(property in parent && this[property] === parent[property]);
            };
          }
          members = null;
          return isProperty.call(this, property);
        };
      }

      // Internal: Normalizes the `for...in` iteration algorithm across
      // environments. Each enumerated key is yielded to a `callback` function.
      forEach = function (object, callback) {
        var size = 0, Properties, members, property;

        // Tests for bugs in the current environment's `for...in` algorithm. The
        // `valueOf` property inherits the non-enumerable flag from
        // `Object.prototype` in older versions of IE, Netscape, and Mozilla.
        (Properties = function () {
          this.valueOf = 0;
        }).prototype.valueOf = 0;

        // Iterate over a new instance of the `Properties` class.
        members = new Properties();
        for (property in members) {
          // Ignore all properties inherited from `Object.prototype`.
          if (isProperty.call(members, property)) {
            size++;
          }
        }
        Properties = members = null;

        // Normalize the iteration algorithm.
        if (!size) {
          // A list of non-enumerable properties inherited from `Object.prototype`.
          members = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
          // IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
          // properties.
          forEach = function (object, callback) {
            var isFunction = getClass.call(object) == functionClass, property, length;
            var hasProperty = !isFunction && typeof object.constructor != "function" && objectTypes[typeof object.hasOwnProperty] && object.hasOwnProperty || isProperty;
            for (property in object) {
              // Gecko <= 1.0 enumerates the `prototype` property of functions under
              // certain conditions; IE does not.
              if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
                callback(property);
              }
            }
            // Manually invoke the callback for each non-enumerable property.
            for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property));
          };
        } else if (size == 2) {
          // Safari <= 2.0.4 enumerates shadowed properties twice.
          forEach = function (object, callback) {
            // Create a set of iterated properties.
            var members = {}, isFunction = getClass.call(object) == functionClass, property;
            for (property in object) {
              // Store each property name to prevent double enumeration. The
              // `prototype` property of functions is not enumerated due to cross-
              // environment inconsistencies.
              if (!(isFunction && property == "prototype") && !isProperty.call(members, property) && (members[property] = 1) && isProperty.call(object, property)) {
                callback(property);
              }
            }
          };
        } else {
          // No bugs detected; use the standard `for...in` algorithm.
          forEach = function (object, callback) {
            var isFunction = getClass.call(object) == functionClass, property, isConstructor;
            for (property in object) {
              if (!(isFunction && property == "prototype") && isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
                callback(property);
              }
            }
            // Manually invoke the callback for the `constructor` property due to
            // cross-environment inconsistencies.
            if (isConstructor || isProperty.call(object, (property = "constructor"))) {
              callback(property);
            }
          };
        }
        return forEach(object, callback);
      };

      // Public: Serializes a JavaScript `value` as a JSON string. The optional
      // `filter` argument may specify either a function that alters how object and
      // array members are serialized, or an array of strings and numbers that
      // indicates which properties should be serialized. The optional `width`
      // argument may be either a string or number that specifies the indentation
      // level of the output.
      if (!has("json-stringify")) {
        // Internal: A map of control characters and their escaped equivalents.
        var Escapes = {
          92: "\\\\",
          34: '\\"',
          8: "\\b",
          12: "\\f",
          10: "\\n",
          13: "\\r",
          9: "\\t"
        };

        // Internal: Converts `value` into a zero-padded string such that its
        // length is at least equal to `width`. The `width` must be <= 6.
        var leadingZeroes = "000000";
        var toPaddedString = function (width, value) {
          // The `|| 0` expression is necessary to work around a bug in
          // Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
          return (leadingZeroes + (value || 0)).slice(-width);
        };

        // Internal: Double-quotes a string `value`, replacing all ASCII control
        // characters (characters with code unit values between 0 and 31) with
        // their escaped equivalents. This is an implementation of the
        // `Quote(value)` operation defined in ES 5.1 section 15.12.3.
        var unicodePrefix = "\\u00";
        var quote = function (value) {
          var result = '"', index = 0, length = value.length, useCharIndex = !charIndexBuggy || length > 10;
          var symbols = useCharIndex && (charIndexBuggy ? value.split("") : value);
          for (; index < length; index++) {
            var charCode = value.charCodeAt(index);
            // If the character is a control character, append its Unicode or
            // shorthand escape sequence; otherwise, append the character as-is.
            switch (charCode) {
              case 8: case 9: case 10: case 12: case 13: case 34: case 92:
                result += Escapes[charCode];
                break;
              default:
                if (charCode < 32) {
                  result += unicodePrefix + toPaddedString(2, charCode.toString(16));
                  break;
                }
                result += useCharIndex ? symbols[index] : value.charAt(index);
            }
          }
          return result + '"';
        };

        // Internal: Recursively serializes an object. Implements the
        // `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
        var serialize = function (property, object, callback, properties, whitespace, indentation, stack) {
          var value, className, year, month, date, time, hours, minutes, seconds, milliseconds, results, element, index, length, prefix, result;
          try {
            // Necessary for host object support.
            value = object[property];
          } catch (exception) {}
          if (typeof value == "object" && value) {
            className = getClass.call(value);
            if (className == dateClass && !isProperty.call(value, "toJSON")) {
              if (value > -1 / 0 && value < 1 / 0) {
                // Dates are serialized according to the `Date#toJSON` method
                // specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
                // for the ISO 8601 date time string format.
                if (getDay) {
                  // Manually compute the year, month, date, hours, minutes,
                  // seconds, and milliseconds if the `getUTC*` methods are
                  // buggy. Adapted from @Yaffle's `date-shim` project.
                  date = floor(value / 864e5);
                  for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++);
                  for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++);
                  date = 1 + date - getDay(year, month);
                  // The `time` value specifies the time within the day (see ES
                  // 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
                  // to compute `A modulo B`, as the `%` operator does not
                  // correspond to the `modulo` operation for negative numbers.
                  time = (value % 864e5 + 864e5) % 864e5;
                  // The hours, minutes, seconds, and milliseconds are obtained by
                  // decomposing the time within the day. See section 15.9.1.10.
                  hours = floor(time / 36e5) % 24;
                  minutes = floor(time / 6e4) % 60;
                  seconds = floor(time / 1e3) % 60;
                  milliseconds = time % 1e3;
                } else {
                  year = value.getUTCFullYear();
                  month = value.getUTCMonth();
                  date = value.getUTCDate();
                  hours = value.getUTCHours();
                  minutes = value.getUTCMinutes();
                  seconds = value.getUTCSeconds();
                  milliseconds = value.getUTCMilliseconds();
                }
                // Serialize extended years correctly.
                value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) +
                  "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) +
                  // Months, dates, hours, minutes, and seconds should have two
                  // digits; milliseconds should have three.
                  "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) +
                  // Milliseconds are optional in ES 5.0, but required in 5.1.
                  "." + toPaddedString(3, milliseconds) + "Z";
              } else {
                value = null;
              }
            } else if (typeof value.toJSON == "function" && ((className != numberClass && className != stringClass && className != arrayClass) || isProperty.call(value, "toJSON"))) {
              // Prototype <= 1.6.1 adds non-standard `toJSON` methods to the
              // `Number`, `String`, `Date`, and `Array` prototypes. JSON 3
              // ignores all `toJSON` methods on these objects unless they are
              // defined directly on an instance.
              value = value.toJSON(property);
            }
          }
          if (callback) {
            // If a replacement function was provided, call it to obtain the value
            // for serialization.
            value = callback.call(object, property, value);
          }
          if (value === null) {
            return "null";
          }
          className = getClass.call(value);
          if (className == booleanClass) {
            // Booleans are represented literally.
            return "" + value;
          } else if (className == numberClass) {
            // JSON numbers must be finite. `Infinity` and `NaN` are serialized as
            // `"null"`.
            return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
          } else if (className == stringClass) {
            // Strings are double-quoted and escaped.
            return quote("" + value);
          }
          // Recursively serialize objects and arrays.
          if (typeof value == "object") {
            // Check for cyclic structures. This is a linear search; performance
            // is inversely proportional to the number of unique nested objects.
            for (length = stack.length; length--;) {
              if (stack[length] === value) {
                // Cyclic structures cannot be serialized by `JSON.stringify`.
                throw TypeError();
              }
            }
            // Add the object to the stack of traversed objects.
            stack.push(value);
            results = [];
            // Save the current indentation level and indent one additional level.
            prefix = indentation;
            indentation += whitespace;
            if (className == arrayClass) {
              // Recursively serialize array elements.
              for (index = 0, length = value.length; index < length; index++) {
                element = serialize(index, value, callback, properties, whitespace, indentation, stack);
                results.push(element === undef ? "null" : element);
              }
              result = results.length ? (whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : ("[" + results.join(",") + "]")) : "[]";
            } else {
              // Recursively serialize object members. Members are selected from
              // either a user-specified list of property names, or the object
              // itself.
              forEach(properties || value, function (property) {
                var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
                if (element !== undef) {
                  // According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
                  // is not the empty string, let `member` {quote(property) + ":"}
                  // be the concatenation of `member` and the `space` character."
                  // The "`space` character" refers to the literal space
                  // character, not the `space` {width} argument provided to
                  // `JSON.stringify`.
                  results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
                }
              });
              result = results.length ? (whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : ("{" + results.join(",") + "}")) : "{}";
            }
            // Remove the object from the traversed object stack.
            stack.pop();
            return result;
          }
        };

        // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
        exports.stringify = function (source, filter, width) {
          var whitespace, callback, properties, className;
          if (objectTypes[typeof filter] && filter) {
            if ((className = getClass.call(filter)) == functionClass) {
              callback = filter;
            } else if (className == arrayClass) {
              // Convert the property names array into a makeshift set.
              properties = {};
              for (var index = 0, length = filter.length, value; index < length; value = filter[index++], ((className = getClass.call(value)), className == stringClass || className == numberClass) && (properties[value] = 1));
            }
          }
          if (width) {
            if ((className = getClass.call(width)) == numberClass) {
              // Convert the `width` to an integer and create a string containing
              // `width` number of space characters.
              if ((width -= width % 1) > 0) {
                for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " ");
              }
            } else if (className == stringClass) {
              whitespace = width.length <= 10 ? width : width.slice(0, 10);
            }
          }
          // Opera <= 7.54u2 discards the values associated with empty string keys
          // (`""`) only if they are used directly within an object member list
          // (e.g., `!("" in { "": 1})`).
          return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
        };
      }

      // Public: Parses a JSON source string.
      if (!has("json-parse")) {
        var fromCharCode = String.fromCharCode;

        // Internal: A map of escaped control characters and their unescaped
        // equivalents.
        var Unescapes = {
          92: "\\",
          34: '"',
          47: "/",
          98: "\b",
          116: "\t",
          110: "\n",
          102: "\f",
          114: "\r"
        };

        // Internal: Stores the parser state.
        var Index, Source;

        // Internal: Resets the parser state and throws a `SyntaxError`.
        var abort = function () {
          Index = Source = null;
          throw SyntaxError();
        };

        // Internal: Returns the next token, or `"$"` if the parser has reached
        // the end of the source string. A token may be a string, number, `null`
        // literal, or Boolean literal.
        var lex = function () {
          var source = Source, length = source.length, value, begin, position, isSigned, charCode;
          while (Index < length) {
            charCode = source.charCodeAt(Index);
            switch (charCode) {
              case 9: case 10: case 13: case 32:
                // Skip whitespace tokens, including tabs, carriage returns, line
                // feeds, and space characters.
                Index++;
                break;
              case 123: case 125: case 91: case 93: case 58: case 44:
                // Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
                // the current position.
                value = charIndexBuggy ? source.charAt(Index) : source[Index];
                Index++;
                return value;
              case 34:
                // `"` delimits a JSON string; advance to the next character and
                // begin parsing the string. String tokens are prefixed with the
                // sentinel `@` character to distinguish them from punctuators and
                // end-of-string tokens.
                for (value = "@", Index++; Index < length;) {
                  charCode = source.charCodeAt(Index);
                  if (charCode < 32) {
                    // Unescaped ASCII control characters (those with a code unit
                    // less than the space character) are not permitted.
                    abort();
                  } else if (charCode == 92) {
                    // A reverse solidus (`\`) marks the beginning of an escaped
                    // control character (including `"`, `\`, and `/`) or Unicode
                    // escape sequence.
                    charCode = source.charCodeAt(++Index);
                    switch (charCode) {
                      case 92: case 34: case 47: case 98: case 116: case 110: case 102: case 114:
                        // Revive escaped control characters.
                        value += Unescapes[charCode];
                        Index++;
                        break;
                      case 117:
                        // `\u` marks the beginning of a Unicode escape sequence.
                        // Advance to the first character and validate the
                        // four-digit code point.
                        begin = ++Index;
                        for (position = Index + 4; Index < position; Index++) {
                          charCode = source.charCodeAt(Index);
                          // A valid sequence comprises four hexdigits (case-
                          // insensitive) that form a single hexadecimal value.
                          if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
                            // Invalid Unicode escape sequence.
                            abort();
                          }
                        }
                        // Revive the escaped character.
                        value += fromCharCode("0x" + source.slice(begin, Index));
                        break;
                      default:
                        // Invalid escape sequence.
                        abort();
                    }
                  } else {
                    if (charCode == 34) {
                      // An unescaped double-quote character marks the end of the
                      // string.
                      break;
                    }
                    charCode = source.charCodeAt(Index);
                    begin = Index;
                    // Optimize for the common case where a string is valid.
                    while (charCode >= 32 && charCode != 92 && charCode != 34) {
                      charCode = source.charCodeAt(++Index);
                    }
                    // Append the string as-is.
                    value += source.slice(begin, Index);
                  }
                }
                if (source.charCodeAt(Index) == 34) {
                  // Advance to the next character and return the revived string.
                  Index++;
                  return value;
                }
                // Unterminated string.
                abort();
              default:
                // Parse numbers and literals.
                begin = Index;
                // Advance past the negative sign, if one is specified.
                if (charCode == 45) {
                  isSigned = true;
                  charCode = source.charCodeAt(++Index);
                }
                // Parse an integer or floating-point value.
                if (charCode >= 48 && charCode <= 57) {
                  // Leading zeroes are interpreted as octal literals.
                  if (charCode == 48 && ((charCode = source.charCodeAt(Index + 1)), charCode >= 48 && charCode <= 57)) {
                    // Illegal octal literal.
                    abort();
                  }
                  isSigned = false;
                  // Parse the integer component.
                  for (; Index < length && ((charCode = source.charCodeAt(Index)), charCode >= 48 && charCode <= 57); Index++);
                  // Floats cannot contain a leading decimal point; however, this
                  // case is already accounted for by the parser.
                  if (source.charCodeAt(Index) == 46) {
                    position = ++Index;
                    // Parse the decimal component.
                    for (; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                    if (position == Index) {
                      // Illegal trailing decimal.
                      abort();
                    }
                    Index = position;
                  }
                  // Parse exponents. The `e` denoting the exponent is
                  // case-insensitive.
                  charCode = source.charCodeAt(Index);
                  if (charCode == 101 || charCode == 69) {
                    charCode = source.charCodeAt(++Index);
                    // Skip past the sign following the exponent, if one is
                    // specified.
                    if (charCode == 43 || charCode == 45) {
                      Index++;
                    }
                    // Parse the exponential component.
                    for (position = Index; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                    if (position == Index) {
                      // Illegal empty exponent.
                      abort();
                    }
                    Index = position;
                  }
                  // Coerce the parsed value to a JavaScript number.
                  return +source.slice(begin, Index);
                }
                // A negative sign may only precede numbers.
                if (isSigned) {
                  abort();
                }
                // `true`, `false`, and `null` literals.
                if (source.slice(Index, Index + 4) == "true") {
                  Index += 4;
                  return true;
                } else if (source.slice(Index, Index + 5) == "false") {
                  Index += 5;
                  return false;
                } else if (source.slice(Index, Index + 4) == "null") {
                  Index += 4;
                  return null;
                }
                // Unrecognized token.
                abort();
            }
          }
          // Return the sentinel `$` character if the parser has reached the end
          // of the source string.
          return "$";
        };

        // Internal: Parses a JSON `value` token.
        var get = function (value) {
          var results, hasMembers;
          if (value == "$") {
            // Unexpected end of input.
            abort();
          }
          if (typeof value == "string") {
            if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
              // Remove the sentinel `@` character.
              return value.slice(1);
            }
            // Parse object and array literals.
            if (value == "[") {
              // Parses a JSON array, returning a new JavaScript array.
              results = [];
              for (;; hasMembers || (hasMembers = true)) {
                value = lex();
                // A closing square bracket marks the end of the array literal.
                if (value == "]") {
                  break;
                }
                // If the array literal contains elements, the current token
                // should be a comma separating the previous element from the
                // next.
                if (hasMembers) {
                  if (value == ",") {
                    value = lex();
                    if (value == "]") {
                      // Unexpected trailing `,` in array literal.
                      abort();
                    }
                  } else {
                    // A `,` must separate each array element.
                    abort();
                  }
                }
                // Elisions and leading commas are not permitted.
                if (value == ",") {
                  abort();
                }
                results.push(get(value));
              }
              return results;
            } else if (value == "{") {
              // Parses a JSON object, returning a new JavaScript object.
              results = {};
              for (;; hasMembers || (hasMembers = true)) {
                value = lex();
                // A closing curly brace marks the end of the object literal.
                if (value == "}") {
                  break;
                }
                // If the object literal contains members, the current token
                // should be a comma separator.
                if (hasMembers) {
                  if (value == ",") {
                    value = lex();
                    if (value == "}") {
                      // Unexpected trailing `,` in object literal.
                      abort();
                    }
                  } else {
                    // A `,` must separate each object member.
                    abort();
                  }
                }
                // Leading commas are not permitted, object property names must be
                // double-quoted strings, and a `:` must separate each property
                // name and value.
                if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") {
                  abort();
                }
                results[value.slice(1)] = get(lex());
              }
              return results;
            }
            // Unexpected token encountered.
            abort();
          }
          return value;
        };

        // Internal: Updates a traversed object member.
        var update = function (source, property, callback) {
          var element = walk(source, property, callback);
          if (element === undef) {
            delete source[property];
          } else {
            source[property] = element;
          }
        };

        // Internal: Recursively traverses a parsed JSON object, invoking the
        // `callback` function for each value. This is an implementation of the
        // `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.
        var walk = function (source, property, callback) {
          var value = source[property], length;
          if (typeof value == "object" && value) {
            // `forEach` can't be used to traverse an array in Opera <= 8.54
            // because its `Object#hasOwnProperty` implementation returns `false`
            // for array indices (e.g., `![1, 2, 3].hasOwnProperty("0")`).
            if (getClass.call(value) == arrayClass) {
              for (length = value.length; length--;) {
                update(value, length, callback);
              }
            } else {
              forEach(value, function (property) {
                update(value, property, callback);
              });
            }
          }
          return callback.call(source, property, value);
        };

        // Public: `JSON.parse`. See ES 5.1 section 15.12.2.
        exports.parse = function (source, callback) {
          var result, value;
          Index = 0;
          Source = "" + source;
          result = get(lex());
          // If a JSON string contains multiple tokens, it is invalid.
          if (lex() != "$") {
            abort();
          }
          // Reset the parser state.
          Index = Source = null;
          return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result;
        };
      }
    }

    exports["runInContext"] = runInContext;
    return exports;
  }

  if (freeExports && !isLoader) {
    // Export for CommonJS environments.
    runInContext(root, freeExports);
  } else {
    // Export for web browsers and JavaScript engines.
    var nativeJSON = root.JSON,
        previousJSON = root["JSON3"],
        isRestored = false;

    var JSON3 = runInContext(root, (root["JSON3"] = {
      // Public: Restores the original value of the global `JSON` object and
      // returns a reference to the `JSON3` object.
      "noConflict": function () {
        if (!isRestored) {
          isRestored = true;
          root.JSON = nativeJSON;
          root["JSON3"] = previousJSON;
          nativeJSON = previousJSON = null;
        }
        return JSON3;
      }
    }));

    root.JSON = {
      "parse": JSON3.parse,
      "stringify": JSON3.stringify
    };
  }

  // Export for asynchronous module loaders.
  if (isLoader) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
      return JSON3;
    }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }
}).call(this);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module), __webpack_require__("../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../node_modules/json5/lib/json5.js":
/***/ (function(module, exports, __webpack_require__) {

// json5.js
// Modern JSON. See README.md for details.
//
// This file is based directly off of Douglas Crockford's json_parse.js:
// https://github.com/douglascrockford/JSON-js/blob/master/json_parse.js

var JSON5 = ( true ? exports : {});

JSON5.parse = (function () {
    "use strict";

// This is a function that can parse a JSON5 text, producing a JavaScript
// data structure. It is a simple, recursive descent parser. It does not use
// eval or regular expressions, so it can be used as a model for implementing
// a JSON5 parser in other languages.

// We are defining the function inside of another function to avoid creating
// global variables.

    var at,           // The index of the current character
        lineNumber,   // The current line number
        columnNumber, // The current column number
        ch,           // The current character
        escapee = {
            "'":  "'",
            '"':  '"',
            '\\': '\\',
            '/':  '/',
            '\n': '',       // Replace escaped newlines in strings w/ empty string
            b:    '\b',
            f:    '\f',
            n:    '\n',
            r:    '\r',
            t:    '\t'
        },
        ws = [
            ' ',
            '\t',
            '\r',
            '\n',
            '\v',
            '\f',
            '\xA0',
            '\uFEFF'
        ],
        text,

        renderChar = function (chr) {
            return chr === '' ? 'EOF' : "'" + chr + "'";
        },

        error = function (m) {

// Call error when something is wrong.

            var error = new SyntaxError();
            // beginning of message suffix to agree with that provided by Gecko - see https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
            error.message = m + " at line " + lineNumber + " column " + columnNumber + " of the JSON5 data. Still to read: " + JSON.stringify(text.substring(at - 1, at + 19));
            error.at = at;
            // These two property names have been chosen to agree with the ones in Gecko, the only popular
            // environment which seems to supply this info on JSON.parse
            error.lineNumber = lineNumber;
            error.columnNumber = columnNumber;
            throw error;
        },

        next = function (c) {

// If a c parameter is provided, verify that it matches the current character.

            if (c && c !== ch) {
                error("Expected " + renderChar(c) + " instead of " + renderChar(ch));
            }

// Get the next character. When there are no more characters,
// return the empty string.

            ch = text.charAt(at);
            at++;
            columnNumber++;
            if (ch === '\n' || ch === '\r' && peek() !== '\n') {
                lineNumber++;
                columnNumber = 0;
            }
            return ch;
        },

        peek = function () {

// Get the next character without consuming it or
// assigning it to the ch varaible.

            return text.charAt(at);
        },

        identifier = function () {

// Parse an identifier. Normally, reserved words are disallowed here, but we
// only use this for unquoted object keys, where reserved words are allowed,
// so we don't check for those here. References:
// - http://es5.github.com/#x7.6
// - https://developer.mozilla.org/en/Core_JavaScript_1.5_Guide/Core_Language_Features#Variables
// - http://docstore.mik.ua/orelly/webprog/jscript/ch02_07.htm
// TODO Identifiers can have Unicode "letters" in them; add support for those.

            var key = ch;

            // Identifiers must start with a letter, _ or $.
            if ((ch !== '_' && ch !== '$') &&
                    (ch < 'a' || ch > 'z') &&
                    (ch < 'A' || ch > 'Z')) {
                error("Bad identifier as unquoted key");
            }

            // Subsequent characters can contain digits.
            while (next() && (
                    ch === '_' || ch === '$' ||
                    (ch >= 'a' && ch <= 'z') ||
                    (ch >= 'A' && ch <= 'Z') ||
                    (ch >= '0' && ch <= '9'))) {
                key += ch;
            }

            return key;
        },

        number = function () {

// Parse a number value.

            var number,
                sign = '',
                string = '',
                base = 10;

            if (ch === '-' || ch === '+') {
                sign = ch;
                next(ch);
            }

            // support for Infinity (could tweak to allow other words):
            if (ch === 'I') {
                number = word();
                if (typeof number !== 'number' || isNaN(number)) {
                    error('Unexpected word for number');
                }
                return (sign === '-') ? -number : number;
            }

            // support for NaN
            if (ch === 'N' ) {
              number = word();
              if (!isNaN(number)) {
                error('expected word to be NaN');
              }
              // ignore sign as -NaN also is NaN
              return number;
            }

            if (ch === '0') {
                string += ch;
                next();
                if (ch === 'x' || ch === 'X') {
                    string += ch;
                    next();
                    base = 16;
                } else if (ch >= '0' && ch <= '9') {
                    error('Octal literal');
                }
            }

            switch (base) {
            case 10:
                while (ch >= '0' && ch <= '9' ) {
                    string += ch;
                    next();
                }
                if (ch === '.') {
                    string += '.';
                    while (next() && ch >= '0' && ch <= '9') {
                        string += ch;
                    }
                }
                if (ch === 'e' || ch === 'E') {
                    string += ch;
                    next();
                    if (ch === '-' || ch === '+') {
                        string += ch;
                        next();
                    }
                    while (ch >= '0' && ch <= '9') {
                        string += ch;
                        next();
                    }
                }
                break;
            case 16:
                while (ch >= '0' && ch <= '9' || ch >= 'A' && ch <= 'F' || ch >= 'a' && ch <= 'f') {
                    string += ch;
                    next();
                }
                break;
            }

            if(sign === '-') {
                number = -string;
            } else {
                number = +string;
            }

            if (!isFinite(number)) {
                error("Bad number");
            } else {
                return number;
            }
        },

        string = function () {

// Parse a string value.

            var hex,
                i,
                string = '',
                delim,      // double quote or single quote
                uffff;

// When parsing for string values, we must look for ' or " and \ characters.

            if (ch === '"' || ch === "'") {
                delim = ch;
                while (next()) {
                    if (ch === delim) {
                        next();
                        return string;
                    } else if (ch === '\\') {
                        next();
                        if (ch === 'u') {
                            uffff = 0;
                            for (i = 0; i < 4; i += 1) {
                                hex = parseInt(next(), 16);
                                if (!isFinite(hex)) {
                                    break;
                                }
                                uffff = uffff * 16 + hex;
                            }
                            string += String.fromCharCode(uffff);
                        } else if (ch === '\r') {
                            if (peek() === '\n') {
                                next();
                            }
                        } else if (typeof escapee[ch] === 'string') {
                            string += escapee[ch];
                        } else {
                            break;
                        }
                    } else if (ch === '\n') {
                        // unescaped newlines are invalid; see:
                        // https://github.com/aseemk/json5/issues/24
                        // TODO this feels special-cased; are there other
                        // invalid unescaped chars?
                        break;
                    } else {
                        string += ch;
                    }
                }
            }
            error("Bad string");
        },

        inlineComment = function () {

// Skip an inline comment, assuming this is one. The current character should
// be the second / character in the // pair that begins this inline comment.
// To finish the inline comment, we look for a newline or the end of the text.

            if (ch !== '/') {
                error("Not an inline comment");
            }

            do {
                next();
                if (ch === '\n' || ch === '\r') {
                    next();
                    return;
                }
            } while (ch);
        },

        blockComment = function () {

// Skip a block comment, assuming this is one. The current character should be
// the * character in the /* pair that begins this block comment.
// To finish the block comment, we look for an ending */ pair of characters,
// but we also watch for the end of text before the comment is terminated.

            if (ch !== '*') {
                error("Not a block comment");
            }

            do {
                next();
                while (ch === '*') {
                    next('*');
                    if (ch === '/') {
                        next('/');
                        return;
                    }
                }
            } while (ch);

            error("Unterminated block comment");
        },

        comment = function () {

// Skip a comment, whether inline or block-level, assuming this is one.
// Comments always begin with a / character.

            if (ch !== '/') {
                error("Not a comment");
            }

            next('/');

            if (ch === '/') {
                inlineComment();
            } else if (ch === '*') {
                blockComment();
            } else {
                error("Unrecognized comment");
            }
        },

        white = function () {

// Skip whitespace and comments.
// Note that we're detecting comments by only a single / character.
// This works since regular expressions are not valid JSON(5), but this will
// break if there are other valid values that begin with a / character!

            while (ch) {
                if (ch === '/') {
                    comment();
                } else if (ws.indexOf(ch) >= 0) {
                    next();
                } else {
                    return;
                }
            }
        },

        word = function () {

// true, false, or null.

            switch (ch) {
            case 't':
                next('t');
                next('r');
                next('u');
                next('e');
                return true;
            case 'f':
                next('f');
                next('a');
                next('l');
                next('s');
                next('e');
                return false;
            case 'n':
                next('n');
                next('u');
                next('l');
                next('l');
                return null;
            case 'I':
                next('I');
                next('n');
                next('f');
                next('i');
                next('n');
                next('i');
                next('t');
                next('y');
                return Infinity;
            case 'N':
              next( 'N' );
              next( 'a' );
              next( 'N' );
              return NaN;
            }
            error("Unexpected " + renderChar(ch));
        },

        value,  // Place holder for the value function.

        array = function () {

// Parse an array value.

            var array = [];

            if (ch === '[') {
                next('[');
                white();
                while (ch) {
                    if (ch === ']') {
                        next(']');
                        return array;   // Potentially empty array
                    }
                    // ES5 allows omitting elements in arrays, e.g. [,] and
                    // [,null]. We don't allow this in JSON5.
                    if (ch === ',') {
                        error("Missing array element");
                    } else {
                        array.push(value());
                    }
                    white();
                    // If there's no comma after this value, this needs to
                    // be the end of the array.
                    if (ch !== ',') {
                        next(']');
                        return array;
                    }
                    next(',');
                    white();
                }
            }
            error("Bad array");
        },

        object = function () {

// Parse an object value.

            var key,
                object = {};

            if (ch === '{') {
                next('{');
                white();
                while (ch) {
                    if (ch === '}') {
                        next('}');
                        return object;   // Potentially empty object
                    }

                    // Keys can be unquoted. If they are, they need to be
                    // valid JS identifiers.
                    if (ch === '"' || ch === "'") {
                        key = string();
                    } else {
                        key = identifier();
                    }

                    white();
                    next(':');
                    object[key] = value();
                    white();
                    // If there's no comma after this pair, this needs to be
                    // the end of the object.
                    if (ch !== ',') {
                        next('}');
                        return object;
                    }
                    next(',');
                    white();
                }
            }
            error("Bad object");
        };

    value = function () {

// Parse a JSON value. It could be an object, an array, a string, a number,
// or a word.

        white();
        switch (ch) {
        case '{':
            return object();
        case '[':
            return array();
        case '"':
        case "'":
            return string();
        case '-':
        case '+':
        case '.':
            return number();
        default:
            return ch >= '0' && ch <= '9' ? number() : word();
        }
    };

// Return the json_parse function. It will have access to all of the above
// functions and variables.

    return function (source, reviver) {
        var result;

        text = String(source);
        at = 0;
        lineNumber = 1;
        columnNumber = 1;
        ch = ' ';
        result = value();
        white();
        if (ch) {
            error("Syntax error");
        }

// If there is a reviver function, we recursively walk the new structure,
// passing each name/value pair to the reviver function for possible
// transformation, starting with a temporary root object that holds the result
// in an empty key. If there is not a reviver function, we simply return the
// result.

        return typeof reviver === 'function' ? (function walk(holder, key) {
            var k, v, value = holder[key];
            if (value && typeof value === 'object') {
                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = walk(value, k);
                        if (v !== undefined) {
                            value[k] = v;
                        } else {
                            delete value[k];
                        }
                    }
                }
            }
            return reviver.call(holder, key, value);
        }({'': result}, '')) : result;
    };
}());

// JSON5 stringify will not quote keys where appropriate
JSON5.stringify = function (obj, replacer, space) {
    if (replacer && (typeof(replacer) !== "function" && !isArray(replacer))) {
        throw new Error('Replacer must be a function or an array');
    }
    var getReplacedValueOrUndefined = function(holder, key, isTopLevel) {
        var value = holder[key];

        // Replace the value with its toJSON value first, if possible
        if (value && value.toJSON && typeof value.toJSON === "function") {
            value = value.toJSON();
        }

        // If the user-supplied replacer if a function, call it. If it's an array, check objects' string keys for
        // presence in the array (removing the key/value pair from the resulting JSON if the key is missing).
        if (typeof(replacer) === "function") {
            return replacer.call(holder, key, value);
        } else if(replacer) {
            if (isTopLevel || isArray(holder) || replacer.indexOf(key) >= 0) {
                return value;
            } else {
                return undefined;
            }
        } else {
            return value;
        }
    };

    function isWordChar(c) {
        return (c >= 'a' && c <= 'z') ||
            (c >= 'A' && c <= 'Z') ||
            (c >= '0' && c <= '9') ||
            c === '_' || c === '$';
    }

    function isWordStart(c) {
        return (c >= 'a' && c <= 'z') ||
            (c >= 'A' && c <= 'Z') ||
            c === '_' || c === '$';
    }

    function isWord(key) {
        if (typeof key !== 'string') {
            return false;
        }
        if (!isWordStart(key[0])) {
            return false;
        }
        var i = 1, length = key.length;
        while (i < length) {
            if (!isWordChar(key[i])) {
                return false;
            }
            i++;
        }
        return true;
    }

    // export for use in tests
    JSON5.isWord = isWord;

    // polyfills
    function isArray(obj) {
        if (Array.isArray) {
            return Array.isArray(obj);
        } else {
            return Object.prototype.toString.call(obj) === '[object Array]';
        }
    }

    function isDate(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    var objStack = [];
    function checkForCircular(obj) {
        for (var i = 0; i < objStack.length; i++) {
            if (objStack[i] === obj) {
                throw new TypeError("Converting circular structure to JSON");
            }
        }
    }

    function makeIndent(str, num, noNewLine) {
        if (!str) {
            return "";
        }
        // indentation no more than 10 chars
        if (str.length > 10) {
            str = str.substring(0, 10);
        }

        var indent = noNewLine ? "" : "\n";
        for (var i = 0; i < num; i++) {
            indent += str;
        }

        return indent;
    }

    var indentStr;
    if (space) {
        if (typeof space === "string") {
            indentStr = space;
        } else if (typeof space === "number" && space >= 0) {
            indentStr = makeIndent(" ", space, true);
        } else {
            // ignore space parameter
        }
    }

    // Copied from Crokford's implementation of JSON
    // See https://github.com/douglascrockford/JSON-js/blob/e39db4b7e6249f04a195e7dd0840e610cc9e941e/json2.js#L195
    // Begin
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        meta = { // table of character substitutions
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"' : '\\"',
        '\\': '\\\\'
    };
    function escapeString(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ?
                c :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }
    // End

    function internalStringify(holder, key, isTopLevel) {
        var buffer, res;

        // Replace the value, if necessary
        var obj_part = getReplacedValueOrUndefined(holder, key, isTopLevel);

        if (obj_part && !isDate(obj_part)) {
            // unbox objects
            // don't unbox dates, since will turn it into number
            obj_part = obj_part.valueOf();
        }
        switch(typeof obj_part) {
            case "boolean":
                return obj_part.toString();

            case "number":
                if (isNaN(obj_part) || !isFinite(obj_part)) {
                    return "null";
                }
                return obj_part.toString();

            case "string":
                return escapeString(obj_part.toString());

            case "object":
                if (obj_part === null) {
                    return "null";
                } else if (isArray(obj_part)) {
                    checkForCircular(obj_part);
                    buffer = "[";
                    objStack.push(obj_part);

                    for (var i = 0; i < obj_part.length; i++) {
                        res = internalStringify(obj_part, i, false);
                        buffer += makeIndent(indentStr, objStack.length);
                        if (res === null || typeof res === "undefined") {
                            buffer += "null";
                        } else {
                            buffer += res;
                        }
                        if (i < obj_part.length-1) {
                            buffer += ",";
                        } else if (indentStr) {
                            buffer += "\n";
                        }
                    }
                    objStack.pop();
                    if (obj_part.length) {
                        buffer += makeIndent(indentStr, objStack.length, true)
                    }
                    buffer += "]";
                } else {
                    checkForCircular(obj_part);
                    buffer = "{";
                    var nonEmpty = false;
                    objStack.push(obj_part);
                    for (var prop in obj_part) {
                        if (obj_part.hasOwnProperty(prop)) {
                            var value = internalStringify(obj_part, prop, false);
                            isTopLevel = false;
                            if (typeof value !== "undefined" && value !== null) {
                                buffer += makeIndent(indentStr, objStack.length);
                                nonEmpty = true;
                                key = isWord(prop) ? prop : escapeString(prop);
                                buffer += key + ":" + (indentStr ? ' ' : '') + value + ",";
                            }
                        }
                    }
                    objStack.pop();
                    if (nonEmpty) {
                        buffer = buffer.substring(0, buffer.length-1) + makeIndent(indentStr, objStack.length) + "}";
                    } else {
                        buffer = '{}';
                    }
                }
                return buffer;
            default:
                // functions and undefined should be ignored
                return undefined;
        }
    }

    // special case...when undefined is used inside of
    // a compound object/array, return null.
    // but when top-level, return undefined
    var topLevelHolder = {"":obj};
    if (obj === undefined) {
        return getReplacedValueOrUndefined(topLevelHolder, '', true);
    }
    return internalStringify(topLevelHolder, '', true);
};


/***/ }),

/***/ "../node_modules/loglevel/lib/loglevel.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
* loglevel - https://github.com/pimterry/loglevel
*
* Copyright (c) 2013 Tim Perry
* Licensed under the MIT license.
*/
(function (root, definition) {
    "use strict";
    if (true) {
        !(__WEBPACK_AMD_DEFINE_FACTORY__ = (definition),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof module === 'object' && module.exports) {
        module.exports = definition();
    } else {
        root.log = definition();
    }
}(this, function () {
    "use strict";
    var noop = function() {};
    var undefinedType = "undefined";

    function realMethod(methodName) {
        if (typeof console === undefinedType) {
            return false; // We can't build a real method without a console to log to
        } else if (console[methodName] !== undefined) {
            return bindMethod(console, methodName);
        } else if (console.log !== undefined) {
            return bindMethod(console, 'log');
        } else {
            return noop;
        }
    }

    function bindMethod(obj, methodName) {
        var method = obj[methodName];
        if (typeof method.bind === 'function') {
            return method.bind(obj);
        } else {
            try {
                return Function.prototype.bind.call(method, obj);
            } catch (e) {
                // Missing bind shim or IE8 + Modernizr, fallback to wrapping
                return function() {
                    return Function.prototype.apply.apply(method, [obj, arguments]);
                };
            }
        }
    }

    // these private functions always need `this` to be set properly

    function enableLoggingWhenConsoleArrives(methodName, level, loggerName) {
        return function () {
            if (typeof console !== undefinedType) {
                replaceLoggingMethods.call(this, level, loggerName);
                this[methodName].apply(this, arguments);
            }
        };
    }

    function replaceLoggingMethods(level, loggerName) {
        /*jshint validthis:true */
        for (var i = 0; i < logMethods.length; i++) {
            var methodName = logMethods[i];
            this[methodName] = (i < level) ?
                noop :
                this.methodFactory(methodName, level, loggerName);
        }
    }

    function defaultMethodFactory(methodName, level, loggerName) {
        /*jshint validthis:true */
        return realMethod(methodName) ||
               enableLoggingWhenConsoleArrives.apply(this, arguments);
    }

    var logMethods = [
        "trace",
        "debug",
        "info",
        "warn",
        "error"
    ];

    function Logger(name, defaultLevel, factory) {
      var self = this;
      var currentLevel;
      var storageKey = "loglevel";
      if (name) {
        storageKey += ":" + name;
      }

      function persistLevelIfPossible(levelNum) {
          var levelName = (logMethods[levelNum] || 'silent').toUpperCase();

          // Use localStorage if available
          try {
              window.localStorage[storageKey] = levelName;
              return;
          } catch (ignore) {}

          // Use session cookie as fallback
          try {
              window.document.cookie =
                encodeURIComponent(storageKey) + "=" + levelName + ";";
          } catch (ignore) {}
      }

      function getPersistedLevel() {
          var storedLevel;

          try {
              storedLevel = window.localStorage[storageKey];
          } catch (ignore) {}

          if (typeof storedLevel === undefinedType) {
              try {
                  var cookie = window.document.cookie;
                  var location = cookie.indexOf(
                      encodeURIComponent(storageKey) + "=");
                  if (location) {
                      storedLevel = /^([^;]+)/.exec(cookie.slice(location))[1];
                  }
              } catch (ignore) {}
          }

          // If the stored level is not valid, treat it as if nothing was stored.
          if (self.levels[storedLevel] === undefined) {
              storedLevel = undefined;
          }

          return storedLevel;
      }

      /*
       *
       * Public API
       *
       */

      self.levels = { "TRACE": 0, "DEBUG": 1, "INFO": 2, "WARN": 3,
          "ERROR": 4, "SILENT": 5};

      self.methodFactory = factory || defaultMethodFactory;

      self.getLevel = function () {
          return currentLevel;
      };

      self.setLevel = function (level, persist) {
          if (typeof level === "string" && self.levels[level.toUpperCase()] !== undefined) {
              level = self.levels[level.toUpperCase()];
          }
          if (typeof level === "number" && level >= 0 && level <= self.levels.SILENT) {
              currentLevel = level;
              if (persist !== false) {  // defaults to true
                  persistLevelIfPossible(level);
              }
              replaceLoggingMethods.call(self, level, name);
              if (typeof console === undefinedType && level < self.levels.SILENT) {
                  return "No console available for logging";
              }
          } else {
              throw "log.setLevel() called with invalid level: " + level;
          }
      };

      self.setDefaultLevel = function (level) {
          if (!getPersistedLevel()) {
              self.setLevel(level, false);
          }
      };

      self.enableAll = function(persist) {
          self.setLevel(self.levels.TRACE, persist);
      };

      self.disableAll = function(persist) {
          self.setLevel(self.levels.SILENT, persist);
      };

      // Initialize with the right level
      var initialLevel = getPersistedLevel();
      if (initialLevel == null) {
          initialLevel = defaultLevel == null ? "WARN" : defaultLevel;
      }
      self.setLevel(initialLevel, false);
    }

    /*
     *
     * Package-level API
     *
     */

    var defaultLogger = new Logger();

    var _loggersByName = {};
    defaultLogger.getLogger = function getLogger(name) {
        if (typeof name !== "string" || name === "") {
          throw new TypeError("You must supply a name when creating a logger.");
        }

        var logger = _loggersByName[name];
        if (!logger) {
          logger = _loggersByName[name] = new Logger(
            name, defaultLogger.getLevel(), defaultLogger.methodFactory);
        }
        return logger;
    };

    // Grab the current global log variable in case of overwrite
    var _log = (typeof window !== undefinedType) ? window.log : undefined;
    defaultLogger.noConflict = function() {
        if (typeof window !== undefinedType &&
               window.log === defaultLogger) {
            window.log = _log;
        }

        return defaultLogger;
    };

    return defaultLogger;
}));


/***/ }),

/***/ "../node_modules/mixin-deep/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isExtendable = __webpack_require__("../node_modules/is-extendable/index.js");
var forIn = __webpack_require__("../node_modules/for-in/index.js");

function mixinDeep(target, objects) {
  var len = arguments.length, i = 0;
  while (++i < len) {
    var obj = arguments[i];
    if (isObject(obj)) {
      forIn(obj, copy, target);
    }
  }
  return target;
}

/**
 * Copy properties from the source object to the
 * target object.
 *
 * @param  {*} `val`
 * @param  {String} `key`
 */

function copy(val, key) {
  var obj = this[key];
  if (isObject(val) && isObject(obj)) {
    mixinDeep(obj, val);
  } else {
    this[key] = val;
  }
}

/**
 * Returns true if `val` is an object or function.
 *
 * @param  {any} val
 * @return {Boolean}
 */

function isObject(val) {
  return isExtendable(val) && !Array.isArray(val);
}

/**
 * Expose `mixinDeep`
 */

module.exports = mixinDeep;


/***/ }),

/***/ "../node_modules/ms/index.js":
/***/ (function(module, exports) {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}


/***/ }),

/***/ "../node_modules/punycode/punycode.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		true
	) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
			return punycode;
		}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module), __webpack_require__("../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../node_modules/querystring-es3/decode.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),

/***/ "../node_modules/querystring-es3/encode.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),

/***/ "../node_modules/querystring-es3/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__("../node_modules/querystring-es3/decode.js");
exports.encode = exports.stringify = __webpack_require__("../node_modules/querystring-es3/encode.js");


/***/ }),

/***/ "../node_modules/react-hot-api/modules/bindAutoBindMethods.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function bindAutoBindMethod(component, method) {
  var boundMethod = method.bind(component);

  boundMethod.__reactBoundContext = component;
  boundMethod.__reactBoundMethod = method;
  boundMethod.__reactBoundArguments = null;

  var componentName = component.constructor.displayName,
      _bind = boundMethod.bind;

  boundMethod.bind = function (newThis) {
    var args = Array.prototype.slice.call(arguments, 1);
    if (newThis !== component && newThis !== null) {
      console.warn(
        'bind(): React component methods may only be bound to the ' +
        'component instance. See ' + componentName
      );
    } else if (!args.length) {
      console.warn(
        'bind(): You are binding a component method to the component. ' +
        'React does this for you automatically in a high-performance ' +
        'way, so you can safely remove this call. See ' + componentName
      );
      return boundMethod;
    }

    var reboundMethod = _bind.apply(boundMethod, arguments);
    reboundMethod.__reactBoundContext = component;
    reboundMethod.__reactBoundMethod = method;
    reboundMethod.__reactBoundArguments = args;

    return reboundMethod;
  };

  return boundMethod;
}

/**
 * Performs auto-binding similar to how React does it.
 * Skips already auto-bound methods.
 * Based on https://github.com/facebook/react/blob/b264372e2b3ad0b0c0c0cc95a2f383e4a1325c3d/src/classic/class/ReactClass.js#L639-L705
 */
module.exports = function bindAutoBindMethods(internalInstance) {
  var component = typeof internalInstance.getPublicInstance === 'function' ?
    internalInstance.getPublicInstance() :
    internalInstance;

  if (!component) {
    // React 0.14 stateless component has no instance
    return;
  }

  for (var autoBindKey in component.__reactAutoBindMap) {
    if (!component.__reactAutoBindMap.hasOwnProperty(autoBindKey)) {
      continue;
    }

    // Skip already bound methods
    if (component.hasOwnProperty(autoBindKey) &&
        component[autoBindKey].__reactBoundContext === component) {
      continue;
    }

    var method = component.__reactAutoBindMap[autoBindKey];
    component[autoBindKey] = bindAutoBindMethod(component, method);
  }
};

/***/ }),

/***/ "../node_modules/react-hot-api/modules/deepForceUpdate.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bindAutoBindMethods = __webpack_require__("../node_modules/react-hot-api/modules/bindAutoBindMethods.js");
var traverseRenderedChildren = __webpack_require__("../node_modules/react-hot-api/modules/traverseRenderedChildren.js");

function setPendingForceUpdate(internalInstance) {
  if (internalInstance._pendingForceUpdate === false) {
    internalInstance._pendingForceUpdate = true;
  }
}

function forceUpdateIfPending(internalInstance, React) {
  if (internalInstance._pendingForceUpdate === true) {
    // `|| internalInstance` for React 0.12 and earlier
    var instance = internalInstance._instance || internalInstance;

    if (instance.forceUpdate) {
      instance.forceUpdate();
    } else if (React && React.Component) {
      React.Component.prototype.forceUpdate.call(instance);
    }
  }
}

/**
 * Updates a React component recursively, so even if children define funky
 * `shouldComponentUpdate`, they are forced to re-render.
 * Makes sure that any newly added methods are properly auto-bound.
 */
function deepForceUpdate(internalInstance, React) {
  traverseRenderedChildren(internalInstance, bindAutoBindMethods);
  traverseRenderedChildren(internalInstance, setPendingForceUpdate);
  traverseRenderedChildren(internalInstance, forceUpdateIfPending, React);
}

module.exports = deepForceUpdate;


/***/ }),

/***/ "../node_modules/react-hot-api/modules/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__("../node_modules/react-hot-api/modules/makeMakeHot.js");

/***/ }),

/***/ "../node_modules/react-hot-api/modules/makeAssimilatePrototype.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Returns a function that establishes the first prototype passed to it
 * as the "source of truth" and patches its methods on subsequent invocations,
 * also patching current and previous prototypes to forward calls to it.
 */
module.exports = function makeAssimilatePrototype() {
  var storedPrototype,
      knownPrototypes = [];

  function wrapMethod(key) {
    return function () {
      if (storedPrototype[key]) {
        return storedPrototype[key].apply(this, arguments);
      }
    };
  }

  function patchProperty(proto, key) {
    proto[key] = storedPrototype[key];

    if (typeof proto[key] !== 'function' ||
      key === 'type' ||
      key === 'constructor') {
      return;
    }

    proto[key] = wrapMethod(key);

    if (storedPrototype[key].isReactClassApproved) {
      proto[key].isReactClassApproved = storedPrototype[key].isReactClassApproved;
    }

    if (proto.__reactAutoBindMap && proto.__reactAutoBindMap[key]) {
      proto.__reactAutoBindMap[key] = proto[key];
    }
  }

  function updateStoredPrototype(freshPrototype) {
    storedPrototype = {};

    Object.getOwnPropertyNames(freshPrototype).forEach(function (key) {
      storedPrototype[key] = freshPrototype[key];
    });
  }

  function reconcileWithStoredPrototypes(freshPrototype) {
    knownPrototypes.push(freshPrototype);
    knownPrototypes.forEach(function (proto) {
      Object.getOwnPropertyNames(storedPrototype).forEach(function (key) {
        patchProperty(proto, key);
      });
    });
  }

  return function assimilatePrototype(freshPrototype) {
    if (Object.prototype.hasOwnProperty.call(freshPrototype, '__isAssimilatedByReactHotAPI')) {
      return;
    }

    updateStoredPrototype(freshPrototype);
    reconcileWithStoredPrototypes(freshPrototype);
    freshPrototype.__isAssimilatedByReactHotAPI = true;
  };
};

/***/ }),

/***/ "../node_modules/react-hot-api/modules/makeMakeHot.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var makePatchReactClass = __webpack_require__("../node_modules/react-hot-api/modules/makePatchReactClass.js");

/**
 * Returns a function that, when invoked, patches a React class with a new
 * version of itself. To patch different classes, pass different IDs.
 */
module.exports = function makeMakeHot(getRootInstances, React) {
  if (typeof getRootInstances !== 'function') {
    throw new Error('Expected getRootInstances to be a function.');
  }

  var patchers = {};

  return function makeHot(NextClass, persistentId) {
    persistentId = persistentId || NextClass.displayName || NextClass.name;

    if (!persistentId) {
      console.error(
        'Hot reload is disabled for one of your types. To enable it, pass a ' +
        'string uniquely identifying this class within this current module ' +
        'as a second parameter to makeHot.'
      );
      return NextClass;
    }

    if (!patchers[persistentId]) {
      patchers[persistentId] = makePatchReactClass(getRootInstances, React);
    }

    var patchReactClass = patchers[persistentId];
    return patchReactClass(NextClass);
  };
};

/***/ }),

/***/ "../node_modules/react-hot-api/modules/makePatchReactClass.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var makeAssimilatePrototype = __webpack_require__("../node_modules/react-hot-api/modules/makeAssimilatePrototype.js"),
    requestForceUpdateAll = __webpack_require__("../node_modules/react-hot-api/modules/requestForceUpdateAll.js");

function hasNonStubTypeProperty(ReactClass) {
  if (!ReactClass.hasOwnProperty('type')) {
    return false;
  }

  var descriptor = Object.getOwnPropertyDescriptor(ReactClass, 'type');
  if (typeof descriptor.get === 'function') {
    return false;
  }

  return true;
}

function getPrototype(ReactClass) {
  var prototype = ReactClass.prototype,
      seemsLegit = prototype && typeof prototype.render === 'function';

  if (!seemsLegit && hasNonStubTypeProperty(ReactClass)) {
    prototype = ReactClass.type.prototype;
  }

  return prototype;
}

/**
 * Returns a function that will patch React class with new versions of itself
 * on subsequent invocations. Both legacy and ES6 style classes are supported.
 */
module.exports = function makePatchReactClass(getRootInstances, React) {
  var assimilatePrototype = makeAssimilatePrototype(),
      FirstClass = null;

  return function patchReactClass(NextClass) {
    var nextPrototype = getPrototype(NextClass);
    assimilatePrototype(nextPrototype);

    if (FirstClass) {
      requestForceUpdateAll(getRootInstances, React);
    }

    return FirstClass || (FirstClass = NextClass);
  };
};

/***/ }),

/***/ "../node_modules/react-hot-api/modules/requestForceUpdateAll.js":
/***/ (function(module, exports, __webpack_require__) {

var deepForceUpdate = __webpack_require__("../node_modules/react-hot-api/modules/deepForceUpdate.js");

var isRequestPending = false;

module.exports = function requestForceUpdateAll(getRootInstances, React) {
  if (isRequestPending) {
    return;
  }

  /**
   * Forces deep re-render of all mounted React components.
   * Hats off to Omar Skalli (@Chetane) for suggesting this approach:
   * https://gist.github.com/Chetane/9a230a9fdcdca21a4e29
   */
  function forceUpdateAll() {
    isRequestPending = false;

    var rootInstances = getRootInstances(),
        rootInstance;

    for (var key in rootInstances) {
      if (rootInstances.hasOwnProperty(key)) {
        rootInstance = rootInstances[key];

        // `|| rootInstance` for React 0.12 and earlier
        rootInstance = rootInstance._reactInternalInstance || rootInstance;
        deepForceUpdate(rootInstance, React);
      }
    }
  }

  setTimeout(forceUpdateAll);
};


/***/ }),

/***/ "../node_modules/react-hot-api/modules/traverseRenderedChildren.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function traverseRenderedChildren(internalInstance, callback, argument) {
  callback(internalInstance, argument);

  if (internalInstance._renderedComponent) {
    traverseRenderedChildren(
      internalInstance._renderedComponent,
      callback,
      argument
    );
  } else {
    for (var key in internalInstance._renderedChildren) {
      traverseRenderedChildren(
        internalInstance._renderedChildren[key],
        callback,
        argument
      );
    }
  }
}

module.exports = traverseRenderedChildren;


/***/ }),

/***/ "../node_modules/react-hot-loader/RootInstanceProvider.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getRootInstancesFromReactMount = __webpack_require__("../node_modules/react-hot-loader/getRootInstancesFromReactMount.js");

var injectedProvider = null,
    didWarn = false;

function warnOnce() {
  if (!didWarn) {
    console.warn(
      'It appears that React Hot Loader isn\'t configured correctly. ' +
      'If you\'re using NPM, make sure your dependencies don\'t drag duplicate React distributions into their node_modules and that require("react") corresponds to the React instance you render your app with.',
      'If you\'re using a precompiled version of React, see https://github.com/gaearon/react-hot-loader/tree/master/docs#usage-with-external-react for integration instructions.'
    );
  }

  didWarn = true;
}

var RootInstanceProvider = {
  injection: {
    injectProvider: function (provider) {
      injectedProvider = provider;
    }
  },

  getRootInstances: function (ReactMount) {
    if (injectedProvider) {
      return injectedProvider.getRootInstances();
    }

    var instances = ReactMount && getRootInstancesFromReactMount(ReactMount) || [];
    if (!Object.keys(instances).length) {
      warnOnce();
    }

    return instances;
  }
};

module.exports = RootInstanceProvider;

/***/ }),

/***/ "../node_modules/react-hot-loader/getRootInstancesFromReactMount.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function getRootInstancesFromReactMount(ReactMount) {
  return ReactMount._instancesByReactRootID || ReactMount._instancesByContainerID || [];
}

module.exports = getRootInstancesFromReactMount;

/***/ }),

/***/ "../node_modules/react-hot-loader/isReactClassish.js":
/***/ (function(module, exports) {

function hasRender(Class) {
  var prototype = Class.prototype;
  if (!prototype) {
    return false;
  }

  return typeof prototype.render === 'function';
}

function descendsFromReactComponent(Class, React) {
  if (!React.Component) {
    return false;
  }

  var Base = Object.getPrototypeOf(Class);
  while (Base) {
    if (Base === React.Component) {
      return true;
    }

    Base = Object.getPrototypeOf(Base);
  }

  return false;
}

function isReactClassish(Class, React) {
  if (typeof Class !== 'function') {
    return false;
  }

  // React 0.13
  if (hasRender(Class) || descendsFromReactComponent(Class, React)) {
    return true;
  }

  // React 0.12 and earlier
  if (Class.type && hasRender(Class.type)) {
    return true;
  }

  return false;
}

module.exports = isReactClassish;

/***/ }),

/***/ "../node_modules/react-hot-loader/isReactElementish.js":
/***/ (function(module, exports, __webpack_require__) {

var isReactClassish = __webpack_require__("../node_modules/react-hot-loader/isReactClassish.js");

function isReactElementish(obj, React) {
  if (!obj) {
    return false;
  }

  return Object.prototype.toString.call(obj.props) === '[object Object]' &&
         isReactClassish(obj.type, React);
}

module.exports = isReactElementish;

/***/ }),

/***/ "../node_modules/react-hot-loader/makeExportsHot.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isReactClassish = __webpack_require__("../node_modules/react-hot-loader/isReactClassish.js"),
    isReactElementish = __webpack_require__("../node_modules/react-hot-loader/isReactElementish.js");

function makeExportsHot(m, React) {
  if (isReactElementish(m.exports, React)) {
    // React elements are never valid React classes
    return false;
  }

  var freshExports = m.exports,
      exportsReactClass = isReactClassish(m.exports, React),
      foundReactClasses = false;

  if (exportsReactClass) {
    m.exports = m.makeHot(m.exports, '__MODULE_EXPORTS');
    foundReactClasses = true;
  }

  for (var key in m.exports) {
    if (!Object.prototype.hasOwnProperty.call(freshExports, key)) {
      continue;
    }

    if (exportsReactClass && key === 'type') {
      // React 0.12 also puts classes under `type` property for compat.
      // Skip to avoid updating twice.
      continue;
    }

    var value;
    try {
      value = freshExports[key];
    } catch (err) {
      continue;
    }

    if (!isReactClassish(value, React)) {
      continue;
    }

    if (Object.getOwnPropertyDescriptor(m.exports, key).writable) {
      m.exports[key] = m.makeHot(value, '__MODULE_EXPORTS_' + key);
      foundReactClasses = true;
    } else {
      console.warn("Can't make class " + key + " hot reloadable due to being read-only. To fix this you can try two solutions. First, you can exclude files or directories (for example, /node_modules/) using 'exclude' option in loader configuration. Second, if you are using Babel, you can enable loose mode for `es6.modules` using the 'loose' option. See: http://babeljs.io/docs/plugins/transform-es2015-modules-commonjs/#options-loose and http://babeljs.io/docs/usage/options/");
    }
  }

  return foundReactClasses;
}

module.exports = makeExportsHot;


/***/ }),

/***/ "../node_modules/requires-port/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Check if we're required to add a port number.
 *
 * @see https://url.spec.whatwg.org/#default-port
 * @param {Number|String} port Port number we need to check
 * @param {String} protocol Protocol we need to check against.
 * @returns {Boolean} Is it a default port for the given protocol
 * @api private
 */
module.exports = function required(port, protocol) {
  protocol = protocol.split(':')[0];
  port = +port;

  if (!port) return false;

  switch (protocol) {
    case 'http':
    case 'ws':
    return port !== 80;

    case 'https':
    case 'wss':
    return port !== 443;

    case 'ftp':
    return port !== 21;

    case 'gopher':
    return port !== 70;

    case 'file':
    return false;
  }

  return port !== 0;
};


/***/ }),

/***/ "../node_modules/sockjs-client/lib/entry.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var transportList = __webpack_require__("../node_modules/sockjs-client/lib/transport-list.js");

module.exports = __webpack_require__("../node_modules/sockjs-client/lib/main.js")(transportList);

// TODO can't get rid of this until all servers do
if ('_sockjs_onload' in global) {
  setTimeout(global._sockjs_onload, 1);
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../node_modules/sockjs-client/lib/event/close.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inherits = __webpack_require__("../node_modules/inherits/inherits_browser.js")
  , Event = __webpack_require__("../node_modules/sockjs-client/lib/event/event.js")
  ;

function CloseEvent() {
  Event.call(this);
  this.initEvent('close', false, false);
  this.wasClean = false;
  this.code = 0;
  this.reason = '';
}

inherits(CloseEvent, Event);

module.exports = CloseEvent;


/***/ }),

/***/ "../node_modules/sockjs-client/lib/event/emitter.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inherits = __webpack_require__("../node_modules/inherits/inherits_browser.js")
  , EventTarget = __webpack_require__("../node_modules/sockjs-client/lib/event/eventtarget.js")
  ;

function EventEmitter() {
  EventTarget.call(this);
}

inherits(EventEmitter, EventTarget);

EventEmitter.prototype.removeAllListeners = function(type) {
  if (type) {
    delete this._listeners[type];
  } else {
    this._listeners = {};
  }
};

EventEmitter.prototype.once = function(type, listener) {
  var self = this
    , fired = false;

  function g() {
    self.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  this.on(type, g);
};

EventEmitter.prototype.emit = function() {
  var type = arguments[0];
  var listeners = this._listeners[type];
  if (!listeners) {
    return;
  }
  // equivalent of Array.prototype.slice.call(arguments, 1);
  var l = arguments.length;
  var args = new Array(l - 1);
  for (var ai = 1; ai < l; ai++) {
    args[ai - 1] = arguments[ai];
  }
  for (var i = 0; i < listeners.length; i++) {
    listeners[i].apply(this, args);
  }
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener = EventTarget.prototype.addEventListener;
EventEmitter.prototype.removeListener = EventTarget.prototype.removeEventListener;

module.exports.EventEmitter = EventEmitter;


/***/ }),

/***/ "../node_modules/sockjs-client/lib/event/event.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function Event(eventType) {
  this.type = eventType;
}

Event.prototype.initEvent = function(eventType, canBubble, cancelable) {
  this.type = eventType;
  this.bubbles = canBubble;
  this.cancelable = cancelable;
  this.timeStamp = +new Date();
  return this;
};

Event.prototype.stopPropagation = function() {};
Event.prototype.preventDefault = function() {};

Event.CAPTURING_PHASE = 1;
Event.AT_TARGET = 2;
Event.BUBBLING_PHASE = 3;

module.exports = Event;


/***/ }),

/***/ "../node_modules/sockjs-client/lib/event/eventtarget.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* Simplified implementation of DOM2 EventTarget.
 *   http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget
 */

function EventTarget() {
  this._listeners = {};
}

EventTarget.prototype.addEventListener = function(eventType, listener) {
  if (!(eventType in this._listeners)) {
    this._listeners[eventType] = [];
  }
  var arr = this._listeners[eventType];
  // #4
  if (arr.indexOf(listener) === -1) {
    // Make a copy so as not to interfere with a current dispatchEvent.
    arr = arr.concat([listener]);
  }
  this._listeners[eventType] = arr;
};

EventTarget.prototype.removeEventListener = function(eventType, listener) {
  var arr = this._listeners[eventType];
  if (!arr) {
    return;
  }
  var idx = arr.indexOf(listener);
  if (idx !== -1) {
    if (arr.length > 1) {
      // Make a copy so as not to interfere with a current dispatchEvent.
      this._listeners[eventType] = arr.slice(0, idx).concat(arr.slice(idx + 1));
    } else {
      delete this._listeners[eventType];
    }
    return;
  }
};

EventTarget.prototype.dispatchEvent = function() {
  var event = arguments[0];
  var t = event.type;
  // equivalent of Array.prototype.slice.call(arguments, 0);
  var args = arguments.length === 1 ? [event] : Array.apply(null, arguments);
  // TODO: This doesn't match the real behavior; per spec, onfoo get
  // their place in line from the /first/ time they're set from
  // non-null. Although WebKit bumps it to the end every time it's
  // set.
  if (this['on' + t]) {
    this['on' + t].apply(this, args);
  }
  if (t in this._listeners) {
    // Grab a reference to the listeners list. removeEventListener may alter the list.
    var listeners = this._listeners[t];
    for (var i = 0; i < listeners.length; i++) {
      listeners[i].apply(this, args);
    }
  }
};

module.exports = EventTarget;


/***/ }),

/***/ "../node_modules/sockjs-client/lib/event/trans-message.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inherits = __webpack_require__("../node_modules/inherits/inherits_browser.js")
  , Event = __webpack_require__("../node_modules/sockjs-client/lib/event/event.js")
  ;

function TransportMessageEvent(data) {
  Event.call(this);
  this.initEvent('message', false, false);
  this.data = data;
}

inherits(TransportMessageEvent, Event);

module.exports = TransportMessageEvent;


/***/ }),

/***/ "../node_modules/sockjs-client/lib/facade.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var JSON3 = __webpack_require__("../node_modules/json3/lib/json3.js")
  , iframeUtils = __webpack_require__("../node_modules/sockjs-client/lib/utils/iframe.js")
  ;

function FacadeJS(transport) {
  this._transport = transport;
  transport.on('message', this._transportMessage.bind(this));
  transport.on('close', this._transportClose.bind(this));
}

FacadeJS.prototype._transportClose = function(code, reason) {
  iframeUtils.postMessage('c', JSON3.stringify([code, reason]));
};
FacadeJS.prototype._transportMessage = function(frame) {
  iframeUtils.postMessage('t', frame);
};
FacadeJS.prototype._send = function(data) {
  this._transport.send(data);
};
FacadeJS.prototype._close = function() {
  this._transport.close();
  this._transport.removeAllListeners();
};

module.exports = FacadeJS;


/***/ }),

/***/ "../node_modules/sockjs-client/lib/iframe-bootstrap.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var urlUtils = __webpack_require__("../node_modules/sockjs-client/lib/utils/url.js")
  , eventUtils = __webpack_require__("../node_modules/sockjs-client/lib/utils/event.js")
  , JSON3 = __webpack_require__("../node_modules/json3/lib/json3.js")
  , FacadeJS = __webpack_require__("../node_modules/sockjs-client/lib/facade.js")
  , InfoIframeReceiver = __webpack_require__("../node_modules/sockjs-client/lib/info-iframe-receiver.js")
  , iframeUtils = __webpack_require__("../node_modules/sockjs-client/lib/utils/iframe.js")
  , loc = __webpack_require__("../node_modules/sockjs-client/lib/location.js")
  ;

var debug = function() {};
if (true) {
  debug = __webpack_require__("../node_modules/debug/src/browser.js")('sockjs-client:iframe-bootstrap');
}

module.exports = function(SockJS, availableTransports) {
  var transportMap = {};
  availableTransports.forEach(function(at) {
    if (at.facadeTransport) {
      transportMap[at.facadeTransport.transportName] = at.facadeTransport;
    }
  });

  // hard-coded for the info iframe
  // TODO see if we can make this more dynamic
  transportMap[InfoIframeReceiver.transportName] = InfoIframeReceiver;
  var parentOrigin;

  /* eslint-disable camelcase */
  SockJS.bootstrap_iframe = function() {
    /* eslint-enable camelcase */
    var facade;
    iframeUtils.currentWindowId = loc.hash.slice(1);
    var onMessage = function(e) {
      if (e.source !== parent) {
        return;
      }
      if (typeof parentOrigin === 'undefined') {
        parentOrigin = e.origin;
      }
      if (e.origin !== parentOrigin) {
        return;
      }

      var iframeMessage;
      try {
        iframeMessage = JSON3.parse(e.data);
      } catch (ignored) {
        debug('bad json', e.data);
        return;
      }

      if (iframeMessage.windowId !== iframeUtils.currentWindowId) {
        return;
      }
      switch (iframeMessage.type) {
      case 's':
        var p;
        try {
          p = JSON3.parse(iframeMessage.data);
        } catch (ignored) {
          debug('bad json', iframeMessage.data);
          break;
        }
        var version = p[0];
        var transport = p[1];
        var transUrl = p[2];
        var baseUrl = p[3];
        debug(version, transport, transUrl, baseUrl);
        // change this to semver logic
        if (version !== SockJS.version) {
          throw new Error('Incompatible SockJS! Main site uses:' +
                    ' "' + version + '", the iframe:' +
                    ' "' + SockJS.version + '".');
        }

        if (!urlUtils.isOriginEqual(transUrl, loc.href) ||
            !urlUtils.isOriginEqual(baseUrl, loc.href)) {
          throw new Error('Can\'t connect to different domain from within an ' +
                    'iframe. (' + loc.href + ', ' + transUrl + ', ' + baseUrl + ')');
        }
        facade = new FacadeJS(new transportMap[transport](transUrl, baseUrl));
        break;
      case 'm':
        facade._send(iframeMessage.data);
        break;
      case 'c':
        if (facade) {
          facade._close();
        }
        facade = null;
        break;
      }
    };

    eventUtils.attachEvent('message', onMessage);

    // Start
    iframeUtils.postMessage('s');
  };
};


/***/ }),

/***/ "../node_modules/sockjs-client/lib/info-ajax.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var EventEmitter = __webpack_require__("../node_modules/sockjs-client/lib/event/emitter.js").EventEmitter
  , inherits = __webpack_require__("../node_modules/inherits/inherits_browser.js")
  , JSON3 = __webpack_require__("../node_modules/json3/lib/json3.js")
  , objectUtils = __webpack_require__("../node_modules/sockjs-client/lib/utils/object.js")
  ;

var debug = function() {};
if (true) {
  debug = __webpack_require__("../node_modules/debug/src/browser.js")('sockjs-client:info-ajax');
}

function InfoAjax(url, AjaxObject) {
  EventEmitter.call(this);

  var self = this;
  var t0 = +new Date();
  this.xo = new AjaxObject('GET', url);

  this.xo.once('finish', function(status, text) {
    var info, rtt;
    if (status === 200) {
      rtt = (+new Date()) - t0;
      if (text) {
        try {
          info = JSON3.parse(text);
        } catch (e) {
          debug('bad json', text);
        }
      }

      if (!objectUtils.isObject(info)) {
        info = {};
      }
    }
    self.emit('finish', info, rtt);
    self.removeAllListeners();
  });
}

inherits(InfoAjax, EventEmitter);

InfoAjax.prototype.close = function() {
  this.removeAllListeners();
  this.xo.close();
};

module.exports = InfoAjax;


/***/ }),

/***/ "../node_modules/sockjs-client/lib/info-iframe-receiver.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inherits = __webpack_require__("../node_modules/inherits/inherits_browser.js")
  , EventEmitter = __webpack_require__("../node_modules/sockjs-client/lib/event/emitter.js").EventEmitter
  , JSON3 = __webpack_require__("../node_modules/json3/lib/json3.js")
  , XHRLocalObject = __webpack_require__("../node_modules/sockjs-client/lib/transport/sender/xhr-local.js")
  , InfoAjax = __webpack_require__("../node_modules/sockjs-client/lib/info-ajax.js")
  ;

function InfoReceiverIframe(transUrl) {
  var self = this;
  EventEmitter.call(this);

  this.ir = new InfoAjax(transUrl, XHRLocalObject);
  this.ir.once('finish', function(info, rtt) {
    self.ir = null;
    self.emit('message', JSON3.stringify([info, rtt]));
  });
}

inherits(InfoReceiverIframe, EventEmitter);

InfoReceiverIframe.transportName = 'iframe-info-receiver';

InfoReceiverIframe.prototype.close = function() {
  if (this.ir) {
    this.ir.close();
    this.ir = null;
  }
  this.removeAllListeners();
};

module.exports = InfoReceiverIframe;


/***/ }),

/***/ "../node_modules/sockjs-client/lib/info-iframe.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var EventEmitter = __webpack_require__("../node_modules/sockjs-client/lib/event/emitter.js").EventEmitter
  , inherits = __webpack_require__("../node_modules/inherits/inherits_browser.js")
  , JSON3 = __webpack_require__("../node_modules/json3/lib/json3.js")
  , utils = __webpack_require__("../node_modules/sockjs-client/lib/utils/event.js")
  , IframeTransport = __webpack_require__("../node_modules/sockjs-client/lib/transport/iframe.js")
  , InfoReceiverIframe = __webpack_require__("../node_modules/sockjs-client/lib/info-iframe-receiver.js")
  ;

var debug = function() {};
if (true) {
  debug = __webpack_require__("../node_modules/debug/src/browser.js")('sockjs-client:info-iframe');
}

function InfoIframe(baseUrl, url) {
  var self = this;
  EventEmitter.call(this);

  var go = function() {
    var ifr = self.ifr = new IframeTransport(InfoReceiverIframe.transportName, url, baseUrl);

    ifr.once('message', function(msg) {
      if (msg) {
        var d;
        try {
          d = JSON3.parse(msg);
        } catch (e) {
          debug('bad json', msg);
          self.emit('finish');
          self.close();
          return;
        }

        var info = d[0], rtt = d[1];
        self.emit('finish', info, rtt);
      }
      self.close();
    });

    ifr.once('close', function() {
      self.emit('finish');
      self.close();
    });
  };

  // TODO this seems the same as the 'needBody' from transports
  if (!global.document.body) {
    utils.attachEvent('load', go);
  } else {
    go();
  }
}

inherits(InfoIframe, EventEmitter);

InfoIframe.enabled = function() {
  return IframeTransport.enabled();
};

InfoIframe.prototype.close = function() {
  if (this.ifr) {
    this.ifr.close();
  }
  this.removeAllListeners();
  this.ifr = null;
};

module.exports = InfoIframe;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../node_modules/sockjs-client/lib/info-receiver.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var EventEmitter = __webpack_require__("../node_modules/sockjs-client/lib/event/emitter.js").EventEmitter
  , inherits = __webpack_require__("../node_modules/inherits/inherits_browser.js")
  , urlUtils = __webpack_require__("../node_modules/sockjs-client/lib/utils/url.js")
  , XDR = __webpack_require__("../node_modules/sockjs-client/lib/transport/sender/xdr.js")
  , XHRCors = __webpack_require__("../node_modules/sockjs-client/lib/transport/sender/xhr-cors.js")
  , XHRLocal = __webpack_require__("../node_modules/sockjs-client/lib/transport/sender/xhr-local.js")
  , XHRFake = __webpack_require__("../node_modules/sockjs-client/lib/transport/sender/xhr-fake.js")
  , InfoIframe = __webpack_require__("../node_modules/sockjs-client/lib/info-iframe.js")
  , InfoAjax = __webpack_require__("../node_modules/sockjs-client/lib/info-ajax.js")
  ;

var debug = function() {};
if (true) {
  debug = __webpack_require__("../node_modules/debug/src/browser.js")('sockjs-client:info-receiver');
}

function InfoReceiver(baseUrl, urlInfo) {
  debug(baseUrl);
  var self = this;
  EventEmitter.call(this);

  setTimeout(function() {
    self.doXhr(baseUrl, urlInfo);
  }, 0);
}

inherits(InfoReceiver, EventEmitter);

// TODO this is currently ignoring the list of available transports and the whitelist

InfoReceiver._getReceiver = function(baseUrl, url, urlInfo) {
  // determine method of CORS support (if needed)
  if (urlInfo.sameOrigin) {
    return new InfoAjax(url, XHRLocal);
  }
  if (XHRCors.enabled) {
    return new InfoAjax(url, XHRCors);
  }
  if (XDR.enabled && urlInfo.sameScheme) {
    return new InfoAjax(url, XDR);
  }
  if (InfoIframe.enabled()) {
    return new InfoIframe(baseUrl, url);
  }
  return new InfoAjax(url, XHRFake);
};

InfoReceiver.prototype.doXhr = function(baseUrl, urlInfo) {
  var self = this
    , url = urlUtils.addPath(baseUrl, '/info')
    ;
  debug('doXhr', url);

  this.xo = InfoReceiver._getReceiver(baseUrl, url, urlInfo);

  this.timeoutRef = setTimeout(function() {
    debug('timeout');
    self._cleanup(false);
    self.emit('finish');
  }, InfoReceiver.timeout);

  this.xo.once('finish', function(info, rtt) {
    debug('finish', info, rtt);
    self._cleanup(true);
    self.emit('finish', info, rtt);
  });
};

InfoReceiver.prototype._cleanup = function(wasClean) {
  debug('_cleanup');
  clearTimeout(this.timeoutRef);
  this.timeoutRef = null;
  if (!wasClean && this.xo) {
    this.xo.close();
  }
  this.xo = null;
};

InfoReceiver.prototype.close = function() {
  debug('close');
  this.removeAllListeners();
  this._cleanup(false);
};

InfoReceiver.timeout = 8000;

module.exports = InfoReceiver;


/***/ }),

/***/ "../node_modules/sockjs-client/lib/location.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

module.exports = global.location || {
  origin: 'http://localhost:80'
, protocol: 'http'
, host: 'localhost'
, port: 80
, href: 'http://localhost/'
, hash: ''
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../node_modules/sockjs-client/lib/main.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

__webpack_require__("../node_modules/sockjs-client/lib/shims.js");

var URL = __webpack_require__("../node_modules/url-parse/index.js")
  , inherits = __webpack_require__("../node_modules/inherits/inherits_browser.js")
  , JSON3 = __webpack_require__("../node_modules/json3/lib/json3.js")
  , random = __webpack_require__("../node_modules/sockjs-client/lib/utils/random.js")
  , escape = __webpack_require__("../node_modules/sockjs-client/lib/utils/escape.js")
  , urlUtils = __webpack_require__("../node_modules/sockjs-client/lib/utils/url.js")
  , eventUtils = __webpack_require__("../node_modules/sockjs-client/lib/utils/event.js")
  , transport = __webpack_require__("../node_modules/sockjs-client/lib/utils/transport.js")
  , objectUtils = __webpack_require__("../node_modules/sockjs-client/lib/utils/object.js")
  , browser = __webpack_require__("../node_modules/sockjs-client/lib/utils/browser.js")
  , log = __webpack_require__("../node_modules/sockjs-client/lib/utils/log.js")
  , Event = __webpack_require__("../node_modules/sockjs-client/lib/event/event.js")
  , EventTarget = __webpack_require__("../node_modules/sockjs-client/lib/event/eventtarget.js")
  , loc = __webpack_require__("../node_modules/sockjs-client/lib/location.js")
  , CloseEvent = __webpack_require__("../node_modules/sockjs-client/lib/event/close.js")
  , TransportMessageEvent = __webpack_require__("../node_modules/sockjs-client/lib/event/trans-message.js")
  , InfoReceiver = __webpack_require__("../node_modules/sockjs-client/lib/info-receiver.js")
  ;

var debug = function() {};
if (true) {
  debug = __webpack_require__("../node_modules/debug/src/browser.js")('sockjs-client:main');
}

var transports;

// follow constructor steps defined at http://dev.w3.org/html5/websockets/#the-websocket-interface
function SockJS(url, protocols, options) {
  if (!(this instanceof SockJS)) {
    return new SockJS(url, protocols, options);
  }
  if (arguments.length < 1) {
    throw new TypeError("Failed to construct 'SockJS: 1 argument required, but only 0 present");
  }
  EventTarget.call(this);

  this.readyState = SockJS.CONNECTING;
  this.extensions = '';
  this.protocol = '';

  // non-standard extension
  options = options || {};
  if (options.protocols_whitelist) {
    log.warn("'protocols_whitelist' is DEPRECATED. Use 'transports' instead.");
  }
  this._transportsWhitelist = options.transports;
  this._transportOptions = options.transportOptions || {};

  var sessionId = options.sessionId || 8;
  if (typeof sessionId === 'function') {
    this._generateSessionId = sessionId;
  } else if (typeof sessionId === 'number') {
    this._generateSessionId = function() {
      return random.string(sessionId);
    };
  } else {
    throw new TypeError('If sessionId is used in the options, it needs to be a number or a function.');
  }

  this._server = options.server || random.numberString(1000);

  // Step 1 of WS spec - parse and validate the url. Issue #8
  var parsedUrl = new URL(url);
  if (!parsedUrl.host || !parsedUrl.protocol) {
    throw new SyntaxError("The URL '" + url + "' is invalid");
  } else if (parsedUrl.hash) {
    throw new SyntaxError('The URL must not contain a fragment');
  } else if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new SyntaxError("The URL's scheme must be either 'http:' or 'https:'. '" + parsedUrl.protocol + "' is not allowed.");
  }

  var secure = parsedUrl.protocol === 'https:';
  // Step 2 - don't allow secure origin with an insecure protocol
  if (loc.protocol === 'https' && !secure) {
    throw new Error('SecurityError: An insecure SockJS connection may not be initiated from a page loaded over HTTPS');
  }

  // Step 3 - check port access - no need here
  // Step 4 - parse protocols argument
  if (!protocols) {
    protocols = [];
  } else if (!Array.isArray(protocols)) {
    protocols = [protocols];
  }

  // Step 5 - check protocols argument
  var sortedProtocols = protocols.sort();
  sortedProtocols.forEach(function(proto, i) {
    if (!proto) {
      throw new SyntaxError("The protocols entry '" + proto + "' is invalid.");
    }
    if (i < (sortedProtocols.length - 1) && proto === sortedProtocols[i + 1]) {
      throw new SyntaxError("The protocols entry '" + proto + "' is duplicated.");
    }
  });

  // Step 6 - convert origin
  var o = urlUtils.getOrigin(loc.href);
  this._origin = o ? o.toLowerCase() : null;

  // remove the trailing slash
  parsedUrl.set('pathname', parsedUrl.pathname.replace(/\/+$/, ''));

  // store the sanitized url
  this.url = parsedUrl.href;
  debug('using url', this.url);

  // Step 7 - start connection in background
  // obtain server info
  // http://sockjs.github.io/sockjs-protocol/sockjs-protocol-0.3.3.html#section-26
  this._urlInfo = {
    nullOrigin: !browser.hasDomain()
  , sameOrigin: urlUtils.isOriginEqual(this.url, loc.href)
  , sameScheme: urlUtils.isSchemeEqual(this.url, loc.href)
  };

  this._ir = new InfoReceiver(this.url, this._urlInfo);
  this._ir.once('finish', this._receiveInfo.bind(this));
}

inherits(SockJS, EventTarget);

function userSetCode(code) {
  return code === 1000 || (code >= 3000 && code <= 4999);
}

SockJS.prototype.close = function(code, reason) {
  // Step 1
  if (code && !userSetCode(code)) {
    throw new Error('InvalidAccessError: Invalid code');
  }
  // Step 2.4 states the max is 123 bytes, but we are just checking length
  if (reason && reason.length > 123) {
    throw new SyntaxError('reason argument has an invalid length');
  }

  // Step 3.1
  if (this.readyState === SockJS.CLOSING || this.readyState === SockJS.CLOSED) {
    return;
  }

  // TODO look at docs to determine how to set this
  var wasClean = true;
  this._close(code || 1000, reason || 'Normal closure', wasClean);
};

SockJS.prototype.send = function(data) {
  // #13 - convert anything non-string to string
  // TODO this currently turns objects into [object Object]
  if (typeof data !== 'string') {
    data = '' + data;
  }
  if (this.readyState === SockJS.CONNECTING) {
    throw new Error('InvalidStateError: The connection has not been established yet');
  }
  if (this.readyState !== SockJS.OPEN) {
    return;
  }
  this._transport.send(escape.quote(data));
};

SockJS.version = __webpack_require__("../node_modules/sockjs-client/lib/version.js");

SockJS.CONNECTING = 0;
SockJS.OPEN = 1;
SockJS.CLOSING = 2;
SockJS.CLOSED = 3;

SockJS.prototype._receiveInfo = function(info, rtt) {
  debug('_receiveInfo', rtt);
  this._ir = null;
  if (!info) {
    this._close(1002, 'Cannot connect to server');
    return;
  }

  // establish a round-trip timeout (RTO) based on the
  // round-trip time (RTT)
  this._rto = this.countRTO(rtt);
  // allow server to override url used for the actual transport
  this._transUrl = info.base_url ? info.base_url : this.url;
  info = objectUtils.extend(info, this._urlInfo);
  debug('info', info);
  // determine list of desired and supported transports
  var enabledTransports = transports.filterToEnabled(this._transportsWhitelist, info);
  this._transports = enabledTransports.main;
  debug(this._transports.length + ' enabled transports');

  this._connect();
};

SockJS.prototype._connect = function() {
  for (var Transport = this._transports.shift(); Transport; Transport = this._transports.shift()) {
    debug('attempt', Transport.transportName);
    if (Transport.needBody) {
      if (!global.document.body ||
          (typeof global.document.readyState !== 'undefined' &&
            global.document.readyState !== 'complete' &&
            global.document.readyState !== 'interactive')) {
        debug('waiting for body');
        this._transports.unshift(Transport);
        eventUtils.attachEvent('load', this._connect.bind(this));
        return;
      }
    }

    // calculate timeout based on RTO and round trips. Default to 5s
    var timeoutMs = (this._rto * Transport.roundTrips) || 5000;
    this._transportTimeoutId = setTimeout(this._transportTimeout.bind(this), timeoutMs);
    debug('using timeout', timeoutMs);

    var transportUrl = urlUtils.addPath(this._transUrl, '/' + this._server + '/' + this._generateSessionId());
    var options = this._transportOptions[Transport.transportName];
    debug('transport url', transportUrl);
    var transportObj = new Transport(transportUrl, this._transUrl, options);
    transportObj.on('message', this._transportMessage.bind(this));
    transportObj.once('close', this._transportClose.bind(this));
    transportObj.transportName = Transport.transportName;
    this._transport = transportObj;

    return;
  }
  this._close(2000, 'All transports failed', false);
};

SockJS.prototype._transportTimeout = function() {
  debug('_transportTimeout');
  if (this.readyState === SockJS.CONNECTING) {
    this._transportClose(2007, 'Transport timed out');
  }
};

SockJS.prototype._transportMessage = function(msg) {
  debug('_transportMessage', msg);
  var self = this
    , type = msg.slice(0, 1)
    , content = msg.slice(1)
    , payload
    ;

  // first check for messages that don't need a payload
  switch (type) {
    case 'o':
      this._open();
      return;
    case 'h':
      this.dispatchEvent(new Event('heartbeat'));
      debug('heartbeat', this.transport);
      return;
  }

  if (content) {
    try {
      payload = JSON3.parse(content);
    } catch (e) {
      debug('bad json', content);
    }
  }

  if (typeof payload === 'undefined') {
    debug('empty payload', content);
    return;
  }

  switch (type) {
    case 'a':
      if (Array.isArray(payload)) {
        payload.forEach(function(p) {
          debug('message', self.transport, p);
          self.dispatchEvent(new TransportMessageEvent(p));
        });
      }
      break;
    case 'm':
      debug('message', this.transport, payload);
      this.dispatchEvent(new TransportMessageEvent(payload));
      break;
    case 'c':
      if (Array.isArray(payload) && payload.length === 2) {
        this._close(payload[0], payload[1], true);
      }
      break;
  }
};

SockJS.prototype._transportClose = function(code, reason) {
  debug('_transportClose', this.transport, code, reason);
  if (this._transport) {
    this._transport.removeAllListeners();
    this._transport = null;
    this.transport = null;
  }

  if (!userSetCode(code) && code !== 2000 && this.readyState === SockJS.CONNECTING) {
    this._connect();
    return;
  }

  this._close(code, reason);
};

SockJS.prototype._open = function() {
  debug('_open', this._transport.transportName, this.readyState);
  if (this.readyState === SockJS.CONNECTING) {
    if (this._transportTimeoutId) {
      clearTimeout(this._transportTimeoutId);
      this._transportTimeoutId = null;
    }
    this.readyState = SockJS.OPEN;
    this.transport = this._transport.transportName;
    this.dispatchEvent(new Event('open'));
    debug('connected', this.transport);
  } else {
    // The server might have been restarted, and lost track of our
    // connection.
    this._close(1006, 'Server lost session');
  }
};

SockJS.prototype._close = function(code, reason, wasClean) {
  debug('_close', this.transport, code, reason, wasClean, this.readyState);
  var forceFail = false;

  if (this._ir) {
    forceFail = true;
    this._ir.close();
    this._ir = null;
  }
  if (this._transport) {
    this._transport.close();
    this._transport = null;
    this.transport = null;
  }

  if (this.readyState === SockJS.CLOSED) {
    throw new Error('InvalidStateError: SockJS has already been closed');
  }

  this.readyState = SockJS.CLOSING;
  setTimeout(function() {
    this.readyState = SockJS.CLOSED;

    if (forceFail) {
      this.dispatchEvent(new Event('error'));
    }

    var e = new CloseEvent('close');
    e.wasClean = wasClean || false;
    e.code = code || 1000;
    e.reason = reason;

    this.dispatchEvent(e);
    this.onmessage = this.onclose = this.onerror = null;
    debug('disconnected');
  }.bind(this), 0);
};

// See: http://www.erg.abdn.ac.uk/~gerrit/dccp/notes/ccid2/rto_estimator/
// and RFC 2988.
SockJS.prototype.countRTO = function(rtt) {
  // In a local environment, when using IE8/9 and the `jsonp-polling`
  // transport the time needed to establish a connection (the time that pass
  // from the opening of the transport to the call of `_dispatchOpen`) is
  // around 200msec (the lower bound used in the article above) and this
  // causes spurious timeouts. For this reason we calculate a value slightly
  // larger than that used in the article.
  if (rtt > 100) {
    return 4 * rtt; // rto > 400msec
  }
  return 300 + rtt; // 300msec < rto <= 400msec
};

module.exports = function(availableTransports) {
  transports = transport(availableTransports);
  __webpack_require__("../node_modules/sockjs-client/lib/iframe-bootstrap.js")(SockJS, availableTransports);
  return SockJS;
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../node_modules/sockjs-client/lib/shims.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* eslint-disable */
/* jscs: disable */


// pulled specific shims from https://github.com/es-shims/es5-shim

var ArrayPrototype = Array.prototype;
var ObjectPrototype = Object.prototype;
var FunctionPrototype = Function.prototype;
var StringPrototype = String.prototype;
var array_slice = ArrayPrototype.slice;

var _toString = ObjectPrototype.toString;
var isFunction = function (val) {
    return ObjectPrototype.toString.call(val) === '[object Function]';
};
var isArray = function isArray(obj) {
    return _toString.call(obj) === '[object Array]';
};
var isString = function isString(obj) {
    return _toString.call(obj) === '[object String]';
};

var supportsDescriptors = Object.defineProperty && (function () {
    try {
        Object.defineProperty({}, 'x', {});
        return true;
    } catch (e) { /* this is ES3 */
        return false;
    }
}());

// Define configurable, writable and non-enumerable props
// if they don't exist.
var defineProperty;
if (supportsDescriptors) {
    defineProperty = function (object, name, method, forceAssign) {
        if (!forceAssign && (name in object)) { return; }
        Object.defineProperty(object, name, {
            configurable: true,
            enumerable: false,
            writable: true,
            value: method
        });
    };
} else {
    defineProperty = function (object, name, method, forceAssign) {
        if (!forceAssign && (name in object)) { return; }
        object[name] = method;
    };
}
var defineProperties = function (object, map, forceAssign) {
    for (var name in map) {
        if (ObjectPrototype.hasOwnProperty.call(map, name)) {
          defineProperty(object, name, map[name], forceAssign);
        }
    }
};

var toObject = function (o) {
    if (o == null) { // this matches both null and undefined
        throw new TypeError("can't convert " + o + ' to object');
    }
    return Object(o);
};

//
// Util
// ======
//

// ES5 9.4
// http://es5.github.com/#x9.4
// http://jsperf.com/to-integer

function toInteger(num) {
    var n = +num;
    if (n !== n) { // isNaN
        n = 0;
    } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
    }
    return n;
}

function ToUint32(x) {
    return x >>> 0;
}

//
// Function
// ========
//

// ES-5 15.3.4.5
// http://es5.github.com/#x15.3.4.5

function Empty() {}

defineProperties(FunctionPrototype, {
    bind: function bind(that) { // .length is 1
        // 1. Let Target be the this value.
        var target = this;
        // 2. If IsCallable(Target) is false, throw a TypeError exception.
        if (!isFunction(target)) {
            throw new TypeError('Function.prototype.bind called on incompatible ' + target);
        }
        // 3. Let A be a new (possibly empty) internal list of all of the
        //   argument values provided after thisArg (arg1, arg2 etc), in order.
        // XXX slicedArgs will stand in for "A" if used
        var args = array_slice.call(arguments, 1); // for normal call
        // 4. Let F be a new native ECMAScript object.
        // 11. Set the [[Prototype]] internal property of F to the standard
        //   built-in Function prototype object as specified in 15.3.3.1.
        // 12. Set the [[Call]] internal property of F as described in
        //   15.3.4.5.1.
        // 13. Set the [[Construct]] internal property of F as described in
        //   15.3.4.5.2.
        // 14. Set the [[HasInstance]] internal property of F as described in
        //   15.3.4.5.3.
        var binder = function () {

            if (this instanceof bound) {
                // 15.3.4.5.2 [[Construct]]
                // When the [[Construct]] internal method of a function object,
                // F that was created using the bind function is called with a
                // list of arguments ExtraArgs, the following steps are taken:
                // 1. Let target be the value of F's [[TargetFunction]]
                //   internal property.
                // 2. If target has no [[Construct]] internal method, a
                //   TypeError exception is thrown.
                // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the
                //   list boundArgs in the same order followed by the same
                //   values as the list ExtraArgs in the same order.
                // 5. Return the result of calling the [[Construct]] internal
                //   method of target providing args as the arguments.

                var result = target.apply(
                    this,
                    args.concat(array_slice.call(arguments))
                );
                if (Object(result) === result) {
                    return result;
                }
                return this;

            } else {
                // 15.3.4.5.1 [[Call]]
                // When the [[Call]] internal method of a function object, F,
                // which was created using the bind function is called with a
                // this value and a list of arguments ExtraArgs, the following
                // steps are taken:
                // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 2. Let boundThis be the value of F's [[BoundThis]] internal
                //   property.
                // 3. Let target be the value of F's [[TargetFunction]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the
                //   list boundArgs in the same order followed by the same
                //   values as the list ExtraArgs in the same order.
                // 5. Return the result of calling the [[Call]] internal method
                //   of target providing boundThis as the this value and
                //   providing args as the arguments.

                // equiv: target.call(this, ...boundArgs, ...args)
                return target.apply(
                    that,
                    args.concat(array_slice.call(arguments))
                );

            }

        };

        // 15. If the [[Class]] internal property of Target is "Function", then
        //     a. Let L be the length property of Target minus the length of A.
        //     b. Set the length own property of F to either 0 or L, whichever is
        //       larger.
        // 16. Else set the length own property of F to 0.

        var boundLength = Math.max(0, target.length - args.length);

        // 17. Set the attributes of the length own property of F to the values
        //   specified in 15.3.5.1.
        var boundArgs = [];
        for (var i = 0; i < boundLength; i++) {
            boundArgs.push('$' + i);
        }

        // XXX Build a dynamic function with desired amount of arguments is the only
        // way to set the length property of a function.
        // In environments where Content Security Policies enabled (Chrome extensions,
        // for ex.) all use of eval or Function costructor throws an exception.
        // However in all of these environments Function.prototype.bind exists
        // and so this code will never be executed.
        var bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this, arguments); }')(binder);

        if (target.prototype) {
            Empty.prototype = target.prototype;
            bound.prototype = new Empty();
            // Clean up dangling references.
            Empty.prototype = null;
        }

        // TODO
        // 18. Set the [[Extensible]] internal property of F to true.

        // TODO
        // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
        // 20. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
        //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
        //   false.
        // 21. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
        //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
        //   and false.

        // TODO
        // NOTE Function objects created using Function.prototype.bind do not
        // have a prototype property or the [[Code]], [[FormalParameters]], and
        // [[Scope]] internal properties.
        // XXX can't delete prototype in pure-js.

        // 22. Return F.
        return bound;
    }
});

//
// Array
// =====
//

// ES5 15.4.3.2
// http://es5.github.com/#x15.4.3.2
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
defineProperties(Array, { isArray: isArray });


var boxedString = Object('a');
var splitString = boxedString[0] !== 'a' || !(0 in boxedString);

var properlyBoxesContext = function properlyBoxed(method) {
    // Check node 0.6.21 bug where third parameter is not boxed
    var properlyBoxesNonStrict = true;
    var properlyBoxesStrict = true;
    if (method) {
        method.call('foo', function (_, __, context) {
            if (typeof context !== 'object') { properlyBoxesNonStrict = false; }
        });

        method.call([1], function () {
            'use strict';
            properlyBoxesStrict = typeof this === 'string';
        }, 'x');
    }
    return !!method && properlyBoxesNonStrict && properlyBoxesStrict;
};

defineProperties(ArrayPrototype, {
    forEach: function forEach(fun /*, thisp*/) {
        var object = toObject(this),
            self = splitString && isString(this) ? this.split('') : object,
            thisp = arguments[1],
            i = -1,
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (!isFunction(fun)) {
            throw new TypeError(); // TODO message
        }

        while (++i < length) {
            if (i in self) {
                // Invoke the callback function with call, passing arguments:
                // context, property value, property key, thisArg object
                // context
                fun.call(thisp, self[i], i, object);
            }
        }
    }
}, !properlyBoxesContext(ArrayPrototype.forEach));

// ES5 15.4.4.14
// http://es5.github.com/#x15.4.4.14
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
var hasFirefox2IndexOfBug = Array.prototype.indexOf && [0, 1].indexOf(1, 2) !== -1;
defineProperties(ArrayPrototype, {
    indexOf: function indexOf(sought /*, fromIndex */ ) {
        var self = splitString && isString(this) ? this.split('') : toObject(this),
            length = self.length >>> 0;

        if (!length) {
            return -1;
        }

        var i = 0;
        if (arguments.length > 1) {
            i = toInteger(arguments[1]);
        }

        // handle negative indices
        i = i >= 0 ? i : Math.max(0, length + i);
        for (; i < length; i++) {
            if (i in self && self[i] === sought) {
                return i;
            }
        }
        return -1;
    }
}, hasFirefox2IndexOfBug);

//
// String
// ======
//

// ES5 15.5.4.14
// http://es5.github.com/#x15.5.4.14

// [bugfix, IE lt 9, firefox 4, Konqueror, Opera, obscure browsers]
// Many browsers do not split properly with regular expressions or they
// do not perform the split correctly under obscure conditions.
// See http://blog.stevenlevithan.com/archives/cross-browser-split
// I've tested in many browsers and this seems to cover the deviant ones:
//    'ab'.split(/(?:ab)*/) should be ["", ""], not [""]
//    '.'.split(/(.?)(.?)/) should be ["", ".", "", ""], not ["", ""]
//    'tesst'.split(/(s)*/) should be ["t", undefined, "e", "s", "t"], not
//       [undefined, "t", undefined, "e", ...]
//    ''.split(/.?/) should be [], not [""]
//    '.'.split(/()()/) should be ["."], not ["", "", "."]

var string_split = StringPrototype.split;
if (
    'ab'.split(/(?:ab)*/).length !== 2 ||
    '.'.split(/(.?)(.?)/).length !== 4 ||
    'tesst'.split(/(s)*/)[1] === 't' ||
    'test'.split(/(?:)/, -1).length !== 4 ||
    ''.split(/.?/).length ||
    '.'.split(/()()/).length > 1
) {
    (function () {
        var compliantExecNpcg = /()??/.exec('')[1] === void 0; // NPCG: nonparticipating capturing group

        StringPrototype.split = function (separator, limit) {
            var string = this;
            if (separator === void 0 && limit === 0) {
                return [];
            }

            // If `separator` is not a regex, use native split
            if (_toString.call(separator) !== '[object RegExp]') {
                return string_split.call(this, separator, limit);
            }

            var output = [],
                flags = (separator.ignoreCase ? 'i' : '') +
                        (separator.multiline  ? 'm' : '') +
                        (separator.extended   ? 'x' : '') + // Proposed for ES6
                        (separator.sticky     ? 'y' : ''), // Firefox 3+
                lastLastIndex = 0,
                // Make `global` and avoid `lastIndex` issues by working with a copy
                separator2, match, lastIndex, lastLength;
            separator = new RegExp(separator.source, flags + 'g');
            string += ''; // Type-convert
            if (!compliantExecNpcg) {
                // Doesn't need flags gy, but they don't hurt
                separator2 = new RegExp('^' + separator.source + '$(?!\\s)', flags);
            }
            /* Values for `limit`, per the spec:
             * If undefined: 4294967295 // Math.pow(2, 32) - 1
             * If 0, Infinity, or NaN: 0
             * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
             * If negative number: 4294967296 - Math.floor(Math.abs(limit))
             * If other: Type-convert, then use the above rules
             */
            limit = limit === void 0 ?
                -1 >>> 0 : // Math.pow(2, 32) - 1
                ToUint32(limit);
            while (match = separator.exec(string)) {
                // `separator.lastIndex` is not reliable cross-browser
                lastIndex = match.index + match[0].length;
                if (lastIndex > lastLastIndex) {
                    output.push(string.slice(lastLastIndex, match.index));
                    // Fix browsers whose `exec` methods don't consistently return `undefined` for
                    // nonparticipating capturing groups
                    if (!compliantExecNpcg && match.length > 1) {
                        match[0].replace(separator2, function () {
                            for (var i = 1; i < arguments.length - 2; i++) {
                                if (arguments[i] === void 0) {
                                    match[i] = void 0;
                                }
                            }
                        });
                    }
                    if (match.length > 1 && match.index < string.length) {
                        ArrayPrototype.push.apply(output, match.slice(1));
                    }
                    lastLength = match[0].length;
                    lastLastIndex = lastIndex;
                    if (output.length >= limit) {
                        break;
                    }
                }
                if (separator.lastIndex === match.index) {
                    separator.lastIndex++; // Avoid an infinite loop
                }
            }
            if (lastLastIndex === string.length) {
                if (lastLength || !separator.test('')) {
                    output.push('');
                }
            } else {
                output.push(string.slice(lastLastIndex));
            }
            return output.length > limit ? output.slice(0, limit) : output;
        };
    }());

// [bugfix, chrome]
// If separator is undefined, then the result array contains just one String,
// which is the this value (converted to a String). If limit is not undefined,
// then the output array is truncated so that it contains no more than limit
// elements.
// "0".split(undefined, 0) -> []
} else if ('0'.split(void 0, 0).length) {
    StringPrototype.split = function split(separator, limit) {
        if (separator === void 0 && limit === 0) { return []; }
        return string_split.call(this, separator, limit);
    };
}

// ECMA-262, 3rd B.2.3
// Not an ECMAScript standard, although ECMAScript 3rd Edition has a
// non-normative section suggesting uniform semantics and it should be
// normalized across all browsers
// [bugfix, IE lt 9] IE < 9 substr() with negative value not working in IE
var string_substr = StringPrototype.substr;
var hasNegativeSubstrBug = ''.substr && '0b'.substr(-1) !== 'b';
defineProperties(StringPrototype, {
    substr: function substr(start, length) {
        return string_substr.call(
            this,
            start < 0 ? ((start = this.length + start) < 0 ? 0 : start) : start,
            length
        );
    }
}, hasNegativeSubstrBug);


/***/ }),

/***/ "../node_modules/sockjs-client/lib/transport-list.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = [
  // streaming transports
  __webpack_require__("../node_modules/sockjs-client/lib/transport/websocket.js")
, __webpack_require__("../node_modules/sockjs-client/lib/transport/xhr-streaming.js")
, __webpack_require__("../node_modules/sockjs-client/lib/transport/xdr-streaming.js")
, __webpack_require__("../node_modules/sockjs-client/lib/transport/eventsource.js")
, __webpack_require__("../node_modules/sockjs-client/lib/transport/lib/iframe-wrap.js")(__webpack_require__("../node_modules/sockjs-client/lib/transport/eventsource.js"))

  // polling transports
, __webpack_require__("../node_modules/sockjs-client/lib/transport/htmlfile.js")
, __webpack_require__("../node_modules/sockjs-client/lib/transport/lib/iframe-wrap.js")(__webpack_require__("../node_modules/sockjs-client/lib/transport/htmlfile.js"))
, __webpack_require__("../node_modules/sockjs-client/lib/transport/xhr-polling.js")
, __webpack_require__("../node_modules/sockjs-client/lib/transport/xdr-polling.js")
, __webpack_require__("../node_modules/sockjs-client/lib/transport/lib/iframe-wrap.js")(__webpack_require__("../node_modules/sockjs-client/lib/transport/xhr-polling.js"))
, __webpack_require__("../node_modules/sockjs-client/lib/transport/jsonp-polling.js")
];


/***/ }),

/***/ "../node_modules/sockjs-client/lib/transport/browser/abstract-xhr.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var EventEmitter = __webpack_require__("../node_modules/sockjs-client/lib/event/emitter.js").EventEmitter
  , inherits = __webpack_require__("../node_modules/inherits/inherits_browser.js")
  , utils = __webpack_require__("../node_modules/sockjs-client/lib/utils/event.js")
  , urlUtils = __webpack_require__("../node_modules/sockjs-client/lib/utils/url.js")
  , XHR = global.XMLHttpRequest
  ;

var debug = function() {};
if (true) {
  debug = __webpack_require__("../node_modules/debug/src/browser.js")('sockjs-client:browser:xhr');
}

function AbstractXHRObject(method, url, payload, opts) {
  debug(method, url);
  var self = this;
  EventEmitter.call(this);

  setTimeout(function () {
    self._start(method, url, payload, opts);
  }, 0);
}

inherits(AbstractXHRObject, EventEmitter);

AbstractXHRObject.prototype._start = function(method, url, payload, opts) {
  var self = this;

  try {
    this.xhr = new XHR();
  } catch (x) {
    // intentionally empty
  }

  if (!this.xhr) {
    debug('no xhr');
    this.emit('finish', 0, 'no xhr support');
    this._cleanup();
    return;
  }

  // several browsers cache POSTs
  url = urlUtils.addQuery(url, 't=' + (+new Date()));

  // Explorer tends to keep connection open, even after the
  // tab gets closed: http://bugs.jquery.com/ticket/5280
  this.unloadRef = utils.unloadAdd(function() {
    debug('unload cleanup');
    self._cleanup(true);
  });
  try {
    this.xhr.open(method, url, true);
    if (this.timeout && 'timeout' in this.xhr) {
      this.xhr.timeout = this.timeout;
      this.xhr.ontimeout = function() {
        debug('xhr timeout');
        self.emit('finish', 0, '');
        self._cleanup(false);
      };
    }
  } catch (e) {
    debug('exception', e);
    // IE raises an exception on wrong port.
    this.emit('finish', 0, '');
    this._cleanup(false);
    return;
  }

  if ((!opts || !opts.noCredentials) && AbstractXHRObject.supportsCORS) {
    debug('withCredentials');
    // Mozilla docs says https://developer.mozilla.org/en/XMLHttpRequest :
    // "This never affects same-site requests."

    this.xhr.withCredentials = 'true';
  }
  if (opts && opts.headers) {
    for (var key in opts.headers) {
      this.xhr.setRequestHeader(key, opts.headers[key]);
    }
  }

  this.xhr.onreadystatechange = function() {
    if (self.xhr) {
      var x = self.xhr;
      var text, status;
      debug('readyState', x.readyState);
      switch (x.readyState) {
      case 3:
        // IE doesn't like peeking into responseText or status
        // on Microsoft.XMLHTTP and readystate=3
        try {
          status = x.status;
          text = x.responseText;
        } catch (e) {
          // intentionally empty
        }
        debug('status', status);
        // IE returns 1223 for 204: http://bugs.jquery.com/ticket/1450
        if (status === 1223) {
          status = 204;
        }

        // IE does return readystate == 3 for 404 answers.
        if (status === 200 && text && text.length > 0) {
          debug('chunk');
          self.emit('chunk', status, text);
        }
        break;
      case 4:
        status = x.status;
        debug('status', status);
        // IE returns 1223 for 204: http://bugs.jquery.com/ticket/1450
        if (status === 1223) {
          status = 204;
        }
        // IE returns this for a bad port
        // http://msdn.microsoft.com/en-us/library/windows/desktop/aa383770(v=vs.85).aspx
        if (status === 12005 || status === 12029) {
          status = 0;
        }

        debug('finish', status, x.responseText);
        self.emit('finish', status, x.responseText);
        self._cleanup(false);
        break;
      }
    }
  };

  try {
    self.xhr.send(payload);
  } catch (e) {
    self.emit('finish', 0, '');
    self._cleanup(false);
  }
};

AbstractXHRObject.prototype._cleanup = function(abort) {
  debug('cleanup');
  if (!this.xhr) {
    return;
  }
  this.removeAllListeners();
  utils.unloadDel(this.unloadRef);

  // IE needs this field to be a function
  this.xhr.onreadystatechange = function() {};
  if (this.xhr.ontimeout) {
    this.xhr.ontimeout = null;
  }

  if (abort) {
    try {
      this.xhr.abort();
    } catch (x) {
      // intentionally empty
    }
  }
  this.unloadRef = this.xhr = null;
};

AbstractXHRObject.prototype.close = function() {
  debug('close');
  this._cleanup(true);
};

AbstractXHRObject.enabled = !!XHR;
// override XMLHttpRequest for IE6/7
// obfuscate to avoid firewalls
var axo = ['Active'].concat('Object').join('X');
if (!AbstractXHRObject.enabled && (axo in global)) {
  debug('overriding xmlhttprequest');
  XHR = function() {
    try {
      return new global[axo]('Microsoft.XMLHTTP');
    } catch (e) {
      return null;
    }
  };
  AbstractXHRObject.enabled = !!new XHR();
}

var cors = false;
try {
  cors = 'withCredentials' in new XHR();
} catch (ignored) {
  // intentionally empty
}

AbstractXHRObject.supportsCORS = cors;

module.exports = AbstractXHRObject;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../node_modules/sockjs-client/lib/transport/browser/eventsource.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global.EventSource;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../node_modules/sockjs-client/lib/transport/browser/websocket.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var Driver = global.WebSocket || global.MozWebSocket;
if (Driver) {
	module.exports = function WebSocketBrowserDriver(url) {
		return new Driver(url);
	};
} else {
	module.exports = undefined;
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../node_modules/sockjs-client/lib/transport/eventsource.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inherits = __webpack_require__("../node_modules/inherits/inherits_browser.js")
  , AjaxBasedTransport = __webpack_require__("../node_modules/sockjs-client/lib/transport/lib/ajax-based.js")
  , EventSourceReceiver = __webpack_require__("../node_modules/sockjs-client/lib/transport/receiver/eventsource.js")
  , XHRCorsObject = __webpack_require__("../node_modules/sockjs-client/lib/transport/sender/xhr-cors.js")
  , EventSourceDriver = __webpack_require__("../node_modules/sockjs-client/lib/transport/browser/eventsource.js")
  ;

function EventSourceTransport(transUrl) {
  if (!EventSourceTransport.enabled()) {
    throw new Error('Transport created when disabled');
  }

  AjaxBasedTransport.call(this, transUrl, '/eventsource', EventSourceReceiver, XHRCorsObject);
}

inherits(EventSourceTransport, AjaxBasedTransport);

EventSourceTransport.enabled = function() {
  return !!EventSourceDriver;
};

EventSourceTransport.transportName = 'eventsource';
EventSourceTransport.roundTrips = 2;

module.exports = EventSourceTransport;


/***/ }),

/***/ "../node_modules/sockjs-client/lib/transport/htmlfile.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inherits = __webpack_require__("../node_modules/inherits/inherits_browser.js")
  , HtmlfileReceiver = __webpack_require__("../node_modules/sockjs-client/lib/transport/receiver/htmlfile.js")
  , XHRLocalObject = __webpack_require__("../node_modules/sockjs-client/lib/transport/sender/xhr-local.js")
  , AjaxBasedTransport = __webpack_require__("../node_modules/sockjs-client/lib/transport/lib/ajax-based.js")
  ;

function HtmlFileTransport(transUrl) {
  if (!HtmlfileReceiver.enabled) {
    throw new Error('Transport created when disabled');
  }
  AjaxBasedTransport.call(this, transUrl, '/htmlfile', HtmlfileReceiver, XHRLocalObject);
}

inherits(HtmlFileTransport, AjaxBasedTransport);

HtmlFileTransport.enabled = function(info) {
  return HtmlfileReceiver.enabled && info.sameOrigin;
};

HtmlFileTransport.transportName = 'htmlfile';
HtmlFileTransport.roundTrips = 2;

module.exports = HtmlFileTransport;


/***/ }),

/***/ "../node_modules/sockjs-client/lib/transport/iframe.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Few cool transports do work only for same-origin. In order to make
// them work cross-domain we shall use iframe, served from the
// remote domain. New browsers have capabilities to communicate with
// cross domain iframe using postMessage(). In IE it was implemented
// from IE 8+, but of course, IE got some details wrong:
//    http://msdn.microsoft.com/en-us/library/cc197015(v=VS.85).aspx
//    http://stevesouders.com/misc/test-postmessage.php

var inherits = __webpack_require__("../node_modules/inherits/inherits_browser.js")
  , JSON3 = __webpack_require__("../node_modules/json3/lib/json3.js")
  , EventEmitter = __webpack_require__("../node_modules/sockjs-client/lib/event/emitter.js").EventEmitter
  , version = __webpack_require__("../node_modules/sockjs-client/lib/version.js")
  , urlUtils = __webpack_require__("../node_modules/sockjs-client/lib/utils/url.js")
  , iframeUtils = __webpack_require__("../node_modules/sockjs-client/lib/utils/iframe.js")
  , eventUtils = __webpack_require__("../node_modules/sockjs-client/lib/utils/event.js")
  , random = __webpack_require__("../node_modules/sockjs-client/lib/utils/random.js")
  ;

var debug = function() {};
if (true) {
  debug = __webpack_require__("../node_modules/debug/src/browser.js")('sockjs-client:transport:iframe');
}

function IframeTransport(transport, transUrl, baseUrl) {
  if (!IframeTransport.enabled()) {
    throw new Error('Transport created when disabled');
  }
  EventEmitter.call(this);

  var self = this;
  this.origin = urlUtils.getOrigin(baseUrl);
  this.baseUrl = baseUrl;
  this.transUrl = transUrl;
  this.transport = transport;
  this.windowId = random.string(8);

  var iframeUrl = urlUtils.addPath(baseUrl, '/iframe.html') + '#' + this.windowId;
  debug(transport, transUrl, iframeUrl);

  this.iframeObj = iframeUtils.createIframe(iframeUrl, function(r) {
    debug('err callback');
    self.emit('close', 1006, 'Unable to load an iframe (' + r + ')');
    self.close();
  });

  this.onmessageCallback = this._message.bind(this);
  eventUtils.attachEvent('message', this.onmessageCallback);
}

inherits(IframeTransport, EventEmitter);

IframeTransport.prototype.close = function() {
  debug('close');
  this.removeAllListeners();
  if (this.iframeObj) {
    eventUtils.detachEvent('message', this.onmessageCallback);
    try {
      // When the iframe is not loaded, IE raises an exception
      // on 'contentWindow'.
      this.postMessage('c');
    } catch (x) {
      // intentionally empty
    }
    this.iframeObj.cleanup();
    this.iframeObj = null;
    this.onmessageCallback = this.iframeObj = null;
  }
};

IframeTransport.prototype._message = function(e) {
  debug('message', e.data);
  if (!urlUtils.isOriginEqual(e.origin, this.origin)) {
    debug('not same origin', e.origin, this.origin);
    return;
  }

  var iframeMessage;
  try {
    iframeMessage = JSON3.parse(e.data);
  } catch (ignored) {
    debug('bad json', e.data);
    return;
  }

  if (iframeMessage.windowId !== this.windowId) {
    debug('mismatched window id', iframeMessage.windowId, this.windowId);
    return;
  }

  switch (iframeMessage.type) {
  case 's':
    this.iframeObj.loaded();
    // window global dependency
    this.postMessage('s', JSON3.stringify([
      version
    , this.transport
    , this.transUrl
    , this.baseUrl
    ]));
    break;
  case 't':
    this.emit('message', iframeMessage.data);
    break;
  case 'c':
    var cdata;
    try {
      cdata = JSON3.parse(iframeMessage.data);
    } catch (ignored) {
      debug('bad json', iframeMessage.data);
      return;
    }
    this.emit('close', cdata[0], cdata[1]);
    this.close();
    break;
  }
};

IframeTransport.prototype.postMessage = function(type, data) {
  debug('postMessage', type, data);
  this.iframeObj.post(JSON3.stringify({
    windowId: this.windowId
  , type: type
  , data: data || ''
  }), this.origin);
};

IframeTransport.prototype.send = function(message) {
  debug('send', message);
  this.postMessage('m', message);
};

IframeTransport.enabled = function() {
  return iframeUtils.iframeEnabled;
};

IframeTransport.transportName = 'iframe';
IframeTransport.roundTrips = 2;

module.exports = IframeTransport;


/***/ }),

/***/ "../node_modules/sockjs-client/lib/transport/jsonp-polling.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

// The simplest and most robust transport, using the well-know cross
// domain hack - JSONP. This transport is quite inefficient - one
// message could use up to one http request. But at least it works almost
// everywhere.
// Known limitations:
//   o you will get a spinning cursor
//   o for Konqueror a dumb timer is needed to detect errors

var inherits = __webpack_require__("../node_modules/inherits/inherits_browser.js")
  , SenderReceiver = __webpack_require__("../node_modules/sockjs-client/lib/transport/lib/sender-receiver.js")
  , JsonpReceiver = __webpack_require__("../node_modules/sockjs-client/lib/transport/receiver/jsonp.js")
  , jsonpSender = __webpack_require__("../node_modules/sockjs-client/lib/transport/sender/jsonp.js")
  ;

function JsonPTransport(transUrl) {
  if (!JsonPTransport.enabled()) {
    throw new Error('Transport created when disabled');
  }
  SenderReceiver.call(this, transUrl, '/jsonp', jsonpSender, JsonpReceiver);
}

inherits(JsonPTransport, SenderReceiver);

JsonPTransport.enabled = function() {
  return !!global.document;
};

JsonPTransport.transportName = 'jsonp-polling';
JsonPTransport.roundTrips = 1;
JsonPTransport.needBody = true;

module.exports = JsonPTransport;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../node_modules/sockjs-client/lib/transport/lib/ajax-based.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inherits = __webpack_require__("../node_modules/inherits/inherits_browser.js")
  , urlUtils = __webpack_require__("../node_modules/sockjs-client/lib/utils/url.js")
  , SenderReceiver = __webpack_require__("../node_modules/sockjs-client/lib/transport/lib/sender-receiver.js")
  ;

var debug = function() {};
if (true) {
  debug = __webpack_require__("../node_modules/debug/src/browser.js")('sockjs-client:ajax-based');
}

function createAjaxSender(AjaxObject) {
  return function(url, payload, callback) {
    debug('create ajax sender', url, payload);
    var opt = {};
    if (typeof payload === 'string') {
      opt.headers = {'Content-type': 'text/plain'};
    }
    var ajaxUrl = urlUtils.addPath(url, '/xhr_send');
    var xo = new AjaxObject('POST', ajaxUrl, payload, opt);
    xo.once('finish', function(status) {
      debug('finish', status);
      xo = null;

      if (status !== 200 && status !== 204) {
        return callback(new Error('http status ' + status));
      }
      callback();
    });
    return function() {
      debug('abort');
      xo.close();
      xo = null;

      var err = new Error('Aborted');
      err.code = 1000;
      callback(err);
    };
  };
}

function AjaxBasedTransport(transUrl, urlSuffix, Receiver, AjaxObject) {
  SenderReceiver.call(this, transUrl, urlSuffix, createAjaxSender(AjaxObject), Receiver, AjaxObject);
}

inherits(AjaxBasedTransport, SenderReceiver);

module.exports = AjaxBasedTransport;


/***/ }),

/***/ "../node_modules/sockjs-client/lib/transport/lib/buffered-sender.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inherits = __webpack_require__("../node_modules/inherits/inherits_browser.js")
  , EventEmitter = __webpack_require__("../node_modules/sockjs-client/lib/event/emitter.js").EventEmitter
  ;

var debug = function() {};
if (true) {
  debug = __webpack_require__("../node_modules/debug/src/browser.js")('sockjs-client:buffered-sender');
}

function BufferedSender(url, sender) {
  debug(url);
  EventEmitter.call(this);
  this.sendBuffer = [];
  this.sender = sender;
  this.url = url;
}

inherits(BufferedSender, EventEmitter);

BufferedSender.prototype.send = function(message) {
  debug('send', message);
  this.sendBuffer.push(message);
  if (!this.sendStop) {
    this.sendSchedule();
  }
};

// For polling transports in a situation when in the message callback,
// new message is being send. If the sending connection was started
// before receiving one, it is possible to saturate the network and
// timeout due to the lack of receiving socket. To avoid that we delay
// sending messages by some small time, in order to let receiving
// connection be started beforehand. This is only a halfmeasure and
// does not fix the big problem, but it does make the tests go more
// stable on slow networks.
BufferedSender.prototype.sendScheduleWait = function() {
  debug('sendScheduleWait');
  var self = this;
  var tref;
  this.sendStop = function() {
    debug('sendStop');
    self.sendStop = null;
    clearTimeout(tref);
  };
  tref = setTimeout(function() {
    debug('timeout');
    self.sendStop = null;
    self.sendSchedule();
  }, 25);
};

BufferedSender.prototype.sendSchedule = function() {
  debug('sendSchedule', this.sendBuffer.length);
  var self = this;
  if (this.sendBuffer.length > 0) {
    var payload = '[' + this.sendBuffer.join(',') + ']';
    this.sendStop = this.sender(this.url, payload, function(err) {
      self.sendStop = null;
      if (err) {
        debug('error', err);
        self.emit('close', err.code || 1006, 'Sending error: ' + err);
        self.close();
      } else {
        self.sendScheduleWait();
      }
    });
    this.sendBuffer = [];
  }
};

BufferedSender.prototype._cleanup = function() {
  debug('_cleanup');
  this.removeAllListeners();
};

BufferedSender.prototype.close = function() {
  debug('close');
  this._cleanup();
  if (this.sendStop) {
    this.sendStop();
    this.sendStop = null;
  }
};

module.exports = BufferedSender;


/***/ }),

/***/ "../node_modules/sockjs-client/lib/transport/lib/iframe-wrap.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var inherits = __webpack_require__("../node_modules/inherits/inherits_browser.js")
  , IframeTransport = __webpack_require__("../node_modules/sockjs-client/lib/transport/iframe.js")
  , objectUtils = __webpack_require__("../node_modules/sockjs-client/lib/utils/object.js")
  ;

module.exports = function(transport) {

  function IframeWrapTransport(transUrl, baseUrl) {
    IframeTransport.call(this, transport.transportName, transUrl, baseUrl);
  }

  inherits(IframeWrapTransport, IframeTransport);

  IframeWrapTransport.enabled = function(url, info) {
    if (!global.document) {
      return false;
    }

    var iframeInfo = objectUtils.extend({}, info);
    iframeInfo.sameOrigin = true;
    return transport.enabled(iframeInfo) && IframeTransport.enabled();
  };

  IframeWrapTransport.transportName = 'iframe-' + transport.transportName;
  IframeWrapTransport.needBody = true;
  IframeWrapTransport.roundTrips = IframeTransport.roundTrips + transport.roundTrips - 1; // html, javascript (2) + transport - no CORS (1)

  IframeWrapTransport.facadeTransport = transport;

  return IframeWrapTransport;
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../node_modules/sockjs-client/lib/transport/lib/polling.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inherits = __webpack_require__("../node_modules/inherits/inherits_browser.js")
  , EventEmitter = __webpack_require__("../node_modules/sockjs-client/lib/event/emitter.js").EventEmitter
  ;

var debug = function() {};
if (true) {
  debug = __webpack_require__("../node_modules/debug/src/browser.js")('sockjs-client:polling');
}

function Polling(Receiver, receiveUrl, AjaxObject) {
  debug(receiveUrl);
  EventEmitter.call(this);
  this.Receiver = Receiver;
  this.receiveUrl = receiveUrl;
  this.AjaxObject = AjaxObject;
  this._scheduleReceiver();
}

inherits(Polling, EventEmitter);

Polling.prototype._scheduleReceiver = function() {
  debug('_scheduleReceiver');
  var self = this;
  var poll = this.poll = new this.Receiver(this.receiveUrl, this.AjaxObject);

  poll.on('message', function(msg) {
    debug('message', msg);
    self.emit('message', msg);
  });

  poll.once('close', function(code, reason) {
    debug('close', code, reason, self.pollIsClosing);
    self.poll = poll = null;

    if (!self.pollIsClosing) {
      if (reason === 'network') {
        self._scheduleReceiver();
      } else {
        self.emit('close', code || 1006, reason);
        self.removeAllListeners();
      }
    }
  });
};

Polling.prototype.abort = function() {
  debug('abort');
  this.removeAllListeners();
  this.pollIsClosing = true;
  if (this.poll) {
    this.poll.abort();
  }
};

module.exports = Polling;


/***/ }),

/***/ "../node_modules/sockjs-client/lib/transport/lib/sender-receiver.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inherits = __webpack_require__("../node_modules/inherits/inherits_browser.js")
  , urlUtils = __webpack_require__("../node_modules/sockjs-client/lib/utils/url.js")
  , BufferedSender = __webpack_require__("../node_modules/sockjs-client/lib/transport/lib/buffered-sender.js")
  , Polling = __webpack_require__("../node_modules/sockjs-client/lib/transport/lib/polling.js")
  ;

var debug = function() {};
if (true) {
  debug = __webpack_require__("../node_modules/debug/src/browser.js")('sockjs-client:sender-receiver');
}

function SenderReceiver(transUrl, urlSuffix, senderFunc, Receiver, AjaxObject) {
  var pollUrl = urlUtils.addPath(transUrl, urlSuffix);
  debug(pollUrl);
  var self = this;
  BufferedSender.call(this, transUrl, senderFunc);

  this.poll = new Polling(Receiver, pollUrl, AjaxObject);
  this.poll.on('message', function(msg) {
    debug('poll message', msg);
    self.emit('message', msg);
  });
  this.poll.once('close', function(code, reason) {
    debug('poll close', code, reason);
    self.poll = null;
    self.emit('close', code, reason);
    self.close();
  });
}

inherits(SenderReceiver, BufferedSender);

SenderReceiver.prototype.close = function() {
  BufferedSender.prototype.close.call(this);
  debug('close');
  this.removeAllListeners();
  if (this.poll) {
    this.poll.abort();
    this.poll = null;
  }
};

module.exports = SenderReceiver;


/***/ }),

/***/ "../node_modules/sockjs-client/lib/transport/receiver/eventsource.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inherits = __webpack_require__("../node_modules/inherits/inherits_browser.js")
  , EventEmitter = __webpack_require__("../node_modules/sockjs-client/lib/event/emitter.js").EventEmitter
  , EventSourceDriver = __webpack_require__("../node_modules/sockjs-client/lib/transport/browser/eventsource.js")
  ;

var debug = function() {};
if (true) {
  debug = __webpack_require__("../node_modules/debug/src/browser.js")('sockjs-client:receiver:eventsource');
}

function EventSourceReceiver(url) {
  debug(url);
  EventEmitter.call(this);

  var self = this;
  var es = this.es = new EventSourceDriver(url);
  es.onmessage = function(e) {
    debug('message', e.data);
    self.emit('message', decodeURI(e.data));
  };
  es.onerror = function(e) {
    debug('error', es.readyState, e);
    // ES on reconnection has readyState = 0 or 1.
    // on network error it's CLOSED = 2
    var reason = (es.readyState !== 2 ? 'network' : 'permanent');
    self._cleanup();
    self._close(reason);
  };
}

inherits(EventSourceReceiver, EventEmitter);

EventSourceReceiver.prototype.abort = function() {
  debug('abort');
  this._cleanup();
  this._close('user');
};

EventSourceReceiver.prototype._cleanup = function() {
  debug('cleanup');
  var es = this.es;
  if (es) {
    es.onmessage = es.onerror = null;
    es.close();
    this.es = null;
  }
};

EventSourceReceiver.prototype._close = function(reason) {
  debug('close', reason);
  var self = this;
  // Safari and chrome < 15 crash if we close window before
  // waiting for ES cleanup. See:
  // https://code.google.com/p/chromium/issues/detail?id=89155
  setTimeout(function() {
    self.emit('close', null, reason);
    self.removeAllListeners();
  }, 200);
};

module.exports = EventSourceReceiver;


/***/ }),

/***/ "../node_modules/sockjs-client/lib/transport/receiver/htmlfile.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var inherits = __webpack_require__("../node_modules/inherits/inherits_browser.js")
  , iframeUtils = __webpack_require__("../node_modules/sockjs-client/lib/utils/iframe.js")
  , urlUtils = __webpack_require__("../node_modules/sockjs-client/lib/utils/url.js")
  , EventEmitter = __webpack_require__("../node_modules/sockjs-client/lib/event/emitter.js").EventEmitter
  , random = __webpack_require__("../node_modules/sockjs-client/lib/utils/random.js")
  ;

var debug = function() {};
if (true) {
  debug = __webpack_require__("../node_modules/debug/src/browser.js")('sockjs-client:receiver:htmlfile');
}

function HtmlfileReceiver(url) {
  debug(url);
  EventEmitter.call(this);
  var self = this;
  iframeUtils.polluteGlobalNamespace();

  this.id = 'a' + random.string(6);
  url = urlUtils.addQuery(url, 'c=' + decodeURIComponent(iframeUtils.WPrefix + '.' + this.id));

  debug('using htmlfile', HtmlfileReceiver.htmlfileEnabled);
  var constructFunc = HtmlfileReceiver.htmlfileEnabled ?
      iframeUtils.createHtmlfile : iframeUtils.createIframe;

  global[iframeUtils.WPrefix][this.id] = {
    start: function() {
      debug('start');
      self.iframeObj.loaded();
    }
  , message: function(data) {
      debug('message', data);
      self.emit('message', data);
    }
  , stop: function() {
      debug('stop');
      self._cleanup();
      self._close('network');
    }
  };
  this.iframeObj = constructFunc(url, function() {
    debug('callback');
    self._cleanup();
    self._close('permanent');
  });
}

inherits(HtmlfileReceiver, EventEmitter);

HtmlfileReceiver.prototype.abort = function() {
  debug('abort');
  this._cleanup();
  this._close('user');
};

HtmlfileReceiver.prototype._cleanup = function() {
  debug('_cleanup');
  if (this.iframeObj) {
    this.iframeObj.cleanup();
    this.iframeObj = null;
  }
  delete global[iframeUtils.WPrefix][this.id];
};

HtmlfileReceiver.prototype._close = function(reason) {
  debug('_close', reason);
  this.emit('close', null, reason);
  this.removeAllListeners();
};

HtmlfileReceiver.htmlfileEnabled = false;

// obfuscate to avoid firewalls
var axo = ['Active'].concat('Object').join('X');
if (axo in global) {
  try {
    HtmlfileReceiver.htmlfileEnabled = !!new global[axo]('htmlfile');
  } catch (x) {
    // intentionally empty
  }
}

HtmlfileReceiver.enabled = HtmlfileReceiver.htmlfileEnabled || iframeUtils.iframeEnabled;

module.exports = HtmlfileReceiver;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../node_modules/sockjs-client/lib/transport/receiver/jsonp.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var utils = __webpack_require__("../node_modules/sockjs-client/lib/utils/iframe.js")
  , random = __webpack_require__("../node_modules/sockjs-client/lib/utils/random.js")
  , browser = __webpack_require__("../node_modules/sockjs-client/lib/utils/browser.js")
  , urlUtils = __webpack_require__("../node_modules/sockjs-client/lib/utils/url.js")
  , inherits = __webpack_require__("../node_modules/inherits/inherits_browser.js")
  , EventEmitter = __webpack_require__("../node_modules/sockjs-client/lib/event/emitter.js").EventEmitter
  ;

var debug = function() {};
if (true) {
  debug = __webpack_require__("../node_modules/debug/src/browser.js")('sockjs-client:receiver:jsonp');
}

function JsonpReceiver(url) {
  debug(url);
  var self = this;
  EventEmitter.call(this);

  utils.polluteGlobalNamespace();

  this.id = 'a' + random.string(6);
  var urlWithId = urlUtils.addQuery(url, 'c=' + encodeURIComponent(utils.WPrefix + '.' + this.id));

  global[utils.WPrefix][this.id] = this._callback.bind(this);
  this._createScript(urlWithId);

  // Fallback mostly for Konqueror - stupid timer, 35 seconds shall be plenty.
  this.timeoutId = setTimeout(function() {
    debug('timeout');
    self._abort(new Error('JSONP script loaded abnormally (timeout)'));
  }, JsonpReceiver.timeout);
}

inherits(JsonpReceiver, EventEmitter);

JsonpReceiver.prototype.abort = function() {
  debug('abort');
  if (global[utils.WPrefix][this.id]) {
    var err = new Error('JSONP user aborted read');
    err.code = 1000;
    this._abort(err);
  }
};

JsonpReceiver.timeout = 35000;
JsonpReceiver.scriptErrorTimeout = 1000;

JsonpReceiver.prototype._callback = function(data) {
  debug('_callback', data);
  this._cleanup();

  if (this.aborting) {
    return;
  }

  if (data) {
    debug('message', data);
    this.emit('message', data);
  }
  this.emit('close', null, 'network');
  this.removeAllListeners();
};

JsonpReceiver.prototype._abort = function(err) {
  debug('_abort', err);
  this._cleanup();
  this.aborting = true;
  this.emit('close', err.code, err.message);
  this.removeAllListeners();
};

JsonpReceiver.prototype._cleanup = function() {
  debug('_cleanup');
  clearTimeout(this.timeoutId);
  if (this.script2) {
    this.script2.parentNode.removeChild(this.script2);
    this.script2 = null;
  }
  if (this.script) {
    var script = this.script;
    // Unfortunately, you can't really abort script loading of
    // the script.
    script.parentNode.removeChild(script);
    script.onreadystatechange = script.onerror =
        script.onload = script.onclick = null;
    this.script = null;
  }
  delete global[utils.WPrefix][this.id];
};

JsonpReceiver.prototype._scriptError = function() {
  debug('_scriptError');
  var self = this;
  if (this.errorTimer) {
    return;
  }

  this.errorTimer = setTimeout(function() {
    if (!self.loadedOkay) {
      self._abort(new Error('JSONP script loaded abnormally (onerror)'));
    }
  }, JsonpReceiver.scriptErrorTimeout);
};

JsonpReceiver.prototype._createScript = function(url) {
  debug('_createScript', url);
  var self = this;
  var script = this.script = global.document.createElement('script');
  var script2;  // Opera synchronous load trick.

  script.id = 'a' + random.string(8);
  script.src = url;
  script.type = 'text/javascript';
  script.charset = 'UTF-8';
  script.onerror = this._scriptError.bind(this);
  script.onload = function() {
    debug('onload');
    self._abort(new Error('JSONP script loaded abnormally (onload)'));
  };

  // IE9 fires 'error' event after onreadystatechange or before, in random order.
  // Use loadedOkay to determine if actually errored
  script.onreadystatechange = function() {
    debug('onreadystatechange', script.readyState);
    if (/loaded|closed/.test(script.readyState)) {
      if (script && script.htmlFor && script.onclick) {
        self.loadedOkay = true;
        try {
          // In IE, actually execute the script.
          script.onclick();
        } catch (x) {
          // intentionally empty
        }
      }
      if (script) {
        self._abort(new Error('JSONP script loaded abnormally (onreadystatechange)'));
      }
    }
  };
  // IE: event/htmlFor/onclick trick.
  // One can't rely on proper order for onreadystatechange. In order to
  // make sure, set a 'htmlFor' and 'event' properties, so that
  // script code will be installed as 'onclick' handler for the
  // script object. Later, onreadystatechange, manually execute this
  // code. FF and Chrome doesn't work with 'event' and 'htmlFor'
  // set. For reference see:
  //   http://jaubourg.net/2010/07/loading-script-as-onclick-handler-of.html
  // Also, read on that about script ordering:
  //   http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
  if (typeof script.async === 'undefined' && global.document.attachEvent) {
    // According to mozilla docs, in recent browsers script.async defaults
    // to 'true', so we may use it to detect a good browser:
    // https://developer.mozilla.org/en/HTML/Element/script
    if (!browser.isOpera()) {
      // Naively assume we're in IE
      try {
        script.htmlFor = script.id;
        script.event = 'onclick';
      } catch (x) {
        // intentionally empty
      }
      script.async = true;
    } else {
      // Opera, second sync script hack
      script2 = this.script2 = global.document.createElement('script');
      script2.text = "try{var a = document.getElementById('" + script.id + "'); if(a)a.onerror();}catch(x){};";
      script.async = script2.async = false;
    }
  }
  if (typeof script.async !== 'undefined') {
    script.async = true;
  }

  var head = global.document.getElementsByTagName('head')[0];
  head.insertBefore(script, head.firstChild);
  if (script2) {
    head.insertBefore(script2, head.firstChild);
  }
};

module.exports = JsonpReceiver;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../node_modules/sockjs-client/lib/transport/receiver/xhr.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inherits = __webpack_require__("../node_modules/inherits/inherits_browser.js")
  , EventEmitter = __webpack_require__("../node_modules/sockjs-client/lib/event/emitter.js").EventEmitter
  ;

var debug = function() {};
if (true) {
  debug = __webpack_require__("../node_modules/debug/src/browser.js")('sockjs-client:receiver:xhr');
}

function XhrReceiver(url, AjaxObject) {
  debug(url);
  EventEmitter.call(this);
  var self = this;

  this.bufferPosition = 0;

  this.xo = new AjaxObject('POST', url, null);
  this.xo.on('chunk', this._chunkHandler.bind(this));
  this.xo.once('finish', function(status, text) {
    debug('finish', status, text);
    self._chunkHandler(status, text);
    self.xo = null;
    var reason = status === 200 ? 'network' : 'permanent';
    debug('close', reason);
    self.emit('close', null, reason);
    self._cleanup();
  });
}

inherits(XhrReceiver, EventEmitter);

XhrReceiver.prototype._chunkHandler = function(status, text) {
  debug('_chunkHandler', status);
  if (status !== 200 || !text) {
    return;
  }

  for (var idx = -1; ; this.bufferPosition += idx + 1) {
    var buf = text.slice(this.bufferPosition);
    idx = buf.indexOf('\n');
    if (idx === -1) {
      break;
    }
    var msg = buf.slice(0, idx);
    if (msg) {
      debug('message', msg);
      this.emit('message', msg);
    }
  }
};

XhrReceiver.prototype._cleanup = function() {
  debug('_cleanup');
  this.removeAllListeners();
};

XhrReceiver.prototype.abort = function() {
  debug('abort');
  if (this.xo) {
    this.xo.close();
    debug('close');
    this.emit('close', null, 'user');
    this.xo = null;
  }
  this._cleanup();
};

module.exports = XhrReceiver;


/***/ }),

/***/ "../node_modules/sockjs-client/lib/transport/sender/jsonp.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var random = __webpack_require__("../node_modules/sockjs-client/lib/utils/random.js")
  , urlUtils = __webpack_require__("../node_modules/sockjs-client/lib/utils/url.js")
  ;

var debug = function() {};
if (true) {
  debug = __webpack_require__("../node_modules/debug/src/browser.js")('sockjs-client:sender:jsonp');
}

var form, area;

function createIframe(id) {
  debug('createIframe', id);
  try {
    // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
    return global.document.createElement('<iframe name="' + id + '">');
  } catch (x) {
    var iframe = global.document.createElement('iframe');
    iframe.name = id;
    return iframe;
  }
}

function createForm() {
  debug('createForm');
  form = global.document.createElement('form');
  form.style.display = 'none';
  form.style.position = 'absolute';
  form.method = 'POST';
  form.enctype = 'application/x-www-form-urlencoded';
  form.acceptCharset = 'UTF-8';

  area = global.document.createElement('textarea');
  area.name = 'd';
  form.appendChild(area);

  global.document.body.appendChild(form);
}

module.exports = function(url, payload, callback) {
  debug(url, payload);
  if (!form) {
    createForm();
  }
  var id = 'a' + random.string(8);
  form.target = id;
  form.action = urlUtils.addQuery(urlUtils.addPath(url, '/jsonp_send'), 'i=' + id);

  var iframe = createIframe(id);
  iframe.id = id;
  iframe.style.display = 'none';
  form.appendChild(iframe);

  try {
    area.value = payload;
  } catch (e) {
    // seriously broken browsers get here
  }
  form.submit();

  var completed = function(err) {
    debug('completed', id, err);
    if (!iframe.onerror) {
      return;
    }
    iframe.onreadystatechange = iframe.onerror = iframe.onload = null;
    // Opera mini doesn't like if we GC iframe
    // immediately, thus this timeout.
    setTimeout(function() {
      debug('cleaning up', id);
      iframe.parentNode.removeChild(iframe);
      iframe = null;
    }, 500);
    area.value = '';
    // It is not possible to detect if the iframe succeeded or
    // failed to submit our form.
    callback(err);
  };
  iframe.onerror = function() {
    debug('onerror', id);
    completed();
  };
  iframe.onload = function() {
    debug('onload', id);
    completed();
  };
  iframe.onreadystatechange = function(e) {
    debug('onreadystatechange', id, iframe.readyState, e);
    if (iframe.readyState === 'complete') {
      completed();
    }
  };
  return function() {
    debug('aborted', id);
    completed(new Error('Aborted'));
  };
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../node_modules/sockjs-client/lib/transport/sender/xdr.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var EventEmitter = __webpack_require__("../node_modules/sockjs-client/lib/event/emitter.js").EventEmitter
  , inherits = __webpack_require__("../node_modules/inherits/inherits_browser.js")
  , eventUtils = __webpack_require__("../node_modules/sockjs-client/lib/utils/event.js")
  , browser = __webpack_require__("../node_modules/sockjs-client/lib/utils/browser.js")
  , urlUtils = __webpack_require__("../node_modules/sockjs-client/lib/utils/url.js")
  ;

var debug = function() {};
if (true) {
  debug = __webpack_require__("../node_modules/debug/src/browser.js")('sockjs-client:sender:xdr');
}

// References:
//   http://ajaxian.com/archives/100-line-ajax-wrapper
//   http://msdn.microsoft.com/en-us/library/cc288060(v=VS.85).aspx

function XDRObject(method, url, payload) {
  debug(method, url);
  var self = this;
  EventEmitter.call(this);

  setTimeout(function() {
    self._start(method, url, payload);
  }, 0);
}

inherits(XDRObject, EventEmitter);

XDRObject.prototype._start = function(method, url, payload) {
  debug('_start');
  var self = this;
  var xdr = new global.XDomainRequest();
  // IE caches even POSTs
  url = urlUtils.addQuery(url, 't=' + (+new Date()));

  xdr.onerror = function() {
    debug('onerror');
    self._error();
  };
  xdr.ontimeout = function() {
    debug('ontimeout');
    self._error();
  };
  xdr.onprogress = function() {
    debug('progress', xdr.responseText);
    self.emit('chunk', 200, xdr.responseText);
  };
  xdr.onload = function() {
    debug('load');
    self.emit('finish', 200, xdr.responseText);
    self._cleanup(false);
  };
  this.xdr = xdr;
  this.unloadRef = eventUtils.unloadAdd(function() {
    self._cleanup(true);
  });
  try {
    // Fails with AccessDenied if port number is bogus
    this.xdr.open(method, url);
    if (this.timeout) {
      this.xdr.timeout = this.timeout;
    }
    this.xdr.send(payload);
  } catch (x) {
    this._error();
  }
};

XDRObject.prototype._error = function() {
  this.emit('finish', 0, '');
  this._cleanup(false);
};

XDRObject.prototype._cleanup = function(abort) {
  debug('cleanup', abort);
  if (!this.xdr) {
    return;
  }
  this.removeAllListeners();
  eventUtils.unloadDel(this.unloadRef);

  this.xdr.ontimeout = this.xdr.onerror = this.xdr.onprogress = this.xdr.onload = null;
  if (abort) {
    try {
      this.xdr.abort();
    } catch (x) {
      // intentionally empty
    }
  }
  this.unloadRef = this.xdr = null;
};

XDRObject.prototype.close = function() {
  debug('close');
  this._cleanup(true);
};

// IE 8/9 if the request target uses the same scheme - #79
XDRObject.enabled = !!(global.XDomainRequest && browser.hasDomain());

module.exports = XDRObject;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../node_modules/sockjs-client/lib/transport/sender/xhr-cors.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inherits = __webpack_require__("../node_modules/inherits/inherits_browser.js")
  , XhrDriver = __webpack_require__("../node_modules/sockjs-client/lib/transport/browser/abstract-xhr.js")
  ;

function XHRCorsObject(method, url, payload, opts) {
  XhrDriver.call(this, method, url, payload, opts);
}

inherits(XHRCorsObject, XhrDriver);

XHRCorsObject.enabled = XhrDriver.enabled && XhrDriver.supportsCORS;

module.exports = XHRCorsObject;


/***/ }),

/***/ "../node_modules/sockjs-client/lib/transport/sender/xhr-fake.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var EventEmitter = __webpack_require__("../node_modules/sockjs-client/lib/event/emitter.js").EventEmitter
  , inherits = __webpack_require__("../node_modules/inherits/inherits_browser.js")
  ;

function XHRFake(/* method, url, payload, opts */) {
  var self = this;
  EventEmitter.call(this);

  this.to = setTimeout(function() {
    self.emit('finish', 200, '{}');
  }, XHRFake.timeout);
}

inherits(XHRFake, EventEmitter);

XHRFake.prototype.close = function() {
  clearTimeout(this.to);
};

XHRFake.timeout = 2000;

module.exports = XHRFake;


/***/ }),

/***/ "../node_modules/sockjs-client/lib/transport/sender/xhr-local.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inherits = __webpack_require__("../node_modules/inherits/inherits_browser.js")
  , XhrDriver = __webpack_require__("../node_modules/sockjs-client/lib/transport/browser/abstract-xhr.js")
  ;

function XHRLocalObject(method, url, payload /*, opts */) {
  XhrDriver.call(this, method, url, payload, {
    noCredentials: true
  });
}

inherits(XHRLocalObject, XhrDriver);

XHRLocalObject.enabled = XhrDriver.enabled;

module.exports = XHRLocalObject;


/***/ }),

/***/ "../node_modules/sockjs-client/lib/transport/websocket.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("../node_modules/sockjs-client/lib/utils/event.js")
  , urlUtils = __webpack_require__("../node_modules/sockjs-client/lib/utils/url.js")
  , inherits = __webpack_require__("../node_modules/inherits/inherits_browser.js")
  , EventEmitter = __webpack_require__("../node_modules/sockjs-client/lib/event/emitter.js").EventEmitter
  , WebsocketDriver = __webpack_require__("../node_modules/sockjs-client/lib/transport/browser/websocket.js")
  ;

var debug = function() {};
if (true) {
  debug = __webpack_require__("../node_modules/debug/src/browser.js")('sockjs-client:websocket');
}

function WebSocketTransport(transUrl, ignore, options) {
  if (!WebSocketTransport.enabled()) {
    throw new Error('Transport created when disabled');
  }

  EventEmitter.call(this);
  debug('constructor', transUrl);

  var self = this;
  var url = urlUtils.addPath(transUrl, '/websocket');
  if (url.slice(0, 5) === 'https') {
    url = 'wss' + url.slice(5);
  } else {
    url = 'ws' + url.slice(4);
  }
  this.url = url;

  this.ws = new WebsocketDriver(this.url, [], options);
  this.ws.onmessage = function(e) {
    debug('message event', e.data);
    self.emit('message', e.data);
  };
  // Firefox has an interesting bug. If a websocket connection is
  // created after onunload, it stays alive even when user
  // navigates away from the page. In such situation let's lie -
  // let's not open the ws connection at all. See:
  // https://github.com/sockjs/sockjs-client/issues/28
  // https://bugzilla.mozilla.org/show_bug.cgi?id=696085
  this.unloadRef = utils.unloadAdd(function() {
    debug('unload');
    self.ws.close();
  });
  this.ws.onclose = function(e) {
    debug('close event', e.code, e.reason);
    self.emit('close', e.code, e.reason);
    self._cleanup();
  };
  this.ws.onerror = function(e) {
    debug('error event', e);
    self.emit('close', 1006, 'WebSocket connection broken');
    self._cleanup();
  };
}

inherits(WebSocketTransport, EventEmitter);

WebSocketTransport.prototype.send = function(data) {
  var msg = '[' + data + ']';
  debug('send', msg);
  this.ws.send(msg);
};

WebSocketTransport.prototype.close = function() {
  debug('close');
  var ws = this.ws;
  this._cleanup();
  if (ws) {
    ws.close();
  }
};

WebSocketTransport.prototype._cleanup = function() {
  debug('_cleanup');
  var ws = this.ws;
  if (ws) {
    ws.onmessage = ws.onclose = ws.onerror = null;
  }
  utils.unloadDel(this.unloadRef);
  this.unloadRef = this.ws = null;
  this.removeAllListeners();
};

WebSocketTransport.enabled = function() {
  debug('enabled');
  return !!WebsocketDriver;
};
WebSocketTransport.transportName = 'websocket';

// In theory, ws should require 1 round trip. But in chrome, this is
// not very stable over SSL. Most likely a ws connection requires a
// separate SSL connection, in which case 2 round trips are an
// absolute minumum.
WebSocketTransport.roundTrips = 2;

module.exports = WebSocketTransport;


/***/ }),

/***/ "../node_modules/sockjs-client/lib/transport/xdr-polling.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inherits = __webpack_require__("../node_modules/inherits/inherits_browser.js")
  , AjaxBasedTransport = __webpack_require__("../node_modules/sockjs-client/lib/transport/lib/ajax-based.js")
  , XdrStreamingTransport = __webpack_require__("../node_modules/sockjs-client/lib/transport/xdr-streaming.js")
  , XhrReceiver = __webpack_require__("../node_modules/sockjs-client/lib/transport/receiver/xhr.js")
  , XDRObject = __webpack_require__("../node_modules/sockjs-client/lib/transport/sender/xdr.js")
  ;

function XdrPollingTransport(transUrl) {
  if (!XDRObject.enabled) {
    throw new Error('Transport created when disabled');
  }
  AjaxBasedTransport.call(this, transUrl, '/xhr', XhrReceiver, XDRObject);
}

inherits(XdrPollingTransport, AjaxBasedTransport);

XdrPollingTransport.enabled = XdrStreamingTransport.enabled;
XdrPollingTransport.transportName = 'xdr-polling';
XdrPollingTransport.roundTrips = 2; // preflight, ajax

module.exports = XdrPollingTransport;


/***/ }),

/***/ "../node_modules/sockjs-client/lib/transport/xdr-streaming.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inherits = __webpack_require__("../node_modules/inherits/inherits_browser.js")
  , AjaxBasedTransport = __webpack_require__("../node_modules/sockjs-client/lib/transport/lib/ajax-based.js")
  , XhrReceiver = __webpack_require__("../node_modules/sockjs-client/lib/transport/receiver/xhr.js")
  , XDRObject = __webpack_require__("../node_modules/sockjs-client/lib/transport/sender/xdr.js")
  ;

// According to:
//   http://stackoverflow.com/questions/1641507/detect-browser-support-for-cross-domain-xmlhttprequests
//   http://hacks.mozilla.org/2009/07/cross-site-xmlhttprequest-with-cors/

function XdrStreamingTransport(transUrl) {
  if (!XDRObject.enabled) {
    throw new Error('Transport created when disabled');
  }
  AjaxBasedTransport.call(this, transUrl, '/xhr_streaming', XhrReceiver, XDRObject);
}

inherits(XdrStreamingTransport, AjaxBasedTransport);

XdrStreamingTransport.enabled = function(info) {
  if (info.cookie_needed || info.nullOrigin) {
    return false;
  }
  return XDRObject.enabled && info.sameScheme;
};

XdrStreamingTransport.transportName = 'xdr-streaming';
XdrStreamingTransport.roundTrips = 2; // preflight, ajax

module.exports = XdrStreamingTransport;


/***/ }),

/***/ "../node_modules/sockjs-client/lib/transport/xhr-polling.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inherits = __webpack_require__("../node_modules/inherits/inherits_browser.js")
  , AjaxBasedTransport = __webpack_require__("../node_modules/sockjs-client/lib/transport/lib/ajax-based.js")
  , XhrReceiver = __webpack_require__("../node_modules/sockjs-client/lib/transport/receiver/xhr.js")
  , XHRCorsObject = __webpack_require__("../node_modules/sockjs-client/lib/transport/sender/xhr-cors.js")
  , XHRLocalObject = __webpack_require__("../node_modules/sockjs-client/lib/transport/sender/xhr-local.js")
  ;

function XhrPollingTransport(transUrl) {
  if (!XHRLocalObject.enabled && !XHRCorsObject.enabled) {
    throw new Error('Transport created when disabled');
  }
  AjaxBasedTransport.call(this, transUrl, '/xhr', XhrReceiver, XHRCorsObject);
}

inherits(XhrPollingTransport, AjaxBasedTransport);

XhrPollingTransport.enabled = function(info) {
  if (info.nullOrigin) {
    return false;
  }

  if (XHRLocalObject.enabled && info.sameOrigin) {
    return true;
  }
  return XHRCorsObject.enabled;
};

XhrPollingTransport.transportName = 'xhr-polling';
XhrPollingTransport.roundTrips = 2; // preflight, ajax

module.exports = XhrPollingTransport;


/***/ }),

/***/ "../node_modules/sockjs-client/lib/transport/xhr-streaming.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var inherits = __webpack_require__("../node_modules/inherits/inherits_browser.js")
  , AjaxBasedTransport = __webpack_require__("../node_modules/sockjs-client/lib/transport/lib/ajax-based.js")
  , XhrReceiver = __webpack_require__("../node_modules/sockjs-client/lib/transport/receiver/xhr.js")
  , XHRCorsObject = __webpack_require__("../node_modules/sockjs-client/lib/transport/sender/xhr-cors.js")
  , XHRLocalObject = __webpack_require__("../node_modules/sockjs-client/lib/transport/sender/xhr-local.js")
  , browser = __webpack_require__("../node_modules/sockjs-client/lib/utils/browser.js")
  ;

function XhrStreamingTransport(transUrl) {
  if (!XHRLocalObject.enabled && !XHRCorsObject.enabled) {
    throw new Error('Transport created when disabled');
  }
  AjaxBasedTransport.call(this, transUrl, '/xhr_streaming', XhrReceiver, XHRCorsObject);
}

inherits(XhrStreamingTransport, AjaxBasedTransport);

XhrStreamingTransport.enabled = function(info) {
  if (info.nullOrigin) {
    return false;
  }
  // Opera doesn't support xhr-streaming #60
  // But it might be able to #92
  if (browser.isOpera()) {
    return false;
  }

  return XHRCorsObject.enabled;
};

XhrStreamingTransport.transportName = 'xhr-streaming';
XhrStreamingTransport.roundTrips = 2; // preflight, ajax

// Safari gets confused when a streaming ajax request is started
// before onload. This causes the load indicator to spin indefinetely.
// Only require body when used in a browser
XhrStreamingTransport.needBody = !!global.document;

module.exports = XhrStreamingTransport;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../node_modules/sockjs-client/lib/utils/browser-crypto.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

if (global.crypto && global.crypto.getRandomValues) {
  module.exports.randomBytes = function(length) {
    var bytes = new Uint8Array(length);
    global.crypto.getRandomValues(bytes);
    return bytes;
  };
} else {
  module.exports.randomBytes = function(length) {
    var bytes = new Array(length);
    for (var i = 0; i < length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
    return bytes;
  };
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../node_modules/sockjs-client/lib/utils/browser.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

module.exports = {
  isOpera: function() {
    return global.navigator &&
      /opera/i.test(global.navigator.userAgent);
  }

, isKonqueror: function() {
    return global.navigator &&
      /konqueror/i.test(global.navigator.userAgent);
  }

  // #187 wrap document.domain in try/catch because of WP8 from file:///
, hasDomain: function () {
    // non-browser client always has a domain
    if (!global.document) {
      return true;
    }

    try {
      return !!global.document.domain;
    } catch (e) {
      return false;
    }
  }
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../node_modules/sockjs-client/lib/utils/escape.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var JSON3 = __webpack_require__("../node_modules/json3/lib/json3.js");

// Some extra characters that Chrome gets wrong, and substitutes with
// something else on the wire.
// eslint-disable-next-line no-control-regex
var extraEscapable = /[\x00-\x1f\ud800-\udfff\ufffe\uffff\u0300-\u0333\u033d-\u0346\u034a-\u034c\u0350-\u0352\u0357-\u0358\u035c-\u0362\u0374\u037e\u0387\u0591-\u05af\u05c4\u0610-\u0617\u0653-\u0654\u0657-\u065b\u065d-\u065e\u06df-\u06e2\u06eb-\u06ec\u0730\u0732-\u0733\u0735-\u0736\u073a\u073d\u073f-\u0741\u0743\u0745\u0747\u07eb-\u07f1\u0951\u0958-\u095f\u09dc-\u09dd\u09df\u0a33\u0a36\u0a59-\u0a5b\u0a5e\u0b5c-\u0b5d\u0e38-\u0e39\u0f43\u0f4d\u0f52\u0f57\u0f5c\u0f69\u0f72-\u0f76\u0f78\u0f80-\u0f83\u0f93\u0f9d\u0fa2\u0fa7\u0fac\u0fb9\u1939-\u193a\u1a17\u1b6b\u1cda-\u1cdb\u1dc0-\u1dcf\u1dfc\u1dfe\u1f71\u1f73\u1f75\u1f77\u1f79\u1f7b\u1f7d\u1fbb\u1fbe\u1fc9\u1fcb\u1fd3\u1fdb\u1fe3\u1feb\u1fee-\u1fef\u1ff9\u1ffb\u1ffd\u2000-\u2001\u20d0-\u20d1\u20d4-\u20d7\u20e7-\u20e9\u2126\u212a-\u212b\u2329-\u232a\u2adc\u302b-\u302c\uaab2-\uaab3\uf900-\ufa0d\ufa10\ufa12\ufa15-\ufa1e\ufa20\ufa22\ufa25-\ufa26\ufa2a-\ufa2d\ufa30-\ufa6d\ufa70-\ufad9\ufb1d\ufb1f\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufb4e\ufff0-\uffff]/g
  , extraLookup;

// This may be quite slow, so let's delay until user actually uses bad
// characters.
var unrollLookup = function(escapable) {
  var i;
  var unrolled = {};
  var c = [];
  for (i = 0; i < 65536; i++) {
    c.push( String.fromCharCode(i) );
  }
  escapable.lastIndex = 0;
  c.join('').replace(escapable, function(a) {
    unrolled[ a ] = '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
    return '';
  });
  escapable.lastIndex = 0;
  return unrolled;
};

// Quote string, also taking care of unicode characters that browsers
// often break. Especially, take care of unicode surrogates:
// http://en.wikipedia.org/wiki/Mapping_of_Unicode_characters#Surrogates
module.exports = {
  quote: function(string) {
    var quoted = JSON3.stringify(string);

    // In most cases this should be very fast and good enough.
    extraEscapable.lastIndex = 0;
    if (!extraEscapable.test(quoted)) {
      return quoted;
    }

    if (!extraLookup) {
      extraLookup = unrollLookup(extraEscapable);
    }

    return quoted.replace(extraEscapable, function(a) {
      return extraLookup[a];
    });
  }
};


/***/ }),

/***/ "../node_modules/sockjs-client/lib/utils/event.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var random = __webpack_require__("../node_modules/sockjs-client/lib/utils/random.js");

var onUnload = {}
  , afterUnload = false
    // detect google chrome packaged apps because they don't allow the 'unload' event
  , isChromePackagedApp = global.chrome && global.chrome.app && global.chrome.app.runtime
  ;

module.exports = {
  attachEvent: function(event, listener) {
    if (typeof global.addEventListener !== 'undefined') {
      global.addEventListener(event, listener, false);
    } else if (global.document && global.attachEvent) {
      // IE quirks.
      // According to: http://stevesouders.com/misc/test-postmessage.php
      // the message gets delivered only to 'document', not 'window'.
      global.document.attachEvent('on' + event, listener);
      // I get 'window' for ie8.
      global.attachEvent('on' + event, listener);
    }
  }

, detachEvent: function(event, listener) {
    if (typeof global.addEventListener !== 'undefined') {
      global.removeEventListener(event, listener, false);
    } else if (global.document && global.detachEvent) {
      global.document.detachEvent('on' + event, listener);
      global.detachEvent('on' + event, listener);
    }
  }

, unloadAdd: function(listener) {
    if (isChromePackagedApp) {
      return null;
    }

    var ref = random.string(8);
    onUnload[ref] = listener;
    if (afterUnload) {
      setTimeout(this.triggerUnloadCallbacks, 0);
    }
    return ref;
  }

, unloadDel: function(ref) {
    if (ref in onUnload) {
      delete onUnload[ref];
    }
  }

, triggerUnloadCallbacks: function() {
    for (var ref in onUnload) {
      onUnload[ref]();
      delete onUnload[ref];
    }
  }
};

var unloadTriggered = function() {
  if (afterUnload) {
    return;
  }
  afterUnload = true;
  module.exports.triggerUnloadCallbacks();
};

// 'unload' alone is not reliable in opera within an iframe, but we
// can't use `beforeunload` as IE fires it on javascript: links.
if (!isChromePackagedApp) {
  module.exports.attachEvent('unload', unloadTriggered);
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../node_modules/sockjs-client/lib/utils/iframe.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var eventUtils = __webpack_require__("../node_modules/sockjs-client/lib/utils/event.js")
  , JSON3 = __webpack_require__("../node_modules/json3/lib/json3.js")
  , browser = __webpack_require__("../node_modules/sockjs-client/lib/utils/browser.js")
  ;

var debug = function() {};
if (true) {
  debug = __webpack_require__("../node_modules/debug/src/browser.js")('sockjs-client:utils:iframe');
}

module.exports = {
  WPrefix: '_jp'
, currentWindowId: null

, polluteGlobalNamespace: function() {
    if (!(module.exports.WPrefix in global)) {
      global[module.exports.WPrefix] = {};
    }
  }

, postMessage: function(type, data) {
    if (global.parent !== global) {
      global.parent.postMessage(JSON3.stringify({
        windowId: module.exports.currentWindowId
      , type: type
      , data: data || ''
      }), '*');
    } else {
      debug('Cannot postMessage, no parent window.', type, data);
    }
  }

, createIframe: function(iframeUrl, errorCallback) {
    var iframe = global.document.createElement('iframe');
    var tref, unloadRef;
    var unattach = function() {
      debug('unattach');
      clearTimeout(tref);
      // Explorer had problems with that.
      try {
        iframe.onload = null;
      } catch (x) {
        // intentionally empty
      }
      iframe.onerror = null;
    };
    var cleanup = function() {
      debug('cleanup');
      if (iframe) {
        unattach();
        // This timeout makes chrome fire onbeforeunload event
        // within iframe. Without the timeout it goes straight to
        // onunload.
        setTimeout(function() {
          if (iframe) {
            iframe.parentNode.removeChild(iframe);
          }
          iframe = null;
        }, 0);
        eventUtils.unloadDel(unloadRef);
      }
    };
    var onerror = function(err) {
      debug('onerror', err);
      if (iframe) {
        cleanup();
        errorCallback(err);
      }
    };
    var post = function(msg, origin) {
      debug('post', msg, origin);
      try {
        // When the iframe is not loaded, IE raises an exception
        // on 'contentWindow'.
        setTimeout(function() {
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage(msg, origin);
          }
        }, 0);
      } catch (x) {
        // intentionally empty
      }
    };

    iframe.src = iframeUrl;
    iframe.style.display = 'none';
    iframe.style.position = 'absolute';
    iframe.onerror = function() {
      onerror('onerror');
    };
    iframe.onload = function() {
      debug('onload');
      // `onload` is triggered before scripts on the iframe are
      // executed. Give it few seconds to actually load stuff.
      clearTimeout(tref);
      tref = setTimeout(function() {
        onerror('onload timeout');
      }, 2000);
    };
    global.document.body.appendChild(iframe);
    tref = setTimeout(function() {
      onerror('timeout');
    }, 15000);
    unloadRef = eventUtils.unloadAdd(cleanup);
    return {
      post: post
    , cleanup: cleanup
    , loaded: unattach
    };
  }

/* eslint no-undef: "off", new-cap: "off" */
, createHtmlfile: function(iframeUrl, errorCallback) {
    var axo = ['Active'].concat('Object').join('X');
    var doc = new global[axo]('htmlfile');
    var tref, unloadRef;
    var iframe;
    var unattach = function() {
      clearTimeout(tref);
      iframe.onerror = null;
    };
    var cleanup = function() {
      if (doc) {
        unattach();
        eventUtils.unloadDel(unloadRef);
        iframe.parentNode.removeChild(iframe);
        iframe = doc = null;
        CollectGarbage();
      }
    };
    var onerror = function(r) {
      debug('onerror', r);
      if (doc) {
        cleanup();
        errorCallback(r);
      }
    };
    var post = function(msg, origin) {
      try {
        // When the iframe is not loaded, IE raises an exception
        // on 'contentWindow'.
        setTimeout(function() {
          if (iframe && iframe.contentWindow) {
              iframe.contentWindow.postMessage(msg, origin);
          }
        }, 0);
      } catch (x) {
        // intentionally empty
      }
    };

    doc.open();
    doc.write('<html><s' + 'cript>' +
              'document.domain="' + global.document.domain + '";' +
              '</s' + 'cript></html>');
    doc.close();
    doc.parentWindow[module.exports.WPrefix] = global[module.exports.WPrefix];
    var c = doc.createElement('div');
    doc.body.appendChild(c);
    iframe = doc.createElement('iframe');
    c.appendChild(iframe);
    iframe.src = iframeUrl;
    iframe.onerror = function() {
      onerror('onerror');
    };
    tref = setTimeout(function() {
      onerror('timeout');
    }, 15000);
    unloadRef = eventUtils.unloadAdd(cleanup);
    return {
      post: post
    , cleanup: cleanup
    , loaded: unattach
    };
  }
};

module.exports.iframeEnabled = false;
if (global.document) {
  // postMessage misbehaves in konqueror 4.6.5 - the messages are delivered with
  // huge delay, or not at all.
  module.exports.iframeEnabled = (typeof global.postMessage === 'function' ||
    typeof global.postMessage === 'object') && (!browser.isKonqueror());
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../node_modules/sockjs-client/lib/utils/log.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var logObject = {};
['log', 'debug', 'warn'].forEach(function (level) {
  var levelExists;

  try {
    levelExists = global.console && global.console[level] && global.console[level].apply;
  } catch(e) {
    // do nothing
  }

  logObject[level] = levelExists ? function () {
    return global.console[level].apply(global.console, arguments);
  } : (level === 'log' ? function () {} : logObject.log);
});

module.exports = logObject;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../node_modules/sockjs-client/lib/utils/object.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  isObject: function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  }

, extend: function(obj) {
    if (!this.isObject(obj)) {
      return obj;
    }
    var source, prop;
    for (var i = 1, length = arguments.length; i < length; i++) {
      source = arguments[i];
      for (prop in source) {
        if (Object.prototype.hasOwnProperty.call(source, prop)) {
          obj[prop] = source[prop];
        }
      }
    }
    return obj;
  }
};


/***/ }),

/***/ "../node_modules/sockjs-client/lib/utils/random.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* global crypto:true */
var crypto = __webpack_require__("../node_modules/sockjs-client/lib/utils/browser-crypto.js");

// This string has length 32, a power of 2, so the modulus doesn't introduce a
// bias.
var _randomStringChars = 'abcdefghijklmnopqrstuvwxyz012345';
module.exports = {
  string: function(length) {
    var max = _randomStringChars.length;
    var bytes = crypto.randomBytes(length);
    var ret = [];
    for (var i = 0; i < length; i++) {
      ret.push(_randomStringChars.substr(bytes[i] % max, 1));
    }
    return ret.join('');
  }

, number: function(max) {
    return Math.floor(Math.random() * max);
  }

, numberString: function(max) {
    var t = ('' + (max - 1)).length;
    var p = new Array(t + 1).join('0');
    return (p + this.number(max)).slice(-t);
  }
};


/***/ }),

/***/ "../node_modules/sockjs-client/lib/utils/transport.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var debug = function() {};
if (true) {
  debug = __webpack_require__("../node_modules/debug/src/browser.js")('sockjs-client:utils:transport');
}

module.exports = function(availableTransports) {
  return {
    filterToEnabled: function(transportsWhitelist, info) {
      var transports = {
        main: []
      , facade: []
      };
      if (!transportsWhitelist) {
        transportsWhitelist = [];
      } else if (typeof transportsWhitelist === 'string') {
        transportsWhitelist = [transportsWhitelist];
      }

      availableTransports.forEach(function(trans) {
        if (!trans) {
          return;
        }

        if (trans.transportName === 'websocket' && info.websocket === false) {
          debug('disabled from server', 'websocket');
          return;
        }

        if (transportsWhitelist.length &&
            transportsWhitelist.indexOf(trans.transportName) === -1) {
          debug('not in whitelist', trans.transportName);
          return;
        }

        if (trans.enabled(info)) {
          debug('enabled', trans.transportName);
          transports.main.push(trans);
          if (trans.facadeTransport) {
            transports.facade.push(trans.facadeTransport);
          }
        } else {
          debug('disabled', trans.transportName);
        }
      });
      return transports;
    }
  };
};


/***/ }),

/***/ "../node_modules/sockjs-client/lib/utils/url.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var URL = __webpack_require__("../node_modules/url-parse/index.js");

var debug = function() {};
if (true) {
  debug = __webpack_require__("../node_modules/debug/src/browser.js")('sockjs-client:utils:url');
}

module.exports = {
  getOrigin: function(url) {
    if (!url) {
      return null;
    }

    var p = new URL(url);
    if (p.protocol === 'file:') {
      return null;
    }

    var port = p.port;
    if (!port) {
      port = (p.protocol === 'https:') ? '443' : '80';
    }

    return p.protocol + '//' + p.hostname + ':' + port;
  }

, isOriginEqual: function(a, b) {
    var res = this.getOrigin(a) === this.getOrigin(b);
    debug('same', a, b, res);
    return res;
  }

, isSchemeEqual: function(a, b) {
    return (a.split(':')[0] === b.split(':')[0]);
  }

, addPath: function (url, path) {
    var qs = url.split('?');
    return qs[0] + path + (qs[1] ? '?' + qs[1] : '');
  }

, addQuery: function (url, q) {
    return url + (url.indexOf('?') === -1 ? ('?' + q) : ('&' + q));
  }
};


/***/ }),

/***/ "../node_modules/sockjs-client/lib/version.js":
/***/ (function(module, exports) {

module.exports = '1.1.4';


/***/ }),

/***/ "../node_modules/strip-ansi/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ansiRegex = __webpack_require__("../node_modules/ansi-regex/index.js")();

module.exports = function (str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};


/***/ }),

/***/ "../node_modules/style-loader/addStyles.js":
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		// Test for IE <= 9 as proposed by Browserhacks
		// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
		// Tests for existence of standard globals is to allow style-loader 
		// to operate correctly into non-standard environments
		// @see https://github.com/webpack-contrib/style-loader/issues/177
		return window && document && document.all && !window.atob;
	}),
	getElement = (function(fn) {
		var memo = {};
		return function(selector) {
			if (typeof memo[selector] === "undefined") {
				memo[selector] = fn.call(this, selector);
			}
			return memo[selector]
		};
	})(function (styleTarget) {
		return document.querySelector(styleTarget)
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [],
	fixUrls = __webpack_require__("../node_modules/style-loader/fixUrls.js");

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (typeof options.insertInto === "undefined") options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var styleTarget = getElement(options.insertInto)
	if (!styleTarget) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			styleTarget.insertBefore(styleElement, styleTarget.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			styleTarget.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			styleTarget.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		styleTarget.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	options.attrs.type = "text/css";

	attachTagAttrs(styleElement, options.attrs);
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	attachTagAttrs(linkElement, options.attrs);
	insertStyleElement(options, linkElement);
	return linkElement;
}

function attachTagAttrs(element, attrs) {
	Object.keys(attrs).forEach(function (key) {
		element.setAttribute(key, attrs[key]);
	});
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement, options);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/* If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
	and there is no publicPath defined then lets turn convertToAbsoluteUrls
	on by default.  Otherwise default to the convertToAbsoluteUrls option
	directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls){
		css = fixUrls(css);
	}

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ "../node_modules/style-loader/fixUrls.js":
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),

/***/ "../node_modules/url-parse/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var required = __webpack_require__("../node_modules/requires-port/index.js")
  , qs = __webpack_require__("../node_modules/url-parse/node_modules/querystringify/index.js")
  , protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\S\s]*)/i
  , slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//;

/**
 * These are the parse rules for the URL parser, it informs the parser
 * about:
 *
 * 0. The char it Needs to parse, if it's a string it should be done using
 *    indexOf, RegExp using exec and NaN means set as current value.
 * 1. The property we should set when parsing this value.
 * 2. Indication if it's backwards or forward parsing, when set as number it's
 *    the value of extra chars that should be split off.
 * 3. Inherit from location if non existing in the parser.
 * 4. `toLowerCase` the resulting value.
 */
var rules = [
  ['#', 'hash'],                        // Extract from the back.
  ['?', 'query'],                       // Extract from the back.
  ['/', 'pathname'],                    // Extract from the back.
  ['@', 'auth', 1],                     // Extract from the front.
  [NaN, 'host', undefined, 1, 1],       // Set left over value.
  [/:(\d+)$/, 'port', undefined, 1],    // RegExp the back.
  [NaN, 'hostname', undefined, 1, 1]    // Set left over.
];

/**
 * These properties should not be copied or inherited from. This is only needed
 * for all non blob URL's as a blob URL does not include a hash, only the
 * origin.
 *
 * @type {Object}
 * @private
 */
var ignore = { hash: 1, query: 1 };

/**
 * The location object differs when your code is loaded through a normal page,
 * Worker or through a worker using a blob. And with the blobble begins the
 * trouble as the location object will contain the URL of the blob, not the
 * location of the page where our code is loaded in. The actual origin is
 * encoded in the `pathname` so we can thankfully generate a good "default"
 * location from it so we can generate proper relative URL's again.
 *
 * @param {Object|String} loc Optional default location object.
 * @returns {Object} lolcation object.
 * @api public
 */
function lolcation(loc) {
  loc = loc || global.location || {};

  var finaldestination = {}
    , type = typeof loc
    , key;

  if ('blob:' === loc.protocol) {
    finaldestination = new URL(unescape(loc.pathname), {});
  } else if ('string' === type) {
    finaldestination = new URL(loc, {});
    for (key in ignore) delete finaldestination[key];
  } else if ('object' === type) {
    for (key in loc) {
      if (key in ignore) continue;
      finaldestination[key] = loc[key];
    }

    if (finaldestination.slashes === undefined) {
      finaldestination.slashes = slashes.test(loc.href);
    }
  }

  return finaldestination;
}

/**
 * @typedef ProtocolExtract
 * @type Object
 * @property {String} protocol Protocol matched in the URL, in lowercase.
 * @property {Boolean} slashes `true` if protocol is followed by "//", else `false`.
 * @property {String} rest Rest of the URL that is not part of the protocol.
 */

/**
 * Extract protocol information from a URL with/without double slash ("//").
 *
 * @param {String} address URL we want to extract from.
 * @return {ProtocolExtract} Extracted information.
 * @api private
 */
function extractProtocol(address) {
  var match = protocolre.exec(address);

  return {
    protocol: match[1] ? match[1].toLowerCase() : '',
    slashes: !!match[2],
    rest: match[3]
  };
}

/**
 * Resolve a relative URL pathname against a base URL pathname.
 *
 * @param {String} relative Pathname of the relative URL.
 * @param {String} base Pathname of the base URL.
 * @return {String} Resolved pathname.
 * @api private
 */
function resolve(relative, base) {
  var path = (base || '/').split('/').slice(0, -1).concat(relative.split('/'))
    , i = path.length
    , last = path[i - 1]
    , unshift = false
    , up = 0;

  while (i--) {
    if (path[i] === '.') {
      path.splice(i, 1);
    } else if (path[i] === '..') {
      path.splice(i, 1);
      up++;
    } else if (up) {
      if (i === 0) unshift = true;
      path.splice(i, 1);
      up--;
    }
  }

  if (unshift) path.unshift('');
  if (last === '.' || last === '..') path.push('');

  return path.join('/');
}

/**
 * The actual URL instance. Instead of returning an object we've opted-in to
 * create an actual constructor as it's much more memory efficient and
 * faster and it pleases my OCD.
 *
 * @constructor
 * @param {String} address URL we want to parse.
 * @param {Object|String} location Location defaults for relative paths.
 * @param {Boolean|Function} parser Parser for the query string.
 * @api public
 */
function URL(address, location, parser) {
  if (!(this instanceof URL)) {
    return new URL(address, location, parser);
  }

  var relative, extracted, parse, instruction, index, key
    , instructions = rules.slice()
    , type = typeof location
    , url = this
    , i = 0;

  //
  // The following if statements allows this module two have compatibility with
  // 2 different API:
  //
  // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
  //    where the boolean indicates that the query string should also be parsed.
  //
  // 2. The `URL` interface of the browser which accepts a URL, object as
  //    arguments. The supplied object will be used as default values / fall-back
  //    for relative paths.
  //
  if ('object' !== type && 'string' !== type) {
    parser = location;
    location = null;
  }

  if (parser && 'function' !== typeof parser) parser = qs.parse;

  location = lolcation(location);

  //
  // Extract protocol information before running the instructions.
  //
  extracted = extractProtocol(address || '');
  relative = !extracted.protocol && !extracted.slashes;
  url.slashes = extracted.slashes || relative && location.slashes;
  url.protocol = extracted.protocol || location.protocol || '';
  address = extracted.rest;

  //
  // When the authority component is absent the URL starts with a path
  // component.
  //
  if (!extracted.slashes) instructions[2] = [/(.*)/, 'pathname'];

  for (; i < instructions.length; i++) {
    instruction = instructions[i];
    parse = instruction[0];
    key = instruction[1];

    if (parse !== parse) {
      url[key] = address;
    } else if ('string' === typeof parse) {
      if (~(index = address.indexOf(parse))) {
        if ('number' === typeof instruction[2]) {
          url[key] = address.slice(0, index);
          address = address.slice(index + instruction[2]);
        } else {
          url[key] = address.slice(index);
          address = address.slice(0, index);
        }
      }
    } else if ((index = parse.exec(address))) {
      url[key] = index[1];
      address = address.slice(0, index.index);
    }

    url[key] = url[key] || (
      relative && instruction[3] ? location[key] || '' : ''
    );

    //
    // Hostname, host and protocol should be lowercased so they can be used to
    // create a proper `origin`.
    //
    if (instruction[4]) url[key] = url[key].toLowerCase();
  }

  //
  // Also parse the supplied query string in to an object. If we're supplied
  // with a custom parser as function use that instead of the default build-in
  // parser.
  //
  if (parser) url.query = parser(url.query);

  //
  // If the URL is relative, resolve the pathname against the base URL.
  //
  if (
      relative
    && location.slashes
    && url.pathname.charAt(0) !== '/'
    && (url.pathname !== '' || location.pathname !== '')
  ) {
    url.pathname = resolve(url.pathname, location.pathname);
  }

  //
  // We should not add port numbers if they are already the default port number
  // for a given protocol. As the host also contains the port number we're going
  // override it with the hostname which contains no port number.
  //
  if (!required(url.port, url.protocol)) {
    url.host = url.hostname;
    url.port = '';
  }

  //
  // Parse down the `auth` for the username and password.
  //
  url.username = url.password = '';
  if (url.auth) {
    instruction = url.auth.split(':');
    url.username = instruction[0] || '';
    url.password = instruction[1] || '';
  }

  url.origin = url.protocol && url.host && url.protocol !== 'file:'
    ? url.protocol +'//'+ url.host
    : 'null';

  //
  // The href is just the compiled result.
  //
  url.href = url.toString();
}

/**
 * This is convenience method for changing properties in the URL instance to
 * insure that they all propagate correctly.
 *
 * @param {String} part          Property we need to adjust.
 * @param {Mixed} value          The newly assigned value.
 * @param {Boolean|Function} fn  When setting the query, it will be the function
 *                               used to parse the query.
 *                               When setting the protocol, double slash will be
 *                               removed from the final url if it is true.
 * @returns {URL}
 * @api public
 */
function set(part, value, fn) {
  var url = this;

  switch (part) {
    case 'query':
      if ('string' === typeof value && value.length) {
        value = (fn || qs.parse)(value);
      }

      url[part] = value;
      break;

    case 'port':
      url[part] = value;

      if (!required(value, url.protocol)) {
        url.host = url.hostname;
        url[part] = '';
      } else if (value) {
        url.host = url.hostname +':'+ value;
      }

      break;

    case 'hostname':
      url[part] = value;

      if (url.port) value += ':'+ url.port;
      url.host = value;
      break;

    case 'host':
      url[part] = value;

      if (/:\d+$/.test(value)) {
        value = value.split(':');
        url.port = value.pop();
        url.hostname = value.join(':');
      } else {
        url.hostname = value;
        url.port = '';
      }

      break;

    case 'protocol':
      url.protocol = value.toLowerCase();
      url.slashes = !fn;
      break;

    case 'pathname':
      url.pathname = value.length && value.charAt(0) !== '/' ? '/' + value : value;

      break;

    default:
      url[part] = value;
  }

  for (var i = 0; i < rules.length; i++) {
    var ins = rules[i];

    if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
  }

  url.origin = url.protocol && url.host && url.protocol !== 'file:'
    ? url.protocol +'//'+ url.host
    : 'null';

  url.href = url.toString();

  return url;
}

/**
 * Transform the properties back in to a valid and full URL string.
 *
 * @param {Function} stringify Optional query stringify function.
 * @returns {String}
 * @api public
 */
function toString(stringify) {
  if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;

  var query
    , url = this
    , protocol = url.protocol;

  if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';

  var result = protocol + (url.slashes ? '//' : '');

  if (url.username) {
    result += url.username;
    if (url.password) result += ':'+ url.password;
    result += '@';
  }

  result += url.host + url.pathname;

  query = 'object' === typeof url.query ? stringify(url.query) : url.query;
  if (query) result += '?' !== query.charAt(0) ? '?'+ query : query;

  if (url.hash) result += url.hash;

  return result;
}

URL.prototype = { set: set, toString: toString };

//
// Expose the URL parser and some additional properties that might be useful for
// others or testing.
//
URL.extractProtocol = extractProtocol;
URL.location = lolcation;
URL.qs = qs;

module.exports = URL;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../node_modules/url-parse/node_modules/querystringify/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty;

/**
 * Decode a URI encoded string.
 *
 * @param {String} input The URI encoded string.
 * @returns {String} The decoded string.
 * @api private
 */
function decode(input) {
  return decodeURIComponent(input.replace(/\+/g, ' '));
}

/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 */
function querystring(query) {
  var parser = /([^=?&]+)=?([^&]*)/g
    , result = {}
    , part;

  //
  // Little nifty parsing hack, leverage the fact that RegExp.exec increments
  // the lastIndex property so we can continue executing this loop until we've
  // parsed all results.
  //
  for (;
    part = parser.exec(query);
    result[decode(part[1])] = decode(part[2])
  );

  return result;
}

/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */
function querystringify(obj, prefix) {
  prefix = prefix || '';

  var pairs = [];

  //
  // Optionally prefix with a '?' if needed
  //
  if ('string' !== typeof prefix) prefix = '?';

  for (var key in obj) {
    if (has.call(obj, key)) {
      pairs.push(encodeURIComponent(key) +'='+ encodeURIComponent(obj[key]));
    }
  }

  return pairs.length ? prefix + pairs.join('&') : '';
}

//
// Expose the module.
//
exports.stringify = querystringify;
exports.parse = querystring;


/***/ }),

/***/ "../node_modules/url/url.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var punycode = __webpack_require__("../node_modules/punycode/punycode.js");
var util = __webpack_require__("../node_modules/url/util.js");

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = __webpack_require__("../node_modules/querystring-es3/index.js");

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};


/***/ }),

/***/ "../node_modules/url/util.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};


/***/ }),

/***/ "../node_modules/webpack-dev-server/client/index.js?http:/localhost:9001":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery) {/* global __resourceQuery WorkerGlobalScope */
var url = __webpack_require__("../node_modules/url/url.js");
var stripAnsi = __webpack_require__("../node_modules/strip-ansi/index.js");
var log = __webpack_require__("../node_modules/loglevel/lib/loglevel.js")
var socket = __webpack_require__("../node_modules/webpack-dev-server/client/socket.js");
var overlay = __webpack_require__("../node_modules/webpack-dev-server/client/overlay.js");

function getCurrentScriptSource() {
	// `document.currentScript` is the most accurate way to find the current script,
	// but is not supported in all browsers.
	if(document.currentScript)
		return document.currentScript.getAttribute("src");
	// Fall back to getting all scripts in the document.
	var scriptElements = document.scripts || [];
	var currentScript = scriptElements[scriptElements.length - 1];
	if(currentScript)
		return currentScript.getAttribute("src");
	// Fail as there was no script to use.
	throw new Error("[WDS] Failed to get current script source");
}

var urlParts;
if(true) {
	// If this bundle is inlined, use the resource query to get the correct url.
	urlParts = url.parse(__resourceQuery.substr(1));
} else {
	// Else, get the url from the <script> this file was called with.
	var scriptHost = getCurrentScriptSource();
	scriptHost = scriptHost.replace(/\/[^\/]+$/, "");
	urlParts = url.parse((scriptHost ? scriptHost : "/"), false, true);
}

var hot = false;
var initial = true;
var currentHash = "";
var useWarningOverlay = false;
var useErrorOverlay = false;

var INFO = "info";
var WARNING = "warning";
var ERROR = "error";
var NONE = "none";

// Set the default log level
log.setDefaultLevel(INFO);

// Send messages to the outside, so plugins can consume it.
function sendMsg(type, data) {
	if(
		typeof self !== "undefined" &&
		(typeof WorkerGlobalScope === "undefined" ||
		!(self instanceof WorkerGlobalScope))
	) {
		self.postMessage({
			type: "webpack" + type,
			data: data
		}, "*");
	}
}

var onSocketMsg = {
	hot: function() {
		hot = true;
		log.info("[WDS] Hot Module Replacement enabled.");
	},
	invalid: function() {
		log.info("[WDS] App updated. Recompiling...");
		sendMsg("Invalid");
	},
	hash: function(hash) {
		currentHash = hash;
	},
	"still-ok": function() {
		log.info("[WDS] Nothing changed.")
		if(useWarningOverlay || useErrorOverlay) overlay.clear();
		sendMsg("StillOk");
	},
	"log-level": function(level) {
		var hotCtx = __webpack_require__("../node_modules/webpack/hot ^\\.\\/log$");
		if(hotCtx.keys().length > 0) {
			hotCtx("./log").setLogLevel(level);
		}
		switch(level) {
			case INFO:
			case ERROR:
				log.setLevel(level);
				break;
			case WARNING:
				log.setLevel("warn"); // loglevel's warning name is different from webpack's
				break;
			case NONE:
				log.disableAll();
				break;
			default:
				log.error("[WDS] Unknown clientLogLevel '" + level + "'");
		}
	},
	"overlay": function(overlay) {
		if(typeof document !== "undefined") {
			if(typeof(overlay) === "boolean") {
				useWarningOverlay = false;
				useErrorOverlay = overlay;
			} else if(overlay) {
				useWarningOverlay = overlay.warnings;
				useErrorOverlay = overlay.errors;
			}
		}
	},
	ok: function() {
		sendMsg("Ok");
		if(useWarningOverlay || useErrorOverlay) overlay.clear();
		if(initial) return initial = false;
		reloadApp();
	},
	"content-changed": function() {
		log.info("[WDS] Content base changed. Reloading...")
		self.location.reload();
	},
	warnings: function(warnings) {
		log.warn("[WDS] Warnings while compiling.");
		var strippedWarnings = warnings.map(function(warning) {
			return stripAnsi(warning);
		});
		sendMsg("Warnings", strippedWarnings);
		for(var i = 0; i < strippedWarnings.length; i++)
			log.warn(strippedWarnings[i]);
		if(useWarningOverlay) overlay.showMessage(warnings);

		if(initial) return initial = false;
		reloadApp();
	},
	errors: function(errors) {
		log.error("[WDS] Errors while compiling. Reload prevented.");
		var strippedErrors = errors.map(function(error) {
			return stripAnsi(error);
		});
		sendMsg("Errors", strippedErrors);
		for(var i = 0; i < strippedErrors.length; i++)
			log.error(strippedErrors[i]);
		if(useErrorOverlay) overlay.showMessage(errors);
	},
	error: function(error) {
		log.error(error);
	},
	close: function() {
		log.error("[WDS] Disconnected!");
		sendMsg("Close");
	}
};

var hostname = urlParts.hostname;
var protocol = urlParts.protocol;


//check ipv4 and ipv6 `all hostname`
if(hostname === "0.0.0.0" || hostname === "::") {
	// why do we need this check?
	// hostname n/a for file protocol (example, when using electron, ionic)
	// see: https://github.com/webpack/webpack-dev-server/pull/384
	if(self.location.hostname && !!~self.location.protocol.indexOf("http")) {
		hostname = self.location.hostname;
	}
}

// `hostname` can be empty when the script path is relative. In that case, specifying
// a protocol would result in an invalid URL.
// When https is used in the app, secure websockets are always necessary
// because the browser doesn't accept non-secure websockets.
if(hostname && (self.location.protocol === "https:" || urlParts.hostname === "0.0.0.0")) {
	protocol = self.location.protocol;
}

var socketUrl = url.format({
	protocol: protocol,
	auth: urlParts.auth,
	hostname: hostname,
	port: (urlParts.port === "0") ? self.location.port : urlParts.port,
	pathname: urlParts.path == null || urlParts.path === "/" ? "/sockjs-node" : urlParts.path
});

socket(socketUrl, onSocketMsg);

var isUnloading = false;
self.addEventListener("beforeunload", function() {
	isUnloading = true;
});

function reloadApp() {
	if(isUnloading) {
		return;
	}
	if(hot) {
		log.info("[WDS] App hot update...");
		var hotEmitter = __webpack_require__("../node_modules/webpack/hot/emitter.js");
		hotEmitter.emit("webpackHotUpdate", currentHash);
		if(typeof self !== "undefined" && self.window) {
			// broadcast update to window
			self.postMessage("webpackHotUpdate" + currentHash, "*");
		}
	} else {
		log.info("[WDS] App updated. Reloading...");
		self.location.reload();
	}
}

/* WEBPACK VAR INJECTION */}.call(exports, "?http://localhost:9001"))

/***/ }),

/***/ "../node_modules/webpack-dev-server/client/overlay.js":
/***/ (function(module, exports, __webpack_require__) {

// The error overlay is inspired (and mostly copied) from Create React App (https://github.com/facebookincubator/create-react-app)
// They, in turn, got inspired by webpack-hot-middleware (https://github.com/glenjamin/webpack-hot-middleware).
var ansiHTML = __webpack_require__("../node_modules/ansi-html/index.js");
var Entities = __webpack_require__("../node_modules/html-entities/index.js").AllHtmlEntities;
var entities = new Entities();

var colors = {
	reset: ["transparent", "transparent"],
	black: "181818",
	red: "E36049",
	green: "B3CB74",
	yellow: "FFD080",
	blue: "7CAFC2",
	magenta: "7FACCA",
	cyan: "C3C2EF",
	lightgrey: "EBE7E3",
	darkgrey: "6D7891"
};
ansiHTML.setColors(colors);

function createOverlayIframe(onIframeLoad) {
	var iframe = document.createElement("iframe");
	iframe.id = "webpack-dev-server-client-overlay";
	iframe.src = "about:blank";
	iframe.style.position = "fixed";
	iframe.style.left = 0;
	iframe.style.top = 0;
	iframe.style.right = 0;
	iframe.style.bottom = 0;
	iframe.style.width = "100vw";
	iframe.style.height = "100vh";
	iframe.style.border = "none";
	iframe.style.zIndex = 9999999999;
	iframe.onload = onIframeLoad;
	return iframe;
}

function addOverlayDivTo(iframe) {
	var div = iframe.contentDocument.createElement("div");
	div.id = "webpack-dev-server-client-overlay-div";
	div.style.position = "fixed";
	div.style.boxSizing = "border-box";
	div.style.left = 0;
	div.style.top = 0;
	div.style.right = 0;
	div.style.bottom = 0;
	div.style.width = "100vw";
	div.style.height = "100vh";
	div.style.backgroundColor = "black";
	div.style.color = "#E8E8E8";
	div.style.fontFamily = "Menlo, Consolas, monospace";
	div.style.fontSize = "large";
	div.style.padding = "2rem";
	div.style.lineHeight = "1.2";
	div.style.whiteSpace = "pre-wrap";
	div.style.overflow = "auto";
	iframe.contentDocument.body.appendChild(div);
	return div;
}

var overlayIframe = null;
var overlayDiv = null;
var lastOnOverlayDivReady = null;

function ensureOverlayDivExists(onOverlayDivReady) {
	if(overlayDiv) {
	// Everything is ready, call the callback right away.
		onOverlayDivReady(overlayDiv);
		return;
	}

	// Creating an iframe may be asynchronous so we'll schedule the callback.
	// In case of multiple calls, last callback wins.
	lastOnOverlayDivReady = onOverlayDivReady;

	if(overlayIframe) {
		// We're already creating it.
		return;
	}

	// Create iframe and, when it is ready, a div inside it.
	overlayIframe = createOverlayIframe(function onIframeLoad() {
		overlayDiv = addOverlayDivTo(overlayIframe);
		// Now we can talk!
		lastOnOverlayDivReady(overlayDiv);
	});

	// Zalgo alert: onIframeLoad() will be called either synchronously
	// or asynchronously depending on the browser.
	// We delay adding it so `overlayIframe` is set when `onIframeLoad` fires.
	document.body.appendChild(overlayIframe);
}

function showMessageOverlay(message) {
	ensureOverlayDivExists(function onOverlayDivReady(overlayDiv) {
		// Make it look similar to our terminal.
		overlayDiv.innerHTML =
			"<span style=\"color: #" +
			colors.red +
			"\">Failed to compile.</span><br><br>" +
			ansiHTML(entities.encode(message));
	});
}

function destroyErrorOverlay() {
	if(!overlayDiv) {
		// It is not there in the first place.
		return;
	}

	// Clean up and reset internal state.
	document.body.removeChild(overlayIframe);
	overlayDiv = null;
	overlayIframe = null;
	lastOnOverlayDivReady = null;
}

// Successful compilation.
exports.clear = function handleSuccess() {
	destroyErrorOverlay();
}

// Compilation with errors (e.g. syntax error or missing modules).
exports.showMessage = function handleMessage(messages) {
	showMessageOverlay(messages[0]);
}


/***/ }),

/***/ "../node_modules/webpack-dev-server/client/socket.js":
/***/ (function(module, exports, __webpack_require__) {

var SockJS = __webpack_require__("../node_modules/sockjs-client/lib/entry.js");

var retries = 0;
var sock = null;

function socket(url, handlers) {
	sock = new SockJS(url);

	sock.onopen = function() {
		retries = 0;
	}

	sock.onclose = function() {
		if(retries === 0)
			handlers.close();

		// Try to reconnect.
		sock = null;

		// After 10 retries stop trying, to prevent logspam.
		if(retries <= 10) {
			// Exponentially increase timeout to reconnect.
			// Respectfully copied from the package `got`.
			var retryInMs = 1000 * Math.pow(2, retries) + Math.random() * 100;
			retries += 1;

			setTimeout(function() {
				socket(url, handlers);
			}, retryInMs);
		}
	};

	sock.onmessage = function(e) {
		// This assumes that all data sent via the websocket is JSON.
		var msg = JSON.parse(e.data);
		if(handlers[msg.type])
			handlers[msg.type](msg.data);
	};
}

module.exports = socket;


/***/ }),

/***/ "../node_modules/webpack/buildin/amd-options.js":
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ }),

/***/ "../node_modules/webpack/hot ^\\.\\/log$":
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = "../node_modules/webpack/hot ^\\.\\/log$";

/***/ }),

/***/ "../node_modules/webpack/hot/emitter.js":
/***/ (function(module, exports, __webpack_require__) {

var EventEmitter = __webpack_require__("../node_modules/events/events.js");
module.exports = new EventEmitter();


/***/ }),

/***/ "../node_modules/webpack/hot/log-apply-result.js":
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function(updatedModules, renewedModules) {
	var unacceptedModules = updatedModules.filter(function(moduleId) {
		return renewedModules && renewedModules.indexOf(moduleId) < 0;
	});

	if(unacceptedModules.length > 0) {
		console.warn("[HMR] The following modules couldn't be hot updated: (They would need a full reload!)");
		unacceptedModules.forEach(function(moduleId) {
			console.warn("[HMR]  - " + moduleId);
		});
	}

	if(!renewedModules || renewedModules.length === 0) {
		console.log("[HMR] Nothing hot updated.");
	} else {
		console.log("[HMR] Updated modules:");
		renewedModules.forEach(function(moduleId) {
			console.log("[HMR]  - " + moduleId);
		});
		var numberIds = renewedModules.every(function(moduleId) {
			return typeof moduleId === "number";
		});
		if(numberIds)
			console.log("[HMR] Consider using the NamedModulesPlugin for module names.");
	}
};


/***/ }),

/***/ "../node_modules/webpack/hot/only-dev-server.js":
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/*globals __webpack_hash__ */
if(true) {
	var lastHash;
	var upToDate = function upToDate() {
		return lastHash.indexOf(__webpack_require__.h()) >= 0;
	};
	var check = function check() {
		module.hot.check().then(function(updatedModules) {
			if(!updatedModules) {
				console.warn("[HMR] Cannot find update. Need to do a full reload!");
				console.warn("[HMR] (Probably because of restarting the webpack-dev-server)");
				return;
			}

			return module.hot.apply({
				ignoreUnaccepted: true,
				ignoreDeclined: true,
				ignoreErrored: true,
				onUnaccepted: function(data) {
					console.warn("Ignored an update to unaccepted module " + data.chain.join(" -> "));
				},
				onDeclined: function(data) {
					console.warn("Ignored an update to declined module " + data.chain.join(" -> "));
				},
				onErrored: function(data) {
					console.warn("Ignored an error while updating module " + data.moduleId + " (" + data.type + ")");
				}
			}).then(function(renewedModules) {
				if(!upToDate()) {
					check();
				}

				__webpack_require__("../node_modules/webpack/hot/log-apply-result.js")(updatedModules, renewedModules);

				if(upToDate()) {
					console.log("[HMR] App is up to date.");
				}
			});
		}).catch(function(err) {
			var status = module.hot.status();
			if(["abort", "fail"].indexOf(status) >= 0) {
				console.warn("[HMR] Cannot check for update. Need to do a full reload!");
				console.warn("[HMR] " + err.stack || err.message);
			} else {
				console.warn("[HMR] Update check failed: " + err.stack || err.message);
			}
		});
	};
	var hotEmitter = __webpack_require__("../node_modules/webpack/hot/emitter.js");
	hotEmitter.on("webpackHotUpdate", function(currentHash) {
		lastHash = currentHash;
		if(!upToDate()) {
			var status = module.hot.status();
			if(status === "idle") {
				console.log("[HMR] Checking for updates on the server...");
				check();
			} else if(["abort", "fail"].indexOf(status) >= 0) {
				console.warn("[HMR] Cannot apply update as a previous update " + status + "ed. Need to do a full reload!");
			}
		}
	});
	console.log("[HMR] Waiting for update signal from WDS...");
} else {
	throw new Error("[HMR] Hot Module Replacement is disabled.");
}


/***/ }),

/***/ "./components/AgeSelector/AgeSelector.less":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/AgeSelector/AgeSelector.less");
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__("../node_modules/style-loader/addStyles.js")(content, {"singleton":true});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/AgeSelector/AgeSelector.less", function() {
			var newContent = __webpack_require__("../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/AgeSelector/AgeSelector.less");
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./components/AgeSelector/index.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__("../node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = __webpack_require__("../node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = __webpack_require__("../node_modules/react-dom/lib/ReactMount.js"), React = __webpack_require__("../node_modules/react/react.js"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _moment = __webpack_require__("../node_modules/moment/moment.js");

var _moment2 = _interopRequireDefault(_moment);

var _propTypes = __webpack_require__("../node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

__webpack_require__("./components/AgeSelector/AgeSelector.less");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AgeSelector = function (_React$Component) {
    _inherits(AgeSelector, _React$Component);

    function AgeSelector() {
        var _ref;

        _classCallCheck(this, AgeSelector);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = AgeSelector.__proto__ || Object.getPrototypeOf(AgeSelector)).call.apply(_ref, [this].concat(args)));

        _this.onChangeMinValue = _this.onChangeMinValue.bind(_this);
        _this.onChangeMinUnits = _this.onChangeMinUnits.bind(_this);
        _this.onChangeMaxValue = _this.onChangeMaxValue.bind(_this);
        _this.onChangeMaxUnits = _this.onChangeMaxUnits.bind(_this);
        _this.onGroupChange = _this.onGroupChange.bind(_this);
        _this.state = _this._propsToState(_this.props);
        return _this;
    }

    _createClass(AgeSelector, [{
        key: "_propsToState",
        value: function _propsToState(props) {
            var state = {};
            if (props.min && _typeof(props.min) == "object") {
                if (props.min.hasOwnProperty("value")) {
                    state.minValue = isNaN(props.min.value) ? "" : props.min.value;
                }
                if (props.min.hasOwnProperty("units")) {
                    state.minUnits = props.min.units;
                }
            }
            if (props.max && _typeof(props.max) == "object") {
                if (props.max.hasOwnProperty("value")) {
                    state.maxValue = isNaN(props.max.value) ? "" : props.max.value;
                }
                if (props.max.hasOwnProperty("units")) {
                    state.maxUnits = props.max.units;
                }
            }

            return state;
        }
    }, {
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(newProps) {
            var newState = this._propsToState(newProps);
            if (Object.keys(newState).length) {
                this.setState(newState);
            }
        }

        // Event handlers ----------------------------------------------------------

        /**
         * When the numeric value of the min-age changes
         * @param {Event} e
         */

    }, {
        key: "onChangeMinValue",
        value: function onChangeMinValue(e) {
            if (this.props.onMinChange) {
                var min = {
                    value: e.target.valueAsNumber,
                    units: this.props.min.units
                };

                if (this.canSet(min, this.props.max)) {
                    this.props.onMinChange(min);
                } else {
                    this.setState(this._propsToState({ min: min }));
                }
            }
        }

        /**
         * When the units of the min-age change
         * @param {Event} e
         */

    }, {
        key: "onChangeMinUnits",
        value: function onChangeMinUnits(e) {
            if (this.props.onMinChange) {
                var min = {
                    value: this.props.min.value,
                    units: e.target.value
                };
                if (this.canSet(min, this.props.max)) {
                    this.props.onMinChange(min);
                } else {
                    this.setState(this._propsToState({ min: min }));
                }
            }
        }

        /**
         * When the numeric value of the max-age changes
         * @param {Event} e
         */

    }, {
        key: "onChangeMaxValue",
        value: function onChangeMaxValue(e) {
            if (this.props.onMaxChange) {
                var max = {
                    value: e.target.valueAsNumber,
                    units: this.props.max.units
                };
                if (this.canSet(this.props.min, max)) {
                    this.props.onMaxChange(max);
                } else {
                    this.setState(this._propsToState({ max: max }));
                }
            }
        }

        /**
         * When the units of the max-age change
         * @param {Event} e
         */

    }, {
        key: "onChangeMaxUnits",
        value: function onChangeMaxUnits(e) {
            if (this.props.onMaxChange) {
                var max = {
                    value: this.props.max.value,
                    units: e.target.value
                };
                if (this.canSet(this.props.min, max)) {
                    this.props.onMaxChange(max);
                } else {
                    this.setState(this._propsToState({ max: max }));
                }
            }
        }

        /**
         * When the selected age group changes
         * @param {Event} e
         */

    }, {
        key: "onGroupChange",
        value: function onGroupChange(e) {
            if (this.props.onGroupChange) {
                this.props.onGroupChange(e.target.value);
            }
        }

        // Validators and helper methods -------------------------------------------

        /**
         * Given two dates (as value and units) returns true if min is before max.
         * This is used to validate inputs and prevent the user from entering
         * invalid ranges
         * @param {Object} min The min date as { value: number, units: string }
         * @param {Object} max The max date as { value: number, units: string }
         * @returns {Boolean}
         */

    }, {
        key: "canSet",
        value: function canSet(min, max) {
            var maxDuration = _moment2.default.duration(max.value, max.units);
            var minDuration = _moment2.default.duration(min.value, min.units);
            return minDuration < maxDuration;
        }

        // Rendering methods -------------------------------------------------------

    }, {
        key: "render",
        value: function render() {
            var valid = this.canSet({
                value: this.state.minValue,
                units: this.state.minUnits
            }, {
                value: this.state.maxValue,
                units: this.state.maxUnits
            });
            return _react2.default.createElement(
                "div",
                { className: "age-widget-wrap form-control input-sm" + (this.props.group == "**custom**" ? " custom" : "") },
                _react2.default.createElement(
                    "select",
                    {
                        onChange: this.onGroupChange,
                        value: this.props.group || ""
                    },
                    _react2.default.createElement(
                        "option",
                        { value: "" },
                        "Any Age"
                    ),
                    _react2.default.createElement(
                        "option",
                        { value: "infant" },
                        "Infants (0 - 12 months, Alive only)"
                    ),
                    _react2.default.createElement(
                        "option",
                        { value: "child" },
                        "Children (1 - 18 years, Alive only)"
                    ),
                    _react2.default.createElement(
                        "option",
                        { value: "adult" },
                        "Adults (18 - 65 years, Alive only)"
                    ),
                    _react2.default.createElement(
                        "option",
                        { value: "elderly" },
                        "Elderly (65+ years, Alive only)"
                    ),
                    _react2.default.createElement(
                        "option",
                        { value: "**custom**" },
                        this.props.group == "**custom**" ? "Custom Age, Alive only:" : "Custom Age, Alive only"
                    )
                ),
                this.props.group == "**custom**" ? _react2.default.createElement(
                    "div",
                    { className: "age-widget" + (valid ? "" : " invalid") },
                    _react2.default.createElement(
                        "span",
                        null,
                        "Min:"
                    ),
                    _react2.default.createElement("input", {
                        type: "number",
                        value: this.state.minValue,
                        onChange: this.onChangeMinValue,
                        min: 0,
                        step: 1
                    }),
                    _react2.default.createElement(
                        "select",
                        {
                            value: this.state.minUnits,
                            onChange: this.onChangeMinUnits
                        },
                        _react2.default.createElement(
                            "option",
                            { value: "years" },
                            "Years"
                        ),
                        _react2.default.createElement(
                            "option",
                            { value: "months" },
                            "Months"
                        ),
                        _react2.default.createElement(
                            "option",
                            { value: "days" },
                            "Days"
                        )
                    )
                ) : null,
                this.props.group == "**custom**" ? _react2.default.createElement(
                    "div",
                    { className: "age-widget" + (valid ? "" : " invalid") },
                    _react2.default.createElement(
                        "span",
                        null,
                        "Max:"
                    ),
                    _react2.default.createElement("input", {
                        type: "number",
                        value: this.state.maxValue,
                        onChange: this.onChangeMaxValue,
                        min: 0,
                        step: 1
                    }),
                    _react2.default.createElement(
                        "select",
                        {
                            value: this.state.maxUnits,
                            onChange: this.onChangeMaxUnits
                        },
                        _react2.default.createElement(
                            "option",
                            { value: "years" },
                            "Years"
                        ),
                        _react2.default.createElement(
                            "option",
                            { value: "months" },
                            "Months"
                        ),
                        _react2.default.createElement(
                            "option",
                            { value: "days" },
                            "Days"
                        )
                    )
                ) : null
            );
        }
    }]);

    return AgeSelector;
}(_react2.default.Component);

AgeSelector.propTypes = {
    min: _propTypes2.default.shape({
        value: _propTypes2.default.number,
        units: _propTypes2.default.oneOf(["years", "months", "days"])
    }),
    max: _propTypes2.default.shape({
        value: _propTypes2.default.number,
        units: _propTypes2.default.oneOf(["years", "months", "days"])
    }),
    group: _propTypes2.default.string,
    onMinChange: _propTypes2.default.func,
    onMaxChange: _propTypes2.default.func,
    onGroupChange: _propTypes2.default.func,
    update: _propTypes2.default.func
};
AgeSelector.defaultProps = {
    min: {
        value: 0,
        units: "years"
    },
    max: {
        value: 100,
        units: "years"
    },
    group: "",
    update: function update() {
        return alert("No update function provided!");
    }
};
exports.default = AgeSelector;

/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__("../node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, __webpack_require__("../node_modules/react/react.js"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "index.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./components/Alert/index.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__("../node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = __webpack_require__("../node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = __webpack_require__("../node_modules/react-dom/lib/ReactMount.js"), React = __webpack_require__("../node_modules/react/react.js"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("../node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ICONS = {
    info: "fa fa-info-circle",
    warning: "fa fa-exclamation-circle",
    danger: "fa fa-exclamation-triangle",
    success: "fa fa-thumbs-up"
};

var Alert = function (_React$Component) {
    _inherits(Alert, _React$Component);

    function Alert() {
        _classCallCheck(this, Alert);

        return _possibleConstructorReturn(this, (Alert.__proto__ || Object.getPrototypeOf(Alert)).apply(this, arguments));
    }

    _createClass(Alert, [{
        key: "render",
        value: function render() {
            return _react2.default.createElement(
                "div",
                { className: "container-fluid", style: { width: "100%" } },
                _react2.default.createElement(
                    "div",
                    { className: "row" },
                    _react2.default.createElement(
                        "div",
                        { className: "col-xs-12" },
                        _react2.default.createElement("br", null),
                        _react2.default.createElement(
                            "div",
                            { className: "alert alert-" + this.props.type },
                            this.props.close ? _react2.default.createElement(
                                "span",
                                {
                                    "aria-hidden": "true",
                                    "data-dismiss": "alert",
                                    className: "close",
                                    style: { lineHeight: "1.2rem" }
                                },
                                "\xD7"
                            ) : null,
                            this.props.icon ? _react2.default.createElement("i", { className: ICONS[this.props.type], style: {
                                    marginRight: "1ex"
                                } }) : null,
                            this.props.children
                        ),
                        _react2.default.createElement("br", null)
                    )
                )
            );
        }
    }]);

    return Alert;
}(_react2.default.Component);

Alert.propTypes = {
    type: _propTypes2.default.oneOf(["info", "warning", "danger", "success"]),
    close: _propTypes2.default.bool,
    icon: _propTypes2.default.bool,
    children: _propTypes2.default.any
};
Alert.defaultProps = {
    type: "info",
    close: true,
    icon: true
};
exports.default = Alert;

/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__("../node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, __webpack_require__("../node_modules/react/react.js"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "index.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./components/App/App.less":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/App/App.less");
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__("../node_modules/style-loader/addStyles.js")(content, {"singleton":true});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/App/App.less", function() {
			var newContent = __webpack_require__("../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/App/App.less");
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./components/App/index.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__("../node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = __webpack_require__("../node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = __webpack_require__("../node_modules/react-dom/lib/ReactMount.js"), React = __webpack_require__("../node_modules/react/react.js"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.App = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("../node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _jquery = __webpack_require__("../node_modules/jquery/dist/jquery.js");

var _jquery2 = _interopRequireDefault(_jquery);

var _json = __webpack_require__("../node_modules/json5/lib/json5.js");

var _json2 = _interopRequireDefault(_json);

var _reactRedux = __webpack_require__("../node_modules/react-redux/es/index.js");

var _Loader = __webpack_require__("./components/Loader/index.js");

var _Loader2 = _interopRequireDefault(_Loader);

var _ErrorMessage = __webpack_require__("./components/ErrorMessage/index.js");

var _ErrorMessage2 = _interopRequireDefault(_ErrorMessage);

var _query = __webpack_require__("./redux/query.js");

var _settings = __webpack_require__("./redux/settings.js");

var _lib = __webpack_require__("./lib/index.js");

__webpack_require__("./components/App/App.less");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OWNER = window.opener || (window.parent === self ? null : window.parent);
var DEFAULT_CONFIG = "stu3-open-sandbox";

var App = exports.App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App() {
        var _ref;

        _classCallCheck(this, App);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = App.__proto__ || Object.getPrototypeOf(App)).call.apply(_ref, [this].concat(args)));

        _this.state = {
            error: null
        };
        return _this;
    }

    _createClass(App, [{
        key: "handleUiBlocking",
        value: function handleUiBlocking() {
            var runningRequests = 0,
                hideDelay = void 0;

            var handle = function handle() {
                if (hideDelay) {
                    clearTimeout(hideDelay);
                }
                if (runningRequests > 0) {
                    (0, _jquery2.default)("#overlay").show();
                } else {
                    hideDelay = setTimeout(function () {
                        (0, _jquery2.default)("#overlay").hide();
                    }, 200);
                }
            };

            (0, _jquery2.default)(document).ajaxStart(function () {
                runningRequests++;
                handle();
            });

            (0, _jquery2.default)(document).ajaxComplete(function () {
                runningRequests = Math.max(--runningRequests, 0);
                handle();
            });
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this2 = this;

            this.handleUiBlocking();

            var _parseQueryString = (0, _lib.parseQueryString)(window.location.search),
                config = _parseQueryString.config,
                params = _objectWithoutProperties(_parseQueryString, ["config"]);

            var settings = {};
            _jquery2.default.ajax({
                url: "./config/" + (config || DEFAULT_CONFIG) + ".json5",
                dataType: "text",
                cache: false
            }).then(function (json) {
                json = _json2.default.parse(json);
                _jquery2.default.ajaxSetup({ timeout: json.timeout || 20000 });
                settings = _extends({}, json, params);
            }, function (errorXHR) {
                console.warn("Loading custom config: " + errorXHR.statusText);
            }).always(function () {
                var settingReceived = false;

                var onMessage = function onMessage(e) {
                    if (e.data.type == 'config' && e.data.data && _typeof(e.data.data) == "object") {
                        settingReceived = true;
                        _this2.props.dispatch((0, _settings.merge)(e.data.data));
                        _this2.props.dispatch((0, _query.fetch)());
                    }
                };

                _this2.props.dispatch((0, _settings.merge)(settings));
                _this2.props.dispatch((0, _query.setLimit)(settings.patientsPerPage));

                if (OWNER) {

                    window.addEventListener("unload", function () {
                        OWNER.postMessage({ type: "close" }, "*");
                    });

                    window.addEventListener("message", onMessage);

                    setTimeout(function () {
                        window.removeEventListener("message", onMessage);
                        if (!settingReceived) {
                            _this2.props.dispatch((0, _query.fetch)());
                        }
                    }, 1000);

                    OWNER.postMessage({ type: "ready" }, "*");
                } else {
                    _this2.props.dispatch((0, _query.fetch)());
                }
            });
        }
    }, {
        key: "render",
        value: function render() {
            if (this.state.error) {
                return _react2.default.createElement(_ErrorMessage2.default, { error: this.state.error });
            }
            if (!this.props.settings || !this.props.settings.loaded) {
                return _react2.default.createElement(
                    "div",
                    { className: "app" },
                    _react2.default.createElement(_Loader2.default, null)
                );
            }
            return _react2.default.createElement(
                "div",
                { className: "app" },
                this.props.children
            );
        }
    }]);

    return App;
}(_react2.default.Component);

App.propTypes = {
    children: _propTypes2.default.any,
    settings: _propTypes2.default.object.isRequired,
    dispatch: _propTypes2.default.func.isRequired
};
exports.default = (0, _reactRedux.connect)(function (state) {
    return _extends({}, state);
})(App);

/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__("../node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, __webpack_require__("../node_modules/react/react.js"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "index.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./components/DialogFooter/DialogFooter.less":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/DialogFooter/DialogFooter.less");
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__("../node_modules/style-loader/addStyles.js")(content, {"singleton":true});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/DialogFooter/DialogFooter.less", function() {
			var newContent = __webpack_require__("../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/DialogFooter/DialogFooter.less");
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./components/DialogFooter/index.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__("../node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = __webpack_require__("../node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = __webpack_require__("../node_modules/react-dom/lib/ReactMount.js"), React = __webpack_require__("../node_modules/react/react.js"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DialogFooter = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("../node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = __webpack_require__("../node_modules/react-redux/es/index.js");

var _settings = __webpack_require__("./redux/settings.js");

var _query = __webpack_require__("./redux/query.js");

var _selection = __webpack_require__("./redux/selection.js");

__webpack_require__("./components/DialogFooter/DialogFooter.less");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IS_POPUP = window.opener && window.name;
var IS_FRAME = parent !== self;

var SelectionUI = function (_React$Component) {
    _inherits(SelectionUI, _React$Component);

    function SelectionUI() {
        _classCallCheck(this, SelectionUI);

        return _possibleConstructorReturn(this, (SelectionUI.__proto__ || Object.getPrototypeOf(SelectionUI)).apply(this, arguments));
    }

    _createClass(SelectionUI, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            var len = Object.keys(this.props.selection).filter(function (key) {
                return !!_this2.props.selection[key];
            }).length;
            var viewClass = ["btn"];
            var resetClass = ["btn"];

            if (len === 0) {
                viewClass.push("disabled");
                resetClass.push("disabled");
            }

            if (this.props.settings.renderSelectedOnly) {
                viewClass.push("active");
            }

            var hasSelection = this.props.canShowSelected && len > 0;
            return _react2.default.createElement(
                "label",
                { disabled: len === 0 },
                _react2.default.createElement(
                    "span",
                    null,
                    len + " patient" + (len === 1 ? "" : "s") + " selected" + (hasSelection ? ':' : '')
                ),
                hasSelection ? _react2.default.createElement(
                    "div",
                    { className: "btn-group" },
                    _react2.default.createElement(
                        "div",
                        { className: viewClass.join(" "), onClick: function onClick() {
                                _this2.props.onToggleSelectionVisibility(!_this2.props.settings.renderSelectedOnly);
                            } },
                        "View Selected"
                    ),
                    _react2.default.createElement(
                        "div",
                        { className: resetClass.join(" "), onClick: function onClick() {
                                _this2.props.onResetSelection();
                            } },
                        "Clear Selected"
                    )
                ) : null
            );
        }
    }]);

    return SelectionUI;
}(_react2.default.Component);

SelectionUI.propTypes = {
    settings: _propTypes2.default.object.isRequired,
    selection: _propTypes2.default.object.isRequired,
    onToggleSelectionVisibility: _propTypes2.default.func.isRequired,
    onResetSelection: _propTypes2.default.func.isRequired,
    canShowSelected: _propTypes2.default.bool
};

var DialogFooter = exports.DialogFooter = function (_React$Component2) {
    _inherits(DialogFooter, _React$Component2);

    function DialogFooter() {
        _classCallCheck(this, DialogFooter);

        return _possibleConstructorReturn(this, (DialogFooter.__proto__ || Object.getPrototypeOf(DialogFooter)).apply(this, arguments));
    }

    _createClass(DialogFooter, [{
        key: "export",


        /**
         * Generates and returns the object that will be sent back to the client
         * when the OK button is clicked
         */
        value: function _export() {
            var _this4 = this;

            // debugger;
            var selection = this.props.selection;

            switch (this.props.settings.outputMode) {

                case "id-array":
                    // array of patient IDs
                    return Object.keys(selection).filter(function (k) {
                        return !!selection[k];
                    });

                case "transactions":
                    // array of JSON transactions objects for each patient
                    return Object.keys(selection).filter(function (k) {
                        return !!selection[k];
                    }).map(function (k) {
                        return _this4.createPatientTransaction(selection[k]);
                    });

                case "patients":
                    // array of patient JSON objects
                    return Object.keys(selection).filter(function (k) {
                        return !!selection[k];
                    }).map(function (k) {
                        return selection[k];
                    });

                case "id-list":
                    // comma-separated list of patient IDs (default)
                    return Object.keys(selection).filter(function (k) {
                        return !!selection[k];
                    }).join(",");
            }
        }
    }, {
        key: "createPatientTransaction",
        value: function createPatientTransaction() {
            throw new Error("No implemented");
        }
    }, {
        key: "showSelectedOnly",
        value: function showSelectedOnly(bOn) {
            if (bOn) {
                var selection = this.props.selection;
                this.props.setParam({
                    name: "_id",
                    value: Object.keys(selection).filter(function (k) {
                        return !!selection[k];
                    }).join(",")
                });
            } else {
                this.props.setParam({
                    name: "_id",
                    value: undefined
                });
            }
            this.props.showSelectedOnly(bOn);
        }
    }, {
        key: "renderDialogButtons",
        value: function renderDialogButtons() {
            var _this5 = this;

            if (!IS_POPUP && !IS_FRAME) {
                return null;
            }

            var OWNER = window.opener || window.parent;

            return _react2.default.createElement(
                "div",
                { className: "col-xs-6 text-right" },
                _react2.default.createElement(
                    "button",
                    { className: "btn btn-default", onClick: function onClick() {
                            OWNER.postMessage({ type: "close" }, "*");
                        } },
                    "Cancel"
                ),
                _react2.default.createElement(
                    "button",
                    { className: "btn btn-primary", onClick: function onClick() {
                            OWNER.postMessage({
                                type: "result",
                                data: _this5.export()
                            }, "*");
                        } },
                    "OK"
                )
            );
        }
    }, {
        key: "render",
        value: function render() {
            var selection = this.props.selection;
            selection = Object.keys(selection).filter(function (k) {
                return !!selection[k];
            });
            return _react2.default.createElement(
                "div",
                { className: "row dialog-buttons" },
                _react2.default.createElement(
                    "div",
                    { className: "col-xs-6 text-left" },
                    _react2.default.createElement(SelectionUI, {
                        selection: this.props.selection,
                        settings: this.props.settings,
                        onToggleSelectionVisibility: this.showSelectedOnly.bind(this),
                        onResetSelection: this.props.resetSelection,
                        canShowSelected: this.props.canShowSelected
                    })
                ),
                this.renderDialogButtons()
            );
        }
    }]);

    return DialogFooter;
}(_react2.default.Component);

DialogFooter.propTypes = {
    selection: _propTypes2.default.object.isRequired,
    settings: _propTypes2.default.object.isRequired,
    showSelectedOnly: _propTypes2.default.func.isRequired,
    resetSelection: _propTypes2.default.func.isRequired,
    setParam: _propTypes2.default.func.isRequired,
    fetch: _propTypes2.default.func.isRequired,
    canShowSelected: _propTypes2.default.bool
};
exports.default = (0, _reactRedux.connect)(function (state) {
    return {
        selection: state.selection,
        settings: state.settings,
        query: state.query
    };
}, function (dispatch) {
    return {
        showSelectedOnly: function showSelectedOnly(bValue) {
            dispatch((0, _settings.showSelectedOnly)(bValue));
            dispatch((0, _query.fetch)());
        },
        resetSelection: function resetSelection() {
            dispatch((0, _selection.setAll)({}));
            dispatch((0, _settings.showSelectedOnly)(false));
            dispatch((0, _query.setParam)({ name: "_id", value: undefined }));
            dispatch((0, _query.fetch)());
        },
        setParam: function setParam(name, value) {
            return dispatch((0, _query.setParam)(name, value));
        },
        fetch: function fetch() {
            return dispatch((0, _query.fetch)());
        }
    };
})(DialogFooter);

/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__("../node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, __webpack_require__("../node_modules/react/react.js"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "index.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./components/ErrorMessage/index.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__("../node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = __webpack_require__("../node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = __webpack_require__("../node_modules/react-dom/lib/ReactMount.js"), React = __webpack_require__("../node_modules/react/react.js"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("../node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lib = __webpack_require__("./lib/index.js");

var _Alert = __webpack_require__("./components/Alert/index.js");

var _Alert2 = _interopRequireDefault(_Alert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ErrorMessage = function (_React$Component) {
    _inherits(ErrorMessage, _React$Component);

    function ErrorMessage() {
        _classCallCheck(this, ErrorMessage);

        return _possibleConstructorReturn(this, (ErrorMessage.__proto__ || Object.getPrototypeOf(ErrorMessage)).apply(this, arguments));
    }

    _createClass(ErrorMessage, [{
        key: "render",
        value: function render() {
            return _react2.default.createElement(
                _Alert2.default,
                { type: "danger" },
                (0, _lib.getErrorMessage)(this.props.error)
            );
        }
    }]);

    return ErrorMessage;
}(_react2.default.Component);

ErrorMessage.propTypes = {
    error: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.object])
};
ErrorMessage.defaultProps = {
    error: "Unknown Error"
};
exports.default = ErrorMessage;

/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__("../node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, __webpack_require__("../node_modules/react/react.js"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "index.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./components/Fhir/CarePlan.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__("../node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = __webpack_require__("../node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = __webpack_require__("../node_modules/react-dom/lib/ReactMount.js"), React = __webpack_require__("../node_modules/react/react.js"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("../node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Grid = __webpack_require__("./components/Fhir/Grid/index.js");

var _Grid2 = _interopRequireDefault(_Grid);

var _lib = __webpack_require__("./lib/index.js");

var _Period = __webpack_require__("./components/Fhir/Period.js");

var _Period2 = _interopRequireDefault(_Period);

var _moment = __webpack_require__("../node_modules/moment/moment.js");

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CarePlan = function (_React$Component) {
    _inherits(CarePlan, _React$Component);

    function CarePlan() {
        _classCallCheck(this, CarePlan);

        return _possibleConstructorReturn(this, (CarePlan.__proto__ || Object.getPrototypeOf(CarePlan)).apply(this, arguments));
    }

    _createClass(CarePlan, [{
        key: "render",
        value: function render() {
            return _react2.default.createElement(_Grid2.default, {
                rows: (this.props.resources || []).map(function (o) {
                    return o.resource;
                }),
                title: "CarePlan",
                groupBy: "Category",
                comparator: function comparator(a, b) {
                    var dA = (0, _lib.getPath)(a, "period.start");
                    var dB = (0, _lib.getPath)(b, "period.start");
                    dA = dA ? +(0, _moment2.default)(dA) : 0;
                    dB = dB ? +(0, _moment2.default)(dB) : 0;
                    return dB - dA;
                },
                cols: [{
                    label: "Category",
                    path: "category.0.coding.0.display",
                    render: function render(rec) {
                        return _react2.default.createElement(
                            "b",
                            null,
                            (0, _lib.getPath)(rec, "category.0.coding.0.display")
                        );
                    }
                }, {
                    label: "Reason",
                    render: function render(rec) {
                        return (rec.activity || []).map(function (a, i) {
                            var reason = (0, _lib.getPath)(a, "detail.code.coding.0.display") || "";
                            return reason ? _react2.default.createElement(
                                "div",
                                { key: i },
                                reason,
                                _react2.default.createElement(
                                    "span",
                                    null,
                                    " - "
                                ),
                                _react2.default.createElement(
                                    "span",
                                    { className: "text-muted" },
                                    (0, _lib.getPath)(a, "detail.status") || "no data"
                                )
                            ) : "";
                        });
                    }
                }, {
                    label: "Period",
                    render: function render(o) {
                        return (0, _Period2.default)(o.period);
                    }
                }, {
                    label: "Status",
                    path: "status"
                }]
            });
        }
    }]);

    return CarePlan;
}(_react2.default.Component);

CarePlan.propTypes = {
    resources: _propTypes2.default.arrayOf(_propTypes2.default.object)
};
exports.default = CarePlan;

/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__("../node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, __webpack_require__("../node_modules/react/react.js"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "CarePlan.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./components/Fhir/ConditionList.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__("../node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = __webpack_require__("../node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = __webpack_require__("../node_modules/react-dom/lib/ReactMount.js"), React = __webpack_require__("../node_modules/react/react.js"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("../node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _constants = __webpack_require__("./lib/constants.js");

var _Grid = __webpack_require__("./components/Fhir/Grid/index.js");

var _Grid2 = _interopRequireDefault(_Grid);

var _Date = __webpack_require__("./components/Fhir/Date.js");

var _Date2 = _interopRequireDefault(_Date);

var _lib = __webpack_require__("./lib/index.js");

var _moment = __webpack_require__("../node_modules/moment/moment.js");

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ConditionList = function (_React$Component) {
    _inherits(ConditionList, _React$Component);

    function ConditionList() {
        _classCallCheck(this, ConditionList);

        return _possibleConstructorReturn(this, (ConditionList.__proto__ || Object.getPrototypeOf(ConditionList)).apply(this, arguments));
    }

    _createClass(ConditionList, [{
        key: "render",
        value: function render() {
            var recs = this.props.resources || [];
            var length = recs.length;
            return _react2.default.createElement(_Grid2.default, {
                rows: (recs || []).map(function (o) {
                    return o.resource;
                }),
                title: length + " Condition" + (length === 1 ? "" : "s"),
                comparator: function comparator(a, b) {
                    var dA = (0, _lib.getPath)(a, "onsetDateTime");
                    var dB = (0, _lib.getPath)(b, "onsetDateTime");
                    dA = dA ? +(0, _moment2.default)(dA) : 0;
                    dB = dB ? +(0, _moment2.default)(dB) : 0;
                    return dB - dA;
                },
                cols: [{
                    label: "Condition",
                    render: function render(o) {
                        var name = "-";
                        var code = "-";
                        var system = "";

                        if (o.code) {
                            if (o.code.text) {
                                name = o.code.text;
                            }
                            if (Array.isArray(o.code.coding) && o.code.coding.length) {
                                var c = o.code.coding[0];

                                system = c.system;
                                for (var key in _constants.CODE_SYSTEMS) {
                                    if (_constants.CODE_SYSTEMS[key].url === c.system) {
                                        system = "(" + key + ")";
                                        break;
                                    }
                                }

                                if (c.display) {
                                    name = c.display;
                                }
                                if (c.code) {
                                    code = c.code;
                                }
                            }
                        }
                        return _react2.default.createElement(
                            "div",
                            null,
                            _react2.default.createElement(
                                "b",
                                null,
                                name
                            ),
                            _react2.default.createElement(
                                "small",
                                { className: "text-muted pull-right" },
                                code,
                                " ",
                                system
                            )
                        );
                    }
                }, {
                    label: _react2.default.createElement(
                        "div",
                        { className: "text-center" },
                        "Clinical Status"
                    ),
                    render: function render(o) {
                        return _react2.default.createElement(
                            "div",
                            { className: "text-center" },
                            o.clinicalStatus
                        );
                    }
                }, {
                    label: _react2.default.createElement(
                        "div",
                        { className: "text-center" },
                        "Verification Status"
                    ),
                    render: function render(o) {
                        return _react2.default.createElement(
                            "div",
                            { className: "text-center" },
                            o.verificationStatus || "-"
                        );
                    }
                }, {
                    label: _react2.default.createElement(
                        "div",
                        { className: "text-center" },
                        "Onset Date"
                    ),
                    render: function render(o) {
                        var onset = o.onsetDateTime || "";
                        return _react2.default.createElement(
                            "div",
                            { className: "text-center" },
                            onset ? _react2.default.createElement(_Date2.default, { moment: o.onsetDateTime }) : "-"
                        );
                    }
                }]
            });
        }
    }]);

    return ConditionList;
}(_react2.default.Component);

ConditionList.propTypes = {
    resources: _propTypes2.default.arrayOf(_propTypes2.default.object)
};
exports.default = ConditionList;

/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__("../node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, __webpack_require__("../node_modules/react/react.js"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "ConditionList.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./components/Fhir/Date.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__("../node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = __webpack_require__("../node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = __webpack_require__("../node_modules/react-dom/lib/ReactMount.js"), React = __webpack_require__("../node_modules/react/react.js"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Date;

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("../node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _moment = __webpack_require__("../node_modules/moment/moment.js");

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function Date(_ref) {
    var moment = _ref.moment,
        _ref$format = _ref.format,
        format = _ref$format === undefined ? "MM/DD/YYYY" : _ref$format,
        rest = _objectWithoutProperties(_ref, ["moment", "format"]);

    return _react2.default.createElement(
        "span",
        rest,
        (0, _moment2.default)(moment).format(format)
    );
}

Date.propTypes = {
    format: _propTypes2.default.string,
    moment: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.instanceOf(Date), _propTypes2.default.object // moment
    ]).isRequired
};

/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__("../node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, __webpack_require__("../node_modules/react/react.js"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "Date.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./components/Fhir/Encounter.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__("../node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = __webpack_require__("../node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = __webpack_require__("../node_modules/react-dom/lib/ReactMount.js"), React = __webpack_require__("../node_modules/react/react.js"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("../node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _moment = __webpack_require__("../node_modules/moment/moment.js");

var _moment2 = _interopRequireDefault(_moment);

var _Grid = __webpack_require__("./components/Fhir/Grid/index.js");

var _Grid2 = _interopRequireDefault(_Grid);

var _lib = __webpack_require__("./lib/index.js");

var _Period = __webpack_require__("./components/Fhir/Period.js");

var _Period2 = _interopRequireDefault(_Period);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function getEncounterClass(encounter) {
    return encounter.class && _typeof(encounter.class) == "object" ? (0, _lib.getPath)(encounter, "class.type.0.text") : encounter.class;
}

function getEncounterLabel(encounter) {
    var result = (0, _lib.getPath)(encounter, "type.0.text");
    if (result) {
        return result;
    }
    var _class = getEncounterClass(encounter);
    if (_class) {
        return _class + " encounter";
    }
    return "";
}

var Encounter = function (_React$Component) {
    _inherits(Encounter, _React$Component);

    function Encounter() {
        _classCallCheck(this, Encounter);

        return _possibleConstructorReturn(this, (Encounter.__proto__ || Object.getPrototypeOf(Encounter)).apply(this, arguments));
    }

    _createClass(Encounter, [{
        key: "render",
        value: function render() {
            return _react2.default.createElement(_Grid2.default, {
                rows: (this.props.resources || []).map(function (o) {
                    return o.resource;
                }),
                title: "Encounter" + (this.props.resources.length === 1 ? "" : "s"),
                groupBy: "Type",
                comparator: function comparator(a, b) {
                    var dA = (0, _lib.getPath)(a, "period.start");
                    var dB = (0, _lib.getPath)(b, "period.start");
                    dA = dA ? +(0, _moment2.default)(dA) : 0;
                    dB = dB ? +(0, _moment2.default)(dB) : 0;
                    return dB - dA;
                },
                cols: [{
                    label: "Type",
                    path: function path(rec) {
                        return getEncounterLabel(rec);
                    },
                    render: function render(rec) {
                        var result = (0, _lib.getPath)(rec, "type.0.text");
                        if (result) {
                            return _react2.default.createElement(
                                "b",
                                null,
                                result
                            );
                        }
                        var _class = getEncounterClass(rec);
                        if (_class) {
                            return _react2.default.createElement(
                                "span",
                                { className: "text-muted" },
                                _class + " encounter"
                            );
                        }
                        return _react2.default.createElement(
                            "small",
                            { className: "text-muted" },
                            "N/A"
                        );
                    }
                }, {
                    label: "Reason",
                    path: "reason.0.coding.0.display",
                    defaultValue: "N/A"
                }, {
                    label: "Class",
                    render: function render(rec) {
                        var result = getEncounterClass(rec);
                        return result ? _react2.default.createElement(
                            "b",
                            null,
                            result
                        ) : _react2.default.createElement(
                            "small",
                            { className: "text-muted" },
                            "N/A"
                        );
                    }
                }, {
                    label: "Status",
                    path: "status",
                    defaultValue: "N/A"
                }, {
                    label: "Time",
                    path: "period",
                    render: function render(o) {
                        return (0, _Period2.default)(o.period || {});
                    }
                }]
            });
        }
    }]);

    return Encounter;
}(_react2.default.Component);

Encounter.propTypes = {
    resources: _propTypes2.default.arrayOf(_propTypes2.default.object)
};
exports.default = Encounter;

/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__("../node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, __webpack_require__("../node_modules/react/react.js"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "Encounter.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./components/Fhir/Grid/index.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__("../node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = __webpack_require__("../node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = __webpack_require__("../node_modules/react-dom/lib/ReactMount.js"), React = __webpack_require__("../node_modules/react/react.js"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Grid = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("../node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lib = __webpack_require__("./lib/index.js");

var _reactRedux = __webpack_require__("../node_modules/react-redux/es/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Renders group of resources in a grid (table) where each component represents
 * one row...
 */
var Grid = exports.Grid = function (_React$Component) {
    _inherits(Grid, _React$Component);

    function Grid(props) {
        _classCallCheck(this, Grid);

        var _this = _possibleConstructorReturn(this, (Grid.__proto__ || Object.getPrototypeOf(Grid)).call(this, props));

        _this.state = {
            __rows: _this.sortRows(_this.props.rows, _this.props.comparator)
        };
        return _this;
    }

    _createClass(Grid, [{
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(newProps) {
            if (Array.isArray(newProps.rows)) {
                this.setState({
                    __rows: this.sortRows(newProps.rows, newProps.comparator)
                });
            }
        }
    }, {
        key: "sortRows",
        value: function sortRows(rows, comparator) {
            if (!comparator) {
                return rows;
            }
            return rows.sort(comparator);
        }
    }, {
        key: "renderResource",
        value: function renderResource(res, i) {
            var url = this.props.settings.server.url + "/" + res.resourceType + "/" + res.id;
            if (this.props.settings.fhirViewer.enabled) {
                url = this.props.settings.fhirViewer.url + (this.props.settings.fhirViewer.url.indexOf("?") > -1 ? "&" : "?") + this.props.settings.fhirViewer.param + "=" + encodeURIComponent(url);
            }

            return _react2.default.createElement(
                "tr",
                {
                    key: i,
                    onClick: function onClick() {
                        return window.open(url, "_blank");
                    },
                    style: { cursor: "pointer" }
                },
                this.props.cols.map(function (col, i) {
                    var render = col.render,
                        path = col.path,
                        cellProps = col.cellProps,
                        defaultValue = col.defaultValue;

                    cellProps = _extends({}, cellProps, { key: i });
                    if (typeof render == "function") {
                        return _react2.default.createElement(
                            "td",
                            cellProps,
                            render(res)
                        );
                    }
                    return _react2.default.createElement(
                        "td",
                        cellProps,
                        (0, _lib.getPath)(res, path) || _react2.default.createElement(
                            "small",
                            { className: "text-muted" },
                            defaultValue || "-"
                        )
                    );
                })
            );
        }
    }, {
        key: "renderRows",
        value: function renderRows() {
            var _this2 = this;

            if (!this.state.__enableGrouping) {
                return this.state.__rows.map(this.renderResource, this);
            }

            var groupColIndex = this.props.groupBy ? this.props.cols.findIndex(function (c) {
                return c.name === _this2.props.groupBy || c.label === _this2.props.groupBy;
            }) : -1;
            var groupPath = groupColIndex > -1 ? this.props.cols[groupColIndex].path : null;

            if (!groupPath) {
                return this.state.__rows.map(this.renderResource, this);
            }

            var groups = {};
            this.state.__rows.forEach(function (rec, i) {
                var groupValue = typeof groupPath == "function" ? groupPath(rec) : (0, _lib.getPath)(rec, groupPath);
                groupValue = groupValue || "Empty Group";
                if (!groups.hasOwnProperty(groupValue)) {
                    groups[groupValue] = [];
                }
                groups[groupValue].push(_this2.renderResource(rec, i));
            });

            var out = [];

            var _loop = function _loop(group) {
                if (groups[group].length > 1) {
                    out.push(_react2.default.createElement(
                        "tr",
                        { className: "group-header", key: group },
                        _react2.default.createElement(
                            "th",
                            { colSpan: _this2.props.cols.length, onClick: function onClick() {
                                    return _this2.setState(_defineProperty({}, group, _this2.state[group] === false ? true : false));
                                } },
                            _react2.default.createElement("i", { className: "glyphicon glyphicon-triangle-" + (_this2.state[group] !== false ? "bottom" : "right") }),
                            " ",
                            group,
                            " ",
                            _react2.default.createElement(
                                "small",
                                { className: "badge" },
                                groups[group].length
                            )
                        )
                    ));
                    if (_this2.state[group] !== false) {
                        out = out.concat(groups[group]);
                    }
                } else {
                    out.push(_react2.default.createElement("tr", { className: "group-clear", key: group }));
                    out = out.concat(groups[group]);
                }
            };

            for (var group in groups) {
                _loop(group);
            }
            return out;
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            return _react2.default.createElement(
                "div",
                { className: "panel panel-default" + (this.state.__enableGrouping ? " grouped" : "") },
                this.props.title ? _react2.default.createElement(
                    "div",
                    { className: "panel-heading" },
                    this.props.groupBy && this.state.__rows.length > 1 && _react2.default.createElement(
                        "label",
                        { className: "pull-right" },
                        "Group by ",
                        this.props.groupBy,
                        " ",
                        _react2.default.createElement("input", {
                            type: "checkbox",
                            checked: !!this.state.__enableGrouping,
                            onChange: function onChange(e) {
                                return _this3.setState({
                                    __enableGrouping: e.target.checked
                                });
                            }
                        })
                    ),
                    _react2.default.createElement(
                        "b",
                        { className: "text-primary" },
                        _react2.default.createElement("i", { className: "fa fa-address-card-o" }),
                        " ",
                        this.props.title
                    )
                ) : null,
                _react2.default.createElement(
                    "div",
                    { className: "table-responsive" },
                    _react2.default.createElement(
                        "table",
                        { className: "table table-condensed table-hover table-striped table-bordered", style: {
                                minWidth: this.props.cols.length * 200
                            } },
                        _react2.default.createElement(
                            "thead",
                            null,
                            _react2.default.createElement(
                                "tr",
                                null,
                                this.props.cols.map(function (col, i) {
                                    var headerProps = col.headerProps,
                                        label = col.label;

                                    headerProps = _extends({}, headerProps, { key: i });
                                    return _react2.default.createElement(
                                        "th",
                                        headerProps,
                                        label || ""
                                    );
                                })
                            )
                        ),
                        _react2.default.createElement(
                            "tbody",
                            null,
                            this.renderRows()
                        )
                    )
                )
            );
        }
    }]);

    return Grid;
}(_react2.default.Component);

Grid.propTypes = {
    rows: _propTypes2.default.arrayOf(_propTypes2.default.object).isRequired,
    cols: _propTypes2.default.arrayOf(_propTypes2.default.object).isRequired,
    settings: _propTypes2.default.object.isRequired,
    title: _propTypes2.default.string,
    groupBy: _propTypes2.default.string,
    comparator: _propTypes2.default.func
};
exports.default = (0, _reactRedux.connect)(function (state) {
    return {
        settings: state.settings
    };
})(Grid);

/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__("../node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, __webpack_require__("../node_modules/react/react.js"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "index.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./components/Fhir/ImmunizationList.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__("../node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = __webpack_require__("../node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = __webpack_require__("../node_modules/react-dom/lib/ReactMount.js"), React = __webpack_require__("../node_modules/react/react.js"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("../node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _moment = __webpack_require__("../node_modules/moment/moment.js");

var _moment2 = _interopRequireDefault(_moment);

var _Grid = __webpack_require__("./components/Fhir/Grid/index.js");

var _Grid2 = _interopRequireDefault(_Grid);

var _Date = __webpack_require__("./components/Fhir/Date.js");

var _Date2 = _interopRequireDefault(_Date);

var _lib = __webpack_require__("./lib/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ImmunizationList = function (_React$Component) {
    _inherits(ImmunizationList, _React$Component);

    function ImmunizationList() {
        _classCallCheck(this, ImmunizationList);

        return _possibleConstructorReturn(this, (ImmunizationList.__proto__ || Object.getPrototypeOf(ImmunizationList)).apply(this, arguments));
    }

    _createClass(ImmunizationList, [{
        key: "render",
        value: function render() {
            return _react2.default.createElement(_Grid2.default, {
                rows: (this.props.resources || []).map(function (o) {
                    return o.resource;
                }),
                title: "Immunizations",
                groupBy: "Type",
                comparator: function comparator(a, b) {
                    var dA = (0, _lib.getPath)(a, "date");
                    var dB = (0, _lib.getPath)(b, "date");
                    dA = dA ? +(0, _moment2.default)(dA) : 0;
                    dB = dB ? +(0, _moment2.default)(dB) : 0;
                    return dB - dA;
                },
                cols: [{
                    label: "Type",
                    path: "vaccineCode.coding.0.display"
                }, {
                    label: "Status",
                    render: function render(o) {
                        return o.status || "-";
                    }
                }, {
                    label: "Date",
                    render: function render(o) {
                        return o.date ? _react2.default.createElement(_Date2.default, { moment: o.date }) : "-";
                    }
                }]
            });
        }
    }]);

    return ImmunizationList;
}(_react2.default.Component);

ImmunizationList.propTypes = {
    resources: _propTypes2.default.arrayOf(_propTypes2.default.object)
};
exports.default = ImmunizationList;

/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__("../node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, __webpack_require__("../node_modules/react/react.js"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "ImmunizationList.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./components/Fhir/Observation.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__("../node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = __webpack_require__("../node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = __webpack_require__("../node_modules/react-dom/lib/ReactMount.js"), React = __webpack_require__("../node_modules/react/react.js"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("../node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _moment = __webpack_require__("../node_modules/moment/moment.js");

var _moment2 = _interopRequireDefault(_moment);

var _lib = __webpack_require__("./lib/index.js");

var _Grid = __webpack_require__("./components/Fhir/Grid/index.js");

var _Grid2 = _interopRequireDefault(_Grid);

var _ValueRange = __webpack_require__("./components/Fhir/ValueRange.js");

var _ValueRange2 = _interopRequireDefault(_ValueRange);

var _Time = __webpack_require__("./components/Fhir/Time.js");

var _Time2 = _interopRequireDefault(_Time);

var _Period = __webpack_require__("./components/Fhir/Period.js");

var _Period2 = _interopRequireDefault(_Period);

var _Date = __webpack_require__("./components/Fhir/Date.js");

var _Date2 = _interopRequireDefault(_Date);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Observations = function (_React$Component) {
    _inherits(Observations, _React$Component);

    function Observations() {
        _classCallCheck(this, Observations);

        return _possibleConstructorReturn(this, (Observations.__proto__ || Object.getPrototypeOf(Observations)).apply(this, arguments));
    }

    _createClass(Observations, [{
        key: "getObservationLabel",
        value: function getObservationLabel(o) {
            return (0, _lib.getPath)(o, "code.coding.0.display") || (0, _lib.getPath)(o, "code.text") || (0, _lib.getPath)(o, "valueQuantity.code");
        }
    }, {
        key: "renderObservation",
        value: function renderObservation(o) {
            var _this2 = this;

            var includeLabel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            if (Array.isArray(o.component)) {
                return o.component.map(function (c, i) {
                    var result = _this2.renderObservation(c, true);
                    return _react2.default.createElement(
                        "span",
                        { key: i },
                        i > 0 && _react2.default.createElement(
                            "span",
                            null,
                            ",\xA0"
                        ),
                        result
                    );
                });
            }

            var returnResult = function returnResult(result) {
                return _react2.default.createElement(
                    "span",
                    null,
                    includeLabel && _react2.default.createElement(
                        "label",
                        { className: "text-muted" },
                        _this2.getObservationLabel(o).replace(/^\s*(Systolic|Diastolic)\s+blood\s+pressure\s*$/gi, "$1"),
                        ":\xA0"
                    ),
                    result
                );
            };

            // valueBoolean
            if (o.hasOwnProperty("valueBoolean")) {
                return returnResult(!o.valueBoolean || o.valueBoolean == "false" ? "Negative" : "Positive");
            }

            // valueString
            if (o.hasOwnProperty("valueString")) {
                return returnResult(String(o.valueString));
            }

            // valueRange
            if (o.hasOwnProperty("valueRange")) {
                return returnResult(_react2.default.createElement(_ValueRange2.default, { range: o.valueRange }));
            }

            // valueTime
            if (o.hasOwnProperty("valueTime")) {
                return returnResult(_react2.default.createElement(_Time2.default, { moment: o.valueTime }));
            }

            // valueDateTime
            if (o.hasOwnProperty("valueDateTime")) {
                return returnResult(_react2.default.createElement(_Date2.default, { moment: o.valueDateTime }));
            }

            // valuePeriod
            if (o.hasOwnProperty("valuePeriod")) {
                return returnResult((0, _Period2.default)(o.valuePeriod));
            }

            // valueCodeableConcept
            if (o.hasOwnProperty("valueCodeableConcept")) {
                return returnResult((0, _lib.getPath)(o, "valueCodeableConcept.coding.0.display"));
            }

            // valueQuantity
            if (o.hasOwnProperty("valueQuantity")) {
                var value = (0, _lib.getPath)(o, "valueQuantity.value");
                var units = (0, _lib.getPath)(o, "valueQuantity.unit");

                if (!isNaN(parseFloat(value))) {
                    value = Math.round(value * 100) / 100;
                }

                return returnResult(_react2.default.createElement(
                    "span",
                    null,
                    value,
                    " ",
                    _react2.default.createElement(
                        "span",
                        { className: "text-muted" },
                        units
                    )
                ));
            }

            /* TODO:
            valueRatio      : Ratio
            valueSampledData: SampledData
            valueAttachment : Attachment
            */

            return returnResult(_react2.default.createElement(
                "span",
                { className: "text-muted" },
                "N/A"
            ));
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            return _react2.default.createElement(_Grid2.default, {
                rows: (this.props.resources || []).map(function (o) {
                    return o.resource;
                }),
                title: "Observations",
                groupBy: "Name",
                comparator: function comparator(a, b) {
                    var dA = (0, _lib.getPath)(a, "effectiveDateTime") || (0, _lib.getPath)(a, "meta.lastUpdated");
                    var dB = (0, _lib.getPath)(b, "effectiveDateTime") || (0, _lib.getPath)(b, "meta.lastUpdated");
                    dA = dA ? +(0, _moment2.default)(dA) : 0;
                    dB = dB ? +(0, _moment2.default)(dB) : 0;
                    return dB - dA;
                },
                cols: [{
                    label: "Name",
                    path: function path(o) {
                        return _this3.getObservationLabel(o);
                    },
                    render: function render(o) {
                        return _react2.default.createElement(
                            "b",
                            null,
                            _this3.getObservationLabel(o)
                        );
                    }
                }, {
                    label: "Value",
                    render: function render(o) {
                        return _this3.renderObservation(o);
                    }
                }, {
                    label: "Date",
                    render: function render(o) {
                        var date = (0, _lib.getPath)(o, "effectiveDateTime") || (0, _lib.getPath)(o, "meta.lastUpdated");
                        if (date) date = (0, _moment2.default)(date).format("MM/DD/YYYY");
                        return _react2.default.createElement(
                            "div",
                            { className: "text-muted" },
                            date || "-"
                        );
                    }
                }]
            });
        }
    }]);

    return Observations;
}(_react2.default.Component);

Observations.propTypes = {
    resources: _propTypes2.default.arrayOf(_propTypes2.default.object)
};
exports.default = Observations;

/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__("../node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, __webpack_require__("../node_modules/react/react.js"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "Observation.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./components/Fhir/Period.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__("../node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = __webpack_require__("../node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = __webpack_require__("../node_modules/react-dom/lib/ReactMount.js"), React = __webpack_require__("../node_modules/react/react.js"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Period;

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _moment = __webpack_require__("../node_modules/moment/moment.js");

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Period(period) {
    var from = period.start || "";
    var to = period.end || "";

    if (from && to) {
        from = (0, _moment2.default)(from);
        to = (0, _moment2.default)(to);

        if (from.isSame(to, "day")) {
            return _react2.default.createElement(
                "span",
                null,
                from.format("MM/DD/YYYY"),
                from.isSame(to, "hour") ? null : _react2.default.createElement(
                    "span",
                    null,
                    _react2.default.createElement(
                        "small",
                        { className: "text-muted" },
                        " from "
                    ),
                    from.format("HH:mm"),
                    _react2.default.createElement(
                        "small",
                        { className: "text-muted" },
                        " to "
                    ),
                    to.format("HH:mm")
                )
            );
        } else {
            return _react2.default.createElement(
                "span",
                null,
                _react2.default.createElement(
                    "small",
                    { className: "text-muted" },
                    " from "
                ),
                from.format("MM/DD/YYYY"),
                _react2.default.createElement(
                    "small",
                    { className: "text-muted" },
                    " to "
                ),
                to.format("MM/DD/YYYY")
            );
        }
    } else {
        if (from) {
            from = (0, _moment2.default)(from);
            return _react2.default.createElement(
                "span",
                null,
                _react2.default.createElement(
                    "small",
                    { className: "text-muted" },
                    " from "
                ),
                from.format("MM/DD/YYYY")
            );
        } else if (to) {
            to = (0, _moment2.default)(to);
            return _react2.default.createElement(
                "span",
                null,
                _react2.default.createElement(
                    "small",
                    { className: "text-muted" },
                    " to "
                ),
                to.format("MM/DD/YYYY")
            );
        }
    }
    return _react2.default.createElement(
        "small",
        { className: "text-muted" },
        "N/A"
    );
}

/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__("../node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, __webpack_require__("../node_modules/react/react.js"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "Period.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./components/Fhir/Person.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__("../node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = __webpack_require__("../node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = __webpack_require__("../node_modules/react-dom/lib/ReactMount.js"), React = __webpack_require__("../node_modules/react/react.js"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("../node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _moment = __webpack_require__("../node_modules/moment/moment.js");

var _moment2 = _interopRequireDefault(_moment);

var _Grid = __webpack_require__("./components/Fhir/Grid/index.js");

var _Grid2 = _interopRequireDefault(_Grid);

var _Date = __webpack_require__("./components/Fhir/Date.js");

var _Date2 = _interopRequireDefault(_Date);

var _lib = __webpack_require__("./lib/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Person = function (_React$Component) {
    _inherits(Person, _React$Component);

    function Person() {
        _classCallCheck(this, Person);

        return _possibleConstructorReturn(this, (Person.__proto__ || Object.getPrototypeOf(Person)).apply(this, arguments));
    }

    _createClass(Person, [{
        key: "render",
        value: function render() {
            return _react2.default.createElement(_Grid2.default, {
                rows: (this.props.resources || []).map(function (o) {
                    return o.resource;
                }),
                title: this.props.title,
                comparator: function comparator(a, b) {
                    var dA = (0, _lib.getPath)(a, "birthDate");
                    var dB = (0, _lib.getPath)(b, "birthDate");
                    dA = dA ? +(0, _moment2.default)(dA) : 0;
                    dB = dB ? +(0, _moment2.default)(dB) : 0;
                    return dB - dA;
                },
                cols: [{
                    label: "Identifier",
                    render: function render(rec) {
                        var rows = [_react2.default.createElement(
                            "tr",
                            { key: "id" },
                            _react2.default.createElement(
                                "td",
                                { className: "label-cell" },
                                "ID"
                            ),
                            _react2.default.createElement(
                                "td",
                                null,
                                rec.id
                            )
                        )];

                        if (Array.isArray(rec.identifier)) {
                            rows = rows.concat(rec.identifier.map(function (o) {
                                var code = (0, _lib.getPath)(o, "type.coding.0.display") || (0, _lib.getPath)(o, "type.text") || (0, _lib.getPath)(o, "type.coding.0.code") || String((0, _lib.getPath)(o, "system") || "").split(/\b/).pop();
                                if (!code) return null;
                                return _react2.default.createElement(
                                    "tr",
                                    { key: code },
                                    _react2.default.createElement(
                                        "td",
                                        { className: "label-cell" },
                                        code
                                    ),
                                    _react2.default.createElement(
                                        "td",
                                        null,
                                        o.value
                                    )
                                );
                            }).filter(Boolean));
                        }

                        return _react2.default.createElement(
                            "table",
                            null,
                            _react2.default.createElement(
                                "tbody",
                                null,
                                rows
                            )
                        );
                    }
                }, {
                    label: "Name",
                    render: _lib.getPatientName,
                    defaultValue: "N/A"
                }, {
                    label: "Gender",
                    path: "gender",
                    defaultValue: "N/A"
                }, {
                    label: "Birth Date",
                    path: "birthDate",
                    defaultValue: "N/A",
                    render: function render(o) {
                        return _react2.default.createElement(_Date2.default, { moment: o.birthDate });
                    }
                }]
            });
        }
    }]);

    return Person;
}(_react2.default.Component);

Person.propTypes = {
    resources: _propTypes2.default.arrayOf(_propTypes2.default.object),
    title: _propTypes2.default.string
};
Person.defaultProps = {
    title: "Person"
};
exports.default = Person;

/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__("../node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, __webpack_require__("../node_modules/react/react.js"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "Person.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./components/Fhir/ResourceList.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__("../node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = __webpack_require__("../node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = __webpack_require__("../node_modules/react-dom/lib/ReactMount.js"), React = __webpack_require__("../node_modules/react/react.js"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("../node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Grid = __webpack_require__("./components/Fhir/Grid/index.js");

var _Grid2 = _interopRequireDefault(_Grid);

var _lib = __webpack_require__("./lib/index.js");

var _Period = __webpack_require__("./components/Fhir/Period.js");

var _Period2 = _interopRequireDefault(_Period);

var _Date = __webpack_require__("./components/Fhir/Date.js");

var _Date2 = _interopRequireDefault(_Date);

var _moment = __webpack_require__("../node_modules/moment/moment.js");

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function renderCell(record, allOf, oneOf) {

    var entries = [];

    var visit = function visit(meta) {
        var propValue = (0, _lib.getPath)(record, meta.path);
        if (propValue !== undefined) {
            var value = meta.render ? meta.render(record) : propValue;
            var raw = meta.raw ? meta.raw(record) : value;
            var label = typeof meta.label == "function" ? meta.label(record) : meta.label;
            var existing = entries.find(function (o) {
                return o.value === raw;
            });
            if (existing) {
                existing.label += ", " + label;
            } else {
                entries.push({ label: label, value: value });
            }
            return true;
        }
        return false;
    };

    allOf.forEach(visit);

    if (!entries.length) {
        oneOf.some(visit);
    }

    if (entries.length) {
        return _react2.default.createElement(
            "table",
            null,
            _react2.default.createElement(
                "tbody",
                null,
                entries.map(function (o, i) {
                    return _react2.default.createElement(
                        "tr",
                        { key: i },
                        _react2.default.createElement(
                            "td",
                            { className: "label-cell" },
                            o.label
                        ),
                        _react2.default.createElement(
                            "td",
                            null,
                            o.value
                        )
                    );
                })
            )
        );
    }

    return "-";
}

function getSortValue(rec) {
    var paths = ["authoredOn", "dateWritten", "performedDateTime", "recorded", "performedPeriod.start", "availableTime.0.availableStartTime", "whenHandedOver", "issued", "effectiveDateTime", "assertedDate", "meta.lastUpdated"];

    for (var i = 0, l = paths.length; i < l; i++) {
        var v = (0, _lib.getPath)(rec, paths[i]);
        if (v !== undefined) {
            return v;
        }
    }

    return 0;
}

function DataLink(_ref) {
    var settings = _ref.settings,
        path = _ref.path,
        children = _ref.children;

    var url = settings.server.url + "/" + path;
    if (settings.fhirViewer.enabled) {
        url = settings.fhirViewer.url + (settings.fhirViewer.url.indexOf("?") > -1 ? "&" : "?") + settings.fhirViewer.param + "=" + encodeURIComponent(url);
    }
    return _react2.default.createElement(
        "a",
        { onClick: function onClick() {
                window.open(url, "_blank");
                return false;
            } },
        children
    );
}

DataLink.propTypes = {
    settings: _propTypes2.default.object.isRequired,
    path: _propTypes2.default.string.isRequired,
    children: _propTypes2.default.any
};

var ResourceList = function (_React$Component) {
    _inherits(ResourceList, _React$Component);

    function ResourceList() {
        _classCallCheck(this, ResourceList);

        return _possibleConstructorReturn(this, (ResourceList.__proto__ || Object.getPrototypeOf(ResourceList)).apply(this, arguments));
    }

    _createClass(ResourceList, [{
        key: "determineSchema",


        /**
         * The idea is to have 3 columns by default:
         * 1. Identifier - something like a name, type, id etc.
         * 2. Details - the important part that will describe the resource
         * 3. Timing - time period, time, age etc.
         * @returns {Array} The generated schema
         */
        value: function determineSchema(sampleResource) {
            var _this2 = this;

            var out = [];

            if (!sampleResource) {
                return out;
            }

            // 1. Identifier -------------------------------------------------------
            out.push({
                label: "Identifier",
                render: function render(o) {
                    return renderCell(o, [{
                        path: "id",
                        label: "ID",
                        ellipsis: 15
                    }, {
                        path: "name",
                        label: "Name"
                    }, {
                        path: "identifier.0.type.coding.0.code",
                        label: "Identifiers",
                        render: function render(rec) {
                            if (Array.isArray(rec.identifier)) {
                                return rec.identifier.map(function (id) {
                                    var code = (0, _lib.getPath)(id, "type.coding.0.code");
                                    if (!code) return null;
                                    return code + ": " + id.value;
                                }).filter(Boolean).join(", ");
                            }
                            return "-";
                        }
                    }]);
                }
            });

            // 2. Details ----------------------------------------------------------
            out.push({
                label: "Details",
                render: function render(o) {
                    return renderCell(o, [{
                        path: "description.text",
                        label: "Description"
                    }, {
                        path: "code.text",
                        label: "Code"
                    }, {
                        path: "code.coding.0.display",
                        label: "Display"
                    }, {
                        path: "medicationCodeableConcept.coding.0.display",
                        label: "Medication"
                    }, {
                        path: "medicationCodeableConcept.coding.0.code",
                        label: function label(rec) {
                            return ((0, _lib.getPath)(rec, "medicationCodeableConcept.coding.0.system") || "").split(/\b/).pop();
                        }
                    }, {
                        path: "code.coding.0.code",
                        label: function label(rec) {
                            return ((0, _lib.getPath)(rec, "code.coding.0.system") || "").replace(/\/$/, "").split(/\//).pop() + " code";
                        }
                    }, {
                        path: "result.0.display",
                        label: "Result",
                        render: function render(rec) {
                            return rec.result.map(function (r) {
                                return r.display || 0;
                            }).filter(Boolean).join(", ");
                        }
                    }, {
                        label: "Status",
                        path: "status"
                    }, {
                        label: "Clinical Status",
                        path: "clinicalStatus"
                    }, {
                        label: "Verification Status",
                        path: "verificationStatus"
                    }, {
                        label: "Value as String",
                        path: "valueString"
                    }, {
                        label: "Comment",
                        path: "comment"
                    }, {
                        label: "Extra Details",
                        path: "extraDetails"
                    }, {
                        label: "Type",
                        path: "type",
                        render: function render(rec) {
                            if (Array.isArray(rec.type)) {
                                return rec.type.map(function (t) {
                                    return t.text || (0, _lib.getPath)(t, "coding.0.display") || "";
                                }).filter(Boolean).join(", ");
                            }
                            return String((0, _lib.getPath)(rec, "type.coding.0.display") || (0, _lib.getPath)(rec, "type.text") || rec.type);
                        }
                    }, {
                        label: "Criticality",
                        path: "criticality"
                    }, {
                        label: "Category",
                        path: "category",
                        render: function render(rec) {
                            function renderCategory(c) {
                                if (!c) {
                                    return "N/A";
                                }

                                if (typeof c == "string") {
                                    return c;
                                }

                                if (Array.isArray(c)) {
                                    return c.map(renderCategory).join(", ");
                                }

                                if ((typeof c === "undefined" ? "undefined" : _typeof(c)) != "object") {
                                    return "N/A";
                                }

                                return c.text || c.display || c.code || renderCategory(c.coding);
                            }

                            return renderCategory(rec.category);
                        }
                    }, {
                        label: "Quantity",
                        path: "quantity.value",
                        render: function render(rec) {
                            return _react2.default.createElement(
                                "span",
                                null,
                                rec.quantity.value,
                                _react2.default.createElement(
                                    "span",
                                    { className: "text-muted" },
                                    " ",
                                    rec.quantity.unit || rec.quantity.units || ""
                                )
                            );
                        }
                    }, {
                        label: "Days Supply",
                        path: "daysSupply.value",
                        render: function render(rec) {
                            return _react2.default.createElement(
                                "span",
                                null,
                                rec.daysSupply.value,
                                _react2.default.createElement(
                                    "span",
                                    { className: "text-muted" },
                                    "\xA0",
                                    rec.daysSupply.unit || rec.daysSupply.units || ""
                                )
                            );
                        }
                    }, {
                        label: "Medication",
                        path: "medicationReference.reference",
                        render: function render(rec) {
                            return _react2.default.createElement(
                                DataLink,
                                {
                                    settings: _this2.props.settings,
                                    path: rec.medicationReference.reference
                                },
                                rec.medicationReference.reference
                            );
                        }
                    }], [{
                        path: "text.div",
                        label: "Text",
                        render: function render(rec) {
                            return _react2.default.createElement("span", { dangerouslySetInnerHTML: { __html: rec.text.div } });
                        }
                    }]);
                }
            });

            // 2. Timings ----------------------------------------------------------
            out.push({
                label: "Date",
                render: function render(o) {
                    return renderCell(o, [{
                        path: "authoredOn",
                        label: "Authored On",
                        render: function render(rec) {
                            return _react2.default.createElement(_Date2.default, { moment: rec.authoredOn });
                        }
                    }, {
                        path: "dateWritten",
                        label: "Date Written",
                        render: function render(rec) {
                            return _react2.default.createElement(_Date2.default, { moment: rec.dateWritten });
                        }
                    }, {
                        path: "performedDateTime",
                        label: "Performed At",
                        render: function render(rec) {
                            return _react2.default.createElement(_Date2.default, { moment: rec.performedDateTime });
                        }
                    }, {
                        path: "recorded",
                        label: "Recorded",
                        render: function render(rec) {
                            return _react2.default.createElement(_Date2.default, { moment: rec.recorded });
                        }
                    }, {
                        path: "performedPeriod",
                        label: "Performed",
                        render: function render(rec) {
                            return (0, _Period2.default)(rec.performedPeriod);
                        }
                    }, {
                        path: "availableTime",
                        label: "Available Time",
                        render: function render(rec) {
                            if (Array.isArray(rec.availableTime)) {
                                return rec.availableTime.map(function (t, i) {
                                    return _react2.default.createElement(
                                        "div",
                                        { key: i },
                                        t.availableStartTime && _react2.default.createElement(
                                            "span",
                                            null,
                                            _react2.default.createElement(
                                                "label",
                                                null,
                                                "from:\xA0"
                                            ),
                                            _react2.default.createElement(
                                                "span",
                                                null,
                                                t.availableStartTime,
                                                "\xA0"
                                            )
                                        ),
                                        t.availableEndTime && _react2.default.createElement(
                                            "span",
                                            null,
                                            _react2.default.createElement(
                                                "label",
                                                null,
                                                "to:\xA0"
                                            ),
                                            _react2.default.createElement(
                                                "span",
                                                null,
                                                t.availableEndTime
                                            )
                                        )
                                    );
                                });
                            }
                        }
                    }, {
                        path: "whenHandedOver",
                        label: "Handed Over",
                        render: function render(rec) {
                            return _react2.default.createElement(_Date2.default, { moment: rec.whenHandedOver });
                        }
                    }, {
                        path: "issued",
                        label: "Issued",
                        raw: function raw(rec) {
                            return (0, _moment2.default)(rec.issued).format("MM/DD/YYYY");
                        },
                        render: function render(rec) {
                            return _react2.default.createElement(_Date2.default, { moment: rec.issued });
                        }
                    }, {
                        path: "effectiveDateTime",
                        label: "Effective",
                        raw: function raw(rec) {
                            return (0, _moment2.default)(rec.effectiveDateTime).format("MM/DD/YYYY");
                        },
                        render: function render(rec) {
                            return _react2.default.createElement(_Date2.default, { moment: rec.effectiveDateTime });
                        }
                    }, {
                        path: "assertedDate",
                        label: "Asserted",
                        raw: function raw(rec) {
                            return rec.assertedDate;
                        },
                        render: function render(rec) {
                            return _react2.default.createElement(_Date2.default, { moment: rec.assertedDate });
                        }
                    }], [{
                        path: "meta.lastUpdated",
                        label: "Last Updated",
                        raw: function raw(rec) {
                            return rec.meta.lastUpdated;
                        },
                        render: function render(rec) {
                            return _react2.default.createElement(_Date2.default, { moment: rec.meta.lastUpdated });
                        }
                    }]);
                }
            });

            return out;
        }
    }, {
        key: "render",
        value: function render() {
            var recs = this.props.resources || [];
            var length = recs.length;
            return _react2.default.createElement(_Grid2.default, {
                rows: recs.map(function (o) {
                    return o.resource;
                }),
                title: length + " resource" + (length === 1 ? "" : "s") + " of type " + this.props.type,
                cols: this.determineSchema(recs[0].resource),
                comparator: function comparator(a, b) {
                    var dA = getSortValue(a);
                    var dB = getSortValue(b);
                    dA = dA ? +(0, _moment2.default)(dA) : 0;
                    dB = dB ? +(0, _moment2.default)(dB) : 0;
                    return dB - dA;
                }
            });
        }
    }]);

    return ResourceList;
}(_react2.default.Component);

ResourceList.propTypes = {
    type: _propTypes2.default.string,
    resources: _propTypes2.default.arrayOf(_propTypes2.default.object).isRequired,
    settings: _propTypes2.default.object.isRequired
};
exports.default = ResourceList;

/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__("../node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, __webpack_require__("../node_modules/react/react.js"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "ResourceList.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./components/Fhir/Time.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__("../node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = __webpack_require__("../node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = __webpack_require__("../node_modules/react-dom/lib/ReactMount.js"), React = __webpack_require__("../node_modules/react/react.js"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Time;

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("../node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _moment = __webpack_require__("../node_modules/moment/moment.js");

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function Time(_ref) {
    var moment = _ref.moment,
        _ref$format = _ref.format,
        format = _ref$format === undefined ? "HH:mm" : _ref$format,
        rest = _objectWithoutProperties(_ref, ["moment", "format"]);

    return _react2.default.createElement(
        "span",
        rest,
        (0, _moment2.default)(moment).format(format)
    );
}

Time.propTypes = {
    format: _propTypes2.default.string,
    moment: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.instanceOf(Date), _propTypes2.default.object // moment
    ]).isRequired
};

/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__("../node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, __webpack_require__("../node_modules/react/react.js"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "Time.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./components/Fhir/ValueRange.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__("../node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = __webpack_require__("../node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = __webpack_require__("../node_modules/react-dom/lib/ReactMount.js"), React = __webpack_require__("../node_modules/react/react.js"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = ValueRange;

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("../node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ValueRange(_ref) {
    var range = _ref.range;

    var low = range.low;
    var high = range.high;
    return _react2.default.createElement(
        "span",
        null,
        low !== undefined && _react2.default.createElement(
            "span",
            null,
            _react2.default.createElement(
                "span",
                { className: "text-muted" },
                "low: "
            ),
            _react2.default.createElement(
                "span",
                null,
                low
            )
        ),
        high !== undefined && _react2.default.createElement(
            "span",
            null,
            low !== undefined && _react2.default.createElement(
                "span",
                null,
                "\xA0"
            ),
            _react2.default.createElement(
                "span",
                { className: "text-muted" },
                "high: "
            ),
            _react2.default.createElement(
                "span",
                null,
                high
            )
        ),
        high === undefined && low === undefined && _react2.default.createElement(
            "small",
            { className: "text-muted" },
            "N/A"
        )
    );
}

ValueRange.propTypes = {
    range: _propTypes2.default.object.isRequired
};

/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__("../node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, __webpack_require__("../node_modules/react/react.js"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "ValueRange.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./components/Footer/Footer.less":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/Footer/Footer.less");
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__("../node_modules/style-loader/addStyles.js")(content, {"singleton":true});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/Footer/Footer.less", function() {
			var newContent = __webpack_require__("../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/Footer/Footer.less");
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./components/Footer/index.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__("../node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = __webpack_require__("../node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = __webpack_require__("../node_modules/react-dom/lib/ReactMount.js"), React = __webpack_require__("../node_modules/react/react.js"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("../node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _query = __webpack_require__("./redux/query.js");

var _lib = __webpack_require__("./lib/index.js");

var _DialogFooter = __webpack_require__("./components/DialogFooter/index.js");

var _DialogFooter2 = _interopRequireDefault(_DialogFooter);

__webpack_require__("./components/Footer/Footer.less");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Footer = function (_React$Component) {
    _inherits(Footer, _React$Component);

    function Footer() {
        _classCallCheck(this, Footer);

        return _possibleConstructorReturn(this, (Footer.__proto__ || Object.getPrototypeOf(Footer)).apply(this, arguments));
    }

    _createClass(Footer, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            var msg = this.props.query.error ? " Error! " : " Loading... ";
            var bundle = this.props.bundle;
            var hasPrev = bundle && (0, _lib.getBundleURL)(bundle, "previous");
            var hasNext = bundle && (0, _lib.getBundleURL)(bundle, "next");

            if (bundle && !this.props.query.error) {
                if (this.props.query.params._id) {
                    msg = "Showing the selected patients only";
                } else {
                    var len = bundle && bundle.entry ? bundle.entry.length : 0;
                    if (len) {
                        var startRec = +(this.props.query.offset || 0) + 1;
                        var endRec = startRec + len - 1;

                        msg = " patient " + startRec + " to " + endRec + " ";

                        if ("total" in bundle) {
                            msg += " of " + bundle.total + " ";
                        }
                    } else {
                        msg = " No Records! ";
                    }
                }
            }

            return _react2.default.createElement(
                "div",
                { className: "app-footer" },
                _react2.default.createElement(
                    "div",
                    { className: "container-fluid", style: { width: "100%" } },
                    _react2.default.createElement(
                        "div",
                        { className: "row" },
                        _react2.default.createElement(
                            "div",
                            { className: "col-xs-3 col-sm-4 text-right" },
                            _react2.default.createElement(
                                "a",
                                {
                                    href: "#prev",
                                    onClick: function onClick(e) {
                                        e.preventDefault();_this2.props.dispatch((0, _query.goPrev)());
                                    },
                                    disabled: !hasPrev
                                },
                                _react2.default.createElement("i", { className: "fa fa-arrow-left" }),
                                " Prev"
                            )
                        ),
                        _react2.default.createElement(
                            "div",
                            { className: "col-xs-6 col-sm-4 text-center" },
                            msg
                        ),
                        _react2.default.createElement(
                            "div",
                            { className: "col-xs-3 col-sm-4 text-left" },
                            _react2.default.createElement(
                                "a",
                                {
                                    href: "#next",
                                    onClick: function onClick(e) {
                                        e.preventDefault();_this2.props.dispatch((0, _query.goNext)());
                                    },
                                    disabled: !hasNext
                                },
                                "Next ",
                                _react2.default.createElement("i", { className: "fa fa-arrow-right" })
                            )
                        )
                    ),
                    _react2.default.createElement(_DialogFooter2.default, { canShowSelected: this.props.canShowSelected })
                )
            );
        }
    }]);

    return Footer;
}(_react2.default.Component);

Footer.propTypes = {
    bundle: _propTypes2.default.object,
    query: _propTypes2.default.object.isRequired,
    dispatch: _propTypes2.default.func.isRequired,
    selection: _propTypes2.default.object.isRequired,
    canShowSelected: _propTypes2.default.bool
};
exports.default = Footer;

/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__("../node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, __webpack_require__("../node_modules/react/react.js"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "index.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./components/Header/Header.less":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/Header/Header.less");
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__("../node_modules/style-loader/addStyles.js")(content, {"singleton":true});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/Header/Header.less", function() {
			var newContent = __webpack_require__("../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/Header/Header.less");
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./components/Header/index.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__("../node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = __webpack_require__("../node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = __webpack_require__("../node_modules/react-dom/lib/ReactMount.js"), React = __webpack_require__("../node_modules/react/react.js"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("../node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

__webpack_require__("./components/Header/Header.less");

var _query2 = __webpack_require__("./redux/query.js");

var _redux = __webpack_require__("./redux/index.js");

var _redux2 = _interopRequireDefault(_redux);

var _TagSelector = __webpack_require__("./components/TagSelector/index.js");

var _TagSelector2 = _interopRequireDefault(_TagSelector);

var _AgeSelector = __webpack_require__("./components/AgeSelector/index.js");

var _AgeSelector2 = _interopRequireDefault(_AgeSelector);

var _SortWidget = __webpack_require__("./components/SortWidget/index.js");

var _SortWidget2 = _interopRequireDefault(_SortWidget);

var _lib = __webpack_require__("./lib/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Header = function (_React$Component) {
    _inherits(Header, _React$Component);

    function Header() {
        _classCallCheck(this, Header);

        return _possibleConstructorReturn(this, (Header.__proto__ || Object.getPrototypeOf(Header)).apply(this, arguments));
    }

    _createClass(Header, [{
        key: "fetch",
        value: function fetch() {
            var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;

            if (this.props.settings.submitStrategy == "automatic") {
                if (this.fetchDelay) {
                    clearTimeout(this.fetchDelay);
                }
                this.fetchDelay = setTimeout(function () {
                    _redux2.default.dispatch((0, _query2.fetch)());
                }, delay);
            }
            // else {
            //     store.dispatch(fetch())
            // }
        }
    }, {
        key: "renderAdvancedTabContents",
        value: function renderAdvancedTabContents() {
            return _react2.default.createElement(
                "div",
                { className: "form-group" },
                _react2.default.createElement(
                    "p",
                    { className: "text-warning", style: { padding: "0 5px 5px", margin: 0 } },
                    _react2.default.createElement("i", { className: "fa fa-info-circle" }),
                    " In advanced mode, provide a query string to browse and select from a list of matching patients. ",
                    _react2.default.createElement(
                        "a",
                        { target: "_blank", href: "http://hl7.org/fhir/patient.html#search" },
                        "More Info..."
                    )
                ),
                _react2.default.createElement(
                    "form",
                    { onSubmit: function onSubmit(e) {
                            e.preventDefault();
                            _redux2.default.dispatch((0, _query2.fetch)());
                        } },
                    _react2.default.createElement(
                        "div",
                        { className: "input-group input-group-sm" },
                        _react2.default.createElement(
                            "span",
                            { className: "input-group-addon" },
                            "/Patient?"
                        ),
                        _react2.default.createElement("input", {
                            type: "text",
                            className: "form-control",
                            placeholder: "Patient Search Query String",
                            name: "query",
                            onChange: function onChange(e) {
                                return _redux2.default.dispatch((0, _query2.setQueryString)(e.target.value));
                            },
                            value: this.props.query.queryString
                        }),
                        _react2.default.createElement(
                            "span",
                            { className: "input-group-btn" },
                            _react2.default.createElement(
                                "button",
                                { className: "btn btn-warning", type: "submit" },
                                "Go"
                            )
                        )
                    )
                )
            );
        }
    }, {
        key: "renderDemographicsTabContents",
        value: function renderDemographicsTabContents() {
            var _this2 = this;

            return _react2.default.createElement(
                "form",
                { onSubmit: function onSubmit(e) {
                        e.preventDefault();
                        _redux2.default.dispatch((0, _query2.fetch)());
                    } },
                _react2.default.createElement(
                    "div",
                    { className: "row" },
                    _react2.default.createElement(
                        "div",
                        { className: "**custom**" === this.props.query.ageGroup ? "col-sm-6" : "col-sm-12" },
                        _react2.default.createElement(
                            "div",
                            { className: "form-group" },
                            _react2.default.createElement(
                                "div",
                                { className: "input-group" },
                                _react2.default.createElement(
                                    "span",
                                    { className: "input-group-addon" },
                                    _react2.default.createElement(
                                        "small",
                                        null,
                                        "Name:"
                                    )
                                ),
                                _react2.default.createElement("input", {
                                    type: "text",
                                    className: "form-control input-sm",
                                    placeholder: "Search by name...",
                                    value: this.props.query.params.name || "",
                                    onChange: function onChange(e) {
                                        _redux2.default.dispatch((0, _query2.setParam)({
                                            name: "name",
                                            value: e.target.value
                                        }));
                                        _this2.fetch();
                                    }
                                })
                            )
                        )
                    ),
                    _react2.default.createElement(
                        "div",
                        { className: "col-sm-6" },
                        _react2.default.createElement(
                            "div",
                            { className: "form-group" },
                            _react2.default.createElement(
                                "select",
                                {
                                    className: "form-control input-sm",
                                    onChange: function onChange(e) {
                                        _redux2.default.dispatch((0, _query2.setGender)(e.target.value));
                                        _this2.fetch();
                                    },
                                    value: this.props.query.gender || ""
                                },
                                _react2.default.createElement(
                                    "option",
                                    { value: "male" },
                                    "Males"
                                ),
                                _react2.default.createElement(
                                    "option",
                                    { value: "female" },
                                    "Females"
                                ),
                                _react2.default.createElement(
                                    "option",
                                    { value: "" },
                                    "Any Gender"
                                )
                            )
                        )
                    ),
                    _react2.default.createElement(
                        "div",
                        { className: "**custom**" === this.props.query.ageGroup ? "col-sm-12" : "col-sm-6" },
                        _react2.default.createElement(
                            "div",
                            { className: "form-group" },
                            _react2.default.createElement(_AgeSelector2.default, {
                                min: this.props.query.minAge || { value: 0, units: "years" },
                                max: this.props.query.maxAge || { value: 100, units: "years" },
                                onMinChange: function onMinChange(age) {
                                    _redux2.default.dispatch((0, _query2.setMinAge)(age));
                                    //if ("**custom**" != this.props.query.ageGroup) {
                                    _this2.fetch();
                                    //}
                                },
                                onMaxChange: function onMaxChange(age) {
                                    _redux2.default.dispatch((0, _query2.setMaxAge)(age));
                                    //if ("**custom**" != this.props.query.ageGroup) {
                                    _this2.fetch();
                                    //}
                                },
                                onGroupChange: function onGroupChange(group) {
                                    _redux2.default.dispatch((0, _query2.setAgeGroup)(group));
                                    //if ("**custom**" != this.props.query.ageGroup) {
                                    _this2.fetch();
                                    //}
                                }
                                //update={ () => this.fetch() }
                                , group: this.props.query.ageGroup
                            })
                        )
                    )
                )
            );
        }
    }, {
        key: "renderConditionsTabContents",
        value: function renderConditionsTabContents() {
            var _this3 = this;

            return _react2.default.createElement(
                "div",
                { className: "row" },
                _react2.default.createElement(
                    "div",
                    { className: "col-sm-12" },
                    _react2.default.createElement(
                        "div",
                        { className: "form-group" },
                        _react2.default.createElement(_TagSelector2.default, {
                            tags: Object.keys(this.props.settings.server.conditions).map(function (key) {
                                var condition = _this3.props.settings.server.conditions[key];
                                return {
                                    key: key,
                                    label: condition.description,
                                    data: condition
                                };
                            }),
                            onChange: function onChange(selection) {
                                var conditions = {};
                                selection.forEach(function (tag) {
                                    conditions[tag.key] = tag.data;
                                });
                                _redux2.default.dispatch((0, _query2.setConditions)(conditions));
                                _this3.fetch();
                            },
                            label: "condition code",
                            selected: Object.keys(this.props.query.conditions)
                        })
                    )
                )
            );
        }
    }, {
        key: "renderTagsTabContents",
        value: function renderTagsTabContents() {
            var _this4 = this;

            var selected = this.props.query.tags || this.props.settings.server.tags.filter(function (tag) {
                return !!tag.selected;
            }).map(function (tag) {
                return !!tag.key;
            });
            return _react2.default.createElement(
                "div",
                { className: "row" },
                _react2.default.createElement(
                    "div",
                    { className: "col-sm-12" },
                    _react2.default.createElement(
                        "div",
                        { className: "form-group" },
                        _react2.default.createElement(_TagSelector2.default, {
                            tags: this.props.settings.server.tags,
                            selected: selected,
                            onChange: function onChange(sel) {
                                var tags = Object.keys(sel).map(function (k) {
                                    return sel[k].key;
                                });
                                _redux2.default.dispatch((0, _query2.setTags)(tags));
                                _this4.fetch();
                            },
                            label: "tag"
                        })
                    )
                )
            );
        }
    }, {
        key: "render",
        value: function render() {
            var _query = (0, _lib.parseQueryString)(this.props.location.search);
            var _advanced = this.props.query.queryType == "advanced";
            var conditionsCount = Object.keys(this.props.query.conditions).length;
            var demographicsCount = 0;
            var tagsCount = Object.keys(this.props.query.tags).length;

            // Compute which the active tab should be
            var tabs = ["demographics", "conditions"];
            if (!this.props.settings.hideTagSelector) {
                tabs.push("tags");
            }
            var _tab = _query._tab || "";
            if (tabs.indexOf(_tab) == -1) {
                _tab = "demographics";
            }

            // Manually increment the value for the demographics badge depending on
            // the state of the app

            if (this.props.query.gender) {
                demographicsCount += 1;
            }

            if (this.props.query.params.name) {
                demographicsCount += 1;
            }

            if (this.props.query.maxAge !== null || this.props.query.minAge !== null) {
                demographicsCount += 1;
            }

            return _react2.default.createElement(
                "div",
                { className: "app-header" },
                _react2.default.createElement(
                    "div",
                    { style: { flexDirection: "row" } },
                    _react2.default.createElement(
                        "label",
                        { className: "pull-right advanced-label text-warning" },
                        "Advanced ",
                        _react2.default.createElement(
                            "span",
                            { className: "hidden-xs" },
                            "Mode "
                        ),
                        " ",
                        _react2.default.createElement("input", {
                            type: "checkbox",
                            checked: _advanced,
                            onChange: function onChange(e) {
                                _redux2.default.dispatch((0, _query2.setQueryType)(e.target.checked ? "advanced" : "basic"));
                            }
                        })
                    ),
                    _advanced ? _react2.default.createElement("ul", { className: "nav nav-tabs" }) : _react2.default.createElement(
                        "ul",
                        { className: "nav nav-tabs" },
                        _react2.default.createElement(
                            "li",
                            { className: !_advanced && _tab == "demographics" ? "active" : null },
                            _react2.default.createElement(
                                "a",
                                { href: "", onClick: function onClick(e) {
                                        e.preventDefault();(0, _lib.setHashParam)("_tab", "demographics");
                                    } },
                                _react2.default.createElement(
                                    "b",
                                    null,
                                    "Demographics"
                                ),
                                demographicsCount ? _react2.default.createElement(
                                    "span",
                                    { className: "hidden-xs" },
                                    " ",
                                    _react2.default.createElement(
                                        "small",
                                        { className: "badge" },
                                        demographicsCount
                                    )
                                ) : null
                            )
                        ),
                        _react2.default.createElement(
                            "li",
                            { className: !_advanced && _tab == "conditions" ? "active" : null },
                            _react2.default.createElement(
                                "a",
                                { href: "", onClick: function onClick(e) {
                                        e.preventDefault();(0, _lib.setHashParam)("_tab", "conditions");
                                    } },
                                _react2.default.createElement(
                                    "b",
                                    null,
                                    "Conditions"
                                ),
                                conditionsCount ? _react2.default.createElement(
                                    "span",
                                    { className: "hidden-xs" },
                                    " ",
                                    _react2.default.createElement(
                                        "small",
                                        { className: "badge" },
                                        conditionsCount
                                    )
                                ) : null
                            )
                        ),
                        this.props.settings.hideTagSelector || this.props.query.params._id ? null : _react2.default.createElement(
                            "li",
                            { className: !_advanced && _tab == "tags" ? "active" : null },
                            _react2.default.createElement(
                                "a",
                                { href: "", onClick: function onClick(e) {
                                        e.preventDefault();(0, _lib.setHashParam)("_tab", "tags");
                                    } },
                                _react2.default.createElement(
                                    "b",
                                    null,
                                    "Tags"
                                ),
                                tagsCount ? _react2.default.createElement(
                                    "span",
                                    { className: "hidden-xs" },
                                    " ",
                                    _react2.default.createElement(
                                        "small",
                                        { className: "badge" },
                                        tagsCount
                                    )
                                ) : null
                            )
                        )
                    )
                ),
                _react2.default.createElement(
                    "div",
                    { className: "tab-content" },
                    _react2.default.createElement(
                        "div",
                        { className: "tab-pane " + (_advanced ? "active" : "") },
                        this.renderAdvancedTabContents()
                    ),
                    _react2.default.createElement(
                        "div",
                        { className: "tab-pane " + (!_advanced && _tab == "demographics" ? "active" : "") },
                        this.renderDemographicsTabContents()
                    ),
                    _react2.default.createElement(
                        "div",
                        { className: "tab-pane " + (!_advanced && _tab == "conditions" ? "active" : "") },
                        this.renderConditionsTabContents()
                    ),
                    this.props.settings.hideTagSelector || this.props.query.params._id ? null : _react2.default.createElement(
                        "div",
                        { className: "tab-pane " + (!_advanced && _tab == "tags" ? "active" : "") },
                        this.renderTagsTabContents()
                    ),
                    !_advanced && this.props.settings.submitStrategy == "manual" ? _react2.default.createElement(
                        "div",
                        { className: "text-right", style: { height: 0 } },
                        _react2.default.createElement(
                            "button",
                            {
                                type: "button",
                                onClick: function onClick() {
                                    return _redux2.default.dispatch((0, _query2.fetch)());
                                },
                                className: "btn btn-primary btn-submit"
                            },
                            _react2.default.createElement("i", { className: "fa fa-search" }),
                            " Search"
                        )
                    ) : null
                ),
                _advanced ? null : _react2.default.createElement(_SortWidget2.default, {
                    sort: this.props.query.sort,
                    onChange: function onChange(sort) {
                        _redux2.default.dispatch((0, _query2.setSort)(sort));
                        _redux2.default.dispatch((0, _query2.fetch)());
                    }
                })
            );
        }
    }]);

    return Header;
}(_react2.default.Component);

Header.propTypes = {
    settings: _propTypes2.default.object.isRequired,
    query: _propTypes2.default.object.isRequired,
    location: _propTypes2.default.object.isRequired,
    urlParams: _propTypes2.default.object.isRequired
};
exports.default = Header;

/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__("../node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, __webpack_require__("../node_modules/react/react.js"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "index.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./components/Loader/Loader.less":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/Loader/Loader.less");
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__("../node_modules/style-loader/addStyles.js")(content, {"singleton":true});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/Loader/Loader.less", function() {
			var newContent = __webpack_require__("../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/Loader/Loader.less");
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./components/Loader/index.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__("../node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = __webpack_require__("../node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = __webpack_require__("../node_modules/react-dom/lib/ReactMount.js"), React = __webpack_require__("../node_modules/react/react.js"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

__webpack_require__("./components/Loader/Loader.less");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Loader = function (_React$Component) {
    _inherits(Loader, _React$Component);

    function Loader() {
        _classCallCheck(this, Loader);

        return _possibleConstructorReturn(this, (Loader.__proto__ || Object.getPrototypeOf(Loader)).apply(this, arguments));
    }

    _createClass(Loader, [{
        key: "render",
        value: function render() {
            return _react2.default.createElement(
                "div",
                { className: "loader" },
                _react2.default.createElement(
                    "div",
                    null,
                    _react2.default.createElement("i", { className: "fa fa-spinner spin" }),
                    " Loading..."
                )
            );
        }
    }]);

    return Loader;
}(_react2.default.Component);

exports.default = Loader;

/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__("../node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, __webpack_require__("../node_modules/react/react.js"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "index.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./components/PatientDetail/PatientDetail.less":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/PatientDetail/PatientDetail.less");
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__("../node_modules/style-loader/addStyles.js")(content, {"singleton":true});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/PatientDetail/PatientDetail.less", function() {
			var newContent = __webpack_require__("../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/PatientDetail/PatientDetail.less");
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./components/PatientDetail/index.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__("../node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = __webpack_require__("../node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = __webpack_require__("../node_modules/react-dom/lib/ReactMount.js"), React = __webpack_require__("../node_modules/react/react.js"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PatientDetail = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("../node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _PatientImage = __webpack_require__("./components/PatientImage/index.js");

var _PatientImage2 = _interopRequireDefault(_PatientImage);

var _Loader = __webpack_require__("./components/Loader/index.js");

var _Loader2 = _interopRequireDefault(_Loader);

var _reactRedux = __webpack_require__("../node_modules/react-redux/es/index.js");

var _jquery = __webpack_require__("../node_modules/jquery/dist/jquery.js");

var _jquery2 = _interopRequireDefault(_jquery);

var _reactRouterDom = __webpack_require__("../node_modules/react-router-dom/es/index.js");

var _DialogFooter = __webpack_require__("./components/DialogFooter/index.js");

var _DialogFooter2 = _interopRequireDefault(_DialogFooter);

var _selection = __webpack_require__("./redux/selection.js");

var _redux = __webpack_require__("./redux/index.js");

var _redux2 = _interopRequireDefault(_redux);

var _query = __webpack_require__("./redux/query.js");

var _Observation = __webpack_require__("./components/Fhir/Observation.js");

var _Observation2 = _interopRequireDefault(_Observation);

var _ImmunizationList = __webpack_require__("./components/Fhir/ImmunizationList.js");

var _ImmunizationList2 = _interopRequireDefault(_ImmunizationList);

var _ConditionList = __webpack_require__("./components/Fhir/ConditionList.js");

var _ConditionList2 = _interopRequireDefault(_ConditionList);

var _Encounter = __webpack_require__("./components/Fhir/Encounter.js");

var _Encounter2 = _interopRequireDefault(_Encounter);

var _CarePlan = __webpack_require__("./components/Fhir/CarePlan.js");

var _CarePlan2 = _interopRequireDefault(_CarePlan);

var _Person = __webpack_require__("./components/Fhir/Person.js");

var _Person2 = _interopRequireDefault(_Person);

var _ResourceList = __webpack_require__("./components/Fhir/ResourceList.js");

var _ResourceList2 = _interopRequireDefault(_ResourceList);

var _lib = __webpack_require__("./lib/index.js");

__webpack_require__("./components/PatientDetail/PatientDetail.less");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Renders the detail page.
 */
var PatientDetail = exports.PatientDetail = function (_React$Component) {
    _inherits(PatientDetail, _React$Component);

    function PatientDetail() {
        var _ref;

        _classCallCheck(this, PatientDetail);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = PatientDetail.__proto__ || Object.getPrototypeOf(PatientDetail)).call.apply(_ref, [this].concat(args)));

        _this.query = _query.queryBuilder.clone();
        _this.state = {
            loading: false,
            error: null,
            conditions: [],
            patient: {},
            index: 0,
            hasNext: false,
            groups: {},
            selectedSubCat: "",
            bundle: _jquery2.default.isEmptyObject(_this.props.query.bundle) ? null : _extends({}, _this.props.query.bundle)
        };
        return _this;
    }

    _createClass(PatientDetail, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            this.fetch(this.props.match.params.index);
        }
    }, {
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(newProps) {
            if (newProps.match.params.index !== this.props.match.params.index) {
                this.fetch(newProps.match.params.index);
            }
        }
    }, {
        key: "fetch",
        value: function fetch(index) {
            var _this2 = this;

            index = (0, _lib.intVal)(index, -1);
            if (index < 0) {
                return this.setState({ error: new Error("Invalid patient index") });
            }

            this.setState({ loading: true, index: index }, function () {
                _this2.fetchPatient(_this2.props.settings.server, index).then(function (state) {
                    // console.log(state);
                    _this2.setState(_extends({}, state, {
                        error: null,
                        loading: false
                    }));
                }).catch(function (error) {
                    _this2.setState({
                        loading: false,
                        error: error
                    });
                });
            });
        }

        /**
         * This page receives an "index" url parameter. It will repeat the same
         * query from the search page but with limit=1 and offset=index so that the
         * search returns only one page. The reason for this is that we also have
         * these "Prev Patient" and "Next Patient" buttons that allow the user to
         * walk through the result one patient at a time.
         * @param {Object} server.url & server.type ...
         * @param {Number} index
         */

    }, {
        key: "fetchPatient",
        value: function fetchPatient(server, index) {
            var _this3 = this;

            // =====================================================================
            // Warning! The following are some ugly workarounds for the ugly API
            // that does not support normal pagination!
            // =====================================================================

            return Promise.resolve(_extends({}, this.state))

            // Run the main query to fetch the first page
            .then(function (state) {
                _this3.query.cacheId = null;
                _this3.query.offset = null;
                return _this3.query.fetch(server).then(function (bundle) {
                    state.bundle = bundle;
                    return state;
                });
            })

            // Try to find the patient by index
            .then(function (state) {
                index = (0, _lib.intVal)(index, -1);
                if (index < 0) {
                    return Promise.reject("Invalid patient index");
                }

                state.patient = (0, _lib.getPath)(state, "bundle.entry." + index + ".resource");
                state.nextURL = (0, _lib.getBundleURL)(state.bundle, "next");
                state.hasNext = !!state.nextURL || (state.patient ? index < state.bundle.entry.length - 1 : false);
                return state;
            })

            // if no patient - jump to it's index
            .then(function (state) {
                if (!state.patient) {
                    var params = (0, _lib.parseQueryString)(state.nextURL);
                    _this3.query.setOffset(params._getpages, index);
                    return _this3.query.fetch(server).then(function (bundle) {
                        state.bundle = bundle;
                        state.patient = (0, _lib.getPath)(state, "bundle.entry.0.resource");
                        state.hasNext = state.patient ? _this3.query.limit && _this3.query.limit > 1 ? state.bundle.entry.length > 1 : (0, _lib.getBundleURL)(state.bundle, "next") : false;
                        return state;
                    });
                }
                return state;
            }).then(function (state) {
                return new Promise(function (resolve) {
                    _this3.setState(state, function () {
                        return resolve(state);
                    });
                });
            })

            // Find $everything
            .then(function (state) {
                return (0, _lib.getAllPages)({ url: server.url + "/Patient/" + state.patient.id + "/$everything" }).then(function (data) {
                    var groups = {};
                    data.forEach(function (entry) {
                        var resourceType = (0, _lib.getPath)(entry, "resource.resourceType") || "Other";
                        var type = resourceType;

                        if (type == "Observation") {
                            var subCat = String((0, _lib.getPath)(entry, "resource.category.0.text") || (0, _lib.getPath)(entry, "resource.category.coding.0.code") || (0, _lib.getPath)(entry, "resource.category.0.coding.0.code") || "Other").toLowerCase();

                            subCat = subCat.split(/\-+/).map(function (token) {
                                return token.charAt(0).toUpperCase() + token.substr(1);
                            }).join(" ");
                            type += " - " + subCat;
                        }

                        if (!Array.isArray(groups[type])) {
                            groups[type] = [];
                        }
                        groups[type].push(entry);
                    });
                    state.groups = groups;
                    return state;
                });
            })

            // Feed the results to the app
            .then(function (state) {
                return Promise.resolve(state);
            }, function (error) {
                return Promise.reject(new Error((0, _lib.getErrorMessage)(error)));
            });
        }

        // Rendering methods -------------------------------------------------------

    }, {
        key: "renderPatient",
        value: function renderPatient() {
            var _this4 = this;

            if (this.state.error) {
                return this.state.error + "";
            }

            var selected = this.state.patient.id && this.props.selection[this.state.patient.id.toLowerCase()];
            return _react2.default.createElement(
                "div",
                { className: "panel panel-default patient col-xs-12" },
                _react2.default.createElement(
                    "div",
                    { className: "row" },
                    this.state.loading ? _react2.default.createElement(_Loader2.default, null) : null,
                    _react2.default.createElement(
                        "div",
                        { className: "col-xs-2 col-sm-2 col-md-1" },
                        _react2.default.createElement(
                            "div",
                            { className: "embed-responsive" },
                            _react2.default.createElement(_PatientImage2.default, {
                                patient: this.state.patient,
                                className: "embed-responsive-item",
                                base: this.props.settings.server.url
                            })
                        )
                    ),
                    _react2.default.createElement(
                        "div",
                        { className: "col-xs-10 col-md-11" },
                        _react2.default.createElement(
                            "div",
                            { className: "patient-row" },
                            _react2.default.createElement(
                                "div",
                                { className: "col-xs-7 patient-name" },
                                _react2.default.createElement(
                                    "h3",
                                    { className: "pull-left text-primary" },
                                    (0, _lib.getPatientName)(this.state.patient) || (this.state.loading ? "loading..." : "Unknown")
                                ),
                                selected ? _react2.default.createElement(
                                    "i",
                                    { className: "label label-success pull-left" },
                                    "Selected"
                                ) : null
                            ),
                            _react2.default.createElement(
                                "div",
                                { className: "col-xs-5 text-right", style: { paddingRight: 0 } },
                                _react2.default.createElement(
                                    "button",
                                    {
                                        type: "button",
                                        className: "btn btn-sm btn-" + (selected ? "danger" : "primary"),
                                        onClick: function onClick() {
                                            return _redux2.default.dispatch((0, _selection.toggle)({ id: _this4.state.patient.id }));
                                        }
                                    },
                                    selected ? "Unselect" : "Select"
                                ),
                                _react2.default.createElement(
                                    "button",
                                    {
                                        type: "button",
                                        className: "btn btn-default btn-sm",
                                        onClick: function onClick() {
                                            return _this4.fetch(_this4.props.match.params.index);
                                        }
                                    },
                                    _react2.default.createElement("i", { className: "fa fa-refresh" }),
                                    " Reload"
                                )
                            )
                        ),
                        _react2.default.createElement(
                            "div",
                            { className: "row" },
                            _react2.default.createElement(
                                "div",
                                { className: "col-xs-4 col-sm-2 col-lg-1 text-right text-muted" },
                                "Gender:"
                            ),
                            _react2.default.createElement(
                                "div",
                                { className: "col-xs-8 col-sm-3 col-lg-3 text-left" },
                                this.state.patient.gender || (this.state.loading ? "loading..." : "Unknown")
                            ),
                            _react2.default.createElement(
                                "div",
                                { className: "col-xs-4 col-sm-2 col-lg-1 text-right text-muted" },
                                "DOB:"
                            ),
                            _react2.default.createElement(
                                "div",
                                { className: "col-xs-8 col-sm-5 col-lg-3 text-left" },
                                this.state.patient.birthDate || (this.state.loading ? "loading..." : "Unknown")
                            ),
                            _react2.default.createElement(
                                "div",
                                { className: "col-xs-4 col-sm-2 col-lg-1 text-right text-muted" },
                                "Age:"
                            ),
                            _react2.default.createElement(
                                "div",
                                { className: "col-xs-8 col-sm-3 col-lg-3 text-left" },
                                (0, _lib.getPatientAge)(this.state.patient) || (this.state.loading ? "loading..." : "Unknown")
                            ),
                            _react2.default.createElement(
                                "div",
                                { className: "col-xs-4 col-sm-2 col-lg-1 text-right text-muted" },
                                "Email"
                            ),
                            _react2.default.createElement(
                                "div",
                                { className: "col-xs-8 col-sm-5 col-lg-3 text-left" },
                                (0, _lib.getPatientEmail)(this.state.patient) || (this.state.loading ? "loading..." : "Unknown")
                            ),
                            _react2.default.createElement(
                                "div",
                                { className: "col-xs-4 col-sm-2 col-lg-1 text-right text-muted" },
                                "Phone:"
                            ),
                            _react2.default.createElement(
                                "div",
                                { className: "col-xs-8 col-sm-3 col-lg-3 text-left" },
                                (0, _lib.getPatientPhone)(this.state.patient) || (this.state.loading ? "loading..." : "Unknown")
                            ),
                            _react2.default.createElement(
                                "div",
                                { className: "col-xs-4 col-sm-2 col-lg-1 text-right text-muted" },
                                "Address:"
                            ),
                            _react2.default.createElement(
                                "div",
                                { className: "col-xs-8 col-sm-5 col-lg-3 text-left" },
                                (0, _lib.getPatientHomeAddress)(this.state.patient) || (this.state.loading ? "loading..." : "Unknown")
                            ),
                            _react2.default.createElement(
                                "div",
                                { className: "col-xs-4 col-sm-2 col-lg-1 text-right text-muted" },
                                "ID:"
                            ),
                            _react2.default.createElement(
                                "div",
                                { className: "col-xs-8 col-sm-3 col-lg-3 text-left" },
                                this.state.patient.id || (this.state.loading ? "loading..." : "Unknown")
                            ),
                            _react2.default.createElement(
                                "div",
                                { className: "col-xs-4 col-sm-2 col-lg-1 text-right text-muted" },
                                "MRN:"
                            ),
                            _react2.default.createElement(
                                "div",
                                { className: "col-xs-8 col-sm-5 col-lg-3 text-left" },
                                (0, _lib.getPatientMRN)(this.state.patient) || (this.state.loading ? "loading..." : "Unknown")
                            ),
                            this.state.patient.deceasedBoolean || this.state.patient.deceasedDateTime ? _react2.default.createElement(
                                "div",
                                { className: "col-xs-4 col-sm-2 col-lg-1 text-right text-muted" },
                                _react2.default.createElement(
                                    "span",
                                    { className: "deceased-label" },
                                    "Deceased:"
                                )
                            ) : null,
                            this.state.patient.deceasedBoolean || this.state.patient.deceasedDateTime ? _react2.default.createElement(
                                "div",
                                { className: "col-xs-8 col-sm-5 col-lg-3 text-left" },
                                this.state.patient.deceasedDateTime ? _react2.default.createElement(
                                    "span",
                                    null,
                                    this.state.patient.deceasedDateTime
                                ) : _react2.default.createElement(
                                    "span",
                                    null,
                                    this.state.patient.deceasedBoolean ? "Yes" : "No"
                                )
                            ) : null
                        )
                    )
                )
            );
        }
    }, {
        key: "renderResources",
        value: function renderResources(type) {
            var items = this.state.groups[type] || [];
            if (!items.length) {
                return _react2.default.createElement(
                    "p",
                    { className: "text-center text-muted" },
                    "No items of type \"",
                    type,
                    "\" found"
                );
            }

            if (type.indexOf("Observation") === 0) {
                return _react2.default.createElement(_Observation2.default, { resources: items });
            }

            switch (type) {
                case "Immunization":
                    return _react2.default.createElement(_ImmunizationList2.default, { resources: items });
                case "Condition":
                    return _react2.default.createElement(_ConditionList2.default, { resources: items });
                case "Encounter":
                    return _react2.default.createElement(_Encounter2.default, { resources: items });
                case "CarePlan":
                    return _react2.default.createElement(_CarePlan2.default, { resources: items });
                case "Patient":
                case "Practitioner":
                case "RelatedPerson":
                    return _react2.default.createElement(_Person2.default, { resources: items, title: type });
                default:
                    return _react2.default.createElement(_ResourceList2.default, { resources: items, type: type, settings: this.props.settings });
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _this5 = this;

            var groups = Object.keys(this.state.groups).sort();
            var selectedSubCat = this.state.selectedSubCat;
            if (!selectedSubCat || !this.state.groups[selectedSubCat]) {
                selectedSubCat = Object.keys(this.state.groups)[0] || "";
            }

            return _react2.default.createElement(
                "div",
                { className: "page patient-detail-page" },
                _react2.default.createElement(
                    "nav",
                    { className: "navbar bg-primary navbar-fixed-top" },
                    _react2.default.createElement(
                        "div",
                        { className: "container-fluid" },
                        _react2.default.createElement(
                            "div",
                            { className: "row navigator" },
                            _react2.default.createElement(
                                "div",
                                { className: "col-xs-4 col-sm-4 col-md-3 col-lg-2" },
                                _react2.default.createElement(
                                    _reactRouterDom.Link,
                                    {
                                        to: "/patient/" + (this.state.index - 1),
                                        className: "btn btn-primary btn-block",
                                        disabled: this.state.index < 1
                                    },
                                    _react2.default.createElement("i", { className: "fa fa-chevron-left" }),
                                    _react2.default.createElement(
                                        "b",
                                        null,
                                        "Prev",
                                        _react2.default.createElement(
                                            "span",
                                            { className: "hidden-xs" },
                                            "ious Patient"
                                        )
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                "div",
                                { className: "col-xs-4 col-sm-4 col-md-6 col-lg-8 text-center" },
                                _react2.default.createElement(
                                    _reactRouterDom.Link,
                                    { className: "btn btn-block text-center", to: "/" },
                                    _react2.default.createElement(
                                        "span",
                                        { className: "hidden-xs" },
                                        "Browse Patients"
                                    ),
                                    _react2.default.createElement(
                                        "span",
                                        { className: "visible-xs" },
                                        "Browse"
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                "div",
                                { className: "col-xs-4 col-sm-4 col-md-3 col-lg-2 text-right" },
                                _react2.default.createElement(
                                    _reactRouterDom.Link,
                                    {
                                        to: "/patient/" + (this.state.index + 1),
                                        className: "btn btn-primary btn-block",
                                        disabled: !this.state.hasNext
                                    },
                                    _react2.default.createElement(
                                        "b",
                                        null,
                                        "Next",
                                        _react2.default.createElement(
                                            "span",
                                            { className: "hidden-xs" },
                                            " Patient"
                                        )
                                    ),
                                    _react2.default.createElement("i", { className: "fa fa-chevron-right" })
                                )
                            )
                        )
                    )
                ),
                _react2.default.createElement(
                    "div",
                    { className: "container" },
                    this.renderPatient(),
                    groups.length ? _react2.default.createElement(
                        "div",
                        { className: "row patient-details" },
                        _react2.default.createElement("br", null),
                        _react2.default.createElement(
                            "div",
                            { className: "col-xs-12 col-sm-3" },
                            _react2.default.createElement(
                                "ul",
                                { className: "list-group" },
                                groups.map(function (k, i) {
                                    return _react2.default.createElement(
                                        "a",
                                        {
                                            href: "#",
                                            key: i,
                                            className: "list-group-item" + (k === selectedSubCat ? " active" : ""),
                                            onClick: function onClick(e) {
                                                e.preventDefault();
                                                _this5.setState({
                                                    selectedSubCat: k
                                                });
                                            }
                                        },
                                        _react2.default.createElement(
                                            "b",
                                            { className: "badge pull-right" },
                                            _this5.state.groups[k].length
                                        ),
                                        _react2.default.createElement(
                                            "b",
                                            null,
                                            k
                                        )
                                    );
                                })
                            )
                        ),
                        _react2.default.createElement(
                            "div",
                            { className: "col-xs-12 col-sm-9" },
                            this.renderResources(selectedSubCat)
                        )
                    ) : this.state.loading ? null : _react2.default.createElement(
                        "div",
                        { className: "row" },
                        _react2.default.createElement(
                            "div",
                            { className: "col-xs-12 text-muted text-center" },
                            "No additional details for this patient"
                        )
                    )
                ),
                window.opener || window.parent && window.parent !== window ? _react2.default.createElement(
                    "nav",
                    { className: "navbar navbar-default navbar-fixed-bottom" },
                    _react2.default.createElement(
                        "div",
                        { className: "container-fluid", style: { width: "100%" } },
                        _react2.default.createElement(
                            "div",
                            { className: "row" },
                            _react2.default.createElement(
                                "div",
                                { className: "col-xs-12", style: { paddingTop: 8 } },
                                _react2.default.createElement(_DialogFooter2.default, null)
                            )
                        )
                    )
                ) : null
            );
        }
    }]);

    return PatientDetail;
}(_react2.default.Component);

PatientDetail.propTypes = {
    match: _propTypes2.default.object,
    settings: _propTypes2.default.object,
    selection: _propTypes2.default.object,
    query: _propTypes2.default.object
};
exports.default = (0, _reactRedux.connect)(function (state) {
    return state;
})(PatientDetail);

/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__("../node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, __webpack_require__("../node_modules/react/react.js"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "index.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./components/PatientImage/PatientImage.less":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/PatientImage/PatientImage.less");
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__("../node_modules/style-loader/addStyles.js")(content, {"singleton":true});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/PatientImage/PatientImage.less", function() {
			var newContent = __webpack_require__("../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/PatientImage/PatientImage.less");
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./components/PatientImage/index.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__("../node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = __webpack_require__("../node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = __webpack_require__("../node_modules/react-dom/lib/ReactMount.js"), React = __webpack_require__("../node_modules/react/react.js"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("../node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lib = __webpack_require__("./lib/index.js");

__webpack_require__("./components/PatientImage/PatientImage.less");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global jdenticon */


function hash(input) {
    var out = String(input).toLowerCase().trim().split("").reduce(function (sum, c) {
        return sum + c.charCodeAt(0).toString(16);
    }, "");
    while (out.length < 11) {
        out += out.length ? out : "000000000000";
    }
    return out;
}

var PatientImage = function (_React$Component) {
    _inherits(PatientImage, _React$Component);

    function PatientImage() {
        _classCallCheck(this, PatientImage);

        return _possibleConstructorReturn(this, (PatientImage.__proto__ || Object.getPrototypeOf(PatientImage)).apply(this, arguments));
    }

    _createClass(PatientImage, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            this.renderCanvas();
        }
    }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate() {
            this.renderCanvas();
        }
    }, {
        key: "renderCanvas",
        value: function renderCanvas() {
            var url = (0, _lib.getPatientImageUri)(this.props.patient, this.props.base);
            if (!url) {
                var hex = hash((0, _lib.getPatientName)(this.props.patient));
                jdenticon.update("#img-" + this.props.patient.id, hex, 0.1);
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _props = this.props,
                className = _props.className,
                style = _props.style,
                patient = _props.patient,
                base = _props.base,
                rest = _objectWithoutProperties(_props, ["className", "style", "patient", "base"]);

            var url = (0, _lib.getPatientImageUri)(patient, this.props.base);
            className = "patient-image-wrap " + (className || "");

            style = _extends({}, style || {});

            if (url) {
                style.backgroundImage = "url('" + url + "')";
                style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
            }

            return _react2.default.createElement(
                "div",
                _extends({ className: className, style: style }, rest),
                url ? null : _react2.default.createElement("canvas", {
                    width: "480",
                    height: "480",
                    style: { width: "100%", height: "100%" },
                    id: "img-" + patient.id
                })
            );
        }
    }]);

    return PatientImage;
}(_react2.default.Component);

PatientImage.propTypes = {
    patient: _propTypes2.default.object.isRequired,
    className: _propTypes2.default.string,
    style: _propTypes2.default.object,
    base: _propTypes2.default.string
};
PatientImage.defaultProps = {
    base: ""
};
exports.default = PatientImage;

/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__("../node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, __webpack_require__("../node_modules/react/react.js"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "index.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./components/PatientList/PatientList.less":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/PatientList/PatientList.less");
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__("../node_modules/style-loader/addStyles.js")(content, {"singleton":true});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/PatientList/PatientList.less", function() {
			var newContent = __webpack_require__("../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/PatientList/PatientList.less");
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./components/PatientList/index.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__("../node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = __webpack_require__("../node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = __webpack_require__("../node_modules/react-dom/lib/ReactMount.js"), React = __webpack_require__("../node_modules/react/react.js"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PatientList = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("../node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _PatientListItem = __webpack_require__("./components/PatientListItem/index.js");

var _PatientListItem2 = _interopRequireDefault(_PatientListItem);

var _selection = __webpack_require__("./redux/selection.js");

var _settings = __webpack_require__("./redux/settings.js");

var _query = __webpack_require__("./redux/query.js");

var _redux = __webpack_require__("./redux/index.js");

var _redux2 = _interopRequireDefault(_redux);

var _reactRedux = __webpack_require__("../node_modules/react-redux/es/index.js");

var _Footer = __webpack_require__("./components/Footer/index.js");

var _Footer2 = _interopRequireDefault(_Footer);

var _Header = __webpack_require__("./components/Header/index.js");

var _Header2 = _interopRequireDefault(_Header);

var _ErrorMessage = __webpack_require__("./components/ErrorMessage/index.js");

var _ErrorMessage2 = _interopRequireDefault(_ErrorMessage);

var _Alert = __webpack_require__("./components/Alert/index.js");

var _Alert2 = _interopRequireDefault(_Alert);

__webpack_require__("./components/PatientList/PatientList.less");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PatientList = exports.PatientList = function (_React$Component) {
    _inherits(PatientList, _React$Component);

    function PatientList() {
        _classCallCheck(this, PatientList);

        return _possibleConstructorReturn(this, (PatientList.__proto__ || Object.getPrototypeOf(PatientList)).apply(this, arguments));
    }

    _createClass(PatientList, [{
        key: "render",
        value: function render() {
            return _react2.default.createElement(
                "div",
                { className: "page" },
                _react2.default.createElement(_Header2.default, {
                    query: this.props.query,
                    settings: this.props.settings,
                    location: this.props.location,
                    urlParams: this.props.urlParams
                }),
                _react2.default.createElement(
                    "div",
                    { className: "patient-search-results" },
                    this.renderContents()
                ),
                _react2.default.createElement(_Footer2.default, {
                    query: this.props.query,
                    bundle: this.props.query.bundle,
                    dispatch: this.props.dispatch,
                    selection: this.props.selection,
                    canShowSelected: true
                })
            );
        }
    }, {
        key: "renderContents",
        value: function renderContents() {
            if (this.props.query.error) {
                return _react2.default.createElement(_ErrorMessage2.default, { error: this.props.query.error });
            }

            if (!this.props.query.bundle || this.props.query.loading) {
                return _react2.default.createElement(
                    "div",
                    { className: "patient-search-loading" },
                    _react2.default.createElement("i", { className: "fa fa-spinner spin" }),
                    " Loading. Please wait..."
                );
            }

            if (!this.props.query.bundle.entry || !this.props.query.bundle.entry.length) {
                return _react2.default.createElement(
                    _Alert2.default,
                    null,
                    "No patients found to match this search criteria"
                );
            }

            return this.renderPatientItems();
        }
    }, {
        key: "renderPatientItems",
        value: function renderPatientItems() {
            var _this2 = this;

            var offset = this.props.query.offset || 0;
            var items = this.props.query.bundle.entry || [];
            if (this.props.settings.renderSelectedOnly) {
                items = items.filter(function (o) {
                    return !!_this2.props.selection[o.resource.id.toLowerCase()];
                });
            }
            return items.map(function (o, i) {
                return _react2.default.createElement(_PatientListItem2.default, _extends({}, o.resource, {
                    patient: o.resource,
                    key: o.resource.id,
                    index: offset + i,
                    selected: !!_this2.props.selection[o.resource.id.toLowerCase()],
                    onSelectionChange: function onSelectionChange(patient) {
                        if (_this2.props.settings.renderSelectedOnly && Object.keys(_this2.props.selection).filter(function (k) {
                            return !!_this2.props.selection[k];
                        }).length === 1) {
                            _redux2.default.dispatch((0, _selection.setAll)({}));
                            _redux2.default.dispatch((0, _settings.showSelectedOnly)(false));
                            _redux2.default.dispatch((0, _query.setParam)({ name: "_id", value: undefined }));
                            _redux2.default.dispatch((0, _query.fetch)());
                        } else {
                            _redux2.default.dispatch((0, _selection.toggle)(patient));
                        }
                    },
                    query: _this2.props.query,
                    settings: _this2.props.settings
                }));
            });
        }
    }]);

    return PatientList;
}(_react2.default.Component);

PatientList.propTypes = {
    query: _propTypes2.default.object,
    selection: _propTypes2.default.object,
    location: _propTypes2.default.object,
    settings: _propTypes2.default.object,
    urlParams: _propTypes2.default.object,
    dispatch: _propTypes2.default.func
};
exports.default = (0, _reactRedux.connect)(function (state) {
    return state;
})(PatientList);

/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__("../node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, __webpack_require__("../node_modules/react/react.js"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "index.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./components/PatientListItem/index.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__("../node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = __webpack_require__("../node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = __webpack_require__("../node_modules/react-dom/lib/ReactMount.js"), React = __webpack_require__("../node_modules/react/react.js"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("../node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRouterDom = __webpack_require__("../node_modules/react-router-dom/es/index.js");

var _PatientImage = __webpack_require__("./components/PatientImage/index.js");

var _PatientImage2 = _interopRequireDefault(_PatientImage);

var _moment = __webpack_require__("../node_modules/moment/moment.js");

var _moment2 = _interopRequireDefault(_moment);

var _lib = __webpack_require__("./lib/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PatientListItem = function (_React$Component) {
    _inherits(PatientListItem, _React$Component);

    function PatientListItem() {
        _classCallCheck(this, PatientListItem);

        return _possibleConstructorReturn(this, (PatientListItem.__proto__ || Object.getPrototypeOf(PatientListItem)).apply(this, arguments));
    }

    _createClass(PatientListItem, [{
        key: "render",

        /**
         * This component expects a Fhir Bundle
         */
        value: function render() {
            var _this2 = this;

            var age = (0, _lib.getPatientAge)(this.props.patient);
            var name = (0, _lib.getPatientName)(this.props);
            if (this.props.query.params.name) {
                name = (0, _lib.renderSearchHighlight)(name, this.props.query.params.name);
            }

            return _react2.default.createElement(
                _reactRouterDom.Link,
                {
                    to: "/patient/" + this.props.index,
                    className: "patient" + (this.props.selected ? " selected" : "")
                },
                _react2.default.createElement(
                    "div",
                    {
                        className: "patient-select-zone",
                        onClick: function onClick(e) {
                            e.stopPropagation();
                            e.preventDefault();
                            _this2.props.onSelectionChange(_this2.props.patient);
                        }
                    },
                    _react2.default.createElement("i", { className: this.props.selected ? "fa fa-check-square-o" : "fa fa-square-o" })
                ),
                _react2.default.createElement(_PatientImage2.default, { patient: this.props.patient, base: this.props.settings.server.url }),
                _react2.default.createElement(
                    "div",
                    { className: "patient-info" },
                    _react2.default.createElement(
                        "b",
                        null,
                        name,
                        " ",
                        this.props.patient.deceasedBoolean || this.props.patient.deceasedDateTime ? _react2.default.createElement(
                            "span",
                            { className: "deceased-label" },
                            "Deceased"
                        ) : null
                    ),
                    _react2.default.createElement(
                        "small",
                        null,
                        _react2.default.createElement(
                            "b",
                            null,
                            age
                        ),
                        " old ",
                        this.renderGender()
                    ),
                    _react2.default.createElement(
                        "footer",
                        { className: "small" },
                        _react2.default.createElement(
                            "span",
                            null,
                            "DOB: ",
                            this.props.patient.birthDate || "Unknown",
                            this.props.patient.deceasedDateTime ? ' / DOD: ' + (0, _moment2.default)(this.props.patient.deceasedDateTime).format("YYYY-MM-DD") : null
                        ),
                        _react2.default.createElement(
                            "span",
                            null,
                            "ID: ",
                            this.props.patient.id || "Unknown"
                        ),
                        _react2.default.createElement(
                            "span",
                            null,
                            "MRN: ",
                            (0, _lib.getPatientMRN)(this.props.patient) || "Unknown"
                        )
                    )
                ),
                _react2.default.createElement("i", { className: "fa fa-angle-right" })
            );
        }
    }, {
        key: "renderGender",
        value: function renderGender() {
            var gender = this.props.patient.gender;
            if (!gender) {
                return null;
            }

            return _react2.default.createElement(
                "span",
                { className: gender },
                gender
            );
        }
    }]);

    return PatientListItem;
}(_react2.default.Component);

PatientListItem.propTypes = {
    patient: _propTypes2.default.object,
    query: _propTypes2.default.object,
    settings: _propTypes2.default.object,
    selected: _propTypes2.default.bool,
    onSelectionChange: _propTypes2.default.func,
    index: _propTypes2.default.number
};
PatientListItem.defaultProps = {
    onSelectionChange: function onSelectionChange() {
        return 1;
    }
};
exports.default = PatientListItem;

/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__("../node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, __webpack_require__("../node_modules/react/react.js"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "index.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./components/SortWidget/SortWidget.less":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/SortWidget/SortWidget.less");
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__("../node_modules/style-loader/addStyles.js")(content, {"singleton":true});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/SortWidget/SortWidget.less", function() {
			var newContent = __webpack_require__("../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/SortWidget/SortWidget.less");
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./components/SortWidget/index.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__("../node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = __webpack_require__("../node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = __webpack_require__("../node_modules/react-dom/lib/ReactMount.js"), React = __webpack_require__("../node_modules/react/react.js"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("../node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

__webpack_require__("./components/SortWidget/SortWidget.less");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SortWidget = function (_React$Component) {
    _inherits(SortWidget, _React$Component);

    function SortWidget() {
        _classCallCheck(this, SortWidget);

        return _possibleConstructorReturn(this, (SortWidget.__proto__ || Object.getPrototypeOf(SortWidget)).apply(this, arguments));
    }

    _createClass(SortWidget, [{
        key: "change",
        value: function change(name, value) {
            // console.log(name, value)
            if (typeof this.props.onChange == "function") {
                var sort = this.parseSort(this.props.sort);
                if (!value) {
                    if (sort.hasOwnProperty(name)) {
                        delete sort[name];
                    }
                } else {
                    sort[name] = value;
                }
                // console.log(sort, this.compileSort(sort))
                this.props.onChange(this.compileSort(sort));
            }
        }
    }, {
        key: "parseSort",
        value: function parseSort(input) {
            var sort = {};
            String(input || "").split(",").filter(Boolean).forEach(function (s) {
                var name = s.replace(/^\-/, "");
                sort[name] = s.indexOf("-") === 0 ? "desc" : "asc";
            });
            return sort;
        }
    }, {
        key: "compileSort",
        value: function compileSort(sort) {
            return Object.keys(sort).map(function (k) {
                return sort[k] == "desc" ? "-" + k : k;
            }).join(",");
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            var sort = this.parseSort(this.props.sort);

            return _react2.default.createElement(
                "div",
                { className: "sort-widget small" },
                _react2.default.createElement(
                    "span",
                    { className: "pull-left" },
                    "Sort",
                    _react2.default.createElement(
                        "span",
                        { className: "hidden-xs" },
                        " by"
                    ),
                    ":"
                ),
                _react2.default.createElement(
                    "ul",
                    { className: "nav nav-pills" },
                    this.props.options.map(function (o, i) {
                        return _react2.default.createElement(
                            "li",
                            {
                                key: i,
                                role: "presentation",
                                className: o.value in sort ? "active" : null
                            },
                            _react2.default.createElement(
                                "a",
                                { href: "#", onClick: function onClick(e) {
                                        e.preventDefault();
                                        var _sort = _this2.parseSort(_this2.props.sort);
                                        switch (_sort[o.value]) {
                                            case "asc":
                                                return _this2.change(o.value, "desc");
                                            case "desc":
                                                return _this2.change(o.value, "");
                                            default:
                                                return _this2.change(o.value, "asc");
                                        }
                                    } },
                                o.label || o.name,
                                sort[o.value] == "asc" ? _react2.default.createElement(
                                    "span",
                                    { className: "sort" },
                                    _react2.default.createElement(
                                        "span",
                                        { className: "hidden-xs" },
                                        " Asc"
                                    ),
                                    " ",
                                    _react2.default.createElement("i", { className: "fa fa-sort-amount-asc" })
                                ) : sort[o.value] == "desc" ? _react2.default.createElement(
                                    "span",
                                    { className: "sort" },
                                    _react2.default.createElement(
                                        "span",
                                        { className: "hidden-xs" },
                                        " Desc"
                                    ),
                                    " ",
                                    _react2.default.createElement("i", { className: "fa fa-sort-amount-desc" })
                                ) : null
                            )
                        );
                    })
                )
            );
        }
    }]);

    return SortWidget;
}(_react2.default.Component);

SortWidget.propTypes = {
    /**
     * Fhir sort string like "status,-date,category"
     */
    sort: _propTypes2.default.string,

    options: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        name: _propTypes2.default.string,
        value: _propTypes2.default.string
    })),

    onChange: _propTypes2.default.func
};
SortWidget.defaultProps = {
    sort: "name,-birthdate",
    options: [{
        label: _react2.default.createElement(
            "span",
            null,
            _react2.default.createElement(
                "span",
                { className: "hidden-xs" },
                "Patient "
            ),
            "ID"
        ),
        name: "Patient ID",
        value: "_id"
    }, {
        name: "Name",
        value: "given"
    }, {
        name: "Gender",
        value: "gender"
    }, {
        name: "DOB",
        value: "birthdate"
    }]
};
exports.default = SortWidget;

/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__("../node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, __webpack_require__("../node_modules/react/react.js"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "index.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./components/TagSelector/TagSelector.less":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/TagSelector/TagSelector.less");
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__("../node_modules/style-loader/addStyles.js")(content, {"singleton":true});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/TagSelector/TagSelector.less", function() {
			var newContent = __webpack_require__("../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/less-loader/dist/cjs.js!./components/TagSelector/TagSelector.less");
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./components/TagSelector/index.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__("../node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = __webpack_require__("../node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = __webpack_require__("../node_modules/react-dom/lib/ReactMount.js"), React = __webpack_require__("../node_modules/react/react.js"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("../node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _jquery = __webpack_require__("../node_modules/jquery/dist/jquery.js");

var _jquery2 = _interopRequireDefault(_jquery);

var _lib = __webpack_require__("./lib/index.js");

__webpack_require__("./components/TagSelector/TagSelector.less");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TagSelector = function (_React$Component) {
    _inherits(TagSelector, _React$Component);

    function TagSelector() {
        var _ref;

        _classCallCheck(this, TagSelector);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = TagSelector.__proto__ || Object.getPrototypeOf(TagSelector)).call.apply(_ref, [this].concat(args)));

        _this.state = {
            // the selected items as a map of unique keys and tag objects
            selected: [],

            // is the menu currently visible?
            open: false,

            // the index of the currently selected option (-1 means no
            // selection).
            selectedIndex: -1,

            // The search therm (the value of the input field)
            search: ""
        };

        _this.stateFromProps(_this.state, _this.props);

        // bind the event handlers to preserve the "this" context
        _this.addTag = _this.addTag.bind(_this);
        _this.removeTag = _this.removeTag.bind(_this);
        _this.onFocus = _this.onFocus.bind(_this);
        _this.onBlur = _this.onBlur.bind(_this);
        _this.onKeyDown = _this.onKeyDown.bind(_this);
        _this.onInput = _this.onInput.bind(_this);
        return _this;
    }

    _createClass(TagSelector, [{
        key: "stateFromProps",
        value: function stateFromProps(state, nextProps) {
            var _this2 = this;

            var hasChanged = false;
            if (nextProps.search) {
                state.search = nextProps.search;
                hasChanged = true;
            }

            if (nextProps.selected) {
                state.selected = [].concat(_toConsumableArray(nextProps.selected.map(function (t) {
                    return _this2.props.tags.find(function (tag) {
                        return tag.key === t;
                    }) || {
                        key: t,
                        label: t,
                        custom: true,
                        data: {
                            description: t,
                            codes: {
                                "": [t]
                            }
                        }
                    };
                })));
                hasChanged = true;
            }

            return hasChanged;
        }
    }, {
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(nextProps) {
            var nextState = {};
            if (this.stateFromProps(nextState, nextProps)) {
                this.setState(nextState);
            }
        }

        /**
         * Updates the scroll position of the menu if it is opened and if some of
         * it's options is selected so that the selected option is always in view.
         */

    }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate() {
            var _this3 = this;

            var menu = this.refs.menu;
            if (menu) {
                var menuHeight = menu.clientHeight;
                var menuScrollTop = menu.scrollTop;
                var paddingTop = parseInt((0, _jquery2.default)(menu).css("paddingTop"), 10);
                var paddingBottom = parseInt((0, _jquery2.default)(menu).css("paddingBottom"), 10);
                var selected = (0, _jquery2.default)(".selected", this.refs.menu);

                if (selected.length) {
                    var selectedTop = selected[0].offsetTop;
                    var selectedHeight = selected[0].offsetHeight;
                    if (selectedTop < menuScrollTop) {
                        requestAnimationFrame(function () {
                            return _this3.refs.menu.scrollTop = selectedTop - paddingTop;
                        });
                    } else if (selectedTop + selectedHeight - menuScrollTop > menuHeight) {
                        requestAnimationFrame(function () {
                            return _this3.refs.menu.scrollTop = selectedTop + selectedHeight + paddingBottom - menuHeight;
                        });
                    }
                }
            }
        }

        // Event handlers ----------------------------------------------------------

    }, {
        key: "onFocus",
        value: function onFocus() {
            this.setState({ open: true });
        }
    }, {
        key: "onBlur",
        value: function onBlur() {
            this.setState({ open: false });
        }
    }, {
        key: "onInput",
        value: function onInput(e) {
            var listed = this.filterTags(e.target.value);
            this.setState({
                search: e.target.value,
                open: true,
                selectedIndex: listed.length && this.state.selectedIndex == -1 ? 0 : this.state.selectedIndex
            });
        }

        /**
         * This will handle special keys like Enter, Escape and arrows for scrolling
         */

    }, {
        key: "onKeyDown",
        value: function onKeyDown(e) {
            var _this4 = this;

            var listed = this.filterTags(this.state.search);
            switch (e.keyCode) {

                case 27:
                    // Esc
                    this.setState({ open: false });
                    break;

                case 13:
                    {
                        // Enter
                        // make sure we don't submit the form (if in any)
                        e.preventDefault();

                        if (listed.length < 2) {
                            this.setState({ open: false });
                        }

                        var index = this.state.selectedIndex;
                        if (index === listed.length - 1) {
                            this.setState({ selectedIndex: index - 1 }, function () {
                                _this4.addTag(listed[index]);
                            });
                        } else {
                            this.addTag(listed[index]);
                        }

                        break;
                    }

                case 40:
                    {
                        // Down arrow
                        e.preventDefault();
                        var maxIndex = listed.length - 1;
                        this.setState({
                            open: true,
                            selectedIndex: Math.min(this.state.selectedIndex + 1, maxIndex)
                        });
                        break;
                    }

                case 38:
                    // Up arrow
                    e.preventDefault();
                    if (this.state.selectedIndex > 0) {
                        this.setState({
                            selectedIndex: this.state.selectedIndex - 1
                        });
                    } else if (this.state.open) {
                        this.setState({
                            open: false,
                            selectedIndex: -1
                        });
                    }
                    break;
            }
        }

        /**
         * Happens when the user clicks on an option (or hits the enter key on
         * selected option)
         * @param {*} tag
         * @returns {void}
         */

    }, {
        key: "addTag",
        value: function addTag(tag) {
            var _this5 = this;

            if (!tag || !tag.key) {
                return;
            }

            // this.shouldn't happen but just in case, check if somebody is trying
            // to select something that is already selected
            if (this.state.selected.find(function (t) {
                return t.key === tag.key;
            })) {
                return;
            }

            this.setState(_extends({}, this.state, {
                selected: [].concat(_toConsumableArray(this.state.selected), [tag]),
                search: "",
                open: false,
                selectedIndex: -1
            }), function () {
                return _this5.props.onChange(_this5.state.selected);
            });
        }

        /**
         * Happens when the user clicks a close button on a selected tag
         * @param {*} key
         */

    }, {
        key: "removeTag",
        value: function removeTag(key) {
            var _this6 = this;

            if (!key) return;
            var idx = this.state.selected.findIndex(function (t) {
                return t.key === key;
            });
            if (idx > -1) {
                this.state.selected.splice(idx, 1);
                this.setState({}, function () {
                    return _this6.props.onChange(_this6.state.selected);
                });
            }
        }

        // Private helper methods --------------------------------------------------

    }, {
        key: "filterTags",
        value: function filterTags(search) {
            var _this7 = this;

            var tags = this.props.tags.filter(function (t) {

                // skip the already selected options
                if (_this7.state.selected.find(function (tag) {
                    return t.key === tag.key;
                })) {
                    return false;
                }

                // search for matches
                if (search) {

                    // first search by name
                    var index = t.label.toLowerCase().indexOf(search.toLowerCase());
                    if (index > -1) {
                        return true;
                    }

                    // then search by code
                    if (t.data && t.data.codes && _typeof(t.data.codes) == "object") {
                        for (var system in t.data.codes) {
                            return t.data.codes[system].some(function (c) {
                                return c.toLowerCase().indexOf(search.toLowerCase()) > -1;
                            });
                        }
                    }

                    return false;
                }
                return true;
            }).sort(function (a, b) {
                if (a.label > b.label) return 1;
                if (a.label < b.label) return -1;
                return 0;
            }).map(function (t) {
                return _extends({}, t);
            });

            if (this.state.search) {
                tags.unshift({
                    key: this.state.search,
                    label: this.state.search,
                    custom: true,
                    data: {
                        description: this.state.search,
                        codes: {
                            "": [this.state.search]
                        }
                    }
                });
            }

            return tags;
        }

        // Rendering methods -------------------------------------------------------

    }, {
        key: "renderTagCode",
        value: function renderTagCode(tag) {
            if (!tag || !tag.data || !tag.data.codes) {
                return null;
            }

            var code = "",
                codes = tag.data.codes;
            if (codes["SNOMED-CT"]) {
                code = codes["SNOMED-CT"].join("|");
            } else {
                for (var system in codes) {
                    code = codes[system].join(",") + " (" + system + ")";
                    break;
                }
            }

            if (this.state.search) {
                code = (0, _lib.renderSearchHighlight)(code, this.state.search);
            }

            return code ? _react2.default.createElement(
                "small",
                { key: tag.key, className: "text-muted code" },
                code,
                ":"
            ) : null;
        }
    }, {
        key: "renderTag",
        value: function renderTag(tag, index) {
            var _this8 = this;

            return _react2.default.createElement(
                "div",
                {
                    className: "menu-item" + (this.state.selectedIndex === index ? " selected" : "") + (tag.custom ? " custom text-primary" : ""),
                    key: tag.key,
                    onMouseDown: function onMouseDown(e) {
                        e.preventDefault();_this8.addTag(tag);
                    },
                    title: tag.label
                },
                tag.custom ? _react2.default.createElement(
                    "span",
                    null,
                    "Search for ",
                    _react2.default.createElement(
                        "b",
                        { className: "tag custom" },
                        this.state.search
                    ),
                    this.props.label ? " " + this.props.label : ""
                ) : null,
                tag.custom ? null : this.renderTagCode(tag),
                tag.custom ? null : (0, _lib.renderSearchHighlight)(tag.label, this.state.search)
            );
        }
    }, {
        key: "render",
        value: function render() {
            var _this9 = this;

            var menuItems = this.filterTags(this.state.search).map(this.renderTag, this);
            var emptyMenu = menuItems.length === 0;
            var tags = this.state.selected.map(function (tag) {
                return _react2.default.createElement(
                    "div",
                    { className: "tag" + (tag.custom ? " custom" : ""), key: tag.key },
                    tag.label,
                    _react2.default.createElement("i", {
                        className: "tag-remove fa fa-times-circle",
                        title: "Remove",
                        onMouseDown: function onMouseDown(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            _this9.removeTag(tag.key);
                        }
                    })
                );
            });

            var placeholder = "Type to search";
            if (this.props.label) {
                placeholder += " for " + this.props.label + "s";
            }
            placeholder += ' ...';

            return _react2.default.createElement(
                "div",
                { className: "tag-selector" + (this.state.open ? " open" : "") },
                tags.length ? _react2.default.createElement(
                    "div",
                    { className: "tags" },
                    tags
                ) : null,
                _react2.default.createElement("input", {
                    className: "input form-control input-sm",
                    placeholder: placeholder,
                    onFocus: this.onFocus,
                    onClick: this.onFocus,
                    onBlur: this.onBlur,
                    onKeyDown: this.onKeyDown,
                    onInput: this.onInput,
                    onChange: function onChange() {
                        return 1;
                    },
                    value: this.state.search
                }),
                _react2.default.createElement("i", { className: "fa fa-caret-down" }),
                emptyMenu && !this.state.search ? null : _react2.default.createElement(
                    "div",
                    { className: "menu dropdown-menu", ref: "menu" },
                    menuItems
                )
            );
        }
    }]);

    return TagSelector;
}(_react2.default.Component);

TagSelector.propTypes = {
    tags: _propTypes2.default.arrayOf(_propTypes2.default.object),
    selected: _propTypes2.default.arrayOf(_propTypes2.default.string),
    onChange: _propTypes2.default.func,
    search: _propTypes2.default.string,
    label: _propTypes2.default.string
};
TagSelector.defaultProps = {
    onChange: function onChange() {
        return 1;
    },
    tags: [],
    selected: [],
    search: ""
};
exports.default = TagSelector;

/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__("../node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, __webpack_require__("../node_modules/react/react.js"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "index.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./config.default.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__("../node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = __webpack_require__("../node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = __webpack_require__("../node_modules/react-dom/lib/ReactMount.js"), React = __webpack_require__("../node_modules/react/react.js"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    server: {
        type: "STU-3", // "DSTU-2" or "STU-3"

        // HSPC
        // url: "https://sb-fhir-dstu2.smarthealthit.org/api/smartdstu2/open",
        url: "https://sb-fhir-stu3.smarthealthit.org/smartstu3/open",

        // HAPI
        // url: "http://fhirtest.uhn.ca/baseDstu3",
        // url: "http://fhirtest.uhn.ca/baseDstu2",

        // MiHIN
        // url: "http://34.195.196.20:9074/smartstu3",
        // url: "http://52.90.126.238:8080/fhir/baseDstu3",

        // Other
        // url: "http://sqlonfhir-dstu2.azurewebsites.net/fhir",
        // url: "https://stub-dstu2.smarthealthit.org/api/fhir",

        conditions: {},

        tags: []
    },

    hideTagSelector: false,

    patientsPerPage: 25,

    // AJAX requests timeout
    timeout: 20000,

    // Only the selected patients are rendered. Should be false or the
    // preselected patient IDs should be passed to the window. Otherwise
    // It will result in rendering no patients at all.
    renderSelectedOnly: false,

    // If enabled is true (then url and param MUST be set) then clicking on the
    // patient-related resources in detail view will open their source in that
    // external viewer. Otherwise they will just be opened in new browser tab.
    fhirViewer: {
        enabled: true,
        url: "http://docs.smarthealthit.org/fhir-viewer/index.html",
        param: "url"
    },

    // What to send when the OK dialog button is clicked. Possible values:
    // "id-list"  - comma-separated list of patient IDs (default)
    // "id-array" - array of patient IDs
    // "patients" - array of patient JSON objects
    outputMode: "id-list",

    // "automatic" -> onChange plus defer in some cases
    // "manual" -> render a submit button
    submitStrategy: "manual"
};

/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__("../node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, __webpack_require__("../node_modules/react/react.js"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "config.default.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./index.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__("../node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = __webpack_require__("../node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = __webpack_require__("../node_modules/react-dom/lib/ReactMount.js"), React = __webpack_require__("../node_modules/react/react.js"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

"use strict";

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__("../node_modules/react-dom/index.js");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _App = __webpack_require__("./components/App/index.js");

var _App2 = _interopRequireDefault(_App);

var _reactRedux = __webpack_require__("../node_modules/react-redux/es/index.js");

var _redux = __webpack_require__("./redux/index.js");

var _redux2 = _interopRequireDefault(_redux);

var _PatientDetail = __webpack_require__("./components/PatientDetail/index.js");

var _PatientDetail2 = _interopRequireDefault(_PatientDetail);

var _PatientList = __webpack_require__("./components/PatientList/index.js");

var _PatientList2 = _interopRequireDefault(_PatientList);

var _reactRouter = __webpack_require__("../node_modules/react-router/es/index.js");

var _createHashHistory = __webpack_require__("../node_modules/history/createHashHistory.js");

var _createHashHistory2 = _interopRequireDefault(_createHashHistory);

var _jquery = __webpack_require__("../node_modules/jquery/dist/jquery.js");

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.$ = window.jQuery = _jquery2.default;

var history = (0, _createHashHistory2.default)();

_reactDom2.default.render(_react2.default.createElement(
    _reactRedux.Provider,
    { store: _redux2.default },
    _react2.default.createElement(
        _reactRouter.Router,
        { history: history },
        _react2.default.createElement(
            _reactRouter.Switch,
            null,
            _react2.default.createElement(
                _App2.default,
                null,
                _react2.default.createElement(_reactRouter.Route, { path: "/", component: _PatientList2.default, exact: true }),
                _react2.default.createElement(_reactRouter.Route, { path: "/patient/:index", component: _PatientDetail2.default })
            )
        )
    )
), document.getElementById("main"));

$(function () {
    $("body").tooltip({
        selector: ".patient-detail-page [title]"
    });
});

/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__("../node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, __webpack_require__("../node_modules/react/react.js"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "index.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./lib/PatientSearch.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__("../node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = __webpack_require__("../node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = __webpack_require__("../node_modules/react-dom/lib/ReactMount.js"), React = __webpack_require__("../node_modules/react/react.js"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moment = __webpack_require__("../node_modules/moment/moment.js");

var _moment2 = _interopRequireDefault(_moment);

var _constants = __webpack_require__("./lib/constants.js");

var _ = __webpack_require__("./lib/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * This is just a helper class that is used as a query builder. It has some
 * dedicated setter methods for various query parameters and knows how to
 * compile those into a query string that can be passed to the Patient endpoint
 * of a fhir api server.
 */
var PatientSearch = function () {
    /**
     * The constructor just creates an empty instance. Use the setter methods
     * to set query params and then call compile to build the query string.
     */
    function PatientSearch() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, PatientSearch);

        this.__cache__ = {};

        this.__scheduled__ = {};

        /**
         * The list of conditions that should be included in the query.
         * @type {Object} A map of unique keys and condition objects
         * @private
         */
        this.conditions = _extends({}, options.conditions || {});

        /**
         * The desired minimal age of the patients as an object like
         * { value: 5, units: "years" }
         * @type {Object}
         * @private
         */
        this.minAge = null;

        /**
         * The desired maximal age of the patients as an object like
         * { value: 5, units: "years" }
         * @type {Object}
         * @private
         */
        this.maxAge = null;

        /**
         * The patient gender to search for (male|female)
         * @type {String}
         * @private
         */
        this.gender = options.gender || null;

        /**
         * How many patients to fetch per page. Defaults to null meaning that
         * this param will not be included in the query and we are leaving it
         * for the server to decide.
         * @type {Number}
         * @private
         */
        this.limit = options.limit || null;

        /**
         * How many patients to skip. Defaults to null meaning that
         * this param will not be included in the query and we are leaving it
         * for the server to decide.
         * @type {Number}
         * @private
         */
        this.offset = null;

        /**
         * A collection of additional parameters
         * @type {Object}
         * @private
         */
        this.params = {};

        /**
         * This is like a flag that toggle the instance to different modes
         * (currently only advanced and default are supported)
         * @type {String} "advanced" or "default"
         * @private
         */
        this.queryType = options.queryType || "default";

        /**
         * The query string to use if in advanced mode
         * @type {String}
         * @private
         */
        this.queryString = options.queryString || "";

        /**
         * The sort parameters list
         * @type {String}
         * @private
         */
        this.sort = options.sort || "";

        /**
         * All the tags that the patients should be filtered by
         * @type {Array<String>}
         * @private
         */
        this.tags = String(options.tags || "").split(/\s*,\s*/).filter(Boolean);
    }

    /**
     * Schedule a prop change to be made before the next compile
     * @param {Object} props
     */


    _createClass(PatientSearch, [{
        key: "schedule",
        value: function schedule(props) {
            this.__scheduled__ = _extends({}, this.__scheduled__, props);
        }
    }, {
        key: "hasParam",
        value: function hasParam(name) {
            return this.params.hasOwnProperty(name);
        }

        /**
         * Sets a param by name. Note that this is a lower level interface. It does
         * not know anything about the parameter thus it will not handle UI
         * dependencies (eg. it won't reset the offset for you)
         * @param {Name} name The name of the parameter to set
         * @param {*} value The value to set. Use undefined to remove a parameter
         * @returns {PatientSearch} Returns the instance
         */

    }, {
        key: "setParam",
        value: function setParam(name, value) {
            var has = this.hasParam(name);
            if (value === undefined) {
                if (has) {
                    delete this.params[name];
                }
            } else {
                this.params[name] = value;
            }
            this.offset = null;
            this.cacheId = null;
            return this;
        }

        /**
         * Sets the query type. In advanced mode a query string is provided and
         * parsed and all the other parameters are ignored. In default mode the
         * query string is ignored and only the other params are used.
         * @param {String} type "advanced" or anything else for "default"
         * @returns {PatientSearch} Returns the instance
         */

    }, {
        key: "setQueryType",
        value: function setQueryType(type) {
            this.queryType = type == "advanced" ? "advanced" : "default";
            return this;
        }

        /**
         * Sets the query string to be used while in advanced mode. Note that this
         * will not be used if not in advanced mode but the query string will still
         * be persisted so that if the user switches the UI to advanced the last
         * query can be displayed...
         * @param {String} query The query string to use if in advanced mode
         * @returns {PatientSearch} Returns the instance
         */

    }, {
        key: "setQueryString",
        value: function setQueryString(query) {
            this.queryString = String(query || "");
            return this;
        }

        /**
         * Adds a condition to the list of patient conditions
         * @param {String} key Unique string identifier for that condition
         * @param {Object} condition The condition to add
         * @returns {PatientSearch} Returns the instance
         */

    }, {
        key: "addCondition",
        value: function addCondition(key, condition) {
            this.conditions[key] = condition;
            this.__cache__.patientIDs = null;
            return this;
        }

        /**
         * Removes the condition identified by it's key. If that condition is not
         * currently included it does nothing
         * @param {*} key Unique string identifier for that condition
         * @returns {PatientSearch} Returns the instance
         */

    }, {
        key: "removeCondition",
        value: function removeCondition(key) {
            if (this.conditions.hasOwnProperty(key)) {
                delete this.conditions[key];
                this.__cache__.patientIDs = null;
            }
            return this;
        }

        /**
         * Replaces the entire set of conditions at once
         * @param {Object} conditions The new conditions to set
         * @returns {PatientSearch} Returns the instance
         */

    }, {
        key: "setConditions",
        value: function setConditions(conditions) {
            this.conditions = _extends({}, conditions);
            this.schedule({
                offset: null,
                cacheId: null
            });
            this.__cache__.patientIDs = null;
            return this;
        }
    }, {
        key: "addTag",
        value: function addTag(tag) {
            if (this.tags.findIndex(tag) == -1) {
                this.tags.push(tag);
            }
            return this;
        }
    }, {
        key: "removeTag",
        value: function removeTag(tag) {
            var index = this.tags.findIndex(tag);
            if (index > -1) {
                this.tags.splice(index, 1);
            }
            return this;
        }
    }, {
        key: "setTags",
        value: function setTags(tags) {
            this.tags = [].concat(_toConsumableArray(tags));
            this.schedule({
                offset: null,
                cacheId: null
            });
            return this;
        }

        /**
         * Sets the desired min age af the patients. This can also be set to null
         * (or other falsy value) to exclude the minAge restrictions from the query.
         * @param {Object} age The age
         * @param {Number} age.value The age as number of @units
         * @param {String} age.units The units for the value (years|months|days)
         * @returns {PatientSearch} Returns the instance
         */

    }, {
        key: "setMinAge",
        value: function setMinAge(age) {
            this.minAge = age;
            this.schedule({
                offset: null,
                cacheId: null
            });
            return this;
        }

        /**
         * Sets the desired max age af the patients. This can also be set to null
         * (or other falsy value) to exclude the maxAge restrictions from the query.
         * @param {Object} age The age
         * @param {Number} age.value The age as number of @units
         * @param {String} age.units The units for the value (years|months|days)
         * @returns {PatientSearch} Returns the instance
         */

    }, {
        key: "setMaxAge",
        value: function setMaxAge(age) {
            this.maxAge = age;
            this.schedule({
                offset: null,
                cacheId: null
            });
            return this;
        }

        /**
         * Sets the min and max ages depending on the specified age group keyword
         * @param {*} group Can be one of infant, child, adult, elderly.
         *                  Anything else will clear the age constraints!
         * @returns {PatientSearch} Returns the instance
         */

    }, {
        key: "setAgeGroup",
        value: function setAgeGroup(group) {
            this.ageGroup = group;
            this.schedule({
                offset: null,
                cacheId: null
            });

            switch (group) {

                // infant - 0 to 12 months
                case "infant":
                    this.setMinAge(null);
                    this.setMaxAge({ value: 1, units: "years" });
                    break;

                // child - 1 to 18 years
                case "child":
                    this.setMinAge({ value: 1, units: "years" });
                    this.setMaxAge({ value: 18, units: "years" });
                    break;

                // adult - 18 to 65 years
                case "adult":
                    this.setMinAge({ value: 18, units: "years" });
                    this.setMaxAge({ value: 65, units: "years" });
                    break;

                // Elderly - 65+
                case "elderly":
                    this.setMinAge({ value: 65, units: "years" });
                    this.setMaxAge(null);
                    break;

                // Anything else clears the birthdate param
                default:
                    this.setMinAge(null);
                    this.setMaxAge(null);
                    // this.ageGroup = null;
                    break;
            }
            return this;
        }

        /**
         * Sets the gender to search for. Can be "male" or "female". Any falsy value
         * will clear the gender param
         * @param {String} gender "male" or "female"
         * @returns {PatientSearch} Returns the instance
         */

    }, {
        key: "setGender",
        value: function setGender(gender) {
            if (gender !== this.gender) {
                this.gender = gender;
                this.schedule({
                    offset: null,
                    cacheId: null
                });
            }
            return this;
        }

        /**
         * Sets how many patients will be fetched per page
         * @param {number|string} limit The number of records to fetch
         * @returns {PatientSearch} Returns the instance
         */

    }, {
        key: "setLimit",
        value: function setLimit(limit) {
            this.limit = (0, _.intVal)(limit);
            if (this.limit < 1) {
                this.limit = null;
            }
            return this;
        }

        /**
         * Sets how many patients will be skipped
         * @param {string} cacheId The id generated by the server (_getpages)
         * @param {number|string} offset The number of records to skip
         * @returns {PatientSearch} Returns the instance
         */

    }, {
        key: "setOffset",
        value: function setOffset(cacheId, offset) {
            this.offset = (0, _.intVal)(offset);
            this.cacheId = cacheId;
            if (this.offset < 1) {
                this.offset = null;
                this.cacheId = null;
            }
            return this;
        }

        /**
         * Sets the sorting to use
         * @param {string} sort A fhir sort string like "status,-date,category"
         * @returns {PatientSearch} Returns the instance
         */

    }, {
        key: "setSort",
        value: function setSort(sort) {
            this.sort = sort;
            return this;
        }

        /**
         * Returns another PatientSearch instance with the exact same state as this.
         * @returns {PatientSearch} Returns the new copy
         */

    }, {
        key: "clone",
        value: function clone() {
            var inst = new PatientSearch();

            inst.conditions = _extends({}, this.conditions);
            inst.params = _extends({}, this.params);
            inst.tags = [].concat(_toConsumableArray(this.tags));

            inst.setAgeGroup(this.ageGroup).setMinAge(this.minAge).setMaxAge(this.maxAge).setGender(this.gender).setLimit(this.limit).setOffset(this.cacheId, this.offset).setQueryType(this.queryType).setQueryString(this.queryString).setSort(this.sort);

            return inst;
        }

        /**
         * Clear all params. If you call compile after clear only the "_format=json"
         * part should be returned
         * @returns {PatientSearch} Returns the instance
         */

    }, {
        key: "reset",
        value: function reset() {
            this.conditions = {};
            this.minAge = null;
            this.maxAge = null;
            this.gender = null;
            this.limit = null;
            this.offset = null;
            this.cacheId = null;
            this.ageGroup = null;
            this.params = {};
            this.queryString = "";
            this.queryType = "default";
            this.sort = "";
            this.tags = [];
            return this;
        }

        /**
         * Returns an object representing the current state of the instance.
         * The object contains COPIES of the current param values.
         * @returns {Object}
         */

    }, {
        key: "getState",
        value: function getState() {
            return {
                conditions: this.conditions,
                minAge: this.minAge,
                maxAge: this.maxAge,
                gender: this.gender,
                limit: this.limit,
                offset: this.offset,
                cacheId: this.cacheId,
                ageGroup: this.ageGroup,
                params: _extends({}, this.params),
                queryString: this.queryString,
                queryType: this.queryType,
                sort: this.sort,
                tags: [].concat(_toConsumableArray(this.tags))
            };
        }

        /**
         * Compiles and returns the query string that can be send to the Patient
         * endpoint.
         * @return {String} The compiled query string (without the "?" in front)
         */

    }, {
        key: "compile",
        value: function compile() {
            var _this = this;

            var encode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            var params = [];

            [
            // conditions
            "minAge", "maxAge", "gender", "limit", "offset",
            // "params",
            "queryType", "queryString", "sort" //,
            // tags
            ].forEach(function (prop) {
                if (_this.__scheduled__.hasOwnProperty(prop)) {
                    _this[prop] = _this.__scheduled__[prop];
                    delete _this.__scheduled__[prop];
                }
            });

            // Tags ----------------------------------------------------------------
            if (this.tags.length && !this.params._id) {
                params.push({ name: "_tag", value: this.tags.join(",") });
            }

            // Advanced query ------------------------------------------------------
            if (this.queryType == "advanced") {
                var str = this.queryString.trim();
                if (str) {
                    var _query = (0, _.parseQueryString)(str);
                    for (var name in _query) {
                        params.push({ name: name, value: _query[name] });
                    }
                }
            }

            // Default query -------------------------------------------------------
            else {

                    // Custom params ---------------------------------------------------
                    Object.keys(this.params).forEach(function (k) {
                        return params.push({
                            name: k,
                            value: _this.params[k]
                        });
                    });

                    // sort ------------------------------------------------------------
                    if (this.sort) {
                        String(this.sort).split(",").forEach(function (token) {
                            if (token.indexOf("-") === 0) {
                                params.push({
                                    name: "_sort:desc",
                                    value: token.substring(1)
                                });
                            } else {
                                params.push({
                                    name: "_sort:asc",
                                    value: token
                                });
                            }
                        });
                        // params.push({
                        //     name : "_sort",
                        //     value: this.sort
                        // })
                    }

                    if (!this.params._id) {

                        // Min age -----------------------------------------------------
                        if (this.minAge) {
                            var d = (0, _moment2.default)().subtract(this.minAge.value, this.minAge.units);
                            params.push({
                                name: "birthdate",
                                value: "le" + d.format('YYYY-MM-DD')
                            });
                        }

                        // Max age -----------------------------------------------------
                        if (this.maxAge) {
                            var _d = (0, _moment2.default)().subtract(this.maxAge.value, this.maxAge.units);
                            params.push({
                                name: "birthdate",
                                value: "ge" + _d.format('YYYY-MM-DD')
                            });
                        }

                        // exclude deceased patients if age is specified ---------------
                        if (this.maxAge || this.minAge) {
                            var existing = params.find(function (p) {
                                return p.name === "deceased";
                            });
                            if (existing) {
                                existing.value = false;
                            } else {
                                params.push({
                                    name: "deceased",
                                    value: false
                                });
                            }
                        }

                        // Gender ------------------------------------------------------
                        if (this.gender) {
                            params.push({
                                name: "gender",
                                value: this.gender
                            });
                        }
                    }
                }

            // limit ---------------------------------------------------------------
            if (this.limit) {
                params.push({
                    name: "_count",
                    value: this.limit
                });
            }

            // offset --------------------------------------------------------------
            if (this.offset && this.cacheId) {
                params.push({
                    name: "_getpages",
                    value: this.cacheId
                }, {
                    name: "_getpagesoffset",
                    value: this.offset
                });
            }

            // Compile and return --------------------------------------------------
            return params.map(function (p) {
                return encode ? encodeURIComponent(p.name) + "=" + encodeURIComponent(p.value) : p.name + "=" + p.value;
            }).join("&");
        }

        /**
         * Checks if there are any conditions chosen at the moment
         * @returns {Boolean}
         */

    }, {
        key: "hasConditions",
        value: function hasConditions() {
            for (var key in this.conditions) {
                if (this.conditions.hasOwnProperty(key)) {
                    return true;
                }
            }
            return false;
        }

        /**
         * Compiles the current conditions into URL-encoded parameter list
         * @returns {String}
         */

    }, {
        key: "compileConditions",
        value: function compileConditions() {
            var _this2 = this;

            // let params = [];

            // for (let key in this.conditions) {
            //     let condition = this.conditions[key]

            //     // system
            //     let value = [];
            //     for (let system in condition.codes) {
            //         let systemUrl = (CODE_SYSTEMS[system] || {}).url;

            //         // system.code[n] - OR
            //         condition.codes[system].forEach(c => {
            //             value.push( systemUrl ? systemUrl + "|" + c : c );
            //         })
            //     }

            //     if (value.length) {
            //         params.push({
            //             name : "code",
            //             value: value.join(",")
            //         })
            //     }
            // }

            // return params.map(p => (
            //     encodeURIComponent(p.name) + "=" + encodeURIComponent(p.value)
            // )).join("&");
            var out = [];

            var _loop = function _loop(key) {
                var condition = _this2.conditions[key];

                // system
                var value = [];

                var _loop2 = function _loop2(system) {
                    var systemUrl = (_constants.CODE_SYSTEMS[system] || {}).url || "http://snomed.info/sct";

                    // system.code[n] - OR
                    condition.codes[system].forEach(function (c) {
                        value.push(systemUrl + "|" + c);
                    });
                };

                for (var system in condition.codes) {
                    _loop2(system);
                }

                if (value.length) {
                    out.push(value.join(","));
                }
            };

            for (var key in this.conditions) {
                _loop(key);
            }
            return out.length ? "code=" + encodeURIComponent(out.join(",")) : "";
        }
    }, {
        key: "getConditionKeys",
        value: function getConditionKeys() {
            var _this3 = this;

            var out = [];

            var _loop3 = function _loop3(key) {
                var condition = _this3.conditions[key];

                // system
                var value = [];

                var _loop4 = function _loop4(system) {
                    var systemUrl = (_constants.CODE_SYSTEMS[system] || {}).url || "http://snomed.info/sct";

                    // system.code[n] - OR
                    condition.codes[system].forEach(function (c) {
                        value.push(systemUrl + "|" + c);
                    });
                };

                for (var system in condition.codes) {
                    _loop4(system);
                }

                if (value.length) {
                    out.push(value.join(","));
                }
            };

            for (var key in this.conditions) {
                _loop3(key);
            }
            return out;
        }

        /**
         * Returns a promise resolved with a list of patient IDs that have the
         * specified condition(s)
         * @param {String} baseURL
         * @returns {Promise<String[]>}
         */

    }, {
        key: "getPatientIDs",
        value: function getPatientIDs(server) {
            var _this4 = this;

            if (this.__cache__.patientIDs) {
                return Promise.resolve(this.__cache__.patientIDs);
            }

            var conditions = this.compileConditions();

            if (!conditions) {
                return Promise.resolve([]);
            }

            /**
             * The keys (eg: "http://snomed.info/sct|44054006") that were set by the
             * user.
             * @type {Array<String>}
             * @private
             */
            var conditionKeys = this.getConditionKeys();

            /**
             * Map of patient IDs as keys and array of condition keys as values.
             * @private
             */
            var patientIDs = {};

            /**
             * Handles the JSON response (single page) of the conditions query.
             * Collects the patient IDs and their condition codes into the
             * patientIDs local variable. When all the pages are fetched, cleans up
             * the IDs to only contain those that have all the conditions specified
             * by the user.
             * @param {Object} response The JSON Conditions bundle response
             * @returns {Promise<String[]>} Array of patient ID strings (can be empty)
             */
            var handleConditionsResponse = function handleConditionsResponse(response) {

                // Collect the data
                if (response.entry) {
                    response.entry.forEach(function (condition) {
                        var patientID = server.type == "DSTU-2" ? condition.resource.patient.reference.split("/").pop() : condition.resource.subject.reference.split("/").pop();
                        if (!patientIDs[patientID]) {
                            patientIDs[patientID] = [];
                        }
                        patientIDs[patientID].push(((0, _.getPath)(condition, "resource.code.coding.0.system") || "http://snomed.info/sct") + "|" + (0, _.getPath)(condition, "resource.code.coding.0.code"));
                    });

                    var nextLink = (response.link || []).find(function (l) {
                        return l.relation == "next";
                    });
                    if (nextLink) {
                        return (0, _.request)({ url: nextLink.url }).then(handleConditionsResponse);
                    }
                }
                // console.log(conditionKeys, patientIDs)
                // Clean up and only leave patients having all the conditions
                patientIDs = Object.keys(patientIDs).filter(function (key) {
                    return conditionKeys.every(function (conditionKey) {
                        return patientIDs[key].indexOf(conditionKey) > -1;
                    });
                });
                // console.log(patientIDs)

                // finally return a promise resolved with the compiled ID array
                return Promise.resolve(patientIDs);
            };

            // The conditions to search for
            var params = [conditions];

            // only need the patient - skip the rest to reduce the response
            params.push(server.type == "DSTU-2" ? "_elements=patient,code" : "_elements=subject,code");

            // Set bigger limit here to reduce the chance of having to
            // make other queries to fetch subsequent pages
            params.push("_count=500");

            // Tags (not currently available in STU2)
            if (this.tags.length) {
                params.push("_tag=" + encodeURIComponent(this.tags.join(",")));
            }

            return (0, _.request)({
                url: server.url + "/Condition?" + params.join("&")
            }).then(handleConditionsResponse).then(function (ids) {
                _this4.__cache__.patientIDs = ids;
                return ids;
            });
        }

        /**
         * Fetches the patients matching the user-defined conditions. The actual
         * strategy may vary but regardless of the implementation, a promise is
         * returned that should eventually be resolved with the result bundle.
         * @param {String} baseURL
         * @returns {Promise<Bundle>}
         */

    }, {
        key: "fetch",
        value: function fetch(server) {
            var _this5 = this;

            var data = this.compile();

            // STU2 does not work with the deceased param
            if (server.type == "DSTU-2") {
                data = data.replace(/\bdeceased=(true|false)\b/gi, "");
            }

            // prepare the base options for the patient ajax request
            var options = {
                url: server.url + "/Patient/_search",
                method: "POST",
                processData: false,
                data: data,
                headers: {
                    accept: "application/json+fhir"
                }
            };

            return this.getPatientIDs(server).then(function (ids) {
                if (ids.length) {
                    // if IDs were found - add them to the patient query
                    options.data = [options.data, "_id=" + encodeURIComponent(ids.join(","))].filter(Boolean).join("&");
                } else {
                    // If conditions were specified but no patients were found to
                    // have those conditions, then we should exit early.
                    if (_this5.hasConditions()) {
                        return Promise.reject("No patients found with the specified conditions!");
                    }
                }
                return options;
            }).then(_.request);
        }
    }]);

    return PatientSearch;
}();

exports.default = PatientSearch;

/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__("../node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, __webpack_require__("../node_modules/react/react.js"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "PatientSearch.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./lib/constants.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__("../node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = __webpack_require__("../node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = __webpack_require__("../node_modules/react-dom/lib/ReactMount.js"), React = __webpack_require__("../node_modules/react/react.js"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var CODE_SYSTEMS = exports.CODE_SYSTEMS = {
    'LOINC': { url: 'http://loinc.org' },
    'SNOMED-CT': { url: 'http://snomed.info/sct' },
    'RxNorm': { url: 'http://www.nlm.nih.gov/research/umls/rxnorm' },
    'CVX': { url: 'http://hl7.org/fhir/sid/cvx' },
    'NUBC': { url: 'http://www.nubc.org/patient-discharge' },
    'UMLS': { url: 'http://uts.nlm.nih.gov/metathesaurus' }
};

/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__("../node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, __webpack_require__("../node_modules/react/react.js"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "constants.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./lib/index.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__("../node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = __webpack_require__("../node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = __webpack_require__("../node_modules/react-dom/lib/ReactMount.js"), React = __webpack_require__("../node_modules/react/react.js"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.intVal = intVal;
exports.boolVal = boolVal;
exports.getErrorMessage = getErrorMessage;
exports.getPath = getPath;
exports.compileQueryString = compileQueryString;
exports.parseQueryString = parseQueryString;
exports.setHashParam = setHashParam;
exports.findMRNCoding = findMRNCoding;
exports.findMRNIdentifier = findMRNIdentifier;
exports.getPatientMRN = getPatientMRN;
exports.getPatientName = getPatientName;
exports.getPatientPhone = getPatientPhone;
exports.getPatientEmail = getPatientEmail;
exports.getPatientHomeAddress = getPatientHomeAddress;
exports.getPatientAge = getPatientAge;
exports.getPatientImageUri = getPatientImageUri;
exports.searchHighlight = searchHighlight;
exports.renderSearchHighlight = renderSearchHighlight;
exports.getBundleURL = getBundleURL;
exports.request = request;
exports.getAllPages = getAllPages;

var _react = __webpack_require__("../node_modules/react/react.js");

var React = _interopRequireWildcard(_react);

var _moment = __webpack_require__("../node_modules/moment/moment.js");

var _moment2 = _interopRequireDefault(_moment);

var _jquery = __webpack_require__("../node_modules/jquery/dist/jquery.js");

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Returns the int representation of the first argument or the
 * "defaultValue" if the int conversion is not possible.
 * @param {number|string} x The argument to convert
 * @param {number} defaultValue The fall-back return value. This will be
 *                              converted to integer too.
 * @return {Number} The resulting integer.
 */
function intVal(x) {
    var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    var out = parseInt(x + "", 10);
    if (isNaN(out) || !isFinite(out)) {
        out = intVal(defaultValue);
    }
    return out;
}

/**
 * Converts the argument to boolean value. "0" and "no" are recognized as false.
 * "1" and "yes" are recognized as true. Everything else is just !!var
 * @param {*} x The argument to convert
 * @returns {Boolean} The argument converted to boolean
 */
function boolVal(x) {
    return (/^(false|0|no)$/i.test(String(x)) ? false : /^(true|1|yes)$/i.test(String(x)) ? true : !!x
    );
}

/**
 * Given some input argument, this function tries to treat it like an error and
 * extract an error message out of it. Supported input types are:
 * - String
 * - Error
 * - AJAX JSON response
 * - FHIR JSON response
 * - Object map of error messages
 * @param {*} input The input to analyse
 * @param {String|JSX.Element} error(s)
 */
function getErrorMessage(input) {
    if (input && typeof input == "string") {
        return input;
    }

    var out = "Unknown error";

    if (input && input instanceof Error) {
        out = String(input);
    } else if (input && input.responseJSON) {
        if (Array.isArray(input.responseJSON.issue) && input.responseJSON.issue.length) {
            out = input.responseJSON.issue.map(function (o) {
                return o.diagnostics || "-";
            }).join("\n");
        } else {
            out = input.responseJSON.message || input.responseJSON.error || "Unknown error";
        }
    } else if (input && input.responseText) {
        out = input.responseText + " - " + input.statusText || "Unknown error";
    } else if (input && input.statusText) {
        if (input.statusText == "timeout") {
            out = "The server failed to respond in the desired number of seconds";
        } else {
            out = input.statusText || "Unknown error";
        }
    }

    if (out && (typeof out === "undefined" ? "undefined" : _typeof(out)) == "object") {
        var out2 = [];
        for (var key in out) {
            out2.push(React.createElement("li", { key: key }, out[key]));
        }
        return React.createElement("div", null, ["Multiple errors", React.createElement("ul", null, out2)]);
    }

    return out;
}

/**
 * Walks thru an object (ar array) and returns the value found at the provided
 * path. This function is very simple so it intentionally does not support any
 * argument polymorphism, meaning that the path can only be a dot-separated
 * string. If the path is invalid returns undefined.
 * @param {Object} obj The object (or Array) to walk through
 * @param {String} path The path (eg. "a.b.4.c")
 * @returns {*} Whatever is found in the path or undefined
 */
function getPath(obj) {
    var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

    return path.split(".").reduce(function (out, key) {
        return out ? out[key] : undefined;
    }, obj);
}

function compileQueryString(params) {
    var query = [];

    var _loop = function _loop(key) {
        var p = params[key];

        // If the parameter value is falsy (and other than 0) just don't include
        // it in the query
        if (!p && p !== 0) {
            return "continue";
        }

        // if the value is an array then include that parameter multiple times
        // with different values
        if (Array.isArray(p)) {
            p.forEach(function (v) {

                // skip falsy not 0 values same as above
                if (v || v === 0) {
                    query.push(encodeURIComponent(key) + "=" + encodeURIComponent(v));
                }
            });
        }

        // Add normal param to the query string
        else {
                query.push(encodeURIComponent(key) + "=" + encodeURIComponent(p));
            }
    };

    for (var key in params) {
        var _ret = _loop(key);

        if (_ret === "continue") continue;
    }

    return query.join("&");
}

function parseQueryString(str) {
    var out = {};
    str = String(str || "").trim().split("?").pop();
    str.split(/&/).forEach(function (pair) {
        var tokens = pair.split("=");
        var key = decodeURIComponent(tokens[0]);
        if (key) {
            var value = decodeURIComponent(tokens[1] || "true");
            if (out.hasOwnProperty(key)) {
                if (!Array.isArray(out[key])) {
                    out[key] = [out[key]];
                }
                out[key].push(value);
            } else {
                out[key] = value;
            }
        }
    });
    return out;
}

function setHashParam(name, value) {
    var query = location.hash.split("?")[1] || "";
    var hash = location.hash.replace(/\?.*/, "");
    // console.warn(query)
    query = parseQueryString(query || "");
    if (value === undefined) {
        if (query.hasOwnProperty(name)) {
            delete query[name];
        }
    } else {
        query[name] = value;
    }

    query = compileQueryString(query);
    location.hash = hash + (query ? "?" + query : "");
}

// Fhir parsing helpers --------------------------------------------------------

/**
 * Given an array of Coding objects finds and returns the one that contains
 * an MRN (using a code == "MR" check)
 * @export
 * @param {Object[]} codings Fhir.Coding[]
 * @returns {Object} Fhir.Coding | undefined
 */
function findMRNCoding(codings) {
    if (Array.isArray(codings)) {
        return codings.find(function (coding) {
            return coding.code == "MR";
        });
    }
}

/**
 * Given an array of identifier objects finds and returns the one that contains an MRN
 * @export
 * @param {Object[]} identifiers
 * @returns {Object}
 */
function findMRNIdentifier(identifiers) {
    return identifiers.find(function (identifier) {
        return !!findMRNCoding(getPath(identifier, "type.coding"));
    });
}

/**
 * Given a patient returns his MRN
 * @export
 * @param {Object} patient
 * @returns {string}
 */
function getPatientMRN(patient) {
    var mrn = null;

    if (Array.isArray(patient.identifier) && patient.identifier.length) {
        mrn = findMRNIdentifier(patient.identifier);
        if (mrn) {
            return mrn.value;
        }
    }

    return mrn;
}

/**
 * Extracts and returns a human-readable name string from FHIR patient object.
 * @param {Object} patient FHIR patient object
 * @returns {String} Patient's name or an empty string
 */
function getPatientName(patient) {
    if (!patient) {
        return "";
    }

    var name = patient.name;
    if (!Array.isArray(name)) {
        name = [name];
    }
    name = name[0];
    if (!name) {
        return "";
    }

    var family = Array.isArray(name.family) ? name.family : [name.family];
    var given = Array.isArray(name.given) ? name.given : [name.given];
    var prefix = Array.isArray(name.prefix) ? name.prefix : [name.prefix];
    var suffix = Array.isArray(name.suffix) ? name.suffix : [name.suffix];

    return [prefix.map(function (t) {
        return String(t || "").trim();
    }).join(" "), given.map(function (t) {
        return String(t || "").trim();
    }).join(" "), family.map(function (t) {
        return String(t || "").trim();
    }).join(" "), suffix.map(function (t) {
        return String(t || "").trim();
    }).join(" ")].filter(Boolean).join(" ");
}

/**
 * Given a FHIR patient object, returns the patient's phone number (or empty string).
 * Note that if the patient have multiple phones this will only return the first one.
 * @param {Object} patient FHIR patient object
 * @returns {String} Patient's phone or an empty string
 */
function getPatientPhone() {
    var patient = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var phone = (patient.telecom || []).find(function (c) {
        return c.system == "phone";
    });
    return phone ? phone.value : "";
}

/**
 * Given a FHIR patient object, returns the patient's email (or an empty string).
 * Note that if the patient have multiple emails this will only return the first one.
 * @param {Object} patient FHIR patient object
 * @returns {String} Patient's email address or an empty string
 */
function getPatientEmail() {
    var patient = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var phone = (patient.telecom || []).find(function (c) {
        return c.system == "email";
    });
    return phone ? phone.value || "" : "";
}

/**
 * Extracts and returns a human-readable address string from FHIR patient object.
 * @param {Object} patient FHIR patient object
 * @returns {String} Patient's address or an empty string
 */
function getPatientHomeAddress() {
    var patient = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var a = patient.address || [];
    a = a.find(function (c) {
        return c.use == "home";
    }) || a[0] || {};
    return [a.line, a.postalCode, a.city, a.country].map(function (x) {
        return String(x || "").trim();
    }).filter(Boolean).join(" ");
}

/**
 * Extracts and returns a human-readable age string from FHIR patient object.
 * @param {Object} patient FHIR patient object
 * @returns {String} Patient's age
 */
function getPatientAge(patient) {
    var from = (0, _moment2.default)(patient.birthDate);
    var to = (0, _moment2.default)(patient.deceasedDateTime || undefined);
    var age = to - from;

    var seconds = Math.round(age / 1000);
    if (seconds < 60) {
        return seconds + " second";
    }

    var minutes = Math.round(seconds / 60);
    if (minutes < 60) {
        return minutes + " minute";
    }

    var hours = Math.round(minutes / 60);
    if (hours < 24) {
        return hours + " hour";
    }

    var days = Math.round(hours / 24);
    if (days < 30) {
        return days + " day";
    }

    var months = Math.round(days / 30);
    if (months < 24) {
        return months + " month";
    }

    var years = Math.round(days / 365);
    return years + " year";
}

/**
 * Extracts and returns an URL pointing to the patient photo (or an empty string)
 * @param {Object} patient FHIR patient object
 * @returns {String} Patient's image URL
 */
function getPatientImageUri(patient) {
    var base = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

    var data = getPath(patient, "photo.0.data") || "";
    var url = getPath(patient, "photo.0.url") || "";
    var type = getPath(patient, "photo.0.contentType") || "";
    if (url.indexOf("/") === 0) {
        url = base + "" + url;
    }
    var http = url && url.match(/^https?:\/\//);
    if (!http && data) {
        if (type && data.indexOf("data:") !== 0) {
            data = "data:" + type + ";base64," + data;
        }
        url = data;
    } else if (type && !http) {
        url = "data:" + type + ";base64," + url;
    }
    return url;
}

/**
 * Given some input string (@input) and a string to search for (@query), this
 * function will highlight all the occurrences by wrapping them in
 * "<span class="search-match"></span>" tag.
 * @param {String} input The input string
 * @param {String} query The string to search for
 * @param {Boolean} caseSensitive Defaults to false
 * @returns {String} The input string with the matches highlighted
 */
function searchHighlight(input, query) {
    var caseSensitive = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var s = String(input);
    var q = String(query);
    var x = s;

    if (!caseSensitive) {
        x = x.toLowerCase();
        q = q.toLowerCase();
    }

    var i = x.indexOf(q);

    if (i > -1) {
        return s.substr(0, i) + "<span class=\"search-match\">" + s.substr(i, q.length) + "</span>" + s.substr(i + q.length);
    }

    return input;
}

/**
 * Uses searchHighlight() to generate and return a JSX.span element containing
 * the @html string with @search highlighted
 * @param {String} html The input string
 * @param {String} search The string to search for
 * @returns {JSX.span} SPAN element with the matches highlighted
 */
function renderSearchHighlight(html, search) {
    return React.createElement("span", { dangerouslySetInnerHTML: {
            __html: search ? searchHighlight(html, search) : html
        } });
}

/**
 * Given a fhir bundle fins it's link having the given rel attribute.
 * @param {Object} bundle FHIR JSON Bundle object
 * @param {String} rel The rel attribute to look for: prev|next|self... (see
 * http://www.iana.org/assignments/link-relations/link-relations.xhtml#link-relations-1)
 * @returns {String|null} Returns the url of the link or null if the link was
 *                        not found.
 */
function getBundleURL(bundle, rel) {
    var nextLink = bundle.link;
    if (nextLink) {
        nextLink = nextLink.find(function (l) {
            return l.relation === rel;
        });
        return nextLink && nextLink.url ? nextLink.url : null;
    }
    return null;
}

function request(options) {
    options = typeof options == "string" ? { url: options } : options || {};
    var cfg = _jquery2.default.extend(true, options, {
        headers: {
            Accept: "application/json+fhir"
        }
    });

    return new Promise(function (resolve, reject) {
        // console.info("Requesting " + decodeURIComponent(cfg.url))
        _jquery2.default.ajax(cfg).then(resolve, function (xhr) {
            var message = getErrorMessage(xhr);
            if (message && typeof message == "string") {
                return reject(new Error(message));
            } else {
                return reject({ message: message });
            }
        });
    });
}

function getAllPages(options) {
    var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    return request(options).then(function (bundle) {
        (bundle.entry || []).forEach(function (item) {
            if (item.fullUrl && result.findIndex(function (o) {
                return o.fullUrl === item.fullUrl;
            }) == -1) {
                result.push(item);
            }
        });
        var nextUrl = getBundleURL(bundle, "next");
        if (nextUrl) {
            return getAllPages(_extends({}, options, { url: nextUrl }), result);
        }
        return result;
    });
}

/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__("../node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, __webpack_require__("../node_modules/react/react.js"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "index.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./redux/index.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__("../node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = __webpack_require__("../node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = __webpack_require__("../node_modules/react-dom/lib/ReactMount.js"), React = __webpack_require__("../node_modules/react/react.js"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _redux = __webpack_require__("../node_modules/redux/es/index.js");

var _reduxThunk = __webpack_require__("../node_modules/redux-thunk/lib/index.js");

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _selection = __webpack_require__("./redux/selection.js");

var _selection2 = _interopRequireDefault(_selection);

var _query = __webpack_require__("./redux/query.js");

var _query2 = _interopRequireDefault(_query);

var _settings = __webpack_require__("./redux/settings.js");

var _settings2 = _interopRequireDefault(_settings);

var _urlParams = __webpack_require__("./redux/urlParams.js");

var _urlParams2 = _interopRequireDefault(_urlParams);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The purpose of this file is to combine reducers and create the single store.
 * One should use it simply like so:
 *
 * ```import STORE from "./redux"```
 */
var middleWares = [_reduxThunk2.default];

// Create logger middleware that will log all redux action but only
// use that in development env.
if ('development' == "development" && console && console.groupCollapsed) {
    var logger = function logger(_store) {
        return function (next) {
            return function (action) {
                var result = void 0;
                if (!action.__no_log) {
                    console.groupCollapsed(action.type);
                    console.info("dispatching", action);
                    result = next(action);
                    console.log("next state", _store.getState());
                    console.groupEnd(action.type);
                } else {
                    result = next(action);
                }
                return result;
            };
        };
    };

    middleWares.push(logger);
}

exports.default = (0, _redux.createStore)((0, _redux.combineReducers)({
    selection: _selection2.default,
    query: _query2.default,
    settings: _settings2.default,
    urlParams: _urlParams2.default
}), _redux.applyMiddleware.apply(undefined, middleWares));

/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__("../node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, __webpack_require__("../node_modules/react/react.js"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "index.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./redux/query.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__("../node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = __webpack_require__("../node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = __webpack_require__("../node_modules/react-dom/lib/ReactMount.js"), React = __webpack_require__("../node_modules/react/react.js"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.goPrev = exports.goNext = exports.fetch = exports.setLimit = exports.setTags = exports.delTag = exports.addTag = exports.setSort = exports.setQueryType = exports.setQueryString = exports.setParam = exports.setGender = exports.setConditions = exports.delCondition = exports.addCondition = exports.setAgeGroup = exports.setMaxAge = exports.setMinAge = exports.setData = exports.setError = exports.setLoading = exports.queryBuilder = undefined;

var _handleActions;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _reduxActions = __webpack_require__("../node_modules/redux-actions/es/index.js");

var _PatientSearch = __webpack_require__("./lib/PatientSearch.js");

var _PatientSearch2 = _interopRequireDefault(_PatientSearch);

var _lib = __webpack_require__("./lib/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var queryBuilder = exports.queryBuilder = new _PatientSearch2.default((0, _lib.parseQueryString)(window.location.hash.split("?")[1] || ""));

/**
 * The initial state is just an empty object that will be filled
 * with query parameters.
 */
var INITIAL_STATE = _extends({}, queryBuilder.getState(), {
    loading: false,
    error: null,
    bundle: null

    // Private action constants
});var SET_LOADING = "app/search/SET_LOADING";
var SET_ERROR = "app/search/SET_ERROR";
var SET_DATA = "app/search/SET_DATA";
var SET_MIN_AGE = "app/search/SET_MIN_AGE";
var SET_MAX_AGE = "app/search/SET_MAX_AGE";
var SET_AGE_GROUP = "app/search/SET_AGE_GROUP";
var ADD_CONDITION = "app/search/ADD_CONDITION";
var DEL_CONDITION = "app/search/DEL_CONDITION";
var ADD_TAG = "app/search/ADD_TAG";
var DEL_TAG = "app/search/DEL_TAG";
var SET_CONDITIONS = "app/search/SET_CONDITIONS";
var SET_GENDER = "app/search/SET_GENDER";
var SET_PARAM = "app/search/SET_PARAM";
var SET_QUERY_STRING = "app/search/SET_QUERY_STRING";
var SET_QUERY_TYPE = "app/search/SET_QUERY_TYPE";
var SET_SORT = "app/search/SET_SORT";
var SET_TAGS = "app/search/SET_TAGS";
var SET_LIMIT = "app/search/SET_LIMIT";

// Create (and export) the redux actions ---------------------------------------
var setLoading = exports.setLoading = (0, _reduxActions.createAction)(SET_LOADING);
var setError = exports.setError = (0, _reduxActions.createAction)(SET_ERROR);
var setData = exports.setData = (0, _reduxActions.createAction)(SET_DATA);
var setMinAge = exports.setMinAge = (0, _reduxActions.createAction)(SET_MIN_AGE);
var setMaxAge = exports.setMaxAge = (0, _reduxActions.createAction)(SET_MAX_AGE);
var setAgeGroup = exports.setAgeGroup = (0, _reduxActions.createAction)(SET_AGE_GROUP);
var addCondition = exports.addCondition = (0, _reduxActions.createAction)(ADD_CONDITION);
var delCondition = exports.delCondition = (0, _reduxActions.createAction)(DEL_CONDITION);
var setConditions = exports.setConditions = (0, _reduxActions.createAction)(SET_CONDITIONS);
var setGender = exports.setGender = (0, _reduxActions.createAction)(SET_GENDER);
var setParam = exports.setParam = (0, _reduxActions.createAction)(SET_PARAM);
var setQueryString = exports.setQueryString = (0, _reduxActions.createAction)(SET_QUERY_STRING);
var setQueryType = exports.setQueryType = (0, _reduxActions.createAction)(SET_QUERY_TYPE);
var setSort = exports.setSort = (0, _reduxActions.createAction)(SET_SORT);
var addTag = exports.addTag = (0, _reduxActions.createAction)(ADD_TAG);
var delTag = exports.delTag = (0, _reduxActions.createAction)(DEL_TAG);
var setTags = exports.setTags = (0, _reduxActions.createAction)(SET_TAGS);
var setLimit = exports.setLimit = (0, _reduxActions.createAction)(SET_LIMIT);

var fetch = exports.fetch = function fetch() {
    return function (dispatch, getState) {
        dispatch(setLoading(true));
        dispatch(setError(null));

        var _getState = getState(),
            settings = _getState.settings;

        queryBuilder.fetch(settings.server).then(function (bundle) {
            dispatch(setData(bundle));
            dispatch(setLoading(false));
        }, function (error) {
            dispatch(setError(error));
            dispatch(setLoading(false));
        });
    };
};

var goNext = exports.goNext = function goNext() {
    return function (dispatch, getState) {
        var bundle = getState().query.bundle;

        var url = (0, _lib.getBundleURL)(bundle, "next");
        if (url) {
            url = (0, _lib.parseQueryString)(url);
            queryBuilder.setOffset(url._getpages, +url._getpagesoffset);
            dispatch(fetch());
        }
    };
};

var goPrev = exports.goPrev = function goPrev() {
    return function (dispatch, getState) {
        var bundle = getState().query.bundle;

        var url = (0, _lib.getBundleURL)(bundle, "previous");
        if (url) {
            url = (0, _lib.parseQueryString)(url);
            queryBuilder.setOffset(url._getpages, +url._getpagesoffset);
            dispatch(fetch());
        }
    };
};

// Export the reducer as default
exports.default = (0, _reduxActions.handleActions)((_handleActions = {}, _defineProperty(_handleActions, SET_SORT, function (state, action) {
    queryBuilder.setSort(action.payload);
    return _extends({}, state, queryBuilder.getState());
}), _defineProperty(_handleActions, SET_QUERY_STRING, function (state, action) {
    queryBuilder.setQueryString(action.payload);
    return _extends({}, state, queryBuilder.getState());
}), _defineProperty(_handleActions, SET_QUERY_TYPE, function (state, action) {
    queryBuilder.setQueryType(action.payload);
    return _extends({}, state, queryBuilder.getState());
}), _defineProperty(_handleActions, SET_PARAM, function (state, action) {
    queryBuilder.setParam(action.payload.name, action.payload.value);
    return _extends({}, state, queryBuilder.getState());
}), _defineProperty(_handleActions, SET_MIN_AGE, function (state, action) {
    queryBuilder.setMinAge(action.payload);
    return _extends({}, state, queryBuilder.getState());
}), _defineProperty(_handleActions, SET_MAX_AGE, function (state, action) {
    queryBuilder.setMaxAge(action.payload);
    return _extends({}, state, queryBuilder.getState());
}), _defineProperty(_handleActions, SET_AGE_GROUP, function (state, action) {
    queryBuilder.setAgeGroup(action.payload);
    return _extends({}, state, queryBuilder.getState());
}), _defineProperty(_handleActions, ADD_CONDITION, function (state, action) {
    queryBuilder.addCondition(action.payload.key, action.payload.value);
    return _extends({}, state, queryBuilder.getState());
}), _defineProperty(_handleActions, SET_CONDITIONS, function (state, action) {
    queryBuilder.setConditions(action.payload);
    return _extends({}, state, queryBuilder.getState());
}), _defineProperty(_handleActions, DEL_CONDITION, function (state, action) {
    queryBuilder.removeCondition(action.payload);
    return _extends({}, state, queryBuilder.getState());
}), _defineProperty(_handleActions, ADD_TAG, function (state, action) {
    queryBuilder.addTag(action.payload);
    return _extends({}, state, queryBuilder.getState());
}), _defineProperty(_handleActions, DEL_TAG, function (state, action) {
    queryBuilder.removeTag(action.payload);
    return _extends({}, state, queryBuilder.getState());
}), _defineProperty(_handleActions, SET_TAGS, function (state, action) {
    queryBuilder.setTags(action.payload);
    return _extends({}, state, queryBuilder.getState());
}), _defineProperty(_handleActions, SET_GENDER, function (state, action) {
    queryBuilder.setGender(action.payload);
    return _extends({}, state, queryBuilder.getState());
}), _defineProperty(_handleActions, SET_LIMIT, function (state, action) {
    queryBuilder.setLimit(action.payload);
    return _extends({}, state, queryBuilder.getState());
}), _defineProperty(_handleActions, SET_LOADING, function (state, action) {
    return _extends({}, state, queryBuilder.getState(), {
        loading: !!action.payload
    });
}), _defineProperty(_handleActions, SET_ERROR, function (state, action) {
    return _extends({}, state, queryBuilder.getState(), {
        error: action.payload
    });
}), _defineProperty(_handleActions, SET_DATA, function (state, action) {
    return _extends({}, state, queryBuilder.getState(), {
        bundle: action.payload
    });
}), _handleActions), INITIAL_STATE);

/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__("../node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, __webpack_require__("../node_modules/react/react.js"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "query.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./redux/selection.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__("../node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = __webpack_require__("../node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = __webpack_require__("../node_modules/react-dom/lib/ReactMount.js"), React = __webpack_require__("../node_modules/react/react.js"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setAll = exports.toggle = undefined;

var _handleActions;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _reduxActions = __webpack_require__("../node_modules/redux-actions/es/index.js");

var _lib = __webpack_require__("./lib/index.js");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var PARAMS = (0, _lib.parseQueryString)(location.hash);
var SINGLE = (0, _lib.boolVal)(PARAMS["single-selection"]);

/**
 * For the initial selection state parse the query portion of the URL hash (if
 * any). Note that this is not enough! The hash query can provide list of
 * patient IDs but we initialize them as true. Later they should be updated to
 * contain actual patient objects instead of true!
 */
var initialSelection = {};
(PARAMS._selection || "").split(/\s*,\s*/).forEach(function (k) {
    if (k) {

        k = k.toLowerCase();

        // In single mode the last id will become the selected one!
        if (SINGLE) {
            initialSelection = _defineProperty({}, k, true);
        } else {
            initialSelection[k] = true;
        }
    }
});

/**
 * The initial state is just an empty object that will be filled
 * with patient IDs as keys and booleans as values to indicate if
 * that patient is selected.
 */
var INITIAL_STATE = _extends({}, initialSelection);

// Private action constants
var TOGGLE = "app/selection/TOGGLE";
var SET_ALL = "app/selection/SET_ALL";

// Create (and export) the redux actions
var toggle = exports.toggle = (0, _reduxActions.createAction)(TOGGLE);
var setAll = exports.setAll = (0, _reduxActions.createAction)(SET_ALL);

/**
 * Update the "_selection" hash parameter whenever the selection changes
 * @param {Object} selection The selection to set
 */
function setHashSelection(selection) {
    (0, _lib.setHashParam)("_selection", Object.keys(selection).filter(function (k) {
        return selection.hasOwnProperty(k) && !!selection[k];
    }).join(","));
}

// Export the reducer as default
exports.default = (0, _reduxActions.handleActions)((_handleActions = {}, _defineProperty(_handleActions, TOGGLE, function (state, action) {
    var id = String(action.payload.id).toLowerCase();
    var newState = _defineProperty({}, id, state[id] ? false : action.payload);

    if (!SINGLE) {
        newState = _extends({}, state, newState);
    }
    setHashSelection(newState);
    return newState;
}), _defineProperty(_handleActions, SET_ALL, function (_, action) {
    var newState = _extends({}, action.payload);
    setHashSelection(newState);
    return newState;
}), _handleActions), INITIAL_STATE);

/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__("../node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, __webpack_require__("../node_modules/react/react.js"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "selection.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./redux/settings.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__("../node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = __webpack_require__("../node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = __webpack_require__("../node_modules/react-dom/lib/ReactMount.js"), React = __webpack_require__("../node_modules/react/react.js"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.showSelectedOnly = exports.replace = exports.merge = undefined;

var _handleActions;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _reduxActions = __webpack_require__("../node_modules/redux-actions/es/index.js");

var _configDefault = __webpack_require__("./config.default.js");

var _configDefault2 = _interopRequireDefault(_configDefault);

var _mixinDeep = __webpack_require__("../node_modules/mixin-deep/index.js");

var _mixinDeep2 = _interopRequireDefault(_mixinDeep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Private action constants
var MERGE = "app/settings/MERGE";
var REPLACE = "app/settings/REPLACE";
var RENDER_SELECTED_ONLY = "app/settings/RENDER_SELECTED_ONLY";

// Create (and export) the redux actions
var merge = exports.merge = (0, _reduxActions.createAction)(MERGE);
var replace = exports.replace = (0, _reduxActions.createAction)(REPLACE);
var showSelectedOnly = exports.showSelectedOnly = (0, _reduxActions.createAction)(RENDER_SELECTED_ONLY);

// Export the reducer as default
exports.default = (0, _reduxActions.handleActions)((_handleActions = {}, _defineProperty(_handleActions, MERGE, function (state, action) {
    return (0, _mixinDeep2.default)(state, action.payload, { loaded: true });
}), _defineProperty(_handleActions, RENDER_SELECTED_ONLY, function (state, action) {
    return _extends({}, state, {
        renderSelectedOnly: !!action.payload
    });
}), _defineProperty(_handleActions, REPLACE, function (_, action) {
    return _extends({}, action.payload);
}), _handleActions), _configDefault2.default);

/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__("../node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, __webpack_require__("../node_modules/react/react.js"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "settings.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./redux/urlParams.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__("../node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = __webpack_require__("../node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = __webpack_require__("../node_modules/react-dom/lib/ReactMount.js"), React = __webpack_require__("../node_modules/react/react.js"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
    return _extends({}, INITIAL_STATE);
};

var _lib = __webpack_require__("./lib/index.js");

/**
 * The initial state is just an empty object that will be filled
 * with patient IDs as keys and booleans as values to indicate if
 * that patient is selected.
 */
var INITIAL_STATE = (0, _lib.parseQueryString)(location.hash.replace(/^.*\?/, ""));

// Export the reducer as default

/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__("../node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, __webpack_require__("../node_modules/react/react.js"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "urlParams.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("../node_modules/webpack-dev-server/client/index.js?http:/localhost:9001");
__webpack_require__("../node_modules/webpack/hot/only-dev-server.js");
module.exports = __webpack_require__("./index.js");


/***/ })

},[1]);
//# sourceMappingURL=index.js.9e980a7ecf228d4aacca.map