import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeCredentials = async (username: string, password: string) => {
  try {
    await AsyncStorage.setItem('username', username);
    await AsyncStorage.setItem('password', password);
    await AsyncStorage.setItem('userToken', 'blahblahblah');
  } catch (error) {
    console.error('Error storing credentials:', error);
  }
};

export const getCredentials = async () => {
  try {
    const username = await AsyncStorage.getItem('username');
    const password = await AsyncStorage.getItem('password');
    return {username, password};
  } catch (error) {
    console.error('Error getting credentials:', error);
    return {username: null, password: null};
  }
};

export const clearCredentials = async () => {
  try {
    await AsyncStorage.removeItem('username');
    await AsyncStorage.removeItem('password');
  } catch (error) {
    console.error('Error clearing credentials:', error);
  }
};
