import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 存储字符串值
 * @param {string} key 
 * @param {string} value 
 * @returns {Promise} Promise boolean
 */
export async function setString(key, value) {
  try {
    if(key == null){
      console.log('set string err: key is null')
      return false
    }
    if(value == null){
      console.log('set string err: value is null')
      return false
    }
    await AsyncStorage.setItem(key, value);
    return true
  } catch (e) {
    console.log('set string err: ', e)
    return false
  }
}

/**
 * 存储对象值（非字符串）
 * @param {string} key 键
 * @param {*} value 值
 * @returns {Promise} Promise boolean
 */
export async function setData(key, value) {
  try {
    if(key == null){
      console.log('set data err: key is null')
      return false
    }
    if(value == null){
      console.log('set data err: value is null')
      return false
    }
    console.log('set data: ', value)
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true
  } catch (e) {
    console.log('set data err: ', e)
    return false
  }
}

export async function removeItem(key) {
  try {
    if(key == null){
      console.log('remove data err: key is null')
      return false
    }
    await AsyncStorage.removeItem(key)
    return true
  } catch (e) {
    console.log('remove data err: ', e)
    return false
  }
}

/**
 * 读取字符串值
 * @param {string} key 
 * @returns {Promise} Promise value
 */
export async function getString(key) {
  try {
    if (key == null) {
      console.log('get string err: key is null');
      return null;
    }
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    } else {
      console.log('Value is null.');
      return null;
    }
  } catch (e) {
    console.error('Error retrieving value:', e);
    return null;
  }
}

/**
 * 读取对象值
 * @param {string} key 
 * @returns {any} value
 */
export async function getData(key) {
  try {
    if (key == null) {
      console.log('get data err: key is null');
      return null;
    }
    const jsonValue = await AsyncStorage.getItem(key);
    if (jsonValue !== null) {
      return JSON.parse(jsonValue);
    } else {
      console.log('Data is null.');
      return null;
    }
  } catch (e) {
    console.error('Error retrieving data:', e);
    return null;
  }
}
