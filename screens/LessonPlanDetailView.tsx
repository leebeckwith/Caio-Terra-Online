import React, {useState, useEffect} from 'react';
import {
  Alert,
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Pressable,
} from 'react-native';
import {useVideoModal} from '../components/VideoPlayerModalContext';
import {useSelector} from 'react-redux';
import {getCredentials} from '../storage';
import SInfo from 'react-native-sensitive-info';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useRoute, useNavigation} from '@react-navigation/native';
import CTAStyles from "../styles/styles";

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
  const {videoId, videoTitle} = params || {};
  const [mappedVideos, setMappedVideos] = useState<LessonData[]>([]);
  const cachedVideosData = useSelector(state => state.cachedVideos);
  const {openVideoModal} = useVideoModal();
  const navigation = useNavigation();

  const fetchPlanVideoDetailsById = async (id: number) => {
    try {
      const response = await fetch(
        `https://caioterra.com/app-api/plan-videos.php?id=${id}`,
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const apiData = await response.json();
      return apiData;
    } catch (error) {
      console.error('Error fetching plan video details:', error);
      Alert.alert(
        'Error',
        `There was an error getting the plans details: ${error}`,
      );
      return [];
    }
  };

  const VideoItem: React.FC<{item: LessonData}> = React.memo(({item}) => {
    return (
      <View style={styles.videoItemContainer}>
        <View style={styles.wrapper}>
          <Pressable onPress={() => handleVideoPress(item.vimeoid, item.id)}>
            <Image
              source={{uri: item.thumburl}}
              style={styles.lessonThumbnail}
            />
            <Text style={[CTAStyles.text_light, styles.titleOverlay]}>
              {item.title.toUpperCase()}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  });

  useEffect(() => {
    const fetchAndSetPlanVideos = async (id: number) => {
      const planVideoDetails = await fetchPlanVideoDetailsById(id);
      const newIDs = planVideoDetails.map((item: any) => item.id);
      const mappedCachedVideos = cachedVideosData.filter(item =>
        newIDs.includes(item.id),
      );
      setMappedVideos(mappedCachedVideos);
    };

    fetchAndSetPlanVideos(videoId);
  }, []);

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
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="white" style={styles.icon} />
          <Text style={styles.headerTitle}>{videoTitle}</Text>
        </Pressable>
      </View>
      {mappedVideos.length > 0 && (
        <FlatList
          style={styles.lessonContainer}
          data={mappedVideos}
          renderItem={({item}) => <VideoItem item={item} />}
          keyExtractor={item => item.id.toString()}
          indicatorStyle={'white'}
          showsVerticalScrollIndicator={true}
        />
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
  videoItemContainer: {
    marginBottom: 8,
    position: 'relative',
  },
  titleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    fontSize: 12,
    fontWeight: 'bold',
    padding: 8,
    paddingRight: 35,
    textAlign: 'left',
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
  wrapper: {
    flexDirection: 'column',
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
  lessonContainer: {
    marginTop: 20,
  },
  lessonTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  lessonThumbnail: {
    width: '100%',
    height: 200,
  },
});

export default LessonPlanDetailView;
