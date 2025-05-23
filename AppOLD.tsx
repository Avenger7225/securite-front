import React, { useEffect, useState } from 'react';
import { Text, View, PermissionsAndroid, Platform } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const manager = new BleManager();

export default function App() {
  const [message, setMessage] = useState("Esperando mensaje...");

  useEffect(() => {
    const startScan = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
        if (
          granted['android.permission.BLUETOOTH_SCAN'] !== 'granted' ||
          granted['android.permission.ACCESS_FINE_LOCATION'] !== 'granted'
        ) {
          console.warn('Permissions not granted');
          return;
        }
      }

      manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.error('BLE Error:', error);
          return;
        }
        if (device?.name?.includes('Dyson')) {
          console.log('Found:', device.name, device.id);
          manager.stopDeviceScan();
          connectToDevice(device);
        }
      });
    };

    const connectToDevice = async (device: any) => {
      try {
        await device.connect();
        console.log('Device connected!');
        discoverServices(device);
      } catch (error) {
        console.error('Connection error:', error);
      }
    };

    const discoverServices = async (device: any) => {
      const services = await device.discoverAllServicesAndCharacteristics();
      const characteristic = await device.readCharacteristicForService(
        '12345678-1234-1234-1234-1234567890ab',
        'abcd1234-ab12-cd34-ef56-abcdef123456'
      );
      console.log('Characteristic value:', characteristic.value);
      
      device.monitorCharacteristicForService(
        '12345678-1234-1234-1234-1234567890ab',
        'abcd1234-ab12-cd34-ef56-abcdef123456',
        (error: any, characteristic: any) => {
          if (error) {
            console.error('Monitor error:', error);
            return;
          }
          // Decodificar Base64
          const base64Message = characteristic?.value;
          if (base64Message) {
            // Decodificar de Base64 a texto
            const decodedMessage = atob(base64Message); // Usa atob para decodificar Base64
            setMessage(decodedMessage);
          }
        }
      );
    };

    startScan();

    return () => {
      manager.stopDeviceScan();
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Mensaje recibido: {message}</Text>
    </View>
  );
}


//app atangana
import React, { useEffect, useState } from 'react';
import { Text, View, PermissionsAndroid, Platform } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { decode as base64decode } from 'base-64';

const manager = new BleManager();

export default function App() {
  const [message, setMessage] = useState("Esperando mensaje...");
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const startScan = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
        console.log(granted['android.permission.BLUETOOTH_SCAN']);
        if (
          !['never_ask_again', 'granted'].includes(granted['android.permission.BLUETOOTH_SCAN']) ||
          !['never_ask_again', 'granted'].includes(granted['android.permission.ACCESS_FINE_LOCATION']) ||
          !['never_ask_again', 'granted'].includes(granted['android.permission.BLUETOOTH_CONNECT'])
        ) {
          console.warn('Permisos no otorgados');
          return;
        }
      }

      // Inicia el escaneo de dispositivos BLE
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
        setupNotifications(connectedDevice);
      } catch (error) {
        console.error('Error de conexión:', error);
      }
    };

    const setupNotifications = (device: any) => {
      console.log('Configurando notificaciones...');
      
      // Monitoriza los cambios en la característica
      device.monitorCharacteristicForService(
        '12345678-1234-1234-1234-1234567890ab',
        'abcd1234-ab12-cd34-ef56-abcdef123456',
        (error: any, characteristic: any) => {
          if (error) {
            console.error('Error de monitoreo:', error);
            return;
          }
          
          if (characteristic?.value) {
            try {
              // Decodificar Base64 usando base-64
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

    // Limpia los recursos al desmontar el componente
    return () => {
      console.log('Limpiando recursos BLE...');
      manager.stopDeviceScan();
      manager.destroy();
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Mensaje recibido: {message}</Text>
      <Text style={{ fontSize: 14, color: 'gray' }}>
        Última actualización: {lastUpdate.toLocaleTimeString()}
      </Text>
    </View>
  );
}
