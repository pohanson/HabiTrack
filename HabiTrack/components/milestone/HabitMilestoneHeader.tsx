import React, { useState } from 'react';
import { Button, Image, Modal, TouchableOpacity, useColorScheme, View } from 'react-native';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { Colors } from '@/constants/Colors';

export function HabitMilestoneHeader({
  totalMilestoneBadges,
  totalCompleteHabits,
}: {
  totalMilestoneBadges: number;
  totalCompleteHabits: number;
}) {
  const [isModalVisble, setIsModalVisible] = useState(false);
  const [selectedBadgeType, setSelectedBadgeType] = useState('');

  const masteryBadgeLevel = getMasteryBadgeLevel(totalMilestoneBadges);
  const masteryBadgeSize = 70; // set mastery badge size here

  const completionBadgeLevel = getCompletionBadgeLevel(totalCompleteHabits);
  const completeBadgeSize = 70; // set complete badge size here

  return (
    <ThemedView style={{ flexDirection: 'row', gap: 10 }}>
      <TouchableOpacity
        onPress={() => {
          setSelectedBadgeType('mastery');
          setIsModalVisible(!isModalVisble);
        }}>
        <MasteryBadge
          badgeType={masteryBadgeLevel}
          masteryBadgeLevel={masteryBadgeLevel}
          size={masteryBadgeSize}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setSelectedBadgeType('completion');
          setIsModalVisible(!isModalVisble);
        }}>
        <CompletionBadge
          badgeType={completionBadgeLevel}
          completionBadgeLevel={completionBadgeLevel}
          size={completeBadgeSize}
        />
      </TouchableOpacity>

      <Modal visible={isModalVisble} transparent={true} animationType="fade">
        <ThemedView
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          }}>
          <ActiveBadgePopup
            typeOfActiveBadge={selectedBadgeType}
            noOfRelevantBadges={
              selectedBadgeType === 'mastery' ? totalMilestoneBadges : totalCompleteHabits
            }
            onClose={() => setIsModalVisible(false)}
          />
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

// POPUP SCREEN

const ActiveBadgePopup = ({
  typeOfActiveBadge,
  noOfRelevantBadges,
  onClose,
}: {
  typeOfActiveBadge: string;
  noOfRelevantBadges: number;
  onClose: () => void;
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <ThemedView
      style={{
        width: '90%',
        backgroundColor: theme.card,
        borderRadius: 20,
        padding: 15,
        alignItems: 'center',
      }}>
      {typeOfActiveBadge === 'mastery' && (
        <MasteryBadgePopup totalMilestoneBadges={noOfRelevantBadges} onClose={onClose} />
      )}

      {typeOfActiveBadge === 'completion' && (
        <CompletionBadgePopup totalCompleteHabits={noOfRelevantBadges} onClose={onClose} />
      )}
    </ThemedView>
  );
};

// MASTERY BADGE

// get mastery level based on total no. of milestone badges earned
function getMasteryBadgeLevel(totalMilestoneBadges: number) {
  if (totalMilestoneBadges < 0) return -1;
  if (totalMilestoneBadges === 0) return 0;
  if (totalMilestoneBadges < 3) return 1;
  if (totalMilestoneBadges < 10) return 2;
  if (totalMilestoneBadges < 20) return 3;
  if (totalMilestoneBadges < 40) return 4;
  if (totalMilestoneBadges >= 40) return 5;
  return -1;
}

function getAdditionalMilestoneBadgesRequired(totalMilestoneBadges: number) {
  if (totalMilestoneBadges < 0) return -1;
  if (totalMilestoneBadges === 0) return 1;
  if (totalMilestoneBadges < 3) return 3 - totalMilestoneBadges;
  if (totalMilestoneBadges < 10) return 10 - totalMilestoneBadges;
  if (totalMilestoneBadges < 20) return 20 - totalMilestoneBadges;
  if (totalMilestoneBadges < 40) return 40 - totalMilestoneBadges;
  if (totalMilestoneBadges >= 40) return 50 - totalMilestoneBadges;
  return -1;
}

