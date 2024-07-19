import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { getItem } from './AsyncStorage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const SearchScreen = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const navigation = useNavigation();

  const fetchSelectedProducts = async () => {
    try {
      const storedProducts = await getItem('selectedProducts');
      const productsArray = storedProducts ? JSON.parse(storedProducts) : [];
      setSelectedProducts(productsArray);
    } catch (error) {
      console.log('Error fetching products from AsyncStorage', error);
    }
  };

  useEffect(() => {
    fetchSelectedProducts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchSelectedProducts();
    }, [])
  );

  const handlenavigate = (selectedProduct) => {
    navigation.navigate('ProductScreen', {
      selectedCategoryId: selectedProduct.categoryid,
      selectedProductId: selectedProduct.id,
    });
  };

  return (
    <View style={styles.container}>
      {selectedProducts.length > 0 ? (
        <View style={styles.productsContainer}>
          {selectedProducts.map((item) => (
            <TouchableOpacity key={item.id} onPress={() => handlenavigate(item)} style={styles.productItem}>
              <Text style={styles.productName}>{item.product}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text style={styles.noProductsText}>No products selected</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fda90120',
  },
  header: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 16,
  },
  productsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    
  },
  productItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderRadius:26

  },
  productName: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
    borderRadius:10

  },
  noProductsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
});

export default SearchScreen;
