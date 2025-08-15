import { Personagem, Atributo, InstanciaItem, Equipamento, Item } from '../types';
import { XP_PARA_NIVEL } from '../constants';
import { rollDie } from './dice';

export const getModifier = (score: number): number => Math.floor((score - 10) / 2);

export const calcularAC = (personagem: Personagem): number => {
    let baseAC = 10;
    const dexModifier = getModifier(personagem.atributos[Atributo.DES]);
    let armorBonus = 0;
    if (personagem.equipamento.armadura) {
        // Simplificado: Assumindo que o bônus de armadura se acumula
        armorBonus += personagem.equipamento.armadura.bonusAC || 0;
    }
    return baseAC + dexModifier + armorBonus;
};

export const calcularBonusAtaque = (personagem: Personagem): number => {
    const profBonus = Math.floor((personagem.nivel - 1) / 4) + 2;
    const attr = personagem.classe.atributoPrimario;
    const attrModifier = getModifier(personagem.atributos[attr]);
    const weaponBonus = personagem.equipamento.arma?.bonusDano || 0;
    return profBonus + attrModifier + weaponBonus;
};

export const calcularDano = (personagem: Personagem, isCrit: boolean): { roll: number, modifier: number, total: number } => {
    const attr = personagem.classe.atributoPrimario;
    const attrModifier = getModifier(personagem.atributos[attr]);
    const weapon = personagem.equipamento.arma;

    const dieSides = weapon?.dadoDano || 4; // Dano desarmado d4
    let diceCount = isCrit ? 2 : 1;
    
    let roll = 0;
    for(let i = 0; i < diceCount; i++) {
        roll += Math.floor(Math.random() * dieSides) + 1;
    }

    const total = roll + attrModifier + (weapon?.bonusDano || 0);
    return { roll, modifier: attrModifier + (weapon?.bonusDano || 0), total: Math.max(1, total) }; // Garante pelo menos 1 de dano
}

export const ganharXP = (personagem: Personagem, xpGanha: number): { personagemAtualizado: Personagem, subiuDeNivel: boolean } => {
    const personagemAtualizado = { ...personagem, xp: personagem.xp + xpGanha };
    let subiuDeNivel = false;
    
    while (personagemAtualizado.nivel < XP_PARA_NIVEL.length && personagemAtualizado.xp >= XP_PARA_NIVEL[personagemAtualizado.nivel]) {
        personagemAtualizado.nivel++;
        subiuDeNivel = true;

        // Aumentar HP e curar
        const conMod = getModifier(personagemAtualizado.atributos[Atributo.CON]);
        const vidaGanha = rollDie(personagemAtualizado.classe.dadoDeVida) + conMod;
        personagemAtualizado.hpMax += Math.max(1, vidaGanha);
        personagemAtualizado.hp = personagemAtualizado.hpMax; // Cura completa ao subir de nível

        // Aumentar Mana
        const manaAttr = personagem.classe.nome === 'Clérigo' ? Atributo.SAB : Atributo.INT;
        const manaMod = getModifier(personagemAtualizado.atributos[manaAttr]);
        const manaGanha = rollDie(4) + manaMod; // d4 para mana
        if (personagemAtualizado.classe.manaBase > 0) {
            personagemAtualizado.manaMax += Math.max(0, manaGanha);
            personagemAtualizado.mana = personagemAtualizado.manaMax;
        }

        // Adicionar ponto de atributo
        personagemAtualizado.pontosAtributo = (personagemAtualizado.pontosAtributo || 0) + 1;
    }

    return { personagemAtualizado, subiuDeNivel };
};


export const calcularPoderEquipamento = (item?: Item): number => {
    if (!item) return 0;
    let power = 0;
    power += (item.raridade + 1) * 10;
    power += (item.bonusAC || 0) * 8;
    power += (item.bonusDano || 0) * 8;
    power += (item.dadoDano || 0) * 2;
    return power;
}