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

export const setCachedVideos = async (videos: any) => {
  try {
    await AsyncStorage.setItem('cachedVideos', JSON.stringify(videos));
  } catch (error) {
    console.error('Error setting cached videos:', error);
  }
};

export const getCachedVideos = async () => {
  try {
    const cachedVideos = await AsyncStorage.getItem('cachedVideos');
    return cachedVideos ? JSON.parse(cachedVideos) : [];
  } catch (error) {
    console.error('Error getting cached videos:', error);
    return [];
  }
};

export const clearCachedVideos = async () => {
  try {
    // Use AsyncStorage.removeItem to clear the cached videos
    await AsyncStorage.removeItem('cachedVideos');
    return true; // Indicate success
  } catch (error) {
    console.error('Error clearing cached videos:', error);
    return false; // Indicate failure
  }
};

export const toggleFavoriteInCache = async (videoId: number) => {
  try {
    const cachedVideosString = await AsyncStorage.getItem('cachedVideos');

    if (!cachedVideosString) {
      return false;
    }

    const cachedVideos = JSON.parse(cachedVideosString);
    const updatedCachedVideos = cachedVideos.map((video: any) =>
      video.id === videoId ? { ...video, favorite: !video.favorite } : video
    );

    // Use AsyncStorage.setItem to update the cached videos
    await AsyncStorage.setItem('cachedVideos', JSON.stringify(updatedCachedVideos));
    return true;
  } catch (error) {
    console.error('Error toggling favorite status:', error);
    return false;
  }
}

