import { View, Text,Image, StyleSheet, ScrollView, Pressable, ImageBackground } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';

export function FightersAvailable({ fighters }) {
    const router = useRouter();
    const [characterSelected, setCharacterSelected] = useState(false);
    const [selectedFighter, setSelectedFighter] = useState(null);    
    const [select, setSelect] = useState(null);
    const [fightersMap, setFightersMap] = useState([]);
    const [connectingText, setConnectingText] = useState('Connecting with deck...');
    const [holo, setHolo] = useState(null);
    const [horizontalView, setHorizontalView] = useState(false); 
    
    
    useEffect(() => {
      return () => {
        if (select) {
          console.log('Liberando select');
          select.unloadAsync();
        }
        if (holo) {
          console.log('Liberando holo');
          holo.unloadAsync();
        }
      };
    }, [select, holo]);

    useEffect(() => {
      const timer = setTimeout(() => {
        playHolo(setHolo);
      }, 1500); // 1.5 segundos

      return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
      const timer = setTimeout(() => {
        setConnectingText('');
      }, 1500);
      return () => clearTimeout(timer);
    }, [connectingText]);

    useEffect(() => {
      if (fighters.length > 1){
        setHorizontalView(true);
      }else {
        setHorizontalView(false);
      }
      const timer = setTimeout(() => {
        setFightersMap(fighters); // Actualizamos fightersMap con los datos de fighters después de 6 segundos
      }, 5350);
      return () => clearTimeout(timer); // Limpiamos el temporizador al desmontar
    }, [fighters]);

    async function playSelect() {
      console.log('Cargando select');
      try {
        // Carga el sonido
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/sounds/select.mp3')
        );
        
          setSelect(sound)
          console.log('Reproduciendo select');
      
        // Reproduce el sonido inmediatamente después de crearlo
        await sound.playAsync();
        
      } catch (error) {
        console.error('Error al reproducir el sonido:', error);
      }
    }
    async function playHolo() {
      console.log('Cargando holo');
      try {
        // Carga el sonido
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/sounds/holo.mp3')
        );
          setHolo(sound);
          console.log('Reproduciendo holo');
        // Reproduce el sonido inmediatamente después de crearlo
        await sound.playAsync();
      } catch (error) {
        console.error('Error al reproducir el holo:', error);
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
        <ScrollView
          horizontal={horizontalView}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cards_container}
        >
          {fightersMap.length > 0 ? (
            fightersMap.map((fighter, id) => (
              <ImageBackground key={id} style={styles.fighter_container} source={require ('../assets/screen-back.png')}>
                <Pressable style={styles.card} onPress={() => onSelectFighter(fighter)}>
                  <Image
                    source={{ uri: fighter.image?.url || 'https://via.placeholder.com/90x110' }}
                    alt={fighter.name}
                    style={styles.picture}
                  />
                  <View style={styles.fighter_name_container}>
                    <Text style={styles.fighter_name}>{fighter.name}</Text>
                  </View>
                </Pressable>
              </ImageBackground>
            ))
          ) : (
            <View style={styles.empty_container}>
              <Text style={styles.empty_text}>{connectingText}</Text>
            </View>
          )}
        </ScrollView>
      ) : (
        <View style={styles.empty_container}>
        </View>
      )}
    </ScrollView>
    </>
  );
}   

const styles = StyleSheet.create({
  container: {
    marginTop: 110,
    marginLeft: 15,
    marginRight: 15,
  },
  cards_container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  empty_container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  empty_text: {
    fontFamily: 'Orbitron-Medium',
    color: '#2596be',
    opacity: 0.75,
    fontSize: 20
  },
  fighters_container: {
    alignItems: 'center',
    marginTop: 20
  },
  fighter_container: {
    borderRadius: 10,
    overflow: 'hidden', //para que funcione borderRadius en ImageBackground
    opacity: 0.85,
    width: 190,
    marginRight: 10,
    marginTop: 10,
    height: 370
  },
  card: {
    opacity: 0.85,
    borderRadius: 10,
    marginTop: 5,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  picture: {
    resizeMode: 'cover',
    borderRadius: 10,
    width: 180,
    height: 300,
  },
  fighter_name_container: {
    width: 150, 
    alignItems: 'center',
  },
  fighter_name: {
    color: 'black',
    fontFamily: 'Orbitron-Medium',
    fontSize: 16,
    opacity: 0.8,
    marginTop: 10
  }
});