import React, {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginManagerScreen from './screens/LoginManagerScreen';
import MainManagerScreen from './screens/MainManagerScreen';
import {VideoModalProvider} from './components/VideoPlayerModalContext';
import VideoPlayerModal from './components/VideoPlayerModal';
import {Provider} from 'react-redux';
import store from './store';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <Provider store={store}>
      <VideoModalProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Login" component={LoginManagerScreen} />
            <Stack.Screen name="Main" component={MainManagerScreen} />
          </Stack.Navigator>
          <VideoPlayerModal />
        </NavigationContainer>
      </VideoModalProvider>
    </Provider>
  );
}

export default App;
