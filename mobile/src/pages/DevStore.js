import React, { useState, useEffect } from "react";
import {
  View,
  AsyncStorage,
  KeyboardAvoidingView,
  Platform,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import {
  requestPermissionsAsync,
  getCurrentPositionAsync
} from "expo-location";
import FlashMessage, { showMessage } from "react-native-flash-message";

import api from "../services/api";

import logo from "../assets/logo.png";

function DevStore({ navigation }) {
  const [devs, setDevs] = useState("");
  const [email, setEmail] = useState("");
  const [techs, setTechs] = useState("");
  const [currentRegion, setCurrentRegion] = useState(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  useEffect(() => {
    async function loadInitialPosition() {
      const { granted } = await requestPermissionsAsync();

      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true
        });

        const { latitude, longitude } = coords;

        console.log("Initial Location: " + latitude + "," + longitude);

        setLatitude(latitude);
        setLongitude(longitude);

        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04
        });
      }
    }
    loadInitialPosition();
  }, []);

  useEffect(() => {
    AsyncStorage.getItem("user").then(user => {
      if (user) {
        navigation.navigate("List");
      }
    });
  }, []);

  async function handleSubmit(data) {
    if (email && techs) {
      try {
        const response = await api.post("/devs", {
          github_username: email,
          latitude,
          longitude,
          techs
        });

        if (response.status != 200) {
          showMessage({
            message: "Error on store information! Please try again.",
            type: "danger",
            icon: "danger"
          });
        }

        const { _id } = response.data;
        setDevs(response.data);
        await AsyncStorage.setItem("user", _id);
        await AsyncStorage.setItem("techs", techs);

        showMessage({
          message: "Dados salvos com sucesso!",
          type: "success",
          icon: "success"
        });

        // auto navigate back to devlist
        setTimeout(() => {
          navigation.navigate("DevList", { devs });
        }, 2200);
      } catch (error) {
        showMessage({
          message: "Error on store information! Please try again.",
          type: "danger",
          icon: "danger"
        });
      }
    } else {
      showMessage({
        message: "Preencha os dados corretamente!",
        type: "danger",
        icon: "danger"
      });
    }
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Image source={logo} />

      <View style={styles.form}>
        <Text style={styles.label}>Usuário do Github *</Text>
        <TextInput
          style={styles.input}
          placeholder="Usuário do Github"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Tecnologias *</Text>
        <TextInput
          style={styles.input}
          placeholder="Tecnologias"
          placeholderTextColor="#999"
          autoCapitalize="words"
          autoCorrect={false}
          value={techs}
          onChangeText={setTechs}
        />

        <Text style={styles.label}>Latitude *</Text>
        <TextInput
          style={styles.input}
          placeholder="Latitude"
          placeholderTextColor="#999"
          autoCapitalize="words"
          autoCorrect={false}
          value={`${latitude}`}
          onChangeText={setLatitude}
          returnKeyType={Platform.OS === "ios" ? "done" : "next"}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Longitude *</Text>
        <TextInput
          style={styles.input}
          placeholder="Longitude"
          placeholderTextColor="#999"
          autoCapitalize="words"
          autoCorrect={false}
          value={`${longitude}`}
          onChangeText={setLongitude}
          returnKeyType={Platform.OS === "ios" ? "done" : "next"}
          keyboardType="numeric"
        />

        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
      <FlashMessage position="top" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  form: {
    alignSelf: "stretch",
    paddingHorizontal: 30,
    paddingVertical: 40,
    marginTop: 0
  },

  label: {
    fontWeight: "bold",
    color: "#444",
    marginBottom: 8
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#444",
    height: 44,
    marginBottom: 20,
    borderRadius: 2
  },

  button: {
    height: 42,
    backgroundColor: "#7D40E7",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16
  }
});

export default DevStore;
