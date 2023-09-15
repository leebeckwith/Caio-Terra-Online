import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
} from 'react-native';

interface VideoPlaybackRateModalProps {
  isVisible: boolean;
  onClose: () => void;
  onPlaybackRateChange: any;
  playbackRate: number;
}

const VideoPlaybackRateModal: React.FC<VideoPlaybackRateModalProps> = ({
  isVisible,
  onClose,
  playbackRate,
  onPlaybackRateChange,
}) => {
  const [rateData, setRateData] = useState<number[]>([]);

  useEffect(() => {
    const showPlaybackRateOptions = () => {
      try {
        const rateOptions = [0.5, 0.75, 1, 1.5, 2];
        setRateData(rateOptions);
      } catch (error) {
        console.error('Error initializing playback rate options:', error);
      }
    };

    showPlaybackRateOptions();
  }, []);

  const renderRateItem = ({item}: {item: number}) => {
    return (
      <Pressable
        style={[
          styles.videoPlaybackRateItem,
          item === playbackRate && styles.active,
        ]}
        onPress={() => {
          onPlaybackRateChange(item);
          onClose();
        }}>
        <Text style={styles.buttonBody}>{item}x</Text>
      </Pressable>
    );
  };

  return (
    <Modal transparent visible={isVisible}>
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, styles.shadowProp]}>
          <Text style={styles.modalTitle}>VIDEO PLAYBACK RATE</Text>
          <Text style={styles.modalBody}>Select the video playback rate.</Text>
          <FlatList
            data={rateData}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderRateItem}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 10,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalBody: {
    color: '#000',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonBody: {
    color: '#fff',
  },
  videoPlaybackRateItem: {
    backgroundColor: '#333',
    padding: 15,
    height: 50,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  active: {
    backgroundColor: '#00a6ff',
  },
  closeButton: {
    backgroundColor: '#666',
    padding: 10,
    alignItems: 'center',
  },
  shadowProp: {
    shadowColor: '#000',
    shadowOffset: {width: -3, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  icons: {
    color: '#fff',
  },
  spinnerIconContainer: {
    width: 20,
    height: 20,
  },
});

export default VideoPlaybackRateModal;
