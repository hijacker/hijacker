import { useContext, useEffect, useState , createContext } from 'react';
import { io } from 'socket.io-client';

import { Rule } from '../../rules/Rule.js';
import { HijackerSocketClient } from '../../types/Sockets.js';

interface ConfigContext {
  rules: Partial<Rule<any>>[];
  addRule: (rule: Partial<Rule<any>>) => void;
  updateRule: (rule: Partial<Rule<any>>) => void;
}

const ConfigContext = createContext<ConfigContext>({
  rules: [],
  addRule: () => {},
  updateRule: () => {}
});

interface ContextProviderProps {
  children: JSX.Element | JSX.Element[];
}

export const ConfigProvider = ({ children }: ContextProviderProps) => {
  const [socket, setSocket] = useState<HijackerSocketClient | null>(null);
  const [rules, setRules] = useState<Partial<Rule<any>>[]>([]);

  const [resetSocket, setResetSocket] = useState<boolean>(false);

  useEffect(() => {
    const newSocket: HijackerSocketClient = io();
 
    newSocket.on('SETTINGS', (config) => {
      setRules(config.rules);
    });

    newSocket.on('UPDATE_RULES', setRules);

    newSocket.on('disconnect', () => {
      setSocket(null);
      setResetSocket(val => !val);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close(); 
    };
  }, [setSocket, setRules, resetSocket]);

  const addRule = (rule: Partial<Rule>) => {
    if (socket) {
      socket.emit('ADD_RULES', [rule]);
    }
  };

  const updateRule = (rule: Partial<Rule>) => {
    if (socket) {
      socket.emit('UPDATE_RULES', [rule]);
    }
  };

  return (
    <ConfigContext.Provider value={{
      rules,
      addRule,
      updateRule
    }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = (): ConfigContext => {
  return useContext(ConfigContext);
};