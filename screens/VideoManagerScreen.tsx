import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import VideoPlayer from './VideoPlayerScreen';
import VideoListing from './VideoListingScreen';
import FavoritesListing from './FavoritesListingScreen';

const Stack = createStackNavigator();

const VideoManagerScreen = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="VideoListing" component={VideoListing} />
      <Stack.Screen name="Favorites" component={FavoritesListing} />
      <Stack.Screen name="Player" component={VideoPlayer} />
    </Stack.Navigator>
  );
};

export default VideoManagerScreen;
