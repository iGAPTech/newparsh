import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';

export default function ContactScreen() {
  return (
    <ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{ paddingBottom: 50 }}
    >
    <View style={styles.container}>
 
      <View style={styles.textContainer}>
        <View style={styles.imageContainer}>
          <Image source={require('../assets/ParshwanathSteel.png')} style={styles.image} />
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={24} color="black" style={styles.icon} />
            <Text style={styles.infoText}>
              Parshwanath Steel Yard, 120/1, P.B.Road, N.H.4, SHIROLI(P), Kolhapur, Maharashtra - 416122
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time" size={24} color="black" style={styles.icon} />
            <Text style={styles.infoText}>
              Tue To Sun - 10.00 - 07.00 Monday - Closed
            </Text>
          </View>
          <View style={styles.infoRow}>
          <Ionicons name="mail" size={24} color="black" style={styles.icon} />
            <Text style={styles.infoText}>
              sales@parshwanathsteel.com
            </Text>
          </View>
          <View style={styles.infoRow}>
          <Ionicons name="call" size={24} color="black" style={styles.icon} />
            <Text style={styles.infoText}>
              +91 9607815933 , +91 9607715933
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.textContainer}>
        <View style={styles.imageContainer}>
          <Image source={require('../assets/PritamSteel.png')} style={styles.image} />
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={24} color="black" style={styles.icon} />
            <Text style={styles.infoText}>
            Pritam Steel Pvt.Ltd., Gat No. 428, NH4, Opp. Kolhapur Steel, Nagaon, Kolhapur - 416122
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time" size={24} color="black" style={styles.icon} />
            <Text style={styles.infoText}>
              Tue To Sun - 10.00 - 07.00 Monday - Closed
            </Text>
          </View>
          <View style={styles.infoRow}>
          <Ionicons name="mail" size={24} color="black" style={styles.icon} />
            <Text style={styles.infoText}>
            sales@pritamsteel.com
            </Text>
          </View>
          <View style={styles.infoRow}>
          <Ionicons name="call" size={24} color="black" style={styles.icon} />
            <Text style={styles.infoText}>
            +91 9607095933 , +91 9028014952
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.textContainer}>
        <View style={styles.imageContainer}>
          <Image source={require('../assets/ProvackLogo.png')} style={styles.image} />
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={24} color="black" style={styles.icon} />
            <Text style={styles.infoText}>
            Provack Structural Steels Pvt. Ltd., Kunjirwadi ,{'\n'} Pune - 412201
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time" size={24} color="black" style={styles.icon} />
            <Text style={styles.infoText}>
              Tue To Sun - 10.00 - 07.00 Monday - Closed
            </Text>
          </View>
          <View style={styles.infoRow}>
          <Ionicons name="mail" size={24} color="black" style={styles.icon} />
            <Text style={styles.infoText}>
            sales@provacksteel.in
            </Text>
          </View>
          <View style={styles.infoRow}>
          <Ionicons name="call" size={24} color="black" style={styles.icon} />
            <Text style={styles.infoText}>
            +91 9925200399
            </Text>
          </View>
        </View>
      </View>
   
    </View>
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: "#fda90120",
    // justifyContent: 'center',
  },
  textContainer: {
    // padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 2,
    // elevation: 2,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FDBF52',
    marginBottom:10
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20, 
  },
  image: {
    height: 50,
    width: 150,
    resizeMode: 'contain',
  },
  infoContainer: {
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
});
