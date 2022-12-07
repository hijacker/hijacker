import { HttpMethod, Rule as RuleType } from '@hijacker/core';
import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  styled,
  Box,
  Tab,
  Tabs,
  Switch,
  Button
} from '@mui/material';

import { isEqual } from 'lodash-es';
import { SyntheticEvent, useEffect, useState } from 'react';
import { Editor } from './Editor';


interface RuleProps {
  rule: Partial<RuleType<any>>;
  name?: string;
  disableable?: boolean;
  onChange?: (rule: Partial<RuleType<any>>) => void;
  onDelete?: (ruleId: string) => void;
}

interface TabPanelProps {
  children?: JSX.Element | JSX.Element[];
  show: boolean;
}

const RuleMethod = styled(Typography)<{ method: HttpMethod }>`
  background-color: ${({ theme, method }) => theme.palette.methods[method]?.background ?? '#fff' };
  border: 1px solid ${({ theme, method }) => theme.palette.methods[method]?.border ?? '#fff' };
  color: #000000;
  padding: 2px 10px;
  margin-right: 10px;
  width: 95px;
  text-align: center;
`;

const RuleTitle = styled(Typography)`
  padding: 2px 0;
`;

const AccordionFooter = styled(Box)`
  display: flex;
  justify-content: right;
  gap: ${({theme}) => theme.spacing(1)};
  margin: ${({theme}) => theme.spacing(1)} 0;

  & > button {
    width: 90px;
  }
`

const TabPanel = (props: TabPanelProps) => {
  const { show, children } = props;

  return (
    <div>
      {show && children}
    </div>
  );
};

export const Rule = (props: RuleProps) => {
  const { rule, onChange, name, disableable = true, onDelete } = props;

  const [activeTab, setActiveTab] = useState(0);
  const [ruleSource, setRuleSource] = useState(JSON.stringify(rule, null, 2));

  const handleTabChange = (event: SyntheticEvent, val: number) => {
    setActiveTab(val);
  };

  const handleSourceChange = (val?: string) => {
    if (val) {
      setRuleSource(val);
    }
  };

  const onSaveRule = () => {
    try {
      const newVal = JSON.parse(ruleSource)
      if (onChange && !isEqual(newVal, rule)) {
        onChange(newVal);
      }
    } catch {
      console.error('Invalid rule object');
    }
  }

  const onDeleteRule = () => {
    if (onDelete && rule.id) {
      onDelete(rule.id);
    }
  }

  useEffect(() => {
    try {
      const curVal = JSON.parse(ruleSource)

      if (!isEqual(curVal, rule)) {
        setRuleSource(JSON.stringify(rule, null, 2));
      }
    } catch {
      setRuleSource(JSON.stringify(rule, null, 2));
    }
  }, [rule]);

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <RuleMethod method={rule.method ?? 'ALL'}>{rule.method ?? 'ALL'}</RuleMethod>
        <RuleTitle fontWeight="600" sx={{ flexGrow: 1 }}>{name ?? rule.name ?? rule.path}</RuleTitle>
        { disableable && <Switch
          size="small"
          checked={!rule.disabled}
          onClick={(e) => e.stopPropagation()}
          onChange={(e, checked) => {
            if (onChange) {
              // TODO: Check if rule === ruleSource to display message that unsaved will be overrode
              onChange({
                ...rule,
                disabled: !checked
              });
            }
          }}
        /> }
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Source" />
          </Tabs>
        </Box>
        <TabPanel show={activeTab === 0}>
          <Editor
            value={ruleSource}
            onChange={handleSourceChange}
          />
        </TabPanel>
        <AccordionFooter>
          { onDelete && <Button color="error" variant="outlined" onClick={onDeleteRule}>Delete</Button> }
          <Button color="primary" variant="outlined" onClick={onSaveRule}>Save</Button>
        </AccordionFooter>
      </AccordionDetails>
    </Accordion>
  );
};