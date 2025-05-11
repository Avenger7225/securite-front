import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import Tabs from './Tabs';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Tabs" component={Tabs} />
      </Stack.Navigator>
  );
}
