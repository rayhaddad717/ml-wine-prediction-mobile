import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import WinePredict from './components/WinePredict';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SCREENS} from './constants/screens';
import {COLORS} from './constants/styles';
import ImagePredict from './components/ImagePredict';
import BulkPredict from './components/BulkPredict';
const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName = 'home';
          switch (route.name) {
            case SCREENS.HOME: {
              iconName = focused ? 'home' : 'home-outline';
              break;
            }
            case SCREENS.IMAGE_PREDICT: {
              iconName = focused ? 'image' : 'image-outline';
              break;
            }
            case SCREENS.BULK_PREDICT: {
              iconName = focused ? 'folder' : 'folder-outline';
              break;
            }
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.PRIMARY_BLUE,
        tabBarInactiveTintColor: COLORS.GRAY,
      })}>
      <Tab.Screen name={SCREENS.HOME} component={WinePredict} />
      <Tab.Screen name={SCREENS.IMAGE_PREDICT} component={ImagePredict} />
      <Tab.Screen name={SCREENS.BULK_PREDICT} component={BulkPredict} />
    </Tab.Navigator>
  );
}
