import { Item, Magia, Monstro, Raridade, EventoAleatorio, Raca, Classe, Atributo, ItemTipo } from './types';

export const ITENS: Item[] = [
    { nome: 'Espada de Ferro', raridade: Raridade.Comum, descricao: 'Dano: 1d8', efeito: 'Uma espada confiável para qualquer aventureiro iniciante.', tipo: 'Arma', dadoDano: 8, bonusDano: 0 },
    { nome: 'Adaga de Couro', raridade: Raridade.Comum, descricao: 'Dano: 1d4', efeito: 'Leve e rápida, perfeita para ataques furtivos.', tipo: 'Arma', dadoDano: 4, bonusDano: 0 },
    { nome: 'Armadura de Couro', raridade: Raridade.Comum, descricao: 'AC Base 11', efeito: 'Proteção básica para quem valoriza a mobilidade.', tipo: 'Armadura', bonusAC: 1 },
    { nome: 'Escudo de Madeira', raridade: Raridade.Comum, descricao: '+2 AC', efeito: 'Um escudo simples, mas eficaz.', tipo: 'Armadura', bonusAC: 2},
    { nome: 'Grimório do Aprendiz', raridade: Raridade.Comum, descricao: 'Contém 3 magias de nível 1', efeito: 'O ponto de partida para todo mago.', tipo: 'Especial'},
    { nome: 'Símbolo Sagrado de Madeira', raridade: Raridade.Comum, descricao: 'Foco para magias divinas', efeito: 'Um objeto de fé que canaliza o poder dos deuses.', tipo: 'Especial' },
    { nome: 'Maça', raridade: Raridade.Comum, descricao: 'Dano: 1d6', efeito: 'Uma arma de impacto simples.', tipo: 'Arma', dadoDano: 6, bonusDano: 0 },
    { nome: 'Poção de Cura Menor', raridade: Raridade.Incomum, descricao: 'Cura 2d4+2 HP', efeito: 'Um líquido vermelho que restaura um pouco de vida.', tipo: 'Consumível', efeitoCura: '2d4+2' },
    { nome: 'Poção de Mana Menor', raridade: Raridade.Incomum, descricao: 'Restaura 2d4+2 Mana', efeito: 'Um líquido azul cintilante que restaura energia arcana.', tipo: 'Consumível', efeitoMana: '2d4+2' },
    { nome: 'Machado de Guerra Ancestral', raridade: Raridade.Raro, descricao: 'Dano: 1d12', efeito: 'Marcado com runas antigas, este machado canta em batalha.', tipo: 'Arma', dadoDano: 12, bonusDano: 1 },
    { nome: 'Arco Longo Élfico', raridade: Raridade.Raro, descricao: 'Dano: 1d8', efeito: 'Feito da madeira de uma árvore arcana, suas flechas raramente erram.', tipo: 'Arma', dadoDano: 8, bonusDano: 1 },
    { nome: 'Anel Elemental Instável', raridade: Raridade.Raro, descricao: 'Adiciona 1d4 de dano elemental aos ataques.', efeito: 'O elemento muda a cada dia.', tipo: 'Especial', efeitoVariavel: { dado: '1d4', resultados: { '1': '+1d4 Dano de Fogo', '2': '+1d4 Dano de Gelo', '3': '+1d4 Dano Elétrico', '4': '+1d4 Dano Ácido' } } },
    { nome: 'Manto do Deslocamento', raridade: Raridade.Epico, descricao: '+1 AC, desvantagem em ataques contra você', efeito: 'O tecido parece tremeluzir, tornando sua posição difícil de discernir.', tipo: 'Armadura', bonusAC: 1 },
    { nome: 'Cajado do Arcanista Supremo', raridade: Raridade.Lendario, descricao: '+2 de bônus para dano mágico', efeito: 'Canaliza poder arcano bruto, zumbindo com energia pura.', tipo: 'Arma', bonusDano: 2 },
    { nome: 'Anel dos Três Desejos', raridade: Raridade.Lendario, descricao: 'Concede 3 desejos', efeito: 'Use com sabedoria, pois o poder de moldar a realidade está em suas mãos.', tipo: 'Especial', efeitoAI: true },
    { nome: 'Armadura de Placas Dracônica', raridade: Raridade.Mitico, descricao: 'AC Base 18, resistência a fogo', efeito: 'Forjada a partir das escamas de um dragão ancestral, quase impenetrável.', tipo: 'Armadura', bonusAC: 8 },
    { nome: 'Elmo da Soberania', raridade: Raridade.Mitico, descricao: '+5 Carisma, pode encantar humanoides 1x/dia', efeito: 'Aqueles que olham para você sentem um impulso incontrolável de obedecer.', tipo: 'Especial' },
    { nome: 'Lâmina Celestial de Aurora', raridade: Raridade.Divino, descricao: 'Dano 1d12 + 2d8 radiante', efeito: 'Cega inimigos em um raio de 5 metros por 1 turno ao acertar.', tipo: 'Arma', dadoDano: 12, bonusDano: 3 },
    { nome: 'Amuleto da Imortalidade', raridade: Raridade.Divino, descricao: 'Previne a morte 1x/semana', efeito: 'Se você sofrer dano letal, em vez disso, você fica com 1 HP.', tipo: 'Especial' },
    { nome: 'Foice do Fim dos Tempos', raridade: Raridade.Extremo, descricao: 'Dano: 4d10 necrótico', efeito: '5% de chance de morte instantânea em um acerto crítico.', tipo: 'Arma', dadoDano: 10, bonusDano: 4 }, // Simplificado para dadoDano
    { nome: 'Fragmento da Criação', raridade: Raridade.Extremo, descricao: 'Pode reescrever um evento', efeito: 'Um pedaço do universo em sua forma mais pura. Uma vez usado, se desfaz em pó.', tipo: 'Especial', efeitoAI: true },
    { nome: 'Espada Vorpal', raridade: Raridade.Artefato, descricao: '+3 espada longa, decapita em um 20 natural', efeito: 'Uma lâmina lendária que canta uma canção mortal em batalha.', tipo: 'Arma', bonusDano: 3, dadoDano: 10},
    { nome: 'Manto das Estrelas', raridade: Raridade.Artefato, descricao: '+2 AC, permite viajar pelo plano astral', efeito: 'Tecido com a própria noite, salpicado de luzes celestiais.', tipo: 'Armadura', bonusAC: 2},
    { nome: 'Singularidade Engarrafada', raridade: Raridade.Cosmico, descricao: 'Consumível: Libera a energia de um buraco negro', efeito: 'Causa 100d100 de dano de força em um raio de 300 metros. Você provavelmente não sobreviverá.', tipo: 'Consumível'},
    { nome: 'Coroa da Realidade', raridade: Raridade.Cosmico, descricao: 'Permite moldar a realidade com um pensamento', efeito: 'O poder de um deus em sua cabeça. Requer uma força de vontade inimaginável para não ser consumido.', tipo: 'Especial', efeitoAI: true},
];

