import React from 'react';
import {View, TextInput,TouchableOpacity,Text, StyleSheet, Dimensions} from 'react-native';
import {AntDesign} from '@expo/vector-icons';
import { ThemeContext } from '../../navigation/ThemeProvider';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const CodeInput = ({labelValue, placeholderText,onChangeText, iconType,buttonTitle, ...rest}) => {

  const {theme,} = React.useContext(ThemeContext);

  return (
    <View style={[styles.inputContainer,{backgroundColor: theme.colors.background,borderColor: theme.colors.placeholder,}]}>
      <View style={[styles.iconStyle,{borderRightColor: theme.colors.placeholder,}]}>
        <AntDesign name={iconType} size={25} color={theme.colors.primary} />
      </View>
      <TextInput
        value={labelValue}
        style={[styles.input,{color: theme.colors.text,}]}
        numberOfLines={1}
        placeholder={placeholderText}
        placeholderTextColor={theme.colors.placeholder}
        keyboardType="numeric"
        maxLength={4}
        onChangeText={onChangeText}
      />
      <TouchableOpacity style={styles.buttonContainer} {...rest}>
        <Text style={[styles.buttonText,{color: theme.colors.text,}]}>{buttonTitle}</Text>
      </TouchableOpacity>
    </View>
  );
};

// 注册时，验证码输入框
export default CodeInput;

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 5,
    marginBottom: 10,
    width: '100%',
    height: windowHeight / 15,
    borderRadius: 3,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyle: {
    padding: 10,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    width: 50,
  },
  input: {
    padding: 10,
    flex: 1,
    fontSize: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputField: {
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
    width: windowWidth / 1.5,
    height: windowHeight / 15,
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  buttonContainer: {
    width: 140,
    height: windowHeight / 15,
    padding: 10,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  }
});
