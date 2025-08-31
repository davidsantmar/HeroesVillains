import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';

const numbers = [12, 54, 32, 45, 21, 69, 20];

export function NumberAnimation() {
  const [currentIndex, setCurrentIndex] = useState(0); // Índice actual del arreglo
  const [displayNumber, setDisplayNumber] = useState('00'); // Número mostrado en la UI
  const duration = 2000; // Duración total por número (2 segundos)
  const interval = 100; // Intervalo para cambiar números aleatorios (100 ms)

  useEffect(() => {
    if (currentIndex >= numbers.length) {
      // Si se completa el arreglo, no hacemos nada
      return;
    }

    const desired = numbers[currentIndex]; // Número deseado
    const started = new Date().getTime(); // Tiempo de inicio

    // Función para generar un número aleatorio de dos dígitos
    const getRandomNumber = () => {
      return `${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`;
    };

    // Intervalo para mostrar números aleatorios
    const animationTimer = setInterval(() => {
      const elapsed = new Date().getTime() - started;

      if (elapsed > duration || displayNumber === String(desired)) {
        clearInterval(animationTimer);
        //setDisplayNumber(String(desired).padStart(2, '0')); // Mostrar el número deseado
        // Pasar al siguiente índice después de un breve retraso
        setTimeout(() => {
          setCurrentIndex((prevIndex) => prevIndex + 1);
        }, 10); // Retraso para mostrar el número final antes de pasar al siguiente
      } else {
        setDisplayNumber(getRandomNumber()); // Mostrar número aleatorio
      }
    }, interval);

    // Limpieza del intervalo al desmontar el componente o cambiar el índice
    return () => clearInterval(animationTimer);
  }, [currentIndex]); // Ejecutar cuando cambia el índice

  return (
      <Text style={styles.number}>
        {currentIndex < numbers.length
          ? displayNumber + '❓'
          : displayNumber}
      </Text>
  );
}

const styles = StyleSheet.create({
  number: {
    fontSize: 18,
    fontFamily: 'ShadowsIntoLightTwo',
  }
});