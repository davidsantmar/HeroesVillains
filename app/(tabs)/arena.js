import { Text, View, StyleSheet, TextInput, Pressable, Image, ActivityIndicator, Alert, ImageBackground } from 'react-native';
import { getCharacterByName } from "../../data/data";
import { useCallback, useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import { getCharacterOfTheDay } from '../../data/data';
import { FightersAvailable } from '../../components/FightersAvailable';
import { useRouter, useNavigation, useFocusEffect } from 'expo-router';
import { Audio } from 'expo-av';

export default function Arena({charactersLine}) {
  const [chartyped, setChartyped] = useState('');
  const [characters, setCharacters] = useState([]);
  const [characterToShow, setCharacterToShow] = useState(null);
  const [activeTabId, setActiveTabId] = useState(null);  
  const [activeSearch, setActiveSearch] = useState(false);
  const [enemyToShow, setEnemyToShow] = useState(null);
  const [characterFight, setCharacterFight] = useState(null);
  const [enemyFight, setEnemyFight] = useState(null);
  const [newSearch, setNewSearch] = useState(false);
  const [winChar, setWinChar] = useState('');
  const [winEnemy, setWinEnemy] = useState('');
  const [charUnknownData, setCharUnknownData] = useState(false);
  const [enemyUnknownData, setEnemyUnknownData] = useState(false);
  const [charScore, setCharScore] = useState(0);
  const [enemyScore, setEnemyScore] = useState(0);
  const [select, setSelect] = useState(null);
  const [bridgeSound, setBridgeSound] = useState(null);
  const navigation = useNavigation();
  const [loaded, error] = useFonts({
    'Orbitron-Medium': require('../../assets/fonts/Orbitron-Medium.ttf'), 
  });
  const [resultsLength, setResultsLength] = useState('');
  const router = useRouter();
  useEffect(() => {
    return () => {
      if (select) {
        console.log('Liberando select');
        select.unloadAsync();
      }
    };
  }, [select]);
  useEffect(() => {
    playBridgeSound();
  }, [])
  useEffect(() => {
        Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });
    
        // Liberación de sonidos al desmontar el componente
        return () => {
          if (bridgeSound) {
            console.log("Liberando bridgeSound");
            bridgeSound.unloadAsync();
          }
        };
      }, [bridgeSound]);

  async function playBridgeSound() {
    console.log('Cargando bridge');
    try {
      // Carga el sonido
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/data_room.mp3')
      );
      
      // Almacena el sonido en el estado
      setBridgeSound(sound);
      console.log('Reproduciendo bridge');
      
      // Reproduce el sonido inmediatamente después de crearlo
      await sound.playAsync();
    } catch (error) {
      console.error('Error al reproducir el bridge:', error);
    }
  }
  async function stopBridgeSound() {
        if (bridgeSound) {
          console.log('Deteniendo bridgeSound...');
          try {
            await bridgeSound.stopAsync();
            console.log('BridgeSound detenido correctamente');
          } catch (error) {
            console.log('Error al detener el bridgeSound:', error);
          }
        } else {
          console.log('No hay bridgeSound cargado para detener');
        }
      }
  async function playSelect() {
    console.log('Cargando select');
    try {
      // Carga el sonido
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/select.mp3')
      );
      
      // Almacena el sonido en el estado
      setSelect(sound);
      console.log('Reproduciendo select');
      
      // Reproduce el sonido inmediatamente después de crearlo
      await sound.playAsync();
    } catch (error) {
      console.error('Error al reproducir el sonido:', error);
    }
  }
  
  useFocusEffect(
    useCallback(() => {
          if (charactersLine !== undefined) {
            setCharacters(charactersLine);
          } 

      navigation.setOptions({
        headerLeft: () => (
          <TextInput
            style={styles.input}
            value={chartyped}
            onChangeText={(text) => setChartyped(text)}
            placeholder="Type"
            placeholderTextColor="grey"
          />
        ),
        headerRight: () => (
          <Pressable style={styles.button} onPress={onSubmit}>
            <View style={styles.buttonContent}>
              {activeSearch ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.buttonText}>Search</Text>
              )}
              {characters.length > 1 && (
                <Text style={styles.buttonText}>{resultsLength}</Text>
              )}
            </View>
          </Pressable>
        ),
      });
    }, [chartyped, activeSearch, characters, resultsLength, onSubmit]));

 


  const onSubmit = async () => {
    stopBridgeSound();
    playSelect();
    setNewSearch(true);
    setActiveSearch(true);
    setResultsLength('');
    setCharUnknownData(false);
    setEnemyUnknownData(false);
    const results = await getCharacterByName(chartyped);
    if (results !== null) {
      setCharacters(results);
    router.push({
      pathname: '/fightersSearched',
      params: { characters: JSON.stringify(results) }, // Expo Router requiere serialización para parámetros complejos
    });
      setActiveSearch(false);
            setResultsLength('(' + results.length.toString() + ')');
    } else {
      setActiveSearch(false);
    }
  };
  return ( 
    <>
      <ImageBackground style={styles.container} source={require('../../assets/gifs/aircraft.gif')}
              resizeMode="cover"
              alt="earth">
      {characters.length > 0 ? (
        <FightersAvailable fighters={characters} />) 
        : 
        (<View style={styles.logo_container}>
          <Text style={styles.earth_text}>Search your character</Text>
            
          </View>
        )}
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
 
  
  logo_container: {
    alignItems: 'center',
  },
  logo: {
    width: 380,
    height: 590,
    marginTop: 40,
  },
  input: {
    padding: 5,
    marginTop: 42,
    marginLeft: 10,
    borderRadius: 5,
    height: 40,
    width: 200, // Ajustado para adaptarse al encabezado
    backgroundColor: "white",
    fontSize: 16,
    fontFamily: "Orbitron-Medium",
  },
  button: {
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2596be",
    padding: 5,
    marginRight: 10,
    marginTop: 40,
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
  earth_text: {
    fontSize: 16,
    color: "white",
    fontFamily: "Orbitron-Medium",
    marginTop: 40
  }
});