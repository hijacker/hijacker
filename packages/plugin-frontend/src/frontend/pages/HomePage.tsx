import { Button, Typography } from '@mui/material';

import { Rule } from '../components/Rule.js';
import { useConfig } from '../hooks/useConfig.js';

export const HomePage = () => {
  const { baseRule, rules, addRule, updateRule, updateBaseRule } = useConfig();

  return (
    <div>
      <Typography variant="h2">Base Rule</Typography>
      {baseRule && (
        <div>
          <Rule
            rule={baseRule}
            onChange={updateBaseRule}
            name="Base Rule"
            disableable={false}
          /> 
        </div> 
      )}
      <Typography variant="h2">Rules</Typography>
      {rules.map(x => (
        <Rule
          rule={x}
          key={x.id} 
          onChange={updateRule}
        />
      ))}
      <Button onClick={() => addRule({})}>
        Add Rule
      </Button>
    </div>
  );
};