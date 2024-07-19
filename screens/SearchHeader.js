import React, { useEffect, useState,useContext } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { getItem, setItem } from "./AsyncStorage";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { UserContext } from './Context/UserState';


function SearchHeader() {
  const [query, setQuery] = useState('');
  const [suggestion, setSuggestion] = useState([]);
  const [products, setProducts] = useState([]);
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const navigation = useNavigation();

  useEffect(() => {
    axios.post(apiUrl + "api/products")
      .then((res) => {
        setProducts(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSearch = (text) => {
    setQuery(text);
    if (text.length > 0) {
      const filteredSuggestions = products.filter((product) =>
        product.product.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestion(filteredSuggestions);
    } else {
      setSuggestion([]);
    }
  };

  const  handleSelectSuggestion = async(selectedProduct) => {
    setQuery(selectedProduct.product);
    setSuggestion([]);
    Keyboard.dismiss(); 
    try {
      const storedProducts = await getItem('selectedProducts');
      console.log("hstoredProducts",storedProducts);
      let productsArray = storedProducts ? JSON.parse(storedProducts) : [];
      const isProductInList = productsArray.some(product => product.id === selectedProduct.id);
      if (!isProductInList) {
        productsArray.push(selectedProduct);
        await setItem('selectedProducts', JSON.stringify(productsArray));
      }
    } catch (error) {
      console.log("Error saving product to AsyncStorage", error);
    }
      navigation.navigate('ProductScreen', { 
        selectedCategoryId: selectedProduct.categoryid, 
        selectedProductId: selectedProduct.id,
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      setQuery('');
      setSuggestion([]);
    }, [])
  );

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search"
          placeholderTextColor="gray"
          value={query}
          onChangeText={handleSearch}
          autoFocus={true}
          style={styles.searchInput}
        />
        <TouchableOpacity style={styles.searchIcon}>
          <Ionicons name="search" size={20} color="gray" />
        </TouchableOpacity>
        {suggestion.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <FlatList
              data={suggestion}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.suggestionItem} onPress={() => handleSelectSuggestion(item)}>
                  <Text style={styles.suggestion}>{item.product}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    flex:1,
    backgroundColor: '#00000008',
    width: '100%',
  },
  searchInput: {
    color: 'black',
    paddingLeft: 10,
    backgroundColor: '#00000008',
    width: '100%',
  },
  searchIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 45,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    zIndex: 1, 
  },
  suggestionItem: {
    zIndex: 2, 
  },
  suggestion: {
    padding: 8,
    backgroundColor: '#fda90120',
    borderBottomWidth: 1,
    borderBottomColor: '#fda901',
  },
});

export default SearchHeader;
