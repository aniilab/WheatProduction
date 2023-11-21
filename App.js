import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 
import WheatListScreen from './screens/WheatInfo';
import AuthorScreen from './screens/Author';
import AddWheatScreen from './screens/AddWheat';
import ContactsScreen from './screens/Contacts';
import MapRouteComponent from './screens/Map';
import StyleSheet from 'react-native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const WheatInfo = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="WheatListScreen" component={WheatListScreen} />
  </Stack.Navigator>
);
const MapRoute = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MapRoute" component={MapRouteComponent} />
  </Stack.Navigator>
);
const WheatAdd = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AddWheatScreen" component={AddWheatScreen} />
  </Stack.Navigator>
);
const Author = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Author" component={AuthorScreen} />
  </Stack.Navigator>
);
const Contacts = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Contacts" component={ContactsScreen} />
  </Stack.Navigator>
);

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: '#48cae4',
          inactiveTintColor: 'gray',
        }}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Info') {
              iconName = 'ios-leaf';
            } else if (route.name === 'Add') {
              iconName = 'ios-add-circle';
            } else if (route.name === 'MapRoute') {
              iconName = 'ios-location';
            } else if (route.name === 'Contacts') {
              iconName = 'ios-call';
            } else if (route.name === 'Author') {
              iconName = 'ios-person';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="Info"
          component={WheatInfo}
          options={{
            tabBarShowLabel:false
          }}
        />
        <Tab.Screen
          name="Add"
          component={WheatAdd}
          options={{
            tabBarShowLabel:false
          }}
        />
        <Tab.Screen
          name="MapRoute"
          component={MapRoute}
          options={{
            tabBarShowLabel:false
          }}
        />
        <Tab.Screen
          name="Contacts"
          component={Contacts}
          options={{
            tabBarShowLabel:false
          }}
        />
        <Tab.Screen
          name="Author"
          component={Author}
          options={{
            tabBarShowLabel:false
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
