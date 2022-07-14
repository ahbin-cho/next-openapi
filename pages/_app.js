import { createContext, useState, useCallback } from 'react';
import AppLayout from './Components/AppLayout';
import '../styles/globals.css'
import 'semantic-ui-css/semantic.min.css'


export const StorageContext = createContext({
    storages: [],
    saveStorage: () => {},
    deleteStorage: () => {},
});

function MyApp({ Component, pageProps }) {
    const [ storages, setStorages ] = useState([]);

    const saveStorage = useCallback( ( item )=>{
        setStorages([ ...storages, item ])
    },[ storages ]);

    const deleteStorage = useCallback( ( item )=>{
        const itemIndex = storages.findIndex( ( s )=>{
            return s.id.videoId === item.id.videoId
        })
        storages.splice( itemIndex,1 );
        setStorages([ ...storages ])
    },[ storages ]);

    return (
        <StorageContext.Provider
            value={{
                storages,
                saveStorage,
                deleteStorage,
            }}>
            <AppLayout>
                <Component {...pageProps} />
            </AppLayout>
        </StorageContext.Provider>
    )
}

export default MyApp