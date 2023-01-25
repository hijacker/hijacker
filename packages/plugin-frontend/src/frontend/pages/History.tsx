import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Box, Button, styled } from '@mui/material';

import { HistoryTable } from '../components/HistoryTable.js';
import { Layout } from '../components/Layout.js';
import { useConfig } from '../hooks/useConfig.js';

const HistoryControls = styled(Box)`
  display: flex;
  justify-content: flex-end;
`;

const History: React.FC = () => {
  const { history, clearHistory } = useConfig();
  
  return (
    <Layout>
      <HistoryControls>
        <Button
          size="small"
          startIcon={<DeleteOutlineIcon/>}
          onClick={clearHistory}
        >
          Clear History
        </Button>
      </HistoryControls>
      <HistoryTable history={history} />
    </Layout>
  );
};

export default History;