import React, { createContext, useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { BleManager, Characteristic } from 'react-native-ble-plx';
import { decode as base64decode } from 'base-64';

interface BluetoothContextType {
  message: string;
  lastUpdate: Date;
}

export const BluetoothContext = createContext<BluetoothContextType>({
  message: 'Esperando mensaje...',
  lastUpdate: new Date(),
});

const manager = new BleManager();

export const BluetoothProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

        if (
          !['granted', 'never_ask_again'].includes(granted['android.permission.BLUETOOTH_SCAN']) ||
          !['granted', 'never_ask_again'].includes(granted['android.permission.BLUETOOTH_CONNECT']) ||
          !['granted', 'never_ask_again'].includes(granted['android.permission.ACCESS_FINE_LOCATION'])
        ) {
          console.warn('Permisos no otorgados');
          return;
        }
      }

      manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.error('Error escaneando BLE:', error);
          return;
        }

        if (device?.name?.includes('Dyson')) {
          console.log('Dispositivo encontrado:', device.name);
          manager.stopDeviceScan();
          connectToDevice(device);
        }
      });
    };

    const connectToDevice = async (device: any) => {
      try {
        const connectedDevice = await device.connect();
        await connectedDevice.discoverAllServicesAndCharacteristics();
        setupNotifications(connectedDevice);
      } catch (error) {
        console.error('Error al conectar BLE:', error);
      }
    };

    const setupNotifications = (device: any) => {
    device.monitorCharacteristicForService(
      '12345678-1234-1234-1234-1234567890ab',
      'abcd1234-ab12-cd34-ef56-abcdef123456',
        
      (error: Error | null, characteristic: Characteristic | null) => {
        if (error) {
            console.error('Error monitoreando:', error);
            return;
        }

        if (characteristic?.value) {
            try {
                const decodedMessage = base64decode(characteristic.value);
                console.log('Mensaje BLE recibido:', decodedMessage);
                setMessage(decodedMessage);
                setLastUpdate(new Date());
            } catch (decodeError) {
                console.error('Error al decodificar:', decodeError);
            }
        }}
    );
    };

    startScan();

    return () => {
      manager.stopDeviceScan();
      manager.destroy();
    };
  }, []);

  return (
    <BluetoothContext.Provider value={{ message, lastUpdate }}>
      {children}
    </BluetoothContext.Provider>
  );
};
