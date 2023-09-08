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
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import {
  FileSaveOptions,
  startDownloadAppSave,
} from 'react-native-ios-files-app-save';

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

const VideoDownloadModal: React.FC<VideoDownloadModalProps> = ({
  isVisible,
  onClose,
  vimeoId,
}) => {
  const [videoData, setVideoData] = useState<VideoDownloadItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDownloadLink, setSelectedDownloadLink] = useState<
    string | null
  >(null);

  useEffect(() => {
    const fetchDownloadOptions = async () => {
      try {
        const response = await fetch(
          `https://caioterra.com/app-api/get-video-download-links.php?id=${vimeoId}`,
        );
        const data = await response.json();
        const filteredVideoData = data
          .filter(item => item.rendition !== 'adaptive')
          .sort((a, b) => b.size - a.size);

        setVideoData(filteredVideoData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching download options:', error);
        Alert.alert(
          'Error',
          `There was an error getting the download options: ${error}`,
        );
      }
    };

    fetchDownloadOptions();
  }, []);

  const handleDownload = async (downloadLink: string, resolution: string) => {
    setSelectedDownloadLink(downloadLink);
    let options: FileSaveOptions = {
      url: downloadLink,
      // isBase64: true,
      fileName: `${vimeoId}_${resolution}.mp4`,
    };

    startDownloadAppSave(options)
      .then(() => {
        //const fileSaveSuccess = res as FileSaveSuccess;
        Alert.alert(
          'File Downloaded',
          `Your file, ${vimeoId}_${resolution}.mp4, downloaded successfully.`,
        );
        setSelectedDownloadLink(null);
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  const renderVideoItem = ({item}: {item: VideoDownloadItem}) => (
    <View>
      <Pressable
        style={[
          styles.videoDownloadItem,
          selectedDownloadLink === item.link ? styles.active : null,
        ]}
        onPress={() => handleDownload(item.link, item.rendition)}>
        <Text style={styles.buttonBody}>
          {item.rendition} ({item.width}x{item.height}) - {item.size_short}
        </Text>
        {selectedDownloadLink === item.link && (
          <Animatable.View
            animation="rotate"
            easing="linear"
            iterationCount="infinite"
            duration={1000}
            style={styles.spinnerIconContainer}>
            <Icon name="spinner" color="white" size={20} style={styles.icons} />
          </Animatable.View>
        )}
      </Pressable>
    </View>
  );

  if (isLoading) {
    return <></>;
  }

  return (
    <Modal transparent visible={isVisible}>
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, styles.shadowProp]}>
          <Text style={styles.modalTitle}>DOWNLOAD VIDEO</Text>
          <Text style={styles.modalBody}>
            Select the desired resolution for temporary playback on your device.
            Your connection affects how quickly the download will proceed.
          </Text>
          <FlatList
            data={videoData}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderVideoItem}
          />
          <Pressable
            onPress={onClose}
            style={[styles.closeButton, styles.shadowProp]}>
            <Text style={styles.buttonBody}>CLOSE</Text>
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
  videoDownloadItem: {
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

export default VideoDownloadModal;
