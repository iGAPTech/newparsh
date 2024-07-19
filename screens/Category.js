import { StyleSheet, Text, View, TouchableOpacity, Platform, Image, FlatList, Animated, Easing } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { Ionicons, AntDesign, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';

export default function CategoryScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [products, setProducts] = useState([]);
  const [isCategoryListVisible, setIsCategoryListVisible] = useState(true);
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  
  const heightAnim = useRef(new Animated.Value(1)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // categories
    axios.post(apiUrl + 'api/categories')
      .then(response => {
        setCategories(response.data.data);
        setSelectedCategoryId(response.data.data[0]?.id || null);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });

    // products
    axios.post(apiUrl + 'api/products')
      .then(response => {
        setProducts(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const productListRef = useRef(null);

  useEffect(() => {
    if (productListRef.current) {
      productListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, [selectedCategoryId]);

  const viewProductWeights = (selectedProductId) => {
    navigation.navigate('Products', { selectedCategoryId, selectedProductId });
  }

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.categoryItem, selectedCategoryId === item.id && styles.activeCategory]}
      onPress={() => setSelectedCategoryId(item.id)}
    >
      <Image source={{ uri: `${apiUrl}categorypics/${item.id}.png` }} style={styles.categoryImage} />
      <Text style={styles.categoryTitle}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }) => (
    <TouchableOpacity style={styles.productItem} onPress={() => { viewProductWeights(item.id) }}>
      <Image source={{ uri: `${apiUrl}productpics/${item.id}.png` }} style={styles.productImage} />
      <Text style={styles.productName}>{item.product}</Text>
    </TouchableOpacity>
  );

  const toggleCategoryList = () => {
    setIsCategoryListVisible(!isCategoryListVisible);
    Animated.timing(heightAnim, {
      toValue: isCategoryListVisible ? 0 : 1,  // Toggle between full height and hidden
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    Animated.timing(rotationAnim, {
      toValue: isCategoryListVisible ? 1 : 0,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  const rotate = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  const animatedHeight = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],  // Adjust '200' to the desired height of the category list
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.breadcrumb}>
          <AntDesign name="bars" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Shopping by Category</Text>
        <TouchableOpacity style={styles.searchIcon} onPress={() => { }}>
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={toggleCategoryList}
        >
          <Animated.View style={{ transform: [{ rotate }] }}>
            <MaterialIcons name={isCategoryListVisible ? 'arrow-left' : 'arrow-right'} size={24} color="black" />
          </Animated.View>
        </TouchableOpacity>

        <Animated.View style={[styles.categoryContainer, { height: animatedHeight }]}>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={{ flexGrow: 1 }}
          />
        </Animated.View>

        <View style={[styles.contentBox, { flex: isCategoryListVisible ? 0.7 : 1 }]}>
          {selectedCategoryId ? (
            <Text style={styles.selectedCategoryText}>
              {categories.find(cat => cat.id === selectedCategoryId)?.name}
            </Text>
          ) : null}
          <FlatList
            ref={productListRef}
            data={products.filter(product => product.categoryid === selectedCategoryId)}
            renderItem={renderProductItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.productList}
            numColumns={2}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    padding: 10,
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
  breadcrumb: {
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchIcon: {
    marginLeft: 10,
  },
  contentContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  categoryContainer: {
    backgroundColor: '#f8f8f8',
    padding: 10,
    overflow: 'hidden',
  },
  contentBox: {
    borderWidth: 1,
    borderColor: '#FEBE10',
  },
  categoryItem: {
    alignItems: 'center',
    marginVertical: 10,
  },
  categoryImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  categoryTitle: {
    marginTop: 5,
    fontSize: 16,
  },
  activeCategory: {
    backgroundColor: '#ccc',
  },
  productItem: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
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
    borderRadius: 10,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  productName: {
    marginTop: 5,
    fontSize: 16,
    textAlign: 'center',
  },
  selectedCategoryText: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  toggleButton: {
    position: 'absolute',
    zIndex: 2,
    top: '50%',
    left: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  productList: {
    flexGrow: 1,
    paddingHorizontal: 10,
  },
});
