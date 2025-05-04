import React, { useState, useEffect } from "react";
import { View, FlatList, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Button, Card } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Reserva">;

const ReservaScreen = ({ route, navigation }: Props) => {
  const { estacionamento, totalVagas } = route.params;
  const [vagas, setVagas] = useState<{ id: number; status: string }[]>([]);

  useEffect(() => {
    const vagasIniciais = Array.from({ length: totalVagas }, (_, index) => ({
      id: index + 1,
      status: "livre"
    }));
    setVagas(vagasIniciais);
  }, [totalVagas]);

  const handleReservar = (vagaId: number) => {
    navigation.navigate("DetalhesReserva", { estacionamento, vagaId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📍 {estacionamento}</Text>
      <Text style={styles.subtitle}>Total de Vagas: {totalVagas}</Text>

      <FlatList
        data={vagas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title title={`Vaga ${item.id}`} />
            <Card.Content>
              <Text>Status: {item.status === "livre" ? "🟢 Disponível" : "🔴 Ocupado"}</Text>
            </Card.Content>
            {item.status === "livre" && (
              <Card.Actions>
                <Button mode="contained" onPress={() => handleReservar(item.id)}>
                  Reservar
                </Button>
              </Card.Actions>
            )}
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  subtitle: { fontSize: 18, textAlign: "center", marginBottom: 20 },
  card: { marginBottom: 10 },
});

export default ReservaScreen;