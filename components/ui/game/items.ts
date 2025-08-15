import { Item, InstanciaItem } from '../types';
import { rollDie, rollDice } from './dice';

export function criarInstanciaItem(itemBase: Item): InstanciaItem {
    const instancia: InstanciaItem = {
        ...itemBase,
        instanceId: crypto.randomUUID(),
    };

    if (itemBase.efeitoVariavel) {
        // Parser simples para '1d4', '2d6' etc.
        const [countStr, sidesStr] = itemBase.efeitoVariavel.dado.split('d');
        const count = parseInt(countStr, 10);
        const sides = parseInt(sidesStr, 10);

        if (!isNaN(count) && !isNaN(sides)) {
            const roll = rollDice(count, sides);
            instancia.descricaoEfeitoReal = itemBase.efeitoVariavel.resultados[roll.toString()] || 'Nenhum efeito especial ocorreu.';
        } else {
             instancia.descricaoEfeitoReal = 'Falha ao rolar o efeito variável.';
        }
    }
    return instancia;
}
