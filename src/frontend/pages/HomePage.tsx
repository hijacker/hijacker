import React from 'react';
import { Button } from '@mui/material';

import { useConfig } from '../hooks/useConfig.js';

export const HomePage: React.FC = ({ }) => {
  const { rules, addRule } = useConfig();

  return (
    <div>
      {JSON.stringify(rules)}
      <Button onClick={() => {
        addRule({
          baseUrl: 'test',
          path: '/posts',
          skipApi: true,
          body: {
            yolo: "World"
          }
        })
      }}>
        Add Rule
      </Button>
    </div>
  )
}