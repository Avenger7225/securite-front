import { StyleSheet, Text, Image, TextInput, TouchableOpacity, View, Alert } from 'react-native'
import React from 'react'

const logo = require('../assets/securite-logo.jpeg');

export default function ForgotPasswordScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.back}>←</Text>
      </TouchableOpacity>
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

        <TouchableOpacity style={styles.button} onPress={() =>
          Alert.alert(
            'Se enviara un codigo de recuparcion a su correo',
            '¿Estás seguro?',
            [
              { text: 'OK', onPress: () => Alert.alert('✅','Se ha enviado su codigo de recuperacion'), },
            ],
          )
        }>
          <Text style={styles.buttonText}>Send code</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText} onPress={() => navigation.navigate('Login')}>Already have an account? Login</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#042C6B',
    justifyContent: 'space-around',
    paddingHorizontal: 32,
  },
  back: {
    marginTop: -40,
    fontSize: 20,
    textAlign: 'left',
    color: 'white'
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 350,
    height: 300,
    marginTop: -70,
    marginBottom: -120,
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
    textAlign: 'center',
    marginTop: -30,
    marginBottom: 10,
    color: '#ccc',
    fontSize: 16,
  },
});