import React from 'react';
import {Image, View, StyleSheet} from 'react-native';
import Video from 'react-native-video';

const Loader = () => {
  const videoSource = require('../assets/videos/loading.mov');
  const logoSource = require('../assets/images/logo.png');

  return (
    <View style={styles.container}>
      <Video
        source={videoSource}
        style={styles.video}
        resizeMode="cover"
        repeat
        controls={false}
      />
      <View style={styles.logoContainer}>
        <Image source={logoSource} style={styles.logo} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
  },
  logoContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    opacity: 0.7,
  },
});

export default Loader;
