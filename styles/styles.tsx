import {StyleSheet} from 'react-native';

const CTAStyles = StyleSheet.create({
  // background colors
  cta_black: {
    backgroundColor: '#000',
  },
  inactive: {
    backgroundColor: '#555',
  },
  active: {
    backgroundColor: '#00a6ff',
  },
  secondary: {
    backgroundColor: '#666',
  },
  input_bg: {
    backgroundColor: '#fff',
  },
  delete: {
    backgroundColor: '#d11a2a',
  },
  activeAlpha: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  // background colors
  text_light: {
    color: '#fff',
  },
  text_dark: {
    color: '#000',
  },
  text_link: {
    color: '#00a6ff',
  },
  // component colors
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cta_input: {
    backgroundColor: '#fff',
    color: '#000',
    height: 40,
  },
  // dropshadows
  shadowProp: {
    shadowColor: '#000',
    shadowOffset: {width: -3, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});

export default CTAStyles;
