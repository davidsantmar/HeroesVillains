import { Text, View, StyleSheet, TextInput, Pressable, Image, ActivityIndicator, Alert } from 'react-native';
import { getCharacterByName } from "../../data/data";
import { useCallback, useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import { getCharacterOfTheDay } from '../../data/data';
import { FightersAvailable } from '../../components/FightersAvailable';
import { useRouter, useNavigation, useFocusEffect } from 'expo-router';

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
  const navigation = useNavigation();
  const [loaded, error] = useFonts({
    'Orbitron-Medium': require('../../assets/fonts/Orbitron-Medium.ttf'), 
  });
  const [resultsLength, setResultsLength] = useState('');
  const router = useRouter();
  
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
            placeholder="Search character..."
            placeholderTextColor="black"
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
  useEffect(() => {
    loadEnemy();
  }, [characters]);
 


  const onSubmit = async () => {
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
  const loadEnemy = async () => {
    try {
      const result = await getCharacterOfTheDay();
      setEnemyToShow(fixUnknownStats(result, 'enemy'));
      setEnemyFight(result); // Inicializ enemyFight
    } catch (error) {
      Alert.alert("Error fetching character", error.message);
      Alert.alert("Error", "Failed to load character");
    }
  };    
  const fixUnknownStats = (char, friendOrFoe) => {
  // Defensive check for invalid input
  if (!char || !char.powerstats) {
    console.warn('fixUnknownStats: Invalid character or powerstats missing', char);
    return char; 
  }
  const fixedChar = { ...char, powerstats: { ...char.powerstats } };
  const stats = ['intelligence', 'strength', 'speed', 'durability', 'power', 'combat'];
  stats.forEach((stat) => {
    const value = fixedChar.powerstats[stat];
    if (value === 'unknown' || value === null || value === undefined || isNaN(Number(value))) {
      fixedChar.powerstats[stat] = Math.floor(Math.random() * 99) + 1;
      if (friendOrFoe === 'enemy') {
        setEnemyUnknownData(true);
      } else {
        setCharUnknownData(true);
      }
    } else {
      fixedChar.powerstats[stat] = Number(value);
    }
  });

  return fixedChar; // Return the modified object
};
  const showCharacter = (char) => {
    setWinChar('');
    setWinEnemy('');
    setCharUnknownData(false);
    setEnemyUnknownData(false);
    setNewSearch(false);
    setTabPressed(true);
    setCharacterToShow(fixUnknownStats(char, 'friend'));
    setCharacterFight(char); // Inicialize character
    setActiveTabId(char.id);  
    loadEnemy();
  };
  
  const battle = useCallback(() => {
    if (!characterToShow || !enemyToShow) return;
    setActiveSearch(false);
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
            } else if (charPoints < enemyPoints){
              setWinEnemy('loser');
              setWinChar('winner'); 
              setCharScore(charScorePoints += 1);
            } 
          }
        }, index * 200); 
      });
    }, [characterToShow, enemyToShow]);
  
  return ( 
    <>
      <View style={styles.container}>
      {characters.length > 0 ? (
        <FightersAvailable fighters={characters} />) 
        : 
        (<View style={styles.logo_container}>
            <Image
              style={styles.logo}
              source={require('../../assets/icon.png')}
              resizeMode="cover"
            />
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  characters_card_container: {
    height:700,
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  score_container: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  score_text: {
    color: 'white',
    fontFamily: 'Orbitron-Medium',
    fontSize: 14,
  },
  score: {
    color: 'white',
    fontFamily: 'Orbitron-Medium',
    fontSize: 18,
    fontWeight: 'bold',
  }, 
  logo_container: {
    alignItems: 'center',
  },
  logo: {
    width: 400,
    height: 450,
    marginTop: 100,
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
});