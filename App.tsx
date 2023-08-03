import React, {useState, useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginManagerScreen from './screens/LoginManagerScreen';
import MainManagerScreen from './screens/MainManagerScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  // const [authenticated, setAuthenticated] = useState(false);
  //
  // useEffect(() => {
  //   const checkAuthentication = async () => {
  //     try {
  //       // Check the user's authentication status in AsyncStorage
  //       const userToken = await AsyncStorage.getItem('userToken');
  //       //console.log(userToken);
  //       setAuthenticated(!!userToken);
  //       SplashScreen.hide();
  //     } catch (error) {
  //       console.error('Error checking authentication:', error);
  //     }
  //   };
  //
  //   checkAuthentication();
  // }, []);

  <style type="text/css">{`
    @font-face {
      font-family: 'FontAwesome';
      src: url(${require('react-native-vector-icons/Fonts/FontAwesome.ttf')}) format('truetype');
    }
  `}</style>;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginManagerScreen} />
        <Stack.Screen name="Main" component={MainManagerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
