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
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

function LoginScreen(): React.JSX.Element {
  // Data for login
  const [log, setUsername] = useState('');
  const [pwd, setPassword] = useState('');
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
          navigation.navigate('Videos' as never); // Navigate to Videos after successful login
        }
      }
    } catch (error) {
      Alert.alert('Error', 'There was an error logging in.');
    }
  };

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
            placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
            value={log}
          />
          <TextInput
            autoCapitalize="none"
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            onChangeText={text => setPassword(text)}
            placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
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
    backgroundColor: '#fff',
    color: '#000',
    width: '80%',
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
});

export default LoginScreen;
