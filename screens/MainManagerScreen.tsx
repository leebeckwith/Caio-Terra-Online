import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import VideoManagerScreen from './VideoManagerScreen';
import AccountManagerScreen from './AccountManagerScreen';
import FavoritesListingScreen from './FavoritesListingScreen';
import CurriculumListingScreen from './CurriculumListingScreen';
import LessonPlansListingScreen from './LessonPlansListingScreen';
import Icon from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

function MainManagerScreen(): React.JSX.Element {
  // @ts-ignore
  return (
    <View style={styles.background}>
      <Tab.Navigator
        initialRouteName="Videos"
        sceneContainerStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0)',
        }}
        style={styles.tabContainer}
        screenOptions={{
          tabBarStyle: {
            backgroundColor: 'rgba(58, 58, 58, 1)',
            ...Platform.select({
              ios: {
                paddingTop: 5,
                paddingBottom: 32,
                marginBottom: 0,
              },
              android: {
                paddingTop: 5,
                paddingBottom: 5,
                marginBottom: 0,
              },
            }),
          },
          //tabBarActiveBackgroundColor: 'rgba(255, 255, 255, 0.2)',
          tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.4)',
          tabBarActiveTintColor: '#fff',
        }}>
        <Tab.Screen
          name="Videos"
          component={VideoManagerScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="video-camera" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Favorites"
          component={FavoritesListingScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="star" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Lesson Plans"
          component={LessonPlansListingScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="tasks" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Curriculum"
          component={CurriculumListingScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="book" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="My Account"
          component={AccountManagerScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="user" color={color} size={size} />
            ),
          }}
        />
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