export const MAGIAS: Magia[] = [
    { nome: 'Raio de Fogo', raridade: Raridade.Comum, descricao: 'Um feixe de fogo que causa 1d10 de dano.', tipo: 'Ataque' },
    { nome: 'Armadura Arcana', raridade: Raridade.Comum, descricao: 'Sua AC base se torna 13 + modificador de Destreza.', tipo: 'Defesa' },
    { nome: 'Passos Silenciosos', raridade: Raridade.Comum, descricao: 'Você não faz som ao se mover por 10 minutos.', tipo: 'Utilidade' },
    { nome: 'Bola de Fogo', raridade: Raridade.Raro, descricao: 'Explosão de fogo que causa 8d6 de dano em área.', tipo: 'Ataque em Área' },
    { nome: 'Muralha de Gelo', raridade: Raridade.Raro, descricao: 'Cria uma parede de gelo para bloquear inimigos.', tipo: 'Controle de Campo' },
    { nome: 'Corrente Relampejante', raridade: Raridade.Raro, descricao: 'Um raio atinge um alvo e salta para outros próximos.', tipo: 'Ataque Múltiplo' },
    { nome: 'Tempestade Arcana', raridade: Raridade.Lendario, descricao: 'Invoca uma tempestade de energia mágica que causa dano massivo em uma grande área.', tipo: 'Ataque em Área' },
    { nome: 'Fissura Dimensional', raridade: Raridade.Lendario, descricao: 'Abre um portal para qualquer lugar que você já esteve.', tipo: 'Teletransporte' },
    { nome: 'Ressurreição Divina', raridade: Raridade.Lendario, descricao: 'Traz um aliado morto de volta à vida com HP total.', tipo: 'Cura' },
    { nome: 'Colapso Estelar', raridade: Raridade.Extremo, descricao: 'Puxa o poder de uma estrela moribunda para aniquilar uma área. Causa 20d20 de dano radiante.', tipo: 'Aniquilação' },
    { nome: 'Dilaceração Temporal', raridade: Raridade.Extremo, descricao: 'Rasga o tecido do tempo, paralisando todos os inimigos por 3 turnos e causando dano a cada turno.', tipo: 'Controle Absoluto' },
];

