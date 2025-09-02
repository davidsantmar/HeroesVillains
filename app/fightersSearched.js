import { View, Text, StyleSheet, Pressable, ImageBackground } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FightersAvailable } from "../components/FightersAvailable";
import { useEffect, useState } from "react";
import { Audio } from "expo-av";

export default function FightersSearched() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [draw, setDraw] = useState(null);
  const [gifSource, setGifSource] = useState(require('../assets/gifs/showFighters.gif'));
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
    // Cambia el GIF por una imagen estática después de X milisegundos (duración aproximada del GIF)
    const timer = setTimeout(() => {
      setGifSource(require('../assets/screen.png')); // Imagen estática (último cuadro del GIF)
    }, 5500); // Ajusta el tiempo según la duración del GIF
    return () => clearTimeout(timer); // Limpia el temporizador al desmontar
  }, []);
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
    <ImageBackground style={styles.container} source={gifSource}
              resizeMode="cover"
              alt="earth">
      <View style={styles.buttonsContainer}>
          <Pressable style={styles.button} onPress={toArena}>
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Back</Text>
            </View>
          </Pressable>
      </View>
        <FightersAvailable fighters={parsedCharacters} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 60,
    marginRight: 10,

  },
  button: {
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2596be",
    padding: 5,
    marginLeft: 10,
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