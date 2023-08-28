import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity, FlatList, Pressable
} from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import {useNavigation} from '@react-navigation/native';
import {getCachedVideos} from '../storage';

interface VideoData {
  id: number;
  vimeoid: number;
  title: string;
  thumburl: string;
  link: string;
  video_types: {term_id: number; name: string}[];
  video_positions: {term_id: number; name: string}[];
  video_techniques: {term_id: number; name: string}[];
  // Add your other properties here
}

const VideoFilterviewScreen: React.FC = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<VideoData[]>([]);
  const navigation = useNavigation();
  const [techniques, setTechniques] = useState<{id: number; name: string}[]>(
    [],
  );
  const [positions, setPositions] = useState<{id: number; name: string}[]>([]);
  const [types, setTypes] = useState<{id: number; name: string}[]>([]);

  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [techniqueOpen, setTechniqueOpen] = useState(false);
  const [positionOpen, setPositionOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [items, setItems] = useState([
    {label: 'Apple', value: 'apple'},
    {label: 'Banana', value: 'banana'},
  ]);
  const [value, setValue] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const cachedVideos = await getCachedVideos();

        if (cachedVideos && cachedVideos.length > 0) {
          setVideos(cachedVideos);
          console.log('Cached video data used');

          // Extract unique techniques, positions, and types from cachedVideos
          const uniqueTechniques: {[id: number]: {id: number; name: string}} =
            {};
          const uniquePositions: {[id: number]: {id: number; name: string}} =
            {};
          const uniqueTypes: {[id: number]: {id: number; name: string}} = {};

          cachedVideos.forEach(video => {
            video.video_techniques.forEach(technique => {
              uniqueTechniques[technique.term_id] = technique;
            });

            video.video_positions.forEach(position => {
              uniquePositions[position.term_id] = position;
            });

            video.video_types.forEach(type => {
              uniqueTypes[type.term_id] = type;
            });
          });

          setTechniques(Object.values(uniqueTechniques));
          setPositions(Object.values(uniquePositions));
          setTypes(Object.values(uniqueTypes));
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    // Call the fetchVideos function when the component mounts
    fetchVideos();
  }, []);

  useEffect(() => {
    let filtered = videos;

    if (selectedTechnique !== null) {
      filtered = filtered.filter(video =>
        video.video_techniques.some(
          technique => technique.name === selectedTechnique,
        ),
      );
    }

    if (selectedPosition !== null) {
      filtered = filtered.filter(video =>
        video.video_positions.some(
          position => position.name === selectedPosition,
        ),
      );
    }

    if (selectedType !== null) {
      filtered = filtered.filter(video =>
        video.video_types.some(
          type => type.name === selectedType,
        ),
      );
    }

    setFilteredVideos(filtered);
  }, [selectedTechnique, selectedPosition, selectedType, videos]);

  useEffect(() => {
    // Update filtered videos when filter criteria change
    const filtered = videos.filter(video =>
      filteredVideos.some(filteredVideo => filteredVideo.id === video.id),
    );
    setFilteredVideos(filtered);
  }, [videos]);

  const techniqueData = techniques.map(technique => ({
    label: technique.name,
    value: technique.name,
  }));

  const positionData = positions.map(position => ({
    label: position.name,
    value: position.name,
  }));

  const typeData = types.map(type => ({
    label: type.name,
    value: type.name,
  }));

  const onTechniqueOpen = useCallback(() => {
    //console.log('technique opened');
    setPositionOpen(false);
    setTypeOpen(false);
  }, []);

  const onPositionOpen = useCallback(() => {
    //console.log('technique opened');
    setTechniqueOpen(false);
    setTypeOpen(false);
  }, []);

  const onTypeOpen = useCallback(() => {
    //console.log('technique opened');
    setPositionOpen(false);
    setTechniqueOpen(false);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <DropDownPicker
          placeholder="Select technique"
          listMode="MODAL"
          modalTitle="Select technique"
          modalProps={{
            animationType: 'fade',
          }}
          open={techniqueOpen}
          setOpen={setTechniqueOpen}
          value={selectedTechnique}
          setValue={setSelectedTechnique}
          onOpen={onTechniqueOpen}
          items={techniqueData}
          zIndex={3000}
          zIndexInverse={1000}
          style={styles.dropDownContainer}
        />
        <DropDownPicker
          placeholder="Select position"
          listMode="MODAL"
          modalTitle="Select position"
          modalProps={{
            animationType: 'fade',
          }}
          open={positionOpen}
          setOpen={setPositionOpen}
          value={selectedPosition}
          setValue={setSelectedPosition}
          onOpen={onPositionOpen}
          items={positionData}
          zIndex={2000}
          zIndexInverse={2000}
          style={styles.dropDownContainer}
        />
        <DropDownPicker
          placeholder="Select type"
          listMode="MODAL"
          modalTitle="Select type"
          modalProps={{
            animationType: 'fade',
          }}
          open={typeOpen}
          setOpen={setTypeOpen}
          value={selectedType}
          setValue={setSelectedType}
          onOpen={onTypeOpen}
          items={typeData}
          zIndex={1000}
          zIndexInverse={3000}
          style={styles.dropDownContainer}
        />
      </View>
      <Text style={styles.results}>
        {`VIDEOS FOUND: ${filteredVideos.length}`}
      </Text>
      {filteredVideos.length > 0 ? (
        <FlatList
          data={filteredVideos}
          showsVerticalScrollIndicator={true}
          indicatorStyle="white"
          renderItem={({item}) => (
            <View style={styles.videoItemContainer}>
              <View style={styles.wrapper}>
                {/*<Pressable onPress={() => handleVideoPress(item.vimeoid)}>*/}
                <Pressable>
                  <Image
                    source={{uri: item.thumburl}}
                    style={styles.lessonThumbnail}
                  />
                </Pressable>
                <Text style={styles.lessonTitle}>
                  {item.title.toUpperCase()}
                </Text>
              </View>
            </View>
          )}
          keyExtractor={item => item.id.toString()}
        />
      ) : (
        <></>
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
  filterContainer: {
    backgroundColor: '#000',
  },
  dropDownContainer: {
    borderRadius: 0,
    marginBottom: 10,
    borderWidth: 0,
    minHeight: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  videoItemContainer: {
    marginBottom: 10,
    width: '100%',
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
  title: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  wrapper: {
    flexDirection: 'row',
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
    width: 160,
    height: 90,
  },
  results: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default VideoFilterviewScreen;
