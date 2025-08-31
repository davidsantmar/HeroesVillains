import { View, StyleSheet, Text, ScrollView } from 'react-native';
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
          <View style={styles.image_container}>
            <View style={styles.picture_border}>
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
            </View>
          </View>
          <View style={styles.char_powers}> 
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
          </View>
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
    marginTop: 55,
    padding: 15,
  },
  image_container: {
    alignItems: 'center',
  },
  picture_border: {
    backgroundColor: 'white',
    width: 160,
    height: 190,
    marginTop: -60,
  },
  picture: {
    resizeMode: 'cover',
    width: 140,
    height: 170,
    marginLeft: 10,
    marginTop: 10,
  },
  data_title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Orbitron-Medium',
  },
  info_title: {
    fontFamily: 'Orbitron-Medium',
    fontSize: 17,
    marginBottom: 5,
  },
  info: {
    color: 'black',
    fontSize: 18,
    fontFamily: 'ShadowsIntoLightTwo',
    marginBottom: 10,
  },
  char_powers: {
    backgroundColor: 'white',
    flexDirection: 'column',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
});