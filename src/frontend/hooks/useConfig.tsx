import React, { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { Socket } from "socket.io-client";
import { io } from "socket.io-client";

import { IRule } from "../../rules/Rule.js";

interface HijackerConfig {
  rules: Partial<IRule>[];
}

interface ConfigContext {
  rules: Partial<IRule>[];
  addRule: (rule: Partial<IRule>) => void;
}

const ConfigContext = createContext<ConfigContext>({
  rules: [],
  addRule: () => {}
});

interface ContextProviderProps {
  children: JSX.Element | JSX.Element[];
}

interface ClientToServerEvents {
  ADD_RULE: (rule: Partial<IRule>) => void;
}

interface ServerToClientEvents {
  SETTINGS: (config: HijackerConfig) => void;
  UPDATE_RULES: (rules: Partial<IRule>[]) => void;
}

export const ConfigProvider: React.FC<ContextProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const [rules, setRules] = useState<Partial<IRule>[]>([]);

  useEffect(() => {
    const newSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io();
 
    newSocket.on('SETTINGS', (config) => {
      setRules(config.rules);
    })

    newSocket.on('UPDATE_RULES', setRules);

    newSocket.on('disconnect', () => {
      setSocket(null);
    })

    setSocket(newSocket);

    return () => {
      newSocket.close() 
    };
  }, [setSocket, setRules]);

  const addRule = (rule: Partial<IRule>) => {
    if (socket) {
      socket.emit('ADD_RULE', rule);
    }
  }

  return (
    <ConfigContext.Provider value={{
      rules,
      addRule
    }}>
      {children}
    </ConfigContext.Provider>
  )
};

export const useConfig = (): ConfigContext => {
  return useContext(ConfigContext);
}