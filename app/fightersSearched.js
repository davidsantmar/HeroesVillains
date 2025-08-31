import { View, Text, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FightersAvailable } from "../components/FightersAvailable";
import { useEffect, useState } from "react";
import { Audio } from "expo-av";

export default function FightersSearched() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [draw, setDraw] = useState(null);
  const { characters } = params;
  // Convertir characters a un arreglo si es una cadena JSON
  const parsedCharacters = characters ? JSON.parse(characters) : null;
  // Validar que parsedCharacters sea un arreglo
  if (!parsedCharacters || !Array.isArray(parsedCharacters)) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No characters found</Text>
      </View>
    );
  }
  useEffect(() => {
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
  
      // Liberación de sonidos al desmontar el componente
      return () => {
        if (draw) {
          console.log("Liberando draw");
          draw.unloadAsync();
        }
      };
    }, [draw]);
    async function playDraw() {
      console.log("Cargando draw");
      try {
        if (draw) {
          // Si el sonido ya está cargado, reutilízalo
          console.log("Reproduciendo draw existente");
          await draw.replayAsync();
          return;
        }
  
        const { sound } = await Audio.Sound.createAsync(
          require("../assets/sounds/draw.mp3")
        );
        setDraw(sound);
        console.log("Reproduciendo draw");
        await sound.playAsync();
      } catch (error) {
        console.error("Error al reproducir draw:", error);
      }
    }
  const toArena = () => {
    playDraw();
    router.push({
        pathname: '/arena',
      });
  }
  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
          <Pressable style={styles.button} onPress={toArena}>
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Back</Text>
            </View>
          </Pressable>
      </View>
        <FightersAvailable fighters={parsedCharacters} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 60,
  },
  button: {
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2596be",
    padding: 5,
    marginRight: 10,
    marginTop: 10,
    width: 100,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    fontFamily: "Orbitron-Medium",
  },
});