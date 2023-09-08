import React from 'react';
import {Modal, View, StyleSheet, Pressable} from 'react-native';
import VideoPlayer from '../screens/VideoPlayerScreen';
import {useVideoModal} from './VideoPlayerModalContext';

const VideoPlayerModal = () => {
  const {videoModalVisible, closeVideoModal, selectedVideoInfo} =
    useVideoModal();

  return (
    <Modal
      visible={videoModalVisible}
      animationType="fade"
      onRequestClose={() => closeVideoModal}>
      <Pressable style={styles.modalBackground} onPress={closeVideoModal}>
        <Pressable>
          <View style={[styles.modalContent, styles.shadowPropBottom]}>
            <VideoPlayer route={{params: selectedVideoInfo}} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#666',
  },
  modalContent: {
    backgroundColor: 'transparent',
    width: '100%',
    maxHeight: '100%',
    flexDirection: 'row',
  },
  shadowPropBottom: {
    shadowColor: '#000',
    shadowOffset: {width: -3, height: 3},
    shadowOpacity: 0.6,
    shadowRadius: 5,
  },
});

export default VideoPlayerModal;
