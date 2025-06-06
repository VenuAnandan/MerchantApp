import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { View, Text, Button, Platform, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';

const Credit = ({ navigation }) => {

    const [score, setScore] = useState(30);

    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    useEffect(() => {
        const getagentscore = async () => {
            const token = await AsyncStorage.getItem('token')
            try {
                const resposne = await axios.get(apiUrl + '/getagentid', {
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                });
                // console.log(resposne.data,"---score data");
                setScore(resposne.data)
            } catch (error) {
                console.log(`Error is : ${error}`)
            }
        }
        getagentscore();
    }, [score])

    const getStage = () => {
        if (score <= 20) return '⭐ Beginner Stage';
        if (score <= 50) return '🥈 Silver Level';
        if (score <= 100) return '🥇 Gold Level';
        return '🏆 Elite Level';
    };

    const getNextTarget = () => {
        if (score <= 20) return 'Next Target: Reach 50 for Silver Benefits';
        if (score <= 50) return 'Next Target: Reach 100 for Gold Benefits';
        if (score <= 100) return 'Next Target: Surpass 100 for special recognition';
        return 'Enjoy Elite Rewards!';
    };

    const getBenefits = () => {
        if (score >= 100) {
            return (
                <View style={styles.benefitCard}>
                    <Text style={styles.benefitTitle}>🎁 Special Gift!</Text>
                    <Text style={styles.benefitText}>
                        - Exclusive company gifts 🎁{'\n'}
                        - Premium client leads 📈{'\n'}
                    </Text>
                </View>
            );
        }
        if (score >= 50) {
            return (
                <View style={styles.benefitCard}>
                    <Text style={styles.benefitTitle}>🥂 Gold Benefits!</Text>
                    <Text style={styles.benefitText}>
                        - Early access to new features 🚀{'\n'}
                        - Priority support 🛠️{'\n'}
                        - Gift vouchers 💳
                    </Text>
                </View>
            );
        }
        if (score >= 20) {
            return (
                <View style={styles.benefitCard}>
                    <Text style={styles.benefitTitle}>🌟 Silver Benefits!</Text>
                    <Text style={styles.benefitText}>
                        - Discount vouchers 🎟️{'\n'}
                        - Faster customer support 📞
                    </Text>
                </View>
            );
        }
        return (
            <View style={styles.benefitCard}>
                <Text style={styles.benefitTitle}>🔥 Beginner Perks!</Text>
                <Text style={styles.benefitText}>
                    - Get started with onboarding support 🚀{'\n'}
                    - Basic customer leads 📞
                </Text>
            </View>
        );
    }



    return (
        <View style={styles.container}>
            <View style={{ width: '100%', backgroundColor: '#309264', paddingTop: 10, paddingBottom: 10, borderRadius: 20, display: 'flex', marginTop: 30, marginBottom: 30, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', flexWrap: 'wrap', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <View><AntDesign name="arrowleft" size={24} color="white" /></View>
                </TouchableOpacity>
                <View style={{}}>
                    <Text style={{ fontSize: 20, color: 'white' }}>Agent Credits</Text>
                </View>
                <TouchableOpacity onPress={() => { navigation.navigate('Home') }} style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', flexWrap: 'wrap', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <View><AntDesign name="close" size={24} color="white" /></View>
                </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Agent Credit Score</Text>

                <View style={styles.card}>
                    <Text style={styles.score}>Your Score: {score}</Text>
                    <Text style={styles.stage}>{getStage()}</Text>
                    <Text style={styles.target}>{getNextTarget()}</Text>
                </View>

                {getBenefits()}

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center'
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        elevation: 5
    },
    score: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4caf50',
        textAlign: 'center',
        marginBottom: 10
    },
    stage: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ff9800',
        textAlign: 'center',
        marginBottom: 10
    },
    target: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20
    },
    benefitCard: {
        backgroundColor: '#ffeb3b',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        elevation: 5
    },
    benefitTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10
    },
    benefitText: {
        fontSize: 16,
        color: '#444'
    }
}
);

export default Credit;