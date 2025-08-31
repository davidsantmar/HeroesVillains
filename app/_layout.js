import { Stack, usePathname } from 'expo-router';
import { View, StyleSheet, Image, Text, StatusBar } from 'react-native';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';

export default function Layout () {
  const pathname = usePathname();
  const [loaded, error] = useFonts({  //to load and use font
    'Orbitron-Medium': require('../assets/fonts/Orbitron-Medium.ttf'), 
  });
  useEffect(() => { //hack to make StatusBar light
    setTimeout(() => {
      StatusBar.setBarStyle('light-content');
    }, 0);
  }, [pathname]);
  return (
    <>
      <View style={styles.container}>
        <Stack 
          screenOptions={{
            headerStyle: { backgroundColor:'black' },
            headerTitle: "",
            headerShown: false,
          }}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  logo:{
    width: 50,
    height: 44  
  },
  logo_text: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'Orbitron-Medium'
  }
});