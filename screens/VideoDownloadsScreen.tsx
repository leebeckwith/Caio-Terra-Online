import React, {useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useVideoOfflineModal} from '../components/VideoOfflinePlayerModalContext';
import {useSelector} from 'react-redux';
import RNFS from 'react-native-fs';

const VideoDownloadsScreen = () => {
  const [downloadedFiles, setDownloadedFiles] = useState({});
  const cachedVideosData = useSelector(state => state.cachedVideos);
  const {openOfflineVideoModal} = useVideoOfflineModal();

  const handleVideoPress = async video => {
    const selectedVideoPath = `${RNFS.DocumentDirectoryPath}/${video}`;
    try {
      openOfflineVideoModal(selectedVideoPath);
    } catch (error) {
      console.error('Error playing offline video:', error);
      Alert.alert('Error', `There was an error playing the video: ${error}`);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      async function loadDownloadedFiles() {
        try {
          const files = await RNFS.readdir(RNFS.DocumentDirectoryPath);
          const videoFiles = files.filter(file => file.endsWith('.mp4'));
          const videoIds = videoFiles.map(file => file.split('_')[0]);
          const downloadedVideos = cachedVideosData.filter(video =>
            videoIds.includes(video.vimeoid.toString()),
          );

          const mergedArray = videoIds.map(videoId => {
            const videoFile = videoFiles.find(file => file.startsWith(videoId));
            const parts = videoFile.split('_');
            const resolution = parts[1];
            const datePart = parts[2].split('.')[0];
            const videoData = downloadedVideos.find(video => video.vimeoid.toString() === videoId);

            return {
              id: videoData.id,
              videoFile,
              videoData,
              resolution,
              date: datePart,
            };
          });

          mergedArray.sort((a, b) => {
            return b.date - a.date;
          });

          setDownloadedFiles(mergedArray);
        } catch (error) {
          console.error('Error loading downloaded videos:', error);
          Alert.alert(
            'Error',
            `There was an error listing the downloaded videos: ${error}`,
          );
        }
      }

      loadDownloadedFiles();
    }, []),
  );

  const renderVideoItem = ({item}) => (
    <View>
      <Pressable
        style={styles.videoDownloadItem}
        onPress={() => handleVideoPress(item.videoFile)}>
        <Image
          source={{uri: item.videoData.thumburl}}
          style={styles.thumbnail}
        />
      </Pressable>
      <Text style={styles.titleOverlay}>
        {item.videoData.title.toUpperCase()} ({item.resolution.toUpperCase()})
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryName}>DOWNLOADED VIDEOS</Text>
      </View>
      {downloadedFiles.toString() === '' ? (
        <Text style={styles.categoryName}>No downloaded files available.</Text>
      ) : (
        <FlatList
          data={downloadedFiles}
          showsVerticalScrollIndicator={true}
          indicatorStyle={'white'}
          keyExtractor={item => item.videoData.vimeoid.toString()}
          renderItem={renderVideoItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 10,
    paddingBottom: 10,
  },
  categoryHeader: {
    backgroundColor: '#00a6ff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
  },
  categoryName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonBody: {
    color: '#fff',
  },
  videoDownloadItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    justifyContent: 'space-between',
  },
  thumbnail: {
    width: '100%',
    height: 200,
  },
  titleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    padding: 8,
    textAlign: 'left',
  },
});

export default VideoDownloadsScreen;
