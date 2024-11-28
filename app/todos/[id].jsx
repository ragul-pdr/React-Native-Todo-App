import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "@/context/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import Octicons from "@expo/vector-icons/Octicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function EditScreen() {
  const { id } = useLocalSearchParams();
  const [todo, setTodo] = useState({});
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
  const router = useRouter();

  const [loded, error] = useFonts({
    Inter_500Medium,
  });

  useEffect(() => {
    const fetchData = async (id) => {
      try {
        const jsonValue = await AsyncStorage.getItem("TodoApp");
        const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null;

        if (storageTodos && storageTodos.length) {
          const myTodo = storageTodos.find((todo) => todo.id.toString() === id);
          setTodo(myTodo);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData(id);
  }, [id]);

  if (!loded && !error) {
    return <Text>Loading...</Text>; // Loading
  }

  const styles = createStyles(theme, colorScheme);
  const handleSave = async () => {
    try {
      const savedTodo = { ...todo, title: todo.title };
      const jsonValue = await AsyncStorage.getItem("TodoApp");
      const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null;

      if (storageTodos && storageTodos.length) {
        const otherTodos = storageTodos.filter(
          (todo) => todo.id != savedTodo.id
        );

        const allTodos = [...otherTodos, savedTodo];
        await AsyncStorage.setItem("TodoApp", JSON.stringify(allTodos));
      } else {
        await AsyncStorage.setItem("TodoApp", JSON.stringify([savedTodo]));
      }

      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          maxLength={30}
          placeholder="Edit Todo"
          placeholderTextColor="gray"
          value={todo?.title || ""}
          onChangeText={(text) => setTodo((prev) => ({ ...prev, title: text }))}
        />
        <Pressable
          onPress={() =>
            setColorScheme(colorScheme === "light" ? "dark" : "light")
          }
          style={{ marginLeft: 10 }}
        >
          <Octicons
            name={colorScheme === "light" ? "sun" : "moon"}
            size={36}
            color={theme.text}
            selectable={undefined}
          />
        </Pressable>
      </View>
      <View style={styles.buttonContainer}>

        <Pressable onPress={handleSave} style={styles.saveButton}>
          <Entypo name="save" size={28} color={theme.text} />
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/")} style={[styles.saveButton]}>
          <MaterialIcons name="cancel" size={28} color="red" />
          <Text style={styles.saveButtonText}>Cancel</Text>
        </Pressable>

      </View>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {  
      flex: 1,
      width: "100%",
      backgroundColor: theme.background,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      gap: 6,
      width: "100%",
      maxWidth: 1024,
      marginHorizontal: "auto",
      pointerEvents: "auto",
    },
    buttonContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      gap: 6,
      width: "100%",
      maxWidth: 1024,
      marginHorizontal: "auto",
      pointerEvents: "auto",
    },
    input: {
      flex: 1,
      borderColor: "gray",
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      fontSize: 18,
      fontFamily: "Inter_500Medium",
      minWidth: 0,
      color: theme.text,
    },
    saveButton: {
      // backgroundColor: theme.button,
      flexDirection:"row",
      borderRadius: 5,
      borderWidth:2,
      borderColor:'gray',
      width:100,
      height:50,
      alignContent:'center',
      textAlign:'center',
      justifyContent:'center',
      padding: 10,
    },
    saveButtonText: {
      color: colorScheme === "dark" ? "white" : "black",
      fontSize: 18,
      marginLeft:8,
    },
  });
}
