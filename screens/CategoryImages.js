import { StyleSheet, Text, View,ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function CategoryImages({categories,handleChangeCategory}) {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    const getCategoryImage = (id) => {
        const imageUrl = `${apiUrl}categorypics/${id}.png`;
        return imageUrl;
      };
  return (
    <Animated.View entering={FadeInDown.duration(500).springify()}>
    <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    className='space-x-4'
    contentContainerStyle={{paddingHorizontal:15}}
    >
        {
            categories.map((cat,index)=>{
                return(
                    <TouchableOpacity
                    key={index}
                    className='flex items-center space-y-1'
                    onPress={()=>handleChangeCategory(cat)}  
                    >
                        <View className={'rounded-full p-[6px]'}>
                            <Image 
                            // source={{uri:cat.strCategoryThumb}}
                            source={{ uri: getCategoryImage(cat.id) }}
                            style={{width:hp(6),height:hp(6)}}
                            className="rounded-full"
                            />
                        </View>
                        <Text className='text-neutral-600' style={{fontSize:hp(1.6)}}
                        >
                            {cat.strCategory}
                        </Text>
                    </TouchableOpacity>
                )
            })
        }
    </ScrollView>
</Animated.View>
  )
}

const styles = StyleSheet.create({})