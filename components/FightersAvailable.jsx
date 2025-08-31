import { View, Text,Image, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';

export function FightersAvailable({ fighters }) {
    const router = useRouter();
    const [characterSelected, setCharacterSelected] = useState(false);
    const [selectedFighter, setSelectedFighter] = useState(null);    
    const [select, setSelect] = useState(null);
    useEffect(() => {
      return () => {
        if (select) {
          console.log('Liberando select');
          select.unloadAsync();
        }
      };
    }, [select]);
    
    async function playSelect() {
      console.log('Cargando select');
      try {
        // Carga el sonido
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/sounds/select.mp3')
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
    const onSelectFighter = (fighter) => {
      playSelect();
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
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  picture: {
    resizeMode: 'cover',
    borderRadius: 10,
    width: 160,
    height: 190,
  },
  fighter_name_container: {
    width: 150, 
    alignItems: 'center'
  },
  fighter_name: {
    color: 'black',
    fontFamily: 'Orbitron-Medium',
    fontSize: 16,
    marginTop: 5,
  }
});