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
import { Icon } from "react-native-elements";
import Home from "./Home";
import Profile from "./Profile"

export default function Dashboard({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, getCurrent] = useState();

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
    navigation.navigate("Home");
  }

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
    if (item.user_id != current) {
      return (
        <View style={styles.boxDiv}>
          <View style={styles.box}>
            <Image
              source={{ uri: item.image }}
              style={{ width: 50, height: 50 }}
              style={styles.image}
            />
            <View style={styles.details}>
              <Text>{item.name}</Text>
              <Text>${item.price}</Text>
              <Button title="View" />
            </View>
          </View>
        </View>
      );
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.nav}>
        <View style={styles.profile}>
          <Icon name="user" type="font-awesome" size="60" onPress={() => navigation.navigate("Profile")} />
        </View>
        <View style={styles.post}>
          <Icon name="plus-circle" type="font-awesome" size="60" />
        </View>
        <View style={styles.logout}>
          <Icon
            name="sign-out"
            type="font-awesome"
            size="60"
            onPress={() => logout()}
          />
        </View>
      </View>
      <View></View>
      <FlatList
        data={data}
        renderItem={renderPosts}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#CAEBF2",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  nav: {
    width: "100%",
    height: 70,
    marginBottom: 20,
    borderStyle: "solid",
    borderBottomWidth: 5,
    borderBottomColor: "#FF3B3F",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    width: "100%",
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
  },
  image: {
    flex: 2,
  },
  details: {
    flex: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  profile: {
    height: "100%",
    marginLeft: 10,
    marginRight: 10,
  },
  post: {
    height: "100%",
    marginLeft: 10,
    marginRight: 10,
  },
  logout: {
    height: "100%",
    marginLeft: 10,
    marginRight: 10,
  },
});
