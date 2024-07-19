import { StyleSheet, Text, View, TouchableOpacity, Platform, Image } from 'react-native';
import React, { useState } from 'react';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import Header from './Header';
import ConfirmationModal from './ConfirmationModal';
import { setItem, getItem, removeItem, clearAll } from './AsyncStorage';

export default function MyAccountScreen({ navigation }) {
  const [modalCVisible, setModalCVisible] = useState(false);

  const Quotations = () => {
    navigation.navigate('Quotations');
  };

  const Profiles = () => {
    navigation.navigate('Profile');
  };

  const toggleCModal = () => {
    setModalCVisible(!modalCVisible);
  };

  const handleConfirm = async () => {
    try {
      await clearAll();
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error removing data:', error);
    }
  };

  const modalMessage = "Are you sure you want to sign out?";

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.profileContainer} onPress={Profiles}>
        <View style={styles.profileContent}>
          <AntDesign name="user" size={24} color="black" />
          <Text style={styles.profileText}>My Profile</Text>
        </View>
        <AntDesign name="right" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.profileContainer} onPress={Quotations}>
        <View style={styles.profileContent}>
          <AntDesign name="profile" size={24} color="black" />
          <Text style={styles.profileText}>My Quotations</Text>
        </View>
        <AntDesign name="right" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.profileContainer} onPress={toggleCModal}>
        <View style={styles.profileContent}>
          <AntDesign name="logout" size={24} color="black" />
          <Text style={styles.profileText}>Sign Out</Text>
        </View>
        <AntDesign name="right" size={24} color="black" />
      </TouchableOpacity>
      {
        modalCVisible && (
          <ConfirmationModal
            modalCVisible={modalCVisible}
            toggleCModal={toggleCModal}
            message={modalMessage}
            onConfirm={handleConfirm}
          />
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fda90120',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 40,
    marginBottom: 20,
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
  breadcrumb: {
    marginRight: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 60,
    resizeMode: 'contain',
    marginHorizontal: 20,
  },
  searchIcon: {
    marginLeft: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fda901',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginHorizontal: 20,
    marginVertical: 10, // Adjust the spacing between items
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  profileText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionButton: {
    backgroundColor: 'yellow',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
});
