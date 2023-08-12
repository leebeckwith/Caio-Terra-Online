import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useDispatch} from 'react-redux';
import {setLoading} from '../redux/loadingSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getCredentials} from '../storage';

interface VideoData {
  id: number;
  vimeoid: number;
  title: string;
  thumburl: string;
  link: string;
  favorite: boolean;
}

// @ts-ignore
const VideoListing = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<VideoData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [showFavoritesButton, setShowFavoritesButton] =
    useState<boolean>(false);
  const [showFavoritesFilter, setShowFavoritesFilter] =
    useState<boolean>(false);
  const [toggle, setToggle] = useState(false);

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
        dispatch(setLoading(true));
        const cachedVideos = await AsyncStorage.getItem('cachedVideos');
        //Make the API call and get the videos data
        if (cachedVideos) {
          const cachedData = JSON.parse(cachedVideos);
          setVideos(cachedData);
          setFilteredVideos(cachedData);
          console.log('Cached video data used');
        } else {
          // Make the API call and get the videos data
          const response = await fetch(
            'https://caioterra.com/app-api/get-videos.php',
          );
          const data = await response.json();

          setVideos(data);
          setFilteredVideos(data);

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
              const favoriteIds = favoritesData.map(item => item.id);

              const updatedData = data.map(video =>
                favoriteIds.includes(video.id.toString())
                  ? {...video, favorite: true}
                  : video,
              );

              setVideos(updatedData);
              setFilteredVideos(updatedData);
              await AsyncStorage.setItem(
                'cachedVideos',
                JSON.stringify(updatedData),
              );
              console.log('Fresh video data fetched');
            }
          }
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        dispatch(setLoading(false));
      }
    };
    // Call the fetchVideos function when the component mounts
    fetchVideos();
    return () => {
      // this now gets called when the component unmounts
    };
  }, []);

  const handleVideoPress = async (vimeoId: number) => {
    // CTA App Vimeo Bearer token
    const vimeoToken = '91657ec3585779ea01b973f69aae2c9c';

    // @ts-ignore Because this navigation resolves fine with the props sent
    navigation.navigate('Player', {
      vimeoId,
      vimeoToken,
    });
  };

  const handleFavoritePress = async (id: number) => {
    try {
      const updatedVideos = videos.map(video =>
        video.id === id ? {...video, favorite: !video.favorite} : video,
      );

      setVideos(updatedVideos);
      setFilteredVideos(updatedVideos);

      const video = updatedVideos.find(video => video.id === id);
      const newFavoriteStatus = video?.favorite ? 1 : 0;

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
          // Update cached data with new favorite status
          const updatedCachedData = updatedVideos.map(video =>
            video.id === id ? {...video, favorite: !video.favorite} : video,
          );
          await AsyncStorage.setItem(
            'cachedVideos',
            JSON.stringify(updatedCachedData),
          );
        }
      }
    } catch (error) {
      console.error('Error toggling favorite status:', error);
    } finally {
      // ... (existing logic)
    }
  };

  const showFavorites = () => {
    setShowFavoritesFilter(prevState => !prevState);
    // Toggle the filter based on the current state
    setFilteredVideos(prevFilteredVideos =>
      showFavoritesFilter
        ? videos
        : prevFilteredVideos.filter(video => video.favorite),
    );
  };

  const navigateToOther = () => {
    // @ts-ignore
    navigation.navigate('Favorites', {cachedVideos: videos});
  };

  const handleSearch = (text: string) => {
    // Filter videos based on the search term
    const filtered = videos.filter(video =>
      video.title.toLowerCase().includes(text.toLowerCase()),
    );
    setSearchTerm(text);
    setFilteredVideos(filtered);
  };

  const VideoItem: React.FC<{item: VideoData}> = React.memo(({item}) => {
    return (
      <View style={styles.videoItemContainer}>
        <Pressable onPress={() => handleVideoPress(item.vimeoid)}>
          <Image source={{uri: item.thumburl}} style={styles.thumbnail} />
        </Pressable>
        <View style={styles.wrapper}>
          <Text style={styles.title}>{item.title}</Text>
          {showFavoritesButton && (
            <TouchableOpacity
              style={[styles.iconButton, styles.icons]}
              onPress={() => handleFavoritePress(item.id)}>
              <Icon
                name={item.favorite ? 'star' : 'star-o'}
                color="white"
                size={20}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  });

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search videos..."
        placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
        onChangeText={handleSearch}
        value={searchTerm}
      />
      {showFavoritesButton && (
        <View style={styles.buttonContainer}>
          <Pressable
            onPress={showFavorites}
            style={[styles.button, showFavoritesFilter ? styles.active : null]}>
            <View style={styles.buttonContent}>
              <Icon name="star" color="#fff" size={18} style={styles.icon} />
              <Text style={styles.buttonText}>Favorites</Text>
            </View>
          </Pressable>
          {/*<Pressable onPress={navigateToOther} style={styles.button}>*/}
          {/*  <Text style={styles.buttonText}>New Button</Text>*/}
          {/*</Pressable>*/}
        </View>
      )}
      {filteredVideos.length > 0 ? (
        <FlatList
          data={filteredVideos}
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
    padding: 10,
  },
  searchInput: {
    height: 40,
    color: '#050505',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  videoItemContainer: {
    marginBottom: 20,
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
    borderRadius: 5,
  },
  wrapper: {
    flexDirection: 'row',
  },
  icons: {
    textAlign: 'right',
    width: '5%',
    marginTop: 8,
    display: 'flex',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginLeft: -2.5,
    marginRight: -2.5,
  },
  button: {
    flex: 1,
    backgroundColor: '#555',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 2.5,
  },
  active: {
    backgroundColor: '#00a6ff',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  icon: {
    marginRight: 8,
  },
  iconButton: {
    backgroundColor: 'transparent',
  },
});

export default VideoListing;