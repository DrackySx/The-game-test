import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Monstro, Personagem, InstanciaItem } from '../types';
import { rollDie, rollDice, rollDiceString } from '../game/dice';
import { calcularBonusAtaque, calcularDano } from '../game/character';
import { gerarLoot } from '../game/loot';
import Button from './ui/Button';

interface CombatViewProps {
  player: Personagem;
  monster: Monstro;
  playerAC: number;
  onPlayerUpdate: (updatedPlayer: Personagem) => void;
  onCombatEnd: (result: 'vitoria' | 'derrota' | 'fuga', data: { xp: number, loot: InstanciaItem | null }) => void;
}

const CombatView: React.FC<CombatViewProps> = ({ player, monster, playerAC, onPlayerUpdate, onCombatEnd }) => {
  const [heroHp, setHeroHp] = useState(player.hp);
  const [heroMana, setHeroMana] = useState(player.mana);
  const [monsterHp, setMonsterHp] = useState(monster.hp);
  const [combatLog, setCombatLog] = useState<string[]>([`Um(a) ${monster.nome} selvagem aparece!`]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  
  const addLog = useCallback((message: string) => {
    setCombatLog(prev => [message, ...prev].slice(0, 50));
  }, []);
  
  const heroAttackBonus = calcularBonusAtaque(player);
  
  const pocoesVidaCount = useMemo(() => player.inventario.filter(i => i.efeitoCura).length, [player.inventario]);
  const pocoesManaCount = useMemo(() => player.inventario.filter(i => i.efeitoMana).length, [player.inventario]);


  const handlePlayerAttack = () => {
    if (!isPlayerTurn) return;

    const attackRoll = rollDie(20);
    const totalAttack = attackRoll + heroAttackBonus;
    
    addLog(`Você ataca o ${monster.nome}...`);
    addLog(`Rolagem: ${attackRoll} + ${heroAttackBonus} = ${totalAttack}. (AC do monstro: ${monster.ac})`);

    if (attackRoll === 20 || totalAttack >= monster.ac) {
      const isCritical = attackRoll === 20;
      const damage = calcularDano(player, isCritical);
      const newMonsterHp = monsterHp - damage.total;
      addLog(`Você acertou! ${isCritical ? 'CRÍTICO! ' : ''}Causando ${damage.total} de dano.`);
      setMonsterHp(newMonsterHp);
      if (newMonsterHp <= 0) {
        addLog(`Você derrotou o ${monster.nome}!`);
        const loot = gerarLoot(monster);
        const playerWithUpdatedResources = {...player, hp: heroHp, mana: heroMana };
        onPlayerUpdate(playerWithUpdatedResources);
        onCombatEnd('vitoria', { xp: monster.xp, loot });
        return;
      }
    } else {
      addLog(`Você errou o ataque!`);
    }
    setIsPlayerTurn(false);
  };

  const usePotion = (type: 'hp' | 'mana') => {
    if (!isPlayerTurn) return;

    const potionToFind = type === 'hp' ? player.inventario.find(i => i.efeitoCura) : player.inventario.find(i => i.efeitoMana);
    if (!potionToFind) return;

    const newInventory = [...player.inventario];
    const potionIndex = newInventory.findIndex(i => i.instanceId === potionToFind.instanceId);
    if(potionIndex > -1) newInventory.splice(potionIndex, 1);
    
    let recoveredAmount = 0;
    if (type === 'hp' && potionToFind.efeitoCura) {
        recoveredAmount = rollDiceString(potionToFind.efeitoCura);
        const newHp = Math.min(player.hpMax, heroHp + recoveredAmount);
        setHeroHp(newHp);
        addLog(`Você usou ${potionToFind.nome} e recuperou ${recoveredAmount} HP!`);
    } else if (type === 'mana' && potionToFind.efeitoMana) {
        recoveredAmount = rollDiceString(potionToFind.efeitoMana);
        const newMana = Math.min(player.manaMax, heroMana + recoveredAmount);
        setHeroMana(newMana);
        addLog(`Você usou ${potionToFind.nome} e recuperou ${recoveredAmount} Mana!`);
    }
    
    onPlayerUpdate({...player, inventario: newInventory });
    setIsPlayerTurn(false);
  }
  
  useEffect(() => {
    if (!isPlayerTurn && monsterHp > 0 && heroHp > 0) {
      const timer = setTimeout(() => {
        const monsterAttackBonus = 4; // Simplificado
        const monsterAttackRoll = rollDie(20) + monsterAttackBonus;
        addLog(`O ${monster.nome} ataca...`);
        addLog(`Rolagem de ataque: ${monsterAttackRoll - monsterAttackBonus} + ${monsterAttackBonus} = ${monsterAttackRoll}. (Sua AC: ${playerAC})`);

        if (monsterAttackRoll >= playerAC) {
          const damageRoll = rollDice(1, 6) + 2; // Simplificado
          const newHeroHp = heroHp - damageRoll;
          addLog(`O ${monster.nome} acertou, causando ${damageRoll} de dano!`);
          setHeroHp(newHeroHp);
          if (newHeroHp <= 0) {
            addLog(`Você foi derrotado...`);
            onPlayerUpdate({...player, hp: 0, mana: heroMana });
            onCombatEnd('derrota', { xp: 0, loot: null });
          }
        } else {
          addLog(`O ${monster.nome} errou o ataque!`);
        }
        setIsPlayerTurn(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, heroHp, monsterHp, playerAC, monster.nome, addLog, onCombatEnd, heroMana, player, onPlayerUpdate]);

  return (
    <div>
        <h1 className="font-title text-5xl text-yellow-400 text-center mb-6">Combate!</h1>

        <div className="grid md:grid-cols-2 gap-8 mb-6">
          <div className="bg-blue-900 bg-opacity-30 border-2 border-blue-500 p-4 rounded-lg">
            <h2 className="text-2xl font-bold text-blue-300">{player.nome}</h2>
            <div className="text-lg">AC: {playerAC}</div>
            <div className="text-lg">HP: {heroHp > 0 ? heroHp : 0} / {player.hpMax} | Mana: {heroMana} / {player.manaMax}</div>
            <div className="w-full bg-gray-700 rounded-full h-4 mt-2"><div className="bg-green-600 h-4 rounded-full" style={{ width: `${(heroHp / player.hpMax) * 100}%` }}></div></div>
            <div className="w-full bg-gray-700 rounded-full h-4 mt-1"><div className="bg-blue-500 h-4 rounded-full" style={{ width: `${(heroMana / player.manaMax) * 100}%` }}></div></div>
          </div>
          <div className="bg-red-900 bg-opacity-30 border-2 border-red-500 p-4 rounded-lg">
            <h2 className="text-2xl font-bold text-red-300">{monster.nome}</h2>
            <div className="text-lg">AC: {monster.ac}</div>
            <div className="text-lg">HP: {monsterHp > 0 ? monsterHp : 0} / {monster.hp}</div>
            <div className="w-full bg-gray-700 rounded-full h-4 mt-2"><div className="bg-red-600 h-4 rounded-full" style={{ width: `${(monsterHp / monster.hp) * 100}%` }}></div></div>
          </div>
        </div>

        <div className="text-center mb-6 flex justify-center gap-2 flex-wrap">
            <Button onClick={handlePlayerAttack} disabled={!isPlayerTurn || heroHp <= 0 || monsterHp <= 0}>
              {isPlayerTurn ? 'Atacar!' : 'Aguardando...'}
            </Button>
            <Button onClick={() => usePotion('hp')} disabled={!isPlayerTurn || heroHp <= 0 || monsterHp <= 0 || pocoesVidaCount === 0 || heroHp === player.hpMax} variant="secondary">
              Poção HP ({pocoesVidaCount})
            </Button>
             <Button onClick={() => usePotion('mana')} disabled={!isPlayerTurn || heroHp <= 0 || monsterHp <= 0 || pocoesManaCount === 0 || heroMana === player.manaMax} variant="secondary">
              Poção Mana ({pocoesManaCount})
            </Button>
            <Button onClick={() => onCombatEnd('fuga', { xp: 0, loot: null })} variant="secondary" disabled={heroHp <= 0 || monsterHp <= 0}>
                Fugir
            </Button>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 h-64 overflow-y-auto flex flex-col-reverse">
            {combatLog.map((msg, index) => (
                <p key={index} className={`p-1 ${index === 0 ? 'text-white' : 'text-gray-400'}`}>{msg}</p>
            ))}
        </div>
      </div>
  );
};

export default CombatView;