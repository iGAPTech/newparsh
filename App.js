import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Image, Text, View, StyleSheet } from 'react-native';
import { Linking } from 'react-native';

import HomeScreen from './screens/HomeScreen';
import CategoryScreen from './screens/CategoryScreen';
import MyAccountScreen from './screens/MyAccountScreen';
import ContactScreen from './screens/ContactScreen';
import AboutScreen from './screens/AboutScreen';
import CartScreen from './screens/CartScreen';
import ProductScreen from './screens/ProductsScreen';
import { TransitionPresets } from '@react-navigation/stack';
import WelcomeScreen from './screens/WelcomeScreen';
import Login from './screens/Login';
import ContextProvider from './screens/Context/UserState';
import ProfileScreen from './screens/ProfileScreen';
import QuotationsScreen from './screens/QuotationsScreen';
import PrintQuotationScreen from './screens/PrintQuotationScreen';
import Header from './screens/Header';
import SearchScreen from './screens/SearchScreen';
import SearchHeader from './screens/SearchHeader';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Function to define custom drawer content
const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{flex: 1, justifyContent: 'space-between'}}>
      <View>
        <DrawerItemList {...props} />

        <DrawerItem
          label="Home"
          onPress={() => props.navigation.navigate('Home')}
          icon={({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={size}
              color={color}
            />
          )}
        />

        <DrawerItem
          label="About Us"
          onPress={() => props.navigation.navigate('AboutUs')}
          icon={({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'information-circle' : 'information-circle-outline'}
              size={size}
              color={color}
            />
          )}
        />
        <DrawerItem
          label="Contact"
          onPress={() => props.navigation.navigate('ContactScreen')}
          icon={({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'call' : 'call-outline'}
              size={size}
              color={color}
            />
          )}
        />
        {/* <DrawerItem
          label="Close Drawer"
          onPress={() => props.navigation.closeDrawer()}
          icon={({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'close-circle' : 'close-circle-outline'}
              size={size}
              color={color}
            />
          )}
        /> */}
      </View>
      <View style={styles.footer}>
      <TouchableOpacity onPress={() => Linking.openURL('https://igaptechnologies.com/')}>
  <Text style={styles.footerText}>Developed by iGAP Technologies</Text>
</TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

// Tab Navigator
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Category') {
          iconName = focused ? 'list' : 'list-outline';
        } else if (route.name === 'Cart') {
          iconName = focused ? 'cart' : 'cart-outline';
        } else if (route.name === 'MyAccount') {
          iconName = focused ? 'person' : 'person-outline';
        }
        return <Ionicons name={iconName} size={size} color={focused ? '#FEBE10' : '#222'} />;
      },
      tabBarActiveTintColor: '#FEBE10',
      tabBarInactiveTintColor: '#222',
      tabBarStyle:{...styles.tabbarcontainer}

    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Category" component={CategoryScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Cart" component={CartScreen} options={{ headerShown: false }} />
    <Tab.Screen name="MyAccount" component={MyAccountScreen} options={{ headerShown: false, title: 'My Account' }} />
  </Tab.Navigator>
);

// Drawer Navigator
const DrawerNavigatorInner = () => (
  <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
    <Drawer.Screen
      name="Parshwnath"
      component={TabNavigator}
      options={{
        drawerIcon: ({ focused, color, size }) => (
          <Image
            source={require('./assets/icon1.png')}
            style={{ width: 30, height: 30 }}
          />
        ),
        headerShown: false,
      }}
    />
  </Drawer.Navigator>
);

const MainStackNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      ...TransitionPresets.SlideFromRightIOS,
    }}
  >
    <Stack.Screen name="/" component={WelcomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Drawer" component={DrawerNavigatorInner} options={{ headerShown: false }} />
    <Stack.Screen name="AboutUs" component={AboutScreen} options={{ title: 'About Us' }} />
    <Stack.Screen name="ContactScreen" component={ContactScreen} options={{ title: 'Contact Us' }} />
    <Stack.Screen name="ProductScreen" component={ProductScreen} options={{ headerTintColor: 'white', headerStyle: { backgroundColor: '#fda901' } }} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Quotations" component={QuotationsScreen} />
    <Stack.Screen name="Printquotation" component={PrintQuotationScreen} options={{ title: 'View Quotation' }} />
    <Stack.Screen name="SearchScreen" component={SearchScreen} options={{
      headerTitle: (props) => <SearchHeader {...props} />,
    }} />
  </Stack.Navigator>
);

// Main App Component
const App = () => {
  return (
    <ContextProvider>
      <NavigationContainer>
        <MainStackNavigator />
      </NavigationContainer>
    </ContextProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  footer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor:'#fda901'
  },
  footerText: {
    fontSize: 14,
    color: 'white',
  },
  tabbarcontainer:{
    padding:8,
    // height:60,
  }
});
