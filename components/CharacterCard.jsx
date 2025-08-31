import { View, StyleSheet, Image, Text, ScrollView } from "react-native";
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
        <View style={styles.card}>
          <View style={styles.container_file_name}>
            <View style={styles.file_name}>
              <Text style={styles.file_name_text}>{character.name || "Unknown"}</Text>
            </View>
          </View>
          <View style={styles.image_container}>
            <Image style={styles.clip} source={require('../assets/clp.png')} />
            <View style={styles.picture_border}>
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
            </View>
          </View>
          <View style={styles.char_data}>
            <Text style={styles.data_title}>Personal Information</Text>
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
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 250
  },
  card: {
    width: 400,
    backgroundColor: "rgba(161, 130, 98, 1)",
    borderRadius: 10,
    marginTop: 30,
  },
  container_file_name: {
    flexDirection: "row",
    alignItems: "center",
    height: 45,
    width: 400,
    backgroundColor: 'black',
  },
  file_name: {
    height: 50,
    backgroundColor: "#ccc",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5
  },
  file_name_text: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'ShadowsIntoLightTwo'
  },
  image_container: {
    justifyContent: "flex-start",
    marginLeft: 230,
    marginTop: -40,
    transform: [{ rotate: "2deg" }],
    zIndex: 20
  },
  picture_border: {
    backgroundColor: "white",
    width: 160,
    height: 190,
    marginTop: -60,
  },
  clip: {
    zIndex: 2,
    width: 130,
    height: 120,
    marginTop: -10,
  },
  picture: {
    resizeMode: "cover",
    width: 140,
    height: 170,
    marginLeft: 10,
    marginTop: 10,
  },
  char_data: {
    flexDirection: "column",
    padding: 10,
    marginTop: -200
  },
  data_title: {
    fontSize: 20,
    fontWeight: "bold",
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
    fontStyle: "italic",
    marginBottom: 10,
    fontFamily: 'ShadowsIntoLightTwo',
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
  button: {
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2596be",
    padding: 5,
    marginRight: 10,
    marginTop: 10,
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
  logo: {
    width: 40,
    height: 40,
    marginLeft: 10,
  },
  logo_text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 10,
    fontFamily: 'Orbitron-Medium',
  },
});