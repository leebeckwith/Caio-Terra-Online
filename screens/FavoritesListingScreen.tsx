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

interface VideoData {
  id: number;
}

const VideoListing: React.FC = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<VideoData[]>([]);

  useEffect(() => {
    // Your code to fetch the videos and set the state goes here
    // For example, if you're fetching videos from an API, you can do something like this:
    const fetchVideos = async () => {
      try {
        const params = new URLSearchParams({
          username: 'testbronze2',
          password: 'Bjj101',
        });
        // Make the API call and get the videos data
        const apiUrl =
          'https://caioterra.com/app-api/get-favorites.php?' +
          params.toString();
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Assuming the API response is an array of videos
        setVideos(data);

        // You can also set the filteredVideos state to initially show all videos
        setFilteredVideos(data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    // Call the fetchVideos function when the component mounts
    fetchVideos();
  }, []);

  const renderVideoItem = ({item}: {item: VideoData}) => {
    return (
      <View style={styles.videoItemContainer}>
        <View style={styles.wrapper}>
          <Text style={styles.title}>{item.id}</Text>
          <Icon
            name="star-o"
            color="white"
            size={20}
            //onPress={() => setVisibility(!visible)}
            style={styles.icons}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredVideos}
        renderItem={renderVideoItem}
        keyExtractor={item => item.id.toString()}
      />
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
