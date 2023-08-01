import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import VideoListing from './VideoListingScreen';
import VideoPlayer from './VideoPlayerScreen';

const Stack = createStackNavigator();

function VideoManagerScreen(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Videos" component={VideoListing} />
      <Stack.Screen name="Player" component={VideoPlayer} />
    </Stack.Navigator>
  );
}

export default VideoManagerScreen;
