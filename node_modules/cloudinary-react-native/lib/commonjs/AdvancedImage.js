"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
require("react-native-url-polyfill/auto");
var _SDKAnalyticsConstants = require("./internal/SDKAnalyticsConstants");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const AdvancedImage = props => {
  const {
    cldImg,
    ...rest // Assume any other props are for the base element
  } = props;
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, null, /*#__PURE__*/_react.default.createElement(_reactNative.Image, _extends({}, rest, {
    source: {
      uri: cldImg.toURL({
        trackedAnalytics: _SDKAnalyticsConstants.SDKAnalyticsConstants
      })
    }
  })));
};
var _default = AdvancedImage;
exports.default = _default;
//# sourceMappingURL=AdvancedImage.js.map