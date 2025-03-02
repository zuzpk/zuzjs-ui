import { useEffect, useRef, useState } from "react";
var DBMode;
(function (DBMode) {
    DBMode["readOnly"] = "readonly";
    DBMode["readWrite"] = "readwrite";
})(DBMode || (DBMode = {}));
const useDB = (options) => {
    const { name, version, meta } = options;
    const db = useRef(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        const openRequest = indexedDB.open(name, +(version.toString().replace(/\./g, ``)));
        openRequest.onupgradeneeded = (event) => {
            const database = event.target.result;
            meta.forEach((meta) => {
                if (!database.objectStoreNames.contains(meta.name)) {
                    const store = database.createObjectStore(meta.name, meta.config);
                    meta.schema.forEach((schema) => {
                        store.createIndex(schema.name, schema.key || schema.name, { unique: schema.unique || false });
                    });
                }
            });
        };
        openRequest.onsuccess = (event) => {
            db.current = event.target.result;
        };
        openRequest.onerror = () => {
            setError('Failed to open database');
        };
        return () => db.current?.close();
    }, [name, version]);
    const connect = () => new Promise((resolve, reject) => {
        if (db.current)
            resolve(db.current);
        const request = indexedDB.open(name, +(version.toString().replace(/\./g, ``)));
        request.onsuccess = (event) => {
            db.current = event.target.result;
            resolve(db.current);
        };
        request.onerror = (event) => {
            reject([`Failed to open database`, event].join(`\n`));
        };
    });
    const createTransaction = (storeName, mode) => {
        const transaction = db.current.transaction(storeName, mode);
        const store = transaction.objectStore(storeName);
        return { store };
    };
    const getStore = (storeName, id) => new Promise((resolve, reject) => {
        connect().then((db) => {
            const { store } = createTransaction(storeName, DBMode.readOnly);
            const request = store.getAll();
            request.onsuccess = (evt) => {
                const result = evt.target.result;
                if (undefined == result)
                    reject('Record not found');
                resolve(evt.target.result);
            };
            request.onerror = (evt) => {
                reject(`SELECT Failed. ${evt.target.result}`);
            };
        })
            .catch(err => {
            reject(err.message || 'Database either corrupted or not initialized');
        });
    });
    const getByID = (storeName, id) => new Promise((resolve, reject) => {
        connect().then((db) => {
            const { store } = createTransaction(storeName, DBMode.readOnly);
            const request = store.get(id);
            request.onsuccess = (evt) => {
                const result = evt.target.result;
                if (undefined == result)
                    reject('Record not found');
                resolve(evt.target.result);
            };
            request.onerror = (evt) => {
                reject(`SELECT Failed. ${evt.target.result}`);
            };
        })
            .catch(err => {
            // console.log(`getByID`, err)
            reject('Database either corrupted or not initialized');
        });
    });
    const insert = (storeName, value, key) => new Promise((resolve, reject) => {
        connect().then((db) => {
            const { store } = createTransaction(storeName, DBMode.readWrite);
            const request = store.add(value, key);
            request.onsuccess = (evt) => {
                resolve(evt.target.result);
            };
            request.onerror = (evt) => {
                reject(`INSERTION Failed. ${evt.target.result}`);
            };
        })
            .catch(err => {
            reject(err.message || 'Database either corrupted or not initialized');
        });
    });
    const update = (storeName, value, key) => new Promise((resolve, reject) => {
        connect().then((db) => {
            const { store } = createTransaction(storeName, DBMode.readWrite);
            const request = store.put(value, key);
            request.onsuccess = (evt) => {
                resolve();
            };
        })
            .catch(err => {
            reject('Database either corrupted or not initialized');
        });
    });
    const remove = (storeName, key) => new Promise((resolve, reject) => {
        connect().then((db) => {
            const { store } = createTransaction(storeName, DBMode.readWrite);
            const request = store.delete(key);
            request.onsuccess = (evt) => {
                resolve();
            };
        })
            .catch(err => {
            console.log(err);
            reject(`Delete failed from ${storeName} with key: ${key}`);
        });
    });
    return {
        getByID,
        getStore,
        insert,
        update,
        remove,
        error
    };
};
export default useDB;
