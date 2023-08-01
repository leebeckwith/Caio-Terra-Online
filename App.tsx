import React, {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginManagerScreen from './screens/LoginManagerScreen';
import MainManagerScreen from './screens/MainManagerScreen';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  <style type="text/css">{`
    @font-face {
      font-family: 'FontAwesome';
      src: url(${require('react-native-vector-icons/Fonts/FontAwesome.ttf')}) format('truetype');
    }
  `}</style>;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Group>
          <Stack.Screen name="Login" component={LoginManagerScreen} />
          <Stack.Screen name="Home" component={MainManagerScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
