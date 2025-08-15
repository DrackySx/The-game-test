// Simples função para rolar um dado com N lados
export const rollDie = (sides: number): number => {
    return Math.floor(Math.random() * sides) + 1;
};

// Rola múltiplos dados e soma os resultados
export const rollDice = (count: number, sides: number): number => {
    let total = 0;
    for (let i = 0; i < count; i++) {
        total += rollDie(sides);
    }
    return total;
};

// Rola 4d6 e descarta o menor resultado
export const roll4d6DropLowest = (): number => {
    const rolls: number[] = [];
    for (let i = 0; i < 4; i++) {
        rolls.push(rollDie(6));
    }
    
    rolls.sort((a, b) => a - b); // Ordena do menor para o maior
    rolls.shift(); // Remove o primeiro (menor)
    
    return rolls.reduce((sum, current) => sum + current, 0);
};

// Interpreta uma string de dado (ex: '2d10') e rola os dados
export const rollDiceString = (diceString: string): number => {
    const match = diceString.match(/(\d+)d(\d+)/i);
    if (!match) return 0;

    const count = parseInt(match[1], 10);
    const sides = parseInt(match[2], 10);

    if (isNaN(count) || isNaN(sides)) return 0;

    return rollDice(count, sides);
}