import React, { useState, useCallback, useMemo } from 'react';
import { Atributo, Atributos, Personagem, Raca, Classe, InstanciaItem, Equipamento } from '../types';
import { roll4d6DropLowest, rollDice } from '../game/dice';
import { RACAS, CLASSES, ITENS } from '../constants';
import { saveCharacter } from '../game/storage';
import Button from './ui/Button';
import { getModifier } from '../game/character';
import { criarInstanciaItem } from '../game/items';

interface CharacterCreatorProps {
  onBack: () => void;
  onFinish: () => void;
}

const ATRIBUTOS_LIST = [Atributo.FOR, Atributo.DES, Atributo.CON, Atributo.INT, Atributo.SAB, Atributo.CAR];

const formatModifier = (score: number): string => {
    const mod = getModifier(score);
    return mod >= 0 ? `+${mod}` : `${mod}`;
}

const CharacterCreator: React.FC<CharacterCreatorProps> = ({ onBack, onFinish }) => {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Partial<Personagem>>({});

  const handleRollStats = useCallback(() => {
    const newStats = ATRIBUTOS_LIST.reduce((acc, attr) => {
      acc[attr] = roll4d6DropLowest();
      return acc;
    }, {} as Atributos);
    setDraft(prev => ({ ...prev, atributos: newStats }));
  }, []);
  
  const handleFinalize = () => {
      if (!draft.nome || !draft.raca || !draft.classe || !draft.atributos) return;
      
      const conModifier = getModifier(draft.atributos[Atributo.CON] || 10);
      const hpMax = draft.classe.dadoDeVida + conModifier;

      const intModifier = getModifier(draft.atributos[Atributo.INT] || 10);
      const sabModifier = getModifier(draft.atributos[Atributo.SAB] || 10);
      const manaModifier = draft.classe.nome === 'Clérigo' ? sabModifier : intModifier;
      const manaMax = draft.classe.manaBase + Math.max(0, manaModifier);
      
      const inventario: InstanciaItem[] = draft.classe.equipamentosIniciais
        .map(itemName => {
            const itemBase = ITENS.find(item => item.nome === itemName);
            return itemBase ? criarInstanciaItem(itemBase) : null;
        })
        .filter((item): item is InstanciaItem => item !== null);
        
      const equipamento: Equipamento = {};
      const armaInicial = inventario.find(i => i.tipo === 'Arma');
      const armaduraInicial = inventario.find(i => i.tipo === 'Armadura');
      if(armaInicial) equipamento.arma = armaInicial;
      if(armaduraInicial) equipamento.armadura = armaduraInicial;

      const finalCharacter: Personagem = {
        id: crypto.randomUUID(),
        nome: draft.nome,
        raca: draft.raca,
        classe: draft.classe,
        atributos: draft.atributos,
        nivel: 1,
        xp: 0,
        hp: hpMax,
        hpMax: hpMax,
        mana: manaMax,
        manaMax: manaMax,
        ouro: rollDice(2, 20) * 5,
        inventario: inventario,
        equipamento: equipamento,
        pontosIA: 3,
        pontosAtributo: 0,
      };

      saveCharacter(finalCharacter);
      onFinish();
  }
  
  const selectedStats = useMemo(() => {
    if (!draft.atributos) return null;
    if (!draft.raca) return draft.atributos;
    
    const finalStats = { ...draft.atributos };
    for (const [attr, bonus] of Object.entries(draft.raca.bonus)) {
        finalStats[attr as Atributo] = (finalStats[attr as Atributo] || 0) + (bonus || 0);
    }
    return finalStats as Atributos;
  }, [draft.atributos, draft.raca]);

  const renderContent = () => {
    switch(step) {
      case 0: // Rolar Atributos
        return (
          <div>
            <h2 className="font-title text-4xl text-yellow-400 mb-4 text-center">Rolagem de Atributos</h2>
            <p className="mb-6 text-gray-300 text-center">Vamos gerar os atributos do seu personagem. Usaremos o método 4d6, descartando o menor dado.</p>
            {draft.atributos && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 bg-gray-800 p-6 rounded-lg border border-gray-700">
                {ATRIBUTOS_LIST.map(attr => (
                  <div key={attr} className="bg-gray-700 p-4 rounded-md shadow-inner text-center">
                    <div className="text-sm text-yellow-400">{attr}</div>
                    <div className="text-4xl font-bold text-white">{draft.atributos?.[attr]}</div>
                    <div className="text-lg text-gray-300">Mod: {formatModifier(draft.atributos?.[attr] || 0)}</div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-center gap-4">
              <Button onClick={handleRollStats}>{draft.atributos ? 'Rolar Novamente' : 'Rolar Atributos'}</Button>
              {draft.atributos && <Button onClick={() => setStep(1)}>Continuar</Button>}
            </div>
          </div>
        );
      case 1: // Nome
        return (
          <div>
            <h2 className="font-title text-4xl text-yellow-400 mb-6 text-center">Qual o nome do seu Herói?</h2>
            <input 
              type="text" 
              value={draft.nome || ''}
              onChange={e => setDraft(prev => ({...prev, nome: e.target.value}))}
              className="w-full p-3 bg-gray-700 text-white rounded-lg text-xl text-center border-2 border-gray-600 focus:border-yellow-500 focus:outline-none"
              placeholder="Digite o nome aqui"
            />
            <div className="flex justify-center gap-4 mt-6">
              <Button onClick={() => setStep(0)} variant="secondary">Voltar</Button>
              <Button onClick={() => setStep(2)} disabled={!draft.nome}>Continuar</Button>
            </div>
          </div>
        );
      case 2: // Raça
        return (
          <div>
            <h2 className="font-title text-4xl text-yellow-400 mb-6 text-center">Escolha sua Raça</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {RACAS.map(raca => (
                <div key={raca.nome} onClick={() => setDraft(prev => ({...prev, raca: raca}))} className={`p-4 bg-gray-800 rounded-lg border-2 cursor-pointer transition-all ${draft.raca?.nome === raca.nome ? 'border-yellow-500 scale-105' : 'border-gray-700 hover:border-gray-500'}`}>
                  <h3 className="text-2xl font-bold text-yellow-300">{raca.nome}</h3>
                  <p className="text-sm text-gray-400">Bônus: {Object.entries(raca.bonus).map(([attr, val]) => `${attr} +${val}`).join(', ')}</p>
                  <p className="text-sm mt-2">Traços: {raca.tracos.join(', ')}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <Button onClick={() => setStep(1)} variant="secondary">Voltar</Button>
              <Button onClick={() => setStep(3)} disabled={!draft.raca}>Continuar</Button>
            </div>
          </div>
        );
      case 3: // Classe
        return (
          <div>
            <h2 className="font-title text-4xl text-yellow-400 mb-6 text-center">Escolha sua Classe</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CLASSES.map(classe => (
                <div key={classe.nome} onClick={() => setDraft(prev => ({...prev, classe: classe}))} className={`p-4 bg-gray-800 rounded-lg border-2 cursor-pointer transition-all ${draft.classe?.nome === classe.nome ? 'border-yellow-500 scale-105' : 'border-gray-700 hover:border-gray-500'}`}>
                  <h3 className="text-2xl font-bold text-yellow-300">{classe.nome}</h3>
                  <p className="text-sm text-gray-400">Atributo Primário: {classe.atributoPrimario}</p>
                  <p className="text-sm">Dado de Vida: d{classe.dadoDeVida}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <Button onClick={() => setStep(2)} variant="secondary">Voltar</Button>
              <Button onClick={() => setStep(4)} disabled={!draft.classe}>Continuar</Button>
            </div>
          </div>
        );
      case 4: // Revisão
        return (
            <div>
                <h2 className="font-title text-4xl text-yellow-400 mb-6 text-center">Revise seu Personagem</h2>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-3xl font-bold text-center text-yellow-300 mb-4">{draft.nome}</h3>
                    <p className="text-xl text-center text-gray-300 mb-6">{draft.raca?.nome} {draft.classe?.nome}</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        {selectedStats && ATRIBUTOS_LIST.map(attr => (
                            <div key={attr} className="bg-gray-700 p-4 rounded-md shadow-inner text-center">
                                <div className="text-sm text-yellow-400">{attr}</div>
                                <div className="text-4xl font-bold text-white">{selectedStats[attr]}</div>
                                <div className="text-lg text-gray-300">Mod: {formatModifier(selectedStats[attr] || 0)}</div>
                            </div>
                        ))}
                    </div>
                </div>
                 <div className="flex justify-center gap-4 mt-6">
                    <Button onClick={() => setStep(3)} variant="secondary">Voltar</Button>
                    <Button onClick={handleFinalize}>Finalizar e Salvar</Button>
                </div>
            </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-gray-800 p-4 sm:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-gray-900 p-8 rounded-xl shadow-2xl border border-yellow-800 relative">
        <Button onClick={onBack} className="absolute top-4 left-4" variant="secondary">Sair</Button>
        {renderContent()}
      </div>
    </div>
  );
};

export default CharacterCreator;