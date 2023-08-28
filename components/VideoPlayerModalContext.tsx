import React, {createContext, useContext, useState} from 'react';

const VideoModalContext = createContext();

export const VideoModalProvider = ({children}) => {
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedVideoInfo, setSelectedVideoInfo] = useState({
    vimeoId: null,
    vimeoToken: null,
  });

  const openVideoModal = (vimeoId, vimeoToken) => {
    setSelectedVideoInfo({vimeoId, vimeoToken});
    setVideoModalVisible(true);
  };

  const closeVideoModal = () => {
    setVideoModalVisible(false);
    setSelectedVideoInfo({
      vimeoId: null,
      vimeoToken: null,
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
