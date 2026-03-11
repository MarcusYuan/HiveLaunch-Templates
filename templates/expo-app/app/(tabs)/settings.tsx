import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-4 py-6">
        <Text className="text-2xl font-bold text-gray-900">Settings</Text>
        <Text className="mt-2 text-gray-600">
          App settings will go here.
        </Text>
      </View>
    </SafeAreaView>
  );
}
