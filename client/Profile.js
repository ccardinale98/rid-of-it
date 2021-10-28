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
  Modal,
  TextInput,
} from "react-native";
import { Icon } from "react-native-elements";
import { useForm, Controller } from "react-hook-form";
import Home from "./Home";
import Login from "./Login";
import Dashboard from "./Dashboard";

export default function Profile({ navigation }) {
  const [user, getUser] = useState({});
  const [data, setData] = useState([]);
  const [current, getCurrent] = useState();
  const [modalVisible, setModalVisible] = useState();
  const { control, handleSubmit, errors, reset } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

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
    setModalVisible(false);
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

  function deletePost(item) {
    console.log(item, 84);
    fetch(`https://rid-of-it.herokuapp.com/api/posts/delete/${item}`, {
      method: "DELETE",
    })
      .then((response) => response.text())
      .then((resData) => {
        console.log(resData);
        getPosts();
      })
      .catch((err) => console.log(err));
    alert("Listing Deleted");
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
              <Button title="Delete" onPress={() => deletePost(item.id)} />
            </View>
          </View>
        </View>
      );
    }
  }

  function handleEdit() {
    console.log("modal");
    setModalVisible(true);
  }

  function submit(data) {
    console.log(data, 111);

    if (data.password == data.confirmPassword) {
      fetch(`https://rid-of-it.herokuapp.com/api/users/update/${current}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          password: data.password,
          image: user.image,
          user_name: user.user_name,
        }),
      })
        .then((response) => response.json())
        .then((user) => {
          console.log(user, 128);
          setModalVisible(false);
        })
        .catch((err) => console.log(err));
    } else {
      console.log("PASSWORDS DONT MATCH");
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
          <Button
            style={styles.edit}
            title="Change Password"
            onPress={() => handleEdit()}
          />
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
        style={styles.modal}
      >
        <SafeAreaView style={styles.modalDiv}>
          <View style={styles.icon}>
            <Icon
              name="times"
              type="font-awesome"
              size={30}
              onPress={() => setModalVisible(false)}
            />
          </View>
          <Text style={styles.modalTitle}>Change Password</Text>
          <View style={styles.formDiv}>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange }, value }) => (
                <TextInput
                  style={styles.password}
                  placeholder="New Password"
                  placeholderTextColor="black"
                  onChangeText={(value) => onChange(value)}
                />
              )}
            />
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange }, value }) => (
                <TextInput
                  style={styles.password}
                  placeholder="Confirm Password"
                  placeholderTextColor="black"
                  onChangeText={(value) => onChange(value)}
                />
              )}
            />
            <Button
              title="Change"
              onPress={handleSubmit((data) => submit(data))}
            />
          </View>
        </SafeAreaView>
      </Modal>
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
    paddingTop: 70,
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
  edit: {
    marginBottom: 10,
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
    top: "20%",
    left: "15%",
    borderRadius: 25,
  },
  icon: {
    width: "100%",
    alignItems: "flex-end",
    paddingTop: 10,
    paddingRight: 10,
  },
  formDiv: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  password: {
    backgroundColor: "#EFEFEF",
    width: "80%",
    height: 30,
    marginBottom: 10,
    borderRadius: 25,
    padding: 2,
    paddingLeft: 10,
  },
  modalTitle: {
    width: "100%",
    textAlign: "center",
    fontSize: 20,
  },
});
