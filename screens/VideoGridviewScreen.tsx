import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useVideoModal} from '../components/VideoPlayerModalContext';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {getCachedVideos} from '../storage';

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

const VideoGridview: React.FC = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<VideoData[]>([]);
  const navigation = useNavigation();
  const [videoTypes, setVideoTypes] = useState<Record<string, VideoData[]>>({});
  const [videoPositions, setVideoPositions] = useState<
    Record<string, VideoData[]>
  >({});
  const [videoTechniques, setVideoTechniques] = useState<
    Record<string, VideoData[]>
  >({});
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const {openVideoModal} = useVideoModal();

  const handleVideoPress = (vimeoId: number) => {
    // CTA App Vimeo Bearer token
    const vimeoToken = '91657ec3585779ea01b973f69aae2c9c';
    openVideoModal(vimeoId, vimeoToken);
  };

  const categorizeVideosByField = (videos: VideoData[], field: string) => {
    const categorizedVideos: Record<string, VideoData[]> = {};

    videos.forEach(video => {
      video[field].forEach(category => {
        const termKey = `${category.term_id}-${category.name.toLowerCase()}`; // Combine term_id and lowercase name
        if (!categorizedVideos[termKey]) {
          console.log(termKey);
          categorizedVideos[termKey] = [];
        }
        categorizedVideos[termKey].push(video);
      });
    });

    return categorizedVideos;
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const cachedVideos = await getCachedVideos();
        console.log('Getting cached video data');

        if (cachedVideos && cachedVideos.length > 0) {
          console.log('Cached video data used');

          const categorizedByTypes: Record<string, VideoData[]> =
            categorizeVideosByField(cachedVideos, 'video_types');
          const categorizedByPositions: Record<string, VideoData[]> =
            categorizeVideosByField(cachedVideos, 'video_positions');
          const categorizedByTechniques: Record<string, VideoData[]> =
            categorizeVideosByField(cachedVideos, 'video_techniques');

          setVideoTypes(categorizedByTypes);
          setVideoPositions(categorizedByPositions);
          setVideoTechniques(categorizedByTechniques);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    // Call the fetchVideos function when the component mounts
    fetchVideos();
  }, []);

  const toggleCategory = (categoryKey: string) => {
    setExpandedCategory(prevCategoryKey =>
      prevCategoryKey === categoryKey ? null : categoryKey,
    );
  };

  const renderVideoItem = ({item}: {item: VideoData}) => {
    return (
      // <TouchableOpacity onPress={() => handleVideoPress(item.vimeoid)}>
      <TouchableOpacity>
        <View style={styles.videoItemContainer}>
          <Pressable onPress={() => handleVideoPress(item.vimeoid)}>
            <Image source={{uri: item.thumburl}} style={styles.thumbnail} />
          </Pressable>
          <Text style={styles.videoTitle}>{item.title.toUpperCase()}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCategory = (
    category: VideoData[],
    termId: string,
    categoryName: string,
  ) => {
    return (
      <View key={`category-${termId}-${categoryName}`}>
        <Text style={styles.headerTitle}>{categoryName}</Text>
        <FlatList
          data={category}
          renderItem={renderVideoItem}
          keyExtractor={item => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContainer}
        />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        onPress={() => toggleCategory('types')}
        style={styles.categoryHeader}>
        <Icon
          name={expandedCategory === 'types' ? 'minus' : 'plus'}
          size={18}
          color="white"
          style={styles.icon}
        />
        <Text style={styles.categoryName}>TYPES</Text>
      </TouchableOpacity>
      {expandedCategory === 'types' && (
        <ScrollView style={styles.categoryView}>
          {Object.keys(videoTypes).map(termId => (
            renderCategory(
              videoTypes[termId],
              termId,
              `${videoTypes[termId][0].video_types[0].name}`
            )
          ))}
        </ScrollView>
      )}

      <TouchableOpacity
        onPress={() => toggleCategory('positions')}
        style={styles.categoryHeader}>
        <Icon
          name={expandedCategory === 'positions' ? 'minus' : 'plus'}
          size={18}
          color="white"
          style={styles.icon}
        />
        <Text style={styles.categoryName}>POSITIONS</Text>
      </TouchableOpacity>
      {expandedCategory === 'positions' && (
        <ScrollView style={styles.categoryView}>
          {Object.keys(videoPositions).map(termId => (
            renderCategory(
              videoPositions[termId],
              termId,
              `${videoPositions[termId][0].video_positions[0].name}`
            )
          ))}
        </ScrollView>
      )}

      <TouchableOpacity
        onPress={() => toggleCategory('techniques')}
        style={styles.categoryHeader}>
        <Icon
          name={expandedCategory === 'techniques' ? 'minus' : 'plus'}
          size={18}
          color="white"
          style={styles.icon}
        />
        <Text style={styles.categoryName}>TECHNIQUES</Text>
      </TouchableOpacity>
      {expandedCategory === 'techniques' && (
        <ScrollView style={styles.categoryView}>
          {Object.keys(videoTechniques).map(termId => (
            renderCategory(
              videoTechniques[termId],
              termId,
              `${videoTechniques[termId][0].video_techniques[0].name}`
            )
          ))}
        </ScrollView>
      )}
    </ScrollView>
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
  title: {
    width: '95%',
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 10,
  },
  videoItemContainer: {
    marginRight: 10, // Add margin to create consistent spacing
    marginTop: 10,
    width: 165,
  },
  thumbnail: {
    width: 160, // Use percentage to ensure consistent width
    aspectRatio: 16 / 9, // Maintain a consistent aspect ratio
    height: 90,
  },
  videoTitle: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: 8,
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
    backgroundColor: '#000',
  },
  backButton: {
    position: 'absolute',
    left: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
  },
  categoryContainer: {
    backgroundColor: '#00a6ff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  categoryName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  carouselContainer: {
    paddingBottom: 10,
  },
  categoryHeader: {
    backgroundColor: '#00a6ff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
  },
  categoryView: {
    maxHeight: 565,
    minHeight: 300,
  },
  categoryName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 5,
  },
});

export default VideoGridview;
