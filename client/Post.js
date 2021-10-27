import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  TextInput,
  Modal,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { RNCamera } from "react-native-camera";
import { Icon } from "react-native-elements";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import Home from "./Home";
import Dashboard from "./Dashboard";
import Profile from "./Profile";

export default function Post({ navigation }) {
  const { control, handleSubmit, errors, reset } = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
    },
  });

  function submit(data) {
    console.log(data);
  }

  return (
    <SafeAreaView style={styles.main}>
      <Button
        title="Dashboard"
        onPress={() => navigation.navigate("Dashboard")}
      />
      <Text>Create a Listing</Text>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange }, value }) => (
          <TextInput
            style={styles.text}
            placeholder="Item Name"
            onChangeText={(value) => onChange(value)}
          />
        )}
      />
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange }, value }) => (
          <TextInput
            style={styles.text}
            placeholder="Item Description"
            onChangeText={(value) => onChange(value)}
          />
        )}
      />
      <Controller
        control={control}
        name="price"
        render={({ field: { onChange }, value }) => (
          <TextInput
            style={styles.text}
            placeholder="Price"
            onChangeText={(value) => onChange(value)}
          />
        )}
      />
      <Button title="Post" onPress={handleSubmit((data) => submit(data))} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: "#CAEBF2",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
});
