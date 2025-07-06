import { IconButton } from '@/components/IconButton';
import { TextButton } from '@/components/TextButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useState } from 'react';
import { Modal, TextInput, View } from 'react-native';

export default function FriendView() {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  return (
    <ThemedView style={{ flex: 1, alignItems: 'center' }}>
      <Modal visible={isAddModalVisible} transparent={true} animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'gray',
            opacity: 0.8,
          }}>
          <View
            style={{
              alignItems: 'center',
              width: '80%',
              gap: 10,
              padding: 30,
              borderRadius: 20,
              backgroundColor: useThemeColor({}, 'card'),
            }}>
            <ThemedText type="title">Add Friend</ThemedText>

            <TextInput
              style={{
                width: '100%',
                padding: 10,
                margin: 4,
                borderWidth: 1,
                borderColor: useThemeColor({}, 'border'),
                borderRadius: 5,
              }}
              placeholder="Enter friend's username"
            />
            <TextButton
              label="Close"
              onPress={() => setIsAddModalVisible(false)}
              style={{
                backgroundColor: useThemeColor({}, 'red'),
              }}
            />
          </View>
        </View>
      </Modal>
      <ThemedView
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '80%',
          padding: 10,
        }}>
        <ThemedText type="title">Your Friends</ThemedText>
        <IconButton iconName="plus" onPress={() => setIsAddModalVisible(true)} />
      </ThemedView>
      <TextInput
        style={{
          width: '80%',
          padding: 10,
          borderWidth: 1,
          borderColor: useThemeColor({}, 'border'),
          borderRadius: 5,
        }}
        placeholder="Search for friends..."
      />
    </ThemedView>
  );
}