function getMasteryBadgeImage(badgeType: number, masteryBadgeLevel: number) {
  if (badgeType === 0 && masteryBadgeLevel === 0)
    return require('@/assets/images/badges/colored/mastery0.png');
  if (badgeType === 0 && masteryBadgeLevel !== 0)
    return require('@/assets/images/badges/greyscale/gmastery0.png');
  if (badgeType === 1 && masteryBadgeLevel === 1)
    return require('@/assets/images/badges/colored/mastery1.png');
  if (badgeType === 1 && masteryBadgeLevel !== 1)
    return require('@/assets/images/badges/greyscale/gmastery1.png');
  if (badgeType === 2 && masteryBadgeLevel === 2)
    return require('@/assets/images/badges/colored/mastery2.png');
  if (badgeType === 2 && masteryBadgeLevel !== 2)
    return require('@/assets/images/badges/greyscale/gmastery2.png');
  if (badgeType === 3 && masteryBadgeLevel === 3)
    return require('@/assets/images/badges/colored/mastery3.png');
  if (badgeType === 3 && masteryBadgeLevel !== 3)
    return require('@/assets/images/badges/greyscale/gmastery3.png');
  if (badgeType === 4 && masteryBadgeLevel === 4)
    return require('@/assets/images/badges/colored/mastery4.png');
  if (badgeType === 4 && masteryBadgeLevel !== 4)
    return require('@/assets/images/badges/greyscale/gmastery4.png');
  if (badgeType === 5 && masteryBadgeLevel === 5)
    return require('@/assets/images/badges/colored/mastery5.png');
  if (badgeType === 5 && masteryBadgeLevel !== 5)
    return require('@/assets/images/badges/greyscale/gmastery5.png');
  return require('@/assets/images/badges/greyscale/gmastery0.png');
}

function getMasteryBadgeName(badgeType: number) {
  if (badgeType === 0) return 'NEWBIE';
  if (badgeType === 1) return 'NOVICE';
  if (badgeType === 2) return 'SKILLED';
  if (badgeType === 3) return 'SEASONED';
  if (badgeType === 4) return 'EXPERT';
  if (badgeType === 5) return 'MASTER';
  return 'UNKNOWN';
}

// badge that is rewarded based on total no. of milestone badges currently earned
const MasteryBadge = ({
  badgeType,
  masteryBadgeLevel,
  size,
}: {
  badgeType: number;
  masteryBadgeLevel: number;
  size: number;
}) => {
  const opacity = masteryBadgeLevel === badgeType ? 1 : 0.2; // set opacity for incomplete badges here

  return (
    <ThemedView
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0 ,0 ,0)',
      }}>
      <Image
        source={getMasteryBadgeImage(badgeType, masteryBadgeLevel)}
        style={{ height: size, width: size, opacity: opacity }}
      />
      <ThemedText
        style={{
          fontSize: size / 5,
          fontWeight: 'bold',
          textAlign: 'center',
          opacity: opacity,
        }}>
        {getMasteryBadgeName(badgeType)}
      </ThemedText>
    </ThemedView>
  );
};

// mastery badge popup
const MasteryBadgePopup = ({
  totalMilestoneBadges,
  onClose,
}: {
  totalMilestoneBadges: number;
  onClose: () => void;
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const badgeSize = 50;
  const badgeLevel = getMasteryBadgeLevel(totalMilestoneBadges);
  const additionalMilestoneBadgesRequired =
    getAdditionalMilestoneBadgesRequired(totalMilestoneBadges);
  const nextBadgeLevel = badgeLevel + 1;
  const nextBadgeName = getMasteryBadgeName(nextBadgeLevel);
  const nextBadgeMessage =
    nextBadgeLevel <= 5
      ? additionalMilestoneBadgesRequired +
        ' more Milestone Badges needed to reach ' +
        nextBadgeName
      : 'Congratulations! You are a MASTER!';

  return (
    <View style={{ flexDirection: 'column' }}>
      <ThemedText style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>
        MASTERY RANK
      </ThemedText>
      <ThemedView
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0)',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          padding: 10,
          width: '100%',
        }}>
        <MasteryBadge badgeType={0} masteryBadgeLevel={badgeLevel} size={badgeSize} />
        <MasteryBadge badgeType={1} masteryBadgeLevel={badgeLevel} size={badgeSize} />
        <MasteryBadge badgeType={2} masteryBadgeLevel={badgeLevel} size={badgeSize} />
        <MasteryBadge badgeType={3} masteryBadgeLevel={badgeLevel} size={badgeSize} />
        <MasteryBadge badgeType={4} masteryBadgeLevel={badgeLevel} size={badgeSize} />
        <MasteryBadge badgeType={5} masteryBadgeLevel={badgeLevel} size={badgeSize} />
      </ThemedView>
      <ThemedText
        style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 12, color: theme.tint }}>
        {nextBadgeMessage}
      </ThemedText>
      <ThemedText
        style={{ textAlign: 'center', fontWeight: 'regular', fontSize: 10, color: theme.tint }}>
        Level up by earning more Milestone Badges
      </ThemedText>
      <Button title="CLOSE" onPress={() => onClose()} />
    </View>
  );
};

// COMPLETION BADGE

// badge that is rewarded based on total no. of habits with all 5 completed milestone badges
function getCompletionBadgeLevel(totalCompleteHabits: number) {
  if (totalCompleteHabits < 0) return -1;
  if (totalCompleteHabits === 0) return 0; // locked
  if (totalCompleteHabits < 3) return 1; // bronze
  if (totalCompleteHabits < 6) return 2; // silver
  if (totalCompleteHabits < 10) return 3; // gold
  if (totalCompleteHabits < 15) return 4; // emerald
  if (totalCompleteHabits >= 15) return 5; // diamond
  return -1;
}

