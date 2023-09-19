import React from 'react';
import {Alert, ScrollView, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Cell, Section, TableView} from 'react-native-tableview-simple';
import {clearCredentials} from '../storage';
import {useDispatch} from 'react-redux';
import {clearCachedVideos} from '../redux/cachedVideoSlice';
//import {WebView} from 'react-native-webview';
//import {Vimeo} from 'react-native-vimeo-iframe';

function AccountScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      await clearCredentials();
      dispatch(clearCachedVideos());
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={styles.stage}>
      <ScrollView>
        <TableView>
          {/*<Section>*/}
          {/*  <WebView*/}
          {/*    source={{*/}
          {/*      uri: 'https://player.vimeo.com/video/854515055',*/}
          {/*      headers: {Referer: 'https://caioterra.com'},*/}
          {/*    }}*/}
          {/*    params={*/}
          {/*      'api=1&playsinline=1&pip=0'*/}
          {/*    }*/}
          {/*    style={styles.videoPlayer}*/}
          {/*    // javaScriptEnabled={true}*/}
          {/*    allowsFullscreenVideo={false}*/}
          {/*    allowsInlineMediaPlayback*/}
          {/*    reference="https://caioterra.com"*/}
          {/*    scrollEnabled={false}*/}
          {/*    // injectedJavaScript='*/}
          {/*    // document.body.style.backgroundColor = "transparent";*/}
          {/*    // true;*/}
          {/*    // '*/}
          {/*    overScrollMode="never"*/}
          {/*  />*/}
          {/*</Section>*/}
          <Section footer="Caio Terra Online &copy; All rights reserved.">
            <Cell
              title="Help / FAQ"
              titleTextColor="#007AFF"
              onPress={() => console.log('open Help/FAQ')}
            />
            <Cell
              title="Log out"
              titleTextColor="#007AFF"
              onPress={handleLogout}
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
