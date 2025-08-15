import React from 'react';
import { Personagem, InstanciaItem, ItemTipo } from '../types';
import Button from './ui/Button';

interface InventoryScreenProps {
  character: Personagem;
  onUpdateCharacter: (character: Personagem) => void;
  onBack: () => void;
  onUseAIItem: (item: InstanciaItem) => void;
}

const InventoryScreen: React.FC<InventoryScreenProps> = ({ character, onUpdateCharacter, onBack, onUseAIItem }) => {

  const handleEquip = (item: InstanciaItem) => {
    const newCharacter = { ...character };
    if (item.tipo === 'Arma') {
      newCharacter.equipamento = { ...newCharacter.equipamento, arma: item };
    } else if (item.tipo === 'Armadura') {
      newCharacter.equipamento = { ...newCharacter.equipamento, armadura: item };
    }
    onUpdateCharacter(newCharacter);
  };

  const handleUnequip = (slot: 'arma' | 'armadura') => {
    const newCharacter = { ...character };
    if (slot === 'arma') {
      delete newCharacter.equipamento.arma;
    } else if (slot === 'armadura') {
      delete newCharacter.equipamento.armadura;
    }
    onUpdateCharacter(newCharacter);
  };

  const isEquipped = (item: InstanciaItem) => {
      return character.equipamento.arma?.instanceId === item.instanceId || character.equipamento.armadura?.instanceId === item.instanceId;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-title text-4xl text-yellow-400">Mochila</h2>
        <Button onClick={onBack} variant="secondary">Voltar a Explorar</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-title text-2xl text-yellow-300 border-b-2 border-gray-700 pb-2 mb-4">Equipado</h3>
          <div className="space-y-3">
             {character.equipamento.arma ? (
                <EquippedItem item={character.equipamento.arma} onUnequip={() => handleUnequip('arma')} />
             ) : ( <p className="text-gray-500">Nenhuma arma equipada.</p> )}
             {character.equipamento.armadura ? (
                <EquippedItem item={character.equipamento.armadura} onUnequip={() => handleUnequip('armadura')} />
             ) : ( <p className="text-gray-500">Nenhuma armadura equipada.</p> )}
          </div>
        </div>
        <div>
            <h3 className="font-title text-2xl text-yellow-300 border-b-2 border-gray-700 pb-2 mb-4">Itens</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {character.inventario.length > 0 ? character.inventario.map((item) => (
                    <InventoryItem 
                        key={item.instanceId} 
                        item={item} 
                        onEquip={handleEquip}
                        onUseAI={onUseAIItem}
                        isEquipped={isEquipped(item)}
                        character={character}
                    />
                )) : <p className="text-gray-500">Sua mochila está vazia.</p>}
            </div>
        </div>
      </div>
    </div>
  );
};

// Sub-componente para item equipado
const EquippedItem: React.FC<{ item: InstanciaItem, onUnequip: () => void }> = ({ item, onUnequip }) => (
    <div className="bg-gray-800 p-3 rounded-lg flex justify-between items-center border border-yellow-700">
        <div>
            <p className="font-bold text-lg text-yellow-400">{item.nome} ({item.tipo})</p>
            <p className="text-sm text-gray-400">{item.descricao}</p>
            {item.descricaoEfeitoReal && <p className="text-sm text-cyan-300">{item.descricaoEfeitoReal}</p>}
        </div>
        <Button onClick={onUnequip} variant="secondary">Desequipar</Button>
    </div>
);

// Sub-componente para item no inventário
const InventoryItem: React.FC<{ item: InstanciaItem, onEquip: (item: InstanciaItem) => void, onUseAI: (item: InstanciaItem) => void, isEquipped: boolean, character: Personagem }> = ({ item, onEquip, onUseAI, isEquipped, character }) => (
    <div className="bg-gray-800 p-3 rounded-lg flex justify-between items-center border border-gray-700">
        <div>
            <p className={`font-bold text-lg ${isEquipped ? 'text-green-400' : 'text-white'}`}>{item.nome} {isEquipped && '(E)'}</p>
            <p className="text-sm text-gray-400">{item.efeito}</p>
            {item.descricaoEfeitoReal && <p className="text-sm text-cyan-300">{item.descricaoEfeitoReal}</p>}
        </div>
        <div>
            {item.tipo === 'Arma' || item.tipo === 'Armadura' ? (
                <Button onClick={() => onEquip(item)} disabled={isEquipped}>Equipar</Button>
            ) : item.efeitoAI ? (
                <Button onClick={() => onUseAI(item)} disabled={character.pontosIA <= 0}>Usar IA ({character.pontosIA})</Button>
            ) : null}
        </div>
    </div>
);


export default InventoryScreen;