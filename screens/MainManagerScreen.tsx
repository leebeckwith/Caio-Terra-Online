import React from 'react';
import {Alert, SafeAreaView, StyleSheet, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AccountScreen from './AccountScreen';
import VideoManagerScreen from './VideoManagerScreen';
import CurriculumListingScreen from './CurriculumListingScreen';
import LessonPlanManagerScreen from './LessonPlanManagerScreen';
import Orientation from 'react-native-orientation-locker';
import {useNavigation} from '@react-navigation/native';
import {clearCredentials} from '../storage';
import {useDispatch} from 'react-redux';
import CTAStyles from '../styles/styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import {clearCachedVideos} from '../redux/cachedVideoSlice';

const Tab = createBottomTabNavigator();

function MainManagerScreen() {
  Orientation.unlockAllOrientations();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      Alert.alert(
        'Confirm Sign Out',
        'Are you sure you want to sign out?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Sign Out',
            onPress: () => {
              clearCredentials();
              dispatch(clearCachedVideos());
              navigation.navigate('Login');
            },
          },
        ],
        {cancelable: false},
      );
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <SafeAreaView style={[CTAStyles.cta_black, styles.background]}>
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
              paddingTop: 8,
              paddingBottom: 8,
              height: 55,
              marginBottom: 0,
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
                <Icon name="youtube-play" color={color} size={24} />
              ),
            }}
          />
          <Tab.Screen
            name="Lessons"
            component={LessonPlanManagerScreen}
            options={{
              tabBarIcon: ({color, size}) => (
                <Icon name="book" color={color} size={24} />
              ),
            }}
          />
          <Tab.Screen
            name="Curriculum"
            component={CurriculumListingScreen}
            options={{
              tabBarIcon: ({color, size}) => (
                <Icon name="cubes" color={color} size={21} />
              ),
            }}
          />
          <Tab.Screen
            name="Info"
            component={AccountScreen}
            options={{
              tabBarIcon: ({color, size}) => (
                <Icon name="info-circle" color={color} size={22} />
              ),
            }}
          />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  tabContainer: {
    flex: 1,
    position: 'relative',
    padding: 10,
  },
});

export default MainManagerScreen;
