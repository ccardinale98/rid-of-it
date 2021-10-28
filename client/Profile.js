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
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Icon } from "react-native-elements";
import { Camera } from "expo-camera";
import { useForm, Controller } from "react-hook-form";
import Home from "./Home";
import Login from "./Login";
import Dashboard from "./Dashboard";

export default function Profile({ navigation }) {
  let camera;
  const [user, getUser] = useState({});
  const [data, setData] = useState([]);
  const [current, getCurrent] = useState();
  const [modalVisible, setModalVisible] = useState();
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [startCamera, setStartCamera] = React.useState(false);
  const [uploadedImg, setUploadedImg] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
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

  const __startCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === "granted") {
      // do something
      setStartCamera(true);
    } else {
      Alert.alert("Access denied");
    }
  };

  const __takePicture = async () => {
    console.log("take picture");
    const options = { quality: 0.7, base64: true };
    const data = await camera.takePictureAsync(options);
    console.log(data.uri);
    setCapturedImage(data.uri);
    const source = data.base64;

    if (source) {
      let base64Img = `data:image/jpg;base64,${source}`;
      let apiUrl = "https://api.cloudinary.com/v1_1/dxw7l6liy/image/upload";
      let data = {
        file: base64Img,
        upload_preset: "myUploadPreset",
      };

      fetch(apiUrl, {
        body: JSON.stringify(data),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      })
        .then(async (response) => {
          let data = await response.json();
          if (data.secure_url) {
            console.log(data);
            setUploadedImg(data.secure_url);
            alert("Upload Successful");
            console.log(uploadedImg, 104);
            fetch(
              `https://rid-of-it.herokuapp.com/api/users/update/${current}`,
              {
                method: "PUT",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: user.email,
                  password: user.password,
                  image: data.secure_url,
                  user_name: user.user_name,
                }),
              }
            )
              .then((response) => response.json())
              .catch((err) => console.log(err));
          }
          setStartCamera(false);
          currentUser();
        })
        .catch((err) => {
          console.error(err);
          alert("Cannot Upload");
        });
    }
  };

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
              <Text style={{ color: "#FFF" }}>{item.name}</Text>
              <Text style={{ color: "#FFF" }}>${item.price}</Text>
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
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8M3x8fGVufDB8fHx8&w=1000&q=80",
      }}
      style={styles.container}
    >
      {!startCamera ? (
        <View style={styles.container}>
          <View style={styles.navDet}>
            <View style={styles.back}>
              <Icon
                name="angle-left"
                type="font-awesome"
                size={60}
                color="#4988ac"
                onPress={() => navigation.navigate("Dashboard")}
              />
            </View>
          </View>
          <View style={styles.main}>
            <Image source={{ uri: user.image }} style={styles.image} />
            <View style={styles.details}>
              <Button
                style={styles.edit}
                title="Change Profile Picture"
                onPress={() => __startCamera()}
              />
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
        </View>
      ) : (
        <SafeAreaView style={styles.container}>
          <Camera
            style={styles.camera}
            type={type}
            ref={(r) => {
              camera = r;
            }}
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  setType(
                    type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  );
                }}
              >
                <Text style={styles.textFlip}> Flip </Text>
              </TouchableOpacity>
            </View>
          </Camera>
          <Button
            onPress={() => {
              __takePicture();
              console.log("pressed");
            }}
            title="Capture"
          />
        </SafeAreaView>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  navDet: {
    width: "100%",
    height: 90,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#1f3e58",
  },
  camera: {
    height: "75%",
    width: "90%",
    borderColor: "#A9A9A9",
    borderWidth: 5,
  },
  takePicture: {
    height: 50,
    width: 50,
    backgroundColor: "#FF3B3F",
    borderRadius: 100,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  textFlip: {
    marginLeft: 10,
    marginTop: 10,
    color: "#FFF",
    fontSize: 20,
  },
  image: {
    marginTop: 20,
    width: 200,
    height: 200,
    borderRadius: 100,
    borderColor: "#faad59",
    borderWidth: 5,
  },
  details: {
    paddingTop: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderBottomColor: "#faad59",
    borderBottomWidth: 5,
  },
  text: {
    marginBottom: 20,
    fontSize: 20,
    alignItems: "center",
    justifyContent: "center",
    color: "#FFF",
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
    padding: 20,
    flexDirection: "row",
    marginBottom: 10,
    backgroundColor: "#1f3e58",
    borderRadius: 25,
    alignItems: "center",
  },
  imagePost: {
    flex: 2,
    borderRadius: 25,
    height: 70,
    width: 50,
  },
  detailsPost: {
    flex: 4,
    justifyContent: "center",
    alignItems: "center",
    color: "#FFF",
  },
  buttonDiv: {
    width: "100%",
    alignItems: "flex-start",
    paddingTop: 20,
    paddingLeft: 15,
  },
  edit: {
    marginBottom: 20,
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
  back: {
    width: "100%",
    alignItems: "flex-start",
    paddingLeft: 15,
  },
});
