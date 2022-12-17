import { Rule } from '@hijacker/core';
import { useContext, useEffect, useState , createContext } from 'react';
import { io } from 'socket.io-client';

import { HijackerSocketClient } from '../../types/index.js';

interface ConfigContext {
  baseRule?: Partial<Rule<any>>;
  rules: Partial<Rule<any>>[];
  addRule: (rule: Partial<Rule<any>>) => void;
  updateRule: (rule: Partial<Rule<any>>) => void;
  updateBaseRule: (rule: Partial<Rule<any>>) => void;
  deleteRule: (ruleId: string) => void;
}

const ConfigContext = createContext<ConfigContext>({
  baseRule: undefined,
  rules: [],
  addRule: () => {},
  updateRule: () => {},
  updateBaseRule: () => {},
  deleteRule: () => {}
});

interface ContextProviderProps {
  children: JSX.Element | JSX.Element[];
}

export const ConfigProvider = ({ children }: ContextProviderProps) => {
  const [socket, setSocket] = useState<HijackerSocketClient | null>(null);
  const [baseRule, setBaseRule] = useState<Partial<Rule<any>> | undefined>(undefined);
  const [rules, setRules] = useState<Partial<Rule<any>>[]>([]);

  const [resetSocket, setResetSocket] = useState<boolean>(false);

  useEffect(() => {
    const newSocket: HijackerSocketClient = io();
 
    newSocket.on('SETTINGS', (config) => {
      setRules(config.rules);
      setBaseRule(config.baseRule);
    });

    newSocket.on('RULES_UPDATED', setRules);
    newSocket.on('BASE_RULE_UPDATED', setBaseRule);

    newSocket.on('disconnect', () => {
      setSocket(null);
      setResetSocket(val => !val);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close(); 
    };
  }, [setSocket, setRules, setBaseRule, resetSocket]);

  const addRule = (rule: Partial<Rule<any>>) => {
    if (socket) {
      socket.emit('ADD_RULES', [rule]);
    }
  };

  const updateRule = (rule: Partial<Rule<any>>) => {
    if (socket) {
      socket.emit('UPDATE_RULES', [rule]);
    }
  };

  const deleteRule = (ruleId: string) => {
    if (socket) {
      socket.emit('DELETE_RULES', [ruleId]);
    }
  };

  const updateBaseRule = (rule: Partial<Rule<any>>) => {
    if (socket) {
      socket.emit('UPDATE_BASE_RULE', rule);
    }
  };

  return (
    <ConfigContext.Provider value={{
      baseRule,
      rules,
      addRule,
      updateRule,
      updateBaseRule,
      deleteRule
    }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = (): ConfigContext => {
  return useContext(ConfigContext);
};