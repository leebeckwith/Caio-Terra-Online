import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  Pressable,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {getCachedVideos} from '../storage';
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
  const [scrollViewWidth, setScrollViewWidth] = useState(screenWidth);
  const [mappedVideos, setMappedVideos] = useState<VideoData[]>([]); // New state variable
  const navigation = useNavigation();

  const screenWidth = Dimensions.get('window').width;
  const boxWidth = screenWidth * 0.78;
  const halfBoxDistance = (screenWidth - boxWidth) / 2;

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

  const handleVideoPress = (vimeoId: number) => {
    // CTA App Vimeo Bearer token
    const vimeoToken = '91657ec3585779ea01b973f69aae2c9c';

    // @ts-ignore Because this navigation resolves fine with the props sent
    navigation.navigate('Player', {
      vimeoId,
      vimeoToken,
      onBack: () => {
        // This callback will be triggered when the back button is pressed on VideoPlayerScreen
        navigation.goBack(); // Navigate back to the LessonPlansListing screen
      },
    });
  };

  const VideoItem: React.FC<{item: VideoData}> = ({item}) => {
    return (
      <View style={styles.videoItemContainer}>
        <View style={styles.wrapper}>
          {/*<Pressable onPress={() => handleVideoPress(item.vimeoid)}>*/}
          <Pressable>
            <Image
              source={{uri: item.thumburl}}
              style={styles.lessonThumbnail}
            />
          </Pressable>
          <Text style={styles.lessonTitle}>{item.title}</Text>
        </View>
      </View>
    );
  };

  const renderLessonCategory = ({
    item,
    index,
  }: {
    item: VideoData;
    index: number;
  }) => {
    return (
      <Animated.View
        style={{
          transform: [
            {
              scale: pan.x.interpolate({
                inputRange: [
                  (index - 1) * boxWidth - halfBoxDistance,
                  index * boxWidth - halfBoxDistance,
                  (index + 1) * boxWidth - halfBoxDistance,
                ],
                outputRange: [0.7, 1, 0.7],
                extrapolate: 'clamp',
              }),
            },
          ],
        }}>
        <View style={[styles.carouselContent, {width: boxWidth}]}>
          <Pressable
            onPress={() => fetchAndSetPlanVideos(item.id)}
            style={[styles.thumbnailContainer]}>
            <Image source={{uri: item.thumburl}} style={styles.thumbnail} />
            {/*<Text style={styles.titleOverlay}>{item.title}</Text>*/}
            {/*<View style={styles.iconOverlay}>*/}
            {/*  <Icon*/}
            {/*    name="plus-circle"*/}
            {/*    color="rgba(255, 255, 255, 0.4)"*/}
            {/*    size={28}*/}
            {/*    style={styles.icon}*/}
            {/*  />*/}
            {/*</View>*/}
          </Pressable>
        </View>
      </Animated.View>
    );
  };

  const pan = React.useRef(new Animated.ValueXY()).current;

  return (
    <View style={styles.videoItemContainer}>
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryName}>
          SWIPE TO BROWSE, CLICK FOR DETAILS
        </Text>
      </View>
      <FlatList
        horizontal
        data={filteredVideos}
        style={styles.carouselContainer}
        contentContainerStyle={{paddingVertical: 16}}
        contentInsetAdjustmentBehavior="never"
        snapToAlignment="center"
        decelerationRate="fast"
        automaticallyAdjustContentInsets={true}
        indicatorStyle={'white'}
        showsHorizontalScrollIndicator={true}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={0.8}
        snapToInterval={boxWidth}
        contentInset={{
          left: halfBoxDistance,
          right: halfBoxDistance,
        }}
        contentOffset={{x: halfBoxDistance * -1, y: 0}}
        onLayout={e => {
          setScrollViewWidth(e.nativeEvent.layout.width + 50);
        }}
        onScroll={Animated.event([{nativeEvent: {contentOffset: {x: pan.x}}}], {
          useNativeDriver: false,
        })}
        keyExtractor={(item, index) => `${index}-${item.id.toString()}`}
        renderItem={renderLessonCategory}
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
    padding: 10,
  },
  categoryContainer: {
    marginBottom: 8,
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
  carouselContent: {
    height: '100%',
    borderRadius: 0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    color: '#fff',
    fontSize: 16,
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
