import React, { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import * as BackgroundFetch from 'expo-background-fetch';
import './src/db/backgroundTasks';

const App = () => {
  useEffect(() => {
    const registerBackgroundFetch = async () => {
      try {
        await BackgroundFetch.registerTaskAsync('updatePetsTask', {
          minimumInterval: 1800,
          stopOnTerminate: false,
          startOnBoot: true,
        });
        console.log('Tarefa em segundo plano registrada com sucesso!');
      } catch (error) {
        console.error('Erro ao registrar a tarefa em segundo plano:', error);
      }
    };

    registerBackgroundFetch();
  }, []);

  return <AppNavigator />;
};

export default App;
