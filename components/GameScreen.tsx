import React, { useState, useCallback } from 'react';
import { Personagem, Monstro, InstanciaItem, EventoAleatorio } from '../types';
import { XP_PARA_NIVEL, ITENS, MONSTROS } from '../constants';
import { saveCharacter } from '../game/storage';
import { calcularAC, ganharXP, getModifier } from '../game/character';
import { encontrarMonstro } from '../game/encounters';
import { rolarEventoAleatorio } from '../game/events';
import { rollDie, rollDiceString } from '../game/dice';
import { criarInstanciaItem } from '../game/items';
import Button from './ui/Button';
import CombatView from './CombatView';
import InventoryScreen from './InventoryScreen';
import AIInteractionModal, { AIContext } from './AIInteractionModal';
import LootDisplay from './LootDisplay';
import StatsScreen from './StatsScreen';
import SkillTreeScreen from './SkillTreeScreen';


interface GameScreenProps {
  character: Personagem;
  onExit: () => void;
}

type GameMode = 'explorando' | 'combate' | 'inventario' | 'usandoIA' | 'evento' | 'atributos' | 'habilidades';

const GameScreen: React.FC<GameScreenProps> = ({ character, onExit }) => {
  const [player, setPlayer] = useState<Personagem>(character);
  const [mode, setMode] = useState<GameMode>('explorando');
  const [monster, setMonster] = useState<Monstro | null>(null);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [aiContext, setAIContext] = useState<AIContext | null>(null);
  const [lootDrop, setLootDrop] = useState<InstanciaItem | null>(null);
  const [canRest, setCanRest] = useState(false);
  
  const playerAC = calcularAC(player);

  const updatePlayer = useCallback((updatedPlayer: Personagem, message?: string) => {
    setPlayer(updatedPlayer);
    saveCharacter(updatedPlayer);
    if(message) setLastMessage(message);
  }, []);
  
  const applyEventEffect = (evento: EventoAleatorio, currentCharacter: Personagem): Personagem => {
        let characterAfterEffect = { ...currentCharacter };
        let eventMessage = `[EVENTO] ${evento.titulo}: ${evento.descricao}`;

        const efeito = evento.efeito;
        if (efeito && efeito.tipo !== 'nada') {
            switch (efeito.tipo) {
                case 'ouro':
                    const goldGained = rollDiceString(efeito.valor);
                    characterAfterEffect.ouro += goldGained;
                    eventMessage += `\nVocê encontrou ${goldGained} moedas de ouro!`;
                    break;
                case 'item':
                    const itemBase = ITENS.find(i => i.nome === efeito.valor);
                    if (itemBase) {
                        const instancia = criarInstanciaItem(itemBase);
                        characterAfterEffect.inventario = [...characterAfterEffect.inventario, instancia];
                        eventMessage += `\nVocê obteve: ${itemBase.nome}!`;
                    }
                    break;
                case 'combate':
                    const monstroEvento = MONSTROS.find(m => m.nome === efeito.valor);
                    if (monstroEvento) {
                        setMonster(monstroEvento);
                        setMode('combate');
                        eventMessage += `\nPrepare-se para lutar!`;
                    }
                    break;
                case 'cura_hp':
                    const hpRecuperado = Math.min(characterAfterEffect.hpMax - characterAfterEffect.hp, efeito.valor);
                    characterAfterEffect.hp += hpRecuperado;
                    eventMessage += `\nVocê recuperou ${hpRecuperado} HP.`;
                    break;
                case 'cura_mana':
                     const manaRecuperada = Math.min(characterAfterEffect.manaMax - characterAfterEffect.mana, efeito.valor);
                    characterAfterEffect.mana += manaRecuperada;
                    eventMessage += `\nVocê recuperou ${manaRecuperada} Mana.`;
                    break;
                case 'desejo':
                    setAIContext({
                        title: evento.titulo,
                        description: evento.descricao,
                        type: 'event'
                    });
                    setMode('usandoIA');
                    eventMessage += `\nFaça seu pedido...`;
                    break;
            }
        }
        setLastMessage(eventMessage);
        return characterAfterEffect;
  }
  
  const rollForEvent = (currentCharacter: Personagem) => {
      // 30% de chance de evento após uma ação
      if(rollDie(100) <= 30) {
          const evento = rolarEventoAleatorio();
          const finalPlayerState = applyEventEffect(evento, currentCharacter);
          updatePlayer(finalPlayerState);
      } else {
          updatePlayer(currentCharacter);
      }
  }


  const startCombat = () => {
    setMonster(encontrarMonstro());
    setMode('combate');
    setLastMessage(null);
    setLootDrop(null);
  };

  const handleCombatEnd = (result: 'vitoria' | 'derrota' | 'fuga', data: { xp: number, loot: InstanciaItem | null}) => {
    let finalPlayerState = player;
    if (result === 'vitoria') {
        const { personagemAtualizado, subiuDeNivel } = ganharXP(player, data.xp);
        finalPlayerState = personagemAtualizado;
        let message = `Você venceu e ganhou ${data.xp} XP!`;
        if (subiuDeNivel) {
            message += `\n🎉 VOCÊ SUBIU PARA O NÍVEL ${finalPlayerState.nivel}! 🎉\nVocê tem pontos para distribuir em Atributos.`;
        }
        setLastMessage(message);
        setCanRest(true);
        
        if(data.loot) {
            setLootDrop(data.loot);
            updatePlayer(finalPlayerState); // Salva o ganho de XP antes de mostrar o loot
        } else {
            // Se não houver loot, rola para evento imediatamente
            rollForEvent(finalPlayerState);
        }
    } else if (result === 'derrota') {
        finalPlayerState = {...player, hp: 0};
        updatePlayer(finalPlayerState);
        setLastMessage('Você foi derrotado...');
        setCanRest(false);
    } else {
        setLastMessage('Você fugiu da batalha!');
        setCanRest(false);
    }
    setMonster(null);
    setMode('explorando');
  };

  const handleRest = () => {
      if(!canRest) {
        setLastMessage("Você só pode descansar após uma batalha vitoriosa.");
        return;
      }

      let messages: string[] = [];
      let playerAfterRest = {...player};

      if (player.hp < player.hpMax) {
          const dieSize = player.hpMax < 40 ? 8 : player.hpMax < 80 ? 10 : 12;
          const conMod = getModifier(player.atributos['Constituição']);
          const hpRecuperado = Math.max(1, rollDie(dieSize) + conMod);
          playerAfterRest.hp = Math.min(player.hpMax, player.hp + hpRecuperado);
          messages.push(`recupera ${hpRecuperado} HP`);
      }
      if (player.mana < player.manaMax) {
          const dieSize = player.manaMax < 25 ? 6 : player.manaMax < 50 ? 8 : 10;
          const intMod = getModifier(player.atributos['Inteligência']);
          const manaRecuperada = Math.max(1, rollDie(dieSize) + intMod);
          playerAfterRest.mana = Math.min(player.manaMax, player.mana + manaRecuperada);
          messages.push(`recupera ${manaRecuperada} Mana`);
      }

      setCanRest(false);
      if (messages.length > 0) {
          setLastMessage(`Você descansa e ${messages.join(' e ')}.`);
          rollForEvent(playerAfterRest);
      } else {
          setLastMessage('Você já está com seus recursos cheios!');
      }
      
      setLootDrop(null);
  }

  const handleUseAIItem = (item: InstanciaItem) => {
      setAIContext({
          title: `Usar: ${item.nome}`,
          description: item.efeito,
          type: 'item'
      });
      setMode('usandoIA');
  }

  const handleCollectLoot = () => {
      if (!lootDrop) return;
      const newInventory = [...player.inventario, lootDrop];
      const playerAfterLoot = {...player, inventario: newInventory };
      setLootDrop(null);
      // Rola para evento após coletar o loot
      rollForEvent(playerAfterLoot);
  }

  const renderContent = () => {
    switch (mode) {
      case 'combate':
        if (monster) {
          return <CombatView player={player} onPlayerUpdate={updatePlayer} monster={monster} onCombatEnd={handleCombatEnd} playerAC={playerAC} />;
        }
        return null;
      case 'inventario':
        return <InventoryScreen character={player} onUpdateCharacter={updatePlayer} onBack={() => setMode('explorando')} onUseAIItem={handleUseAIItem} />;
      case 'atributos':
        return <StatsScreen character={player} onUpdateCharacter={updatePlayer} onBack={() => setMode('explorando')} />;
      case 'habilidades':
        return <SkillTreeScreen onBack={() => setMode('explorando')} />;
      case 'usandoIA':
        return aiContext && <AIInteractionModal context={aiContext} character={player} onUpdateCharacter={updatePlayer} onClose={() => { setAIContext(null); setMode('explorando'); }} />;
      case 'explorando':
      default:
        return (
          <div className="text-center">
            <h2 className="font-title text-4xl text-yellow-400 mb-4">Explorando</h2>
            {lastMessage && <p className="text-lg text-yellow-300 mb-6 bg-gray-800 p-3 rounded-md whitespace-pre-line">{lastMessage}</p>}
            
            {lootDrop ? (
                <LootDisplay item={lootDrop} character={player} onCollect={handleCollectLoot} />
            ) : (
                <>
                    <p className="text-gray-300 mb-8">Você está em uma área desconhecida. O que você faz?</p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 flex-wrap">
                        <Button onClick={startCombat} disabled={player.hp <= 0}>Procurar Encrenca</Button>
                        <Button onClick={() => setMode('inventario')} variant="secondary">Mochila</Button>
                        <Button onClick={() => setMode('atributos')} variant="secondary">Atributos {player.pontosAtributo > 0 ? `(${player.pontosAtributo}!)` : ''}</Button>
                        <Button onClick={() => setMode('habilidades')} variant="secondary">Habilidades</Button>
                        <Button onClick={handleRest} variant="secondary" disabled={!canRest}>Descansar</Button>
                    </div>
                </>
            )}

            {player.hp <= 0 && <p className="text-red-500 font-bold text-2xl mt-8">Você está sem vida! Descanse ou use um item de cura.</p>}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 p-4 sm:p-8 flex flex-col items-center">
        <div className="w-full max-w-5xl bg-gray-900 p-6 rounded-xl shadow-2xl border border-yellow-800 relative">
            <div className="flex justify-between items-center mb-6 border-b-2 border-gray-700 pb-4 flex-wrap gap-4">
                <div>
                    <h1 className="font-title text-3xl text-yellow-300">{player.nome}</h1>
                    <p className="text-gray-400">{player.raca.nome} {player.classe.nome} - Nível {player.nivel}</p>
                </div>
                <div className="text-right grid grid-cols-2 gap-x-4">
                    <p>HP: {player.hp} / {player.hpMax}</p>
                    <p>AC: {playerAC}</p>
                    <p>Mana: {player.mana} / {player.manaMax}</p>
                    <p>Ouro: {player.ouro}</p>
                    <p className="col-span-2">XP: {player.xp} / {XP_PARA_NIVEL[player.nivel] || 'MAX'}</p>
                </div>
                 <Button onClick={onExit} className="absolute top-4 right-4" variant="secondary">Sair do Jogo</Button>
            </div>
            {renderContent()}
        </div>
    </div>
  );
};

export default GameScreen;