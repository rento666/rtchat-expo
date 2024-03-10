
import React from 'react';
import {View, TextInput, StyleSheet, TouchableOpacity, Text, Dimensions} from 'react-native';
import { ThemeContext } from '../../navigation/ThemeProvider';

const windowHeight = Dimensions.get('window').height;

export const SearchInput = ({labelValue,placeholderText,cannel,...rest}) => {

  const {theme} = React.useContext(ThemeContext);

  return (
    <View style={[styles.container,{backgroundColor: theme.colors.background,}]}>
      <TextInput
        value={labelValue}
        style={[styles.input,{backgroundColor: theme.colors.searchBackground,color: theme.colors.text,}]}
        numberOfLines={1}
        placeholder={placeholderText}
        placeholderTextColor={theme.colors.text}
        {...rest}
      />
      <TouchableOpacity style={styles.ToC} onPress={cannel}>
        <Text style={[styles.cannel,{color: theme.colors.text,}]}>取消</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: '100%',
    height: windowHeight / 15 + 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    padding: 5,
    flex: 1,
    fontSize: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  ToC: {
    flex: 0,
    paddingLeft: 10,
  },
  cannel: {
    fontSize: 16,
  },
});