import React from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import ActionSheet, {ScrollView}  from 'react-native-actions-sheet';
import ITEMS from '../../constants/LabelItem';

const CIRCLE_SIZE = 18;
const CIRCLE_RING_SIZE = 2;

function Option({ title, subtitle, value, onPress, type = 'switch' }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.option}>
        <View style={{ flex: 1 }}>
          <Text style={styles.optionTitle}>{title}</Text>
          <Text style={styles.optionText}>{subtitle}</Text>
        </View>
        <View style={{ flex: 1, maxWidth: 72, alignItems: 'flex-end' }}>
          {type === 'radio' && (
            <View style={styles.circle}>
              <View
                style={[
                  styles.circleInside,
                  value && { backgroundColor: '#7259e2' },
                ]}
              />
            </View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
// 代码：https://withfra.me/components/action-sheet google登录可查看

export default function LabelSheet({sheet,onButton}) {
  const [form, setForm] = React.useState(ITEMS.value[0].title);

  const renderLabelItem = (item) => {
    return (
      <Option
        key={item.key}
        type={item.type}
        title={item.title}
        subtitle={item.text}
        value={form == item.title}
        onPress={() => setForm(item.title)}
      />
    )
  }

  const handleButtonPress = () => {
    sheet.current.hide(); // 关闭ActionSheet
    if(onButton){
      onButton(form)
    }
  }

  return (
    <ActionSheet 
      customStyles={{ container: styles.sheet }}
      height={530}
      openDuration={250}
      ref={sheet}>
      <View style={styles.sheetHeader}>
        <Text style={styles.sheetHeaderTitle}>{ITEMS.title}</Text>
      </View>
      <View style={styles.sheetBody}>

        <View style={styles.section}>
          <Text style={styles.sectionText}>{ITEMS.name}</Text>
          <ScrollView style={{maxHeight: 200}} showsVerticalScrollIndicator={false}>
            {ITEMS.value.map((item, index) => renderLabelItem(item))}
          </ScrollView>
        </View>

        <TouchableOpacity 
          style={styles.btn}
          onPress={handleButtonPress}
        >
          <Text style={styles.btnText}>{ITEMS.button}</Text>
        </TouchableOpacity>
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  /** Option */
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fafafa',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 8,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0d0c22',
    marginBottom: 6,
  },
  optionText: {
    fontSize: 12,
    lineHeight: 20,
    fontWeight: '400',
    color: '#a8a8a8',
  },
  /** Circle */
  circle: {
    width: CIRCLE_SIZE + CIRCLE_RING_SIZE * 4,
    height: CIRCLE_SIZE + CIRCLE_RING_SIZE * 4,
    borderRadius: 999,
    backgroundColor: 'white',
    borderWidth: CIRCLE_RING_SIZE,
    borderColor: '#d4d4d4',
    marginRight: 8,
    marginBottom: 12,
  },
  circleInside: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: 999,
    backgroundColor: '#f0f0f0',
    position: 'absolute',
    top: CIRCLE_RING_SIZE,
    left: CIRCLE_RING_SIZE,
  },
  /** Placeholder */
  placeholder: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    height: 400,
    marginTop: 0,
    padding: 24,
    backgroundColor: 'transparent',
  },
  placeholderInset: {
    borderWidth: 4,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 9,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  /** Sheet */
  sheet: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  sheetHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  sheetHeaderTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  sheetBody: {
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  /** Section */
  section: {
    paddingTop: 24,
  },
  sectionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#b1b1b1',
    textTransform: 'uppercase',
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  /** Button */
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    padding: 14,
    borderWidth: 1,
    borderColor: '#7259e2',
    marginTop: 24,
    backgroundColor: '#7259e2',
  },
  btnText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
});