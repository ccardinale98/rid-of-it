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

export default function Login({ navigation }) {
  const { control, handleSubmit, errors, reset } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

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
      .then((data) => console.log(data))
      .catch((err) => console.log(err));

    navigation.navigate("Home");
  }

  return (
    <SafeAreaView style={styles.main}>
      <Text style={styles.title}>Login</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange }, value }) => (
          <TextInput
            style={styles.email}
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
            style={styles.password}
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
  },
  email: {
    fontSize: 30,
  },
  password: {
    fontSize: 30,
  },
});
