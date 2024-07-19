import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useState } from 'react';
import { setItem ,getItem,removeItem} from './AsyncStorage';
import { StyleSheet, Text, View, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [cheackotp, setcheackotp] = useState({});
  const [showLogin, setShowLogin] = useState(false);
  const navigation = useNavigation();

  const handleNext = () => {
    console.log("click");
    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid 10-digit phone number.');
      return;
    }
    axios.post(apiUrl+'api/sendOTP/'+phoneNumber).then((res)=>{
      console.log('data',res.data.otp);
      setcheackotp(res.data)
      setShowLogin(true);
    })
    console.log('Phone number is valid:', phoneNumber);
  };

  const handleLogin = () => {
    if (parseInt(otp) === cheackotp.otp) { 
      const mobileno = setItem('mobileno',phoneNumber)
      navigation.navigate('Cart');
    } else {
      Alert.alert('Invalid OTP', 'Please enter a valid OTP.');
      setOtp('');
      // setShowLogin(false);
    }
  };

  const handlegoback=(()=>{
    setShowLogin(false);
  })

  return (
    <View style={styles.container}>
      {showLogin ? (
        // Login screen
        <>
          <Text style={styles.boldText}>Enter OTP</Text>
          <TextInput
            style={styles.input}
            placeholder="OTP"
            keyboardType="numeric"
            value={otp}
            onChangeText={(text) => setOtp(text)}
          />
          {/* <Button title="Login" onPress={handleLogin} />
          <Button title="Go Back" onPress={handlegoback} /> */}
          <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
          <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handlegoback} style={styles.resendButton}>
            <Text style={styles.buttonText}>Resend OTP</Text>
          </TouchableOpacity>
        </>
      ) : (
        // Generate OTP screen
        <>
          <Text style={styles.boldText}>Enter your WhatsApp number</Text>
          <Text style={styles.smalltext}>We will send you a confirmation code on WhatsApp</Text>
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            keyboardType="phone-pad"
            autoFocus={true}
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(text)}
          />
          <TouchableOpacity  onPress={handleNext} style={styles.nextButton}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 50
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 34,
    marginBottom: 10,
  },
  smalltext: {
    fontSize: 15,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: '#ACD793',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  loginButton: {
    backgroundColor: '#fda901',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom:5
  },
  resendButton: {
    backgroundColor: '#ACD793',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
