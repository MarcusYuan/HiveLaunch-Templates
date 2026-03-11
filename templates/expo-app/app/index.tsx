import { Link } from 'expo-router';
import { View, Text } from 'react-native';

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-gray-900">
        Welcome to {{DISPLAY_NAME}}
      </Text>
      <Text className="mt-2 text-gray-600">
        Built with Expo + NativeWind
      </Text>
      <Link href="/(tabs)" className="mt-4 text-primary-600">
        Go to Tabs
      </Link>
    </View>
  );
}
