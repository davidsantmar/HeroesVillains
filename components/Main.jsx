import { useState, useEffect, useRef } from "react";
import { Animated, Alert, View, StyleSheet } from "react-native";
import { getCharacterOfTheDay } from "../data/data";
import { CharacterCard } from "./CharacterCard";
import { Audio } from 'expo-av';

export function Main() {
  const [character, setCharacter] = useState(null);
  const opacityAnim = useRef(new Animated.Value(0)).current; // Start with opacity 0 for fade-in
  const [ambient, setAmbient] = useState(null);
  useEffect(() => {
    const loadCharacterOfTheDay = async () => {
      try {
        const result = await getCharacterOfTheDay();
        setCharacter(result);
      } catch (error) {
        Alert.alert("Error fetching character", error.message);
        Alert.alert("Error", "Failed to load character");
      }
    };
    loadCharacterOfTheDay();
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
        if (ambient) {
          console.log("Liberando ambient");
          ambient.unloadAsync();
        }
      };
    }, [ambient]);
  useEffect(() => {
    if (character) {
      Animated.timing(opacityAnim, {
        toValue: 1, // Animate to opacity 1
        duration: 1000, // Animation duration in milliseconds (1 second)
        useNativeDriver: true, // Use native driver for better performance
      }).start();
      //playAmbient();
    }
  }, [character, opacityAnim]);
async function playAmbient() {
    console.log("Cargando ambient");
    try {
      if (ambient) {
        // Si el sonido ya está cargado, reutilízalo
        console.log("Reproduciendo ambient existente");
        await ambient.replayAsync();
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/data_room.mp3")
      );
      setAmbient(sound);
      console.log("Reproduciendo ambient");
      await sound.playAsync();
    } catch (error) {
      console.error("Error al reproducir ambient:", error);
    }
  }
  return (
    <View style={styles.container}>
      {character && (
        <Animated.View style={{ backgroundColor: "black", opacity: opacityAnim }}>
          <CharacterCard item={character}  />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    marginBottom: -180
  },
});