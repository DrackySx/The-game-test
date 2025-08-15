import React, { useState, useEffect } from 'react';
import { Personagem } from '../types';
import { getCharacters, deleteCharacter } from '../game/storage';
import Button from './ui/Button';

interface CharacterSelectProps {
  onBack: () => void;
  onSelectCharacter: (character: Personagem) => void;
  onNewCharacter: () => void;
}

const CharacterSelect: React.FC<CharacterSelectProps> = ({ onBack, onSelectCharacter, onNewCharacter }) => {
  const [characters, setCharacters] = useState<Personagem[]>([]);

  useEffect(() => {
    setCharacters(getCharacters());
  }, []);

  const handleDelete = (characterId: string) => {
    if (window.confirm('Tem certeza que deseja apagar este herói? Esta ação não pode ser desfeita.')) {
      deleteCharacter(characterId);
      setCharacters(getCharacters());
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-800 p-4 sm:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-gray-900 p-8 rounded-xl shadow-2xl border border-yellow-800 relative">
        <Button onClick={onBack} className="absolute top-4 left-4" variant="secondary">Voltar</Button>
        <h1 className="font-title text-5xl text-yellow-400 text-center mb-8">Selecione seu Herói</h1>
        
        {characters.length === 0 ? (
            <div className="text-center">
                <p className="text-gray-300 text-lg mb-6">Nenhum personagem encontrado. Crie um para começar sua aventura!</p>
                <Button onClick={onNewCharacter}>Criar Novo Personagem</Button>
            </div>
        ) : (
            <div className="space-y-4">
                {characters.map(char => (
                    <div key={char.id} className="bg-gray-800 border border-gray-700 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-yellow-300">{char.nome}</h2>
                            <p className="text-gray-400">{char.raca.nome} {char.classe.nome} - Nível {char.nivel}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={() => handleDelete(char.id)} variant="danger">Excluir</Button>
                            <Button onClick={() => onSelectCharacter(char)}>Jogar</Button>
                        </div>
                    </div>
                ))}
                 <div className="text-center pt-6">
                    <Button onClick={onNewCharacter} variant="secondary">Criar Novo Personagem</Button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default CharacterSelect;
