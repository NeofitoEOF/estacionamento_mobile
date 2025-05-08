import React from 'react';
import { View, StyleSheet, Pressable, Animated } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../navigation/navigation';
import { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { Car, MapPin, EarOff } from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation();

  const card1Opacity = useSharedValue(0);
  const card2Opacity = useSharedValue(0);

  React.useEffect(() => {
    card1Opacity.value = withDelay(300, withTiming(1, { duration: 600 }));
    card2Opacity.value = withDelay(600, withTiming(1, { duration: 600 }));
  }, []);

  const card1Style = useAnimatedStyle(() => ({
    opacity: card1Opacity.value,
    transform: [{ translateY: 20 * (1 - card1Opacity.value) }],
  }));

  const card2Style = useAnimatedStyle(() => ({
    opacity: card2Opacity.value,
    transform: [{ translateY: 20 * (1 - card2Opacity.value) }],
  }));

  return (
    <LinearGradient
      colors={['#1a2a6c', '#2a4085', '#324f9c']}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Car size={44} color="#fff" />
          <Text style={styles.logoText}>ParkingSpot</Text>
        </View>

        <Animated.View style={[styles.card, card1Style]}>
          <View style={styles.cardIcon}>
            <MapPin size={28} color="#324f9c" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Encontre um Estacionamento</Text>
            <Text style={styles.cardText}>Veja a disponibilidade e reserve sua vaga.</Text>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => navigation.navigate('Parking')}
            >
              <LinearGradient
                colors={['#5e35b1', '#7b1fa2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Ver Estacionamentos</Text>
                <MapPin size={18} color="#fff" style={{ marginLeft: 8 }} />
              </LinearGradient>
            </Pressable>
          </View>
        </Animated.View>

        <Animated.View style={[styles.card, card2Style]}>
          <View style={styles.cardIcon}>
            <EarOff size={28} color="#324f9c" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Gerenciar Veículos</Text>
            <Text style={styles.cardText}>Remova veículos do estacionamento.</Text>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => navigation.navigate('BuscarVeiculo')}
            >
              <LinearGradient
                colors={['#5e35b1', '#7b1fa2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Remover Veículo</Text>
                <EarOff size={18} color="#fff" style={{ marginLeft: 8 }} />
              </LinearGradient>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
    letterSpacing: 1,
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 5,
  },
  cardIcon: {
    marginRight: 16,
    backgroundColor: '#e3e8f7',
    borderRadius: 12,
    padding: 10,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#324f9c',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 2,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  buttonPressed: {
    opacity: 0.85,
  },
});
export default HomeScreen;
