import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Button, Text } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/navigation";

const API_URL = "http://10.0.2.2:8000";

type Props = NativeStackScreenProps<RootStackParamList, "ConfirmarRemocao">;

const ConfirmarRemocaoScreen = ({ route, navigation }: Props) => {
  const  veiculo  = route.params;
  const { license_plate, vehicle_color, vehicle_year } = veiculo;
  
  const removerVeiculo = async () => {
    try {
      const response = await fetch(`${API_URL}/parkings/active/${license_plate}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao remover veículo");

      Alert.alert("Sucesso", "Veículo removido com sucesso!", [
        {
          text: "OK",
          onPress: () => navigation.popToTop(),
        },
      ]);
    } catch (err: any) {
      Alert.alert("Erro", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Confirmar Remoção
      </Text>
      <Text variant="bodyLarge">
        Veículo: {vehicle_year} - {vehicle_color}
      </Text>
      <Text variant="bodyLarge">Placa: {license_plate}</Text>

      <Button mode="contained" onPress={removerVeiculo} style={styles.button}>
        Confirmar Remoção
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FAFAFA",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    marginTop: 20,
  },
});

export default ConfirmarRemocaoScreen;
