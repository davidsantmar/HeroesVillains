import { View, Text, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams, Link } from "expo-router";
import { FightersAvailable } from "../components/FightersAvailable";
import { useEffect } from "react";

export default function FightersSearched() {
  const params = useLocalSearchParams();
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
 
  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <Link asChild href="/arena">
          <Pressable style={styles.button}>
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Back</Text>
            </View>
          </Pressable>
        </Link>
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