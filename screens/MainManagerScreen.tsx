import React from 'react';
import {StyleSheet, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import VideoManagerScreen from './VideoManagerScreen';
import AccountScreen from './AccountScreen';

const Tab = createBottomTabNavigator();

function MainManagerScreen(): React.JSX.Element {
  return (
    <View style={styles.background}>
      <Tab.Navigator
        initialRouteName="Videos"
        sceneContainerStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0)',
        }}
        style={styles.tabContainer}
        screenOptions={{
          tabBarScrollEnabled: false,
          tabBarIndicatorStyle: {
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          },
          tabBarIndicatorContainerStyle: {
            //backgroundColor: 'rgba(0, 0, 0, 0)',
          },
          tabBarStyle: {
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            elevation: 0,
          },
          tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
          tabBarActiveTintColor: '#00a6ff',
        }}>
        <Tab.Screen name="Videos" component={VideoManagerScreen} />
        <Tab.Screen name="Favorites" component={AccountScreen} />
        <Tab.Screen name="Lesson Plans" component={AccountScreen} />
        <Tab.Screen name="Curiiculum" component={AccountScreen} />
        <Tab.Screen name="Account" component={AccountScreen} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#000',
    height: '100%',
    width: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    minHeight: '100%',
    marginLeft: 20,
    marginRight: 20,
  },
});

export default MainManagerScreen;
