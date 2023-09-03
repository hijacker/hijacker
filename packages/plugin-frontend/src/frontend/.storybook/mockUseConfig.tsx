import React, { useState } from 'react';
import { Rule } from '@hijacker/core';

import { ConfigContext, HistoryItem } from '../hooks/useConfig';

interface MockConfigProviderProps {
  children: JSX.Element | JSX.Element[];
  initialRules?: Rule<any>[];
  initialBaseRule?: Partial<Rule<any>>;
}

export const MockConfigProvider = ({ children, initialRules = [], initialBaseRule }: MockConfigProviderProps) => {
  const [baseRule, setBaseRule] = useState<Partial<Rule<any>> | undefined>(initialBaseRule);
  const [rules, setRules] = useState<Partial<Rule<any>>[]>(initialRules);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filter, setFilter] = useState('');

  const addRule = (rule: Partial<Rule<any>>) => {
    setRules(rules => [...rules, rule]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const updateRule = (rule: Partial<Rule<any>>) => {
    
  };

  const deleteRule = (ruleId: string) => {

  };

  const updateBaseRule = (rule: Partial<Rule<any>>) => {

  };

  return (
    <ConfigContext.Provider value={{
      baseRule,
      rules,
      history,
      filter,
      addRule,
      clearHistory,
      updateRule,
      deleteRule,
      updateBaseRule,
      setFilter
    }}>
      {children}
    </ConfigContext.Provider>
  )
}