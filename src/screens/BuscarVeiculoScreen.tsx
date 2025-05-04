import React, { useState } from "react";
import { View, StyleSheet, TextInput, Alert } from "react-native";
import { Button, Text } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/navigation";

const API_URL = "http://10.0.2.2:8000";

type Props = NativeStackScreenProps<RootStackParamList, "BuscarVeiculo">;

const BuscarVeiculoScreen = ({ navigation }: Props) => {
  const [placa, setPlaca] = useState("");

  const buscarVeiculo = async () => {
    if (!placa.trim()) {
      Alert.alert("Erro", "Digite a placa do veículo.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/parkings/active/search/?license_plate=${placa}&skip=0&limit=100`);
      if (!response.ok) throw new Error("Veículo não encontrado");
      const veiculo = await response.json();
      navigation.navigate("ConfirmarRemocao", veiculo[0] );
    } catch (err: any) {
      Alert.alert("Erro", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Buscar Veículo
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Digite a placa"
        value={placa}
        onChangeText={setPlaca}
        autoCapitalize="characters"
      />

      <Button mode="contained" onPress={buscarVeiculo} style={styles.button}>
        Buscar Veículo
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FAFAFA",
  },
  title: {
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#FFF",
  },
  button: {
    marginBottom: 20,
  },
});

export default BuscarVeiculoScreen;
