/**
 * Caio Terra Online
 * Author: Mateo Nares
 *
 * @format
 */
import React, {useState} from 'react';
import {
  Alert,
  Button,
  Linking,
  SafeAreaView,
  Switch,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {useNavigation} from '@react-navigation/native';
import Password from '../components/PasswordTextBox';
import AsyncStorage from '@react-native-async-storage/async-storage';

function LoginScreen(): React.JSX.Element {
  // Data for login
  const [log, setUsername] = useState('');
  const [pwd, setPassword] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
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
      //console.log(responseData);

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

  // @ts-ignore
  return (
    <SafeAreaView>
      <View style={styles.background}>
        <View style={styles.container}>
          <TextInput
            autoCapitalize="none"
            placeholder="Username"
            style={styles.input}
            onChangeText={text => setUsername(text)}
            placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
            value={log}
          />
          <Password
            label="Password"
            value={pwd}
            onChange={text => setPassword(text)}
          />
          <TouchableOpacity
            onPress={() => Linking.openURL('http://google.com')}
            style={styles.forgot}>
            <Text style={styles.label}>Forgot password?</Text>
          </TouchableOpacity>
          <View style={styles.switchContainer}>
            <Text style={styles.label}>Keep me signed in</Text>
            <Switch
              //trackColor={{false: '#767577', true: '#81b0ff'}}
              //thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#222"
              onValueChange={toggleSwitch}
              style={styles.switch}
              value={isEnabled}
            />
          </View>
          <Button
            accessibilityLabel="Proceed to login"
            color="#00a6ff"
            title="Login"
            onPress={handleLogin}
          />
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
});

export default LoginScreen;
