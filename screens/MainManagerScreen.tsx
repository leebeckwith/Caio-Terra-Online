import React from 'react';
import {useSelector} from 'react-redux';
import {Modal, Platform, SafeAreaView, StyleSheet, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Loader from '../components/Loader';
import VideoManagerScreen from './VideoManagerScreen';
import AccountManagerScreen from './AccountManagerScreen';
import CurriculumListingScreen from './CurriculumListingScreen';
import LessonPlansListingScreen from './LessonPlansListingScreen';
import Icon from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

function MainManagerScreen() {
  // @ts-ignore
  const loading = useSelector(state => state.loader.value);

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.tabContainer}>
        <Tab.Navigator
          initialRouteName="Videos"
          sceneContainerStyle={{
            backgroundColor: 'rgba(0, 0, 0, 0)',
          }}
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: 'rgba(58, 58, 58, 1)',
              ...Platform.select({
                ios: {
                  paddingTop: 5,
                  paddingBottom: 10,
                  marginBottom: 0,
                  height: 60,
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
            name="Account"
            component={AccountManagerScreen}
            options={{
              tabBarIcon: ({color, size}) => (
                <Icon name="user" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      </View>
      <Modal
        visible={loading} // Show the Loader component when loading state is true
        transparent
        animationType="none">
        <Loader />
      </Modal>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#000',
    flex: 1,
  },
  tabContainer: {
    flex: 1,
    position: 'relative',
    padding: 10,
  },
  sceneContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
});

export default MainManagerScreen;
