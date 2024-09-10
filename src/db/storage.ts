import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet } from '../models/Pet';

export const getPets = async (): Promise<Pet[]> => {
    try {
        const storedPets = await AsyncStorage.getItem('pets');
        return storedPets ? JSON.parse(storedPets) : [];
    } catch (error) {
        console.log('Erro ao buscar pets:', error);
        return [];
    }
};

export const updatePet = async (updatedPet: Pet) => {
    try {
        const pets = await getPets();
        const newPets = pets.map(pet => pet.id === updatedPet.id ? updatedPet : pet);
        await AsyncStorage.setItem('pets', JSON.stringify(newPets));
    } catch (error) {
        console.log('Erro ao atualizar pet:', error);
    }
};
