type HasDate = {
    createdAt: string;
};

export interface HashTable<T> {
    [key: string]: T;
}

export const compareByDateDesc = (one: HasDate, two: HasDate): number => new Date(one.createdAt).getTime() - new Date(two.createdAt).getTime();
export const compareByDateAsc = (one: HasDate, two: HasDate): number => new Date(two.createdAt).getTime() - new Date(one.createdAt).getTime();