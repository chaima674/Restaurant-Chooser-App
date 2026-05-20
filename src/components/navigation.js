import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer } from "@react-navigation/native";
import PeopleScreen from "../screens/people/peopleScreen";
import DecisionScreenNavigation from "../screens/decision/decisionScreenNavigation";
import RestaurantsScreen from "../screens/restaurants/restaurantsScreen";
import { Image, Platform } from "react-native";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";

const platformOS = Platform.OS.toLowerCase();
const Tab = createMaterialTopTabNavigator();

export default function Navigation() {
  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Restaurants"
          tabBarPosition={"top"}
          screenOptions={{
            animationEnabled: true,
            swipeEnabled: true,
            lazy: true,
            tabBarActiveTintColor: "red",
            tabBarInactiveTintColor: "gray",
            tabBarIndicatorStyle: { backgroundColor: "red" },
            tabBarStyle: { paddingTop: Constants.statusBarHeight },
          }}
        >
          <Tab.Screen
            name="People"
            component={PeopleScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <Image
                  source={require("../../assets/icon-people.png")}
                  style={{ width: 24, height: 24, tintColor: color }}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Decision"
            component={DecisionScreenNavigation}
            options={{
              tabBarIcon: ({ color }) => (
                <Image
                  source={require("../../assets/icon-decision.png")}
                  style={{ width: 24, height: 24, tintColor: color }}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Restaurants"
            component={RestaurantsScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <Image
                  source={require("../../assets/icon-restaurants.png")}
                  style={{ width: 24, height: 24, tintColor: color }}
                />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}