import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { Text } from "react-native-paper";
import { Car, Plane, ShoppingBag } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const API_URL = "http://10.0.2.2:8000";

function getIconByName(name) {
  if (!name) return <Car size={48} color="#324f9c" />;
  const n = name.toLowerCase();
  if (n.includes("aeroporto")) return <Plane size={48} color="#324f9c" />;
  if (n.includes("shopping")) return <ShoppingBag size={48} color="#324f9c" />;
  return <Car size={48} color="#324f9c" />;
}

const { width } = Dimensions.get("window");

const ParkingScreen = () => {
  const [estacionamentos, setEstacionamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchEstacionamentos = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        const tokenType = await AsyncStorage.getItem('token_type');
        if (!token) throw new Error("Token de acesso ausente");
        const response = await fetch(`${API_URL}/parking/parkingsTypes/?skip=0&limit=100`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${tokenType} ${token}`,
          }
        });
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
    <LinearGradient
      colors={['#1a2a6c', '#2a4085', '#324f9c']}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Selecione o tipo de estacionamento</Text>
        <View style={styles.cardsWrapper}>
          {loading ? (
            <ActivityIndicator size="large" color="#324f9c" />
          ) : error ? (
            <Text style={styles.error}>{error}</Text>
          ) : (
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {estacionamentos.length === 0 ? (
                <Text style={styles.emptyText}>Nenhum estacionamento encontrado.</Text>
              ) : (
                estacionamentos.map((estacionamento) => {
                  const vagasIniciais = Array.from({ length: estacionamento.capacity }, (_, index) => ({
                    id: index + 1,
                    status: "livre"
                  }));
                  const vagaLivre = vagasIniciais.find(v => v.status === "livre");
                  const vagaId = vagaLivre ? vagaLivre.id : 1;

                  return (
                    <TouchableOpacity
                      key={estacionamento.id}
                      style={styles.bigCard}
                      activeOpacity={0.85}
                      onPress={() =>
                        navigation.navigate("DetalhesReserva", {
                          estacionamento: estacionamento.name,
                          vagaId: vagaId,
                        })
                      }
                    >
                      <View style={styles.iconBox}>
                        {getIconByName(estacionamento.name)}
                      </View>
                      <Text style={styles.cardName}>{estacionamento.name}</Text>
                      <Text style={styles.cardVagas}>
                        {estacionamento.capacity} vagas disponíveis
                      </Text>
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 48,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 24,
    textAlign: "center",
  },
  cardsWrapper: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    alignItems: "center",
    paddingBottom: 32,
    paddingTop: 8,
  },
  bigCard: {
    width: width * 0.85,
    backgroundColor: "rgba(255,255,255,0.97)",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    marginBottom: 24,
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
  cardName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#324f9c",
    marginBottom: 8,
    textAlign: "center",
  },
  cardVagas: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "600",
    textAlign: "center",
  },
  error: {
    color: "#ef4444",
    textAlign: "center",
    fontSize: 15,
    marginTop: 20,
  },
  emptyText: {
    color: "#64748b",
    textAlign: "center",
    fontSize: 15,
    marginTop: 20,
  },
});

export default ParkingScreen;