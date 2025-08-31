import { useState, useEffect, useRef } from "react";
import { Animated, Alert, View, StyleSheet } from "react-native";
import { getCharacterOfTheDay } from "../data/data";
import { CharacterCard } from "./CharacterCard";

export function Main() {
  const [character, setCharacter] = useState(null);
  const opacityAnim = useRef(new Animated.Value(0)).current; // Start with opacity 0 for fade-in

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
    if (character) {
      Animated.timing(opacityAnim, {
        toValue: 1, // Animate to opacity 1
        duration: 1000, // Animation duration in milliseconds (1 second)
        useNativeDriver: true, // Use native driver for better performance
      }).start();
    }
  }, [character, opacityAnim]);

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
    flex: 1,
    backgroundColor: "black",
    marginBottom: -180
  },
});