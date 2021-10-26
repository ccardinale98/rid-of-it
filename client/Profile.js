import { NavigationContainer, useIsFocused } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  Image,
  FlatList,
} from "react-native";
import Home from "./Home";
import Login from "./Login";
import Dashboard from "./Dashboard";

export default function Profile({ navigation }) {
  const [user, getUser] = useState({});
  const [data, setData] = useState([]);
  const [current, getCurrent] = useState();

  const isFocused = useIsFocused();

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
          handleUserData(user.user);
          getCurrent(user.user);
        }
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    currentUser();
    getPosts();
  }, []);

  function getPosts() {
    fetch("https://rid-of-it.herokuapp.com/api/posts/")
      .then((response) => response.json())
      .then((data) => {
        console.log(data, "42");
        setData(data);
      })
      .catch((err) => console.log(err));
  }

  function handleUserData(currentUser) {
    console.log(currentUser, 36);
    fetch(`https://rid-of-it.herokuapp.com/api/users/${currentUser}`)
      .then((response) => response.json())
      .then((user) => {
        console.log(user, "35");
        getUser(user);
        if (user.message == "No User with this ID") {
          console.log("no user", 41);
          navigation.navigate("Home");
        }
      })
      .catch((err) => console.log(err));
  }

  function renderPosts({ item }) {
    console.log(item.name, 64);
    console.log(current);
    if (item.user_id == current) {
      return (
        <View style={styles.boxDiv}>
          <View style={styles.box}>
            <Image
              source={{ uri: item.image }}
              style={{ width: 50, height: 50 }}
              style={styles.imagePost}
            />
            <View style={styles.detailsPost}>
              <Text>{item.name}</Text>
              <Text>${item.price}</Text>
            </View>
          </View>
        </View>
      );
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonDiv}>
        <Button
          title="Dashboard"
          onPress={() => navigation.navigate("Dashboard")}
          style={styles.button}
        />
      </View>
      <View style={styles.main}>
        <Image source={{ uri: user.image }} style={styles.image} />
        <View style={styles.details}>
          <Text style={styles.text}>Username: {user.user_name}</Text>
          <Text style={styles.text}>Email: {user.email}</Text>
        </View>
        <FlatList
          data={data}
          renderItem={renderPosts}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    paddingTop: 30,
  },
  container: {
    flex: 1,
    backgroundColor: "#CAEBF2",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  details: {
    paddingTop: 100,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderBottomColor: "#FF3B3F",
    borderBottomWidth: 5,
  },
  text: {
    marginBottom: 20,
    fontSize: 20,
    alignItems: "center",
    justifyContent: "center",
    color: "#A9A9A9",
  },
  list: {
    width: "100%",
    paddingTop: 20,
  },
  boxDiv: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: "80%",
    backgroundColor: "#EFEFEF",
    padding: 20,
    borderColor: "#A9A9A9",
    borderStyle: "solid",
    borderWidth: 5,
    flexDirection: "row",
    marginBottom: 10,
  },
  imagePost: {
    flex: 2,
    borderRadius: 100,
    height: 50,
    width: 50,
  },
  detailsPost: {
    flex: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDiv: {
    width: "100%",
    alignItems: "flex-start",
    paddingTop: 20,
    paddingLeft: 15,
  },
});
