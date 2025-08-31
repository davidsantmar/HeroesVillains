import { StyleSheet } from 'react-native';
import { Main } from './components/Main';
import { View } from 'react-native';

export default function App() {
  return (
    <>
        <View style={styles.container}>
          <Main />
        </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: 'black'
  },
});
