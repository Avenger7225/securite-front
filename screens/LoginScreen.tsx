import { Text, View, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
const logo = require('../assets/securite-logo.jpeg');

export default function LoginScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="example@email.com"
          placeholderTextColor="#ccc"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#ccc"
          secureTextEntry={true}
        />
        <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Tabs')}>
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText} onPress={() => navigation.navigate('ForgotPassword')}>Forgot your password?</Text>
      <Text style={styles.footerText} onPress={() => navigation.navigate('Register')}>Don't have an account? Sign up</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#042C6B',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 32,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 350,
    height: 300,
    marginBottom: -80,
    resizeMode: 'contain',
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: '#042C6B',
    color: '#ccc',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#042C6B',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    color: '#ccc',
    fontSize: 16,
  },
});
