import { StyleSheet, Text, View, TextInput, FlatList } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, remove, ref, onValue } from 'firebase/database';
import { useState, useEffect } from 'react';
import { Header, Icon, Input, Button, ListItem } from '@rneui/themed';

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

  renderItem = ({ item }) => (
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{item.product}</ListItem.Title>
        <ListItem.Subtitle>{item.amount}</ListItem.Subtitle>
      </ListItem.Content>
      <Button onPress={() => deleteItem(item.key)} color='white'>
      <Icon name="trash-can-outline" type="material-community" color="red" />
      </Button>
    </ListItem>
  )

  return (
    <View style={styles.container}>
      <Header
        leftComponent={{ icon: 'menu', color: '#fff' }}
        centerComponent={{ text: 'SHOPPING LIST', style: { color: '#fff' } }}
        rightComponent={{ icon: 'home', color: '#fff' }}
      />
      <Input
        placeholder='Type a product' label='PRODUCT'
        onChangeText={product => setProduct(product)} 
        value={product} 
      />
      <Input
        placeholder='Set the amount' label='AMOUNT'
        onChangeText={amount => setAmount(amount)}
        value={amount}
      />
      <View style={{marginLeft: 90, marginRight: 90}}>
      <Button type="solid" onPress={saveItem}>
        <Icon name="save" color="white" />
        Save
      </Button>
      </View>
      <FlatList 
        renderItem={renderItem}
        data={items}
        ItemSeparatorComponent={listSeparator}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center'
  },
});
