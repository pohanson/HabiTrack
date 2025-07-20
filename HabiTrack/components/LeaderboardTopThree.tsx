import { User } from '@/db/localSchema';
import { View, Image } from 'react-native';
import { ThemedText } from './ThemedText';
import { Shadows } from '@/constants/Shadows';

export function LeaderboardTopThree({
  user1,
  user2,
  user3,
}: {
  user1?: User;
  user2?: User;
  user3?: User;
}) {
  const color1 = '#1E88E5'; // (1st place)
  const color2 = '#42A5F5'; // (2nd place)
  const color3 = '#64B5F6'; // (3rd place)

  const widthPercentage = 95; // in percentage
  const width = `${widthPercentage / 3}%`;

  const gapBetween = 1; // in percentage
  const borderRadius = 15;

  const firstPlaceHeight = 50; // (min 40) in percentage

  const firstPlaceHeightPercentage = `${firstPlaceHeight}%`;
  const secondPlaceHeightPercentage = `${firstPlaceHeight - 20}%`; // 15% less than first place
  const thirdPlaceHeightPercentage = `${firstPlaceHeight - 30}%`; // 30% less than first place

  const podiumNumberSizeFirstPlace = 50;
  const podiumNumberSizeSecondPlace = 40;
  const podiumNumberSizeThirdPlace = 30;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: '100%',
        justifyContent: 'center',
        gap: `${gapBetween}`,
      }}>
      {/* second place */}
      <View style={{ alignItems: 'center', width: width }}>
        {user2 && (
          <View style={{ marginBottom: 4 }}>
            <ThemedText style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>
              {user2.name}
            </ThemedText>
            <ThemedText style={{ fontSize: 12, color: '#888', textAlign: 'center' }}>
              @{user2.username}
            </ThemedText>
          </View>
        )}
        <View
          style={[
            {
              width: '100%',
              height: secondPlaceHeightPercentage,
              backgroundColor: color2,
              borderTopLeftRadius: borderRadius,
              justifyContent: 'center',
            },
            Shadows.large,
          ]}>
          <Image
            style={{
              width: podiumNumberSizeSecondPlace,
              height: podiumNumberSizeSecondPlace,
              alignSelf: 'center',
            }}
            source={require('@/assets/images/2.png')}
          />
        </View>
      </View>

      {/* first place */}
      <View style={{ alignItems: 'center', width: width }}>
        {user1 && (
          <View style={{ marginBottom: 4 }}>
            <ThemedText style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>
              {user1.name}
            </ThemedText>
            <ThemedText style={{ fontSize: 12, color: '#888', textAlign: 'center' }}>
              @{user1.username}
            </ThemedText>
          </View>
        )}
        <View
          style={[
            {
              width: '100%',
              height: firstPlaceHeightPercentage,
              backgroundColor: color1,
              borderTopLeftRadius: borderRadius,
              borderTopRightRadius: borderRadius,
              justifyContent: 'center',
            },
            Shadows.large,
          ]}>
          <Image
            style={{
              width: podiumNumberSizeFirstPlace,
              height: podiumNumberSizeFirstPlace,
              alignSelf: 'center',
            }}
            source={require('@/assets/images/1.png')}
          />
        </View>
      </View>

      {/* third place */}
      <View style={{ alignItems: 'center', width: width }}>
        {user3 && (
          <View style={{ marginBottom: 4 }}>
            <ThemedText style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>
              {user3.name}
            </ThemedText>
            <ThemedText style={{ fontSize: 12, color: '#888', textAlign: 'center' }}>
              @{user3.username}
            </ThemedText>
          </View>
        )}
        <View
          style={[
            {
              width: '100%',
              height: thirdPlaceHeightPercentage,
              backgroundColor: color3,
              borderTopRightRadius: borderRadius,
              justifyContent: 'center',
            },
            Shadows.large,
          ]}>
          <Image
            style={{
              width: podiumNumberSizeThirdPlace,
              height: podiumNumberSizeThirdPlace,
              alignSelf: 'center',
            }}
            source={require('@/assets/images/3.png')}
          />
        </View>
      </View>
    </View>
  );
}