export const MONSTROS: Monstro[] = [
    // chanceEncontro é o limite superior em um d100000
    { nome: 'Rato Gigante', raridade: Raridade.Comum, hp: 7, ac: 12, ataque: 'Mordida (+4, 1d4+2 dano)', descricao: 'Um rato anormalmente grande e agressivo.', xp: 10, chanceEncontro: 30000 }, // 30%
    { nome: 'Goblin Ladino', raridade: Raridade.Comum, hp: 12, ac: 13, ataque: 'Adaga Envenenada (+5, 1d4+3 perfurante + 1d6 veneno)', descricao: 'Pequeno, cruel e sorrateiro, prefere atacar pelas sombras.', xp: 25, chanceEncontro: 60000 }, // 30%
    { nome: 'Orc Furioso', raridade: Raridade.Incomum, hp: 25, ac: 13, ataque: 'Machado Grande (+5, 1d12+3 cortante)', descricao: 'Um bruto musculoso que vive pela emoção da batalha.', xp: 50, chanceEncontro: 85000 }, // 25%
    { nome: 'Sombra', raridade: Raridade.Incomum, hp: 30, ac: 14, ataque: 'Toque Sombrio (+5, 2d6+3 necrótico)', descricao: 'Uma criatura de escuridão pura que drena a força vital.', xp: 75, chanceEncontro: 0 }, // Apenas por evento
    { nome: 'Troll da Montanha', raridade: Raridade.Raro, hp: 60, ac: 15, ataque: 'Garras (+7, 2d6+4 cortante)', descricao: 'Regenera 5 HP por turno, a menos que seja atingido por fogo ou ácido.', xp: 100, chanceEncontro: 95000 }, // 10%
    { nome: 'Manticora', raridade: Raridade.Epico, hp: 110, ac: 17, ataque: 'Mordida e Garras, Espinhos da Cauda (à distância)', descricao: 'Uma criatura leonina com asas de morcego e uma cauda de escorpião.', xp: 250, chanceEncontro: 99000 }, // 4%
    { nome: 'Dragão Ancião Rubro', raridade: Raridade.Lendario, hp: 350, ac: 22, ataque: 'Sopro de Fogo (12d10 dano de fogo)', descricao: 'Uma lenda viva, cujo tesouro é tão vasto quanto sua arrogância.', xp: 1000, chanceEncontro: 99800 }, // 0.8%
    { nome: 'Lich Arquimago', raridade: Raridade.Mitico, hp: 250, ac: 18, ataque: 'Magias Lendárias e toque paralisante', descricao: 'Um mestre da morte que trocou sua alma pela magia eterna.', xp: 2000, chanceEncontro: 99950 }, // 0.15%
    { nome: 'Behemoth Primordial', raridade: Raridade.Divino, hp: 700, ac: 20, ataque: 'Pancada Sísmica (afeta todos no chão)', descricao: 'Uma força da natureza, tão antiga quanto o próprio mundo.', xp: 5000, chanceEncontro: 99995 }, // 0.045%
    { nome: 'Avatar do Caos', raridade: Raridade.Extremo, hp: 500, ac: 25, ataque: 'Distorção da Realidade (efeitos imprevisíveis)', descricao: 'Uma manifestação física do caos puro. Suas ações desafiam a lógica e a física.', xp: 10000, chanceEncontro: 100000 }, // 0.005%
];

