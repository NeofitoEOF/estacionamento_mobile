import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../navigation/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#007AFF', '#0056D2']} style={styles.header}>
        <Text style={styles.title}>🚗 Estacionamento Fácil</Text>
      </LinearGradient>

      <Card style={styles.card}>
        <Card.Title title="Encontre um Estacionamento" titleStyle={styles.cardTitle} />
        <Card.Content>
          <Text style={styles.cardText}>Veja a disponibilidade e reserve sua vaga.</Text>
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained"
            icon="map-marker"
            onPress={() => navigation.navigate('Parking')}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Ver Estacionamentos
          </Button>
        </Card.Actions>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Gerenciar Veículos" titleStyle={styles.cardTitle} />
        <Card.Content>
          <Text style={styles.cardText}>Remova veículos do estacionamento.</Text>
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained"
            icon="car-off"
            onPress={() => navigation.navigate('BuscarVeiculo')}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Remover Veículo
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F0F2F5',
  },
  header: {
    width: '100%',
    paddingVertical: 20,
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  card: {
    width: '100%',
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardText: {
    fontSize: 14,
    color: '#555',
  },
  button: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 4,
    backgroundColor: '#007AFF',
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default HomeScreen;
