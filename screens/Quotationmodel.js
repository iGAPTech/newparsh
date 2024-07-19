import React, { useEffect, useState,useContext } from 'react';
import { StyleSheet, Text, TextInput, View, Modal, TouchableOpacity, TouchableWithoutFeedback, ScrollView, Alert } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import { setItem ,getItem,removeItem} from './AsyncStorage';
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
import { UserContext } from './Context/UserState';



export default function QuotationModel({ modalQVisible, toggleQModal, professions, asyncData, cities, states }) {
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [waNumber, setWaNumber] = useState('');
  const [profession, setProfession] = useState([])
  const [filteredCities, setFilteredCities] = useState([]);
  const [user, setUser] = useState([]);
  const [userid,setUserid] = useState('')
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { Getasyncdata,Clearasyncdata } = useContext(UserContext);

  const [errors, setErrors] = useState({
    name: false,
    state: false,
    city: false,
    address: false,
    waNumber: false,
    profession: false,
  });

  // const userid=12641
  const resetFields = () => {
    setName('');
    setState('');
    setCity('');
    setAddress('');
    setWaNumber('');
    setProfession([]);
  };
 
  const validateFields = () => {
    const newErrors = {
      name: !name,
      state: !state,
      city: !city,
      address: !address,
      profession: !profession,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const retrieveData = async () => {
    try {
      const mobileno = await getItem('mobileno');
      const quotationData = await getItem('quotationData');

      console.log("que",quotationData);
      const response = await axios.post(apiUrl + "api/getdatabymobileno/"+mobileno);
      const userData = response.data.data;
      console.log("userData",userData);
      setUserid(userData.id);
      setUser(userData);
      setName(userData.name);
      setAddress(userData.address);
      setWaNumber(mobileno)
      const stateId = states.find(state => state.name === userData.state)?.id;
      console.log("stateId",stateId);
      const cityId = cities.find(city => city.city === userData.city)?.id;
      const professionId = professions.find(profession => profession.name === userData.profession)?.id;
      setState(stateId);
      setCity(cityId);
    setProfession(professionId);
    } catch (error) {
      console.log("Error retrieving data:", error);
    }
  }

  useEffect(() => {
    if (modalQVisible) {
      retrieveData();
    }
  }, [modalQVisible]);
  

  useEffect(() => {
    const filteredCities = cities.filter(city => city.state_id === state);
    setFilteredCities(filteredCities);
  }, [state]);

// console.log("asyncdata",asyncData);

  const submitData = async () => {
    const isValid = validateFields();
    if (!isValid) {
      Alert.alert('Validation Error', 'Please fill in all the required fields.');
      return;
    }
    const quotationDetailsArray = asyncData.map(item => ({
      qid: 0,
      pwid: item.id,
      pid: item.pid,
      bid: 0,
      estimationin: item.billingin,
      quantities: item.quantity,
      singleweight: parseFloat(item.singleweight),
      weight: parseFloat(item.weight),
      brandid: parseInt(item.brandid),
      narration: '',
    }));
  
    let stateName = "";
    for (let i = 0; i < states.length; i++) {
      if (states[i].id == state) {
        stateName = states[i].name;
        break;
      }
    }
  
    let cityName = "";
    for (let i = 0; i < cities.length; i++) {
      if (cities[i].id == city) {
        cityName = cities[i].city;
        break;
      }
    }
    // let professionName = "";
    // for (let i = 0; i < professions.length; i++) {
    //   if (professions[i].id == name) {
    //     professionName = professions[i].name;
    //     break;
    //   }
    // }
    // Finding profession name based on selected ID
  let professionName = "";
  for (let i = 0; i < professions.length; i++) {
    if (professions[i].id == profession) {
      professionName = professions[i].name;
      break;
    }
  }

  
    const sendData = {
      userid: userid,
      mobileno: waNumber,
      address: address,
      state: stateName,
      city: cityName,
      profession: professionName,
      // profession: profession,
      firmname: name,
      gstno: 0,
      quotationdetails: quotationDetailsArray,
    };  

    try {
      axios.post(apiUrl + "api/requestforquotation", sendData).then((result)=>{
        console.log("sendData",sendData);
        setItem('quotationData', JSON.stringify(sendData));
        Clearasyncdata().then((res)=>{
          resetFields();
          toggleQModal();
          Alert.alert('Success', 'Your quotation has been submitted successfully.');
        });       
        
      });
      
    } catch (error) {
      console.error('Error submitting data:', error);
      Alert.alert('Error', 'Failed to submit data. Please try again later.');
    }
  };
  
  const handleProfessionChange = (value) => {
    console.log(value);
    setProfession(value)
  }

  const handleStateChange = (value) => {
    console.log(value);
    setState(value)
    const filteredCities = cities.filter((city) => city.state_id === value);
    setFilteredCities(filteredCities);
  }

  const handleCityChange = (value) => {
    console.log(value);
    setCity(value)
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalQVisible}
      onRequestClose={() => {
        resetFields(); 
        toggleQModal();
      }}
    >
      <TouchableWithoutFeedback onPress={()=>{
         resetFields(); 
         toggleQModal();
      }}>
        <View style={styles.modalOverlay}></View>
      </TouchableWithoutFeedback>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.modalContent}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              // style={styles.input}
              style={[styles.input, errors.name && styles.inputError]}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              onBlur={() => setErrors({ ...errors, name: !name })}
            />
            <Text style={styles.dropdownLabel}>State:</Text>
            <View style={[styles.dropdownContainer, errors.state && styles.inputError]}>
              <Dropdown
                data={states}
                labelField="name"
                valueField="id"
                placeholder="Select State"
                value={state}
                onChange={(item) => {
                  handleStateChange(item.id);
                  setErrors({ ...errors, state: !item });
                }}
                textStyle={styles.dropdownText}
              />
            </View>
            <Text style={styles.dropdownLabel}>City:</Text>
            <View style={[styles.dropdownContainer, errors.city && styles.inputError]}>
              <Dropdown
                data={filteredCities}
                labelField="city"
                valueField="id"
                placeholder="Select City"
                value={city}
                onChange={(item) => {
                  handleCityChange(item.id);
                  setErrors({ ...errors, city: !item });
                }}
                textStyle={styles.dropdownText}
              />
            </View>
            <Text style={styles.label}>Address:</Text>
            <TextInput
              style={[styles.input, errors.address && styles.inputError]}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter your address"
              onBlur={() => setErrors({ ...errors, address: !address })}
            />
              <Text style={styles.label}>WhatsApp Number:</Text>
            <TextInput
              style={[styles.input, errors.waNumber && styles.inputError]}
              value={waNumber}
              onChangeText={setWaNumber}
              editable={false}
              placeholder="Enter your WhatsApp number"
              keyboardType="phone-pad"
              onBlur={() => setErrors({ ...errors, waNumber: !waNumber })}
            />
            <Text style={styles.dropdownLabel}>Profession:</Text>
            <View style={[styles.dropdownContainer, errors.profession && styles.inputError]}>
              <Dropdown
                data={professions}
                labelField="name"
                valueField="id"
                placeholder="Select profession"
                value={profession}
                onChange={(item) => {
                  handleProfessionChange(item.id);
                  setErrors({ ...errors, profession: !item });
                }}
                textStyle={styles.dropdownText}
              />
            </View>

            <TouchableOpacity onPress={submitData} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Send Request</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={clearuserdata} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>clear data</Text>
            </TouchableOpacity> */}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#ACD793',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  // Style for dropdown label
  dropdownLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  // Style for dropdown text
  dropdownText: {
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
});
