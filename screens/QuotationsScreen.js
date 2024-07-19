import { StyleSheet, Text, View, FlatList, TouchableOpacity,Alert,RefreshControl, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getItem } from './AsyncStorage';
import axios from 'axios';
import { DataTable } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function QuotationsScreen({ navigation }) {
    const [quotations, setQuotations] = useState([]);
    const [userid, setUserid] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        const retrieveData = async () => {
            try {
                const savedData = await getItem('quotationData');
                console.log("quotationData",savedData);
                if (savedData) {
                    const parsedData = JSON.parse(savedData);
                    setUserid(parsedData.userid);
                }
            } catch (error) {
                console.log("Error retrieving data from AsyncStorage:", error);
            }
        };
        retrieveData();
    }, []);
    console.log("userid",userid);

    const loaddata = () => {
        axios.post(apiUrl + 'api/get_quotatons/' + userid).then((res) => {
            setQuotations(res.data.data);
        }).catch((err) => {
            console.log(err);
        });
    };

    useEffect(()=>{
        if (userid!==0) {
        loaddata()     
        }
    },[userid])

    const onRefresh = () => {
        setRefreshing(true);
        // Perform data fetching here...
        loaddata().then(() => setRefreshing(false)); 
      };

    const handleView = (filename) => {
        navigation.navigate('Printquotation',{filename})
    };
 
    const renderActionButton = (item) => {
        const status = item.status.toLowerCase(); 
        if (status !== 'lead') {
            return (
                <TouchableOpacity style={[styles.actionButton, styles.enabledButton]} onPress={() => handleView(item.filename)}>
                <Text>View</Text>
            </TouchableOpacity>
            );
        } else {
            return (
                // <TouchableOpacity style={[styles.actionButton, styles.disabledButton]} onPress={() => handleView1(item)}>
                <Text style={styles.disabledButtonText}>Quotation Not Generated</Text>
            // </TouchableOpacity>
            );
        }
    };
  return (
    <View style={styles.container}
     
    >
        <ScrollView
        showsVerticalScrollIndicator={false}
        >
     <DataTable style={styles.container}>
<DataTable.Header style={styles.tableHeader}>
    <DataTable.Title>Sr.No</DataTable.Title>
    <DataTable.Title>Lead No</DataTable.Title>
    {/* <DataTable.Title>Status</DataTable.Title> */}
    <DataTable.Title>Action</DataTable.Title>
</DataTable.Header>

{quotations.map((item, i) => {
let rowStyle = {};
if (item.status === 'Lead') {
    rowStyle.backgroundColor = '#FFC0CB'; 
} else if (item.status === 'SBQuotation') {
    rowStyle.backgroundColor = '#87CEEB'; 
} else {
    rowStyle.backgroundColor = '#ffffff';
}

return (
    <DataTable.Row key={i} style={rowStyle}>
        <DataTable.Cell>{i + 1}</DataTable.Cell>
        <DataTable.Cell>{item.leadno}</DataTable.Cell>
        {/* <DataTable.Cell>{item.status}</DataTable.Cell> */}
        <DataTable.Cell>{renderActionButton(item)}</DataTable.Cell>
    </DataTable.Row>
);
})}
</DataTable>
</ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fda90120' },
    tableHeader: { backgroundColor: '#f1f8ff' },
    actionButton: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 5, justifyContent: 'center', alignItems: 'center' },
    disabledButton: { backgroundColor: '#ccc' },
    disabledButtonText: { color: '#666', fontSize: 12 },
    enabledButton: { backgroundColor: 'yellow' },
    enabledButtonText: { color: '#333', fontSize: 16 },
});