import { InstanciaItem, Monstro, Raridade } from '../types';
import { ITENS, TABELA_LOOT } from '../constants';
import { rollDie } from './dice';
import { criarInstanciaItem } from './items';

// Gera um item como recompensa após o combate
export function gerarLoot(monstro: Monstro): InstanciaItem | null {
    // 50% de chance base de dropar um item
    if (rollDie(100) <= 50) {
        return null;
    }

    const roll = rollDie(10000);
    const raridadesOrdenadas = (Object.keys(TABELA_LOOT) as unknown as Raridade[]).sort((a,b) => TABELA_LOOT[a]!.chance - TABELA_LOOT[b]!.chance);

    for (const raridade of raridadesOrdenadas) {
        const lootInfo = TABELA_LOOT[raridade];
        if (lootInfo && roll <= lootInfo.chance) {
            // Encontrou a raridade, agora seleciona um item
            const itensPossiveis = lootInfo.itens;
            if (itensPossiveis.length > 0) {
                const nomeItemEscolhido = itensPossiveis[Math.floor(Math.random() * itensPossiveis.length)];
                const itemBase = ITENS.find(i => i.nome === nomeItemEscolhido);
                if (itemBase) {
                    return criarInstanciaItem(itemBase);
                }
            }
        }
    }

    return null; // Nenhum loot gerado
}
