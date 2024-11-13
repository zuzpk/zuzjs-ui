type IDBOptions = {
    name: string;
    version: number;
    meta: IDBMeta[];
};
interface IDBMeta {
    name: string;
    config: {
        keyPath: string;
        autoIncrement: boolean;
    };
    schema: IDBSchema[];
}
interface IDBSchema {
    name: string;
    key?: string;
    unique?: boolean;
}
declare const useDB: (options: IDBOptions) => {
    getByID: <T>(storeName: string, id: string | number) => Promise<T>;
    insert: <T>(storeName: string, value: T, key?: any) => Promise<number>;
    update: <T>(storeName: string, value: T, key?: IDBValidKey) => Promise<void>;
    error: string | null;
};
export default useDB;
