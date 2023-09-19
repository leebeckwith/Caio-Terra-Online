import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import VideoListing from './VideoListingScreen';
import VideoFilterView from './VideoFilterViewScreen';
import VideoMatrixView from './VideoMatrixViewScreen';
import VideoDownloadsScreen from './VideoDownloadsScreen';
import {StyleSheet} from 'react-native';

const Tab = createMaterialTopTabNavigator();

const VideoManagerScreen = () => {
  return (
    <Tab.Navigator
      sceneContainerStyle={styles.sceneContainer}
      style={styles.tabContainer}
      screenOptions={{
        tabBarScrollEnabled: false,
        tabBarIndicatorStyle: {
          height: '100%',
          backgroundColor: 'rgba(0, 166, 255, 0.25)',
        },
        tabBarStyle: {
          backgroundColor: 'transparent',
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontWeight: 'bold',
        },
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        tabBarActiveTintColor: '#fff',
      }}>
      <Tab.Screen name="Search" component={VideoListing} />
      <Tab.Screen name="Matrix" component={VideoMatrixView} />
      <Tab.Screen name="Filter" component={VideoFilterView} />
      <Tab.Screen name="Offline" component={VideoDownloadsScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  background: {
    height: '100%',
    width: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sceneContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  tabContainer: {
    minHeight: '100%',
    maxHeight: '100%',
  },
});

export default VideoManagerScreen;
