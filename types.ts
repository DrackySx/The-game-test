export enum Atributo {
    FOR = 'Força',
    DES = 'Destreza',
    CON = 'Constituição',
    INT = 'Inteligência',
    SAB = 'Sabedoria',
    CAR = 'Carisma',
}

export type Atributos = Record<Atributo, number>;

export enum Raridade {
    Comum,
    Incomum,
    Raro,
    Epico,
    Lendario,
    Mitico,
    Divino,
    Extremo,
    Artefato,
    Cosmico,
}

export type ItemTipo = 'Arma' | 'Armadura' | 'Consumível' | 'Especial';

export interface EfeitoVariavel {
    dado: string; // ex: '1d4'
    resultados: Record<string, string>; // ex: { '1': 'Dano de Fogo', '2': 'Dano de Gelo', ... }
}

export interface Item {
    nome: string;
    raridade: Raridade;
    descricao: string;
    efeito: string;
    tipo: ItemTipo;
    bonusAC?: number;
    bonusDano?: number;
    dadoDano?: number;
    efeitoAI?: boolean;
    efeitoVariavel?: EfeitoVariavel;
    efeitoCura?: string; // ex: '2d4+2'
    efeitoMana?: string; // ex: '2d4+2'
}

export interface InstanciaItem extends Item {
    instanceId: string;
    descricaoEfeitoReal?: string; // ex: 'Causa Dano de Fogo'
}

export interface Magia {
    nome: string;
    raridade: Raridade;
    descricao: string;
    tipo: string;
}

export interface Monstro {
    nome: string;
    hp: number;
    ac: number;
    ataque: string;
    raridade: Raridade;
    descricao: string;
    xp: number;
    chanceEncontro: number; // Limite superior em um d100000
}

export interface EfeitoEvento {
    tipo: 'ouro' | 'item' | 'combate' | 'cura_hp' | 'cura_mana' | 'nada' | 'desejo';
    valor?: any; // e.g., '2d10' for gold, 'Item Name' for item, 'Monster Name' for combat
}

export interface EventoAleatorio {
    titulo: string;
    descricao: string;
    chance: number; // Limite superior em um d1000
    efeito?: EfeitoEvento;
}

// Novos Tipos
export interface Raca {
    nome: string;
    bonus: Partial<Atributos>;
    tracos: string[];
}

export interface Classe {
    nome: string;
    atributoPrimario: Atributo;
    dadoDeVida: number; // ex. 10 para d10
    equipamentosIniciais: string[]; // Nomes dos itens
    manaBase: number;
}

export interface Equipamento {
    arma?: InstanciaItem;
    armadura?: InstanciaItem;
}

export interface Personagem {
    id: string; // para identificação única
    nome: string;
    nivel: number;
    xp: number;
    raca: Raca;
    classe: Classe;
    atributos: Atributos;
    hp: number;
    hpMax: number;
    mana: number;
    manaMax: number;
    ouro: number;
    // AC é calculado dinamicamente
    inventario: InstanciaItem[];
    equipamento: Equipamento;
    pontosIA: number;
    pontosAtributo: number;
}