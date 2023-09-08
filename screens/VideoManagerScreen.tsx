import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import VideoListing from './VideoListingScreen';
import VideoFilterView from './VideoFilterViewScreen';
import VideoMatrixView from './VideoMatrixViewScreen';
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
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
        },
        tabBarIndicatorContainerStyle: {
          //backgroundColor: 'rgba(255, 255, 255, 0)',
        },
        tabBarStyle: {
          backgroundColor: 'transparent',
          elevation: 0,
        },
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        tabBarActiveTintColor: '#00a6ff',
      }}>
      <Tab.Screen name="Search" component={VideoListing} />
      <Tab.Screen name="Matrix" component={VideoMatrixView} />
      <Tab.Screen name="Filter" component={VideoFilterView} />
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
