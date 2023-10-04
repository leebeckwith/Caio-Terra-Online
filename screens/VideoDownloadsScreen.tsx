import React, {useState} from 'react';
import {Alert, FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useVideoModal} from '../components/VideoPlayerModalContext';
import RNFS, {unlink} from 'react-native-fs';
import Icon from 'react-native-vector-icons/FontAwesome';
import CTAStyles from '../styles/styles';

const VideoDownloadsScreen = () => {
  const [downloadedFiles, setDownloadedFiles] = useState([]);
  const {openVideoModal} = useVideoModal();

  const handleVideoPress = async (video: string) => {
    const vimeoId = video.split('_')[0];
    try {
      openVideoModal(vimeoId, null, null, null, video);
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
            unlink(`${RNFS.CachesDirectoryPath}/${video}`)
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
          const files = await RNFS.readdir(RNFS.CachesDirectoryPath);
          const videoFiles = files.filter(file => file.endsWith('.mp4'));
          const videoIds = videoFiles.map(file => file.split('_')[0]);

          const mergedArray = videoIds.map(videoId => {
            const videoFile = videoFiles.find(file => file.startsWith(videoId));
            const parts = videoFile.split('_');
            const maskedVideoFile = parts[0];
            const resolution = parts[1];
            const datePart = parts[2].split('.')[0];
            const currentDate = new Date();
            const videoDate = parseDateFromString(datePart);
            const dateDifference = currentDate - videoDate;
            const daysRemaining = calculateRemainingTime(dateDifference);

            if (daysRemaining === '0:00:00') {
              unlink(`${RNFS.CachesDirectoryPath}/${videoFile}`)
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
              id: videoId,
              maskedVideoFile,
              videoFile,
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
      <View style={styles.videoItemContainer}>
        <Pressable
          style={styles.videoDownloadItem}
          onPress={() => handleVideoPress(item.videoFile)}>
          <Text style={[CTAStyles.text_light, styles.fileName]}>
            {item.maskedVideoFile}
          </Text>
          <Text style={[CTAStyles.text_light, styles.fileInfo]}>
            {item.resolution}, {item.timeRemaining} remaining
          </Text>
        </Pressable>
        <Pressable
          style={styles.wrapper}
          onPress={() => handleDeleteFile(item.videoFile)}>
          <Icon name={'trash'} color="white" size={20} />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryName}>OFFLINE VIDEOS</Text>
        </View>
        <Text style={[CTAStyles.text_light, styles.description]}>
          These are the video files previously downloaded to this device. They
          are available 30 days from the original download time.
        </Text>
        {downloadedFiles.toString() === '' ? (
          <Text style={styles.categoryName}>
            No downloaded files available.
          </Text>
        ) : (
          <FlatList
            data={downloadedFiles}
            showsVerticalScrollIndicator={true}
            indicatorStyle={'white'}
            keyExtractor={item => item.id.toString()}
            renderItem={renderVideoItem}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'transparent',
    height: '100%',
    width: '100%',
    padding: 10,
  },
  container: {
    flex: 1,
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
  description: {
    marginBottom: 20,
  },
  fileName: {
    marginTop: 10,
    marginRight: 10,
    marginLeft: 10,
  },
  fileInfo: {
    fontSize: 10,
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 10,
  },
  videoItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    marginBottom: 8,
  },
  videoDownloadItem: {
    flex: 1,
  },
  wrapper: {
    backgroundColor: '#d11a2a',
    padding: 15,
    alignItems: 'center',
  },
});

export default VideoDownloadsScreen;
