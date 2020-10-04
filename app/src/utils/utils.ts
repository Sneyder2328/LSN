import {v4 as uuidv4} from 'uuid';

type HasDate = {
    createdAt: string;
};

export interface HashTable<T> {
    [key: string]: T;
}

export interface HashTableArray<T> {
    [key: string]: Array<T>;
}

export interface NumberedHashTable<T> {
    [key: number]: T;
}

export const compareByDateDesc = (one: HasDate, two: HasDate): number => new Date(one.createdAt).getTime() - new Date(two.createdAt).getTime();
export const compareByDateAsc = (one: HasDate, two: HasDate): number => new Date(two.createdAt).getTime() - new Date(one.createdAt).getTime();
export const genUUID = (): string => uuidv4();

export type ImageFile = {
    name: string;
    type: string;
    uri: string;
};
