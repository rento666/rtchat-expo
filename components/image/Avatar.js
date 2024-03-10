import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, PanResponder, Animated, StyleSheet } from 'react-native';

const UserAvatarWithDraggableBadge = ({ source, badgeCount, isBlocked }) => {

  const [badgeAnimation] = useState(new Animated.ValueXY({ x: 0, y: 0 }));
  const [haveBadge, setHaveBadge] = useState(badgeCount > 0);
  const fadeAnimation = useRef(new Animated.Value(1)).current;

  const [panResponder, setPanResponder] = useState(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: badgeAnimation.x, dy: badgeAnimation.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gestureState) => {
        let x = Math.abs(gestureState.dx);
        let y = Math.abs(gestureState.dy);
        if ((x > 100 || y > 100) && (x < 200 || y < 200) ) {
          // 在这里触发清除动画
          clearBadge();
        } else {
          // 在这里可以处理其他拖动释放的逻辑
          // 例如将角标复位到原来位置
          resetBadgePosition();
        }
      },
    })
  );

  const clearBadge = () => {
    // 触发清除动画
    // 你可以在这里添加相应的清除逻辑
    // 这里示例将透明度和位移变为0
    Animated.timing(fadeAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // 动画结束后可以执行一些操作
      // 例如清除角标
      // setHaveBadge(false);
    });
  };

  const resetBadgePosition = () => {
    // 将角标复位到原来位置
    Animated.spring(badgeAnimation, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const renderBadgeContent = () => {
    if (isBlocked) {
      // 如果消息被屏蔽，显示一个小红点
      return null;
    } else {
      // 如果消息没有被屏蔽，显示消息数量
      return (
        <Text style={styles.badgeText}>{badgeCount}</Text>
      );
    }
  };

  useEffect(() => {
    // 监听badgeCount的变化，更新haveBadge状态
    setHaveBadge(badgeCount > 0);
  }, [badgeCount]);

  return (
    <View style={styles.avatarContainer}>
      <Image source={source} style={styles.avatar} />
      {badgeCount > 0 && haveBadge == true && (
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            !isBlocked && styles.badgeContainer,
            isBlocked && styles.smallRedDot,
            {
              transform: badgeAnimation.getTranslateTransform(),
              opacity: fadeAnimation,
            },
          ]}
        >
          {/* <Text style={styles.badgeText}>{badgeCount}</Text> */}
          {renderBadgeContent()}
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  badgeContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'red',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 20,
    height: 20,
    padding: 2,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  smallRedDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'red',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 10,       // 或者你认为合适的宽度
    height: 10,      // 或者你认为合适的高度
    padding: 2,
  },
});

export default UserAvatarWithDraggableBadge;
