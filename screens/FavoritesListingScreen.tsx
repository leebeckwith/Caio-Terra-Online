import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {getCredentials} from '../storage';

interface VideoData {
  id: number;
  vimeoid: number;
  title: string;
  thumburl: string;
  link: string;
}

const FavoritesListing: React.FC = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<VideoData[]>([]);
  //const [videoInfoData, setVideoInfoData] = useState<any[]>([]);
  const route = useRoute();
  // @ts-ignore
  const cachedVideos = route.params?.cachedVideos || [];
  const navigation = useNavigation();

  // const fetchVideoInfo = async (videoIds: number[]) => {
  //   try {
  //     const videoIdString = videoIds.join(',');
  //     const apiUrl = `https://caioterra.com/ct_get/get_videos_info/?video_ids=${videoIdString}`;
  //     const response = await fetch(apiUrl);
  //     const data = await response.json();
  //     return data;
  //   } catch (error) {
  //     console.error('Error fetching video info:', error);
  //     return [];
  //   }
  // };

  const handleVideoPress = async (vimeoId: number) => {
    // CTA App Vimeo Bearer token
    const vimeoToken = '91657ec3585779ea01b973f69aae2c9c';

    // @ts-ignore Because this navigation resolves fine with the props sent
    navigation.navigate('Player', {
      vimeoId,
      vimeoToken,
    });
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const {username, password} = await getCredentials();

        if (!username || !password) {
          console.error('Username and/or password not available.');
          return;
        }

        const params = new URLSearchParams({
          username,
          password,
        });

        const apiUrl =
          'https://caioterra.com/app-api/get-favorites.php?' +
          params.toString();

        const response = await fetch(apiUrl);
        const data = await response.json();

        setVideos(data);
        setFilteredVideos(data);

        // Extract video IDs from the favorites data
        //const videoIds = data.map(video => video.id);

      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    // Call the fetchVideos function when the component mounts
    fetchVideos();
  }, []);

  const renderVideoItem = ({item}: {item: VideoData}) => {
    const cachedVideo = cachedVideos.find(video => video.id === Number(item.id));

    return (
      <View style={styles.videoItemContainer}>
        <View style={styles.wrapper}>
          {cachedVideo ? (
            <View>
              <Text style={styles.title}>Cached ID: {cachedVideo.id}</Text>
              <TouchableOpacity onPress={() => handleVideoPress(cachedVideo.vimeoid)}>
                <Image source={{uri: cachedVideo.thumburl}} style={styles.thumbnail} />
              </TouchableOpacity>
              <View style={styles.wrapper}>
                <Text style={styles.title}>{cachedVideo.title}</Text>
              </View>
            </View>
          ) : (
            <View>
              <Text style={styles.title}>ID: {item.id}</Text>
              <TouchableOpacity onPress={() => handleVideoPress(item.vimeoid)}>
                <Image source={{uri: item.thumburl}} style={styles.thumbnail} />
              </TouchableOpacity>
              <View style={styles.wrapper}>
                <Text style={styles.title}>{item.title}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" color="#fff" size={20} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favorites</Text>
      </View>
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
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#000', // Set the background color of the header
  },
  backButton: {
    position: 'absolute',
    left: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FavoritesListing;
