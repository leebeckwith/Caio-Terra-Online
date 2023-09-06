import React, {useEffect, useState} from 'react';
import {
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  Switch,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Password from '../components/PasswordTextBox';
import Loader from '../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {setLoading} from '../redux/loadingSlice';
import {setCachedVideos} from '../redux/cachedVideoSlice';
import {storeCredentials, getCredentials} from '../storage';

const LoginScreen = () => {
  // Data for login
  const [log, setUsername] = useState('');
  const [pwd, setPassword] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const navigation = useNavigation();
  const loading = useSelector(state => state.loader.value);
  const dispatch = useDispatch();

  useEffect(() => {
    const getKeepSignedIn = async () => {
      try {
        const keepSignedIn = await AsyncStorage.getItem('keepSignedIn');
        if (keepSignedIn !== null) {
          setIsEnabled(JSON.parse(keepSignedIn));
        }
      } catch (error) {
        console.error('Error reading "Keep me signed in" state: ', error);
        Alert.alert('Error', `Error reading logged in state: ${error}`);
      }
    };

    getKeepSignedIn();
  }, []);

  const handleLogin = async () => {
    dispatch(setLoading(true));
    if (!log || !pwd) {
      Alert.alert('Invalid Login', 'Please enter a username and password.');
      return;
    }

    try {
      const queryParams = new URLSearchParams({
        username: log,
        password: pwd,
      });

      const response = await fetch(
        `https://caioterra.com/ct_get/ct_users?${queryParams.toString()}`,
        {
          method: 'GET',
        },
      );

      const responseData = await response.json();

      if (response.ok) {
        if (responseData.user_id) {
          setIsSignedIn(true);
          const {user_id, display_name, user_email} = responseData;
          await storeCredentials(log, pwd, user_id, display_name, user_email);

          const response = await fetch(
            'https://caioterra.com/app-api/get-videos.php',
          );
          const data = await response.json();

          const { username, password } = await getCredentials();

          if (username && password) {
            const params = new URLSearchParams({
              username,
              password,
            });

            const apiUrl =
              'https://caioterra.com/app-api/get-favorites.php?' +
              params.toString();
            const favoritesResponse = await fetch(apiUrl);
            const favoritesData = await favoritesResponse.json();

            if (Array.isArray(favoritesData)) {
              const favoriteIds = favoritesData.map(item => Number(item.id));

              const updatedData = data.map(video =>
                favoriteIds.includes(video.id)
                  ? { ...video, favorite: true }
                  : video,
              );
              dispatch(setCachedVideos(updatedData));
              console.log('login: new w/ fav');
            } else {
              dispatch(setCachedVideos(data));
              console.log('login: new w/o fav');
            }
            navigation.navigate('Main', {screen: 'Videos', initial: false,});
          }
        } else if (
          responseData.errors &&
          responseData.errors.incorrect_password
        ) {
          Alert.alert('Error', 'Invalid username or password.');
        } else {
          Alert.alert('Error', 'Invalid username or password.');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'There was an error logging in.');
    } finally {
      dispatch(setLoading(false));
    }
  };
  const toggleSwitch = async () => {
    setIsEnabled((previousState) => !previousState);

    try {
      await AsyncStorage.setItem('keepSignedIn', JSON.stringify(!isEnabled));
    } catch (error) {
      console.error('Error storing "Keep me signed in" state: ', error);
      Alert.alert('Error', `There was an error storing your login: ${error}`);
    }
  };

  return (
    <SafeAreaView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}>
        <Pressable
          style={styles.modalContainer}
          onPress={() => setModalVisible(!modalVisible)}>
          <Pressable>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Please enter your username or email address. You will receive a
                a link to create a new password via email.
              </Text>
              <TextInput
                autoFocus={true}
                autoCapitalize="none"
                placeholder="Username or email address"
                keyboardType="default"
                style={styles.input}
                returnKeyType="next"
                placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                blurOnSubmit={false}
              />
              <Pressable
                style={[styles.button]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.label}>Reset Password</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
      <View style={styles.background}>
        <View style={styles.container}>
          <TextInput
            autoFocus={true}
            autoCapitalize="none"
            placeholder="Username"
            keyboardType="default"
            style={styles.input}
            returnKeyType="next"
            onChangeText={text => setUsername(text)}
            placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
            value={log}
            blurOnSubmit={false}
          />
          <Password
            label="Password"
            value={pwd}
            onChange={text => setPassword(text)}
          />
          <Pressable
            onPress={() => setModalVisible(true)}
            style={styles.forgot}>
            <Text style={styles.label}>Forgot password?</Text>
          </Pressable>
          <View style={styles.switchContainer}>
            <Text style={styles.label}>Keep me signed in</Text>
            <Switch
              trackColor={{false: '#333', true: '#00a6ff'}}
              thumbColor={isEnabled ? '#fff' : '#fff'}
              ios_backgroundColor="#222"
              onValueChange={toggleSwitch}
              style={styles.switch}
              value={isEnabled}
            />
          </View>
          <Pressable
            onPress={handleLogin}
            style={[styles.button, styles.shadowProp]}>
            <Text style={styles.label}>SUBSCRIBER LOGIN</Text>
          </Pressable>
        </View>
      </View>
      <Modal
        visible={loading}
        transparent
        animationType="none">
        <Loader />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'transparent',
    height: '100%',
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '85%',
    backgroundColor: '#000',
    padding: 35,
    alignItems: 'center',
  },
  modalText: {
    color: '#fff',
    marginBottom: 20,
    textAlign: 'left',
  },
  button: {
    backgroundColor: '#00a6ff',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 20,
  },
  secondary: {
    backgroundColor: '#666',
  },
  input: {
    backgroundColor: '#fff',
    color: '#000',
    width: '80%',
    marginBottom: 20,
    padding: 10,
  },
  label: {
    color: '#fff',
  },
  logo: {
    padding: 0,
    marginTop: 20,
    height: 36,
  },
  forgot: {
    color: '#fff',
    width: '80%',
    marginTop: -10,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    textAlign: 'right',
    width: '80%',
    marginBottom: 20,
    marginTop: 10,
  },
  switch: {
    marginLeft: 5,
  },
  shadowProp: {
    shadowColor: '#000',
    shadowOffset: {width: -3, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});

export default LoginScreen;
