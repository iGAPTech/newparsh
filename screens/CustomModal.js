import React, { useState, useEffect,useContext } from 'react';
import { Modal, TouchableOpacity, View, Text, TextInput, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { getItem, setItem } from "./AsyncStorage";
import { UserContext } from './Context/UserState';


export default CustomModal = ({ modalVisible, toggleModal, units, brands, productWeight, singleweight }) => {
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState("");
  const [brandid, setBrandId] = useState(0);
  const [unitError, setUnitError] = useState('');
  const [brandError, setBrandError] = useState('');
  const [quantityError, setQuantityError] = useState('');
  const [totalWeight, setTotalWeight] = useState('');
  const [selectedBrand, setSelectedBrand] = useState(null);
  const { asyncData, setAsyncData,Getasyncdata } = useContext(UserContext);

console.log("units",units);
  const validate = () => {
    let isValid = true;
    if (!unit) {
      setUnitError('Unit is required');
      isValid = false;
    } else {
      setUnitError('');
    }
    if (!brandid) {
      setBrandError('Brand is required');
      isValid = false;
    } else {
      setBrandError('');
    }
    if (!quantity) {
      setQuantityError('Quantity is required');
      isValid = false;
    } else if (isNaN(quantity)) {
      setQuantityError('Quantity must be a number');
      isValid = false;
    } else {
      setQuantityError('');
    }
    return isValid;
  }

  const handleUnitChange = (value) => {
    setUnit(value);
  }

  const handleBrandChange = (value) => {
    console.log(value);
    setBrandId(value);
  }

  const submitdata = async () => {
    if (validate()) {
      try {
        let newData = asyncData || [];
        let found = false;
        for (let i = 0; i < newData.length; i++) {
          if (newData[i].pwid === productWeight.id) {
            newData[i].unit = unit;
            newData[i].brandid = brandid;
            newData[i].quantity = quantity;
            found = true;
            break;
          }
        }
        if (!found) {
          newData.push({ pwid: productWeight.id, unit, brandid, quantity, singleweight, totalWeight });
        }
        setAsyncData(newData);
        await setItem('data', JSON.stringify(newData));
        toggleModal();
        Getasyncdata()
      } catch (error) {
        console.error('Error storing data:', error);
      }
    }
};


  const removedata = async () => {
    try {
      const existingData = await getItem('data');
      let cartData = [];
      let newData = [];
      if (existingData) {
        cartData = JSON.parse(existingData);
      }
      for (let i = 0; i < cartData.length; i++) {
        if (cartData[i].pwid != productWeight.id) {
          newData.push(cartData[i]);
        }
      }
      await setItem('data', JSON.stringify(newData));
      toggleModal();
    } catch (error) {
      console.error('Error storing data:', error);
    }
  };

  async function refreshProduct() {
    try {
      let found = false;
      let data = await getItem('data');
      let dataArray = [];
      if (data) {
        dataArray = JSON.parse(data);
      }
      dataArray.forEach(element => {
        if (element.pwid == productWeight.id) {
          setUnit(element.unit);
          setBrandId(element.brandid);
          setQuantity(element.quantity);
          found = true;
        }
      });
      if (!found) {
        if (productWeight.type === 'Meter') {
          if (productWeight.billingin == "Meter")
            setUnit('Meter');
          else if (productWeight.billingin == "Feet")
            setUnit('Feet');
          else
            setUnit('Nos');
        } else {
          setUnit('Kgs');
        }
      }
    }
    catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    refreshProduct();
  }, []);

  const calculateTotalWeight = () => {
    let totalWeight = 0;
    if (unit === 'Meter') {
      totalWeight = productWeight.weight * parseFloat(quantity);
    } else if (unit === 'Feet') {
      totalWeight = (productWeight.weight / 3.28) * parseFloat(quantity);
    } else if (unit === 'Nos') {
      if (productWeight.type === 'Meter') {
        totalWeight = (productWeight.weight * 6) * parseFloat(quantity);
      }
      else {
        totalWeight = productWeight.weight * parseFloat(quantity);
      }
    } else if (unit.toLowerCase() === 'kgs') {
      totalWeight = productWeight.weight * parseFloat(quantity);
      console.log("kgs", totalWeight);
    }

    if (!isNaN(totalWeight)) {
      setTotalWeight(totalWeight.toFixed(1));
    } else {
      setTotalWeight('');
    }
  };

  useEffect(() => {
    calculateTotalWeight();
  }, [unit, quantity, productWeight]);
  console.log("productWeight", productWeight.weight);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={toggleModal}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={toggleModal}
      >
      </TouchableOpacity>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modeltext}>{productWeight.sizeinmm}</Text>
          <View style={styles.headingContainer}>
            <Text style={styles.modalHeading}>Select Brand</Text>
            {!!brandError && <Text style={styles.error}>{brandError}</Text>}
          </View>
          <View style={styles.dropdownContainer}>
            <Dropdown
              style={styles.dropdown}
              data={brands}
              labelField="name"
              valueField="id"
              placeholder="Select Brand"
              value={brandid}
              onChange={(item) => handleBrandChange(item.id)}
            />
          </View>

         
          <View style={styles.unitQuantityContainer}>
         
            <View style={styles.unitContainer}>
            <View style={styles.headingContainer}>
            <Text style={styles.modalHeading}>Unit</Text>
          </View>
              <Dropdown
                style={styles.dropdown}
                data={units}
                labelField="label"
                valueField="value"
                placeholder="Select Unit"
                value={unit}
                onChange={(item) => handleUnitChange(item.value)}
              />
              {!!unitError && <Text style={styles.error}>{unitError}</Text>}
            </View>
            <View style={styles.quantityContainer}>
            <View style={styles.headingContainer}>
            <Text style={styles.modalHeading}>Quantity</Text>
          </View>
              <TextInput
                style={styles.input}
                value={quantity}
                keyboardType="numeric"
                placeholder="Enter Quantity"
                onChangeText={(text) => setQuantity(text)}
              />
              {!!quantityError && <Text style={styles.error}>{quantityError}</Text>}
            </View>
          </View>

          <TouchableOpacity onPress={submitdata} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '100%',
  },
  headingContainer: {
    marginBottom: 10,
  },
  modalHeading: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  unitQuantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  unitContainer: {
    flex: 1,
    marginRight: 10,
  },
  quantityContainer: {
    flex: 1,
    marginLeft: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 13,
  },
  closeButton: {
    backgroundColor: '#fda901',
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modeltext: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    // elevation: 2,
    backgroundColor: '#fda90120',
    borderRadius: 5,
    padding: 15,
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginLeft: 20,
    marginBottom: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
