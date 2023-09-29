import React, {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginManagerScreen from './screens/LoginManagerScreen';
import MainManagerScreen from './screens/MainManagerScreen';
import {FavoriteProvider} from './components/FavoriteContext';
import {VideoModalProvider} from './components/VideoPlayerModalContext';
import VideoPlayerModal from './components/VideoPlayerModal';
import {Provider} from 'react-redux';
import store from './store';
import {adapty} from 'react-native-adapty';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  useEffect(() => {
    SplashScreen.hide();
    adapty.activate('public_live_JypviS8L.RoQCUaMMNOPiIJBMqtqN');
  }, []);

  return (
    <Provider store={store}>
      <FavoriteProvider>
        <VideoModalProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
              <Stack.Screen
                name="Login"
                component={LoginManagerScreen}
                options={{gestureEnabled: false}}
              />
              <Stack.Screen
                name="Main"
                component={MainManagerScreen}
                options={{gestureEnabled: false}}
              />
            </Stack.Navigator>
            <VideoPlayerModal />
          </NavigationContainer>
        </VideoModalProvider>
      </FavoriteProvider>
    </Provider>
  );
}

export default App;
