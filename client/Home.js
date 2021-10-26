import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView, Button } from "react-native";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import Signup from "./Signup";

function logout() {
  fetch("https://rid-of-it.herokuapp.com/api/registration/logout", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
}

export default function Home({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  // console.log(data);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      fetch("https://rid-of-it.herokuapp.com/api/registration/")
        .then((response) => response.json())
        .then((data) => {
          console.log(data, "28");
          setData(data);
          if (data.user !== "none") {
            navigation.navigate("Dashboard");
          }
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    }
    return () => {
      isMounted = false;
    };
  }, []);

  console.log(data.user, "35");

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Rid of It</Text>
      <View style={styles.buttons}>
        <View style={styles.button}>
          <Text
            style={styles.buttonText}
            onPress={() => navigation.navigate("Login")}
          >
            Login
          </Text>
        </View>
        <View style={styles.button}>
          <Text
            style={styles.buttonText}
            onPress={() => navigation.navigate("Signup")}
          >
            Signup
          </Text>
        </View>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#CAEBF2",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    fontSize: 60,
    color: "#FF3B3F",
    paddingTop: 50,
  },
  buttons: {
    flex: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  button: {
    width: "70%",
    height: "17%",
    borderRadius: 25,
    backgroundColor: "#FF3B3F",
    color: "#FF3B3F",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 25,
  },
});
