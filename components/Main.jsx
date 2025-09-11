import { useState, useEffect, useRef } from "react";
import { Animated, Alert, StyleSheet, ImageBackground, View, Text } from "react-native";
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
        duration: 2500, // Animation duration in milliseconds (1 second)
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
        require("../assets/sounds/computer_sequence.mp3")
      );
      setAmbient(sound);
      console.log("Reproduciendo ambient");
      await sound.playAsync();
    } catch (error) {
      console.error("Error al reproducir ambient:", error);
    }
  }
  return (
    <>
      
      <ImageBackground style={styles.container} source={require ('../assets/data_handling.png')}>
        <ImageBackground style={styles.text_background}  source={require ('../assets/screen-back.png')}>
          <View style={styles.text_container}>
            <Text style={styles.text}>Random file</Text>
          </View>
        </ImageBackground>
        {character && (
          <Animated.View style={[styles.card_container, { opacity: opacityAnim }]}>
            <CharacterCard item={character}  />
          </Animated.View>
        )}
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  text_background: {
    width: 370,
    borderRadius: 10,  
    marginTop: 90,
    opacity: 0.85,
    overflow: 'hidden', //para que funcione borderRadius en ImageBackground
    marginBottom: 10
  },
  text_container: {
    alignItems: 'center'
  },
  text: {
    fontSize: 30,
    marginBottom: 10,
    fontFamily: 'Orbitron-Medium',
    marginLeft: 10,
    marginTop: 10
  },
  card_container: {
    overflow: 'hidden'
  }
  
});