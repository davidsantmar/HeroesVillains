import { CharacterCard } from "../components/CharacterCard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Audio } from "expo-av";

export default function characterPage() {
  const [bell, setBell] = useState(null);
  const [back, setBack] = useState(null);
  const params = useLocalSearchParams();
  const router = useRouter();
  const { fighter } = params;
  const { fighters } = params;
  const [characters, setCharacters] = useState(fighters);
  const [character, setCharacter] = useState(fighter);
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });

    // Liberación de sonidos al desmontar el componente
    return () => {
      if (bell) {
        console.log("Liberando bell");
        bell.unloadAsync();
      }
      if (back) {
        console.log("Liberando back");
        back.unloadAsync();
      }
      
    };
  }, [bell, back]);
  
  async function playBell() {
    console.log("Cargando bell");
    try {
      if (bell) {
        // Si el sonido ya está cargado, reutilízalo
        console.log("Reproduciendo bell existente");
        await bell.replayAsync(); // replayAsync reinicia y reproduce el sonido
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/boxing-bell.mp3")
      );
      setBell(sound);
      console.log("Reproduciendo bell");
      await sound.playAsync();
    } catch (error) {
      console.error("Error al reproducir bell:", error);
    }
  }

  // Función para reproducir el sonido 'back'
  async function playBack() {
    console.log("Cargando back");
    try {
      if (back) {
        // Si el sonido ya está cargado, reutilízalo
        console.log("Reproduciendo back existente");
        await back.replayAsync(); // replayAsync reinicia y reproduce el sonido
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/back.mp3")
      );
      setBack(sound);
      console.log("Reproduciendo back");
      await sound.playAsync();
    } catch (error) {
      console.error("Error al reproducir back:", error);
    }
  }

  // Convertir characters a un arreglo si es una cadena JSON
  const parsedCharacter = fighter ? JSON.parse(fighter) : null;
  const toFightersSearched = () => {
    playBack();
    router.push({
      pathname: "/fightersSearched",
      params: { characters: characters }, // Expo Router requiere serialización para parámetros complejos
    });
  };
 
  
  const toBattleArena = () => {
    playBell();
    router.push({
      pathname: "/battleArena",
      params: { character: character, fighters: fighters },
    });
  };
  return (
    <>
      <View style={styles.container}>
        <View style={styles.buttonsContainer}>
          <Pressable style={styles.button} onPress={toFightersSearched}>
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Back</Text> 
            </View>
          </Pressable>
          <Pressable style={styles.button} onPress={toBattleArena}>
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>FIGHT!</Text>
            </View>
          </Pressable>
        </View>
        <CharacterCard item={parsedCharacter} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
  },
  card_container: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 60,
    marginBottom: 20
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
