import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { Box, Button, styled, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { AddRuleModal } from '../components/AddRuleModal.js';
import { Layout } from '../components/Layout.js';
import { Rule as RuleWrapper } from '../components/Rule.js';
import { useConfig } from '../hooks/useConfig.js';
import { objectSearch } from '../util/index.js';


const SectionTitle = styled(Typography)`
  font-size: 1.5rem;
  margin-bottom: ${({theme}) => theme.spacing(1)};
  display: flex;
`;

const SectionWrapper = styled(Box)`
  margin-bottom: ${({theme}) => theme.spacing(2)};
`;

const MessageBox = styled(Box)`
  padding: ${({theme}) => theme.spacing(1)};
  border-radius: 3px;
  border: 1px solid ${({theme}) => theme.palette.grey[300]};
  text-align: center;
`;

export const HomePage = () => {
  const { baseRule, rules, addRule, updateRule, updateBaseRule, deleteRule } = useConfig();
  
  const [filteredRules, setFilteredRules] = useState(rules);
  const [filter, setFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!filter) {
      setFilteredRules(rules);
      return;
    }
    
    setFilteredRules(objectSearch(rules, filter));
  }, [rules, filter]);

  return (
    <Layout filter={filter} onFilterChange={setFilter} filterLabel="Filter Rules">
      <SectionTitle variant="h2">
        Base Rule
      </SectionTitle>
      {baseRule && (
        <SectionWrapper>
          <RuleWrapper
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
        {rules.length === 0 && <MessageBox>Currently no rules. Add a rule to get started</MessageBox>}
        {filteredRules.length === 0 && rules.length !== 0 && <MessageBox>No Rules Match Filter</MessageBox>}
        {filteredRules.map(x => (
          <RuleWrapper
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
    </Layout>
  );
};