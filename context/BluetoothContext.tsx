import React, { useContext, createContext, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { decode as base64decode } from 'base-64';

const manager = new BleManager();
export const BluetoothContext = createContext<any>(null);

export const BluetoothProvider = ({ children }: { children: React.ReactNode }) => {
  const [message, setMessage] = useState("Esperando mensaje...");
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [ultimoDispositivo, setUltimoDispositivo] = useState<any>(null);
  const subscriptionRef = useRef<any>(null);

  const setupNotifications = (device: any) => {
    console.log('Configurando notificaciones...');

    if (subscriptionRef.current) {
      console.log('Cancelando suscripción anterior...');
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }

    subscriptionRef.current = device.monitorCharacteristicForService(
      '12345678-1234-1234-1234-1234567890ab',
      'abcd1234-ab12-cd34-ef56-abcdef123456',
      (error: any, characteristic: any) => {
        if (error) {
          console.error('Error de monitoreo:', error);
          const errorText = error?.message || String(error);

          if (errorText.includes('was disconnected')) {
            console.warn('Dispositivo desconectado. esperando conexión...');
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

  const connectToDevice = async (device: any) => {
    try {
      console.log('Conectando al dispositivo...');
      const connectedDevice = await device.connect();
      console.log('¡Dispositivo conectado!');
      await connectedDevice.discoverAllServicesAndCharacteristics();
      console.log('Servicios y características descubiertos');
      setUltimoDispositivo(connectedDevice);
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
      console.log('Se reconectó el dispositivo');
      setUltimoDispositivo(device);
      setupNotifications(device);
    } catch (reconnectError) {
      console.error('Falló la reconexión:', reconnectError);
    }
  };

  useEffect(() => {
    const iniciarBluetooth = async () => {
      // Asumimos que los permisos ya fueron concedidos desde App.tsx
      const connectedDevices = await manager.connectedDevices([]);
      const dysonDevice = connectedDevices.find(dev => dev.name?.includes('Dyson'));

      if (dysonDevice) {
        console.log('Dispositivo ya conectado detectado:', dysonDevice.name);
        await dysonDevice.discoverAllServicesAndCharacteristics();
        setUltimoDispositivo(dysonDevice);
        setupNotifications(dysonDevice);
      } else {
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
      }
    };

    iniciarBluetooth();

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
        subscriptionRef.current = null;
      }
      manager.stopDeviceScan();
    };
  }, []);

  return (
    <BluetoothContext.Provider value={{ message, lastUpdate }}>
      {children}
    </BluetoothContext.Provider>
  );
};

export const useBluetooth = () => useContext(BluetoothContext);

/*
!['never_ask_again', 'granted'].includes(granted['android.permission.BLUETOOTH_SCAN']) ||
          !['never_ask_again', 'granted'].includes(granted['android.permission.BLUETOOTH_CONNECT'])
*/
