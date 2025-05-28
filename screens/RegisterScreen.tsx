import { StyleSheet, Text, Image, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import React, { useState } from 'react';

const logo = require('../assets/securite-logo.jpeg');

export default function RegisterScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (password.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    try {
      // const response = await fetch('http://192.168.0.133:3000/api/register',
      const response = await fetch('http://192.168.0.133:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          phone_number: phoneNumber,
          email: email,
          password_u: password,
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        Alert.alert('Éxito', 'Usuario creado con éxito');
        navigation.replace('Login');
      } else {
        let errorMessage = 'Ocurrió un error desconocido';
        if (data && typeof data.error === 'string') {
          errorMessage = data.error;
        } else if (data && typeof data.detail === 'string') {
          errorMessage = data.detail;
        } else if (data) {
          errorMessage = JSON.stringify(data);
        }
        Alert.alert('Error', errorMessage);
      }
    } catch (error: any) {
      console.error('Error en la conexión o en la solicitud:', error);
      let alertMessage = 'No se pudo conectar con la API';
      if (error && typeof error.message === 'string') {
        alertMessage += `: ${error.message}`;
      }
      Alert.alert('Error', alertMessage);
    }
  };

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
          placeholder="User name"
          placeholderTextColor="#ccc"
          onChangeText={setUsername}
          value={username}
        />
        <TextInput
          style={styles.input}
          placeholder="Example@email.com"
          placeholderTextColor="#ccc"
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone number"
          placeholderTextColor="#ccc"
          keyboardType="numeric"
          onChangeText={setPhoneNumber}
          value={phoneNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#ccc"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm password"
          placeholderTextColor="#ccc"
          secureTextEntry
          onChangeText={setConfirmPassword}
          value={confirmPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText} onPress={() => navigation.navigate('Login')}>
        Already have an account? Login
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#042C6B',
    justifyContent: 'space-around',
    paddingHorizontal: 32,
  },
  back: {
    fontSize: 20,
    textAlign: 'left',
    color: 'white',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 350,
    height: 300,
    marginTop: -70,
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
    textAlign: 'center',
    marginTop: -30,
    marginBottom: 10,
    color: '#ccc',
    fontSize: 16,
  },
});