export const EVENTOS_ALEATORIOS: EventoAleatorio[] = [
    // chance é o limite superior em um d1000
    { titulo: 'Nada Acontece', descricao: 'O vento uiva suavemente, mas nada fora do comum acontece.', chance: 200, efeito: { tipo: 'nada' } }, // 20%
    { titulo: 'Clima Súbito', descricao: 'O céu se fecha e uma chuva torrencial começa, dificultando a visão e o movimento.', chance: 300, efeito: { tipo: 'nada' } }, // 10%
    { titulo: 'Sons Estranhos', descricao: 'Você ouve um barulho estranho à distância. Poderia ser um animal... ou algo pior.', chance: 400, efeito: { tipo: 'nada' } }, // 10%
    { titulo: 'Viajante Perdido', descricao: 'Você encontra um viajante assustado que lhe dá um pequeno item em troca de direções.', chance: 450, efeito: { tipo: 'item', valor: 'Poção de Cura Menor' } }, // 5%
    { titulo: 'Bolsa Caída', descricao: 'Você encontra uma pequena bolsa de couro no chão contendo algumas moedas de ouro.', chance: 500, efeito: { tipo: 'ouro', valor: '2d12' } }, // 5%
    { titulo: 'Altar Esquecido', descricao: 'Você se depara com um pequeno altar de pedra. Você faz uma breve prece e sente seu corpo se curar um pouco.', chance: 550, efeito: { tipo: 'cura_hp', valor: 10 } }, // 5%
    { titulo: 'Visão Perturbadora', descricao: 'Por um instante, você tem uma visão de um futuro sombrio e terrível. Você fica abalado, mas ileso.', chance: 600, efeito: { tipo: 'nada' } }, // 5%
    { titulo: 'Enxame de Insetos', descricao: 'Um enxame de insetos voadores irritantes o cerca, tornando difícil se concentrar.', chance: 650, efeito: { tipo: 'nada' } }, // 5%
    { titulo: 'Animal Amigável', descricao: 'Um animal selvagem (um esquilo, um pássaro) se aproxima curiosamente antes de seguir seu caminho.', chance: 700, efeito: { tipo: 'nada' } }, // 5%
    { titulo: 'Encontro com Mercador Misterioso', descricao: 'Um vendedor encapuzado aparece, oferecendo um item raro por um preço suspeitamente baixo.', chance: 750, efeito: { tipo: 'nada' } }, // 5% - (Futuramente pode abrir uma loja)
    { titulo: 'Santuário de Cura', descricao: 'Você encontra uma fonte brilhante e tranquila. Beber de suas águas restaura completamente seu HP.', chance: 770, efeito: { tipo: 'cura_hp', valor: 9999 } }, // 2%
    { titulo: 'Caçadores de Tesouros', descricao: 'Um grupo de caçadores de tesouros passa por você, compartilhando rumores sobre uma masmorra próxima.', chance: 800, efeito: { tipo: 'nada' } }, // 3%
    { titulo: 'Chuva de Mana', descricao: 'Uma chuva etérea e brilhante cai dos céus. Você sente suas energias arcanas completamente restauradas.', chance: 810, efeito: { tipo: 'cura_mana', valor: 9999 } }, // 1%
    { titulo: 'Patrulha de Monstros', descricao: 'Você vê uma patrulha de monstros à distância e consegue se esconder a tempo de evitar um combate.', chance: 850, efeito: { tipo: 'nada' } }, // 4%
    { titulo: 'Anomalia Mágica', descricao: 'A magia na área se torna selvagem. A próxima magia que você conjurar pode ter um efeito inesperado.', chance: 870, efeito: { tipo: 'nada' } }, // 2%
    { titulo: 'Portal Instável', descricao: 'Um portal cintilante aparece por alguns segundos antes de desaparecer. O que havia do outro lado?', chance: 880, efeito: { tipo: 'nada' } }, // 1%
    { titulo: 'Fantasma Inofensivo', descricao: 'O espírito de um antigo viajante aparece, conta uma história triste e desaparece.', chance: 900, efeito: { tipo: 'nada' } }, // 2%
    { titulo: 'Armadilha Antiga', descricao: 'Você encontra o corpo de um monstro preso em uma armadilha. Perto dele, há uma bolsa com moedas.', chance: 930, efeito: { tipo: 'ouro', valor: '3d10' } }, // 3%
    { titulo: 'Invasão de Sombras', descricao: 'O ambiente escurece subitamente e o ar fica frio. Uma Sombra emerge do chão para atacar!', chance: 950, efeito: { tipo: 'combate', valor: 'Sombra' } }, // 2%
    { titulo: 'Caixa de Pandora', descricao: 'Você encontra uma caixa ornamentada e trancada. Abrí-la pode liberar um grande poder ou uma terrível maldição.', chance: 960, efeito: { tipo: 'nada' } }, // 1%
    { titulo: 'Mímico!', descricao: 'Um baú de tesouro solitário se revela um Mímico faminto! Prepare-se para lutar.', chance: 980, efeito: { tipo: 'combate', valor: 'Mímico' } }, // (Monstro Mímico a ser adicionado)
    { titulo: 'Desejo de um Gênio', descricao: 'Você liberta um gênio de uma lâmpada antiga! Ele concede um único desejo, mas cuidado com as palavras que usa.', chance: 990, efeito: { tipo: 'desejo' } }, // 1%
    { titulo: 'Intervenção Divina', descricao: 'Uma divindade se interessa por você, concedendo-lhe um poderoso artefato para completar uma missão sagrada.', chance: 995, efeito: { tipo: 'item', valor: 'Amuleto da Imortalidade' } }, // 0.5%
    { titulo: 'Fenda na Realidade', descricao: 'Uma fenda para um plano caótico se abre, cuspindo horrores indescritíveis. O próprio tecido da realidade está em jogo.', chance: 1000, efeito: { tipo: 'combate', valor: 'Avatar do Caos' } }, // 0.5%
];


