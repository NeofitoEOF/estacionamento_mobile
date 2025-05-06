import React, { useState } from "react";
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, Dimensions } from "react-native";
import { TextInput, Text, ActivityIndicator } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { Car, Plane, ShoppingBag } from "lucide-react-native";
import { Button } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/navigation";
import { useReserva } from "../hooks/useReserva";

type Props = NativeStackScreenProps<RootStackParamList, "DetalhesReserva">;

const { width } = Dimensions.get("window");

// Função para escolher o ícone conforme o nome
function getIconByName(name) {
  if (!name) return <Car size={48} color="#324f9c" />;
  const n = name.toLowerCase();
  if (n.includes("aeroporto")) return <Plane size={48} color="#324f9c" />;
  if (n.includes("shopping")) return <ShoppingBag size={48} color="#324f9c" />;
  return <Car size={48} color="#324f9c" />;
}

const DetalhesReservaScreen = ({ route, navigation }: Props) => {
  const { estacionamento, vagaId } = route.params;
  const [placa, setPlaca] = useState("");
  const [cor, setCor] = useState("");
  const [ano, setAno] = useState("");
  const { reservarVaga, loading, error } = useReserva();

  const handleConfirmarReserva = async () => {
    if (!placa || !cor || !ano) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    const resultado = await reservarVaga(vagaId, placa, cor, ano);
    if (resultado) {
      Alert.alert("Sucesso", "Reserva confirmada!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
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
        <View style={styles.card}>
          <View style={styles.iconBox}>
            {getIconByName(estacionamento)}
          </View>
          <Text style={styles.title}>{estacionamento}</Text>
          <Text style={styles.subtitle}>Vaga {vagaId}</Text>

          <TextInput
            label="Placa do Veículo"
            value={placa}
            onChangeText={setPlaca}
            mode="flat"
            style={styles.input}
            autoCapitalize="characters"
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            theme={{ colors: { primary: 'transparent' } }}
          />
          <TextInput
            label="Cor do Veículo"
            value={cor}
            onChangeText={setCor}
            mode="flat"
            style={styles.input}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            theme={{ colors: { primary: 'transparent' } }}
          />
          <TextInput
            label="Ano do Veículo"
            value={ano}
            onChangeText={setAno}
            keyboardType="numeric"
            mode="flat"
            style={styles.input}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            theme={{ colors: { primary: 'transparent' } }}
          />

          {loading && <ActivityIndicator size="large" color="#324f9c" style={{ marginVertical: 10 }} />}
          {error && <Text style={styles.error}>{error}</Text>}

          <Button
            mode="contained"
            onPress={handleConfirmarReserva}
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            disabled={loading}
          >
            Confirmar Reserva
          </Button>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: width * 0.88,
    backgroundColor: "rgba(255,255,255,0.97)",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.13,
    shadowRadius: 12,
    elevation: 6,
  },
  iconBox: {
    marginBottom: 18,
    backgroundColor: "#e3e8f7",
    borderRadius: 18,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#324f9c",
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 18,
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    width: "100%",
    borderRadius: 14,
    marginTop: 10,
    overflow: "hidden",
    backgroundColor: "#5e35b1",
  },
  buttonContent: {
    height: 54,
    justifyContent: "center",
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  error: {
    color: "#ef4444",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 15,
  },
});

export default DetalhesReservaScreen;