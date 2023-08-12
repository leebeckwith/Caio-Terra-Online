import React, {useState, useEffect} from 'react';
import {
  Image,
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon library you're using

interface Lesson {
  id: number;
  title: string;
  thumburl: string;
  // Other lesson properties...
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

  useEffect(() => {
    // ... (fetching and sorting categories remain the same)
  }, []);

  const toggleCategory = (categoryId: number, categoryName: string) => {
    setExpandedCategory(prevCategoryId =>
      prevCategoryId === categoryId ? null : categoryId,
    );
    console.log(categoryName);
    if (!isExpanded) {
      try {
        /*const response = await fetch(
          `https://caioterra.com/ct_get/ct_videos/?taxonomy=video_technique&term_slug=${item.slug}`,
        );
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const lessonItems: Lesson[] = await response.json();
        setLessonData(lessonItems);*/
        setIsExpanded(true);
      } catch (error) {
        console.error('Error fetching lesson items:', error);
      }
    } else {
      setIsExpanded(false);
    }
  };

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

  const renderCategoryItem = ({item}: {item: Category}) => {
    const isExpanded = expandedCategory === item.term_id;

    return (
      <View style={styles.categoryContainer}>
        <TouchableOpacity
          onPress={() => toggleCategory(item.term_id, item.name)}
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
        </TouchableOpacity>
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

  const renderLessonItem = ({item}: {item: Lesson}) => {
    return (
      <View style={styles.lessonItemContainer}>
        {/*<TouchableOpacity onPress={() => toggleLesson(item.title)}>*/}
        <Image source={{uri: item.thumburl}} style={styles.lessonThumb} />
        <Text style={styles.lessonTitle}>{item.title}</Text>
        {/*</TouchableOpacity>*/}
        {isExpanded && (
          <FlatList
            data={lessonData}
            renderItem={renderLessonSubItem} // Define a new function for rendering sub-items
            keyExtractor={subItem => subItem.id.toString()}
          />
        )}
      </View>
    );
  };

  const renderLessonSubItem = ({item}: {item: Lesson}) => {
    return (
      <View>
        <Text style={styles.lessonTitle}>{item.title}</Text>
        {/* Display other sub-lesson information */}
      </View>
    );
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
    padding: 10,
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
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  lessonThumb: {
    width: '100%',
    height: 150,
    borderRadius: 5,
    marginBottom: 10,
  },
  icon: {
    marginRight: 5, // Add some margin to separate the icon from the image
  },
  iconSpacer: {
    width: 18, // Adjust the width to match the icon's size
  },
});

export default CurriculumListing;