export const RACAS: Raca[] = [
    { nome: 'Humano', bonus: { [Atributo.FOR]: 1, [Atributo.DES]: 1, [Atributo.CON]: 1, [Atributo.INT]: 1, [Atributo.SAB]: 1, [Atributo.CAR]: 1 }, tracos: ['Versátil', 'Determinado'] },
    { nome: 'Elfo', bonus: { [Atributo.DES]: 2, [Atributo.INT]: 1 }, tracos: ['Visão no Escuro', 'Sentidos Aguçados', 'Resistência a Encantamento'] },
    { nome: 'Anão', bonus: { [Atributo.CON]: 2, [Atributo.FOR]: 1 }, tracos: ['Visão no Escuro', 'Resistência a Veneno', 'Robustez Anã'] },
    { nome: 'Halfling', bonus: { [Atributo.DES]: 2, [Atributo.CAR]: 1 }, tracos: ['Sorte', 'Bravura', 'Agilidade Halfling'] },
];

export const CLASSES: Classe[] = [
    { nome: 'Guerreiro', atributoPrimario: Atributo.FOR, dadoDeVida: 10, equipamentosIniciais: ['Espada de Ferro', 'Armadura de Couro', 'Escudo de Madeira'], manaBase: 0 },
    { nome: 'Ladino', atributoPrimario: Atributo.DES, dadoDeVida: 8, equipamentosIniciais: ['Adaga de Couro', 'Armadura de Couro'], manaBase: 10 },
    { nome: 'Mago', atributoPrimario: Atributo.INT, dadoDeVida: 6, equipamentosIniciais: ['Adaga de Couro', 'Grimório do Aprendiz'], manaBase: 30 },
    { nome: 'Clérigo', atributoPrimario: Atributo.SAB, dadoDeVida: 8, equipamentosIniciais: ['Maça', 'Escudo de Madeira', 'Símbolo Sagrado de Madeira'], manaBase: 25 },
];

