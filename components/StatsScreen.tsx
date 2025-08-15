import React from 'react';
import { Personagem, Atributo } from '../types';
import Button from './ui/Button';
import { getModifier } from '../game/character';

interface StatsScreenProps {
  character: Personagem;
  onUpdateCharacter: (character: Personagem) => void;
  onBack: () => void;
}

const ATRIBUTOS_LIST = [Atributo.FOR, Atributo.DES, Atributo.CON, Atributo.INT, Atributo.SAB, Atributo.CAR];

const StatsScreen: React.FC<StatsScreenProps> = ({ character, onUpdateCharacter, onBack }) => {

    const handleIncreaseStat = (attr: Atributo) => {
        if (character.pontosAtributo <= 0) return;

        const newCharacter = { ...character };
        newCharacter.atributos = { ...newCharacter.atributos, [attr]: newCharacter.atributos[attr] + 1 };
        newCharacter.pontosAtributo -= 1;

        // Recalcular HP e Mana Máximos se CON, INT ou SAB forem aumentados
        if (attr === Atributo.CON) {
            const oldMod = getModifier(character.atributos[Atributo.CON]);
            const newMod = getModifier(newCharacter.atributos[Atributo.CON]);
            if(newMod > oldMod) {
                newCharacter.hpMax += newCharacter.nivel; // Ganha 1 HP por nível
                newCharacter.hp += newCharacter.nivel;
            }
        }
        
        const manaAttr = newCharacter.classe.nome === 'Clérigo' ? Atributo.SAB : Atributo.INT;
        if(attr === manaAttr) {
            const oldMod = getModifier(character.atributos[manaAttr]);
            const newMod = getModifier(newCharacter.atributos[manaAttr]);
            if(newMod > oldMod) {
                 newCharacter.manaMax += newCharacter.nivel; // Ganha 1 Mana por nível
                 newCharacter.mana += newCharacter.nivel;
            }
        }
        
        onUpdateCharacter(newCharacter);
    }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-title text-4xl text-yellow-400">Atributos</h2>
        <Button onClick={onBack} variant="secondary">Voltar a Explorar</Button>
      </div>

      {character.pontosAtributo > 0 && (
        <div className="bg-green-900 border border-green-600 text-green-200 p-4 rounded-lg mb-6 text-center">
          <p className="font-bold text-xl">Você tem {character.pontosAtributo} ponto(s) de atributo para distribuir!</p>
          <p>Clique no botão '+' ao lado de um atributo para aumentá-lo.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ATRIBUTOS_LIST.map(attr => (
          <div key={attr} className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-center justify-between">
            <div>
              <p className="text-xl font-bold text-yellow-300">{attr}</p>
              <p className="text-4xl font-bold">{character.atributos[attr]}</p>
              <p className="text-lg text-gray-400">Modificador: {getModifier(character.atributos[attr]) >= 0 ? '+' : ''}{getModifier(character.atributos[attr])}</p>
            </div>
            {character.pontosAtributo > 0 && (
              <button
                onClick={() => handleIncreaseStat(attr)}
                className="bg-green-600 hover:bg-green-500 text-white font-bold w-12 h-12 rounded-full text-3xl transition-transform transform hover:scale-110"
              >
                +
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsScreen;