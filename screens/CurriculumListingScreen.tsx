import React, { useState, useEffect } from 'react';
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

interface LessonTechnique {
  term_id: number;
  name: string;
  slug: string;
}

interface LessonPosition {
  term_id: number;
  name: string;
  slug: string;
}

interface LessonType {
  term_id: number;
  name: string;
  slug: string;
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  thumburl: string;
  image_full_url: string;
  last_modified: string;
  lesson_techniques: LessonTechnique[];
  lesson_positions: LessonPosition[];
  lesson_types: LessonType[];
  curriculum_position: LessonPosition[];
}

interface Category {
  term_id: number;
  name: string;
  slug: string;
  lessons: Lesson[];
}

interface CurriculumData {
  [categoryName: string]: Category; // This allows for dynamic category names
}

const CurriculumListing: React.FC = () => {
  const navigation = useNavigation();
  const [curriculumData, setCurriculumData] = useState<CurriculumData | null>(null);
  const [filteredLessons, setFilteredLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    // Fetch the curriculum data and update state
    const fetchCurriculumData = async () => {
      try {
        const response = await fetch(
          'https://caioterra.com/app-api/get-curriculum.php'
        );
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }

        const data: CurriculumData = await response.json();
        setCurriculumData(data);

        // Assuming you want to show the lessons from the "Standing" category initially
        if (data && 'Standing' in data) {
          setFilteredLessons(data['Standing'].lessons);
        }
      } catch (error) {
        console.error('Error fetching curriculum data:', error);
      }
    };

    fetchCurriculumData();
  }, []);

  const renderVideoItem = ({ item }: { item: Lesson }) => {
    return (
      <View style={styles.videoItemContainer}>
        <Image
          source={{ uri: item.thumburl }}
          style={styles.thumbnail}
        />
        <Text style={styles.title}>{item.title}</Text>
        {/* Add other elements you want to display for each lesson */}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {curriculumData ? (
        <FlatList
          data={filteredLessons}
          renderItem={renderVideoItem}
          keyExtractor={(item) => item.id.toString()}
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
  videoItemContainer: {
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 10,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 5,
  },
});

export default CurriculumListing;
