import React, { useState, useEffect} from 'react';
import socketio from 'socket.io-client';
import { TouchableOpacity, SafeAreaView, Alert, ScrollView, Text, StyleSheet, Image, AsyncStorage} from 'react-native';

import SpotList from '../components/SpotList';
import logo from '../assets/logo.png'

export default function List({ navigation }) {
    const [techs, setTechs] = useState([]);

    useEffect(() => {
        AsyncStorage.getItem('user').then(user_id => {
            const socket = socketio('http://192.168.15.5:3333', {
                query: { user_id }
            })

            socket.on('booking_response', booking => {
                Alert.alert(`Sua reserva em ${booking.spot.company} em ${booking.date} foi ${booking.approved ? 'APROVADO' : 'REJEITADA'}`);
            })
        })
    }, []);

    useEffect(() => {
        AsyncStorage.getItem('techs').then(storagedTechs => {
            const techsArray = storagedTechs.split(',').map(tech => tech.trim());

            setTechs(techsArray);
        })
    }, []);
    
    function handleLogoff() {
        AsyncStorage.clear('techs');
        
        navigation.navigate('Login');
    }
    return (            
        <SafeAreaView style={styles.container}>
            <Image style={styles.logo} source={logo} />
            <TouchableOpacity onPress={() => handleLogoff()}>
                <Text>Sair</Text>
            </TouchableOpacity>
            <ScrollView>
                {techs.map(tech => <SpotList key={tech} tech={tech} />)}
            </ScrollView>
        </SafeAreaView>
    )
}
    
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    logo: {
        height: 32,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: 100,

    },
});
