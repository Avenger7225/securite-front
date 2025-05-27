import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput , Alert, Button, GestureResponderEvent } from 'react-native';
import { UbicacionContext } from '../context/UbicacionContext';
import MapaWebView from '../components/MapaWebView';
import { CommonActions, useNavigation } from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFrameCallback } from 'react-native-reanimated';

const photo = require('../assets/images.jpg');

const UserScreen = () => { // recordatorio: usar llaves pa que no chille con los hooks xd
  const [username, setUsername] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setUsername(user.username);
      }
    };

    loadUser();
  }, []);

  return(
    <View style={styles.screenContent}>
      <View style={styles.UserPhotoContainer}>
        <Image source={photo} style={styles.UserPhoto0} />
      </View>
      <Text style={styles.TitleTextUser}>{username}</Text>
      <Text style={styles.SubtitleTextUser}>Dueño de 20 neartags a la verga</Text>
    </View>
  )
};

const ActualizarDatosScreen = () => (
  <View style={styles.screenContent}>
  </View>
);

const ActualizarNombreScreen = () => (
  <View style={styles.screenContent}>
  </View>
);

const ActualizarTelefonoScreen = () => (
  <View style={styles.screenContent}>
  </View>
);

const ActualizarCorreoScreen = () => (
  <View style={styles.screenContent}>
  </View>
);

const ActualizarPasswordScreen = () => (
  <View style={styles.screenContentPass}>
    <View style={styles.UserPhotoContainer}>
      <Image source={photo} style={styles.UserPhoto1} />
    </View>
    <Text style={styles.TitleTextUser1}>Toñito</Text>
    <Text style={styles.SubtitleTextUser1}>Dueño de 20 neartags a la verga</Text>
  </View>
);

const RecoverPasswordScreen = () => (
  <View style={styles.screenContentPass}>
  </View>
);

const BluetoothScreen = () => {
  <View style={styles.screenContent}>
  </View>
}

