import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, PermissionsAndroid, Platform, Image, ScrollView, Alert } from 'react-native';
import { UbicacionContext } from '../context/UbicacionContext';
import MapaWebView from '../components/MapaWebView';
import { useNavigation } from '@react-navigation/native';
import { BleManager } from 'react-native-ble-plx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode as base64decode } from 'base-64';
import { TextInput } from 'react-native-gesture-handler';

const manager = new BleManager();
const photo = require('../assets/images.jpg');

export default function HomeScreen() {
  const { location } = useContext(UbicacionContext);
  const [activeScreen, setActiveScreen] = useState('dispositivos');
  const [devices, setDevices] = useState<any[]>([]);
  const navigation = useNavigation();
  console.log('Ubicación actual:', location);

  return (
    <View style={styles.container}>
      {location ? (
        <MapaWebView latitude={location.latitude} longitude={location.longitude} />
      ) : (
        <Text>Obteniendo ubicación...</Text>
      )}

      {/* Solo muestra menú si no estamos en bluetooth o agregar */}
      {activeScreen !== 'bluetooth' && activeScreen !== 'agregar' && (
        <View style={styles.menu}>
          <View style={styles.segmentControl}>
            <TouchableOpacity
              style={[
                styles.segmentButton,
                activeScreen === 'dispositivos' && styles.activeSegmentButton,
              ]}
              onPress={() => setActiveScreen('dispositivos')}
            >
              <Text
                style={[
                  styles.segmentText,
                  activeScreen === 'dispositivos' && styles.activeSegmentText,
                ]}
              >
                DISPOSITIVOS
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.segmentButton,
                activeScreen === 'perdidos' && styles.activeSegmentButton,
              ]}
              onPress={() => setActiveScreen('perdidos')}
            >
              <Text
                style={[
                  styles.segmentText,
                  activeScreen === 'perdidos' && styles.activeSegmentText,
                ]}
              >
                PERDIDOS
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.menuContent}>
            {activeScreen === 'dispositivos' && (
              <DispositivosScreen
                setActiveScreen={setActiveScreen}
                devices={devices}
              />
            )}
            {activeScreen === 'perdidos' && (
              <PerdidosScreen setActiveScreen={setActiveScreen} />
            )}
          </View>
        </View>
      )}

      {/* Estas pantallas no deben mostrar la barra de menú */}
      {(activeScreen === 'bluetooth' || activeScreen === 'agregar') && (
        <View style={styles.menu}>
          <View style={styles.menuContent}>
            {activeScreen === 'bluetooth' && (
              <BluetoothScreen setActiveScreen={setActiveScreen} />
            )}
            {activeScreen === 'agregar' && (
              <AgregarScreen
                setActiveScreen={setActiveScreen}
                devices={devices}
                setDevices={setDevices}
              />
            )}
          </View>
        </View>
      )}
    </View>
  );
}

type Device = {
  id: number;
  name: string;
  location: string;
  icon: any;
};


