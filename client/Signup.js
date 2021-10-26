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
      <Text style={styles.title}>Signup</Text>
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
        name="username"
        render={({ field: { onChange }, value }) => (
          <TextInput
            style={styles.username}
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
            style={styles.password}
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
            style={styles.confirmPassword}
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
