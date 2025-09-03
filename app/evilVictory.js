import { View, Text, Image, StyleSheet, Alert, Pressable, ImageBackground } from 'react-native';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';

export default function evilVictory() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { character } = params;
    const [loaded1, error1] = useFonts({  //to load and use font
    'Orbitron-Medium': require('../assets/fonts/Orbitron-Medium.ttf'), 
  });     
  const parsedCharacter = character ? JSON.parse(character) : null;
  const [back, setBack] = useState(null);
  
  useEffect(() => {
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
  
      // Liberación de sonidos al desmontar el componente
      return () => {
        if (back) {
          console.log("Liberando back");
          back.unloadAsync();
        }
    
      };
    }, [back]);
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
  
  const toHome = () => {
    playBack();
    router.push({
        pathname: '/',
      });
  }
  return (
    <>
    <ImageBackground style={styles.victory_container} source={require ('../assets/gifs/earth_destroyed.gif')} resizeMode="cover" alt="earth_destroyed">
      <View style={styles.buttons_container}>
        <Pressable style={styles.button} onPress={toHome}> 
          <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Back</Text>               
          </View>
        </Pressable>
      </View>
          <View style={styles.text_container}>
            <View style={styles.text_support}>
              <Text style={styles.victory_text}>
                {parsedCharacter.name} destroyed the world.
              </Text>
            </View>
          </View>
          <View style={styles.subtitle_container}>
            <Text style={styles.victory_text}>Mission acomplished....</Text>
          </View>
        </ImageBackground>
        
        </>
  );
}

const styles = StyleSheet.create({
  victory_container: {
    height: '100%',
    alignItems: 'center',
  },
  text_container:{
    marginTop: 450
  },
  text_support: {
    alignItems: 'center',
    width: '90%'
  },
  victory_text: {
    fontSize: 20,
    color: 'white',
    textShadowColor: 'black',
    marginTop: 20,
    fontFamily: 'Orbitron-Medium',
  },
  subtitle_container: {
    marginRight: 20
  },
  buttons_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 60
  },
  button: {
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2596be",
    padding: 5,
    marginRight: 280,
    marginTop: 20,
    width: 100,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    fontFamily: "Orbitron-Medium",
  }
});