// terminado ✅
const DispositivosScreen = ({ setActiveScreen }: any) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const loadDevices = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        const token = await AsyncStorage.getItem('accessToken');

        if (!userData || !token) return;

        const user = JSON.parse(userData);
        setUsername(user.username);

        console.log(`Consultando dispositivos del usuario: ${user.id}`);

        // router.get('/user/:userId/devices', authMiddleware, getUserDevices); 
        const response = await fetch(`http://192.168.0.133:3000/user/${user.id}/devices`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();
        console.log('Respuesta del backend:', data);

        if (response.ok) {
          if (Array.isArray(data.userDevices)) {
            const mappedDevices = data.userDevices.map((d: any, index: number) => ({
              id: index + 1,
              name: d.name_device,
              location: d.locations?.[0]?.latitude && d.locations?.[0]?.longitude
                ? `Lat: ${d.locations[0].latitude}, Lng: ${d.locations[0].longitude}`
                : 'Sin ubicación',
              icon: require('../assets/default-icon.png'),
            }));
            setDevices(mappedDevices);
          } else {
            console.warn('No hay dispositivos registrados.');
            setDevices([]); // Asegura que devices sea un arreglo vacío pa que no haya pedos
          }
        } else {
          console.error('Error al obtener dispositivos:', data.error || data.message);
        }

      } catch (err) {
        console.error('Error:', err);
      }
    };
    loadDevices();
  }, []);

  return (
    <>
      <ScrollView style={styles.devicesScrollContainer} contentContainerStyle={styles.devicesContentContainer}>
        {devices.length === 0 ? (
          <Text style={styles.SubtitleText1}>No hay dispositivos registrados</Text>
        ) : (
          devices.map((device: any) => (
            <View key={device.id} style={styles.deviceItem}>
              <Image source={device.icon} style={{ width: 40, height: 40, marginRight: 10 }} />
              <View>
                <Text style={styles.deviceTitle}>{device.name}</Text>
                <Text style={styles.deviceSubtitle}>{device.location}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <View>
        <TouchableOpacity style={styles.addButton} onPress={() => setActiveScreen('agregar')}>
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

// terminado ✅
const PerdidosScreen = () => (
  <View style={styles.screenContent}>
    <Text style={styles.SubtitleText}>No hay ningún neartag reportado como perdido</Text>
  </View>
);

// terminado ✅
const BluetoothScreen = ({ setActiveScreen }: any) => {
  const [message, setMessage] = useState("Esperando mensaje...");
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [ultimoDispositivo, setUltimoDispositivo] = useState<any>(null);

  useEffect(() => {
    const startScan = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ]);
        if (
          !['never_ask_again', 'granted'].includes(granted['android.permission.BLUETOOTH_SCAN']) ||
          !['never_ask_again', 'granted'].includes(granted['android.permission.BLUETOOTH_CONNECT'])
        ) {
          console.warn('Permisos no otorgados');
          return;
        }
      }

      console.log("Iniciando escaneo de dispositivos...");
      manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.error('Error BLE:', error);
          return;
        }

        if (device?.name?.includes('Dyson')) {
          console.log('Dispositivo encontrado:', device.name, device.id);
          manager.stopDeviceScan();
          connectToDevice(device);
        }
      });
    };

    const connectToDevice = async (device: any) => {
      try {
        console.log('Conectando al dispositivo...');
        const connectedDevice = await device.connect();
        console.log('¡Dispositivo conectado!');
        await connectedDevice.discoverAllServicesAndCharacteristics();
        console.log('Servicios y características descubiertos');
        setUltimoDispositivo(connectedDevice); // Guardamos el dispositivo conectado
        setupNotifications(connectedDevice);
      } catch (error: any) {
        console.error('Error de conexión:', error);
      }
    };

    const reconectarDispositivo = async (deviceId: string) => {
      try {
        console.log(`Intentando reconectar con ${deviceId}...`);
        const device = await manager.connectToDevice(deviceId, { autoConnect: true });
        await device.discoverAllServicesAndCharacteristics();
        console.log('Se reconecto el dispositivo');
        setUltimoDispositivo(device);
        setupNotifications(device);
      } catch (reconnectError) {
        console.error('Falló la reconexión:', reconnectError);
      }
    };

    const setupNotifications = (device: any) => {
      console.log('Configurando notificaciones...');
      device.monitorCharacteristicForService(
        '12345678-1234-1234-1234-1234567890ab',
        'abcd1234-ab12-cd34-ef56-abcdef123456',
        (error: any, characteristic: any) => {
          if (error) {
            console.error('Error de monitoreo:', error);

            const errorText = error?.message || String(error);
            if (errorText.includes('was disconnected')) {
              console.warn('Dispositivo desconectado. esperando conexion...');

              const match = errorText.match(/Device ([A-F0-9:]+)/i);
              const deviceId = match?.[1] || ultimoDispositivo?.id;

              if (deviceId) {
                reconectarDispositivo(deviceId);
              } else {
                console.warn('No se pudo obtener el ID del dispositivo para reconectar.');
              }
            }
            return;
          }

          if (characteristic?.value) {
            try {
              const decodedMessage = base64decode(characteristic.value);
              console.log('Mensaje recibido:', decodedMessage);
              setMessage(decodedMessage);
              setLastUpdate(new Date());
            } catch (decodeError) {
              console.error('Error al decodificar:', decodeError);
            }
          }
        }
      );
    }
      startScan();
  }, []);

  return(
    <View style={styles.screenContent}>
      <TouchableOpacity onPress={() => setActiveScreen('dispositivos')}>
        <Text style={styles.BackButton2}> x </Text>
      </TouchableOpacity>
      <Text style={styles.SubtitleTextDevice}>Mensaje BLE: {message}</Text>
      <Text style={styles.SubtitleTextDevice}>Última actualización: {lastUpdate.toLocaleTimeString()}</Text>
      <TouchableOpacity style={styles.addButtonbt} onPress={() => setActiveScreen('agregar')}>
        <Text style={styles.addButtonText}>Agregar</Text>
      </TouchableOpacity>
    </View>
  );
};

