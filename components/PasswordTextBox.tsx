import React, {useState, FC} from 'react';
import {TextInput, View, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface PasswordProps {
  value: string;
  onChange: (text: string) => void;
  label?: string;
  height?: number;
  validators?: any[]; // You can replace 'any' with a more specific type for validators if needed
}

const Password: FC<PasswordProps> = props => {
  const [value, onChangeText] = useState<string>(props.value);
  const [visible, setVisibility] = useState<boolean>(false);
  //const [errorStatus, displayErrors] = useState<boolean>(false);

  const icon = !visible ? 'eye' : 'eye-slash';
  const iconColor = !visible ? '#333' : '#333';
  const height = props.height || 20;

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <TextInput
          autoCapitalize="none"
          style={styles.input}
          onChangeText={text => {
            onChangeText(text);
            props.onChange(text);
          }}
          // onBlur={() => {
          //     displayErrors(true);
          // }}
          value={value}
          placeholder={props.label}
          placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
          secureTextEntry={!visible}
        />
        <Icon
          name={icon}
          color={iconColor}
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
    alignItems: 'center',
    borderColor: '#e3e3e3',
    borderWidth: 1,
    padding: 10,
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
  },
});

export default Password;
