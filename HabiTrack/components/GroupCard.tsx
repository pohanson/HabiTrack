import { TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Shadows } from '@/constants/Shadows';
import { ThemedText } from './ThemedText';
import { Group } from '@/db/localSchema';
import { DatabaseService } from '@/services';
import { IconSymbol } from './ui/IconSymbol';
import { router } from 'expo-router';

export function GroupCard({ group }: { group: Group }) {
  const databaseService = DatabaseService.instance;
  const [noOfMembers, setNoOfMembers] = useState(0);
  const [adminUsername, setAdminUsername] = useState('');

  useEffect(() => {
    const getNoOfMembers = async () => {
      try {
        const number = await databaseService.groupMember.getNumberOfMembersByGroupId(group.id);
        setNoOfMembers(number);
      } catch (error) {
        console.error('Error fetching number of members:', error);
      }
    };
    const getAdminUsername = async () => {
      try {
        const admin = await databaseService.user.getUsernameById(group.admin_id);
        setAdminUsername(String(admin));
      } catch (error) {
        console.error('Error fetching group admin username:', error);
      }
    };
    getNoOfMembers();
    getAdminUsername();
  }, [
    group.id,
    databaseService.groupMember,
    group.admin_id,
    databaseService.user,
    databaseService.userId,
  ]);

  const press = (groupId: string, groupName: string) => {
    router.push({
      pathname: '../habitCircles/group',
      params: { groupId: group.id, groupName: group.name },
    });
  };

  return (
    <TouchableOpacity onPress={() => press(group.id, group.name)}>
      <View
        style={[
          {
            flexDirection: 'row',
            backgroundColor: useThemeColor({}, 'card'),
            borderColor: useThemeColor({}, 'border'),
            borderWidth: 1,
            borderRadius: 16,
            padding: 16,
            alignItems: 'center',
          },
          Shadows.large,
        ]}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <ThemedText
            style={{
              fontWeight: 'bold',
              fontSize: 13,
              textAlign: 'center',
              color: useThemeColor({}, 'lightGray'),
            }}>
            Admin
          </ThemedText>
          <ThemedText
            style={{ fontSize: 12, color: useThemeColor({}, 'blue'), textAlign: 'center' }}>
            @{adminUsername}
          </ThemedText>
        </View>
        <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
          <ThemedText
            style={{
              fontWeight: 'bold',
              fontSize: 16,
              textAlign: 'center',
              color: useThemeColor({}, 'text'),
            }}>
            {group.name}
          </ThemedText>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ThemedText
            style={{ fontWeight: 'bold', fontSize: 16, color: useThemeColor({}, 'text') }}>
            {noOfMembers}
          </ThemedText>
          <IconSymbol color={useThemeColor({}, 'tint')} name="person.2" size={22} />
        </View>
      </View>
    </TouchableOpacity>
  );
}
