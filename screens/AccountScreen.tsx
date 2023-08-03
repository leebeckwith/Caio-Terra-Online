import React from 'react';
import {View, Button, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function AccountScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      //Alert.alert('Logout', 'You have been logged out successfully.');
      // You can also add any additional logic or navigation after the user logs out
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View>
      {/* Add any account-related content here */}
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

export default AccountScreen;
