import { Monstro } from '../types';
import { MONSTROS } from '../constants';
import { rollDie } from './dice';

export function encontrarMonstro(): Monstro {
    const roll = rollDie(100000);
    
    // Ordena os monstros pela chance para garantir que o primeiro encontrado seja o correto
    const monstrosOrdenados = [...MONSTROS].sort((a, b) => a.chanceEncontro - b.chanceEncontro);

    for (const monstro of monstrosOrdenados) {
        if (roll <= monstro.chanceEncontro) {
            return monstro;
        }
    }
    
    // Fallback para o monstro mais comum, caso algo dê errado
    return monstrosOrdenados[0];
}