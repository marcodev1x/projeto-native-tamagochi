import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { Pet } from '../models/Pet';
import { getPets, updatePet } from '../db/storage';

const PetDetailScreen: React.FC<{ route: any; navigation: any; }> = ({ route, navigation }) => {
    const { petId } = route.params;
    const [updatedPet, setUpdatedPet] = useState<Pet | null>(null);

    useEffect(() => {
        console.log(`PetDetailScreen: petId recebido = ${petId}`);

        const loadPet = async () => {
            try {
                const pets = await getPets();
                console.log('Pets carregados do AsyncStorage:', pets);
                const pet = pets.find(p => p.id === petId);
                if (pet) {
                    setUpdatedPet(pet);
                } else {
                    Alert.alert('Pet não encontrado');
                }
            } catch (error) {
                console.log('Erro ao carregar pet:', error);
            }
        };

        loadPet();

        const interval = setInterval(() => {
            setUpdatedPet(prev => {
                if (!prev) return null;

                const newHunger = Math.max(prev.hunger - 1, 0);
                const newSleep = Math.max(prev.sleep - 1, 0);
                const newFun = Math.max(prev.fun - 1, 0);

                if (newHunger === 0 && newSleep === 0 && newFun === 0) {
                    clearInterval(interval);
                    Alert.alert('Seu pet morreu');
                }

                const updatedPet = {
                    ...prev,
                    hunger: newHunger,
                    sleep: newSleep,
                    fun: newFun,
                };

                updatePet(updatedPet);

                return updatedPet;
            });
        }, 3600000);

        return () => clearInterval(interval);
    }, [petId]);

    if (!updatedPet) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    const handleFeed = async () => {
        setUpdatedPet(prev => {
            if (!prev) return null;

            const updated = { ...prev, hunger: Math.min(prev.hunger + 10, 100) };
            updatePet(updated);
            return updated;
        });
    };

    const handleSleep = async () => {
        setUpdatedPet(prev => {
            if (!prev) return null;

            const updated = { ...prev, sleep: Math.min(prev.sleep + 10, 100) };
            updatePet(updated);
            return updated;
        });
    };

    const handlePlay = async () => {
        setUpdatedPet(prev => {
            if (!prev) return null;

            const updated = { ...prev, fun: Math.min(prev.fun + 20, 100) };
            updatePet(updated);
            return updated;
        });
        navigation.navigate('Encontre o par');
    };

    return (
        <View style={styles.container}>
            <Image source={{ uri: updatedPet.imageUri }} style={styles.image} />
            <Text style={styles.name}>{updatedPet.name}</Text>
            <Text>Fome: {updatedPet.hunger}</Text>
            <Text>Sono: {updatedPet.sleep}</Text>
            <Text>Diversão: {updatedPet.fun}</Text>
            <Text>Status: {calculateStatus(updatedPet.hunger, updatedPet.sleep, updatedPet.fun)}</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.secondaryButton} onPress={handleFeed}>
                    <Text style={styles.secondaryButtonText}>Alimentar</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.secondaryButton} onPress={handleSleep}>
                    <Text style={styles.secondaryButtonText}>Dormir</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.secondaryButton} onPress={handlePlay}>
                    <Text style={styles.secondaryButtonText}>Brincar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const calculateStatus = (hunger: number, sleep: number, fun: number) => {
    const total = hunger + sleep + fun;

    if (total === 0) return 'morto';
    if (total <= 50) return 'crítico';
    if (total <= 100) return 'muito triste';
    if (total <= 150) return 'triste';
    if (total <= 200) return 'ok';
    if (total <= 250) return 'bem';
    return 'muito bem';
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 10,
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    buttonContainer: {
        marginVertical: 10,
    },
    secondaryButton: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#a140ff',
        borderRadius: 5,
        padding: 10,
        width: '80%',
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#a140ff',
        fontWeight: 'bold',
    },
});

export default PetDetailScreen;
