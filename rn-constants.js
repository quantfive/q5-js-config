import { Constants } from 'expo';
import { Dimensions } from 'react-native';

function getEnvironment(releaseChannel) {
  if (releaseChannel === undefined) return 'dev' // since releaseChannels are undefined in dev, return your default.
  if (releaseChannel.indexOf('prod') !== -1) return 'production' // this would pick up prod-v1, prod-v2, prod-v3
  if (releaseChannel.indexOf('staging') !== -1) return 'staging' // return staging environment variables
}

export const ENV = getEnvironment(Constants.manifest.releaseChannel);

const tintColor = '#2f95dc';

export const Colors = {
  tintColo: tintColor,
  tabIconDefault: '#ccc',
  tabIconSelected: tintColor,
  tabBar: '#fefefe',
  errorBackground: 'red',
  errorText: '#fff',
  warningBackground: '#EAEB5E',
  warningText: '#666804',
  noticeBackground: tintColor,
  noticeText: '#fff',
};

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export const Layout = {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
};