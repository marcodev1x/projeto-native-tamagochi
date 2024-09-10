import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TextInput, Image, TouchableOpacity, TouchableHighlight } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Pet {
    id: string;
    name: string;
    hunger: number;
    sleep: number;
    fun: number;
    imageUri?: string;
}

export default function PetListScreen({ navigation }: any) {
    const [pets, setPets] = useState<Pet[]>([]);
    const [editingPet, setEditingPet] = useState<Pet | null>(null);
    const [updatedName, setUpdatedName] = useState('');

    // Função para buscar os pets do AsyncStorage
    const fetchPets = async () => {
        try {
            const storedPets = await AsyncStorage.getItem('pets');
            console.log('Pets armazenados:', storedPets); // Verifique o conteúdo aqui
            if (storedPets) {
                setPets(JSON.parse(storedPets));
            }
        } catch (error) {
            console.log('Error fetching pets:', error);
        }
    };

    // Função para atualizar o pet no AsyncStorage
    const handleUpdatePet = async (pet: Pet) => {
        const updatedPets = pets.map((p) => (p.id === pet.id ? { ...p, name: updatedName || p.name } : p));
        setPets(updatedPets);
        setEditingPet(null);
        await AsyncStorage.setItem('pets', JSON.stringify(updatedPets));
    };

    // Função para excluir um pet do AsyncStorage
    const handleDeletePet = async (petId: string) => {
        const updatedPets = pets.filter((p) => p.id !== petId);
        setPets(updatedPets);
        await AsyncStorage.setItem('pets', JSON.stringify(updatedPets));
    };

    // Buscar pets ao montar a tela
    useEffect(() => {
        fetchPets();
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={pets}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.petItem}>
                        <TouchableHighlight
                            onPress={() => {
                                console.log(`Navigating to PetDetailScreen with petId: ${item.id}`);
                                navigation.navigate('PetDetailScreen', { petId: item.id });
                            }}
                        >
                            <Image source={{ uri: item.imageUri }} style={styles.petImage} />
                        </TouchableHighlight>
                        {editingPet && editingPet.id === item.id ? (
                            <View>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Novo nome"
                                    value={updatedName}
                                    onChangeText={setUpdatedName}
                                />
                                <View style={styles.buttonContainer}>
                                <Button title="Salvar" onPress={() => handleUpdatePet(item)} />
                                <Button title="Cancelar" onPress={() => setEditingPet(null)} />
                                </View>
                            </View>
                        ) : (
                            <View>
                                <Text style={styles.petName}>{item.name}</Text>
                                <Text>Fome: {item.hunger}</Text>
                                <Text>Sono: {item.sleep}</Text>
                                <Text>Diversão: {item.fun}</Text>
                                <View style={styles.buttonContainer}>
                                    <Button title="Editar" onPress={() => setEditingPet(item)} />
                                    <Button title="Excluir" onPress={() => handleDeletePet(item.id)} />
                                </View>
                            </View>
                        )}
                    </View>
                )}
            />
            <TouchableOpacity style={styles.updateButton} onPress={fetchPets}>
                <Text style={styles.updateButtonText}>Atualizar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    petItem: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    petName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    petImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    input: {
        borderColor: '#cccccc',
        borderWidth: 1,
        padding: 8,
        marginBottom: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        gap: 10
    },
    updateButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    updateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
