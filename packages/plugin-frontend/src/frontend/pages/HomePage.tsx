import { Box, Button, styled, TextField, Typography, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';

import { Rule } from '../components/Rule.js';
import { useConfig } from '../hooks/useConfig.js';
import { Header } from '../components/Header.js';
import { useEffect, useState } from 'react';
import { AddRuleModal } from '../components/AddRuleModal.js';

const FilterIcon = styled(SearchIcon)`
  margin-right: 0.5rem;
  color: #999999;
`;

const SectionTitle = styled(Typography)`
  font-size: 1.5rem;
  margin-bottom: ${({theme}) => theme.spacing(1)};
  display: flex;
`;

const SectionWrapper = styled(Box)`
  margin-bottom: ${({theme}) => theme.spacing(2)};
`

export const HomePage = () => {
  const theme = useTheme();

  const { baseRule, rules, addRule, updateRule, updateBaseRule, deleteRule } = useConfig();
  
  const [filteredRules, setFilteredRules] = useState(rules);
  const [filter, setFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setFilteredRules(rules.filter((rule) => {
      return !filter || (rule.path && rule.path.indexOf(filter) !== -1) || (rule.name && rule.name.indexOf(filter) !== -1);
    }));
  }, [rules, filter]);

  return (
    <div>
      <Header>
        <TextField 
          sx={{
            maxWidth: '400px'
          }}
          fullWidth
          size="small"
          placeholder="Filter Rules"
          InputProps={{
            startAdornment: <FilterIcon />
          }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </Header>
      <SectionTitle variant="h2">
        Base Rule
      </SectionTitle>
      {baseRule && (
        <SectionWrapper>
          <Rule
            rule={baseRule}
            onChange={updateBaseRule}
            name="Base Rule"
            disableable={false}
          /> 
        </SectionWrapper> 
      )}
      <SectionTitle variant="h2">
        <Box
          sx={{ flexGrow: 1 }}
          display="inline-block"
        >
          Rules
        </Box>
        <Button
          startIcon={<AddCircleOutlineRoundedIcon />}
          onClick={() => setModalOpen(true)}
        >
          Add Rule
        </Button>  
      </SectionTitle>
      <SectionWrapper>
        {filteredRules.map(x => (
          <Rule
            rule={x}
            key={x.id} 
            onChange={updateRule}
            onDelete={deleteRule}
          />
        ))}
      </SectionWrapper>
      <AddRuleModal
        open={modalOpen}
        onAddRule={addRule}
        onModalClose={() => setModalOpen(false)}
      />
    </div>
  );
};