import { View, StyleSheet, Image, Text, ScrollView, ImageBackground } from "react-native";
import { Alert } from 'react-native';
import { useFonts } from 'expo-font';
import { useEffect, useState} from "react";

export function CharacterCard({ item }) {
  const [character, setCharacter] = useState(item);
  const [loaded, error] = useFonts({  //to load and use font
    'ShadowsIntoLightTwo': require('../assets/fonts/ShadowsIntoLightTwo.ttf'), 
  });
  const [loaded1, error1] = useFonts({  //to load and use font
    'Orbitron-Medium': require('../assets/fonts/Orbitron-Medium.ttf'), 
  });
  useEffect(() => {
    setCharacter(item);
  }, [item]);
  if (!loaded || !loaded1) {
    return null;
  }
  if (!character) {
    return null;
  }
  return (
    <ScrollView>
      <View style={styles.container}>
        <ImageBackground style={styles.card}  source={require ('../assets/screen-back.png')}>
          <Text style={styles.name_title}>{character.name}</Text>
              <Image
                style={styles.picture}
                source={{
                  uri: character.image?.url || "https://via.placeholder.com/90x110",
                }}
                onError={(error) => {
                  console.log("Image load error:", error.nativeEvent.error);
                  Alert.alert("Error", "Failed to load character image");
                }}
                defaultSource={{ uri: "https://via.placeholder.com/90x110" }}
              />
        
          <View style={styles.char_data}>
            <Text style={styles.info_title}>Name:</Text>
            <Text style={styles.short_info}> {character.biography?.["full-name"] || "Unknown"}</Text>
            <Text style={styles.info_title}>Height:<Text style={styles.info}> {character.appearance?.height?.[1] !== "0 cm" ? character.appearance?.height?.[1] || "Unknown" : "Unknown"}</Text></Text>
            <Text style={styles.info_title}>Weight:<Text style={styles.info}> {character.appearance?.weight?.[1] !== "0 kg" ? character.appearance?.weight?.[1] || "Unknown" : "Unknown"}</Text></Text>
            <Text style={styles.info_title}>Eye color:<Text style={styles.info}> {character.appearance?.["eye-color"] !== "-" ? character.appearance?.["eye-color"] || "Unknown" : "Unknown"}</Text></Text>
            <Text style={styles.info_title}>Hair color:<Text style={styles.info}> {character.appearance?.["hair-color"] !== "-" ? character.appearance?.["hair-color"] || "Unknown" : "Unknown"}</Text></Text>
            <Text style={styles.info_title}>Place of Birth:</Text>
            <Text style={styles.short_info}> {character.biography?.["place-of-birth"] !== "-" ? character.biography?.["place-of-birth"] || "Unknown" : "Unknown"}</Text>
            <Text style={styles.info_title}>Relatives:<Text style={styles.info}> {character.connections?.relatives !== "-" ? character.connections?.relatives || "Unknown" : "Unknown"}</Text></Text>
            <View style={styles.char_powers}>
              <Text style={styles.data_title}>Powerstats</Text>
              <Text style={styles.info_title}>Intelligence:<Text style={styles.info}> {character.powerstats?.intelligence !== "null" ? character.powerstats?.intelligence || "Unknown" : "Unknown"}</Text></Text>
              <Text style={styles.info_title}>Strength:<Text style={styles.info}> {character.powerstats?.strength !== "null" ? character.powerstats?.strength || "Unknown" : "Unknown"}</Text></Text>
              <Text style={styles.info_title}>Speed:<Text style={styles.info}> {character.powerstats?.speed !== "null" ? character.powerstats?.speed || "Unknown" : "Unknown"}</Text></Text>
              <Text style={styles.info_title}>Durability:<Text style={styles.info}> {character.powerstats?.durability !== "null" ? character.powerstats?.durability || "Unknown" : "Unknown"}</Text></Text>
              <Text style={styles.info_title}>Power:<Text style={styles.info}> {character.powerstats?.power !== "null" ? character.powerstats?.power || "Unknown" : "Unknown"}</Text></Text>
              <Text style={styles.info_title}>Combat:<Text style={styles.info}> {character.powerstats?.combat !== "null" ? character.powerstats?.combat || "Unknown" : "Unknown"}</Text></Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 260,
    justifyContent: 'center'
  },
  card: {
    width: 370,
    borderRadius: 10,  
    marginTop: 40,
    opacity: 0.85,
    overflow: 'hidden' //para que funcione borderRadius en ImageBackground
  }, 
  picture: {
    resizeMode: "cover",
    width: 140,
    height: 170,
    marginLeft: 220,
    borderRadius: 10  
  },
  char_data: {
    flexDirection: "column",
    padding: 10,
    marginTop: -170
  },
  name_title: {
    fontSize: 30,
    marginBottom: 10,
    fontFamily: 'Orbitron-Medium',
    marginLeft: 10,
    marginTop: 10
  },
   data_title: {
    fontSize: 20,
    marginBottom: 10,
    fontFamily: 'Orbitron-Medium',
  },
  info_title: {
    fontFamily: 'Orbitron-Medium',
    fontSize: 17,
    marginBottom: 5
  },
  short_info: {
    color: "black",
    fontSize: 18,
    marginBottom: 10,
    fontFamily: 'ShadowsIntoLightTwo',
    width: 200
  },
  info: {
    color: "black",
    fontSize: 18,
    fontFamily: 'ShadowsIntoLightTwo',
    marginBottom: 10,
  },
  char_powers: {
    backgroundColor: "white",
    flexDirection: "column",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  
  logo: {
    width: 40,
    height: 40,
    marginLeft: 10,
  },
  logo_text: {
    fontSize: 18,
    color: 'white',
    marginRight: 10,
    fontFamily: 'Orbitron-Medium',
  },
});