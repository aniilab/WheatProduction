import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const AddWheatScreen = () => {
  const [year, setYear] = useState('');
  const [productionTonnage, setProductionTonnage] = useState('');
  const [productionValueUSD, setProductionValueUSD] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://192.168.0.125:3000/addWheat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          year: parseInt(year),
          productionTonnage: parseInt(productionTonnage),
          productionValueUSD: parseInt(productionValueUSD),
        }),
      });
      setYear("")
      setProductionTonnage("")
      setProductionValueUSD("")
      if (response.ok) {
        console.log('Wheat entry added successfully');
        // Виконайте додаткові дії, якщо потрібно
      } else {
        console.error('Error adding wheat entry');
        // Обробте помилку, якщо потрібно
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Year:</Text>
      <TextInput
        style={styles.input}
        value={year}
        onChangeText={(text) => setYear(text)}
      />

      <Text style={styles.label}>Production Tonnage:</Text>
      <TextInput
        style={styles.input}
        value={productionTonnage}
        onChangeText={(text) => setProductionTonnage(text)}
      />

      <Text style={styles.label}>Production Value (USD):</Text>
      <TextInput
        style={styles.input}
        value={productionValueUSD}
        onChangeText={(text) => setProductionValueUSD(text)}
      />

      <Button style={styles.button} title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor:"#FAFAFA",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius:"10%",
  },
  button:{
    color:"#a8dadc",
  }
});

export default AddWheatScreen;
