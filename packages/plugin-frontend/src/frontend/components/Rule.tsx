import { json, jsonParseLinter } from '@codemirror/lang-json';
import { linter } from '@codemirror/lint';
import { Rule as RuleType } from '@hijacker/core';
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
  Switch
} from '@mui/material';
import CodeMirror from '@uiw/react-codemirror';
import { debounce, isEqual } from 'lodash';
import { SyntheticEvent, useState } from 'react';


interface RuleProps {
  rule: Partial<RuleType<any>>;
  name?: string;
  disableable?: boolean;
  onChange?: (rule: Partial<RuleType<any>>) => void;
}

interface TabPanelProps {
  children?: JSX.Element | JSX.Element[];
  show: boolean;
}

const RuleMethod = styled(Typography)`
  background-color: #fbf1e6;
  border: 1px solid #e69624;
  color: #000000;
  padding: 2px 10px;
  margin-right: 10px;
`;

const RuleTitle = styled(Typography)`
  padding: 2px 0;
`;

const TabPanel = (props: TabPanelProps) => {
  const { show, children } = props;

  return (
    <div>
      {show && children}
    </div>
  );
};

export const Rule = (props: RuleProps) => {
  const { rule, onChange, name, disableable = true } = props;

  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: SyntheticEvent, val: number) => {
    setActiveTab(val);
  };

  const handleSourceChange = (val: string) => {
    if (onChange && !isEqual(val, rule)) {
      try {
        onChange(JSON.parse(val));
      } catch {
        console.error('Invalid rule object');
      }
    }
  };

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <RuleMethod>POST</RuleMethod>
        <RuleTitle fontWeight="600" sx={{ flexGrow: 1 }}>{name ?? rule.name ?? rule.path}</RuleTitle>
        { disableable && <Switch
          size="small"
          checked={!rule.disabled}
          onClick={(e) => e.stopPropagation()}
          onChange={(e, checked) => {
            if (onChange) {
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
          <CodeMirror
            value={JSON.stringify(rule, null, 2)}
            height="350px"
            extensions={[
              json(),
              linter(jsonParseLinter())
            ]}
            onChange={debounce(handleSourceChange, 200)}
          />
        </TabPanel>
      </AccordionDetails>
    </Accordion>
  );
};