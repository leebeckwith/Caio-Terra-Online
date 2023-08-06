import React from 'react';
import {Button, Alert, ScrollView, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Cell, Section, TableView} from 'react-native-tableview-simple';
import AsyncStorage from '@react-native-async-storage/async-storage';

function AccountScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      //Alert.alert('Logout', 'You have been logged out successfully.');
      // You can also add any additional logic or navigation after the user logs out
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={styles.stage}>
      <ScrollView>
        <TableView>
          <Section footer="Caio Terra Online &copy; All rights reserved.">
            <Cell
              title="Help / FAQ"
              titleTextColor="#007AFF"
              onPress={() => console.log('open Help/FAQ')}
            />
            <Cell
              title="Contact Us"
              titleTextColor="#007AFF"
              onPress={() => console.log('open Contact Us')}
            />
            <Cell
              title="Log out"
              titleTextColor="#007AFF"
              onPress={() => handleLogout()}
            />
          </Section>
        </TableView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default AccountScreen;
