import React, { useEffect, useState, createContext } from "react";
import { getItem,removeItem } from '../AsyncStorage';

export const UserContext = createContext();

const ContextProvider = ({ children }) => {
  const [asyncData, setAsyncData] = useState([]);

  useEffect(() => {
    const Getasyncdata = async () => {
      const data = await getItem('data');
      if (data) {
        setAsyncData(JSON.parse(data));
      }
    };

    const Clearasyncdata=async()=>{
    try {
      await removeItem('data');
    } catch (error) {
      console.error('Error removing data:', error);
    }
  }

    console.log("asyncData",asyncData);
    Getasyncdata();
    Clearasyncdata();
  }, []);



  const Data = {
    asyncData,
    setAsyncData,
    Getasyncdata: async () => {
      const data = await getItem('data');
      if (data) {
        setAsyncData(JSON.parse(data));
      }
    },
    Clearasyncdata: async () => {
      const data = await removeItem('data');
      if (data) {
        setAsyncData([]);
      }
    },

  };

  return (
    <UserContext.Provider value={Data}>
      {children}
    </UserContext.Provider>
  );
};

export default ContextProvider;
