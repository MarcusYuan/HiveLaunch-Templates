import { View, Text } from '@tarojs/components';
import { useLoad } from '@tarojs/taro';
import './index.scss';

export default function Index() {
  useLoad(() => {
    console.log('Page loaded.');
  });

  return (
    <View className="index">
      <View className="index__header">
        <Text className="index__title">欢迎使用 {{DISPLAY_NAME}}</Text>
      </View>
      <View className="index__content">
        <Text className="index__desc">
          基于 Taro + React + TypeScript + Tailwind CSS
        </Text>
      </View>
    </View>
  );
}
