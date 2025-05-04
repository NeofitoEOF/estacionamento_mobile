import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text, ActivityIndicator } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/navigation";
import { useReserva } from "../hooks/useReserva";

type Props = NativeStackScreenProps<RootStackParamList, "DetalhesReserva">;

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
    <View style={styles.container}>
      <Text style={styles.title}>📍 {estacionamento}</Text>
      <Text style={styles.subtitle}>Vaga {vagaId}</Text>

      <TextInput label="Placa do Veículo" value={placa} onChangeText={setPlaca} mode="outlined" style={styles.input} />
      <TextInput label="Cor do Veículo" value={cor} onChangeText={setCor} mode="outlined" style={styles.input} />
      <TextInput label="Ano do Veículo" value={ano} onChangeText={setAno} keyboardType="numeric" mode="outlined" style={styles.input} />

      {loading && <ActivityIndicator size="large" color="#6200ee" />}
      {error && <Text style={styles.error}>{error}</Text>}

      <Button mode="contained" onPress={handleConfirmarReserva} style={styles.button} disabled={loading}>
        Confirmar Reserva
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  subtitle: { fontSize: 18, textAlign: "center", marginBottom: 20 },
  input: { marginBottom: 10 },
  button: { marginTop: 20 },
  error: { color: "red", textAlign: "center", marginBottom: 10 },
});

export default DetalhesReservaScreen;
