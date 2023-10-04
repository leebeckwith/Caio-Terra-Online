import React, {useState, useEffect} from 'react';
import {
  Alert,
  Image,
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
} from 'react-native';
import {useVideoModal} from '../components/VideoPlayerModalContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useSelector} from 'react-redux';
import {getCredentials} from '../storage';
import CTAStyles from '../styles/styles';
import SInfo from 'react-native-sensitive-info';

interface Lesson {
  id: number;
  title: string;
  thumburl: string;
  lessonData: [];
  vimeoid: number;
  showSubItems: boolean;
}

interface Category {
  term_id: number;
  name: string;
  slug: string;
  lessons: Lesson[];
}

const CurriculumListing: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [lessonData, setLessonData] = useState<Lesson[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const cachedVideosData = useSelector(state => state.cachedVideos);
  const cachedCurriculumVideosData = useSelector(state => state.cachedCurriculumVideos);
  const {openVideoModal} = useVideoModal();

  useEffect(() => {
    // Fetch curriculum data
    const fetchCurriculumData = async () => {
      try {
        setCategories(cachedCurriculumVideosData);
      } catch (error) {
        console.error('Error fetching curriculum data:', error);
        Alert.alert(
          'Error',
          `There was an error getting the curriculum details: ${error}`,
        );
      }
    };

    fetchCurriculumData();
  }, []);

  const toggleCategory = (categoryId: number) => {
    setExpandedCategory(prevCategoryId =>
      prevCategoryId === categoryId ? null : categoryId,
    );
    setLessonData([]);

    // Reset lesson data for all lessons in the current category
    setCategories(prevCategories =>
      prevCategories.map(category => ({
        ...category,
        lessons: category.lessons.map(lesson => ({
          ...lesson,
          lessonData: [],
          showSubItems: false,
        })),
      })),
    );

    if (!isExpanded) {
      try {
        setIsExpanded(true);
      } catch (error) {
        console.error('Error fetching lesson items:', error);
        Alert.alert('Error', `There was an error getting the items: ${error}`);
      }
    } else {
      setIsExpanded(false);
    }
  };

  const showPlan = async (lessonId: number) => {
    try {
      const response = await fetch(
        `https://caioterra.com/app-api/plan-videos.php?id=${lessonId}`,
      );
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const lessonVideos = await response.json();
      const mappedLessonVideos = lessonVideos
        .map(video => {
          const cachedVideo = cachedVideosData.find(
            cachedVideo => cachedVideo.id === video.id,
          );
          if (cachedVideo) {
            return {
              ...cachedVideo,
            };
          } else {
            return null;
          }
        })
        .filter(video => video !== null);
      setLessonData(mappedLessonVideos);

      setCategories(prevCategories =>
        prevCategories.map(category => ({
          ...category,
          lessons: category.lessons.map(lesson => ({
            ...lesson,
            showSubItems: lesson.id === lessonId,
          })),
        })),
      );
    } catch (error) {
      console.error('Error fetching lesson items:', error);
      Alert.alert('Error', `There was an error getting the items: ${error}`);
    }
  };

  const renderCategoryItem = ({item}: {item: Category}) => {
    const isExpanded = expandedCategory === item.term_id;

    return (
      <View style={styles.categoryContainer}>
        <Pressable
          onPress={() => toggleCategory(item.term_id)}
          style={styles.categoryHeader}>
          <Icon
            name={isExpanded ? 'minus' : 'plus'}
            size={18}
            color="white"
            style={styles.icon}
          />
          <View style={styles.iconSpacer} />
          <Text style={styles.categoryName}>
            {item.name.toLocaleUpperCase()}
          </Text>
        </Pressable>
        {isExpanded && (
          <FlatList
            data={item.lessons}
            renderItem={renderLessonItem}
            keyExtractor={lesson => lesson.id.toString()}
          />
        )}
      </View>
    );
  };

  const LessonSubItem: React.FC<{item: Lesson}> = React.memo(({item}) => {
    return (
      <View style={styles.wrapper}>
        <Pressable onPress={() => handleVideoPress(item.vimeoid, item.id)}>
          <Image
            source={{uri: item.thumburl}}
            style={styles.subLessonThumbnail}
          />
        </Pressable>
        <Text style={styles.lessonTitle}>{item.title}</Text>
      </View>
    );
  });

  const renderLessonItem = ({item}: {item: Lesson}) => {
    return (
      <View style={styles.lessonItemContainer}>
        <Pressable onPress={() => showPlan(item.id)}>
          <Image source={{uri: item.thumburl}} style={styles.lessonThumb} />
        </Pressable>
        {item.showSubItems && (
          <FlatList
            data={lessonData}
            renderItem={({item}) => <LessonSubItem item={item} />}
            keyExtractor={subItem => subItem.id.toString()}
          />
        )}
      </View>
    );
  };

  const handleVideoPress = async (vimeoId: number, videoId: number) => {
    const {user_id} = await getCredentials();
    const CTAVimeoKey = await SInfo.getItem('cta-vimeo-key', {});
    openVideoModal(vimeoId, CTAVimeoKey, user_id, videoId);
  };

  return (
    <View style={CTAStyles.container}>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={category => category.term_id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  categoryHeader: {
    backgroundColor: '#00a6ff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  categoryContainer: {
    marginBottom: 8,
  },
  categoryName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  lessonItemContainer: {
    marginLeft: 10,
    marginTop: 10,
  },
  lessonTitle: {
    width: '60%',
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 10,
  },
  lessonThumb: {
    width: '100%',
    height: 150,
    marginBottom: 10,
  },
  subLessonThumbnail: {
    width: 100,
    height: 60,
  },
  wrapper: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  icon: {
    marginRight: 5,
  },
  iconSpacer: {
    width: 18,
  },
});

export default CurriculumListing;
