import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeCredentials = async (
  username: string,
  password: string,
  user_id: string,
  display_name: string,
  user_email: string,
) => {
  try {
    const userToken = Date.now().toString();
    await AsyncStorage.setItem('username', username);
    await AsyncStorage.setItem('password', password);
    await AsyncStorage.setItem('userToken', userToken);
    await AsyncStorage.setItem('user_id', user_id.toString());
    await AsyncStorage.setItem('display_name', display_name);
    await AsyncStorage.setItem('user_email', user_email);
  } catch (error) {
    console.error('Error storing credentials:', error);
  }
};

export const getCredentials = async () => {
  try {
    const [username, password, user_token, user_id, display_name, user_email] =
      await Promise.all([
        AsyncStorage.getItem('username'),
        AsyncStorage.getItem('password'),
        AsyncStorage.getItem('userToken'),
        AsyncStorage.getItem('user_id'),
        AsyncStorage.getItem('display_name'),
        AsyncStorage.getItem('user_email'),
      ]);

    return {
      username,
      password,
      user_token,
      user_id,
      display_name,
      user_email,
    };
  } catch (error) {
    console.error('Error getting credentials:', error);
    return {username: null, password: null, user_id: null};
  }
};

export const clearCredentials = async () => {
  try {
    await AsyncStorage.removeItem('username');
    await AsyncStorage.removeItem('password');
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('user_id');
    await AsyncStorage.removeItem('display_name');
    await AsyncStorage.removeItem('user_email');
  } catch (error) {
    console.error('Error clearing credentials:', error);
  }
};
