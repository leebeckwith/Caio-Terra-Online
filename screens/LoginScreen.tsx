import React, {useEffect, useState} from 'react';
import {
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Password from '../components/PasswordTextBox';
import Loader from '../components/Loader';
import {useDispatch, useSelector} from 'react-redux';
import {setLoading} from '../redux/loadingSlice';
import {setCachedVideos} from '../redux/cachedVideoSlice';
import {setCachedLessonVideos} from '../redux/cachedLessonVideoSlice';
import {setCachedCurriculumVideos} from '../redux/cachedCurriculumVideoSlice';
import Orientation from 'react-native-orientation-locker';
import {storeCredentials, getCredentials} from '../storage';
import SInfo from 'react-native-sensitive-info';
import CTAStyles from '../styles/styles';

interface Category {
  term_id: number;
  name: string;
  slug: string;
  lessons: Lesson[];
}

interface Lesson {
  id: number;
  title: string;
  thumburl: string;
  lessonData: [];
  vimeoid: number;
  showSubItems: boolean;
}

const LoginScreen = () => {
  const [log, setUsername] = useState('');
  const [pwd, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const loading = useSelector(state => state.loader.value);
  const dispatch = useDispatch();

  useEffect(() => {
    Orientation.lockToPortrait();
  }, []);

  const handleForgottenPassword = async () => {
    if (!email) {
      Alert.alert('Invalid Login', 'Please enter a username and password.');
      return false;
    } else {
      try {
        const queryParams = new URLSearchParams({
          email: email,
        });
        const response = await fetch(
          `https://caioterra.com/ct_get/ct_resetpassword?${queryParams.toString()}`,
          {
            method: 'GET',
          },
        );
        const responseData = await response.json();
        if (responseData) {
          Alert.alert('Success', 'Reset password link was sent to ' + email);
          setEmail('');
          setModalVisible(!modalVisible);
        }
      } catch (error) {
        console.error('Error sending reset password: ', error);
        Alert.alert('Error', `Error sending reset password: ${error}`);
      }
    }
  };

  const handleLogin = async () => {
    if (!log || !pwd) {
      Alert.alert('Invalid Login', 'Please enter a username and password.');
      return false;
    } else {
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
            dispatch(setLoading(true));
            await SInfo.setItem(
              'cta-vimeo-key',
              '91657ec3585779ea01b973f69aae2c9c',
              {},
            );
            const {user_id, display_name, user_email} = responseData;
            await storeCredentials(log, pwd, user_id, display_name, user_email);

            const response = await fetch(
              'https://caioterra.com/app-api/get-videos.php',
            );
            const data = await response.json();

            const {username, password} = await getCredentials();

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
                    ? {...video, favorite: true}
                    : video,
                );
                dispatch(setCachedVideos(updatedData));
              } else {
                dispatch(setCachedVideos(data));
              }

              const lessonDataResponse = await fetch(
                'https://caioterra.com/app-api/get-plans.php',
              );
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              const lessonData = await lessonDataResponse.json();
              dispatch(setCachedLessonVideos(lessonData));

              const curriculumResponse = await fetch(
                'https://caioterra.com/app-api/get-curriculum.php',
              );
              if (!response.ok) {
                throw new Error('Network response was not ok.');
              }

              const curriculumData: Record<string, Category> =
                await curriculumResponse.json();
              const categoryArray = Object.values(curriculumData);
              const sortedCategories = sortCategories(categoryArray);
              dispatch(setCachedCurriculumVideos(sortedCategories));

              navigation.navigate('Main', {screen: 'Videos', initial: false});
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
    }
  };

  const sortCategories = (categoryArray: Category[]): Category[] => {
    const sortedCategories = categoryArray.sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    // Find and move "Introduction" category to the beginning
    const introductionCategoryIndex = sortedCategories.findIndex(
      category => category.name === 'Introduction',
    );
    if (introductionCategoryIndex !== -1) {
      const introductionCategory = sortedCategories.splice(
        introductionCategoryIndex,
        1,
      )[0];
      sortedCategories.unshift(introductionCategory);
    }

    return sortedCategories;
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
                Please enter your email address. You will receive a link to
                reset your password.
              </Text>
              <TextInput
                autoFocus={true}
                autoComplete="email"
                autoCapitalize="none"
                placeholder="Email address"
                keyboardType="default"
                style={[CTAStyles.cta_input, styles.input, styles.wide]}
                returnKeyType="next"
                placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                blurOnSubmit={false}
                value={email}
                onChangeText={text => setEmail(text)}
              />
              <Pressable
                style={[CTAStyles.active, CTAStyles.shadowProp, styles.button]}
                onPress={handleForgottenPassword}>
                <Text style={CTAStyles.text_light}>REQUEST PASSWORD RESET</Text>
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
            placeholder="Email"
            keyboardType="default"
            style={[CTAStyles.cta_input, styles.input]}
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
            <Text style={[CTAStyles.text_light, styles.label]}>
              Forgot password?
            </Text>
          </Pressable>
          <Pressable
            onPress={handleLogin}
            style={[
              styles.button,
              CTAStyles.shadowProp,
              log && pwd ? CTAStyles.active : CTAStyles.inactive,
            ]}>
            <Text style={CTAStyles.text_light}>SUBSCRIBER SIGN IN</Text>
          </Pressable>
        </View>
      </View>
      <Modal visible={loading} transparent animationType="none">
        <Loader />
      </Modal>
    </SafeAreaView>
  );
};

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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '85%',
    backgroundColor: '#333',
    paddingTop: 20,
    paddingLeft: 30,
    paddingRight: 30,
    alignItems: 'center',
  },
  modalText: {
    color: '#fff',
    marginBottom: 20,
    textAlign: 'left',
  },
  button: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 20,
  },
  input: {
    width: '80.5%',
    marginBottom: 20,
    padding: 10,
  },
  wide: {
    width: 300,
  },
  label: {
    padding: 10,
    textAlign: 'right',
  },
  logo: {
    padding: 0,
    marginTop: 20,
    height: 36,
  },
  forgot: {
    marginTop: -10,
    marginBottom: 10,
    color: '#fff',
    width: '81.5%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
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
    marginLeft: 10,
  },
});

export default LoginScreen;
