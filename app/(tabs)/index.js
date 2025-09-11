import { useEffect, useState } from "react";
import { Main } from "../../components/Main";
import { Intro } from "../../components/Intro";
import { Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() { 
  const [visible, setVisible] = useState(false);  
  const activateModal = () => {
    const timer = setTimeout(() => { 
      setVisible(false)
      }, 8000); // Ajusta el tiempo 
    return () => clearTimeout(timer); // Limpia el temporizador al desmontar 
  }
  const checkIntro = async () => {
    const hasSeenIntro = await AsyncStorage.getItem("hasSeenIntro");
    if (hasSeenIntro === "false"){
      setVisible(true);
      activateModal();
    }
  }
  useEffect(() => {
      checkIntro();
  }, [])
    return (
    <> 
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <Intro />
      </Modal>
      <Main /> 
    </> 
)}
