import React, {useState, useEffect} from 'react';
import {View, Text, Image, TextInput, FlatList, StyleSheet} from 'react-native';

interface Video {
  id: number;
  title: string;
  content: string;
  link: string;
  thumbnail_url: string;
  image_full_url: string;
  video_techniques: Array<{term_id: number; name: string; slug: string}>;
  video_positions: Array<{term_id: number; name: string; slug: string}>;
  video_types: Array<{term_id: number; name: string; slug: string}>;
  last_modified: string;
}

const VideoListing: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Replace this with your actual API call to fetch the video data
    // For example, using fetch or axios
    const fetchVideoData = async () => {
      try {
        // Your API call here
        const response = await fetch(
          'https://caioterra.com/ct_get/ct_videos/?items=20&page=1',
        );
        const data = await response.json();

        // Assuming the API returns an array of videos
        setVideos(data);
        setFilteredVideos(data);
      } catch (error) {
        console.error('Error fetching video data:', error);
      }
    };

    fetchVideoData();
  }, []);

  // Filter the videos based on the search term
  useEffect(() => {
    const filtered = videos.filter(video =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredVideos(filtered);
  }, [searchTerm, videos]);

  // Render each video item
  const renderVideoItem = ({item}: {item: Video}) => {
    // Extract the video URL from the content using regex (assumes iframe tag is used)
    const regex = /src="([^"]+)"/;
    const match = item.content.match(regex);
    const videoUrl = match ? match[1] : '';

    return (
      <View style={styles.videoItemContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Image source={{uri: item.thumbnail_url}} style={styles.thumbnail} />
        <Text style={styles.title}>{videoUrl}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search videos..."
        onChangeText={setSearchTerm}
        value={searchTerm}
        style={styles.searchBar}
      />
      <FlatList
        data={filteredVideos}
        renderItem={renderVideoItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  listContainer: {
    padding: 10,
  },
  videoItemContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  thumbnail: {
    width: 200,
    height: 120,
    marginBottom: 10,
  },
  videoPlayer: {
    width: 320,
    height: 180,
  },
});

export default VideoListing;
