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
  TouchableOpacity,
  TextInput,
  ImageBackground,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Icon } from "react-native-elements";
import Home from "./Home";
import Login from "./Login";
import Profile from "./Profile";
import Post from "./Post";

export default function Dashboard({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, getCurrent] = useState();
  const [show, showPost] = React.useState(false);
  const [item, currenItem] = useState({});
  const { control, handleSubmit, errors, reset } = useForm({
    defaultValues: {
      search: "",
    },
  });

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
          navigation.navigate("Login");
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

  function handleDetails(item) {
    console.log(item);
    showPost(true);
    currenItem(item);
  }

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      getPosts();
      currentUser();
    }

    return () => {
      isMounted = false;
    };
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
              <Button title={item.name} onPress={() => handleDetails(item)} />
              <Text style={{ color: "white" }}>${item.price}</Text>
            </View>
          </View>
        </View>
      );
    }
  }

  function submit(data) {
    console.log(data);
    var search = data.search.toLowerCase();
    console.log(search);
    fetch("https://rid-of-it.herokuapp.com/api/posts/")
      .then((response) => response.json())
      .then((data) => {
        console.log(data, "39");
        var taggedData = [];
        for (var i = 0; i < data.length; i++) {
          var tags = data[i].tags.toLowerCase().split(",");
          if (tags.includes(search)) {
            taggedData.unshift(data[i]);
          }
        }
        console.log(taggedData, 129);

        if (search == "" || search == " " || search == "all") {
          setData(data);
        } else {
          setData(taggedData);
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8M3x8fGVufDB8fHx8&w=1000&q=80",
      }}
      style={styles.container}
    >
      {!show ? (
        <View style={styles.container}>
          <View style={styles.nav}>
            <View style={styles.profile}>
              <Icon
                name="user"
                type="font-awesome"
                size={60}
                color="#4988ac"
                onPress={() => navigation.navigate("Profile")}
              />
            </View>
            <View style={styles.post}>
              <Icon
                name="plus-circle"
                type="font-awesome"
                size={60}
                color="#4988ac"
                onPress={() => navigation.navigate("Post")}
              />
            </View>
            <View style={styles.logout}>
              <Icon
                name="sign-out"
                type="font-awesome"
                size={60}
                color="#4988ac"
                onPress={() => logout()}
              />
            </View>
          </View>
          <View style={styles.searchDiv}>
            <Controller
              control={control}
              name="search"
              render={({ field: { onChange }, value }) => (
                <TextInput
                  style={styles.text}
                  placeholder="Search by keyword"
                  onChangeText={(value) => onChange(value)}
                />
              )}
            />
            <TouchableOpacity
              onPress={handleSubmit((data) => submit(data))}
              style={{
                width: 65,
                borderRadius: 4,
                backgroundColor: "#faad59",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                height: 40,
                marginTop: 15,
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  color: "#FFF",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Search
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={data}
            renderItem={renderPosts}
            keyExtractor={(item) => item.id.toString()}
            style={styles.list}
          />
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.navDet}>
            <View style={styles.back}>
              <Icon
                name="angle-left"
                type="font-awesome"
                size={60}
                color="#4988ac"
                onPress={() => showPost(false)}
              />
            </View>
          </View>
          <Image
            source={{ uri: item.image }}
            style={{
              width: "100%",
              height: "50%",
            }}
          />
          <View style={styles.itemDetails}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemDesc}>{item.description}</Text>
            <Text style={styles.itemPrice}>${item.price}</Text>
            <TouchableOpacity
              style={{
                width: 130,
                borderRadius: 4,
                backgroundColor: "#faad59",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                height: 40,
                marginTop: 20,
              }}
            >
              <Text
                style={{
                  color: "#FFF",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Buy
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  searchDiv: {
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "100%",
    flexDirection: "row",
    paddingBottom: 10,
    borderBottomWidth: 5,
    borderBottomColor: "#faad59",
    marginBottom: 30,
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
  buttonDiv: {
    width: "100%",
    alignItems: "flex-start",
    paddingLeft: 5,
  },
  itemTitle: {
    fontSize: 50,
    color: "#FFF",
  },
  itemDesc: {
    fontSize: 20,
    marginTop: 20,
    color: "#FFF",
  },
  itemPrice: {
    fontSize: 40,
    marginTop: 20,
    color: "#FFF",
  },
  postMain: {
    alignItems: "center",
    width: "100%",
    height: "100%",
    paddingTop: 40,
  },
  itemDetails: {
    height: "50%",
    width: "100%",
    alignItems: "center",
    padding: 20,
  },
  nav: {
    width: "100%",
    height: 110,
    paddingTop: 40,
    marginBottom: 20,
    borderStyle: "solid",
    backgroundColor: "#1f3e58",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  navDet: {
    width: "100%",
    height: 210,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 10,
    backgroundColor: "#1f3e58",
  },
  list: {
    width: "90%",
  },
  boxDiv: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: "80%",
    padding: 20,
    flexDirection: "row",
    marginBottom: 10,
    backgroundColor: "#1f3e58",
    borderRadius: 25,
  },
  image: {
    flex: 2,
    borderRadius: 100,
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
  back: {
    width: "100%",
    alignItems: "flex-start",
    paddingLeft: 15,
  },
  logout: {
    height: "100%",
    marginLeft: 10,
    marginRight: 10,
  },
});
