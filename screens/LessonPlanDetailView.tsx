import React, {useState, useEffect} from 'react';
import {
  Alert,
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import {useVideoModal} from '../components/VideoPlayerModalContext';
import {useSelector} from 'react-redux';
import {getCredentials} from '../storage';
import SInfo from 'react-native-sensitive-info';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useRoute, useNavigation} from '@react-navigation/native';

interface LessonData {
  id: number;
  vimeoid: number;
  title: string;
  thumburl: string;
  lesson_types: {term_id: number; name: string}[];
  lesson_techniques: {term_id: number; name: string}[];
  lesson_positions: {term_id: number; name: string}[];
}

const LessonPlanDetailView: React.FC = () => {
  const route = useRoute();
  const {params} = route;
  const {videoId} = params || {};
  const cachedLessonVideosData = useSelector(state => state.cachedLessonVideos);
  const {openVideoModal} = useVideoModal();
  const navigation = useNavigation();

  const categorizeLessonsByField = (lessons: LessonData[], field: string) => {
    const categorizedLessons: Record<string, LessonData[]> = {};

    lessons.forEach(lesson => {
      lesson[field].forEach(category => {
        const termKey = `${category.term_id}-${category.name.toLowerCase()}`;
        console.log(field + ': ' + termKey);
        if (!categorizedLessons[termKey]) {
          categorizedLessons[termKey] = [];
        }
        categorizedLessons[termKey].push(lesson);
      });
    });

    return categorizedLessons;
  };

  useEffect(() => {
    // const fetchVideos = async () => {
    //   try {
    //   } catch (error) {
    //     console.error('Error fetching videos:', error);
    //     Alert.alert(
    //       'Error',
    //       `There was an error getting the lesson plans: ${error}`,
    //     );
    //   } finally {
    //
    //   }
    // };

    //fetchVideos();
  }, []);

  // const renderLessonItem = (item: {item: LessonData}) => {
  //   const {id, vimeoid, thumburl} = item.item;
  //
  //   return (
  //     <Pressable>
  //       <View style={styles.videoItemContainer}>
  //         <Pressable onPress={() => handleVideoPress(vimeoid, id)}>
  //           <Image source={{uri: thumburl}} style={styles.thumbnail} />
  //         </Pressable>
  //         <Text style={styles.videoTitle}>{id}</Text>
  //       </View>
  //     </Pressable>
  //   );
  // };

  // const handleSearch = (text: string) => {
  //   const filtered = videos.filter(video =>
  //     video.title.toLowerCase().includes(text.toLowerCase()),
  //   );
  //   setSearchTerm(text);
  //   setMappedVideos([]);
  //   setFilteredVideos(filtered);
  //   if (filtered.length > 0 && flatListRef.current) {
  //     flatListRef.current.scrollToIndex({index: 0});
  //   }
  // };

  const handleVideoPress = async (vimeoId: number, videoId: number) => {
    const {user_id} = await getCredentials();
    const CTAVimeoKey = await SInfo.getItem('cta-vimeo-key', {});
    openVideoModal(vimeoId, CTAVimeoKey, user_id, videoId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.customHeader}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()} // Go back when the button is pressed
        >
          <Icon name="arrow-left" size={20} color="white" style={styles.icon} />
          <Text style={styles.headerTitle}>Lesson Plan {videoId} Details</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    height: 40,
    marginRight: 8,
    paddingHorizontal: 10,
    width: '100%',
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
    marginRight: 10,
    marginTop: 10,
    width: 165,
  },
  thumbnail: {
    width: 160,
    aspectRatio: 16 / 9,
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
    paddingVertical: 10,
    backgroundColor: '#000',
  },
  backButton: {
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  categoryContainer: {
    backgroundColor: '#00a6ff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  categoryTitle: {
    color: '#fff',
    fontSize: 16,
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
    height: 'auto',
    marginBottom: 10,
  },
  categoryName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  icon: {
    marginRight: 5,
  },
});

export default LessonPlanDetailView;
