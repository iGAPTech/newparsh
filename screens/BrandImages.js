import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function BrandImages() {

    const renderBrandCard = ({ item, index,navigation }) => {
        let isEven = index % 2 == 0;
        return (
            <Animated.View style={{width: '50%',}} entering={FadeInDown.delay(index*100).duration(600).springify().damping(12)}>
          <Pressable
            style={{  paddingLeft: isEven ? 0 : 8, paddingRight: isEven ? 8 : 0 }}
            // onPress={() => console.log("Item pressed:", item.strMeal)}
            onPress={() => navigation.navigate('ReceipeDetails',{...item})}
          >
            <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
              <Animated.Image
                source={{ uri: item.strMealThumb }}
                style={{ width: '100%', height: hp(35), borderRadius: 35, backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
                // sharedTransitionTag={item.strMeal}
                // sharedTransitionTag={item.strMeal}
              />
        
    
              <Text> 
                {item.strMeal.length>20? item.strMeal.slice(0,20)+'...':item.strMeal} 
              </Text>
            </View>
          </Pressable>
          </Animated.View>
        );
      };

  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
    <Text style={{ fontSize: hp(3), fontWeight: 'bold', color: '#333' }}>Brand</Text>
    {categories.length ==0 || meals.length==0?(
      <Loading size='large' className='mt-50' />
    ):(
      <FlatList
      data={meals}
      keyExtractor={(item) => item.idMeal}
      numColumns={2}
      // renderItem={({item,index})=><renderReceipeCard item={item} index={index} navigatio={navigation} />}
      renderItem={({ item, index }) => renderBrandCard({ item, index, navigation })}

      showsVerticalScrollIndicator={false}
      onEndReachedThreshold={0.1}
      contentContainerStyle={{ paddingTop: 16 }}
    />
    )}
   
  </View>
  )
}

const styles = StyleSheet.create({})