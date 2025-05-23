import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, PermissionsAndroid, Platform } from 'react-native';
import { UbicacionContext } from '../context/UbicacionContext';
import MapaWebView from '../components/MapaWebView';
import { useNavigation } from '@react-navigation/native';
import { BleManager } from 'react-native-ble-plx';
import { decode as base64decode } from 'base-64';

const manager = new BleManager();

const photo = require('../assets/images.jpg');

const DispositivosScreen = () => {
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
    };

    startScan();

    return () => {
      console.log('Limpiando recursos BLE...');
      manager.stopDeviceScan();
      manager.destroy();
    };
  }, []);

  return (
    <View style={styles.screenContent}>
      <Text style={styles.SubtitleText}>Mensaje recibido: {message}</Text>
      <Text style={styles.SubtitleText}>
        Última actualización: {lastUpdate.toLocaleTimeString()}
      </Text>
    </View>
  );
};

// esto iba dentro de dispositivos screen
// const { message, lastUpdate } = useContext(BluetoothContext);
  {/*<View style={styles.screenContent}>
    <View style={styles.UserPhotoContainer}>
      <Image source={photo} style={styles.UserPhoto} />
    </View>
    <Text style={styles.TitleText}>Toñito</Text>
    <Text style={styles.SubtitleText}>ubicacion Toñito</Text>
  </View>*/}
  // return(
  //   <View style={styles.screenContent}>
  //     <Text style={styles.SubtitleText}>Mensaje BLE: {message}</Text>
  //     <Text style={styles.SubtitleText}>Última actualización: {lastUpdate.toLocaleTimeString()}</Text>
  //   </View>
  // );

const PerdidosScreen = () => (
  <View style={styles.screenContent}>
    <Text style={styles.TitleText}>No hay ningún neartag reportado como perdido</Text>
  </View>
);

const AgregarScreen = () => (
  <View style={styles.screenContent}>
    <Text style={styles.TitleText}>Pantalla agregar</Text>
  </View>
);

export default function HomeScreen() {
  const { location } = useContext(UbicacionContext);
  const [activeScreen, setActiveScreen] = useState('dispositivos');
  const navigation = useNavigation();
  console.log('Ubicación actual:', location);

  return (
    <View style={styles.container}>
      {location ? (
        <MapaWebView latitude={location.latitude} longitude={location.longitude} />
      ) : (
        <Text>Obteniendo ubicación...</Text>
      )}

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
          <View style={styles.menuContent}>
          {activeScreen === 'dispositivos' && <DispositivosScreen />}
          {activeScreen === 'perdidos' && <PerdidosScreen />}
          {activeScreen === 'agregar' && <AgregarScreen />}
          {activeScreen === 'dispositivos' && (
            <TouchableOpacity style={styles.addButton} onPress={() => setActiveScreen('agregar')}>
              <Text style={styles.addButtonText}>Agregar</Text>
            </TouchableOpacity>
          )}
        </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
