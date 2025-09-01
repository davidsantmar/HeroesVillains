import { View, Text, Image, StyleSheet, Alert, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';

export default function Victory() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { character } = params;
    const [loaded1, error1] = useFonts({  //to load and use font
    'Orbitron-Medium': require('../assets/fonts/Orbitron-Medium.ttf'), 
  });     
  const parsedCharacter = character ? JSON.parse(character) : null;
  const [draw, setDraw] = useState(null);
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
          await draw.replayAsync(); // replayAsync reinicia y reproduce el sonido
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
  const toHome = () => {
    playDraw();
    router.push({
        pathname: '/',
      });
  }
  return (
    <View style={styles.victory_container}>
      <View style={styles.buttons_container}>
        <Pressable style={styles.button} onPress={toHome}> 
          <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Back</Text>               
          </View>
        </Pressable>
      </View>
       <Image
          style={styles.picture}
          source={{
            uri: parsedCharacter.image?.url || "https://via.placeholder.com/90x110",
          }}
          onError={(error) => {
            console.log("Image load error:", error.nativeEvent.error);
            Alert.alert("Error", "Failed to load character image");
          }}
            defaultSource={{ uri: "https://via.placeholder.com/90x110" }}
        />
          <View style={styles.text_container}>
            <Text style={styles.victory_text_name}>
              {parsedCharacter.name}
            </Text>
          </View>
          <View style={styles.victory_container}>
            <Text style={styles.victory_text}>
              SAVED THE WORLD FROM DESTRUCTION! 
            </Text>
            <Text style={styles.victory_text}>
               At least, this time...
            </Text>
          </View>
        
    </View>
  );
}

const styles = StyleSheet.create({
  victory_container: {
    height: '100%',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  picture: {
    resizeMode: "cover",
    width: 300,
    height: 350,
    marginLeft: 10,
    marginTop: 110,
    borderRadius: 10
  },
  text_container:{
    alignItems: 'center',
    justifyContent: 'center'
  },
  victory_text_name: {
    fontSize: 20,
    color: 'white',
    textShadowColor: 'black',
    marginTop: 20,
    fontFamily: 'Orbitron-Medium',
  },
  victory_text: {
    fontSize: 15,
    color: 'white',
    textShadowColor: 'black',
    marginTop: 20,
    fontFamily: 'Orbitron-Medium',
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