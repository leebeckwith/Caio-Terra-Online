import React, {useEffect, useState} from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
//import {useNavigation} from '@react-navigation/native';
import Password from '../components/PasswordTextBox';
import CTAStyles from '../styles/styles';
import WebView from 'react-native-webview';
//import {adapty} from 'react-native-adapty';

function CreateAccountScreen(): React.JSX.Element {
  const [pwd, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [repeat_pwd, setRepeatPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [privacyPolicyHTML, setPrivacyPolicyHTML] = useState('');
  //const navigation = useNavigation();

  useEffect(() => {
    // const initializeAdaptyPaywall = async () => {
    //   try {
    //     const id = 'cta_online_placement';
    //     const locale = 'en';
    //
    //     const paywall = await adapty.getPaywall(id, locale);
    //     const products = await adapty.getPaywallProducts(paywall);
    //     console.log(products);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };
    const fetchPrivacyPolicy = async () => {
      try {
        const response = await fetch(
          'https://caioterra.com/ct_get/ct_getprivacy/',
        );
        const data = await response.json();

        if (data && data.post_content) {
          setPrivacyPolicyHTML(data.post_content);
        } else {
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchPrivacyPolicy();
    //initializeAdaptyPaywall();
  }, []);

  const checkUserExists = async () => {
    try {
      const queryParams = new URLSearchParams({
        email: email,
      });

      const response = await fetch(
        `https://caioterra.com/ct_get/ct_userexists/?${queryParams.toString()}`,
        {
          method: 'GET',
        },
      );

      const responseData = await response.json();
      return responseData !== true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleCreateAccount = async productId => {
    if (!email || !pwd || !repeat_pwd) {
      Alert.alert(
        'Error',
        'Please enter all information to create your account.',
      );
      return false;
    } else {
      const userDoesNotExist = await checkUserExists();
      if (userDoesNotExist) {
        console.log(productId);
        // enable Adapty payment and account activation
      } else {
        Alert.alert(
          'Error',
          "You can't use the information you provided to create a new account.",
        );
      }
    }
  };

  return (
    <ScrollView style={styles.background}>
      <View>
        <View style={styles.container}>
          <Text style={[CTAStyles.text_light, styles.text]}>
            Sign up and get access to over 2600 crystal-clear HD videos!
          </Text>
          <TextInput
            autoCapitalize="none"
            placeholder="Email"
            inputMode="email"
            style={[CTAStyles.cta_input, styles.input]}
            placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
            value={email}
            onChangeText={text => setEmail(text)}
          />
          <Password
            label="Password"
            value={pwd}
            onChange={text => setPassword(text)}
          />
          <Password
            label="Repeat Password"
            value={repeat_pwd}
            onChange={text => setRepeatPassword(text)}
          />
          <Pressable
            style={styles.terms}
            onPress={() => setModalVisible(!modalVisible)}>
            <Text style={[CTAStyles.text_link, styles.text]}>
              By creating an account and using this app, you consent to the
              Privacy Policy
            </Text>
          </Pressable>
          <Pressable
            onPress={() => handleCreateAccount('annual_sub')}
            style={[
              styles.button,
              CTAStyles.shadowProp,
              email && pwd && repeat_pwd && pwd === repeat_pwd
                ? CTAStyles.active
                : CTAStyles.inactive,
            ]}>
            <Text style={CTAStyles.text_light}>
              ANNUAL SUBSCRIPTION ($249.99)
            </Text>
          </Pressable>
          <Pressable
            onPress={() => handleCreateAccount('monthly_sub')}
            style={[
              styles.button,
              CTAStyles.shadowProp,
              email && pwd && repeat_pwd && pwd === repeat_pwd
                ? CTAStyles.active
                : CTAStyles.inactive,
            ]}>
            <Text style={CTAStyles.text_light}>
              MONTHLY SUBSCRIPTION ($24.99)
            </Text>
          </Pressable>
        </View>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}>
        <Pressable style={styles.modalContainer}>
          <Pressable>
            <View style={styles.modalView}>
              <Text style={[styles.modalText, styles.title]}>
                Caio Terra Online Privacy Policy
              </Text>
              <ScrollView indicatorStyle="white" style={styles.privacyPolicy}>
                <View style={styles.policy}>
                  <WebView
                    style={styles.privacyPolicy}
                    originWhitelist={['*']}
                    source={{html: privacyPolicyHTML, baseUrl: ''}}
                  />
                </View>
              </ScrollView>
              <Pressable
                style={[CTAStyles.inactive, styles.button]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={CTAStyles.text_light}>CLOSE</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    width: '80%',
    flexDirection: 'row',
    marginLeft: 30,
    marginRight: 30,
    paddingBottom: 20,
  },
  terms: {
    padding: 0,
    width: '96%',
  },
  input: {
    width: '80.5%',
    marginBottom: 20,
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  modalView: {
    width: '90%',
    maxHeight: '100%',
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
  title: {
    fontWeight: 'bold',
  },
  privacyPolicy: {
    height: '75%',
    width: 320,
    paddingBottom: 20,
    flexDirection: 'row',
  },
  policy: {
    height: '100%',
    flex: 1,
  },
});

export default CreateAccountScreen;
