import { HijackerRequest, HijackerResponse } from '@hijacker/core';
import { Collapse, styled, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useState } from 'react';

import { HistoryItem } from './HistoryItem';

interface HistoryItem {
  requestId: string;
  hijackerRequest: HijackerRequest;
  hijackerResponse?: HijackerResponse;
}

const CollapsibleRow = styled(TableRow)`
  cursor: pointer;

  &:hover {
    background-color: ${({theme}) => theme.palette.grey[100]};
  }
`;

interface RowProps {
  item: HistoryItem;
}

const Row: React.FC<RowProps> = ({ item }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <CollapsibleRow onClick={() => setOpen((val) => !val)}>
        <TableCell sx={{ borderBottom: 0 }}>{ item.requestId.substring(0, 7) }</TableCell>
        <TableCell sx={{ borderBottom: 0 }}>{ item.hijackerRequest.method }</TableCell>
        <TableCell sx={{ borderBottom: 0 }}>{ item.hijackerRequest.path }</TableCell>
        <TableCell sx={{ borderBottom: 0 }}>{ item.hijackerResponse?.statusCode }</TableCell>
        <TableCell sx={{ borderBottom: 0 }}>{ item.hijackerResponse && item.hijackerResponse.timestamp - item.hijackerRequest.timestamp }ms</TableCell>
      </CollapsibleRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <HistoryItem item={item} />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

interface HistoryTableProps {
  history: HistoryItem[];
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ history }) => {
  return (
    <Table size="small" sx={{ tableLayout: 'fixed' }}>
      <TableHead>
        <TableCell width="80px"></TableCell>
        <TableCell width="100px">Method</TableCell>
        <TableCell width="200px">Path</TableCell>
        <TableCell width="50px">Status</TableCell>
        <TableCell>Time</TableCell>
      </TableHead>
      <TableBody>
        { history.map((item) => <Row item={item} key={item.requestId} />) }
        { history.length === 0 && (
          <TableRow>
            <TableCell style={{ textAlign: 'center' }} colSpan={5}>
            Currently no history items to see.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};