import uuid from "uuid";
import { useEffect, useState } from "react";

export const uniqueValuesArray = (arr1?: Array<string>, arr2?: Array<string>): Array<string> => {
    const initialArray = arr1? [...arr1] : [];
    arr2?.forEach((item) => {
        if (!initialArray.includes(item)) initialArray.push(item)
    })
    return initialArray
}

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
export const genUUID = (): string => uuid.v4();

export type ImageFile = {
    name: string;
    file: File;
    result?: string;
};

export const readImgFileContent = (imgFile: ImageFile): Promise<ImageFile> => (new Promise<ImageFile>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', (ev) => {
        // @ts-ignore
        resolve({
            ...imgFile,
            result: ev.target!.result as string
        });
    });
    reader.addEventListener('error', reject);
    reader.readAsDataURL(imgFile.file);
}));


const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
};


export const useWindowDimensions = () => {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}

export const convertToHashTable = <T>(array: Array<T>, idKey: string = 'id'): HashTable<T> => {
    if (array.length === 0) return {}
    return array.map((biz: any) => {
        return { [biz[idKey]]: biz }
    }).reduce((pv: HashTable<T>, nv: HashTable<T>) => {
        return { ...pv, ...nv }
    });
};

export const uuidv4Regex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

export const isUUIDV4 = (userIdentifier: string) => {
    return userIdentifier.match(uuidv4Regex);
}
