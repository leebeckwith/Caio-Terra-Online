import React, {useState, useEffect} from 'react';
import {View, Text, Image, FlatList, StyleSheet, Pressable} from 'react-native';
import {useVideoModal} from '../components/VideoPlayerModalContext';
import {getCachedVideos, getCredentials} from '../storage';
import Icon from 'react-native-vector-icons/FontAwesome';

interface VideoData {
  id: number;
  vimeoid: number;
  title: string;
  thumburl: string;
  link: string;
}

const LessonPlansListing: React.FC = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<VideoData[]>([]);
  const [mappedVideos, setMappedVideos] = useState<VideoData[]>([]); // New state variable
  const {openVideoModal} = useVideoModal();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(
          'https://caioterra.com/app-api/get-plans.php',
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const apiData = await response.json();

        if (Array.isArray(apiData)) {
          setVideos(apiData);
          setFilteredVideos(apiData);
          console.log('Fetched video data from API');
        } else {
          console.log('API returned invalid data.');
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, []);

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
      return [];
    }
  };

  const fetchAndSetPlanVideos = async (id: number) => {
    const planVideoDetails = await fetchPlanVideoDetailsById(id);
    const newIDs = planVideoDetails.map((item: any) => item.id);
    const cachedVideos = await getCachedVideos();
    const mappedCachedVideos = cachedVideos.filter(item =>
      newIDs.includes(item.id),
    );
    setMappedVideos(mappedCachedVideos);
  };

  const handleVideoPress = async (vimeoId: number, videoId: number) => {
    const {user_id} = await getCredentials();
    // CTA App Vimeo Bearer token
    const vimeoToken = '91657ec3585779ea01b973f69aae2c9c';
    openVideoModal(vimeoId, vimeoToken, user_id, videoId);
  };

  const VideoItem: React.FC<{item: VideoData}> = React.memo(({item}) => {
    return (
      <View style={styles.videoItemContainer}>
        <View style={styles.wrapper}>
          <Pressable onPress={() => handleVideoPress(item.vimeoid, item.id)}>
            <Image
              source={{uri: item.thumburl}}
              style={styles.lessonThumbnail}
            />
          </Pressable>
          <Text style={styles.lessonTitle}>{item.title}</Text>
        </View>
      </View>
    );
  });

  const CarouselItem: React.FC<{item: VideoData}> = React.memo(({item}) => {
    return (
      <View style={styles.carouselContent}>
        <Pressable
          onPress={() => fetchAndSetPlanVideos(item.id)}
          style={[styles.thumbnailContainer]}>
          <Image source={{uri: item.thumburl}} style={styles.thumbnail} />
          <Text style={styles.titleOverlay}>{item.title}</Text>
        </Pressable>
      </View>
    );
  });

  return (
    <View style={styles.videoItemContainer}>
      <View>
        <Text style={styles.categoryName}>SWIPE AND CLICK FOR DETAILS</Text>
      </View>
      <FlatList
        horizontal
        data={filteredVideos}
        style={styles.carouselContainer}
        contentContainerStyle={styles.carouselContentContainer}
        showsHorizontalScrollIndicator={true}
        indicatorStyle={'white'}
        keyExtractor={(item, index) => `${index}-${item.id.toString()}`}
        renderItem={({item}) => <CarouselItem item={item} />}
      />
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
    padding: 20,
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
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 8,
    padding: 10,
  },
  thumbnail: {
    width: 370,
    height: '100%',
  },
  thumbnailContainer: {
    position: 'relative',
  },
  wrapper: {
    flexDirection: 'row',
  },
  icons: {
    textAlign: 'right',
    width: '5%',
    marginTop: 8,
    display: 'flex',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  categoryName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  carouselContainer: {
    backgroundColor: '#000',
    height: 250,
  },
  carouselContentContainer: {
    paddingVertical: 16,
  },
  carouselContent: {
    height: '100%',
    borderRadius: 0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  titleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    padding: 8,
    textAlign: 'center',
  },
  iconOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    left: '50%',
    top: '40%',
  },
  icon: {
    marginBottom: 8,
  },
  instructionOverlay: {
    color: '#fff',
    fontSize: 12,
  },
  shadowProp: {
    shadowColor: '#000',
    shadowOffset: {width: -3, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  lessonContainer: {
    height: 450,
    marginTop: 20,
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
  lessonThumbnail: {
    width: 100,
    height: 60,
  },
});

export default LessonPlansListing;
