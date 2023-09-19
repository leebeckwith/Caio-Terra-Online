import React from 'react';
import {ImageBackground, Platform, StyleSheet} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import LoginScreen from './LoginScreen';
import CreateAccountScreen from './CreateAccountScreen';

const Tab = createMaterialTopTabNavigator();

function LoginManagerScreen(): React.JSX.Element {
  const tabBarMarginTop = Platform.OS === 'android' ? '10%' : '40%';

  return (
    <ImageBackground
      source={require('../assets/images/caio-terra-app.jpg')}
      style={styles.background}>
      <Tab.Navigator
        sceneContainerStyle={styles.sceneContainer}
        style={styles.tabContainer}
        screenOptions={{
          tabBarScrollEnabled: false,
          tabBarIndicatorStyle: {
            height: '100%',
            backgroundColor: 'rgba(0, 166, 255, 0.25)',
          },
          tabBarIndicatorContainerStyle: {
            //backgroundColor: 'rgba(255, 255, 255, 0)',
          },
          tabBarStyle: {
            backgroundColor: 'transparent',
            elevation: 0,
            marginTop: tabBarMarginTop,
          },
          tabBarLabelStyle: {
            fontWeight: 'bold',
          },
          tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
          tabBarActiveTintColor: '#fff',
        }}>
        <Tab.Screen name="Sign In" component={LoginScreen} />
        <Tab.Screen name="Create Account" component={CreateAccountScreen} />
      </Tab.Navigator>
      {/*<View style={styles.container}>*/}
      {/*  <Image*/}
      {/*    source={require('../assets/images/logo.png')}*/}
      {/*    style={styles.logo}*/}
      {/*  />*/}
      {/*</View>*/}
    </ImageBackground>
  );
}

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
    backgroundColor: 'rgba(0, 166, 255, 0.25)',
  },
  tabContainer: {
    minHeight: '50%',
    maxHeight: '90%',
    marginLeft: 20,
    marginRight: 20,
  },
});

export default LoginManagerScreen;
