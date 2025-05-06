import React, { useState } from "react";
import { View, StyleSheet, TextInput, Alert, KeyboardAvoidingView, Platform, Animated, TouchableOpacity } from "react-native";
import { Button, Text } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";
import { useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Car, Search } from "lucide-react-native";

const API_URL = "http://10.0.2.2:8000";

type Props = NativeStackScreenProps<RootStackParamList, "BuscarVeiculo">;

const BuscarVeiculoScreen = () => {
  const [placa, setPlaca] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  // Animação de entrada
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(40);

  React.useEffect(() => {
    cardOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    cardTranslateY.value = withDelay(200, withTiming(0, { duration: 600 }));
  }, []);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardTranslateY.value }],
  }));

  const buscarVeiculo = async () => {
    if (!placa.trim()) {
      Alert.alert("Erro", "Digite a placa do veículo.");
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('access_token');
      const tokenType = await AsyncStorage.getItem('token_type');
      if (!token) throw new Error("Token de acesso ausente");
      const response = await fetch(`${API_URL}/parking/parkings/active/search/?license_plate=${placa}&skip=0&limit=100`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${tokenType} ${token}`,
        }
      });
      if (!response.ok) throw new Error("Veículo não encontrado");
      const veiculo = await response.json();
      navigation.navigate("ConfirmarRemocao", veiculo[0]);
    } catch (err: any) {
      Alert.alert("Erro", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#1a2a6c', '#2a4085', '#324f9c']}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Animated.View style={[styles.card, cardAnimatedStyle]}>
          <View style={styles.iconContainer}>
            <Car size={36} color="#324f9c" />
          </View>
          <Text style={styles.title}>Buscar Veículo</Text>
          <Text style={styles.subtitle}>Digite a placa do veículo para buscar e remover do estacionamento.</Text>
          <View style={styles.inputContainer}>
            <Search size={20} color="#324f9c" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Digite a placa"
              value={placa}
              onChangeText={setPlaca}
              autoCapitalize="characters"
              mode="flat"
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              theme={{ colors: { primary: 'transparent' } }}
              editable={!loading}
              returnKeyType="search"
              onSubmitEditing={buscarVeiculo}
            />
          </View>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={buscarVeiculo}
            disabled={loading}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#5e35b1', '#7b1fa2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>
                {loading ? "Buscando..." : "Buscar Veículo"}
              </Text>
              {!loading && <Search size={18} color="#fff" style={{ marginLeft: 8 }} />}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  keyboardView: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  card: {
    width: "88%",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: "#e3e8f7",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#324f9c",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 18,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    height: 54,
    paddingHorizontal: 12,
    marginBottom: 18,
    width: "100%",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 54,
    backgroundColor: "transparent",
    fontSize: 16,
  },
  buttonContainer: {
    width: "100%",
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 4,
  },
  button: {
    height: 54,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
});

export default BuscarVeiculoScreen;
