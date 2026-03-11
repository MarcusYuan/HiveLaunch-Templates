import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4">
        <View className="py-6">
          <Text className="text-3xl font-bold text-gray-900">
            Hello, World!
          </Text>
          <Text className="mt-2 text-gray-600">
            Welcome to your Expo app with NativeWind.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
