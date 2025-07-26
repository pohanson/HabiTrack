import { User } from '@/db/localSchema';
import { View, Image } from 'react-native';
import { Shadows } from '@/constants/Shadows';
import { UserProfileDisplay } from '../user/UserProfileDisplay';

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
      testID="leaderboard-top-three"
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: '100%',
        justifyContent: 'center',
        gap: `${gapBetween}`,
      }}>
      {/* second place */}
      <View
        testID="leaderboard-top-three-second-place"
        style={{ alignItems: 'center', width: width }}>
        {user2 && (
          <UserProfileDisplay
            testID="leaderboard-top-three-second-place-user-profile"
            user={user2}
          />
        )}
        <View
          testID="leaderboard-top-three-second-place-card"
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
            testID="leaderboard-top-three-second-place-number"
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
      <View
        testID="leaderboard-top-three-first-place"
        style={{ alignItems: 'center', width: width }}>
        {user1 && (
          <UserProfileDisplay
            testID="leaderboard-top-three-first-place-user-profile"
            user={user1}
          />
        )}
        <View
          testID="leaderboard-top-three-first-place-card"
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
            testID="leaderboard-top-three-first-place-number"
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
      <View
        testID="leaderboard-top-three-third-place"
        style={{ alignItems: 'center', width: width }}>
        {user3 && (
          <UserProfileDisplay
            testID="leaderboard-top-three-third-place-user-profile"
            user={user3}
          />
        )}
        <View
          testID="leaderboard-top-three-third-place-card"
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
            testID="leaderboard-top-three-third-place-number"
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
