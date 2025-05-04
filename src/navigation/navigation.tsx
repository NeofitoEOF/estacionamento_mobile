import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import ParkingScreen from '../screens/ParkingScreen';
import ReservaScreen from '../screens/ReservaScreen';
import DetalhesReservaScreen from '../screens/DetalhesReservaScreen';
import BuscarVeiculoScreen from '../screens/BuscarVeiculoScreen';
import ConfirmarRemocaoScreen from '../screens/ConfirmarRemocaoScreen';
import LoginScreen from '../screens/LoginScreen';

export type RootStackParamList = {
  Home: undefined;
  Parking: undefined;
  RemoverVeiculo: undefined;
  Reserva: { estacionamento: string, totalVagas: number };
  DetalhesReserva: { estacionamento: string; vagaId: number };
  ConfirmarRemocao: { license_plate: string, vehicle_color: string, vehicle_year: string  };
  BuscarVeiculo: undefined;
  Login: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
        <Stack.Screen name="Parking" component={ParkingScreen} options={{ title: 'Estacionamentos' }} />
        <Stack.Screen name="Reserva" component={ReservaScreen} options={{ title: 'Reserva' }} />
        <Stack.Screen name="DetalhesReserva" component={DetalhesReservaScreen} options={{ title: 'Dados do veiculo' }} />
        <Stack.Screen name="BuscarVeiculo" component={BuscarVeiculoScreen} options={{ title: 'Buscar veiculo' }} />
        <Stack.Screen name="ConfirmarRemocao" component={ConfirmarRemocaoScreen} options={{ title: 'Remover veiculo' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;