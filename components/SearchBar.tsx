import React, {useState, FC} from 'react';
import {StyleSheet, Platform, TextInput, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface SearchBarProps {
  value: string;
  onChange: (text: string) => void;
  label?: string;
  height?: number;
  validators?: any[]; // You can replace 'any' with a more specific type for validators if needed
}

const SearchBar: FC<SearchBarProps> = props => {
  const [value, onChangeText] = useState<string>(props.value);
  const [visible, setVisibility] = useState<boolean>(false);
  //const [errorStatus, displayErrors] = useState<boolean>(false);

  const icon = !visible ? '' : 'close';

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Icon
          name="close"
          color="#333"
          onPress={() => setVisibility(!visible)}
          style={styles.icons}
        />
        <TextInput
          autoCapitalize="none"
          style={styles.input}
          onChangeText={text => {
            onChangeText(text);
            props.onChange(text);
          }}
          autoCorrect={false}
          returnKeyType="send"
          value={value}
          placeholder={props.label}
          placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
          secureTextEntry={!visible}
          blurOnSubmit={true}
        />
        <Icon
          name={icon}
          color="#333"
          onPress={() => setVisibility(!visible)}
          style={styles.icons}
        />
      </View>
    </View>
  );
};

Password.defaultProps = {
  label: '',
  height: 20,
};

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
  },
  container: {
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
    ...Platform.select({
      ios: {
        padding: 10,
      },
      android: {
        height: 50,
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 8,
        paddingRight: 10,
      },
    }),
    width: '81%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    color: '#000',
    width: '95%',
    textAlignVertical: 'center',
  },
  icons: {
    backgroundColor: '#fff',
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: 1,
  },
});

export default SearchBar;
