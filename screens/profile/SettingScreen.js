import React, { useContext,useState } from "react";
import { ScrollView, StyleSheet, Text, View,TouchableOpacity,TouchableWithoutFeedback,Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "../../navigation/ThemeProvider";
import { Feather as FeatherIcon,Ionicons } from '@expo/vector-icons';
import { setString } from "../../utils/storage";


const SettingScreen = ({navigation}) => {

  const {theme, showPost, setShowPost} = useContext(ThemeContext);
  const [showPost2, setShowPost2] = useState(showPost); // 是否展示动态？

  const SECTIONS = [
    {
      header: '系统设置',
      icon: 'settings',
      items: [
        { icon: 'aperture-outline', color: theme.colors.primary, label: '动态功能', value: showPost2, type: 'boolean' },
        { icon: 'bicycle-outline', color: theme.colors.primary, label: '正在开发中', type: 'link' }
      ]
    }
  ];

  const switchPost = (newValue) => {
    setShowPost2(newValue);
    if(showPost){
      setShowPost(false);
      setString('showPost', 'false');
    }else{
      setShowPost(true);
      setString('showPost', 'true');
    }
  }

  return (
    <SafeAreaView style={{flex: 1,}}>
      <ScrollView style={[styles.container,{backgroundColor: theme.colors.background,}]}
        contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
        showsVerticalScrollIndicator={false}>
        {SECTIONS.map(({ header, items }) => (
          <View style={styles.section} key={header}>
            <Text style={[styles.sectionHeader,{color: theme.colors.placeholder}]}>{header}</Text>
            {items.map(({ label, icon, type, value, color }, index) => {

              const TouchableComponent = type === 'link' ? TouchableOpacity : TouchableWithoutFeedback

              return (
                <TouchableComponent
                  key={label}
                  onPress={() => {  }}>
                  <View style={[styles.row,{backgroundColor: theme.colors.background,}]}>
                    <View style={[styles.rowIcon, { backgroundColor: color }]}>
                      <Ionicons
                        color="#fff"
                        name={icon}
                        size={18} />
                    </View>

                    <Text style={[styles.rowLabel,{color:theme.colors.text}]}>{label}</Text>

                    <View style={styles.rowSpacer} />

                    {type === 'boolean' && <Switch value={value} onValueChange={switchPost} />}

                    {type === 'link' && (
                      <FeatherIcon
                        color={theme.colors.primary}
                        name="chevron-right"
                        size={22} />
                    )}
                  </View>
                </TouchableComponent>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}
export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
  },
    /** Section */
section: {
  width: '100%',
  paddingHorizontal: 24,
},
sectionHeader: {
  paddingVertical: 12,
  fontSize: 12,
  fontWeight: '600',
  color: '#9e9e9e',
  textTransform: 'uppercase',
  letterSpacing: 1.1,
},
/** Row */
row: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  height: 50,
  backgroundColor: '#f2f2f2',
  borderRadius: 8,
  marginBottom: 12,
  paddingLeft: 12,
  paddingRight: 12,
},
rowIcon: {
  width: 32,
  height: 32,
  borderRadius: 9999,
  marginRight: 12,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
},
rowLabel: {
  fontSize: 17,
  fontWeight: '400',
  color: '#0c0c0c',
},
rowSpacer: {
  flexGrow: 1,
  flexShrink: 1,
  flexBasis: 0,
},
});