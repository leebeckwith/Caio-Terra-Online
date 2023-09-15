import React, {createContext, useContext, useState} from 'react';

const VideoOfflineModalContext = createContext();

export const VideoOfflineModalProvider = ({children}) => {
  const [videoOfflineModalVisible, setVideoOfflineModalVisible] =
    useState(false);
  const [selectedVideoPath, setSelectedVideoPath] = useState(null);

  const openOfflineVideoModal = videoPath => {
    setSelectedVideoPath(videoPath);
    setVideoOfflineModalVisible(true);
  };

  const closeOfflineVideoModal = () => {
    setVideoOfflineModalVisible(false);
    setSelectedVideoPath(null);
  };

  return (
    <VideoOfflineModalContext.Provider
      value={{
        videoOfflineModalVisible,
        openOfflineVideoModal,
        closeOfflineVideoModal,
        selectedVideoPath,
      }}>
      {children}
    </VideoOfflineModalContext.Provider>
  );
};

export const useVideoOfflineModal = () => useContext(VideoOfflineModalContext);
