import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';

export default function Welcome() {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);
  const ring1padding = useSharedValue(0);
  const ring2padding = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 4000 });
    translateY.value = withTiming(0, { duration: 2000 });

    ring1padding.value = 0;
    ring2padding.value = 0;

    setTimeout(() => ring1padding.value = withSpring(hp(5)), 100);
    setTimeout(() => ring2padding.value = withSpring(hp(5.5)), 300);
  }, []);

  const logoStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const ring1Style = useAnimatedStyle(() => {
    return {
      padding: ring1padding.value,
    };
  });

  const ring2Style = useAnimatedStyle(() => {
    return {
      padding: ring2padding.value,
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });
  return (
    <View style={styles.container} className='bg-amber-500'>
      <Animated.View style={[styles.logoContainer, ring1Style]}>
        <Animated.View style={[styles.ring2, ring2Style]} className='bg-white/20'>
          <Animated.View style={[styles.logoWrapper, logoStyle]} className='bg-white/20'>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
          </Animated.View>
        </Animated.View>
      </Animated.View>
      <Animated.Text style={[styles.welcomeText, textStyle]}>
        Welcome to Parshwanath Group
      </Animated.Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#FFD700', // Yellow background color
  },
  logoContainer: {
    marginBottom: 20,
  },
  ring2: {
    // backgroundColor: 'rgba(0, 0, 0, 0.1)', // Light gray for the first ring
    borderRadius: 100,
  },
  logoWrapper: {
    // backgroundColor: 'rgba(0, 0, 0, 0.1)', // Light gray for the second ring
    borderRadius: 100,
  },
  logo: {
    width: wp(50),
    height: hp(25),
    resizeMode: 'contain',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Dark gray text color
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});