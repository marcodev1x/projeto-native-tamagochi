import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function GuessNumberScreen() {
    const [randomNumber, setRandomNumber] = useState<number>(Math.floor(Math.random() * 100) + 1);
    const [guess, setGuess] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const handleGuess = () => {
        const guessNumber = parseInt(guess, 10);
        if (isNaN(guessNumber)) {
            setMessage('Por favor, insira um número válido.');
            return;
        }

        if (guessNumber < randomNumber) {
            setMessage('Muito baixo! Tente novamente.');
        } else if (guessNumber > randomNumber) {
            setMessage('Muito alto! Tente novamente.');
        } else {
            setMessage('Parabéns! Você adivinhou o número!');
        }
    };

    const resetGame = () => {
        setRandomNumber(Math.floor(Math.random() * 100) + 1);
        setGuess('');
        setMessage('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Adivinhe o Número</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Digite seu palpite"
                value={guess}
                onChangeText={setGuess}
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleGuess}>
                    <Text style={styles.buttonText}>Fazer Palpite</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={resetGame}>
                    <Text style={styles.buttonText}>Resetar Jogo</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.message}>{message}</Text>
        </View>
    );
}

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
    buttonContainer: {
        marginVertical: 10,
    },
    button: {
        backgroundColor: '#a140ff',
        padding: 10,
        borderRadius: 5,
    },
    resetButton: {
        backgroundColor: 'red',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    message: {
        fontSize: 18,
        marginTop: 20,
    },
});
