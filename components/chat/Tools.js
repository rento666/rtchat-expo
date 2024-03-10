import React, {useContext} from "react";
import { StyleSheet, Text, View, Pressable, Dimensions } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { ThemeContext } from "../../navigation/ThemeProvider";
import ITEMS from "../../constants/ToolsItem";

const windowWidth = Dimensions.get("window").width;

const ChatTool = () => {
  const {theme} = useContext(ThemeContext);
  const renderGridItem = (item) => {
    return (
      <View key={item.key} style={[styles.gridItem,{height: ((windowWidth- 40) * 0.3) }]}>
        <View style={styles.contentContainer}>
          <Pressable 
            style={[styles.iconContainer,{backgroundColor:theme.colors.background}]}
            onPress={() => console.log(item.name)}
          >
            <AntDesign name={item.icon} size={36} color={theme.colors.text} />
          </Pressable>
          <Text style={[styles.nameText,{color: theme.colors.text}]}>{item.name}</Text>
        </View>
      </View>
    )
  };

  return (
    <View style={styles.container}>
      {ITEMS.map((item, i) => renderGridItem(item))}
    </View>
  )
};

export default ChatTool;

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'row', // 横向布局
    flexWrap: 'wrap', // 超出一行换行
    justifyContent: 'space-between', // 平均分布子元素
    padding: 20,
  },
  gridItem: {
    width: '20%', // 控制每个格子的宽度，根据需要调整
    marginBottom: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center', // 居中对齐
  },
  iconContainer: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
    bottom: 10, // 调整图标与文字的间距
  },
  nameText: {
    fontSize: 12,
    textAlign: 'center',
  },
});