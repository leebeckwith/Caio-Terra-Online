import React, {useState, useEffect} from 'react';
import {Image, View, Text, FlatList, StyleSheet, Pressable} from 'react-native';
import {useVideoModal} from '../components/VideoPlayerModalContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import {getCachedVideos} from '../storage';

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
  const {openVideoModal} = useVideoModal();

  useEffect(() => {
    // Fetch curriculum data
    const fetchCurriculumData = async () => {
      try {
        const response = await fetch(
          'https://caioterra.com/app-api/get-curriculum.php',
        );
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }

        const data: Record<string, Category> = await response.json();
        const categoryArray = Object.values(data);
        const sortedCategories = sortCategories(categoryArray);
        setCategories(sortedCategories);
      } catch (error) {
        console.error('Error fetching curriculum data:', error);
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
      }
    } else {
      setIsExpanded(false);
    }
  };

  const sortCategories = (categoryArray: Category[]): Category[] => {
    // Sort categories by name
    const sortedCategories = categoryArray.sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    // Find and move "Introduction" category to the beginning
    const introductionCategoryIndex = sortedCategories.findIndex(
      category => category.name === 'Introduction',
    );
    if (introductionCategoryIndex !== -1) {
      const introductionCategory = sortedCategories.splice(
        introductionCategoryIndex,
        1,
      )[0];
      sortedCategories.unshift(introductionCategory);
    }

    return sortedCategories;
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
      const cachedVideos = await getCachedVideos();

      const mappedLessonVideos = lessonVideos
        .map(video => {
          const cachedVideo = cachedVideos.find(
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
        <Pressable onPress={() => handleVideoPress(item.vimeoid)}>
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

  const handleVideoPress = (vimeoId: number) => {
    // CTA App Vimeo Bearer token
    const vimeoToken = '91657ec3585779ea01b973f69aae2c9c';
    openVideoModal(vimeoId, vimeoToken);
  };

  return (
    <View style={styles.container}>
      {categories.length > 0 ? (
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={category => category.term_id.toString()}
        />
      ) : (
        <Text style={styles.loadingText}>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
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
    marginBottom: 10,
    marginLeft: 10,
    marginTop: 10,
  },
  lessonTitle: {
    width: '60%',
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 0,
    marginBottom: 10,
    marginLeft: 10,
  },
  lessonThumb: {
    width: '100%',
    height: 150,
    borderRadius: 5,
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
