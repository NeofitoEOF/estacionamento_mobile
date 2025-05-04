import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { List, Text } from "react-native-paper";
import { RootStackParamList } from "../navigation/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

const API_URL = "http://10.0.2.2:8000"; 

type Props = NativeStackScreenProps<RootStackParamList, "Parking">;

const ParkingScreen = ({ navigation }: Props) => {
  const [estacionamentos, setEstacionamentos] = useState<
    { id: number; name: string; capacity: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEstacionamentos = async () => {
      try {
        const response = await fetch(`${API_URL}/parkingsTypes/`);
        if (!response.ok) throw new Error("Erro ao buscar estacionamentos");

        const data = await response.json();
        setEstacionamentos(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEstacionamentos();
  }, []);

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        🏢 Estacionamentos Disponíveis
      </Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <List.Section>
          {estacionamentos.map((estacionamento) => (
            <List.Item
              key={estacionamento.id}
              title={estacionamento.name}
              description={`Vagas disponíveis: ${estacionamento.capacity}`}
              left={() => <List.Icon icon="car" />}
              onPress={() =>
                navigation.navigate("Reserva", {
                  estacionamento: estacionamento.name,
                  totalVagas: estacionamento.capacity,
                })
              }
            />
          ))}
        </List.Section>
      )}
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
  error: {
    color: "red",
    textAlign: "center",
  },
});

export default ParkingScreen;
