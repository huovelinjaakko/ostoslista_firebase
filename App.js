import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, remove, ref, onValue } from 'firebase/database';
import { useState, useEffect } from 'react';

export default function App() {

  const firebaseConfig = {
    apiKey: "AIzaSyDDkLmLiyyVZymY6VC0fs2DxGIiU7vJfhs",
    authDomain: "fir-exercise-39bf1.firebaseapp.com",
    projectId: "fir-exercise-39bf1",
    storageBucket: "fir-exercise-39bf1.appspot.com",
    messagingSenderId: "313122936851",
    appId: "1:313122936851:web:a982bf771fe5457e9e87e6",
    measurementId: "G-QRKXYXPVJY"
  };

  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    const itemsRef = ref(database, 'items/');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      const products = data ? Object.keys(data).map(key => ({ key, ...data[key] })) : [];
      setItems(products);
    });
  }, []);

  const saveItem = () => {
    push(
      ref(database, 'items/'),
      { 'product': product, 'amount': amount}
    );
  }

  const deleteItem = (key) => {
    remove(ref(database, 'items/' + key))
  }

  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={{ borderWidth: 1, fontSize: 15, width: 150, margin: 5 }}
        placeholder='Product'
        onChangeText={(product) => setProduct(product)}
        value={product}
      />
      <TextInput
        style={{ borderWidth: 1, fontSize: 15, width: 150, marginBottom: 5 }}
        placeholder='Amount'
        onChangeText={(amount) => setAmount(amount)}
        value={amount}
      />
      <Button title='Save' onPress={saveItem} />
      <Text style={{margin: 30, fontSize: 20}}>Shopping list</Text>
      <FlatList 
        style={{ marginLeft: '5%' }}
        renderItem={({ item }) => 
          <View style={styles.listcontainer}>
            <Text style={{ fontSize: 18 }}>{item.product}, {item.amount}</Text>
            <Text style={{ fontSize: 20, color: '#0000ff' }} onPress={() => deleteItem(item.key)}>  delete</Text>
          </View>}
        data={items}
        ItemSeparatorComponent={listSeparator}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 100,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center'
  },
});
