import React from 'react';
import {Modal, View, StyleSheet, Pressable} from 'react-native';
import VideoOfflinePlayer from '../screens/VideoOfflinePlayerScreen';
import {useVideoOfflineModal} from './VideoOfflinePlayerModalContext';

const VideoOfflinePlayerModal = () => {
  const {videoOfflineModalVisible, closeOfflineVideoModal, selectedVideoPath} =
    useVideoOfflineModal();

  return (
    <Modal
      visible={videoOfflineModalVisible}
      animationType="fade"
      onRequestClose={() => closeOfflineVideoModal}>
      <Pressable
        style={styles.modalBackground}
        onPress={closeOfflineVideoModal}>
        <Pressable>
          <View style={[styles.modalContent, styles.shadowPropBottom]}>
            <VideoOfflinePlayer route={{params: selectedVideoPath}} />
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

export default VideoOfflinePlayerModal;