function getAdditionalCompleteHabitsRequired(totalCompleteHabits: number) {
  if (totalCompleteHabits < 0) return -1;
  if (totalCompleteHabits === 0) return 1;
  if (totalCompleteHabits < 3) return 3 - totalCompleteHabits;
  if (totalCompleteHabits < 6) return 6 - totalCompleteHabits;
  if (totalCompleteHabits < 10) return 10 - totalCompleteHabits;
  if (totalCompleteHabits < 15) return 15 - totalCompleteHabits;
  if (totalCompleteHabits >= 15) return -2;
  return -2;
}

function getCompletionBadgeImage(badgeType: number) {
  if (badgeType === 0) return require('@/assets/images/badges/colored/locked.png');
  if (badgeType === 1) return require('@/assets/images/badges/colored/bronze.png');
  if (badgeType === 2) return require('@/assets/images/badges/colored/silver.png');
  if (badgeType === 3) return require('@/assets/images/badges/colored/gold.png');
  if (badgeType === 4) return require('@/assets/images/badges/colored/emerald.png');
  if (badgeType === 5) return require('@/assets/images/badges/colored/diamond.png');
  return require('@/assets/images/badges/colored/locked.png');
}

function getCompletionBadgeName(badgeType: number) {
  if (badgeType === 0) return 'LOCKED';
  if (badgeType === 1) return 'BRONZE';
  if (badgeType === 2) return 'SLIVER';
  if (badgeType === 3) return 'GOLD';
  if (badgeType === 4) return 'EMERALD';
  if (badgeType === 5) return 'DIAMOND';
  return 'UNKNOWN';
}

const CompletionBadge = ({
  badgeType,
  completionBadgeLevel,
  size,
}: {
  badgeType: number;
  completionBadgeLevel: number;
  size: number;
}) => {
  const opacity = completionBadgeLevel === badgeType ? 1 : 0.2; // set opacity for incomplete badges here

  return (
    <ThemedView
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0 ,0 ,0)',
      }}>
      <Image
        source={getCompletionBadgeImage(badgeType)}
        style={{ height: size, width: size, opacity: opacity }}
      />
      <ThemedText
        style={{
          fontSize: size / 5,
          fontWeight: 'bold',
          textAlign: 'center',
          opacity: opacity,
        }}>
        {getCompletionBadgeName(badgeType)}
      </ThemedText>
    </ThemedView>
  );
};

// completion badge popup
const CompletionBadgePopup = ({
  totalCompleteHabits,
  onClose,
}: {
  totalCompleteHabits: number;
  onClose: () => void;
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const badgeSize = 50;
  const badgeLevel = getCompletionBadgeLevel(totalCompleteHabits);
  const additionalCompleteHabitsRequired = getAdditionalCompleteHabitsRequired(totalCompleteHabits);
  const nextBadgeLevel = badgeLevel + 1;
  const nextBadgeName = getCompletionBadgeName(nextBadgeLevel);
  const nextBadgeMessage =
    badgeLevel === 0
      ? 'Unlock by earning ALL 5 Milestone Badges on 1 habit'
      : nextBadgeLevel <= 5
        ? 'Earn ALL 5 Milestone Badges on ' +
          additionalCompleteHabitsRequired +
          ' more habits to reach ' +
          nextBadgeName
        : 'Congratulations! You reached DIAMOND!';

  return (
    <View style={{ flexDirection: 'column' }}>
      <ThemedText style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>
        COMPLETION RANK
      </ThemedText>
      <ThemedView
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0)',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          padding: 10,
          width: '100%',
        }}>
        <CompletionBadge badgeType={0} completionBadgeLevel={badgeLevel} size={badgeSize} />
        <CompletionBadge badgeType={1} completionBadgeLevel={badgeLevel} size={badgeSize} />
        <CompletionBadge badgeType={2} completionBadgeLevel={badgeLevel} size={badgeSize} />
        <CompletionBadge badgeType={3} completionBadgeLevel={badgeLevel} size={badgeSize} />
        <CompletionBadge badgeType={4} completionBadgeLevel={badgeLevel} size={badgeSize} />
        <CompletionBadge badgeType={5} completionBadgeLevel={badgeLevel} size={badgeSize} />
      </ThemedView>
      <ThemedText
        style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 12, color: theme.tint }}>
        {nextBadgeMessage}
      </ThemedText>
      <ThemedText
        style={{ textAlign: 'center', fontWeight: 'regular', fontSize: 10, color: theme.tint }}>
        Level up by earning ALL 5 Milestone Badges on more habits
      </ThemedText>
      <Button title="CLOSE" onPress={() => onClose()} />
    </View>
  );
};
