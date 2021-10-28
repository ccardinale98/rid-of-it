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
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Camera } from "expo-camera";
import { Icon } from "react-native-elements";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import Home from "./Home";
import Dashboard from "./Dashboard";
import Profile from "./Profile";

export default function Post({ navigation }) {
  let camera;
  const { control, handleSubmit, errors, reset } = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      tags: "",
    },
  });
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [startCamera, setStartCamera] = React.useState(false);
  const [uploadedImg, setUploadedImg] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const [current, getCurrent] = useState();

  useEffect(() => {
    currentUser();
  }, []);

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

  function submit(data) {
    console.log(data);
    console.log(uploadedImg, 55);
    console.log(current, 56);
    if (uploadedImg !== "" && current) {
      fetch("https://rid-of-it.herokuapp.com/api/posts/create", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          price: data.price,
          description: data.description,
          image: uploadedImg,
          user_id: current,
          tags: data.tags,
        }),
      });
      navigation.navigate("Dashboard");
    } else {
      console.log("error", 71);
    }
  }

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
            setStartCamera(false);
          }
        })
        .catch((err) => {
          console.error(err);
          alert("Cannot Upload");
        });
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8M3x8fGVufDB8fHx8&w=1000&q=80",
      }}
      style={styles.container}
    >
      {startCamera ? (
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
          <View style={styles.navDetCam}>
            <View style={styles.capture}>
              <Icon
                name="camera"
                type="font-awesome"
                size={60}
                color="#4988ac"
                onPress={() => __takePicture()}
              />
            </View>
          </View>
        </SafeAreaView>
      ) : (
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
          <Text style={styles.title}>Create a Listing</Text>
          <TouchableOpacity
            onPress={__startCamera}
            style={{
              width: 130,
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
                color: "#fff",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Open Camera
            </Text>
          </TouchableOpacity>
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
                style={styles.textDesc}
                multiline={true}
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
          <Controller
            control={control}
            name="tags"
            render={({ field: { onChange }, value }) => (
              <TextInput
                style={styles.tags}
                multiline={true}
                placeholder='Search Tags (seperated by ",")'
                onChangeText={(value) => onChange(value)}
              />
            )}
          />
          <TouchableOpacity
            style={styles.postButton}
            onPress={handleSubmit((data) => submit(data))}
          >
            <Text style={styles.post}>Post</Text>
          </TouchableOpacity>
        </View>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: "#CAEBF2",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  navDetCam: {
    width: "100%",
    height: 100,
    paddingTop: 10,
    backgroundColor: "#1f3e58",
    marginTop: 15,
  },
  navDet: {
    width: "100%",
    height: 90,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#1f3e58",
  },
  noCamera: {
    alignItems: "center",
    height: "100%",
    width: "100%",
    paddingTop: 50,
  },
  container: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  camera: {
    height: "90%",
    width: "90%",
    borderColor: "#1f3e58",
    borderWidth: 5,
  },
  takePicture: {
    height: 50,
    width: 50,
    backgroundColor: "#FF3B3F",
    borderRadius: 100,
  },
  buttonDiv: {
    width: "100%",
    alignItems: "flex-start",
    paddingLeft: 15,
    marginTop: 40,
  },
  textFlip: {
    marginLeft: 10,
    marginTop: 10,
    color: "#FFF",
    fontSize: 20,
  },
  title: {
    fontSize: 40,
    color: "#FFF",
    marginBottom: 20,
    marginTop: 20,
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
  tags: {
    fontSize: 20,
    backgroundColor: "#FFF",
    width: 250,
    height: 80,
    borderRadius: 25,
    marginBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  textDesc: {
    fontSize: 20,
    backgroundColor: "#FFF",
    width: 250,
    height: 150,
    borderRadius: 25,
    marginBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  postButton: {
    height: 60,
    width: 150,
    marginTop: 40,
    borderRadius: 25,
    backgroundColor: "#faad59",
    justifyContent: "center",
    alignItems: "center",
  },
  post: {
    fontSize: 40,
    color: "#FFF",
  },
  back: {
    width: "100%",
    alignItems: "flex-start",
    paddingLeft: 15,
  },
});
