import { Text, View, TextInput, Pressable, SafeAreaView, StyleSheet, FlatList } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useState } from "react";
import { data } from "../data/todos";

export default function Index() {
  const [todos, setTodos] = useState(data.sort((a, b) => b.id - a.id));
  const [text, setText] = useState("");
  const addTodo = () => {
    if (text.trim()) {
      const newId = todos.length > 0 ? todos[0].id + 1 : 1;
      setTodos([{ id: newId, title: text, completed: false }, ...todos]);
      setText("");
    }
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const removeTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };


  const renderItem =({item})=>[
    <View style={styles.todoItem}>
      <Text
      style={[styles.todoText, item.completed && styles.completedText]}
      onPress={()=> toggleTodo(item.id)}
      >
        {item.title}
      </Text>
      <Pressable onPress={()=>removeTodo(item.id)}>
      <AntDesign name="delete" size={36} color="orange" selectable={undefined} />
      </Pressable>
    </View>
  ]

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
        style={styles.input}
        placeholder="Add a new task"
        placeholderTextColor='gray'
        value={text}
        onChangeText={setText}
        />
        <Pressable onPress={addTodo} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>
    <FlatList
    
    data={todos}
    renderItem={renderItem}
    keyExtractor={todo => todo.id.toString()}
    contentContainerStyle={{flexGrow:1}}
    >

    </FlatList>
    </SafeAreaView>
  );
}

const styles=StyleSheet.create({
  container:{
    flex:1,
    // width:'100%',
    backgroundColor:'black'
  },
  inputContainer:{
    flexDirection:'row',
    alignItems:'center',
    marginBottom:10,
    padding:10,
    width:'100%',
    maxWidth:1024,
    marginHorizontal:'auto',
    pointerEvents:'auto'
  },
  input:{
    flex:1,
    borderColor:'gray',
    borderWidth:1,
    borderRadius:5,
    padding:10,
    marginRight:10,
    fontSize:18,
    minWidth:0,
    color:'white',
  },
  addButton:{
    backgroundColor:'orange',
    borderRadius:5,
    padding:10,
  },
  addButtonText:{
    fontSize:18,
    color:'black'
  },
  todoItem:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    gap:4,
    padding:10,
    borderBottomColor:'gray',
    borderBottomWidth:1,
    width:'100%',
    maxWidth:1024,
    marginHorizontal:'auto',
    pointerEvents:'auto',

  },
  todoText:{
    flex:1,
    fontSize:18,
    color:'red',

  },
  completedText:{
    textDecorationLine:'line-through',
    color:'green',
  }
    
  
  
})
