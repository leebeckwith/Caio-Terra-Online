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
import {useVideoModal} from '../components/VideoPlayerModalContext';
import {useSelector} from 'react-redux';
import {getCredentials} from '../storage';
import RNFS, {unlink} from 'react-native-fs';
import Icon from 'react-native-vector-icons/FontAwesome';

const VideoDownloadsScreen = () => {
  const [downloadedFiles, setDownloadedFiles] = useState([]);
  const cachedVideosData = useSelector(state => state.cachedVideos);
  const {openVideoModal} = useVideoModal();

  const handleVideoPress = async video => {
    const {user_id} = await getCredentials();
    const vimeoToken = '91657ec3585779ea01b973f69aae2c9c';
    const selectedVideoPath = `${RNFS.DocumentDirectoryPath}/${video}`;
    const vimeoId = video.split('_')[0];
    try {
      openVideoModal(vimeoId, vimeoToken, user_id, null, selectedVideoPath);
    } catch (error) {
      console.error('Error playing offline video:', error);
      Alert.alert('Error', `There was an error playing the video: ${error}`);
    }
  };

  const handleDeleteFile = async video => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this offline video?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            unlink(`${RNFS.DocumentDirectoryPath}/${video}`)
              .then(() => {
                const updatedMergedArray = downloadedFiles.filter(
                  item => item.videoFile !== video,
                );
                setDownloadedFiles(updatedMergedArray);
                Alert.alert(
                  'File deleted',
                  'Your offline video was successfully deleted.',
                );
              })
              .catch(error => {
                Alert.alert(
                  'Error',
                  `There was an error deleting the offline video: ${error}`,
                );
              });
          },
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  };

  function parseDateFromString(inputString) {
    const year = parseInt(inputString.slice(0, 4));
    const month = parseInt(inputString.slice(4, 6)) - 1;
    const day = parseInt(inputString.slice(6, 8));
    const hour = parseInt(inputString.slice(8, 10));
    const minute = parseInt(inputString.slice(10, 12));
    const date = new Date(year, month, day, hour, minute);

    return date;
  }

  function calculateRemainingTime(dateDifference) {
    const totalMilliseconds = 30 * 24 * 60 * 60 * 1000;
    const remainingMilliseconds = totalMilliseconds - dateDifference;

    if (remainingMilliseconds <= 0) {
      return '0:00:00';
    }

    const daysRemaining = Math.floor(
      remainingMilliseconds / (24 * 60 * 60 * 1000),
    );
    const hoursRemaining = Math.floor(
      (remainingMilliseconds % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000),
    );
    const minutesRemaining = Math.floor(
      (remainingMilliseconds % (60 * 60 * 1000)) / (60 * 1000),
    );

    return `${daysRemaining}d:${hoursRemaining
      .toString()
      .padStart(2, '0')}h:${minutesRemaining.toString().padStart(2, '0')}m`;
  }

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
            const videoData = downloadedVideos.find(
              video => video.vimeoid.toString() === videoId,
            );

            const currentDate = new Date();
            const videoDate = parseDateFromString(datePart);
            const dateDifference = currentDate - videoDate;
            const daysRemaining = calculateRemainingTime(dateDifference);

            if (daysRemaining === '0:00:00') {
              // Delete the video file
              unlink(`${RNFS.DocumentDirectoryPath}/${videoFile}`)
                .then(() => {
                  console.log('Video deleted:', videoFile);
                  const updatedMergedArray = mergedArray.filter(
                    item => item.videoFile !== videoFile,
                  );
                  setDownloadedFiles(updatedMergedArray);
                })
                .catch(error => {
                  console.error('Error deleting video:', error);
                });
            }

            return {
              id: videoData.id,
              videoFile,
              videoData,
              resolution,
              date: datePart,
              timeRemaining: daysRemaining,
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
      <View style={styles.titleOverlayContainer}>
        <Text style={styles.titleOverlay}>
          {item.videoData.title.toUpperCase()} ({item.resolution.toUpperCase()})
          {'\n'}
          PLAYBACK EXPIRES IN {item.timeRemaining}
        </Text>
        <View style={styles.wrapper}>
          <Pressable
            style={styles.iconButton}
            onPress={() => handleDeleteFile(item.videoFile)}>
            <Icon name={'trash'} color="white" size={20} />
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryName}>OFFLINE VIDEOS</Text>
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
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  thumbnail: {
    width: '100%',
    height: 200,
  },
  titleOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    padding: 8,
    textAlign: 'left',
    width: '90%',
  },
  wrapper: {
    width: '10%',
    alignItems: 'center',
  },
  iconButton: {
    backgroundColor: '#d11a2a',
    padding: 11,
    height: '100%',
  },
  titleOverlayContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    flex: 1,
    flexDirection: 'row',
  },
});

export default VideoDownloadsScreen;
