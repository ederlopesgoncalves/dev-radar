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
  StyleSheet,
  Button
} from "react-native";
import {
  requestPermissionsAsync,
  getCurrentPositionAsync
} from "expo-location";
import FlashMessage, { showMessage } from "react-native-flash-message";

import api from "../services/api";

import logo from "../assets/logo.png";
import { getOrientationAsync } from "expo/build/ScreenOrientation/ScreenOrientation";

function DevUpdate({ navigation }) {
  const _id = navigation.getParam("_id");

  console.log(_id);

  const [devs, setDevs] = useState([]);
  const [email, setEmail] = useState("");
  const [techs, setTechs] = useState("");
  const [currentRegion, setCurrentRegion] = useState(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  useEffect(() => {
    async function loadInitial() {
      const response = await api.get("/devs/" + _id);

      console.log("find user");
      console.log(response.data);
      console.log("data:::::::::::");
      console.log(response.data[0].github_username);
      console.log(response.data[0].name);

      setEmail(response.data[0].github_username);
      setTechs(response.data[0].techs.join(", "));
      setLatitude(response.data[0].location.coordinates[1]);
      setLongitude(response.data[0].location.coordinates[0]);
    }
    loadInitial();
  }, []);

  async function handleSubmit(data) {
    if (email && techs) {
      const response = await api.put("/devs", {
        github_username: email,
        latitude,
        longitude,
        techs
      });

      const { _id } = response.data;

      await AsyncStorage.setItem("user", _id);
      await AsyncStorage.setItem("techs", techs);

      setDevs(response.data);

      showMessage({
        message: "Dados salvos com sucesso!",
        type: "success",
        icon: "success"
      });

      setTimeout(() => {
        navigation.navigate("DevList", { devs });
      }, 2200);
      
    } else {
      showMessage({
        message: "Preencha os dados corretamente!",
        type: "danger",
        icon: "danger"
      });
    }
  }

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

      showMessage({
        message: "Localização atualizada!",
        type: "info",
        icon: "info",
        backgroundColor: "#7D40E7"
      });
    }
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Image source={logo} />

      <View style={styles.form}>
        <Text style={styles.label}>Usuário do Github *</Text>
        <TextInput
          style={styles.inputDisabled}
          placeholder="Usuário do Github"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
          editable={false}
          selectTextOnFocus={false}
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

        <TouchableOpacity onPress={loadInitialPosition} style={styles.button}>
          <Text style={styles.buttonText}>Update to Current Location</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSubmit} style={styles.updateButton}>
          <Text style={styles.buttonText}>Update</Text>
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

  inputDisabled: {
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#444",
    height: 44,
    marginBottom: 20,
    borderRadius: 2,
    backgroundColor: "#e6e6e6"
  },

  button: {
    height: 42,
    backgroundColor: "#7D40E7",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30
  },

  updateButton: {
    height: 42,
    backgroundColor: "#7D40E7",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    marginTop: 20
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16
  }
});

export default DevUpdate;
