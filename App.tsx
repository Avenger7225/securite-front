import { Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import "./global.css";

const logo = require('./assets/securite-logo.jpeg');

export default function Index() {

  return (
    <View className='flex-1 bg-[#042C6B] items-center justify-around px-8'>
      <View className='items-center'>
        <Image source={logo} className='w-80 h-80 resize-contain' />
      </View>

      <View className='w-full'>
        <TextInput
          className='bg-[#042C6B] rounded-lg py-4 px-5 mb-4 text-gray-300'
          placeholder="example@email.com"
          placeholderTextColor="#ccc"
          keyboardType="email-address"
        />
        <TextInput
          className='bg-[#042C6B] rounded-lg py-4 px-5 mb-4 text-gray-300'
          placeholder="Password"
          placeholderTextColor="#ccc"
          secureTextEntry={true}
        />
        <TouchableOpacity className='bg-white rounded-lg py-4 items-center'>
          <Text className='text-[#042C6B] text-lg font-bold'>Log in</Text>
        </TouchableOpacity>
      </View>

      <Text className='text-gray-400 mb-2 text-base'>Forgot your password?</Text>
      <Text className='text-gray-400 text-base'>Don't have an account? Sign up</Text>
    </View>
  );
}