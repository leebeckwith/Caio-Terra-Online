import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AccountScreen from './AccountScreen';

const Stack = createStackNavigator();

function AccountManagerScreen(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Account Manager" component={AccountScreen} />
    </Stack.Navigator>
  );
}

export default AccountManagerScreen;
