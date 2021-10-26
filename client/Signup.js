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
import { Icon } from "react-native-elements";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import Home from "./Home";
import Dashboard from "./Dashboard";
import Profile from "./Profile";

export default function Signup({ navigation }) {
  const [modal1Visible, setModal1Visible] = useState();
  const [modal2Visible, setModal2Visible] = useState();
  const { control, handleSubmit, errors, reset } = useForm({
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    setModal1Visible(false);
    setModal2Visible(false);
  }, []);

  function loginUser(user) {
    console.log(user);
    navigation.navigate("Dashboard");
  }

  function submit(data) {
    console.log(data);

    fetch("https://rid-of-it.herokuapp.com/api/users/")
      .then((response) => response.json())
      .then((users) => {
        console.log(users, "38");

        var userEmails = [];
        var userNames = [];

        for (var i = 0; i < users.length; i++) {
          userEmails.push(users[i].email);
        }

        for (var i = 0; i < users.length; i++) {
          userNames.push(users[i].user_name);
        }

        if (
          userEmails.includes(data.email) ||
          userNames.includes(data.username)
        ) {
          console.log("user already exists");
          setModal1Visible(true);
        } else {
          if (
            data.password == data.confirmPassword &&
            data.email !== "" &&
            data.password !== "" &&
            data.username !== ""
          ) {
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
            setModal2Visible(true);
          }
        }
      })
      .catch((err) => console.log(err));
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modal1Visible}
        onRequestClose={() => setModal1Visible(!modal1Visible)}
        style={styles.modal}
      >
        <SafeAreaView style={styles.modalDiv}>
          <View style={styles.icon}>
            <Icon
              name="times"
              type="font-awesome"
              size={30}
              onPress={() => setModal1Visible(false)}
            />
          </View>
          <Text style={styles.modalTitle}>User already exists!</Text>
          <Icon
            name="frown-o"
            type="font-awesome"
            size={90}
            color="#FF3B3F"
            marginTop={20}
          />
        </SafeAreaView>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modal2Visible}
        onRequestClose={() => setModal2Visible(!modal2Visible)}
        style={styles.modal}
      >
        <SafeAreaView style={styles.modalDiv}>
          <View style={styles.icon}>
            <Icon
              name="times"
              type="font-awesome"
              size={30}
              onPress={() => setModal2Visible(false)}
            />
          </View>
          <Text style={styles.modalTitle}>
            Either passwords didn't match or you left a field blank!
          </Text>
          <Icon
            name="frown-o"
            type="font-awesome"
            size={90}
            color="#FF3B3F"
            marginTop={20}
          />
        </SafeAreaView>
      </Modal>
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
    paddingRight: 20,
  },
  backDiv: {
    position: "absolute",
    top: 50,
    left: 10,
  },
  modal: {
    height: "100%",
    width: "100%",
  },
  modalDiv: {
    backgroundColor: "#A9A9A9",
    height: "40%",
    width: "70%",
    position: "absolute",
    top: "30%",
    left: "15%",
    borderRadius: 25,
    alignItems: "center",
    paddingRight: 10,
    paddingLeft: 10,
  },
  modalTitle: {
    width: "100%",
    textAlign: "center",
    fontSize: 20,
    color: "#FFF",
    paddingTop: 40,
    paddingRight: 10,
    paddingLeft: 10,
  },
  icon: {
    width: "100%",
    alignItems: "flex-end",
    paddingTop: 10,
    paddingRight: 10,
  },
});
