import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Personagem } from '../types';
import Button from './ui/Button';

export interface AIContext {
    title: string;
    description: string;
    type: 'item' | 'event';
}

interface AIInteractionModalProps {
  context: AIContext;
  character: Personagem;
  onUpdateCharacter: (character: Personagem, message: string) => void;
  onClose: () => void;
}

const AIInteractionModal: React.FC<AIInteractionModalProps> = ({ context, character, onUpdateCharacter, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const hasCost = context.type === 'item';
  const canAfford = hasCost ? character.pontosIA > 0 : true;

  const handleConfirm = async () => {
    if (!prompt || !canAfford) return;

    setIsLoading(true);
    setResult('');
    setError('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      const fullPrompt = `Como um mestre de um jogo de RPG de fantasia, a seguinte situação ocorreu: "${context.title}". A intenção do jogador é: "${prompt}". Descreva o resultado desta ação de forma criativa, poderosa e narrativa em no máximo 3 frases. O resultado deve ser interessante mas não quebrar o jogo completamente.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
      });

      const aiResultText = response.text;
      setResult(aiResultText);
      
      // Deduzir custo e atualizar personagem
      let newCharacter = { ...character };
      if(hasCost) {
          newCharacter.pontosIA = character.pontosIA - 1;
      }
      onUpdateCharacter(newCharacter, `Resultado de '${context.title}':\n${aiResultText}`);

    } catch (e) {
      console.error(e);
      setError('Ocorreu um erro ao contatar os poderes cósmicos. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border-2 border-yellow-700 rounded-xl p-8 max-w-2xl w-full shadow-2xl">
        {result ? (
            <div>
                 <h2 className="font-title text-3xl text-yellow-400 mb-4">Resultado</h2>
                 <p className="text-gray-300 text-lg mb-6 whitespace-pre-wrap">{result}</p>
                 <Button onClick={onClose}>Fechar</Button>
            </div>
        ) : (
            <>
                <h2 className="font-title text-3xl text-yellow-400 mb-2">{context.title}</h2>
                <p className="text-gray-400 mb-4">{context.description}</p>
                {hasCost && <p className="text-lg text-white mb-4">Pontos de IA restantes: <span className="font-bold text-cyan-400">{character.pontosIA}</span></p>}
                
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Descreva o que você deseja fazer..."
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white h-32 focus:border-yellow-500 focus:outline-none"
                    disabled={isLoading}
                />
                
                {error && <p className="text-red-500 mt-2">{error}</p>}
                
                <div className="flex justify-end gap-4 mt-6">
                    <Button onClick={onClose} variant="secondary" disabled={isLoading}>Cancelar</Button>
                    <Button onClick={handleConfirm} disabled={isLoading || !prompt || !canAfford}>
                        {isLoading ? 'Conjurando...' : `Confirmar ${hasCost ? '(Custo: 1 Ponto de IA)' : ''}`}
                    </Button>
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default AIInteractionModal;