import { Tabs } from "expo-router";
import { BattleIcon, HomeIcon } from "../../components/Icons";
import { Text, Image, StyleSheet, View } from "react-native";
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
          title: '',
          tabBarIcon: ({ color }) => <View style={styles.icon_container}><HomeIcon color={color} /></View>,
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
          title: '',
          tabBarIcon: ({ color }) => <View style={styles.icon_container}><BattleIcon color={color} /></View>,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 40,
    height: 40,
    marginLeft: 15,
  },
  logo_text: {
    fontSize: 11,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Orbitron-Medium',
    marginRight: 20
  },
  icon_container: {
    marginTop: 20
  }
});