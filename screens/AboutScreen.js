import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ScrollView } from 'react-native';


export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 50 }}
      >
      <View className='justify-space-between flex-row'>
      <Image source={require('../assets/icon1.png')} style={styles.logo} />
      <Text style={{marginTop:20,fontSize: hp(2.2),color:'#6C4D38'}}>Welcome to <Text className='text-amber-500'>Parshwanath Group</Text> {'\n'}
     <Text className='text-[14px]'>Your Trusted Steel Solution {'\n'} Provider in Western Maharashtra!</Text>  </Text>
      </View>

    <View >
      <Text style={styles.text}>
        {/* Welcome to Parshwanath Group - Your Trusted Steel Solution Provider in Western Maharashtra!{'\n\n'} */}
        The foundation of Parshwanath Group is built on two subsidiary companies, each excelling in its domain. Parshwanath Isapt Pvt Ltd is the authorized distributor of TATA Structura, ensuring that the best products from TATA are readily available to our valued customers in Western Maharashtra. Meanwhile, Pritam Steel Pvt. Ltd. proudly holds the position of an authorized dealer for esteemed brands such as SAIL, RINL (Vizag), and ArcellorMittal Nipon Steel (AMNS), among others.
      </Text>
      <Image source={require('../assets/why-choose.png')} style={{height:400,width:400}} />
      <Image source={require('../assets/industries.png')} style={{height:400,width:400}} />
    </View>
      </ScrollView> 
  
  </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: hp(2),
    backgroundColor:"#fda90120"

   
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  textContainer: {
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
    padding: 10, 
    marginBottom: 10, 
    borderRadius: 8, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    color: '#333', // example color
  },
});