import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet } from '../models/Pet';

// Função para buscar todos os pets
export const getPets = async (): Promise<Pet[]> => {
    try {
        const storedPets = await AsyncStorage.getItem('pets');
        return storedPets ? JSON.parse(storedPets) : [];
    } catch (error) {
        console.log('Erro ao buscar pets:', error);
        return [];
    }
};

// Função para atualizar um pet específico
export const updatePet = async (updatedPet: Pet) => {
    try {
        const pets = await getPets();
        const newPets = pets.map(pet => pet.id === updatedPet.id ? updatedPet : pet);
        await AsyncStorage.setItem('pets', JSON.stringify(newPets));
    } catch (error) {
        console.log('Erro ao atualizar pet:', error);
    }
};

// Função para decrementar atributos dos pets
export const decrementPetAttributes = async () => {
    const pets = await getPets();

    const updatedPets = pets.map(pet => {
        const newHunger = Math.max(pet.hunger - 1, 0);
        const newSleep = Math.max(pet.sleep - 1, 0);
        const newFun = Math.max(pet.fun - 1, 0);

        return { ...pet, hunger: newHunger, sleep: newSleep, fun: newFun };
    });

    await AsyncStorage.setItem('pets', JSON.stringify(updatedPets));
};
