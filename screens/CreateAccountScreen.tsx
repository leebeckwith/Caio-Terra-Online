import React, {useState} from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Password from '../components/PasswordTextBox';

function CreateAccountScreen(): React.JSX.Element {
  // Data for login
  const [log, setUsername] = useState('');
  const [pwd, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [repeat_pwd, setRepeatPassword] = useState('');
  // useNavigation hook to access navigation object
  const navigation = useNavigation();

  // use API to validate username and password
  const handleCreateAccount = async productId => {
    if (!log || !pwd || !email || !repeat_pwd) {
      Alert.alert(
        'Error',
        'Please enter the required information to create your account.',
      );
      return false;
    } else {
      console.log(productId);
      // enable payment and account activation
    }
  };

  // @ts-ignore
  return (
    <ScrollView style={styles.background}>
      <View>
        <View style={styles.container}>
          <Text style={styles.text}>
            Sign up and get access to over 2600 crystal-clear HD videos,
            including 25 offline video downloads per month!
          </Text>
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
            placeholder="Email"
            inputMode="email"
            style={styles.input}
            placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
          />
          <Password
            autoCapitalize="none"
            label="Password"
            value={pwd}
            onChange={text => setPassword(text)}
            style={styles.input}
          />
          <Password
            autoCapitalize="none"
            label="Repeat Password"
            value={repeat_pwd}
            onChange={text => setPassword(text)}
            style={styles.input}
          />
          <View style={styles.terms}>
            <Pressable>
              <Text style={[styles.text, styles.link]}>Terms & Conditions</Text>
            </Pressable>
            <Pressable>
              <Text style={[styles.text, styles.link]}>Privacy Policy</Text>
            </Pressable>
          </View>
          <Pressable
            onPress={() => handleCreateAccount('annual_sub')}
            style={[
              styles.button,
              styles.shadowProp,
              log && email && pwd && repeat_pwd
                ? styles.active
                : styles.inactive,
            ]}>
            <Text style={styles.label}>ANNUAL SUBSCRIPTION ($249.99)</Text>
          </Pressable>
          <Pressable
            onPress={() => handleCreateAccount('monthly_sub')}
            style={[
              styles.button,
              styles.shadowProp,
              log && pwd ? styles.active : styles.inactive,
            ]}>
            <Text style={styles.label}>MONTHLY SUBSCRIPTION ($24.99)</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'transparent',
    height: '100%',
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 20,
  },
  inactive: {
    backgroundColor: '#555',
  },
  active: {
    backgroundColor: '#00a6ff',
  },
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    display: 'flex',
    marginLeft: 30,
    marginRight: 30,
    paddingBottom: 20,
  },
  terms: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: '#fff',
  },
  link: {
    color: '#00a6ff',
  },
  input: {
    backgroundColor: '#fff',
    color: '#000',
    width: '80.5%',
    marginBottom: 20,
    padding: 10,
  },
  secondary: {
    backgroundColor: '#666',
  },
  shadowProp: {
    shadowColor: '#000',
    shadowOffset: {width: -3, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});

export default CreateAccountScreen;
