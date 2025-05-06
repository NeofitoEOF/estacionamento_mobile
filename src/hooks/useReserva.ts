import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

const API_URL = "http://10.0.2.2:8000"; 

export function useReserva() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reservarVaga = async (vagaId: number, placa: string, cor: string, ano: string) => {
    setLoading(true);
    setError(null);
    let vehicle_color = cor;
    let license_plate = placa;
    let vehicle_year = ano;
    let parking_type_id = vagaId;
    try {
      const token = await AsyncStorage.getItem('access_token');
      const tokenType = await AsyncStorage.getItem('token_type');
      if (!token) throw new Error("Token de acesso ausente");
      const response = await fetch(`${API_URL}/parking/parkings/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `${tokenType} ${token}`,
         },
        body: JSON.stringify({ vehicle_color, license_plate, vehicle_year, parking_type_id }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { reservarVaga, loading, error };
}