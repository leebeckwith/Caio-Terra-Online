import React, {useState} from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';

function LoginScreen(): React.JSX.Element {
  // Data for login
  const [log, setUsername] = useState('');
  const [pwd, setPassword] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  // useNavigation hook to access navigation object
  const navigation = useNavigation();

  // use API to validate username and password
  const handleLogin = async () => {
    if (!log || !pwd) {
      Alert.alert('Invalid Login', 'Please enter a username and password.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('log', log);
      formData.append('pwd', pwd);
      formData.append('lwa', '1');
      formData.append('login-with-ajax', 'login');

      const response = await fetch(
        'https://caioterra.com/wp-admin/admin-ajax.php',
        {
          method: 'POST',
          body: formData,
        },
      );

      const responseData = await response.json();

      if (response.ok) {
        if (responseData.result === false) {
          Alert.alert('Error', responseData.error);
        } else {
          //Alert.alert('Login Successful', 'Welcome!');
          await AsyncStorage.setItem('userToken', 'blahblahblah');
          // @ts-ignore
          navigation.navigate('Main', {
            screen: 'Videos',
            initial: false,
          });
        }
      }
    } catch (error) {
      Alert.alert('Error', 'There was an error logging in.');
    }
  };

  const handleBrowse = () => {
    // @ts-ignore
    navigation.navigate('Main', {
      screen: 'Videos',
      initial: false,
    });
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
                //onChangeText={text => setRecoveryUsername(text)}
                placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                //value={log}
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
            <Text style={styles.label}>Subscriber Login</Text>
          </Pressable>
          <Pressable
            onPress={handleBrowse}
            style={[styles.button, styles.secondary, styles.shadowProp]}>
            <Text style={styles.label}>Browse as Guest</Text>
          </Pressable>
        </View>
      </View>
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
