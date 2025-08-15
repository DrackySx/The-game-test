import React from 'react';
import Button from './ui/Button';

interface SkillTreeScreenProps {
  onBack: () => void;
}

const SkillTreeScreen: React.FC<SkillTreeScreenProps> = ({ onBack }) => {
  return (
    <div className="p-4 text-center">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-title text-4xl text-yellow-400">Árvore de Habilidades</h2>
        <Button onClick={onBack} variant="secondary">Voltar a Explorar</Button>
      </div>
      <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
        <p className="text-2xl text-gray-300">Em breve...</p>
        <p className="text-gray-400 mt-2">Esta funcionalidade será implementada em futuras atualizações.</p>
      </div>
    </div>
  );
};

export default SkillTreeScreen;