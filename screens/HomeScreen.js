import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Image, Animated, Dimensions, ScrollView, Text, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import Carousel from 'react-native-reanimated-carousel';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { BellIcon, MagnifyingGlassCircleIcon } from 'react-native-heroicons/outline'
import CategoryImages from './CategoryImages';
import Header from './Header';


const HomeScreen = ({navigation}) => {
  const width = Dimensions.get('window').width;
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const seachsuggestion = [
    { id: 1, name: 'Structural section' },
    { id: 2, name: 'Hollow Section' },
    { id: 3, name: 'Roofing solution' },
    // Add more categories as needed
  ];


  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [searchHintIndex, setSearchHintIndex] = useState(0);
  const [searchHint, setSearchHint] = useState(seachsuggestion[0].name);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [FadeInDown] = useState(new Animated.Value(0));
  const [show ,Setshow] = useState('')


  useEffect(() => {

    const loadData = () => {
      axios.post(`${apiUrl}api/categories`).then((res) => {
        setCategories(res.data.data);
        // Setshow(res.data.data.id)
      }).catch((err) => {
        console.log(err);
      });
    };

    const loadBrand = () => {
      axios.post(`${apiUrl}api/brands`).then((res) => {
        setBrands(res.data.data);
      }).catch((err) => {
        console.log(err);
      });
    };

    loadData();
    loadBrand();

    const interval = setInterval(() => {
      setSearchHintIndex((prevIndex) => (prevIndex + 1) % seachsuggestion.length);
      setSearchHint("search for " + seachsuggestion[searchHintIndex].name);
    }, 5000);

    return () => clearInterval(interval);
  }, [searchHintIndex]);

  useEffect(() => {
    Animated.timing(
      FadeInDown,
      {
        toValue: 1,
        // duration: 10000,
        useNativeDriver: true
      }
    ).start();
  }, [searchHint]);



  const getCategoryImage = (id) => {
    const imageUrl = `${apiUrl}categorypics/${id}.png`;
    return imageUrl;
  };

  const getBrandImage = (id) => {
    const imageUrl = apiUrl + 'brandpics/' + id + '.png';
    return imageUrl;
  }

  const brandimagedata = brands.map(brand => ({ id: brand.id, uri: getBrandImage(brand.id) }));

  const renderItem = ({ item }) => (
    <View style={styles.carouselItem}>
      <Image source={{ uri: item }} style={styles.carouselImage} />
    </View>
  );

  const handleChangeCategory = (category) => {
    // console.log("category", category);
    navigation.navigate('Category', { selectedCategory: category });
  };

  const viewallbtn =()=>{
    navigation.navigate('Category');
  }

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        className='space-y-6 pt-5'
      >
        {/* search bar */}
        <TouchableOpacity className=' p-[3px]' style={[styles.searchContainer, { borderColor: '#fda901' }]} onPress={() => navigation.navigate('SearchScreen')}>
          <TextInput
            placeholder={searchHint}
            placeholderTextColor={'gray'}
            style={[{ fontSize: hp(1.7) }, styles.searchInput]}
            className='flex-1 text-base mb-1 pl-3 tracking-wider'
            editable={false} 
          />
          <View className='rounded-full p-3' style={{ backgroundColor: "#fda901" }}>
            <Ionicons name="search" size={hp(2.5)} strokeWidth={3} color="white" />
          </View>
        </TouchableOpacity>
        <Carousel
          loop
          width={width}
          height={width / 2}
          autoPlay={true}
          data={categories.map(category => getCategoryImage(category.id))}
          scrollAnimationDuration={1000}
          renderItem={renderItem}
        />

        {/* Popular Categories */}
        <View style={styles.categoryHeaderContainer}>
          <Text style={[{ fontSize: hp(1.8) }, { color: "#6C4D38" }]} className='font-semibold'>
            Popular Categories
          </Text>
          <TouchableOpacity style={styles.viewAllButton} onPress={viewallbtn}>
            <Text style={[{ fontSize: hp(1.8) }, { color: "#fda901" }]} className='font-semibold'>View All</Text>
            <Ionicons name="arrow-forward" size={16} color="#fda901" />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View>
          {categories.length > 0 && <CategoryImages categories={categories} handleChangeCategory={handleChangeCategory} />}
        </View>

        {/* Popular Brands */}
        <View style={styles.categoryHeaderContainer}>
          <Text style={[{ fontSize: hp(1.8) }, { color: "#6C4D38" }]} className='font-semibold'>
            Popular Brands
          </Text>
        </View>
        <View>
          <FlatList
            horizontal
            data={brandimagedata}
            renderItem={({ item }) => (
              <View style={styles.brandImageContainer}>
                <Image source={{ uri: item.uri }} style={styles.brandImage} />
              </View>
            )}
            keyExtractor={item => item.id.toString()}
            showsHorizontalScrollIndicator={false}
          />
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fda90120',
    flex: 1,
  },
  categoryHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: 10,
    marginTop: 10,
    backgroundColor: '#00000008', // same as bg-black/5
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontWeight: 'bold',
  },
  searchButton: {
    padding: 10,
  },
  fadeInTextContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: 10,
    bottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fadeInText: {
    fontSize: 16,
    color: 'grey',
  },
  carouselItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  brandImageContainer: {
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    padding: 10,
  },
  brandImage: {
    width: wp(20),
    height: hp(10),
    resizeMode: 'contain',
  },
});

export default HomeScreen;
