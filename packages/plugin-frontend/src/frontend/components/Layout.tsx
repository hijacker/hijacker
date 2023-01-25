import SearchIcon from '@mui/icons-material/Search';
import { styled, TextField } from '@mui/material';

import { Header } from './Header';

const FilterIcon = styled(SearchIcon)`
  margin-right: 0.5rem;
  color: #999999;
`;

interface LayoutProps {
  filter?: string;
  onFilterChange?: (val: string) => void;
  filterLabel?: string;
  children: JSX.Element | (JSX.Element | undefined)[];
}

export const Layout: React.FC<LayoutProps> = ({ filter, onFilterChange, children, filterLabel }) => {
  return (
    <div>
      <Header>
        {filter !== undefined && onFilterChange !== undefined && filterLabel !== undefined ? (
          <TextField 
            sx={{
              maxWidth: '400px'
            }}
            fullWidth
            size="small"
            placeholder={filterLabel}
            InputProps={{
              startAdornment: <FilterIcon />
            }}
            value={filter}
            onChange={(e) => onFilterChange(e.target.value)}
          />
        ) : undefined}
      </Header>
      {children}
    </div>
  );
};