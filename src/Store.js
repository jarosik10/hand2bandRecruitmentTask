import React, { useState, createContext } from 'react';

const Store = ({ children }) => {
    const [photosKeyword, setPhotosKeyword] = useState('');
    return (
        <Context.Provider value={[photosKeyword, setPhotosKeyword]}>
            {children}
        </Context.Provider>
    );
}

export const Context = createContext();
export default Store;

