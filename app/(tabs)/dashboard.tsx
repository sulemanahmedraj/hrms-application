import { Text } from '@/components/ui/text';
import React from 'react';
import { ScrollView } from 'react-native';

export default function Dashboard() {
  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
        <Text>
            Hi Text
        </Text>
      {/* <View className="mb-4">
        <StaticChart
          title="User Registrations"
          data={[5, 20, 36, 10, 10, 20]}
          labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
        />
      </View>

      <View className="mb-4">
        <StaticChart
          title="Revenue"
          data={[50, 200, 360, 100, 100, 250]}
          labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
          color="#10B981"
        />
      </View> */}
    </ScrollView>
  );
}
