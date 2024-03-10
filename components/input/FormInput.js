import React from 'react';
import {View, TextInput, StyleSheet, Dimensions} from 'react-native';

import {AntDesign} from '@expo/vector-icons';
import { ThemeContext } from '../../navigation/ThemeProvider';

const windowHeight = Dimensions.get('window').height;

const FormInput = ({labelValue, placeholderText, iconType, ...rest}) => {

  const {theme} = React.useContext(ThemeContext);

  return (
    <View style={[styles.inputContainer, {background: theme.colors.background, borderColor: theme.colors.placeholder,}]}>
      <View style={styles.iconStyle}>
        <AntDesign name={iconType} size={25} color={theme.colors.primary} />
      </View>
      <TextInput
        value={labelValue}
        style={[styles.input, {color: theme.colors.text}]}
        numberOfLines={1}
        placeholder={placeholderText}
        placeholderTextColor={theme.colors.placeholder}
        {...rest}
      />
    </View>
  );
};

export default FormInput;

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
    borderRightColor: '#ccc',
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
});