import { View, Text } from '@tarojs/components';
import './index.scss';

export default function User() {
  return (
    <View className="user">
      <View className="user__header">
        <Text className="user__title">我的</Text>
      </View>
      <View className="user__content">
        <Text className="user__desc">个人中心页面</Text>
      </View>
    </View>
  );
}
