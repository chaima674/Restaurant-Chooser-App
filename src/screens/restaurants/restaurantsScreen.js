import { createStackNavigator } from "@react-navigation/stack";
import ListScreen from "./listScreen";
import AddScreen from "./addScreen";

const Stack = createStackNavigator();

export default function RestaurantsScreen() {
  console.log("RestaurantsScreen rendered");
  return (
    <Stack.Navigator
      initialRouteName="RestaurantsList"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="RestaurantsList" component={ListScreen} />
      <Stack.Screen name="RestaurantsAdd" component={AddScreen} />
    </Stack.Navigator>
  );
}