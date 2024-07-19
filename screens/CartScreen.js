import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, TextInput, RefreshControl, Platform } from 'react-native';
import { Ionicons, AntDesign, FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { getItem, setItem, removeItem } from './AsyncStorage';
import { useFocusEffect } from '@react-navigation/native';
import Header from './Header';
import { UserContext } from './Context/UserState';
import CustomModal from './CustomModal';
import Quotationmodel from './Quotationmodel';
import { changeUnits } from './GenericFunctions';
import ConfirmationModal from './ConfirmationModal';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function CartScreen({ navigation, route }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalQVisible, setModalQVisible] = useState(false);
  const [modalCVisible, setModalCVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [indexToRemove, setIndexToRemove] = useState(null);
  const [productWeight, setProductWeight] = useState({});
  const [units, setUnits] = useState([]);
  const [brands, setBrands] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [professions, setProffessions] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { asyncData, setAsyncData, Getasyncdata } = useContext(UserContext);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const calculateTotalWeight = () => {
    let totalWeight = 0;
    asyncData.forEach(item => {
      totalWeight += parseFloat(item.totalWeight);
    });
    return totalWeight.toFixed(2);
  };

  const fetchData = async () => {
    try {
      const data = await getItem('data');
      if (data) {
        const dataArray = JSON.parse(data);
        let pwids = "0";
        dataArray.forEach(element => {
          console.log(element, "element");
          pwids += "A" + element.pwid;
        });
        console.log("pwids", pwids);
        axios.post(`${apiUrl}api/get_cartdata/${pwids}`).then((res) => {
          // console.log("API Response", res.data);
          let productweights = res.data.data;
          let brands = res.data.brands;
          for (let i = 0; i < productweights.length; i++) {
            dataArray.forEach(element => {
              if (productweights[i].id === element.pwid) {
                productweights[i].pwid = element.pwid;
                productweights[i].quantity = element.quantity;
                productweights[i].unit = element.unit;
                productweights[i].brandid = element.brandid;
                productweights[i].singleweight = element.singleweight;
                productweights[i].weight = element.totalWeight;
                productweights[i].totalWeight = element.totalWeight;
                brands.forEach(brand => {
                  if (brand.id === productweights[i].brandid) {
                    productweights[i].brandname = brand.name;
                  }
                });
              }
            });
          }
          setAsyncData(productweights);
        }).catch((err) => {
          console.log("error fetching ", err);
        });
      } else {
        setAsyncData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const removeoneAsync = (indexToRemove) => {
    setIndexToRemove(indexToRemove);
    setModalMessage('Are you sure you want to remove this item from the cart?');
    toggleCModal();
  };

  const removeAsync = () => {
    setIndexToRemove(null);
    setModalMessage('Are you sure you want to remove all items from the cart?');
    toggleCModal();
    // Getasyncdata()
  };

  const handleConfirm = async () => {
    if (indexToRemove !== null) {
      try {
        const data = await getItem('data');
        if (data) {
          const dataArray = JSON.parse(data);
          const updatedDataArray = dataArray.filter((_, index) => index !== indexToRemove);
          await setItem('data', JSON.stringify(updatedDataArray));
          setAsyncData(updatedDataArray);
          Getasyncdata();
        }
      } catch (error) {
        console.error('Error removing data:', error);
      }
    } else {
      try {
        await removeItem('data');
        setAsyncData([]);
      } catch (error) {
        console.error('Error removing data:', error);
      }
    }
    toggleCModal();
  };

  const toggleModal = () => setModalVisible(!modalVisible);
  const toggleQModal = () => setModalQVisible(!modalQVisible);
  const toggleCModal = () => setModalCVisible(!modalCVisible);

  const changedata = (pw) => {
    setProductWeight(pw);
    let product = { id: pw.pid, type: pw.type, billingin: pw.billingin };
    setUnits(changeUnits(product));
    axios.post(`${apiUrl}api/get_pwbrands/${pw.id}`).then((res) => {
      setBrands(res.data.data);
      toggleModal();
      fetchData();
      Getasyncdata();
    }).catch((err) => {
      console.log("error data", err);
    });
  };

  const getprofession = () => {
    axios.post(`${apiUrl}api/professions`).then((res) => {
      setProffessions(res.data.data);
    }).catch((err) => {
      console.log("Error", err);
    });
  };

  const getstates = () => {
    axios.post(`${apiUrl}api/states`).then((res) => {
      const filteredStates = res.data.data.filter(state => state.display === "Yes");
      setStates(filteredStates);
    }).catch((err) => {
      console.log(err);
    });
  };

  const getcities = () => {
    axios.post(`${apiUrl}api/cities`).then((res) => {
      setCities(res.data.data);
    }).catch((err) => {
      console.log(err);
    });
  };

  const quotation = async () => {
    try {
      const userdata = await getItem('mobileno');
      if (userdata != null) {
        toggleQModal();
      } else {
        navigation.navigate('Login');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const changequantity = (newQuantity, itemId) => {
    // Validate the new quantity
    if (newQuantity < 1) {
      return;
    }
    const updatedAsyncData = asyncData.map(item => {
      if (item.id === itemId) {
        const newWeight = (parseFloat(item.weight) * newQuantity).toFixed(2);
        return { ...item, quantity: newQuantity, totalWeight: newWeight };
      }
      return item;
    });
    setAsyncData(updatedAsyncData);
    setItem('data', JSON.stringify(updatedAsyncData))
      .then(() => console.log('AsyncData updated and saved to AsyncStorage'))
      .catch(error => console.error('Error saving updated data to AsyncStorage:', error));
  };



  useEffect(() => {
    getprofession();
    getstates();
    getcities();
    fetchData();
    calculateTotalWeight()
  }, [modalQVisible, modalVisible]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  };

  return (
    <>
      <View style={styles.container}>
        <Header />
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          <View style={styles.cart}>
            {asyncData.length > 0 ? (
              asyncData.map((item, i) => (
                <View style={styles.productview} key={i}>
                  {/* <TouchableOpacity style={styles.editIconContainer} onPress={() => { changedata(item) }}>
                    <FontAwesome name="pencil-square-o" size={14} color="white" backgroundColor='#ACD793' />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.removeIconContainer} onPress={() => removeoneAsync(i)}>
                    <AntDesign name="delete" size={14} color="white" backgroundColor='#d9534f' />
                  </TouchableOpacity> */}

                  <View style={styles.productItem} >
                    <View style={styles.productInfo}>
                      <Text style={styles.productName}> {item.product}-{item.sizeinmm}</Text>
                      <Text style={styles.productPrice}>Brand: {item.brandname}</Text>
                      <Text style={styles.productPrice}>Unit: {item.unit}</Text>
                      <View style={{ justifyContent: "flex-start", alignItems: 'center', flexDirection: 'row' }}>
                        <TouchableOpacity style={styles.editIconContainer} onPress={() => { changedata(item) }}>
                          <FontAwesome name="pencil-square-o" size={24} color="white" backgroundColor='#ACD793' />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.removeIconContainer} onPress={() => removeoneAsync(i)}>
                          <AntDesign name="delete" size={24} color="white" backgroundColor='#d9534f' />
                        </TouchableOpacity>
                      </View>


                    </View>
                    <View>
                      <View style={{ justifyContent: "flex-start", alignItems: 'center', flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => changequantity(parseInt(item.quantity) - 1, item.id)}>
                          <Ionicons name="remove-circle-outline" size={44} color="#fda901" />
                        </TouchableOpacity>
                        <TextInput
                          style={styles.quantityText}
                          onChangeText={(text) => {
                            const parsedQuantity = parseInt(text);
                            if (!isNaN(parsedQuantity)) {
                              changequantity(parsedQuantity, item.id);
                            }
                          }}
                          value={item.quantity.toString()}
                          keyboardType="numeric"
                        />

                        <TouchableOpacity onPress={() => changequantity(parseInt(item.quantity) + 1, item.id)}>
                          <Ionicons name="add-circle-outline" size={44} color="#fda901" />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.productWeight}>Weight: {item.totalWeight}</Text>
                    </View>

                    {/* <View style={{ justifyContent: "flex-start", alignItems: 'center', flexDirection: 'row' }} >
                      <TouchableOpacity onPress={() => changequantity(parseInt(item.quantity) - 1, item.id)}>
                        <Ionicons name="remove-circle-outline" size={44} color="#fda901" />
                      </TouchableOpacity>
                      <TextInput
                        style={styles.quantityText}
                        onChangeText={(text) => {
                          const parsedQuantity = parseInt(text);
                          if (!isNaN(parsedQuantity)) {
                            changequantity(parsedQuantity, item.id);
                          }
                        }}
                        value={item.quantity.toString()} 
                        keyboardType="numeric"
                      />

                      <TouchableOpacity onPress={() => changequantity(parseInt(item.quantity) + 1, item.id)}>
                        <Ionicons name="add-circle-outline" size={44} color="#fda901" />
                      </TouchableOpacity>
                    </View> */}
                  </View>
                </View>
              ))) : (
              <View style={styles.noDataContainer}>
                <Image source={require('../assets/cart1.png')} />
              </View>
            )}
          </View>
        </ScrollView>
        {asyncData.length > 0 && (
          <View >
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: 'white', padding: 8,
              paddingHorizontal: 25,
              // marginBottom: 10
            }}>
              <Text style={{ color: '#6C4D38', fontSize: 20 }}>Total Weight:</Text>
              <Text style={{ color: '#6C4D38', fontSize: 20 }}>{calculateTotalWeight()}</Text>
            </View>
            <View style={styles.footerButtonContainer}>
              <View style={styles.footerButton}>
                <TouchableOpacity style={styles.removeallcartButton} onPress={() => removeAsync()}>
                  <Text style={styles.buttonText}>Clear Cart</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.footerButton}>
                <TouchableOpacity style={styles.quotationButton} onPress={() => quotation()}>
                  <Text style={styles.buttonText}>Request Quotation</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        {modalVisible && (
          <CustomModal
            modalVisible={modalVisible}
            toggleModal={toggleModal}
            units={units}
            brands={brands}
            productWeight={productWeight}
          />
        )}

        {modalQVisible && (
          <Quotationmodel
            modalQVisible={modalQVisible}
            toggleQModal={toggleQModal}
            professions={professions}
            asyncData={asyncData}
            cities={cities}
            states={states}
          />
        )}
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
    </>

  )
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
  cart: {
    paddingRight: 10,
    marginTop:10
  },
  productview: {
    marginStart: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    backgroundColor: 'white',
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
  },
  editIconContainer: {
    // padding:8,
    paddingRight: 12,
    paddingTop: 9

  },
  removeIconContainer: {
    paddingTop: 9
  },

  productItem: {
    flexDirection: 'row',
    // borderBottomWidth: 1,
    // borderBottomColor: '#FDBF52',
    // paddingVertical: 10,
    justifyContent: 'space-between'
  },
  productButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#FDBF52',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: '#888',
  },
  productWeight: {
    fontSize: 18,
    color: '#fda901',
    alignItems: 'center'
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  BrandtName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  footerButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f9f9f9',
  },
  footerButton: {
    flex: 1,
  },
  removeallcartButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  quotationButton: {
    backgroundColor: '#ACD793',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDBF52',
    borderRadius: 5,
    paddingHorizontal: 5,
  },
  quantityText: {
    fontSize: 14,
    textAlign: 'center'
  },
})
