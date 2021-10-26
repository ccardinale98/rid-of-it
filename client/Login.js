import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  TextInput,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import Home from "./Home";
import Dashboard from "./Dashboard";
import Profile from "./Profile";

export default function Login({ navigation }) {
  const { control, handleSubmit, errors, reset } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function loginUser(user) {
    console.log(user);
    if (user.message == "Login Succesful") {
      navigation.navigate("Dashboard");
    } else {
      console.log("no user");
    }
  }

  function submit(data) {
    console.log(data);

    fetch("https://rid-of-it.herokuapp.com/api/registration/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    })
      .then((response) => response.json())
      .then((user) => loginUser(user))
      .catch((err) => console.log(err));
  }

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.backDiv}>
        <Button title="Home" onPress={() => navigation.navigate("Home")} />
      </View>
      <Text style={styles.title}>Login</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange }, value }) => (
          <TextInput
            style={styles.text}
            placeholder="Email"
            onChangeText={(value) => onChange(value)}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange }, value }) => (
          <TextInput
            style={styles.text}
            placeholder="Password"
            onChangeText={(value) => onChange(value)}
          />
        )}
      />
      <Button title="Login" onPress={handleSubmit((data) => submit(data))} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#CAEBF2",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 50,
    marginBottom: 30,
    color: "#FF3B3F",
  },
  text: {
    fontSize: 20,
    backgroundColor: "#FFF",
    width: 250,
    height: 40,
    borderRadius: 25,
    marginBottom: 10,
    paddingLeft: 20,
  },
  backDiv: {
    position: "absolute",
    top: 50,
    left: 10,
  },
});
