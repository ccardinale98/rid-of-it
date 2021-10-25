import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  ScrollView,
  FlatList,
  Image,
} from "react-native";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, getCurrent] = useState([]);

  function currentUser() {
    fetch("https://rid-of-it.herokuapp.com/api/registration/")
      .then((response) => response.json())
      .then((user) => {
        console.log(user, "24");
        if (user.user == "none") {
          console.log("no user");
        } else {
          console.log(user, "27");
          getCurrent(user);
          console.log(current, "30");
        }
      });
  }

  function getPosts() {
    fetch("https://rid-of-it.herokuapp.com/api/posts/")
      .then((response) => response.json())
      .then((data) => {
        console.log(data, "39");
        setData(data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    getPosts();
    currentUser();
  }, []);

  function renderPosts({ item }) {
    console.log(item.name);
    return (
      <View>
        <Image source={{ uri: item.image }} style={{ width: 50, height: 50 }} />
        <Text>{item.name}</Text>
        <Text>{item.description}</Text>
        <Text>${item.price}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView>
      <View>
        <View>
          <Text>Dashboard</Text>
        </View>
        <View></View>
        <FlatList
          data={data}
          renderItem={renderPosts}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </SafeAreaView>
  );
}
