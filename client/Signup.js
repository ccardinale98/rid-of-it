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
      usernameL: "",
      password: "",
      confirmPassword: "",
    },
  });

  function loginUser(user) {
    console.log(user);
    navigation.navigate("Dashboard");
  }

  function submit(data) {
    console.log(data);
    if (data.password == data.confirmPassword) {
      fetch("https://rid-of-it.herokuapp.com/api/registration/signup", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          user_name: data.username,
          password: data.password,
        }),
      })
        .then((response) => response.json())
        .then((user) => loginUser(user))
        .catch((err) => console.log(err));
    } else {
      console.log("passwords dont match");
    }
  }

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.backDiv}>
        <Button title="Home" onPress={() => navigation.navigate("Home")} />
      </View>
      <Text style={styles.title}>Signup</Text>
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
        name="username"
        render={({ field: { onChange }, value }) => (
          <TextInput
            style={styles.text}
            placeholder="Username"
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
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange }, value }) => (
          <TextInput
            style={styles.text}
            placeholder="Confirm Password"
            onChangeText={(value) => onChange(value)}
          />
        )}
      />
      <Button title="Signup" onPress={handleSubmit((data) => submit(data))} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#CAEBF2",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
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
