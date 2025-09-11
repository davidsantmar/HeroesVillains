import { useEffect, useRef } from "react";
import { StyleSheet, Text, ImageBackground, Animated, Dimensions } from "react-native";

export function Intro ({ show }) {
  const { height } = Dimensions.get("window");
  const translateY = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: -height, // sube hasta perderse por arriba
      duration: 18000,  // velocidad (16 segundos)
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <ImageBackground
      style={styles.container}
      source={require("../assets/gifs/galaxy.gif")}
      resizeMode="cover"
    >
      <Animated.View
        style={[
          styles.intro_container,
          { transform: [{ translateY }] }
        ]}
      >
        <Text style={styles.intro_text}>You're entering the multiverse...</Text>
        <Text style={styles.intro_text}>
          In that universe you can search for a character and start a battle.....
        </Text>
        <Text style={styles.intro_text}>Maybe to save the world...</Text>
        <Text style={styles.intro_text}>Maybe to destroy it......</Text>
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // ocupa toda la pantalla
  },
  intro_container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  intro_text: {
    fontFamily: "Orbitron-Medium",
    fontSize: 20,
    color: "white",
    marginBottom: 10,
    textAlign: "center",
  },
});
