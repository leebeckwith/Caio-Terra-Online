import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useDispatch} from 'react-redux';
import {setLoading} from '../loader/loadingSlice';

interface VideoData {
  id: number;
  vimeoid: number;
  title: string;
  thumburl: string;
  link: string;
}

// @ts-ignore
const VideoListing = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<VideoData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        dispatch(setLoading(true));
        await delay(5000);
        //Make the API call and get the videos data
        const response = await fetch(
          'https://caioterra.com/app-api/get-videos.php',
        );
        const data = await response.json();

        // Assuming the API response is an array of videos
        setVideos(data);
        // You can also set the filteredVideos state to initially show all videos
        setFilteredVideos(data);
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
        <TouchableOpacity onPress={() => handleVideoPress(item.vimeoid)}>
          <Image source={{uri: item.thumburl}} style={styles.thumbnail} />
        </TouchableOpacity>
        <View style={styles.wrapper}>
          <Text style={styles.title}>{item.title}</Text>
          <Icon name="star-o" color="white" size={20} style={styles.icons} />
        </View>
      </View>
    );
  });

  return (
    <View style={styles.container}>
      {filteredVideos.length > 0 ? (
        <View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search videos..."
            placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
            onChangeText={handleSearch}
            value={searchTerm}
          />
          <FlatList
            data={filteredVideos}
            renderItem={({item}) => <VideoItem item={item} />} // Use the VideoItem component
            keyExtractor={item => item.id.toString()}
          />
        </View>
      ) : (
        <Text>No videos found.</Text>
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
});

export default VideoListing;
