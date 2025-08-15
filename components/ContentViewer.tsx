import React, { useState, useMemo } from 'react';
import { Item, Magia, Monstro, Raridade, EventoAleatorio, EfeitoEvento } from '../types';
import { ITENS, MAGIAS, MONSTROS, EVENTOS_ALEATORIOS, RARIDADE_MAP, TABELA_LOOT } from '../constants';
import Button from './ui/Button';

type ContentType = 'itens' | 'magias' | 'monstros' | 'eventos';

// Helper para formatar o objeto de efeito de um evento em uma string
const formatEventEffect = (efeito: EfeitoEvento): string => {
    if (!efeito || efeito.tipo === 'nada') {
        return 'Nenhum efeito mecânico.';
    }
    switch(efeito.tipo) {
        case 'ouro':
            return `Ganha ${efeito.valor} de ouro.`;
        case 'item':
            return `Recebe o item: ${efeito.valor}.`;
        case 'combate':
            return `Inicia um combate contra: ${efeito.valor}.`;
        case 'cura_hp':
            return `Recupera ${efeito.valor} HP.`;
        case 'cura_mana':
            return `Recupera ${efeito.valor} Mana.`;
        case 'desejo':
            return 'Concede um desejo ao jogador.';
        default:
            return 'Efeito desconhecido.';
    }
};

const ContentViewer: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<ContentType>('itens');

  const content = useMemo(() => {
    switch (activeTab) {
      case 'itens':
        return { title: 'Itens', data: ITENS };
      case 'magias':
        return { title: 'Magias', data: MAGIAS };
      case 'monstros':
        return { title: 'Monstros', data: MONSTROS.sort((a,b) => a.chanceEncontro - b.chanceEncontro) };
      case 'eventos':
        return { title: 'Eventos Aleatórios', data: EVENTOS_ALEATORIOS.sort((a,b) => a.chance - b.chance) };
      default:
        return { title: '', data: [] };
    }
  }, [activeTab]);

  const renderRarityTag = (raridade: Raridade) => {
    const rarityInfo = RARIDADE_MAP[raridade];
    return <span className={`px-2 py-1 text-xs font-bold rounded-full ${rarityInfo.cor}`}>{rarityInfo.nome}</span>;
  };

  const getChanceText = (item: any, index: number, array: any[]) => {
      let lowerBound = index === 0 ? 1 : array[index - 1].chance + 1;
      if (activeTab === 'monstros') {
          lowerBound = index === 0 ? 1 : array[index - 1].chanceEncontro + 1;
          const chancePercent = ((item.chanceEncontro - (lowerBound - 1)) / 100000) * 100;
          return `Chance: ${chancePercent.toFixed(3)}% (d100k: ${lowerBound}-${item.chanceEncontro})`;
      }
      if (activeTab === 'eventos') {
          const chancePercent = ((item.chance - (lowerBound - 1)) / 1000) * 100;
          return `Chance: ${chancePercent.toFixed(1)}% (d1000: ${lowerBound}-${item.chance})`;
      }
      return null;
  }

  return (
    <div className="min-h-screen bg-gray-800 p-4 sm:p-8">
       <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
            <h1 className="font-title text-5xl text-yellow-400">Conteúdo do Jogo</h1>
            <Button onClick={onBack} variant="secondary">Voltar</Button>
        </div>
       
        <div className="flex space-x-2 border-b-2 border-gray-700 mb-6 overflow-x-auto">
          {(['itens', 'monstros', 'eventos', 'magias'] as ContentType[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`capitalize py-2 px-4 font-bold transition-colors duration-200 whitespace-nowrap ${
                activeTab === tab 
                  ? 'border-b-2 border-yellow-500 text-yellow-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div>
            {activeTab === 'itens' && (
                 <div className="mb-8">
                    <h2 className="font-title text-3xl mb-4 text-yellow-300">Chances de Obtenção (Loot)</h2>
                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                        {Object.entries(TABELA_LOOT).map(([rarityKey, info]) => {
                             const rarity = parseInt(rarityKey) as Raridade;
                             const prevRarityInfo = TABELA_LOOT[(rarity - 1) as Raridade];
                             const lowerBound = prevRarityInfo ? prevRarityInfo.chance + 1 : 1;
                             const chancePercent = ((info.chance - (lowerBound -1)) / 10000) * 100;

                             return <p key={rarity} className="text-gray-300"><span className={`font-bold ${RARIDADE_MAP[rarity].cor.replace('bg-','text-').split(' ')[0]}`}>{RARIDADE_MAP[rarity].nome}:</span> {chancePercent.toFixed(2)}% chance</p>
                        })}
                    </div>
                 </div>
            )}

            {(activeTab === 'itens' ? ITENS.sort((a,b) => a.raridade - b.raridade) : content.data).map((item: any, index, array) => (
                 <div key={item.nome || item.titulo} className="bg-gray-900 p-4 rounded-lg border border-gray-700 mb-4">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-xl text-yellow-300">{item.nome || item.titulo}</h3>
                        {'raridade' in item && renderRarityTag(item.raridade)}
                    </div>
                    <p className="text-gray-400 italic mb-2">{item.descricao}</p>
                    {getChanceText(item, index, array) && <p className="text-cyan-300 font-mono text-sm mb-2">{getChanceText(item, index, array)}</p>}
                    {'efeito' in item && (
                      <p className="text-sm text-gray-300">
                          <span className="font-bold">Efeito:</span>{' '}
                          {typeof item.efeito === 'string' ? item.efeito : formatEventEffect(item.efeito)}
                      </p>
                    )}
                    {'tipo' in item && <p className="text-sm text-gray-300"><span className="font-bold">Tipo:</span> {item.tipo}</p>}
                    {'hp' in item && (
                        <div className="text-sm text-gray-300 mt-2">
                            <p><span className="font-bold">HP:</span> {item.hp} | <span className="font-bold">AC:</span> {item.ac}</p>
                            <p><span className="font-bold">Ataque:</span> {item.ataque}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ContentViewer;