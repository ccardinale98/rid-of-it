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
          dexcription: data.description,
          image: uploadedImg,
          user_id: current,
        }),
      });
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
          }
        })
        .catch((err) => {
          console.error(err);
          alert("Cannot Upload");
        });
    }
  };

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        {startCamera ? (
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
                <Text style={styles.text}> Flip </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.takePicture}
              onPress={() => __takePicture()}
            ></TouchableOpacity>
          </Camera>
        ) : (
          <TouchableOpacity
            onPress={__startCamera}
            style={{
              width: 130,
              borderRadius: 4,
              backgroundColor: "#14274e",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              height: 40,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Take picture
            </Text>
          </TouchableOpacity>
        )}
      </View>
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
    </View>
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
  camera: {
    height: 500,
    width: 250,
  },
  takePicture: {
    height: 50,
    width: 50,
    backgroundColor: "#FFF",
    borderRadius: 100,
    position: "absolute",
    top: 425,
    left: 100,
  },
});
