import React from 'react';
import { InstanciaItem, Personagem, ItemTipo } from '../types';
import Button from './ui/Button';
import { RARIDADE_MAP } from '../constants';
import { calcularPoderEquipamento } from '../game/character';

interface LootDisplayProps {
  item: InstanciaItem;
  character: Personagem;
  onCollect: () => void;
}

const LootDisplay: React.FC<LootDisplayProps> = ({ item, character, onCollect }) => {

  const getComparison = () => {
    if (item.tipo !== 'Arma' && item.tipo !== 'Armadura') return null;
    
    const itemEquipado = item.tipo === 'Arma' ? character.equipamento.arma : character.equipamento.armadura;
    const poderNovoItem = calcularPoderEquipamento(item);
    const poderItemEquipado = calcularPoderEquipamento(itemEquipado);

    if (poderNovoItem > poderItemEquipado) {
        return <span className="text-green-400 font-bold ml-2">▲ Melhor</span>;
    }
    if (poderNovoItem < poderItemEquipado) {
        return <span className="text-red-400 font-bold ml-2">▼ Pior</span>;
    }
    return <span className="text-gray-400 font-bold ml-2">≡ Equivalente</span>
  };

  const rarityInfo = RARIDADE_MAP[item.raridade];

  return (
    <div className="text-center bg-gray-800 p-6 rounded-lg border-2 border-yellow-600 shadow-lg">
      <h2 className="font-title text-3xl text-yellow-400 mb-4">Tesouro Encontrado!</h2>
      <div className="bg-gray-900 p-4 rounded-md mb-4 border border-gray-700">
        <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-yellow-300">{item.nome}</h3>
            <span className={`px-2 py-1 text-xs font-bold rounded-full ${rarityInfo.cor}`}>{rarityInfo.nome}</span>
        </div>
        <p className="text-gray-400 italic my-2">{item.descricao}</p>
        <p className="text-white"><span className="font-bold">Efeito:</span> {item.efeito}</p>
        {item.descricaoEfeitoReal && (
            <p className="text-cyan-300"><span className="font-bold">Efeito Real:</span> {item.descricaoEfeitoReal}</p>
        )}
        <div className="mt-2 font-bold text-lg">
            {getComparison()}
        </div>
      </div>
      <Button onClick={onCollect}>Pegar Item</Button>
    </div>
  );
};

export default LootDisplay;
