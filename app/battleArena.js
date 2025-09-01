import { View, StyleSheet, Alert, Image, Pressable, Text } from 'react-native';
import { useCallback, useEffect, useReducer, useState } from 'react';
import { FighterCard } from '../components/FighterCard';
import { useFonts } from 'expo-font';
import { VersusScore } from '../components/VersusScore';
import { getCharacterOfTheDay } from '../data/data';
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Audio } from "expo-av";

export default function BattleArena() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { character } = params;
  const { fighters } = params;
  const [charactersLine, setCharactersLine] = useState(fighters);
  const [characterToShow, setCharacterToShow] = useState(null);
  const [enemyToShow, setEnemyToShow] = useState(null);
  const [characterFight, setCharacterFight] = useState(null);
  const [enemyFight, setEnemyFight] = useState(null);
  const [winChar, setWinChar] = useState('');
  const [winEnemy, setWinEnemy] = useState('');
  const [charUnknownData, setCharUnknownData] = useState(false);
  const [enemyUnknownData, setEnemyUnknownData] = useState(false);
  const [charScore, setCharScore] = useState(0);
  const [enemyScore, setEnemyScore] = useState(0);
  const [dataInsuf, setDataInsuf] = useState(null);
  const navigation = useNavigation();
  const [loaded, error] = useFonts({
    'Orbitron-Medium': require('../assets/fonts/Orbitron-Medium.ttf'), 
  });
  const [youWin, setYouWin] = useState(null);
  const [youLose, setYouLose] = useState(null);
  const [perfect, setPerfect] = useState(null);
  const [avengers, setAvengers] = useState(null);
  const [lose, setLose] = useState(null);
  useEffect(() => {
        Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });
    
        // Liberación de sonidos al desmontar el componente
        return () => {
          if (dataInsuf) {
            console.log("Liberando dataInsuf");
            dataInsuf.unloadAsync();
          }
        };
      }, [dataInsuf]);
  useEffect(() => {
    if (charScore === 12 && enemyScore === 0){
        router.push({
          pathname: "/victory",
          params: { character: JSON.stringify(characterToShow)}
        })
        playPerfect();
    }
    if (charScore === 1) {
      playAvengers();
    }
  }, [charScore]);
  useEffect(() => {
    const parsedCharacter = typeof character === "string" ? JSON.parse(character) : character;
    if (parsedCharacter) {
      showCharacter(parsedCharacter);
    }
    loadEnemy();
  }, [character]);
  useEffect(() => {
    if (characterToShow && enemyToShow) {
      setTimeout(battle, 5);
    }
  }, [characterToShow, enemyToShow, battle]);
 async function playAvengers() {
    console.log("Cargando avengers");
    try {
      if (avengers) {
        // Si el sonido ya está cargado, reutilízalo
        console.log("Reproduciendo avengers existente");
        await avengers.replayAsync(); // replayAsync reinicia y reproduce el sonido
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/avengers.mp3")
      );
      setAvengers(sound);
      console.log("Reproduciendo avengers");
      await sound.playAsync();
    } catch (error) {
      console.error("Error al reproducir avengers:", error);
    }
  }
 async function playYouWin() {
    console.log("Cargando youWin");
    try {
      if (youWin) {
        // Si el sonido ya está cargado, reutilízalo
        console.log("Reproduciendo youWin existente");
        await youWin.replayAsync();
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/you-win.mp3")
      );
      setYouWin(sound);
      console.log("Reproduciendo youWin");
      await sound.playAsync();
    } catch (error) {
      console.error("Error al reproducir youWin:", error);
    }
  }
  async function playYouLose() {
    console.log("Cargando youLose");
    try {
      if (youLose) {
        // Si el sonido ya está cargado, reutilízalo
        console.log("Reproduciendo youLose existente");
        await youLose.replayAsync();
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/you-lose.mp3")
      );
      setYouLose(sound);
      console.log("Reproduciendo youLose");
      await sound.playAsync();
    } catch (error) {
      console.error("Error al reproducir youLose:", error);
    }
  }
  async function playPerfect() {
    console.log("Cargando perfect");
    try {
      if (perfect) {
        // Si el sonido ya está cargado, reutilízalo
        console.log("Reproduciendo perfect existente");
        await perfect.replayAsync();
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/youWinGood.mp3")
      );
      setPerfect(sound);
      console.log("Reproduciendo perfect");
      await sound.playAsync();
    } catch (error) {
      console.error("Error al reproducir perfect:", error);
    }
  }
  async function playLose() {
      console.log("Cargando lose");
      try {
        if (lose) {
          // Si el sonido ya está cargado, reutilízalo
          console.log("Reproduciendo lose existente");
          await lose.replayAsync(); // replayAsync reinicia y reproduce el sonido
          return;
        }
  
        const { sound } = await Audio.Sound.createAsync(
          require("../assets/sounds/lose.mp3")
        );
        setLose(sound);
        console.log("Reproduciendo lose");
        await sound.playAsync();
      } catch (error) {
        console.error("Error al reproducir lose:", error);
      }
    }
  async function playDataInsuf() {
    console.log('Cargando data insuf');
    try {
      // Carga el sonido
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/data_insuf.mp3')
      );
      
      // Almacena el sonido en el estado
      setDataInsuf(sound);
      console.log('Reproduciendo data insuf');
      
      // Reproduce el sonido inmediatamente después de crearlo
      await sound.playAsync();
    } catch (error) {
      console.error('Error al reproducir el data insuf:', error);
    }
  }
  const fixUnknownStats = (char, friendOrFoe) => { 
    // Defensive check for invalid input
    if (!char || !char.powerstats) {
        console.warn('fixUnknownStats: Invalid character or powerstats missing', char);
        return char; 
    }
    const fixedChar = { ...char, powerstats: { ...char.powerstats }};
    const stats = ['intelligence', 'strength', 'speed', 'durability', 'power', 'combat'];
    stats.forEach((stat) => {
      const value = fixedChar.powerstats[stat];
        if (value === 'unknown' || value === null || value === undefined || isNaN(Number(value))) {
          fixedChar.powerstats[stat] = Math.floor(Math.random() * 99) + 1;
          playDataInsuf();
          if (friendOrFoe === 'enemy') {
            setEnemyUnknownData(true);
            fixedChar.unknownData === true;
          } else if (friendOrFoe === 'friend'){
            setCharUnknownData(true);
          }
        } else {
          fixedChar.powerstats[stat] = Number(value);
        }
    });
    return fixedChar; // Return the modified object
  };
  const loadEnemy = async () => {
      try {
        const result = await getCharacterOfTheDay();
        setEnemyToShow(fixUnknownStats(result, 'enemy'));
        setEnemyFight(enemyToShow);
      } catch (error) {
        Alert.alert("Error fetching character", error.message);
        Alert.alert("Error", "Failed to load character");
      }
  };    
  const showCharacter = (char) => {
    setWinChar('');
    setWinEnemy('');
    setCharUnknownData(false);
    setEnemyUnknownData(false);
    setCharacterToShow(fixUnknownStats(char, 'friend'));
    setCharacterFight(char); // Inicialize character
  };
  const newFight = () =>{
    setEnemyUnknownData(false);
    setEnemyFight(null);
    setEnemyToShow(null);
    loadEnemy();
  }  
  const battle = useCallback(() => {
    if (!characterToShow || !enemyToShow) return (
        <Pressable style={styles.button} onPress={() => navigation.goBack()} >
            <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Back</Text>               
            </View>
        </Pressable>
    );
    if (!enemyToShow){
        loadEnemy();
    }
    const winIcon = '❌';
    const loseIcon = '✅';
    const updatedCharacterFight = {
      image: characterToShow.image.url,
      powerstats: {
        intelligence_data: [{ intelligence: Number(characterToShow.powerstats.intelligence) }, { animation: false }],
        strength_data: [{ strength: Number(characterToShow.powerstats.strength) }, { animation: false }],
        speed_data: [{ speed: Number(characterToShow.powerstats.speed) }, { animation: false }],
        durability_data: [{ durability: Number(characterToShow.powerstats.durability) }, { animation: false }],
        power_data: [{ power: Number(characterToShow.powerstats.power) }, { animation: false }],
        combat_data: [{ combat: Number(characterToShow.powerstats.combat) }, { animation: false }],
      },
      results: {},
      unknownData: charUnknownData
    };
    const updatedEnemyFight = {
      image: enemyToShow.image.url,
      powerstats: {
        intelligence_data: [{ intelligence: Number(enemyToShow.powerstats.intelligence) }, { animation: false }],
        strength_data: [{ strength: Number(enemyToShow.powerstats.strength) }, { animation: false }],
        speed_data: [{ speed: Number(enemyToShow.powerstats.speed) }, { animation: false }],
        durability_data: [{ durability: Number(enemyToShow.powerstats.durability) }, { animation: false }],
        power_data: [{ power: Number(enemyToShow.powerstats.power) }, { animation: false }],
        combat_data: [{ combat: Number(enemyToShow.powerstats.combat) }, { animation: false }],
      },
      results: {},
      unknownData: enemyUnknownData
    };
    let charPoints = 0;
    let enemyPoints = 0;
    let charScorePoints = charScore;
    let enemyScorePoints = enemyScore;
    const stats = ['intelligence_data', 'strength_data', 'speed_data', 'durability_data', 'power_data', 'combat_data'];
    stats.forEach((stat, index) => {
          setTimeout(() => {
            const statKey = stat.replace('_data', '');
            const charValue  = updatedCharacterFight.powerstats[stat][0][statKey];
            const enemyValue = updatedEnemyFight.powerstats[stat][0][statKey];
            if (charValue < enemyValue) {
              updatedCharacterFight.results[stat] = winIcon;
              updatedEnemyFight.results[stat]     = loseIcon;
              charPoints += 1;
            } else if (charValue > enemyValue) {
              updatedCharacterFight.results[stat] = loseIcon;
              updatedEnemyFight.results[stat]     = winIcon;
              enemyPoints += 1;
            } else {
              updatedCharacterFight.results[stat] = '';
              updatedEnemyFight.results[stat]     = '';
            }
            // Forzar re-render para que se vea el icono de este stat
            setCharacterFight({ ...updatedCharacterFight, results: { ...updatedCharacterFight.results } });
            setEnemyFight({ ...updatedEnemyFight, results: { ...updatedEnemyFight.results } });

            if (index === stats.length - 1) {
              if (charPoints > enemyPoints){
                setWinChar('loser');
                setWinEnemy('winner');
                setEnemyScore(enemyScorePoints += 1);
                setTimeout(playYouLose, 1000);
              } else if (charPoints < enemyPoints){
                setWinEnemy('loser');
                setWinChar('winner'); 
                setCharScore(charScorePoints += 1);
                setTimeout(playYouWin, 1000);
              }else if (charPoints === enemyPoints){
                setWinEnemy('winner');
                setWinChar('winner'); 
              }
            }
          }, index * 200); 
      });
    }, [characterToShow, enemyToShow]);
    async function stopAvengers() {
      if (avengers) {
        console.log('Deteniendo avengers...');
        try {
          await avengers.stopAsync();
          console.log('Avengers detenido correctamente');
        } catch (error) {
          console.log('Error al detener el avengers:', error);
        }
      } else {
        console.log('No hay avengers cargado para detener');
      }
    }
  const toFightersSearched = () => {
      stopAvengers();
      playLose();
      router.push({
        pathname: '/fightersSearched',
        params: { characters: charactersLine}, // Expo Router requiere serialización para parámetros complejos
      });
    }
  return (
    <View style={styles.container}>
        {characterToShow && enemyToShow ? (
            <>
             <View style={styles.buttons_container}>
                <Pressable style={styles.button} onPress={toFightersSearched}> 
                  <View style={styles.buttonContent}>
                      <Text style={styles.buttonText}>Back</Text>               
                  </View>
                </Pressable>
                <Pressable style={styles.button}  onPress={()=> newFight()}>
                    <View style={styles.buttonContent}>
                        <Text style={styles.buttonText}>FIGHT!</Text>               
                    </View>
                </Pressable>
              </View>
              <View style={styles.score_line}>
                <View style={styles.score_container}>
                  <Text style={styles.score_text}>Player</Text>
                  <Text style={styles.score}>{charScore}</Text>
                </View>
                <View style={styles.score_container}>
                  <Text style={styles.score_text}>Computer</Text>
                  <Text style={styles.score}>{enemyScore}</Text>
                </View>
              </View>
             
              <VersusScore
                character={characterToShow}
                enemy={enemyToShow}
                loseChar={winChar}
                loseEnemy={winEnemy}
              />
              <View style={styles.characters_card_container}>
                <FighterCard character={characterFight} winlose={winChar} />
                <FighterCard character={enemyFight} winlose={winEnemy} />
              </View>
            </>
          ) : (
            <>
                <View style={styles.buttons_container}>
                    <Pressable style={styles.button} onPress={() => navigation.goBack()} >
                        <View style={styles.buttonContent}>
                            <Text style={styles.buttonText}>No fighter</Text>               
                        </View> 
                    </Pressable>
                </View>
                <View style={styles.logo_container}>
                <Image
                    style={styles.logo}
                    source={require('../assets/icon.png')}
                    resizeMode="cover"
                />
                </View>
            </>
          )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  characters_card_container: {
    flexDirection: 'row',
  },
  card_container: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    width: '180',
    height: '320',
  },
  score_line: {
    flexDirection: 'row',
    marginTop: 20, 
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  score_container: {
    alignItems: 'center',
  },
  score_text: {
    color: 'white',
    fontFamily: 'Orbitron-Medium',
    fontSize: 12,
  },
  score: {
    color: 'white',
    fontFamily: 'Orbitron-Medium',
    fontSize: 12,
  }, 
  logo_container: {
    alignItems: 'center',
    marginTop: 110
  },
  logo: {
    width: 400,
    height: 450,
  },
  input: {
    padding: 5,
    marginTop: 40,
    marginLeft: 10,
    borderRadius: 5,
    height: 40,
    width: 200, // Ajustado para adaptarse al encabezado
    backgroundColor: "white",
    fontSize: 16,
    fontFamily: "Orbitron-Medium",
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
    marginRight: 10,
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
  },
});