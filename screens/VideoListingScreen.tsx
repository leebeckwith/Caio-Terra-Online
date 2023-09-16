import React, {useState, useEffect} from 'react';
import {
  Alert,
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  TextInput,
  StyleSheet,
} from 'react-native';
import {useVideoModal} from '../components/VideoPlayerModalContext';
import {useFavorites} from '../components/FavoriteContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useDispatch, useSelector} from 'react-redux';
import {setLoading} from '../redux/loadingSlice';
import {setCachedVideos} from '../redux/cachedVideoSlice';
import {getCredentials} from '../storage';

interface VideoData {
  id: number;
  vimeoid: number;
  title: string;
  thumburl: string;
  link: string;
  favorite: boolean;
  video_types: {term_id: number; name: string}[];
  video_positions: {term_id: number; name: string}[];
  video_techniques: {term_id: number; name: string}[];
}

const VideoListing = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<VideoData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavoritesButton, setShowFavoritesButton] =
    useState<boolean>(false);
  const [showFavoritesFilter, setShowFavoritesFilter] =
    useState<boolean>(false);
  const cachedVideosData = useSelector(state => state.cachedVideos);
  const dispatch = useDispatch();
  const {favorites, toggleFavorite} = useFavorites();
  const {openVideoModal} = useVideoModal();

  useEffect(() => {
    const checkCredentials = async () => {
      const {username, password} = await getCredentials();
      setShowFavoritesButton(!!username && !!password);
    };

    checkCredentials();
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        if (cachedVideosData && cachedVideosData.length > 0) {
          dispatch(setCachedVideos(cachedVideosData));
          setVideos(cachedVideosData);
          setFilteredVideos(cachedVideosData);
          console.log('vl: cached');
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
        Alert.alert(
          'Error',
          `There was an error getting the content: ${error}`,
        );
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchVideos();
  }, []);

  const handleVideoPress = async (vimeoId: number, videoId: number) => {
    const {user_id} = await getCredentials();
    // CTA App Vimeo Bearer token
    const vimeoToken = '91657ec3585779ea01b973f69aae2c9c';
    openVideoModal(vimeoId, vimeoToken, user_id, videoId);
  };

  const handleFavoritePress = async (id: number) => {
    try {
      const newFavoriteStatus = favorites?.includes(id) ? 0 : 1;
      const {username, password} = await getCredentials();

      if (username && password) {
        const params = new URLSearchParams({
          username,
          password,
        });

        const apiStr =
          `https://caioterra.com/app-api/set-favorite.php?post_id=${id}&is_fav=${newFavoriteStatus}&` +
          params.toString();
        const response = await fetch(apiStr);

        if (response.ok) {
          toggleFavorite(id);
          const updatedVideos = videos.map(video =>
            video.id === id ? {...video, favorite: !video.favorite} : video,
          );
          dispatch(setCachedVideos(updatedVideos));
          setVideos(updatedVideos);
          setFilteredVideos(updatedVideos);
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

  const showFavorites = () => {
    setShowFavoritesFilter(prevState => !prevState);
    setFilteredVideos(prevFilteredVideos =>
      showFavoritesFilter
        ? videos
        : prevFilteredVideos.filter(video => favorites.includes(video.id)),
    );
  };

  const handleSearch = (text: string) => {
    const filtered = videos.filter(video =>
      video.title.toLowerCase().includes(text.toLowerCase()),
    );
    setSearchTerm(text);
    setFilteredVideos(filtered);
  };

  const VideoItem: React.FC<{item: VideoData}> = React.memo(({item}) => {
    const isFavorite = favorites.includes(item.id);
    return (
      <View style={styles.videoItemContainer}>
        <Pressable onPress={() => handleVideoPress(item.vimeoid, item.id)}>
          <Image source={{uri: item.thumburl}} style={styles.thumbnail} />
          <Text style={styles.titleOverlay}>{item.title.toUpperCase()}</Text>
        </Pressable>
        <View style={styles.wrapper}>
          {showFavoritesButton && (
            <Pressable
              style={styles.iconButton}
              onPress={() => handleFavoritePress(item.id)}>
              <Icon
                name={isFavorite ? 'star' : 'star-o'}
                color="white"
                size={20}
              />
            </Pressable>
          )}
        </View>
      </View>
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={`Search ${filteredVideos.length} videos...`}
          placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
          onChangeText={handleSearch}
          autoCapitalize="none"
          value={searchTerm}
        />
        {showFavoritesButton && (
          <Pressable
            onPress={showFavorites}
            style={[styles.button, showFavoritesFilter ? styles.active : null]}>
            <View style={styles.buttonContent}>
              <Icon name="star" color="#fff" size={18} />
            </View>
          </Pressable>
        )}
      </View>
      {filteredVideos.length > 0 ? (
        <FlatList
          data={filteredVideos}
          showsVerticalScrollIndicator={true}
          indicatorStyle={'white'}
          renderItem={({item}) => (
            <VideoItem key={item.id.toString()} item={item} />
          )}
          keyExtractor={item => item.id.toString()}
        />
      ) : (
        <Text style={styles.title}>No videos found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#050505',
    backgroundColor: '#fff',
    marginBottom: 10,
    marginTop: 10,
    marginRight: 8,
    paddingHorizontal: 10,
  },
  videoItemContainer: {
    marginBottom: 8,
  },
  title: {
    width: '95%',
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 10,
  },
  thumbnail: {
    width: '100%',
    height: 200,
  },
  wrapper: {
    position: 'absolute',
    bottom: 5,
    right: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#555',
    padding: 11,
    marginHorizontal: 2.5,
  },
  flex: {
    flex: 1,
  },
  active: {
    backgroundColor: '#00a6ff',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  left: {
    marginLeft: 8,
  },
  iconButton: {
    backgroundColor: 'transparent',
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
    paddingRight: 32,
    textAlign: 'left',
  },
});

export default VideoListing;
