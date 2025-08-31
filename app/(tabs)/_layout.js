import { Tabs } from "expo-router";
import { BattleIcon, HomeIcon } from "../../components/Icons";
import { Text, Image, StyleSheet } from "react-native";
import { useFonts } from 'expo-font';


export default function TabsLayout() {
  const [loaded, error] = useFonts({
    'Orbitron-Medium': require('../../assets/fonts/Orbitron-Medium.ttf'), 
  });

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#2596be',
          height: 70,
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          opacity: 0.8,
        },
        headerStyle: { backgroundColor: "black" },
        headerTitle: "",
        headerBackButtonDisplayMode: "generic",
        headerBackTitle: "Inicio",
        headerBackTitleVisible: true,
        headerBackVisible: true,
        headerTintColor: "white",
        headerShown: true, // Cambiado a true para mostrar el encabezado
        tabBarActiveTintColor: '#2596be',
        tabBarInactiveTintColor: 'white',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
          headerLeft: () => (
            <Image
              style={styles.logo}
              source={require('../../assets/icon.png')}
              resizeMode="cover"
            />
          ),
          headerRight: () => <Text style={styles.logo_text}>Heroes & Villains</Text>,
        }}
      />
      <Tabs.Screen
        name="arena"
        options={{
          title: 'Search & Battle',
          tabBarIcon: ({ color }) => <BattleIcon color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
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
  button: {
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2596be',
    padding: 5,
    width: 140,
    marginTop: 20
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'Orbitron-Medium',
    marginLeft: 5,
  },
  input: {
    padding: 5,
    marginTop: 20,
    borderRadius: 5,
    height: 40,
    width: 240,
    backgroundColor: 'white',
    fontSize: 20,
    fontFamily: 'Orbitron-Medium',
  }
});