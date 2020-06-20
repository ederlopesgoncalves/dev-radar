import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { ListItem } from "react-native-elements";
import api from "../services/api";

function DevList({ navigation }) {
  const [devs, setDevs] = useState([]);

  const isFocused = navigation.isFocused();

  if (isFocused) {
    loadInitial();
  }

  async function loadInitial() {
    const response = await api.get("/devs");
    setDevs(response.data);
  }

  useEffect(() => {
    async function loadInitial() {
      const response = await api.get("/devs");
      setDevs(response.data);
    }
    loadInitial();
  }, []);

  return (
    <View>
      <ScrollView>
      {devs.map((dev, i) => (
        <ListItem
          key={dev._id}
          leftAvatar={{ source: { uri: dev.avatar_url } }}
          title={dev.name}
          subtitle={dev.techs.join(", ")}
          bottomDivider
          chevron
          onPress={() => {
            navigation.navigate("DevUpdate", {
              _id: dev._id
            });
          }}
        />
      ))}

      <View style={styles.separator}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("DevStore");
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Cadastrar Novo</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 42,
    backgroundColor: "#7D40E7",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16
  },

  separator: {
    marginVertical: 15,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth
  }
});

export default DevList;
