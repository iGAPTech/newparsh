import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, Animated, Easing, StatusBar,Platform } from 'react-native';
import { Ionicons, AntDesign, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';

export default function CategoryScreen({ navigation, route }) {
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
        if (route.params&&route.params.selectedCategory) {
          setSelectedCategoryId(route.params.selectedCategory.id);
        } else {
          setSelectedCategoryId(response.data.data[0]?.id || null);
        }
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
  }, [route.params]);

  useEffect(() => {
    if (productListRef.current) {
      productListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
    console.log(selectedCategoryId);
  }, [selectedCategoryId]);

  const productListRef = useRef(null);

  const viewProductWeights = (selectedProductId) => {
    navigation.navigate('ProductScreen', { selectedCategoryId, selectedProductId });
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
    outputRange: [0, 800],  // Adjust '200' to the desired height of the category list
  });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#fda901'} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.breadcrumb}>
          <AntDesign name="bars" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Shopping by Category</Text>
        <TouchableOpacity style={styles.searchIcon} onPress={() => {navigation.navigate('SearchScreen') }}>
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={toggleCategoryList}
        >
          <Animated.View style={{ transform: [{ rotate }] }}>
            <MaterialIcons name={isCategoryListVisible ? 'arrow-left' : 'arrow-right'} size={24} color="white" />
          </Animated.View>
        </TouchableOpacity>

        {isCategoryListVisible && (
          <Animated.View style={[styles.contentBox, { flex: 0.3 }]}>
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
            />
          </Animated.View>
        )}

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
            showsVerticalScrollIndicator={false}
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
    backgroundColor: '#fda90120',
    paddingTop:30
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    padding: 10,
    // marginTop: 40,
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
    backgroundColor: '#fda901',
    zIndex: 1,
  },
  breadcrumb: {
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  searchIcon: {
    marginLeft: 10,
  },
  categoryContainer: {
    backgroundColor: '#f8f8f8',
    padding: 10,
    overflow: 'hidden',
  },
  contentContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  contentBox: {
    // borderWidth: 1,
    // borderColor: '#fda901',
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
    // color: '#fda901',
  },
  activeCategory: {
    backgroundColor: '#fda90120',
    borderRightColor:'#fda901',
    // borderWidth: 4,
    borderRightWidth: 3,
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
    borderColor: '#fda901',
    borderWidth: 1,
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
    // color: '#fda901',
  },
  selectedCategoryText: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    // color: '#fda901',
  },
  toggleButton: {
    position: 'absolute',
    zIndex: 2,
    top: '50%',
    left: 10,
    backgroundColor: '#fda901',
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
