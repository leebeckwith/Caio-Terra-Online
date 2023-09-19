import React, {createContext, useContext, useState} from 'react';
import RNFS from 'react-native-fs';

const VideoModalContext = createContext();

export const VideoModalProvider = ({children}) => {
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedVideoInfo, setSelectedVideoInfo] = useState({
    vimeoId: null,
    vimeoToken: null,
    userId: null,
    videoId: null,
  });

  const deleteLocalVTTFile = async () => {
    try {
      const localFilePath = `${RNFS.DocumentDirectoryPath}/video_caption.vtt`;
      const fileExists = await RNFS.exists(localFilePath);

      if (fileExists) {
        await RNFS.unlink(localFilePath);
      }
    } catch (error) {
      console.error('Error deleting local VTT file:', error);
    }
  };

  const openVideoModal = (vimeoId, vimeoToken, userId, videoId) => {
    setSelectedVideoInfo({vimeoId, vimeoToken, userId, videoId});
    setVideoModalVisible(true);
  };

  const closeVideoModal = () => {
    deleteLocalVTTFile();
    setVideoModalVisible(false);
    setSelectedVideoInfo({
      vimeoId: null,
      vimeoToken: null,
      userId: null,
      videoId: null,
    });
  };

  return (
    <VideoModalContext.Provider
      value={{
        videoModalVisible,
        openVideoModal,
        closeVideoModal,
        selectedVideoInfo,
      }}>
      {children}
    </VideoModalContext.Provider>
  );
};

export const useVideoModal = () => useContext(VideoModalContext);
