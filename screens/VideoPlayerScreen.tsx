import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  FlatList,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from '../components/Loader';
import {useFavorites} from '../components/FavoriteContext';
import {getCredentials, toggleFavoriteInCache} from '../storage';

interface VideoNote {
  id: number;
  note_playback_timestamp: number;
  note_text: string;
  user_id: number;
  video_id: number;
}

const VideoPlayer = ({route}: {route: any}) => {
  const {vimeoId, vimeoToken, userId, videoId} = route.params
    ? route.params
    : '';
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const [notes, setNotes] = useState<VideoNote[]>([]);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [noteContent, setNoteContent] = useState('');
  const [showAdditionalContent, setShowAdditionalContent] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const playerRef = useRef(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const {favorites, toggleFavorite} = useFavorites();

  const fetchVideoNotes = async () => {
    try {
      const response = await fetch(
        `https://caioterra.com/app-api/get-video-notes.php?user_id=${userId}&video_id=${videoId}`,
      );
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching video notes:', error);
    }
  };

  const getVimeoVideo = async () => {
    try {
      // Construct the Vimeo API URL for the specific video
      const vimeoApiUrl = `https://api.vimeo.com/videos/${vimeoId}`;

      // Fetch the video data from the Vimeo API
      const response = await fetch(vimeoApiUrl, {
        headers: {
          Authorization: `Bearer ${vimeoToken}`,
        },
      });

      // Parse the response and get the video data
      const videoData = await response.json();

      // Set the video data
      setSelectedTitle(videoData.name);
      setSelectedVideo(videoData.files[3].link);
    } catch (error) {
      console.error('Error fetching video from Vimeo API:', error);
      setSelectedVideo(null);
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
    }
  };

  useEffect(() => {
    getVimeoVideo();
    fetchVideoNotes();
    getFavoriteStatus();
  }, []);

  const handleNoteSubmit = async () => {
    const formattedUserId = Number(userId);
    const formattedVideoId = Number(videoId);
    //const encodedNoteContent = encodeURIComponent(noteContent);
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
          await toggleFavoriteInCache(videoId);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite status:', error);
    }
  };

  const handleSeekToTimestamp = timestamp => {
    playerRef.current.seek(Number(timestamp));
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
    }
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
        <Pressable style={styles.button} onPress={() => handleSeekToTimestamp(item.note_playback_timestamp)}>
          <Text style={styles.noteTimestamp}>
            {formatTime(item.note_playback_timestamp)}
          </Text>
        </Pressable>
        <Pressable style={[styles.inlineButton]}>
          <Text style={styles.noteContent}>{item.note_text}</Text>
        </Pressable>
        <View style={styles.deleteButtonContainer}>
          <Pressable
            onPress={() => handleDeleteNote(item.id)}
            style={[styles.button, styles.delete]}>
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
    <View style={styles.container}>
      {selectedVideo ? (
        <View>
          <Text style={styles.title}>{selectedTitle}</Text>
          <View>
            <Video
              ref={playerRef}
              source={{uri: selectedVideo}}
              style={styles.videoPlayer}
              resizeMode="contain"
              controls={true}
              paused={isPaused}
              onProgress={onProgress}
            />
            <View style={styles.wrapper}>
              <View style={[styles.iconsLeft, styles.iconContainer]}>
                <Pressable style={[styles.button, styles.inactive]}>
                  <Icon
                    name="download"
                    color="white"
                    size={20}
                    style={styles.iconsLeft}
                  />
                </Pressable>
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
          </View>
          <View>
            <TextInput
              placeholder={`Add note at ${formatTime(currentTime)}`}
              placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
              value={noteContent}
              onChangeText={setNoteContent}
              style={styles.noteInput}
            />
            <Pressable
              onPress={handleNoteSubmit}
              disabled={!noteContent}
              style={[
                styles.button,
                styles.noteButton,
                noteContent ? styles.active : styles.inactive,
              ]}>
              <Text style={styles.noteButtonText}>Add Note</Text>
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
      ) : (
        <Loader />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 10,
    height: 600,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  text: {
    color: '#fff',
  },
  videoPlayer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
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
  inactive: {
    backgroundColor: '#555',
  },
  active: {
    backgroundColor: '#00a6ff',
  },
  delete: {
    backgroundColor: '#d11a2a',
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
    backgroundColor: '#fff',
    height: 40,
    color: '#050505',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  noteButton: {
    marginBottom: 10,
    marginHorizontal: 0,
  },
  noteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  noteTimestamp: {
    color: '#00a6ff',
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
    marginBottom: 20,
  },
});

export default VideoPlayer;