export default function ProfileScreen() {
  const { location } = useContext(UbicacionContext);
  const [activeScreen, setActiveScreen] = useState('user');
  const [isSelected1, setSelection1] = useState(false);
  const [isSelected2, setSelection2] = useState(false);
  const navigation = useNavigation();
  console.log('Ubicación actual:', location);

  const handleSignOut = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');

      const response = await fetch('http://192.168.0.12:3000/signOut', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Éxito', data.message || 'Sesión cerrada exitosamente');
        await AsyncStorage.removeItem('user'); // Elimina los datos del usuario
        await AsyncStorage.removeItem('accessToken'); // Elimina el token JWT
        await AsyncStorage.removeItem('refreshToken');

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          })
        );
      } else {

        Alert.alert('Error', data.error || 'Ocurrió un error al cerrar sesión.');
        console.error('Error al cerrar sesión:', data);
      }
    } catch (error) {
      console.error('Error de red o desconocido al cerrar sesión:', error);
      Alert.alert('Error', 'No se pudo conectar al servidor. Intenta de nuevo.');
    }
  }

  // condicional mensajes de alerta
  const mostrarAlerta = () => {
    if (isSelected1 && isSelected2) {
      Alert.alert('Error', 'No puedes seleccionar ambas opciones a la vez');
    } else if (isSelected1) {
      Alert.alert(
        'Recuperación',
        'Enlace de recuperación enviado por mensaje al correo: **correo del usuario**',
        [{ text: 'OK', onPress: () => console.log('OK presionado') }],
        { cancelable: false }
      );
    } else if (isSelected2) {
      Alert.alert(
        'Recuperación',
        'Enlace de recuperación enviado por mensaje al número: **número del usuario**',
        [{ text: 'OK', onPress: () => console.log('OK presionado') }],
        { cancelable: false }
      );
    }
  }

  return (
    <View style={styles.container}>
      {location ? (
        <MapaWebView latitude={location.latitude} longitude={location.longitude} />
      ) : (
        <Text>Obteniendo ubicación...</Text>
      )}

      <View style={styles.menu}>
          <View style={styles.menuContent}>
            <View style={styles.menuContent}>
              {activeScreen === 'user' && <UserScreen />}
              {activeScreen === 'actualizar' && <ActualizarDatosScreen />}
              {activeScreen === 'nombre' && <ActualizarNombreScreen />}
              {activeScreen === 'telefono' && <ActualizarTelefonoScreen />}
              {activeScreen === 'correo' && <ActualizarCorreoScreen />}
              {activeScreen === 'password' && <ActualizarPasswordScreen />}
              {activeScreen === 'recover' && <RecoverPasswordScreen />}
              {activeScreen === 'user' && (
                <>
                <TouchableOpacity style={styles.addButton} onPress={() => setActiveScreen('actualizar')}>
                  <Text style={styles.addButtonText}>Actualizar Datos</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addButton} onPress={handleSignOut}>
                <Text style={styles.addButtonText}>Cerrar sesion</Text>
                </TouchableOpacity>
                </>
              )}
              {activeScreen === 'actualizar' && (
                <>
                <TouchableOpacity onPress={() => setActiveScreen('user')}>
                    <Text style={styles.BackButton}> x </Text>
                </TouchableOpacity>
                <View style={styles.UserPhotoContainer}>
                  <Image source={photo} style={styles.UserPhoto} />
                  <TouchableOpacity style={styles.TextButton} onPress={() => setActiveScreen('password')}>
                    <Text style={styles.TextButtonText}>Cambiar foto</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.TextButton} onPress={() => setActiveScreen('nombre')}>
                  <Text style={styles.TextButtonTextElement}>Nombre de usuario</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.TextButton} onPress={() => setActiveScreen('telefono')}>
                  <Text style={styles.TextButtonTextElement}>Numero de telefono</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.TextButton} onPress={() => setActiveScreen('correo')}>
                  <Text style={styles.TextButtonTextElement}>Correo</Text>
                </TouchableOpacity>

                <Text style={styles.OText}>-------- o ---------</Text>

                <TouchableOpacity style={styles.TextButton} onPress={() => setActiveScreen('password')}>
                  <Text style={styles.TextButtonText}>Cambiar mi contraseña</Text>
                </TouchableOpacity>
                </>
              )}
              {activeScreen === 'nombre' && (
                <>
                <View style={styles.Container}>
                  <TouchableOpacity onPress={() => setActiveScreen('actualizar')}>
                    <Text style={styles.BackButton3}> x </Text>
                  </TouchableOpacity>
                    <View>
                      <Text style={styles.SubtitleText}>Cambia tu nombre actual: {/*nombre*/}</Text>
                      <Text style={styles.SubtitleText}>Nombre:</Text>
                      <TextInput style={styles.TextInput}>Nuevo nombre de usuario</TextInput>
                      <Text style={styles.SubtitleText}>Contrasena:</Text>
                      <TextInput style={styles.TextInput}>Contrasena</TextInput>
                      <Text style={styles.SubtitleText}>Por favor ingrese su contrasena para confirmar su identidad</Text>
                      <View style={styles.BTcontainer}>
                        <TouchableOpacity style={styles.addButton2} onPress={() => setActiveScreen('actualizar')}>
                          <Text style={styles.addButtonText}>Guardar Cambios</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                </View>
                </>
              )}
              {activeScreen === 'telefono' && (
                <>
                <View style={styles.Container}>
                  <TouchableOpacity onPress={() => setActiveScreen('actualizar')}>
                    <Text style={styles.BackButton2}> x </Text>
                  </TouchableOpacity>
                    <View>
                      <Text style={styles.SubtitleText}>Cambia tu numero de telefono actual: {/*numero*/}</Text>
                      <Text style={styles.SubtitleText}>Numero:</Text>
                      <TextInput style={styles.TextInput}>Nuevo numero de telefono</TextInput>
                      <Text style={styles.SubtitleText}>Contrasena:</Text>
                      <TextInput style={styles.TextInput}>Contrasena</TextInput>
                      <Text style={styles.SubtitleText}>Por favor ingrese su contrasena para confirmar su identidad</Text>
                      <View style={styles.BTcontainer}>
                        <TouchableOpacity style={styles.addButton2} onPress={() => setActiveScreen('actualizar')}>
                          <Text style={styles.addButtonText}>Guardar Cambios</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                </View>
                </>
              )}
              {activeScreen === 'correo' && (
                <>
                <View style={styles.Container}>
                  <TouchableOpacity onPress={() => setActiveScreen('actualizar')}>
                    <Text style={styles.BackButton2}> x </Text>
                  </TouchableOpacity>
                    <View>
                      <Text style={styles.SubtitleText}>Cambia tu correo electronico actual: {/*correo*/}</Text>
                      <Text style={styles.SubtitleText}>Correo:</Text>
                      <TextInput style={styles.TextInput}>Nuevo correo electronico</TextInput>
                      <Text style={styles.SubtitleText}>Contrasena:</Text>
                      <TextInput style={styles.TextInput}>Contrasena</TextInput>
                      <Text style={styles.SubtitleText}>Por favor ingrese su contrasena para confirmar su identidad</Text>
                      <View style={styles.BTcontainer}>
                        <TouchableOpacity style={styles.addButton2} onPress={() => setActiveScreen('actualizar')}>
                          <Text style={styles.addButtonText}>Guardar Cambios</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                </View>
                </>
              )}
              {activeScreen === 'password' && (
                <>
                <TouchableOpacity onPress={() => setActiveScreen('actualizar')}>
                    <Text style={styles.BackButton3}> x </Text>
                  </TouchableOpacity>
                <View style={styles.PASScontainer}>
                  <TextInput style={styles.TextInputPass}>Antigua contraseña</TextInput>
                  <TextInput style={styles.TextInputPass}>Nueva contraseña</TextInput>
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => setActiveScreen('actualizar')}>
                  <Text style={styles.addButtonText}>Cambiar contraseña</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.TextButton} onPress={() => setActiveScreen('recover')}>
                    <Text style={styles.Text}>no la recuerdas?
                    <Text style={styles.TextButtonText} > Recuperar contraseña</Text>
                    </Text>
                </TouchableOpacity>
                </>
              )}
              {activeScreen === 'recover' && (
                <>
                  <TouchableOpacity onPress={() => setActiveScreen('actualizar')}>
                    <Text style={styles.BackButton3}> x </Text>
                  </TouchableOpacity>
                  <Text style={styles.SubtitleTextUser1}>Como quieres recuperar contraseña?</Text>
                  <View style={styles.containerbox}>
                    <Text style={styles.label}>
                      {isSelected1 ? 'Correo electronico' :'Correo electronico'}
                    </Text>
                    <CheckBox
                    value={isSelected1}
                    onValueChange={setSelection1}
                    tintColors={{ true: '#999', false: '#999' }}
                    />
                  </View>
                  <View style={styles.containerbox}>
                    <Text style={styles.label}>
                      {isSelected2 ? 'Numero de telefono' : 'Numero de telefono'}
                    </Text>
                    <CheckBox
                    value={isSelected2}
                    onValueChange={setSelection2}
                    tintColors={{ true: '#999', false: '#999' }}
                    />
                  </View>
                  <TouchableOpacity style={styles.addButton2} onPress={mostrarAlerta}>
                    <Text style={styles.addButtonText}>Enviar Codigo</Text>
                  </TouchableOpacity>
                </>
              )}
          </View>
          </View>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    width: "100%",
    height: "100%",
    marginTop: "-62%"
  },
  BTcontainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: 'center',
  },
  PASScontainer: {
    marginTop: "4%",
    marginBottom: "-4%",
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  menu: {
    position: 'absolute',
    height: 350,
    bottom: 90,
    left: 0,
    right: 0,
    backgroundColor: '#042C6B',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 5,
    zIndex: 10,
  },
  menuContent: {
    alignItems: 'center',
  },
  OText: {
    color: 'gray',
    fontSize: 18,
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 220,
    marginBottom: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black'
  },
  sheetText: {
    fontSize: 18,
    marginBottom: 20,
    color: 'white'
  },
  screenContent: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenContentPass: {
    flex: 1,
    width: "100%",
    height: "150%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  TitleText: {
    alignItems: 'center',
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 29,
    marginLeft: "0%",
  },
  TitleTextUser: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 1,
    marginBottom: 1,
    marginLeft: "0%",
  },
  SubtitleTextUser: {
    color: 'white',
    fontSize: 15,
    marginBottom: -15,
  },
  TitleTextUser1: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: "-6%",
  },
  SubtitleTextUser1: {
    color: 'white',
    fontSize: 15,
    marginBottom: "2%",
  },
  SubtitleText: {
    color: 'white',
    fontSize: 13,
    textAlign: 'left',
  },
  TextInput: {
    color: 'gray',
    fontSize: 13,
    textAlign: 'left'
  },
  TextInputPass: {
    color: 'gray',
    fontSize: 13,
    textAlign: 'left'
  },
  segmentControl: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    marginBottom: 20,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeSegmentButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  segmentText: {
    color: 'white',
    fontWeight: 'bold',
  },
  activeSegmentText: {
    color: '#042C6B',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 300,
    height: 50,
    marginTop: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addButton2: {
    alignItems: "center",
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 200,
    height: 50,
    marginTop: 20,
    paddingVertical: "4%",
  },
  addButtonText: {
    color: 'black',
    fontSize: 12
  },
  TextButton: {
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  BackButton: {
    marginTop: "-6%",
    marginBottom: "-55%",
    marginLeft: "80%",
    color: 'white',
    borderRadius: 10,
    paddingVertical: 16,
    fontSize: 20,
    alignItems: 'center',
  },
  BackButton2: {
    marginTop: "-18%",
    marginBottom: "-55%",
    marginLeft: "90%",
    color: 'white',
    borderRadius: 10,
    paddingVertical: 16,
    fontSize: 20,
    alignItems: 'center',
  },
  BackButton3: {
    marginTop: "-22%",
    marginBottom: "-100%",
    marginLeft: "90%",
    color: 'white',
    borderRadius: 10,
    paddingVertical: 16,
    fontSize: 20,
    alignItems: 'center',
  },
  TextButtonText: {
    textAlign: 'center',
    textDecorationLine: 'underline',
    width: 200,
    color: 'white',
    fontSize: 14
  },
  Text: {
    color: 'white',
    fontSize: 14,
    marginBottom: "-2%"
  },
  TextButtonTextElement: {
    textAlign: 'center',
    textDecorationLine: 'underline',
    width: 200,
    color: 'gray',
    fontSize: 14,
    marginBottom: -15,
  },
  UserPhotoContainer: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '2%',
  },
  UserPhoto: {
    borderRadius: 60,
    width: 90,
    height: 90,
    marginTop: '20%',
    marginBottom: '-15%',
  },
  UserPhoto0: {
    borderRadius: 60,
    width: 110,
    height: 110,
    marginTop: '-25%',
    marginBottom: '-20%',
  },
  UserPhoto1: {
    borderRadius: 60,
    width: 55,
    height: 55,
    marginTop: '-60%',
    marginBottom: '-60%',
  },
  containerbox: {
    marginTop: '4%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  label: {
    color: 'white',
    marginRight: '25%',
    fontSize: 16,
  },
});
