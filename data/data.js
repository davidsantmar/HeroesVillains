import { Alert } from 'react-native';

export async function getCharacterByName(name) {
  if (!name.trim()) {
    Alert.alert('Error', 'Please type character name');
    return null;
  }
  try {
    const response = await fetch(`https://superheroapi.com/api/aa3f9dccda547a6ebd0d620ad0eb1e5c/search/${name}`);
    const data = await response.json();
    if (data.response === 'success') {
      return data.results.map(item => ({
        ...item,
        image: {
          url: item.image?.url || 'https://via.placeholder.com/90x110', // Imagen por defecto
        },
      }));
    } else {
      Alert.alert('Error', 'No character found with that name');
      return null;
    }
  } catch (error) {
    console.error('Error fetching character:', error);
    Alert.alert('Error', 'Failed to fetch character');
    return null;
  }
}

export async function getCharacterOfTheDay() {
    const id = Math.floor(Math.random() * (723) + 1);
    try {
      const response = await fetch(`https://superheroapi.com/api/aa3f9dccda547a6ebd0d620ad0eb1e5c/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch character');
    }
  
}
