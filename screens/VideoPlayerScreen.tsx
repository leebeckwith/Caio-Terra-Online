import React, {useState, useEffect} from 'react';
import {
  Alert,
  View,
  StyleSheet,
  Text,
  TextInput,
  Platform,
  Pressable,
  FlatList,
} from 'react-native';
import Orientation, {
  useDeviceOrientationChange,
} from 'react-native-orientation-locker';
import Video from 'react-native-video';
import RNFS from 'react-native-fs';
import VideoDownloadModal from '../components/VideoDownloadModal';
import VideoPlaybackRateModal from '../components/VideoPlaybackRateModal';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from '../components/Loader';
import {useFavorites} from '../components/FavoriteContext';
import {getCredentials} from '../storage';
import CTAStyles from '../styles/styles';

interface VideoNote {
  id: number;
  note_playback_timestamp: number;
  note_text: string;
  user_id: number;
  video_id: number;
}

const VideoPlayer = ({route}: {route: any}) => {
  const {vimeoId, vimeoToken, userId, videoId, videoPath} = route.params
    ? route.params
    : '';
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(
    videoId,
  );
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const [selectedPlaybackRate, setSelectedPlaybackRate] = useState<number>(1);
  const [notes, setNotes] = useState<VideoNote[]>([]);
  const [noteContent, setNoteContent] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDownloadModalVisible, setIsDownloadModalVisible] = useState(false);
  const [isPlaybackRateModalVisible, setIsPlaybackRateModalVisible] =
    useState(false);
  const [currentOrientation, setCurrentOrientation] = useState<string>(
    Orientation.getInitialOrientation(),
  );
  const [isLandscape, setIsLandscape] = useState(false);
  const {toggleFavorite} = useFavorites();

  // useDeviceOrientationChange(o => {
  //   setCurrentOrientation(o);
  //   if (o === 'LANDSCAPE-RIGHT' || o === 'LANDSCAPE-LEFT') {
  //     console.log('full screen video');
  //     setIsLandscape(true);
  //   } else {
  //     setIsLandscape(false);
  //   }
  // });

  useEffect(() => {
    const setVideoFromPath = async () => {
      const videoFile = `${RNFS.CachesDirectoryPath}/${videoPath}`;
      setSelectedVideo(videoFile);
    };
    const getVimeoVideo = async () => {
      try {
        const vimeoApiUrl = `https://api.vimeo.com/videos/${vimeoId}`;
        const response = await fetch(vimeoApiUrl, {
          headers: {
            Authorization: `Bearer ${vimeoToken}`,
          },
        });

        const videoData = await response.json();

        setSelectedTitle(videoData.name);
        setSelectedVideo(videoData.play.hls.link);
      } catch (error) {
        console.error('Error fetching video from Vimeo API:', error);
        Alert.alert(
          'Error',
          `There was an error getting the video from Vimeo: ${error}`,
        );
        setSelectedVideo(null);
      }
    };

    const fetchVideoNotes = async () => {
      try {
        const response = await fetch(
          `https://caioterra.com/app-api/get-video-notes.php?user_id=${userId}&video_id=${selectedVideoId}`,
        );
        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error('Error fetching video notes:', error);
        Alert.alert(
          'Error',
          `There was an error getting the notes for this video: ${error}`,
        );
      }
    };

    const getFavoriteStatus = async () => {
      try {
        const {username, password} = await getCredentials();
        if (username && password) {
          const params = new URLSearchParams({
            username,
            password,
          });

          const apiUrl =
            'https://caioterra.com/app-api/get-favorites.php?' +
            params.toString();
          const favoritesResponse = await fetch(apiUrl);
          const favoritesData = await favoritesResponse.json();

          if (Array.isArray(favoritesData)) {
            const favoriteIds = favoritesData.map(item => Number(item.id));
            const isVideoFavorite = favoriteIds.includes(videoId);
            setIsFavorite(isVideoFavorite);
          }
        }
      } catch (error) {
        console.error('Error fetching favorite status:', error);
        Alert.alert(
          'Error',
          `There was an error getting the favorite status: ${error}`,
        );
      }
    };
    //setCurrentOrientation(Orientation.getInitialOrientation());
    if (videoPath) {
      setVideoFromPath();
    } else {
      getVimeoVideo();
      fetchVideoNotes();
      getFavoriteStatus();
    }
  }, []);

  const handleNoteSubmit = async () => {
    const formattedUserId = Number(userId);
    const formattedVideoId = Number(videoId);
    const formattedTimestamp = Number(formatTimeForSubmission(currentTime));
    const newNote = {
      id: 0,
      note_playback_timestamp: formattedTimestamp,
      note_text: noteContent,
      user_id: formattedUserId,
      video_id: formattedVideoId,
    };

    try {
      const apiUrl = `https://caioterra.com/app-api/add-video-note.php?user_id=${formattedUserId}&video_id=${formattedVideoId}&note_text=${noteContent}&note_playback_timestamp=${formattedTimestamp}`;
      const response = await fetch(apiUrl, {
        method: 'GET',
      });
      const data = await response.json();

      if (data.id) {
        newNote.id = data.id;
        notes.push(newNote);
        notes.sort((a, b) => b.id - a.id);
        setNotes([...notes]);
        setNoteContent('');
      }
    } catch (error) {
      console.error('Error adding video note:', error);
      Alert.alert('Error', `There was an error adding the note: ${error}`);
    }
  };

  const handleFavoritePress = async () => {
    try {
      const newFavoriteStatus = Number(!isFavorite);
      const {username, password} = await getCredentials();

      if (username && password) {
        const params = new URLSearchParams({
          username,
          password,
        });

        const apiStr =
          `https://caioterra.com/app-api/set-favorite.php?post_id=${videoId}&is_fav=${newFavoriteStatus}&` +
          params.toString();
        const response = await fetch(apiStr);
        if (response.ok) {
          toggleFavorite(videoId);
          setIsFavorite(!isFavorite);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite status:', error);
      Alert.alert(
        'Error',
        `There was an error toggling favorite status: ${error}`,
      );
    }
  };

  const handleSeekToTimestamp = timestamp => {
    this.player.seek(Number(timestamp));
    setIsPaused(true);
  };

  const handleDeleteNote = async (noteId: number) => {
    try {
      const response = await fetch(
        `https://caioterra.com/app-api/remove-video-note.php?note_id=${noteId}`,
        {
          method: 'GET',
        },
      );
      const data = await response.json();
      if (data.status === 'ok') {
        const updatedNotes = notes.filter((note: any) => note.id !== noteId);
        setNotes(updatedNotes);
      }
    } catch (error) {
      console.error('Error deleting video note:', error);
      Alert.alert('Error', `There was an error deleting the note: ${error}`);
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    setSelectedPlaybackRate(rate);
    setIsPaused(true);
  };

  const openDownloadModal = () => {
    setIsPaused(true);
    setIsDownloadModalVisible(true);
  };

  const openPlaybackRateModal = () => {
    setIsPaused(true);
    setIsPlaybackRateModalVisible(true);
  };

  const formatTime = timeInSeconds => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 59.95);

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const formatTimeForSubmission = timeInSeconds => {
    return Math.floor(timeInSeconds);
  };

  const onProgress = data => {
    setCurrentTime(data.currentTime);
  };

  const NoteItem: React.FC<{item: VideoNote}> = React.memo(({item}) => {
    return (
      <View style={styles.noteItem}>
        <Pressable
          style={styles.button}
          onPress={() => handleSeekToTimestamp(item.note_playback_timestamp)}>
          <Text style={CTAStyles.text_link}>
            {formatTime(item.note_playback_timestamp)}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.inlineButton]}
          onPress={() => handleSeekToTimestamp(item.note_playback_timestamp)}>
          <Text style={styles.noteContent}>{item.note_text}</Text>
        </Pressable>
        <View style={styles.deleteButtonContainer}>
          <Pressable
            onPress={() => handleDeleteNote(item.id)}
            style={[styles.button, CTAStyles.delete]}>
            <Icon
              name="trash"
              color="white"
              size={20}
              style={styles.iconsRight}
            />
          </Pressable>
        </View>
      </View>
    );
  });

  return (
    <View
      style={[
        CTAStyles.container,
        videoPath ? styles.containerOffline : styles.container,
      ]}>
      {isDownloadModalVisible && (
        <VideoDownloadModal
          isVisible={isDownloadModalVisible}
          onClose={() => setIsDownloadModalVisible(false)}
          vimeoId={vimeoId}
        />
      )}
      {isPlaybackRateModalVisible && (
        <VideoPlaybackRateModal
          isVisible={isPlaybackRateModalVisible}
          onClose={() => setIsPlaybackRateModalVisible(false)}
          playbackRate={selectedPlaybackRate}
          onPlaybackRateChange={handlePlaybackRateChange}
        />
      )}
      {selectedVideo ? (
        <View>
          {!videoPath && <Text style={styles.title}>{selectedTitle}</Text>}
          <View>
            <View>
              <Video
                ref={ref => {
                  this.player = ref;
                }}
                source={{uri: selectedVideo}}
                style={styles.videoPlayer}
                resizeMode="contain"
                controls={true}
                paused={isPaused}
                onProgress={onProgress}
                rate={selectedPlaybackRate}
              />
            </View>
            {!videoPath && (
              <View style={styles.wrapper}>
                <View style={[styles.iconsLeft, styles.iconContainer]}>
                  <Pressable
                    style={[styles.button, CTAStyles.inactive]}
                    onPress={openDownloadModal}>
                    <Icon
                      name="download"
                      color="white"
                      size={20}
                      style={styles.iconsLeft}
                    />
                  </Pressable>
                  {Platform.OS === 'android' && (
                    <Pressable
                      style={[styles.button, CTAStyles.inactive]}
                      onPress={openPlaybackRateModal}>
                      <View style={styles.playbackRateContainer}>
                        <Icon
                          name="clock-o"
                          color="white"
                          size={20}
                          style={styles.iconsLeft}
                        />
                        <Text style={[CTAStyles.text_light, styles.iconToLeft]}>
                          {selectedPlaybackRate.toFixed(2)}
                        </Text>
                      </View>
                    </Pressable>
                  )}
                </View>
                <Pressable style={styles.button} onPress={handleFavoritePress}>
                  <Icon
                    name={isFavorite ? 'star' : 'star-o'}
                    color="white"
                    size={20}
                    style={styles.iconsRight}
                  />
                </Pressable>
              </View>
            )}
          </View>
          {!videoPath && (
            <View>
              <View>
                <TextInput
                  placeholder={`Add note at ${formatTime(currentTime)}`}
                  placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                  value={noteContent}
                  onChangeText={setNoteContent}
                  style={[CTAStyles.cta_input, styles.noteInput]}
                />
                <Pressable
                  onPress={handleNoteSubmit}
                  disabled={!noteContent}
                  style={[
                    styles.button,
                    styles.noteButton,
                    noteContent ? CTAStyles.active : CTAStyles.inactive,
                  ]}>
                  <Text style={styles.noteButtonText}>ADD NOTE</Text>
                </Pressable>
              </View>
              <FlatList
                style={styles.notesListContainer}
                data={notes.sort((a, b) => b.id - a.id)}
                keyExtractor={(item, id) => id.toString()}
                showsVerticalScrollIndicator={true}
                indicatorStyle={'white'}
                renderItem={({item}) => <NoteItem item={item} />}
              />
            </View>
          )}
        </View>
      ) : (
        !videoPath && <Loader />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    maxHeight: '100%',
    minHeight: 600,
    borderColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  containerOffline: {
    padding: 20,
    borderColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  videoPlayer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },
  noCap: {
    borderColor: '#555',
    borderWidth: 1,
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
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
  button: {
    padding: 11,
    marginHorizontal: 2.5,
    alignItems: 'center',
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#000',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noteInput: {
    height: 40,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  noteButton: {
    marginBottom: 10,
    marginHorizontal: 0,
  },
  noteButtonText: {
    color: '#fff',
    marginLeft: 10,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  inlineButton: {
    flex: 1,
  },
  noteContent: {
    color: '#fff',
    padding: 10,
  },
  deleteButtonContainer: {
    flexDirection: 'row',
    height: '100%',
  },
  notesListContainer: {
    height: 160,
  },
  playbackRateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconToLeft: {
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default VideoPlayer;
