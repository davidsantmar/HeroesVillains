import { View, Text,Image, StyleSheet, ScrollView, Pressable } from 'react-native';
import { CharacterCard } from './CharacterCard';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export function FightersAvailable({ fighters }) {
    const router = useRouter();
    const [characterSelected, setCharacterSelected] = useState(false);
    const [selectedFighter, setSelectedFighter] = useState(null);    
    const onSelectFighter = (fighter) => {
      setCharacterSelected(true); 
      setSelectedFighter(fighter);
      router.push({
        pathname: '/characterPage',
        params: { fighter: JSON.stringify(fighter), fighters: JSON.stringify(fighters) } // Expo Router requiere serialización para parámetros complejos
      });
    };
  return (
    <>
    <ScrollView style={styles.container}>
        {!characterSelected ? (
        <View style={styles.cards_container}>
            {fighters.map((fighter, id) => (
                  <View key={id}>
                    <Pressable
                    style={styles.card}
                    onPress={() => onSelectFighter(fighter)}
                    >
                        <Image
                            source={{uri: fighter.image.url || 'https://via.placeholder.com/90x110'}} 
                            alt={fighter.name} 
                            style={styles.picture} 
                        />
                        <View style={styles.fighter_name_container}>
                          <Text style={styles.fighter_name}>{fighter.name}</Text>
                        </View>
                    </Pressable>
                  </View>
            ))}
        </View> ) : (
          <View>
            
          </View>
        )}
    </ScrollView>
    </>
  );
}   

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
  cards_container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 20,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  picture: {
    resizeMode: 'cover',
    borderRadius: 10,
    width: 160,
    height: 190,
  },
  fighter_name_container: {
    width: 160, 
    alignItems: 'center'
  },
  fighter_name: {
    color: 'black',
    fontFamily: 'Orbitron-Medium',
    fontSize: 18,
    marginTop: 5,
  }
});