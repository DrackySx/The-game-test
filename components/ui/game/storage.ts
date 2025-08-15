import { Personagem } from '../types';

const STORAGE_KEY = 'rpg_characters_v2';

export const getCharacters = (): Personagem[] => {
    try {
        const charactersJson = localStorage.getItem(STORAGE_KEY);
        return charactersJson ? JSON.parse(charactersJson) : [];
    } catch (error) {
        console.error("Falha ao carregar personagens do localStorage", error);
        return [];
    }
};

export const saveCharacter = (character: Personagem): void => {
    const characters = getCharacters();
    const existingIndex = characters.findIndex(c => c.id === character.id);
    if (existingIndex > -1) {
        characters[existingIndex] = character;
    } else {
        characters.push(character);
    }
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
    } catch (error) {
        console.error("Falha ao salvar personagem no localStorage", error);
    }
};

export const deleteCharacter = (characterId: string): void => {
    let characters = getCharacters();
    characters = characters.filter(c => c.id !== characterId);
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
    } catch (error) {
        console.error("Falha ao deletar personagem do localStorage", error);
    }
};
