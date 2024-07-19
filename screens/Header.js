import React, { useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StatusBar } from 'expo-status-bar';
import { UserContext } from './Context/UserState';
import { useNavigation } from '@react-navigation/native';

export default function Header() {
  const { asyncData, Getasyncdata } = useContext(UserContext);
  const navigation = useNavigation()

  useEffect(() => {
    Getasyncdata();
  }, []);

  return (
    <View style={styles.headerWrapper}>
      <StatusBar style='light' backgroundColor='#fda901' />
      <View style={styles.headerContainer}>
        <View style={styles.leftContainer}>
          <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.openDrawer()}>
            <Icon name="bars" size={24} color="#6C4D38" />
          </TouchableOpacity>
          <Image source={require('../assets/newlogo.png')} style={styles.logo} />
        </View>
        <View style={styles.rightContainer}>
          <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Cart')}>
            <Icon name="shopping-cart" size={24} color="#6C4D38" />
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{asyncData.length}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {},
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 40,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 4,
      },
    }),
    backgroundColor: 'white',
    zIndex: 1,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContainer: {
    position: 'relative',
  },
  iconContainer: {
    padding: 10,
  },
  logo: {
    width: 150,
    height: 60,
    resizeMode: 'contain',
    marginHorizontal: 20,
  },
  badgeContainer: {
    position: 'absolute',
    right: 0,
    top: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
