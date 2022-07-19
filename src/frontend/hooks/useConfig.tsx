import { useContext, useEffect, useState , createContext } from 'react';
import { Socket , io } from 'socket.io-client';

import { IRule } from '../../rules/Rule.js';

interface HijackerConfig {
  rules: Partial<IRule>[];
}

interface ConfigContext {
  rules: Partial<IRule>[];
  addRule: (rule: Partial<IRule>) => void;
  updateRule: (rule: Partial<IRule>) => void;
}

const ConfigContext = createContext<ConfigContext>({
  rules: [],
  addRule: () => {},
  updateRule: () => {}
});

interface ContextProviderProps {
  children: JSX.Element | JSX.Element[];
}

interface ClientToServerEvents {
  ADD_RULE: (rule: Partial<IRule>) => void;
  UPDATE_RULES: (rule: Partial<IRule>[]) => void;
}

interface ServerToClientEvents {
  SETTINGS: (config: HijackerConfig) => void;
  UPDATE_RULES: (rules: Partial<IRule>[]) => void;
}

export const ConfigProvider = ({ children }: ContextProviderProps) => {
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const [rules, setRules] = useState<Partial<IRule>[]>([]);

  const [resetSocket, setResetSocket] = useState<boolean>(false);

  useEffect(() => {
    const newSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io();
 
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

  const addRule = (rule: Partial<IRule>) => {
    if (socket) {
      socket.emit('ADD_RULE', rule);
    }
  };

  const updateRule = (rule: Partial<IRule>) => {
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