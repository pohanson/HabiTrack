import { FriendCard } from '@/components/friend/FriendCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function FriendsNotificationPage() {
  return (
    <ThemedView style={{ flex: 1, alignItems: 'center', width: '100%', gap: 10 }}>
      <ThemedText type="title" style={{ paddingVertical: 16 }}>
        Pending Request
      </ThemedText>
      <FriendCard onAdd={() => {}} onAccept={() => {}} onReject={() => {}} />
    </ThemedView>
  );
}
