import * as TaskManager from 'expo-task-manager';
import {decrementPetAttributes } from './storage';

TaskManager.defineTask('updatePetsTask', async () => {
    console.log('Tarefa de atualização de pets executada');
    try {
        await decrementPetAttributes();
        return 'Fim';
    } catch (error) {
        console.error('Erro ao atualizar pets em segundo plano:', error);
        return 'Error';
    }
});
