import React, {useEffect, useState} from 'react';
import {FlatList, View, Text, Modal, Pressable, StyleSheet} from 'react-native'
import RNFS from 'react-native-fs';

interface VideoDownloadModalProps {
  isVisible: boolean;
  onClose: () => void;
  vimeoId: string;
}

interface VideoDownloadItem {
  link: string;
  quality: string;
  rendition: string;
  width: number;
  height: number;
  size: number;
  size_short: string;
}

const VideoDownloadModal: React.FC<VideoDownloadModalProps> = ({ isVisible, onClose, vimeoId }) => {
  const [videoData, setVideoData] = useState<VideoDownloadItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  useEffect(() => {
    // Fetch the download options from the API
    const fetchDownloadOptions = async () => {
      try {
        const response = await fetch(
          `https://caioterra.com/app-api/get-video-download-links.php?id=${vimeoId}`
        );
        const data = await response.json();
        const filteredVideoData = data.filter((item) => item.rendition !== 'adaptive').sort((a, b) => b.size - a.size);

        setVideoData(filteredVideoData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching download options:', error);
      }
    };

    fetchDownloadOptions();
  }, []);

  const handleDownload = async(downloadLink: string, resolution: string) => {
    const downloadDest = `${RNFS.DocumentDirectoryPath}/${vimeoId}_${resolution}.mp4`;
    console.log(downloadDest);
    RNFS.downloadFile({
      fromUrl: downloadLink,
      toFile: downloadDest,
      //background: true,
      //discretionary: true,
      progress: (res: RNFS.DownloadProgressCallbackResult) => {
        const progress: number = (res.bytesWritten / res.contentLength) * 100;
        console.log(`Progress: ${progress.toFixed(2)}%`);
      },
    }).promise.then((response: RNFS.DownloadResult) => {
        console.log('File downloaded!', response);
    }).catch((err: Error) => {
        console.log('Download error:', err);
    });
  };

  const renderVideoItem = ({ item }: { item: VideoDownloadItem }) => (
    <View>
      <Pressable style={styles.videoDownloadItem} onPress={() => handleDownload(item.link, item.rendition)}>
        <Text style={styles.buttonBody}>{item.rendition} ({item.width}x{item.height}) - {item.size_short}</Text>
      </Pressable>
    </View>
  );

  if (isLoading) {
    return (
      <></>
    );
  }

  return (
    <Modal transparent visible={isVisible}>
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, styles.shadowProp]}>
          <Text style={styles.modalTitle}>DOWNLOAD VIDEO</Text>
          <Text style={styles.modalBody}>Select the desired resolution for temporary playback on your device.</Text>
          <FlatList
            data={videoData}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderVideoItem}
          />
          <Pressable onPress={onClose} style={[styles.closeButton, styles.shadowProp]}>
            <Text style={styles.buttonBody}>CANCEL</Text>
          </Pressable>
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
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalBody: {
    fontSize: 14,
    marginBottom: 10,
  },
  buttonBody: {
    color: '#fff',
  },
  downloadButton: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  videoDownloadItem: {
    backgroundColor: '#333',
    padding: 15,
    marginBottom: 5,
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
});

export default VideoDownloadModal;
