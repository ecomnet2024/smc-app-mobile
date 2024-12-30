function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React from 'react';
import { Image, View } from 'react-native';
import 'react-native-url-polyfill/auto';
import { SDKAnalyticsConstants } from './internal/SDKAnalyticsConstants';
const AdvancedImage = props => {
  const {
    cldImg,
    ...rest // Assume any other props are for the base element
  } = props;
  return /*#__PURE__*/React.createElement(View, null, /*#__PURE__*/React.createElement(Image, _extends({}, rest, {
    source: {
      uri: cldImg.toURL({
        trackedAnalytics: SDKAnalyticsConstants
      })
    }
  })));
};
export default AdvancedImage;
//# sourceMappingURL=AdvancedImage.js.map