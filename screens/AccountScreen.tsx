import React from 'react';
import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Cell, Section, TableView} from 'react-native-tableview-simple';
import {clearCredentials} from '../storage';
import {useDispatch} from 'react-redux';
import {clearCachedVideos} from '../redux/cachedVideoSlice';
import {clearCachedLessonVideos} from '../redux/cachedLessonVideoSlice';
import {clearCachedCurriculumVideos} from '../redux/cachedCurriculumVideoSlice';
import CTAStyles from '../styles/styles';

function AccountScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      Alert.alert(
        'Confirm Sign Out',
        'Are you sure you want to sign out?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Sign Out',
            onPress: () => {
              clearCredentials();
              dispatch(clearCachedVideos());
              dispatch(clearCachedLessonVideos());
              dispatch(clearCachedCurriculumVideos());
              navigation.navigate('Login');
            },
          },
        ],
        {cancelable: false},
      );
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={CTAStyles.container}>
      <View>
        <TableView>
          <Section
            header="CTA ONLINE APP"
            footer="Caio Terra Online &copy; All rights reserved.">
            <Cell
              backgroundColor={'black'}
              cellStyle="RightDetail"
              titleTextColor="#fff"
              title="Version"
              titleTextStyle={styles.text}
              detailTextStyle={styles.text}
              detail="2.0.1"
            />
          </Section>
        </TableView>
        <Pressable
          onPress={handleLogout}
          style={[styles.button, CTAStyles.active]}>
          <Text style={[styles.buttonText, CTAStyles.text_light]}>
            SIGN OUT
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    textAlign: 'center',
  },
  button: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  text: {
    fontSize: 14,
  },
});

export default AccountScreen;
