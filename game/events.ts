import { EventoAleatorio } from '../types';
import { EVENTOS_ALEATORIOS } from '../constants';
import { rollDie } from './dice';

export function rolarEventoAleatorio(): EventoAleatorio {
    const roll = rollDie(1000);

    const eventosOrdenados = [...EVENTOS_ALEATORIOS].sort((a, b) => a.chance - b.chance);
    
    for (const evento of eventosOrdenados) {
        if (roll <= evento.chance) {
            return evento;
        }
    }
    
    // Fallback para o evento mais comum
    return eventosOrdenados[0];
}