export const RARIDADE_MAP: Record<Raridade, { nome: string; cor: string }> = {
    [Raridade.Comum]: { nome: 'Comum', cor: 'bg-gray-500 text-white' },
    [Raridade.Incomum]: { nome: 'Incomum', cor: 'bg-green-600 text-white' },
    [Raridade.Raro]: { nome: 'Raro', cor: 'bg-blue-600 text-white' },
    [Raridade.Epico]: { nome: 'Épico', cor: 'bg-purple-700 text-white' },
    [Raridade.Lendario]: { nome: 'Lendário', cor: 'bg-yellow-500 text-black' },
    [Raridade.Mitico]: { nome: 'Mítico', cor: 'bg-orange-500 text-white' },
    [Raridade.Divino]: { nome: 'Divino', cor: 'bg-cyan-300 text-black' },
    [Raridade.Extremo]: { nome: 'Extremo', cor: 'bg-red-700 text-white' },
    [Raridade.Artefato]: { nome: 'Artefato', cor: 'bg-pink-600 text-white' },
    [Raridade.Cosmico]: { nome: 'Cósmico', cor: 'bg-indigo-800 text-cyan-300' },
};

export const XP_PARA_NIVEL: readonly number[] = [
    0, // Nível 1
    300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, // Nível 11
];

type LootTable = {
    [key in Raridade]?: {
        chance: number; // Limite superior em d10000
        itens: string[];
    }
}

export const TABELA_LOOT: LootTable = {
    [Raridade.Comum]: { chance: 6000, itens: ['Espada de Ferro', 'Adaga de Couro', 'Armadura de Couro', 'Escudo de Madeira', 'Maça'] },
    [Raridade.Incomum]: { chance: 8500, itens: ['Poção de Cura Menor', 'Poção de Mana Menor'] },
    [Raridade.Raro]: { chance: 9500, itens: ['Machado de Guerra Ancestral', 'Arco Longo Élfico', 'Anel Elemental Instável'] },
    [Raridade.Epico]: { chance: 9850, itens: ['Manto do Deslocamento'] },
    [Raridade.Lendario]: { chance: 9950, itens: ['Cajado do Arcanista Supremo', 'Anel dos Três Desejos'] },
    [Raridade.Mitico]: { chance: 9980, itens: ['Armadura de Placas Dracônica', 'Elmo da Soberania'] },
    [Raridade.Divino]: { chance: 9995, itens: ['Lâmina Celestial de Aurora', 'Amuleto da Imortalidade'] },
    [Raridade.Extremo]: { chance: 9999, itens: ['Foice do Fim dos Tempos', 'Fragmento da Criação'] },
    [Raridade.Artefato]: { chance: 10000, itens: ['Espada Vorpal', 'Manto das Estrelas'] },
    // Cósmico não é encontrado, apenas concedido por eventos
};