/**
 * Caio Terra Online
 * Author: Mateo Nares
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {
  Alert,
  Button,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

function App(): React.JSX.Element {
  // Data for login
  const [log, setUsername] = useState('');
  const [pwd, setPassword] = useState('');

  // use API to validate username and password
  const handleLogin = async () => {
    console.log(log + " " + pwd);
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
      console.log(response);

      if (response.ok) {
        if (responseData.result === false) {
          Alert.alert('Error', responseData.error);
        } else {
          Alert.alert('Login Successful', 'Welcome!');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'There was an error logging in.');
    }
  };

  // show splash screen and hide when app is loaded
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <SafeAreaView>
      <ImageBackground
        source={require('./assets/images/caio-terra-app.jpg')}
        style={styles.background}>
        <View style={styles.container}>
          <TextInput
            autoCapitalize="none"
            placeholder="Username"
            style={styles.input}
            onChangeText={text => setUsername(text)}
            placeholderTextColor={'rgba(255, 255, 255, 0.5)'}
            value={log}
          />
          <TextInput
            autoCapitalize="none"
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            onChangeText={text => setPassword(text)}
            placeholderTextColor={'rgba(255, 255, 255, 0.5)'}
            value={pwd}
          />
          <Button title="Login" onPress={handleLogin} />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    height: '100%',
    width: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    color: '#ffffff',
    width: '80%',
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default App;
