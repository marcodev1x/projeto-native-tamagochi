import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert } from 'react-native';
import { Pet } from '../models/Pet';
import { getPets, updatePet } from '../db/storage'; // Importa funções do storage

const PetDetailScreen: React.FC<{ route: any; navigation: any; }> = ({ route, navigation }) => {
    const { petId } = route.params; // Recebe o ID do pet
    const [updatedPet, setUpdatedPet] = useState<Pet | null>(null);

    useEffect(() => {
        console.log(`PetDetailScreen: petId recebido = ${petId}`);

        // Função para carregar o pet do AsyncStorage
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

                updatePet(updatedPet); // Atualiza o pet no AsyncStorage

                return updatedPet;
            });
        }, 3600000); // Atualiza a cada 1 hora

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
            updatePet(updated); // Salva no AsyncStorage
            return updated;
        });
    };

    const handleSleep = async () => {
        setUpdatedPet(prev => {
            if (!prev) return null;

            const updated = { ...prev, sleep: Math.min(prev.sleep + 10, 100) };
            updatePet(updated); // Salva no AsyncStorage
            return updated;
        });
    };

    const handlePlay = async () => {
        setUpdatedPet(prev => {
            if (!prev) return null;

            const updated = { ...prev, fun: Math.min(prev.fun + 20, 100) };
            updatePet(updated); // Salva no AsyncStorage
            return updated;
        });
        navigation.navigate('Encontre o par'); // Navega para a tela "Jogo da Adivinhação"
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
                <Button title="Alimentar" onPress={handleFeed} />
            </View>
            <View style={styles.buttonContainer}>
                <Button title="Dormir" onPress={handleSleep} />
            </View>
            <View style={styles.buttonContainer}>
                <Button title="Brincar" onPress={handlePlay} />
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
        marginVertical: 10, // Espaçamento para cima e para baixo
    },
});

export default PetDetailScreen;
