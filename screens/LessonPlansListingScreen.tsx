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
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

interface LessonData {
  id: number;
  vimeoid: number;
  title: string;
  thumburl: string;
  lesson_types: {term_id: number; name: string}[];
  lesson_techniques: {term_id: number; name: string}[];
  lesson_positions: {term_id: number; name: string}[];
}

const LessonPlansListing: React.FC = () => {
  const [lessonTypes, setLessonTypes] = useState<Record<string, LessonData[]>>({});
  const [lessonTechniques, setLessonTechniques] = useState<
    Record<string, LessonData[]>
  >({});
  const [lessonPositions, setLessonPositions] = useState<
    Record<string, LessonData[]>
  >({});
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const cachedLessonVideosData = useSelector(state => state.cachedLessonVideos);
  const navigation = useNavigation();

  const categorizeLessonsByField = (lessons: LessonData[], field: string) => {
    const categorizedLessons: Record<string, LessonData[]> = {};

    lessons.forEach(lesson => {
      lesson[field].forEach(category => {
        const termKey = `${category.term_id}-${category.name.toLowerCase()}`;
        if (!categorizedLessons[termKey]) {
          categorizedLessons[termKey] = [];
        }
        categorizedLessons[termKey].push(lesson);
      });
    });

    return categorizedLessons;
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        if (cachedLessonVideosData && cachedLessonVideosData.length > 0) {
          const categorizedByTypes: Record<string, LessonData[]> = categorizeLessonsByField(cachedLessonVideosData, 'lesson_types');
          const categorizedByTechniques: Record<string, LessonData[]> = categorizeLessonsByField(cachedLessonVideosData, 'lesson_techniques');
          const categorizedByPositions: Record<string, LessonData[]> = categorizeLessonsByField(cachedLessonVideosData, 'lesson_positions',);

          setLessonTypes(categorizedByTypes);
          setLessonTechniques(categorizedByTechniques);
          setLessonPositions(categorizedByPositions);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
        Alert.alert(
          'Error',
          `There was an error getting the lesson plans: ${error}`,
        );
      } finally {
        setExpandedCategory('lesson_types');
      }
    };

    fetchVideos();
  }, []);

  const toggleCategory = (categoryKey: string) => {
    setExpandedCategory(prevCategoryKey =>
      prevCategoryKey === categoryKey ? null : categoryKey,
    );
  };

  const renderLessonItem = (item: {item: LessonData}) => {
    const {id, thumburl, title} = item.item;

    return (
      <Pressable>
        <View style={styles.videoItemContainer}>
          <Pressable onPress={() => handleVideoPress(id, title)}>
            <Image source={{uri: thumburl}} style={styles.thumbnail} />
          </Pressable>
          <Text style={styles.videoTitle}>{title}</Text>
        </View>
      </Pressable>
    );
  };

  const renderCategory = (
    category: LessonData[],
    termId: string,
    categoryName: string,
  ) => {
    return (
      <View key={`category-${termId}-${categoryName}`}>
        <Text style={styles.headerTitle}>
          {termId.split('-').slice(1).join('-').toUpperCase()}
        </Text>
        <FlatList
          data={category}
          renderItem={renderLessonItem}
          keyExtractor={item => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={true}
          indicatorStyle={'white'}
          contentContainerStyle={styles.carouselContainer}
        />
      </View>
    );
  };

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

  const handleVideoPress = async (videoId: number, videoTitle: string) => {
    navigation.navigate('LessonDetails', {videoId, videoTitle});
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => toggleCategory('lesson_types')}
        style={styles.categoryHeader}>
        <Icon
          name={expandedCategory === 'lesson_types' ? 'minus' : 'plus'}
          size={18}
          color="white"
          style={styles.icon}
        />
        <Text style={styles.categoryName}>TYPES</Text>
      </Pressable>
      {expandedCategory === 'lesson_types' && (
        <ScrollView style={styles.categoryView}>
          {Object.keys(lessonTypes).map(termId =>
            renderCategory(
              lessonTypes[termId],
              termId,
              `${lessonTypes[termId][0].lesson_types[0].name}`,
            ),
          )}
        </ScrollView>
      )}
      <Pressable
        onPress={() => toggleCategory('lesson_positions')}
        style={styles.categoryHeader}>
        <Icon
          name={expandedCategory === 'lesson_positions' ? 'minus' : 'plus'}
          size={18}
          color="white"
          style={styles.icon}
        />
        <Text style={styles.categoryName}>POSITIONS</Text>
      </Pressable>
      {expandedCategory === 'lesson_positions' && (
        <ScrollView style={styles.categoryView}>
          {Object.keys(lessonPositions).map(termId =>
            renderCategory(
              lessonPositions[termId],
              termId,
              `${lessonPositions[termId][0].lesson_positions[0].name}`,
            ),
          )}
        </ScrollView>
      )}
      <Pressable
        onPress={() => toggleCategory('lesson_techniques')}
        style={styles.categoryHeader}>
        <Icon
          name={expandedCategory === 'lesson_techniques' ? 'minus' : 'plus'}
          size={18}
          color="white"
          style={styles.icon}
        />
        <Text style={styles.categoryTitle}>TECHNIQUES</Text>
      </Pressable>
      {expandedCategory === 'lesson_techniques' && (
        <ScrollView style={styles.categoryView}>
          {Object.keys(lessonTechniques).map(termId =>
            renderCategory(
              lessonTechniques[termId],
              termId,
              `${lessonTechniques[termId][0].lesson_techniques[0].name}`,
            ),
          )}
        </ScrollView>
      )}
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
  categoryTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  titleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
  shadowProp: {
    shadowColor: '#000',
    shadowOffset: {width: -3, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  categoryName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 5,
  },
});

export default LessonPlansListing;
