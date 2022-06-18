import React from 'react';
import { useConfig } from '../hooks/useConfig.js';

export const HomePage: React.FC = ({ }) => {
  const { rules, addRule } = useConfig();

  return (
    <div>
      {JSON.stringify(rules)}
      <button onClick={() => {
        addRule({
          baseUrl: 'test'
        })
      }}>
        Add Rule
      </button>
    </div>
  )
}