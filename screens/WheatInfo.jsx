import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';



const WheatListScreen = () => {
  const [wheatData, setWheatData] = useState([]);
  const [averageProductionValue, setAverageProductionValue] = useState(null);
  const tableHead = ["Year", "Mass (t)", "Value ($)", ""];

  const fetchWheatData = useCallback(() => {
    fetch('http://192.168.0.125:3000/getAllWheat')
      .then((response) => response.json())
      .then((data) => setWheatData(data))
      .catch((error) => console.error('Error fetching wheat data:', error));
  }, []);

  const handleDeleteWheat = async (id) => {
    try {
      const response = await fetch(`http://192.168.0.125:3000/deleteWheat/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Wheat entry deleted successfully');
        fetchWheatData(); 
      } else {
        console.error('Error deleting wheat entry');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };
  useEffect(() => {
    const filteredData = wheatData.filter((item) => item.productionValueUSD > 25000000);
    const sumProductionValue = filteredData.reduce((sum, item) => sum + item.productionValueUSD, 0);
    const averageValue = sumProductionValue / filteredData.length;
    setAverageProductionValue(averageValue);
  }, [wheatData]);

  useFocusEffect(
    React.useCallback(() => {
      fetchWheatData();
    }, [fetchWheatData])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Wheat production in Ukraine</Text>

      <Table borderStyle={{ borderWidth: 1, borderColor: "#E1E1E1" }}>
        <Row data={tableHead} flexArr={[1, 1.25, 1.25, 1.5]} style={styles.head} textStyle={styles.headers} />
        {wheatData.map((item) => (
          <Row
          style={{textAlign:"center", fontSize:10}}
            key={item._id}
            data={[item.year, item.productionTonnage, item.productionValueUSD, (
              <Button
                title="Delete"
                onPress={() => handleDeleteWheat(item._id)}
                color="red"
              />
            )]}
            flexArr={[1, 1.25, 1.25, 1.5]}
          />
        ))}
      </Table>
        
      <Text style={styles.header}>Massive harvests</Text>
      {averageProductionValue !== null && (
        <Text style={styles.headers}>
          Average Production Value (USD): {averageProductionValue ? averageProductionValue.toFixed(2) : "0"}
        </Text>
      )}

<Table borderStyle={{ borderWidth: 1, borderColor: "#E1E1E1" }}>
        <Row data={["Year", "Mass (t)", "Value ($)"]} flexArr={[1, 1.25, 1.25]} style={styles.head} textStyle={styles.headers} />
        {wheatData.filter((item) => item.productionTonnage > 25000000).map((item) => (
          <Row
          style={{textAlign:"center", fontSize:10}}
            key={item._id}
            data={[item.year, item.productionTonnage, item.productionValueUSD]}
            flexArr={[1, 1.25, 1.25]}
          />
        ))}
      </Table>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor:"FAFAFA",
    height:"100%"
  },
  header: {
    alignSelf: "flex-start",
    color: "#003566",
    fontSize: 22,
    fontWeight: "bold",
  },
  item: {
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  del: {
    marginLeft: 10,
    marginRight: 10
  },
  head: { 
    height: 40, 
    backgroundColor: '#f1f8ff' 
  },
  headers: {
    textAlign: "center",
    fontSize: 17,
    fontWeight: "bold",
  }
});

export default WheatListScreen;
