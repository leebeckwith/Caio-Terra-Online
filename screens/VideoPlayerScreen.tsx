import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Video from 'react-native-video';
import {useIsFocused} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const VideoPlayer = ({route}: {route: any}) => {
  // Extract the parameters passed from navigation
  const {vimeoId, vimeoToken} = route.params ? route.params : '';
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null); // Store the video URL
  const videoRef = useRef<Video | null>(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    getVimeoVideo(vimeoId);

    // Cleanup function to unload the video when the component is unmounted
    return () => {
      if (videoRef.current) {
        videoRef.current.stop();
      }
    };
  }, []); // Empty dependency array to run this effect only once

  const getVimeoVideo = async (vimeoId: number) => {
    try {
      // Construct the Vimeo API URL for the specific video
      const vimeoApiUrl = `https://api.vimeo.com/videos/${vimeoId}`;

      // Fetch the video data from the Vimeo API
      const response = await fetch(vimeoApiUrl, {
        headers: {
          Authorization: `Bearer ${vimeoToken}`, // Include the Vimeo Bearer token in the request headers
        },
      });

      // Parse the response and get the video data
      const videoData = await response.json();

      // Set the video data to the selectedVideo state
      setSelectedVideo(videoData.files[2].link);
    } catch (error) {
      console.error('Error fetching video from Vimeo API:', error);
      setSelectedVideo(null); // Reset selectedVideo in case of an error
    }
  };

  return (
    <View style={styles.container}>
      {selectedVideo ? (
        <View>
          <Video
            source={{uri: selectedVideo}}
            ref={ref => {
              // @ts-ignore
              this.player = ref;
            }} // Store reference
            style={styles.videoPlayer}
            resizeMode="contain"
            controls={true}
            paused={!isFocused} // Pause the video when the screen loses focus
          />
          <View style={styles.wrapper}>
            <Icon
              name="list"
              color="white"
              size={30}
              style={styles.iconsLeft}
            />
            <Icon
              name="download"
              color="white"
              size={30}
              style={styles.iconsLeft}
            />
            <Icon
              name="star-o"
              color="white"
              size={30}
              style={styles.iconsRight}
            />
          </View>
        </View>
      ) : (
        <View>
          <Text style={styles.text}>Vimeo ID: {vimeoId}</Text>
          <Text style={styles.text}>Vimeo Token: {vimeoToken}</Text>
          <Text style={styles.text}>Loading video...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 10,
  },
  text: {
    color: '#fff',
  },
  videoPlayer: {
    width: '100%',
    height: 300,
    backgroundColor: '#050505',
  },
  wrapper: {
    flexDirection: 'row',
    width: '100%',
    borderWidth: 1,
    borderColor: 'red',
  },
  title: {
    width: '95%',
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 10,
    borderColor: 'red',
    borderWidth: 1,
  },
  icons: {
    color: '#fff',
    marginTop: 8,
    display: 'flex',
  },
  iconsRight: {
    alignItems: 'flex-end',
  },
  iconsLeft: {
    alignItems: 'flex-start',
  },
});

export default VideoPlayer;
