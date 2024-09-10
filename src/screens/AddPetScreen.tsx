import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PETS_KEY = 'pets';

const AddPetScreen: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [imageUri, setImageUri] = useState<string | null>(null);

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão de acesso à galeria é necessária!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        if (!name || !imageUri) {
            Alert.alert('Por favor, preencha o nome e selecione uma imagem.');
            return;
        }

        try {
            const storedPets = await AsyncStorage.getItem(PETS_KEY);
            const pets = storedPets ? JSON.parse(storedPets) : [];

            const newPet = {
                id: Date.now().toString(),
                name,
                imageUri,
                hunger: 100,
                sleep: 100,
                fun: 100,
            };

            pets.push(newPet);
            await AsyncStorage.setItem(PETS_KEY, JSON.stringify(pets));

            Alert.alert('Pet cadastrado com sucesso!');

            setName('');
            setImageUri(null);
        } catch (error) {
            console.error('Erro ao cadastrar pet', error);
            Alert.alert('Erro ao cadastrar pet');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cadastrar Novo Pet</Text>
            <TextInput
                style={styles.input}
                placeholder="Nome do Pet"
                value={name}
                onChangeText={setName}
            />
            <View style={styles.buttonContainer}>
                <Button title="Escolher Imagem" onPress={handlePickImage} />
            </View>
            {imageUri && (
                <Image source={{ uri: imageUri }} style={styles.image} />
            )}
            <View style={styles.buttonContainer}>
                <Button title="Cadastrar Pet" onPress={handleSubmit} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        width: '80%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginBottom: 20,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginVertical: 20,
    },
    buttonContainer: {
        marginVertical: 10, // Espaçamento entre os botões
    },
});

export default AddPetScreen;
