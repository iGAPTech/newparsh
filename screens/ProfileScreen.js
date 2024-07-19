import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { setItem, getItem, removeItem ,clearAll} from './AsyncStorage';
import axios from 'axios';
import ConfirmationModal from './ConfirmationModal';

export default function ProfileScreen({ navigation, route }) {
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [profession, setProfession] = useState('');
  const [user, setUser] = useState([]);
  const [userid, setUserid] = useState('');
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [modalCVisible, setModalCVisible] = useState(false);
  const modalMessage = "Are you sure you want to delete your account? This action cannot be undone.";

  const saveProfile = () => {
    console.log('Profile saved:', { name, state, city, address, whatsapp, profession });
  };

  const handleConfirm = async () => {
    try {
      await clearAll();
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error removing data:', error);
    }
  };

  const retrieveData = async () => {
    try {
      const mobileno = await getItem('mobileno');
      if (mobileno != null) {
        const response = await axios.post(apiUrl + "api/getdatabymobileno/" + mobileno);
        const userData = response.data.data;
        console.log("userData", userData);
        setUserid(userData.id);
        setUser(userData);
        setName(userData.name);
        setAddress(userData.address);
        setWhatsapp(mobileno);
        setProfession(userData.profession);
        setState(userData.state);
        setCity(userData.city);
      } else {
        navigation.navigate('Login');
      }
    } catch (error) {
      console.log("Error retrieving data:", error);
    }
  };

  useEffect(() => {
    retrieveData();
  }, []);

  const toggleCModal = () => {
    setModalCVisible(!modalCVisible);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        editable={false}
        onChangeText={setName}
      />
      <Text style={styles.label}>State</Text>
      <TextInput
        style={styles.input}
        placeholder="State"
        editable={false}
        value={state}
        onChangeText={setState}
      />
      <Text style={styles.label}>City</Text>
      <TextInput
        style={styles.input}
        placeholder="City"
        editable={false}
        value={city}
        onChangeText={setCity}
      />
      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Address"
        editable={false}
        value={address}
        onChangeText={setAddress}
      />
      <Text style={styles.label}>WhatsApp Number</Text>
      <TextInput
        style={styles.input}
        placeholder="WhatsApp Number"
        editable={false}
        value={whatsapp}
        onChangeText={setWhatsapp}
        keyboardType="phone-pad"
      />
      <Text style={styles.label}>Profession</Text>
      <TextInput
        style={styles.input}
        placeholder="Profession"
        editable={false}
        value={profession}
        onChangeText={setProfession}
      />
      <Text style={styles.deleteAccount} onPress={toggleCModal}>
        Delete My Account
      </Text>
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
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fda90120', // Setting background color
  },
  label: {
    width: '100%',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff', // Setting input background color
  },
  deleteAccount: {
    marginTop: 20,
    fontSize: 16,
    color: 'red',
    textDecorationLine: 'underline',
  },
});
