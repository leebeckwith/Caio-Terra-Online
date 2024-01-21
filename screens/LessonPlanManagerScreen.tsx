import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LessonPlansListingScreen from './LessonPlansListingScreen';
import LessonPlanDetailView from './LessonPlanDetailView';

const Stack = createStackNavigator();

const LessonPlanManagerScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="LessonPlanMatrix"
        component={LessonPlansListingScreen}
      />
      <Stack.Screen name="LessonDetails" component={LessonPlanDetailView} />
    </Stack.Navigator>
  );
};

export default LessonPlanManagerScreen;
