import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const generateCards = () => {
    const cards = ['🍎', '🍌', '🍓', '🍉'];
    return [...cards, ...cards]
        .sort(() => Math.random() - 0.5)
        .map((card, index) => ({ id: index, emoji: card, flipped: false, matched: false }));
};

export default function FindThePairs() {
    const [cards, setCards] = useState(generateCards());
    const [selectedCards, setSelectedCards] = useState<any[]>([]);
    const [matches, setMatches] = useState(0);

    useEffect(() => {
        if (selectedCards.length === 2) {
            const [card1, card2] = selectedCards;

            if (card1.emoji === card2.emoji) {
                const matchedCards = cards.map((c) =>
                    c.emoji === card1.emoji ? { ...c, matched: true } : c
                );
                setCards(matchedCards);
                setMatches(matches + 1);
            } else {
                setTimeout(() => {
                    const resetCards = cards.map((c) =>
                        selectedCards.includes(c) ? { ...c, flipped: false } : c
                    );
                    setCards(resetCards);
                }, 1000);
            }

            setSelectedCards([]);
        }
    }, [selectedCards]);

    const handleCardPress = (card: any) => {
        if (selectedCards.length === 2 || card.flipped || card.matched) return;

        const newSelectedCards = [...selectedCards, card];
        setSelectedCards(newSelectedCards);

        const newCards = cards.map((c) => (c.id === card.id ? { ...c, flipped: true } : c));
        setCards(newCards);
    };

    const resetGame = () => {
        setCards(generateCards());
        setSelectedCards([]);
        setMatches(0);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Encontre o par!</Text>
            <Text style={styles.subtitle}>Encontre pares de fruta em sequência para ganhar pontos</Text>
            <View style={styles.grid}>
                {cards.map((card) => (
                    <TouchableOpacity
                        key={card.id}
                        style={styles.card}
                        onPress={() => handleCardPress(card)}
                    >
                        <Text style={styles.emoji}>{card.flipped || card.matched ? card.emoji : '❓'}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.footer}>
                <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
                    <Text style={styles.resetButtonText}>Resetar Jogo</Text>
                </TouchableOpacity>
                <Text style={styles.matchesText}>Pares encontrados: {matches}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 20,
    },
    card: {
        width: 70,
        height: 70,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
    },
    emoji: {
        fontSize: 30,
    },
    footer: {
        alignItems: 'center',
    },
    resetButton: {
        backgroundColor: '#a140ff',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    resetButtonText: {
        color: 'white',
        fontSize: 18,
    },
    matchesText: {
        fontSize: 18,
        marginTop: 10,
    },
});
