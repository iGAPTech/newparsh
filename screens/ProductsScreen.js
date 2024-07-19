import { StyleSheet, Text, View, TouchableOpacity, Platform, Image, ScrollView, Modal, TextInput } from 'react-native'
import React, { useCallback, useEffect, useRef, useState,useContext } from 'react'
import CustomModal from './CustomModal';
import axios from 'axios';
import { changeUnits } from './GenericFunctions';
import { getItem, setItem } from "./AsyncStorage";
import { UserContext } from './Context/UserState';

import { useFocusEffect } from '@react-navigation/native';
import * as Progress from 'react-native-progress';
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function ProductScreen({ navigation, route }) {
    const [modalVisible, setModalVisible] = useState(false);

    const [categoryId, setCategoryId] = useState(0);
    const [productId, setProductId] = useState(0);
    const [product, setProduct] = useState(0);
    const [products, setProducts] = useState([]);
    const [productWeights, setProductWeights] = useState([]);
    const [productWeight, setProductWeight] = useState({});
    const [units, setUnits] = useState([]);
    const [brands, setBrands] = useState([]);
    const [singleweight,setSingleweight]=useState(0);
    const pipeTypesScrollViewRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);

  const { asyncData, setAsyncData } = useContext(UserContext);


    // useFocusEffect(
    //   React.useCallback(() => {
    //     refreshProducts();
    //   }, [])
    // );

    // console.log("selectedProductId",route.params.selectedProductId);
  
    useEffect(() => {
      setCategoryId(route.params.selectedCategoryId);
      setProductId(route.params.selectedProductId);
      axios.post(apiUrl + 'api/products').then((res) => {
        let categoryProducts = res.data.data.filter((item) => {
          if (item.id == route.params.selectedProductId) {
            setProduct(item);
          }
          if (item.categoryid == route.params.selectedCategoryId) {
            return true;
          }
          else {
            return false;
          }
        });
        setProducts(categoryProducts);
      }).catch((err) => {
        console.log(err);
      });
      axios.post(apiUrl + 'api/get_category/' + route.params.selectedCategoryId).then((res) => {
        navigation.setOptions({ title: res.data.data.name });
      }).catch((ex) => {
      });
    }, []);
  
    async function refreshProducts(){
      if(productId == 0)
        return;
      try {
          let data =asyncData;
          let dataArray = [];
          if (data) {
            dataArray = data
          }
          axios.post(apiUrl + 'api/productweights/' + productId).then((res) => {
            let products = res.data.data.map((p)=>{
              p.added = false;
              for(let i = 0; i < dataArray.length; i++){
                let element = dataArray[i];
                if(element.pwid == p.id){
                  p.added = true;
                  break;
                }
              }
              return p;
            });
            setProductWeights(products);
          }).catch((ex) => {
            console.log("product weights Error");
          });
      } 
      catch (error) {
        console.error('Error fetching data:', error);
      }
    }

  //   useEffect(() => {
  //     const fetchData = async () => {
  //         const data = await getItem('data');
  //         setAsyncData(JSON.parse(data) || []);
  //     };
  //     fetchData();
  // }, []);
  
  
    useEffect(() => {
      refreshProducts();   
      refreshProductsAfterModal()   
    }, [productId,asyncData]);
  
    useEffect(() => {
      if (pipeTypesScrollViewRef.current && productId !== 0) {
        const selectedProductIndex = products.findIndex(item => item.id === productId);
        if (selectedProductIndex !== -1) {
          pipeTypesScrollViewRef.current.scrollTo({
            x: selectedProductIndex * ITEM_WIDTH,
            animated: true,
          });
        }
      }
    }, [productId, products]);

    const refreshProductsAfterModal = () => {
      refreshProducts(); 
  };
  
  const toggleModal = () => {
      setModalVisible(!modalVisible);
      if (!modalVisible) {
          refreshProductsAfterModal(); 
      }
  };
  
    const productWeightClicked = (pw,singlewight) => {
      setProductWeight(pw);    
      setSingleweight(singlewight)
      setUnits(changeUnits(product));    
      axios.post(apiUrl + 'api/get_pwbrands/' + pw.id).then((res) => {
        setBrands(res.data.data);
        toggleModal();
      }).catch((ex) => {
        console.log("product weight brands Error");
      });
    }
  
    const handleProductItemClick = (id, product) => {
      setIsLoading(true);
      setProduct(product);
      setProductId(id);
      setTimeout(() => {
          setIsLoading(false);
      }, 1000);
  };
  
  return (
    <View style={styles.container}>
    <View style={{ marginTop: 10 }}>
        <ScrollView 
            horizontal={true} 
            showsHorizontalScrollIndicator={false} 
            style={styles.pipeTypesScrollView}
        >
            <View style={styles.pipeTypesContainer}>
                {products.map((item) => (
                    <TouchableOpacity
                        style={[styles.pipeType, item.id === productId && styles.selectedPipeType]}
                        onPress={() => handleProductItemClick(item.id, item)}
                        key={item.id}
                    >
                        <Text style={[styles.pipeTypeText, item.id === categoryId && styles.selectedPipeTypeText]}>
                            {item.product}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    </View>

    {isLoading ? (
        <View style={styles.loadingContainer}>
            {/* <Text style={styles.loadingText}>Please wait...</Text> */}
            <Progress.CircleSnail size={50} indeterminate={true} color='#fda901' />
        </View>
    ) : (
        <ScrollView>
            <View style={styles.cart}>
                {productWeights.map((item, i) => (
                    <View style={styles.productItem} key={i}>
                        <View style={styles.productInfo}>
                            <Text style={[styles.productName, item.selected && styles.selectedProduct]}>
                                {item.sizeinmm}
                            </Text>
                            <Text style={[styles.productPrice, item.selected && styles.selectedProduct]}>
                                Weight: {item.weight}
                            </Text>
                        </View>
                        <TouchableOpacity 
                            style={[styles.addButton, item.added ? styles.changeColor : null]} 
                            onPress={() => productWeightClicked(item, item.weight)}
                        >
                            <Text style={styles.addButtonText}>{item.added ? "CHANGE" : "ADD"}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </ScrollView>
    )}
    
    {modalVisible && (
        <CustomModal
            modalVisible={modalVisible}
            toggleModal={toggleModal}
            units={units}
            brands={brands}
            productWeight={productWeight}
            singleweight={singleweight}
        />
    )}
</View>
  )
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
  },
  pipeTypesScrollView: {
      maxHeight: 80,
  },
  pipeTypesContainer: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      paddingBottom: 10,
  },
  pipeType: {
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      minWidth: 100,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
      marginHorizontal: 5,
  },
  pipeTypeText: {
      marginHorizontal: 5,
      textAlign: 'center',
      fontWeight: 'bold',
      color: '#333',
  },
  selectedPipeType: {
      backgroundColor: '#fda90120',
  },
  selectedPipeTypeText: {
      color: 'white',
  },
  cart: {
      paddingHorizontal: 20,
      marginTop: 10,
  },
  productItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fda90120',
      padding: 15,
      marginBottom: 10,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      // elevation: 2,
  },
  productInfo: {
      flex: 1,
  },
  productName: {
      fontSize: 16,
      fontWeight: 'bold',
  },
  productPrice: {
      fontSize: 14,
      color: '#888',
  },
  addButton: {
      backgroundColor: '#fda901',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 5,
  },
  addButtonText: {
      color: 'white',
      fontWeight: 'bold',
  },
  selectedProduct: {
      backgroundColor: 'lightblue',
  },
  loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  loadingText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
  },
  changeColor: {
      backgroundColor: '#e393f5',
  },
});
