import { HttpRequest, HttpResponse, Rule } from '@hijacker/core';
import { useContext, useEffect, useState , createContext } from 'react';
import { io } from 'socket.io-client';

import { HijackerSocketClient } from '../../types/index.js';


export interface HistoryItem {
  requestId: string;
  hijackerRequest: HttpRequest;
  hijackerResponse?: HttpResponse;
}

interface ConfigContext {
  baseRule?: Partial<Rule>;
  rules: Partial<Rule>[];
  history: HistoryItem[];
  filter: string;
  clearHistory: () => void;
  setFilter: (val: string) => void;
  addRule: (rule: Partial<Rule>) => void;
  updateRule: (rule: Partial<Rule>) => void;
  updateBaseRule: (rule: Partial<Rule>) => void;
  deleteRule: (ruleId: string) => void;
}

export const ConfigContext = createContext<ConfigContext>({
  baseRule: undefined,
  rules: [],
  history: [],
  filter: '',
  clearHistory: () => {},
  setFilter: () => {},
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
  const [baseRule, setBaseRule] = useState<Partial<Rule> | undefined>(undefined);
  const [rules, setRules] = useState<Partial<Rule>[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filter, setFilter] = useState('');

  const [resetSocket, setResetSocket] = useState<boolean>(false);

  useEffect(() => {
    const newSocket: HijackerSocketClient = io();
 
    newSocket.on('SETTINGS', (config) => {
      setRules(config.rules);
      setBaseRule(config.baseRule);
    });

    newSocket.on('RULES_UPDATED', setRules);
    newSocket.on('BASE_RULE_UPDATED', setBaseRule);
    newSocket.on('HISTORY_EVENT', (historyItem) => {
      setHistory((val) => {
        const index = val.findIndex(x => x.requestId === historyItem.requestId);

        if (index === -1) {
          return [historyItem, ...val];
        }

        return val.reduce((acc, cur) => {
          if (cur.requestId === historyItem.requestId) {
            return [...acc, historyItem];
          }
  
          return [...acc, cur];
        }, [] as HistoryItem[]);
      });
    });

    newSocket.on('disconnect', () => {
      setSocket(null);
      setResetSocket(val => !val);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close(); 
    };
  }, [setSocket, setRules, setBaseRule, resetSocket]);

  const addRule = (rule: Partial<Rule>) => {
    if (socket) {
      socket.emit('ADD_RULES', [rule]);
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const updateRule = (rule: Partial<Rule>) => {
    if (socket && rule.id) {
      socket.emit('UPDATE_RULES', [{
        id: rule.id,
        ...rule
      }]);
    }
  };

  const deleteRule = (ruleId: string) => {
    if (socket) {
      socket.emit('DELETE_RULES', [ruleId]);
    }
  };

  const updateBaseRule = (rule: Partial<Rule>) => {
    if (socket) {
      socket.emit('UPDATE_BASE_RULE', rule);
    }
  };

  return (
    <ConfigContext.Provider value={{
      baseRule,
      rules,
      history,
      filter,
      clearHistory,
      setFilter,
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