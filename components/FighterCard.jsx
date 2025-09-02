import { View, StyleSheet, Text, ScrollView, ImageBackground } from 'react-native';
import { Alert } from 'react-native';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { FilterImage } from 'react-native-svg/filter-image';
import { NumberAnimation } from './NumberAnimation';

export function FighterCard({ character, winlose}) {
  const [grayscale, setGrayscale] = useState(0);
  const [loaded] = useFonts({
    'ShadowsIntoLightTwo': require('../assets/fonts/ShadowsIntoLightTwo.ttf'),
    'Orbitron-Medium': require('../assets/fonts/Orbitron-Medium.ttf'),
  });
  useEffect(() => { 
    setGrayscale(0);
    let timer;
    if (winlose === 'loser') {
      timer = setTimeout(() => {
        setGrayscale(1);
      }, 3000);
    } else {
      setGrayscale(0);
    }
    return () => clearTimeout(timer);
  }, [winlose]);
  
  if (!character || !character.powerstats || !character.results) {
    return null;
  }
  const renderStat = (statName, statValue, result, animationFlag) => {
    const displayResult = result || '';
    if (animationFlag) {
      return (
        <Text style={styles.info_title}>
          {statName}: <NumberAnimation></NumberAnimation>
        </Text>
      );
    }
    return (
      <Text style={styles.info_title}>
        {statName}: <Text style={styles.info}>{statValue} {displayResult}</Text>
      </Text>
    );
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.card}>
              <FilterImage
                style={[styles.picture, { filter: `grayscale(${grayscale})` }]}
                source={{
                  uri: character.image || 'https://via.placeholder.com/90x110',
                }}
                onError={(error) => {
                  console.log('Image load error:', error.nativeEvent.error);
                  Alert.alert('Error', 'Failed to load character image');
                }}
                defaultSource={{ uri: 'https://via.placeholder.com/90x110' }}
              />
          <ImageBackground style={styles.char_powers} source={require ('../assets/screen-back.png')}> 
            {character.unknownData ? <Text style={styles.data_title}>Powerstats ❓</Text> : <Text style={styles.data_title}>Powerstats</Text>}
            {renderStat(
              'Intelligence',
              character.powerstats.intelligence_data[0].intelligence,
              character.results.intelligence_data,
              character.powerstats.intelligence_data[1].animation
            )}
            {renderStat(
              'Strength',
              character.powerstats.strength_data[0].strength,
              character.results.strength_data,
              character.powerstats.strength_data[1].animation
            )}
            {renderStat(
              'Speed',
              character.powerstats.speed_data[0].speed,
              character.results.speed_data,
              character.powerstats.speed_data[1].animation
            )}
            {renderStat(
              'Durability',
              character.powerstats.durability_data[0].durability,
              character.results.durability_data,
              character.powerstats.durability_data[1].animation
            )}
            {renderStat(
              'Power',
              character.powerstats.power_data[0].power,
              character.results.power_data,
              character.powerstats.power_data[1].animation
            )}
            {renderStat(
              'Combat',
              character.powerstats.combat_data[0].combat,
              character.results.combat_data,
              character.powerstats.combat_data[1].animation
            )}
          </ImageBackground>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 250,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  card: {
    borderRadius: 10,
    marginTop: 20,
    padding: 15,
  },
  picture: {
    resizeMode: 'cover',
    width: 170,
    height: 190,
    borderRadius: 10
  },
  data_title: {
    fontSize: 14,
    marginBottom: 10,
    fontFamily: 'Orbitron-Medium',
    color: 'black'
  },
  info_title: {
    fontFamily: 'Orbitron-Medium',
    fontSize: 12,
    marginBottom: 5,
    color: 'black'
  },
  info: {
    color: 'black',
    fontSize: 12,
    fontFamily: 'ShadowsIntoLightTwo',
    marginBottom: 10,
  },
  char_powers: {
    backgroundColor: 'black',
    opacity: 0.65,
    flexDirection: 'column',
    padding: 5,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
    width: 170,
    overflow: 'hidden', //para que funcione borderRadius en ImageBackground
    borderRadius: 10
  },
});