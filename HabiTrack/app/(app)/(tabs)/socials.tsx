import { TextButton } from '@/components/TextButton';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { StyleProp, ViewStyle } from 'react-native';
const buttonStyle: StyleProp<ViewStyle> = { width: '100%' };

export default function SocialsPage() {
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedView
        style={{
          gap: 10,
          padding: 20,
          width: '80%',
        }}>
        <TextButton
          label="Friends"
          style={buttonStyle}
          onPress={() => router.push('/friend/view')}
        />
        <TextButton label="Friends Leaderboard" style={buttonStyle} />
      </ThemedView>
    </ThemedView>
  );
}
