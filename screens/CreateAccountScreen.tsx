import React, {useState} from 'react';
import {
  Alert, Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import {useNavigation} from '@react-navigation/native';
import Password from '../components/PasswordTextBox';
import CTAStyles from '../styles/styles';

function CreateAccountScreen(): React.JSX.Element {
  // Data for login
  const [log, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [pwd, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [repeat_pwd, setRepeatPassword] = useState('');
  // useNavigation hook to access navigation object
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  // use API to validate username and password
  const handleCreateAccount = async productId => {
    if (!log || !pwd || !email || !repeat_pwd) {
      Alert.alert(
        'Error',
        'Please enter all information to create your account.',
      );
      return false;
    } else {
      console.log(productId);
      // enable Adapty payment and account activation
    }
  };

  // @ts-ignore
  return (
    <ScrollView style={styles.background}>
      <View>
        <View style={styles.container}>
          <Text style={[CTAStyles.text_light, styles.text]}>
            Sign up and get access to over 2600 crystal-clear HD videos!
          </Text>
          <TextInput
            autoCapitalize="none"
            placeholder="Username"
            style={[CTAStyles.cta_input, styles.input]}
            onChangeText={text => setUsername(text)}
            placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
            value={log}
          />
          <TextInput
            autoCapitalize="none"
            placeholder="Email"
            inputMode="email"
            style={[CTAStyles.cta_input, styles.input]}
            placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
          />
          <TextInput
            placeholder="First Name"
            style={[CTAStyles.cta_input, styles.input]}
            onChangeText={text => setFirstName(text)}
            placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
            value={firstName}
          />
          <TextInput
            placeholder="Last Name"
            style={[CTAStyles.cta_input, styles.input]}
            onChangeText={text => setLastName(text)}
            placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
            value={lastName}
          />
          <Password
            label="Password"
            value={pwd}
            onChange={text => setPassword(text)}
          />
          <Password
            label="Repeat Password"
            value={repeat_pwd}
            onChange={text => setPassword(text)}
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
              log && email && firstName && lastName && email && repeat_pwd
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
              log && pwd ? CTAStyles.active : CTAStyles.inactive,
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
                  <Pressable>
                    <Text style={styles.modalText}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Aliquot scelerisque malesuada mauris vel dictum. Duis tempus
                      nunc vitae lacus accumsan, egestas commodo ligula ultricies.
                      ultricies. Nam dignissim fringilla augue, eu lobortis leo
                      pretium eget. pretium eget. odio eget auctor faucibus, dolor
                      ultricies lectus turpis id lacus. Suspendisse porta metus at
                      eros imperdiet, vel semper tellus aliquam. Mauris posuere
                      interdum finibus. Suspendisse luctus, velit eu hendrerit
                      pharetra, diam ex accumsan elit, egestas condimentum libero
                      erat erat libero erat ac urna.
                      {'\n'}
                      {'\n'}
                      Nunc ac elit in ipsum imperdiet
                      non id leo. Ut quis mattis metus. Etiam vulputate elit non
                      augue volutpat ullamcorper. In fermentum aliquet velit, ac
                      tincidunt at. Donec congue, orci vel tincidunt scelerisque,
                      mauris erat dictum turpis, id ornare sapien odio quis ipsum.
                      Nulla auctor feugiat tortor a blandit. Curabitur eu odio
                      fringilla, ornare augue ac, dictum nisi. Proin volutpat augue
                      quis scelerisque bibendum. Curabitur luctus, lectus vitae
                      pretium vehicula, nulla urna feugiat lectus, ut sagittis eros
                      ante sit amet diam. Aenean tincidunt, turpis vel aliquet
                      lacinia, odio turpis finibus augue, gravida ultrices augue
                      sapien vitae leo. Vestibulum ante ipsum primis in faucets orci
                      luctus et ultrices posuere cubilia curae; Nunc quis efficitur
                      augue, non facilisis justo. Nulla eros nisl, aliquam eu varius
                      id, blandit ac sem.
                      {'\n'}
                      {'\n'}
                      Nulla pretium urna non euismod eleifend.
                      blandit orci vel erat pretium consequat. Cras sed common non
                      non lacinia lectus. Nunc arcu erat, tristique in consequent quis,
                      quis, fringilla sit amet elit. Aliquam vitae imperdiet arcu.
                      placerat ipsum in imperdiet laoreet. Proin urna orci, ultricies
                      ut lectus in, euismod condimentum enim. Aenean vel mi dui. Class
                      aptent taciti sociosqu ad litora torquent per conubia nostra,
                      per inceptos himenaeos. Pellentesque habitant morbi tristique
                      senectus et netus et malesuada fames ac turpis egestas. Ut velit
                      risus, dictum non venenatis ut, bibendum at ipsum. Aenean tellus
                      sapien, fringilla at justo vel, vulputate pharetra purus. Donec
                      sit amet hendrerit enim, non tincidunt nunc.
                      {'\n'}
                      {'\n'}
                      Nullam quis lectus
                      nibh. Maecenas venenatis massa semper auctor fermentum. Nam vel
                      lectus tempor, elementum mauris et, placerat tellus. Morbi
                      auctor rhoncus ornare. Suspendisse nunc odio, hendrerit sit amet
                      tellus eget, consequat fermentum mauris. Suspendisse potenti.
                      Praesent justo urna, maximus interdum libero vel, imperdiet
                      egestas eros. Nam massa leo, ornare quis enim vel, vehicula
                      feugiat nisi. Nullam et libero vitae nunc lacinia hendrerit.
                      Vestibulum ac turpis eget erat interdum varius. Nam ligula est,
                      vulputate at turpis id, luctus vehicula lectus. Lorem ipsum
                      dolor sit amet, consectetur adipiscing elit. Praesent at dolor
                      ut urna hendrerit volutpat suscipit sit amet purus. Quisque et
                      ultricies ipsum. Donec lacinia augue quis lacus dignissim
                      blandit. Aliquam varius, leo vitae malesuada dignissim, mauris
                      purus ultrices neque, et rhoncus orci augue eget est. Sed
                      fermentum sollicitudin metus vel fermentum. Duis vulputate
                      interdum pretium.
                    </Text>
                  </Pressable>
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
    height: '60%',
    marginBottom: 20,
  },
  policy: {
    height: '100%',
    flex: 1,
  },
});

export default CreateAccountScreen;
