import { CharacterCard } from "../components/CharacterCard";
import { Link, useLocalSearchParams, useRouter} from 'expo-router'
import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function characterPage() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { fighter } = params;
  const { fighters } = params;
  const [characters, setCharacters] = useState(fighters);
    const [character, setCharacter] = useState(fighter);
    const [select, setSelect] = useState(null);
  // Convertir characters a un arreglo si es una cadena JSON
   const parsedCharacter = fighter ? JSON.parse(fighter) : null;
    const toFightersSearched = () => {
      router.push({
        pathname: '/fightersSearched',
        params: { characters: characters}, // Expo Router requiere serialización para parámetros complejos
      });
    }
    const toBattleArena = () => {
      router.push({
        pathname: '/battleArena',
        params: { character: character, fighters: fighters}, 
      });
    }
   
    return(
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
    )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    padding: 10,
  },
  card_container: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 60
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