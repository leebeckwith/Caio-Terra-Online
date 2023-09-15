import React, { useRef, useState } from "react";
import {StyleSheet, View} from 'react-native';
import Orientation, {
  useDeviceOrientationChange,
} from 'react-native-orientation-locker';
import Video from 'react-native-video';

const VideoOfflinePlayer = ({route}: {route: any}) => {
  const selectedVideoPath = route.params;
  const playerRef = useRef(null);
  const [currentOrientation, setCurrentOrientation] = useState<string>(
    Orientation.getInitialOrientation(),
  );
  const [isLandscape, setIsLandscape] = useState(false);

  useDeviceOrientationChange(o => {
    setCurrentOrientation(o);
    if (o === 'LANDSCAPE-RIGHT' || o === 'LANDSCAPE-LEFT') {
      setIsLandscape(true);
    } else {
      setIsLandscape(false);
    }
  });

  return (
    <View>
      <Video
        ref={playerRef}
        source={{uri: selectedVideoPath}}
        style={styles.videoPlayer}
        controls={!isLandscape}
        resizeMode="cover"
        fullscreen={isLandscape}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  videoPlayer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },
});

export default VideoOfflinePlayer;
