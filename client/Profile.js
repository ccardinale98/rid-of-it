import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView, Button, Image } from "react-native";
import Home from "./Home";

export default function Profile({ navigation }) {
    const [current, getCurrent] = useState();
    const [user, getUser] = useState({});

    function currentUser() {
        fetch("https://rid-of-it.herokuapp.com/api/registration/")
          .then((response) => response.json())
          .then((user) => {
            console.log(user, "24");
            if (user.user == "none") {
              console.log("no user");
              navigation.navigate("Home");
            } else {
              console.log(user.user, "27");
              getCurrent(user.user);
              console.log(current, "30");
            }
          })
          .catch((err) => console.log(err));
    }

    useEffect(() => {
        currentUser();
        handleUserData();
    }, []);

    function handleUserData() {
        fetch(`https://rid-of-it.herokuapp.com/api/users/${current}`)
        .then((response) => response.json())
        .then((user) => {
          console.log(user, "35");
            getUser(user)
            if (user.message == "No User with this ID") {
                navigation.navigate("Home")
            }
        })
        .catch((err) => console.log(err));
    }

    return (
        <SafeAreaView>
            <View>
                <Image source={{uri: user.image}} style={{ width: 50, height: 50 }} />
                <View>
                    <Text>Username: {user.user_name}</Text>
                    <Text>Email: {user.email}</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}