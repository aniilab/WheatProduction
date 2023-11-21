import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Button } from 'react-native';
import * as Contacts from 'expo-contacts';


export default function ContactsScreen() {

    const [contacts, setContacts] = useState([])

    useEffect(() => {
        (async () => {
            const { status } = await Contacts.requestPermissionsAsync();
            if (status === 'granted') {
                const { data } = await Contacts.getContactsAsync({
                    fields: [Contacts.Fields.Emails],
                });

                if (data.length > 0) {
                    setContacts(data)
                }
            }
        })();
    }, []);

    const filteredContacts = contacts.filter(contact => contact.firstName && contact.firstName.toLowerCase().endsWith('a'))
                                     .sort((a, b) => a.firstName.localeCompare(b.firstName));



    return (
        <View style={styles.container}>
            <Text style = {styles.header}>Contact names ending with 'a':</Text>

            <FlatList
                style={{ width: '100%' }}
                data={filteredContacts}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.borders}>
                        <Text style={styles.listItem}>{item.firstName}</Text>
                    </View>
                )}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
        paddingHorizontal:20,
        backgroundColor:"#FAFAFA"
    },
    header: {
        alignSelf: "flex-start",
        color: "#003566",
        fontSize: 22,
        fontWeight: "bold",
    },
    
    listItem: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        fontSize:18,
    },
    
    borders: {
        borderBottomColor:"#E1E1E1",
        borderBottomWidth:0.5
    },
});
