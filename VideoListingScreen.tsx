import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import {useNavigation} from '@react-navigation/native';

interface VideoData {
  id: number;
  vimeoid: number;
  title: string;
  thumburl: string;
  link: string;
}

const VideoListing: React.FC = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<VideoData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    // Your code to fetch the videos and set the state goes here
    // For example, if you're fetching videos from an API, you can do something like this:
    const fetchVideos = async () => {
      try {
        // Make the API call and get the videos data
        const response = await fetch('https://caioterra.com/app-api/get-videos.php');
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

  const handleVideoPress = async (vimeoId: number) => {
    // CTA App Vimeo Bearer token
    const vimeoToken = '91657ec3585779ea01b973f69aae2c9c';

    // @ts-ignore Because this navigation resolves fine with the props sent
    navigation.navigate('VideoPlayer', {
      vimeoId,
      vimeoToken,
    });
  };

  const handleSearch = (text: string) => {
    // Filter videos based on the search term
    const filtered = videos.filter((video) =>
        video.title.toLowerCase().includes(text.toLowerCase())
    );
    setSearchTerm(text);
    setFilteredVideos(filtered);
  };

  const renderVideoItem = ({ item }: { item: VideoData }) => {

    return (
        <View style={styles.videoItemContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <TouchableOpacity onPress={() => handleVideoPress(item.vimeoid)}>
            <Image source={{ uri: item.thumburl }} style={styles.thumbnail} />
          </TouchableOpacity>
        </View>
    );
  };

  return (
      <View style={styles.container}>
        <TextInput
            style={styles.searchInput}
            placeholder="Search videos..."
            placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
            onChangeText={handleSearch}
            value={searchTerm}
        />
        <FlatList
            data={filteredVideos}
            renderItem={renderVideoItem}
            keyExtractor={(item) => item.id.toString()}
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
    color: "#fff",
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  thumbnail: {
    width: '100%',
    height: 200,
  },
});

export default VideoListing;