// no terminado ❌
const AgregarScreen = ({ setActiveScreen, setDevices, devices }: any) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(require('../assets/default-icon.png'));
  
  const handleAddDevice = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('accessToken');

      if (!userData || !token) {
        Alert.alert('Error', 'No se pudo obtener el usuario o token');
        return;
      }

      const user = JSON.parse(userData);

      const deviceData = {
        userId: user.id,
        deviceName: name,
        macAddress: '00:11:22:33:44:55', // Reemplazar por la MAC real
        channel: 1,
        longitude: 31.8062715, // Reemplazar con datos reales
        latitude: -116.5907348 // Reemplazar con datos reales
      };

      const response = await fetch('http://192.168.0.133:3000/devices/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(deviceData)
      });

      const result = await response.json();

      if (!response.ok) {
        Alert.alert('Error', result.error || 'No se pudo asignar el dispositivo');
        return;
      }

      // Si se registró correctamente, lo agregamos a la lista local
      const newDevice = {
        id: Date.now(),
        name,
        location: `ubicación del ${name}`,
        icon
      };

      setDevices([...devices, newDevice]);
      setActiveScreen('dispositivos');

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Ocurrió un error al agregar el dispositivo');
    }
  };

  return (
    <View style={styles.screenContent}>
      <TouchableOpacity onPress={() => setActiveScreen('dispositivos')}>
        <Text style={styles.BackButton2}> x </Text>
      </TouchableOpacity>

      <View style={styles.contentrow}>
        <TouchableOpacity style={styles.uploadrow} onPress={() => {
          // icono del neartag
          setIcon(require('../assets/default-icon.png'));
        }}>
          <Image source={icon} style={{ width: 30, height: 30 }} />
          <Text style={styles.icontext}>Seleccionar icono</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.devicetext}
          placeholder="nombre neartag"
          placeholderTextColor="#cccccc"
          value={name}
          onChangeText={setName}
        />
      </View>

      <TouchableOpacity style={styles.Buttonadd} onPress={handleAddDevice}>
        <Text style={styles.addButtonText}>Agregar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  devicesScrollContainer: {
  maxHeight: 200,
  width: '100%',
  },
  devicesContentContainer: {
    paddingBottom: 10,
  },
  container: {
    flex: 1,
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
  menuContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 220,
    marginTop: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addButtonbt: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 220,
    marginTop: '14%',
    marginBottom: '-10%',
    paddingVertical: 16,
    alignItems: 'center',
  },
  Buttonadd: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 245,
    marginTop: '14%',
    paddingVertical: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'black',
  },
  sheetText: {
    fontSize: 18,
    marginBottom: 20,
    color: 'white',
    textAlign: 'center',
  },
  screenContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  TitleText: {
    textAlign: "center",
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 29,
    marginLeft: "0%",
  },
  SubtitleText: {
    textAlign: "center",
    color: 'white',
    fontSize: 15,
  },
  SubtitleText1: {
    marginTop: '20%',
    textAlign: "center",
    color: 'white',
    fontSize: 15,
  },
  SubtitleTextDevice: {
    textAlign: "center",
    color: 'white',
    fontSize: 16,
  },
  UserPhotoContainer: {
    alignItems: 'center',
  },
  UserPhoto: {
    width: 120,
    height: 120,
    marginLeft: -235,
    marginBottom: -115,
    resizeMode: 'contain',
  },
  icontext: {
    color: 'white',
  },
  uploadrow: {
    alignItems: 'center',
    marginRight: '4%',
  },
  contentrow: {
    flexDirection: 'row',
    padding: '4%',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: '4%'
  },
  BackButton2: {
    marginTop: "-12%",
    marginBottom: "6%",
    marginLeft: "90%",
    color: 'white',
    borderRadius: 10,
    paddingVertical: 16,
    fontSize: 20,
    alignItems: 'center',
  },
  deviceItem: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: 10,
  padding: 10,
  marginVertical: 8,
  width: '100%',
  },
  deviceTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deviceSubtitle: {
    color: '#ccc',
    fontSize: 14,
  },
  devicetext: {
    color: 'white'
  }
});
