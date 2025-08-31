import { View, Text, StyleSheet, Animated } from "react-native";
import React, { useRef, useEffect } from 'react';

export function VersusScore({ character, enemy, loseChar, loseEnemy }) {
  const characterTranslateY = useRef(new Animated.Value(0)).current; // Animación para el personaje
  const enemyTranslateY = useRef(new Animated.Value(0)).current; // Animación para el enemigo

  useEffect(() => {
    let timer;
      timer = setTimeout(() => {
        if (loseChar === 'loser') {
          Animated.timing(characterTranslateY, {
            toValue: 580, // Mueve el nombre del perdedor hacia abajo
            duration: 1500,
            useNativeDriver: true,
          }).start();
        } else {
          Animated.timing(characterTranslateY, {
            toValue: 0, // Vuelve a la posición inicial si es ganador
            duration: 1500,
            useNativeDriver: true,
          }).start();
        }

        // Animación para el enemigo
        if (loseEnemy === 'loser') {
          Animated.timing(enemyTranslateY, {
            toValue: 500, // Mueve el nombre del perdedor hacia abajo
            duration: 1500,
            useNativeDriver: true,
          }).start();
        } else {
          Animated.timing(enemyTranslateY, {
            toValue: 0, // Vuelve a la posición inicial si es ganador
            duration: 1500,
            useNativeDriver: true,
          }).start();
        }

      }, 2000); 
    return () => clearTimeout(timer);

  }, [loseChar, loseEnemy]); // Dependencias correctas

  return (
    <View style={styles.vs_container}>
      <View style={styles.character_name_container}>
        <Animated.Text
          style={[styles.character_name, { transform: [{ translateY: characterTranslateY }] }]}
        >
          {character.name || 'Sin nombre'}
        </Animated.Text>
      </View>
      <View style={styles.vs_text}>
        <Text style={styles.vs}>VS</Text>
      </View>
      <View style={styles.enemy_name_container}>
        <Animated.Text
          style={[styles.character_name, { transform: [{ translateY: enemyTranslateY }] }]}
        >
          {enemy.name || 'Sin nombre'}
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  vs_container: {
    flexDirection: 'column',
    marginTop: 20,
  },
  vs_text: {
    alignItems: 'center',
  },
  vs: {
    color: 'red',
    fontSize: 35,
    fontFamily: 'Orbitron-Medium',
  },
  character_name_container: {
    alignItems: 'flex-start',
    marginLeft: 15,
  },
  character_name: {
    fontSize: 25,
    fontFamily: 'Orbitron-Medium',
    color: 'white',
  },
  enemy_name_container: {
    alignItems: 'flex-end',
    marginRight: 15,
  },
});