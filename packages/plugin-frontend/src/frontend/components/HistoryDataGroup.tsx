import { Box, styled, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { ReactElement, ReactNode, useState } from "react";

const Wrapper = styled(Box)`
  &.collapsed:last-of-type {
    border-bottom: 1px solid ${({theme}) => theme.palette.grey[300]};
  }
`

const Header = styled(Typography)`
  font-size: .9rem;
  font-weight: 600;
  color: ${({theme}) => theme.palette.grey[700] };
  background-color: ${({theme}) => theme.palette.grey[100]};
  padding: ${({theme}) => `${theme.spacing(.5)} ${theme.spacing(1)}`};
  border-top: 1px solid ${({theme}) => theme.palette.grey[300]};
  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: ${({theme}) => theme.palette.grey[200]};
  }
`;

const Body = styled(Box)`
  padding: ${({theme}) => `${theme.spacing(.5)} ${theme.spacing(1)}`};
  border-top: 1px solid ${({theme}) => theme.palette.grey[300]};
`;

interface HistoryDataGroupProps {
  name: string;
  children: ReactNode | ReactNode[];
}

export const HistoryDataGroup: React.FC<HistoryDataGroupProps> = ({ name, children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const CollapseIcon = collapsed ? ExpandMoreIcon : ExpandLessIcon;

  return (
    <Wrapper className={collapsed ? "collapsed" : undefined}>
      <Header onClick={() => setCollapsed((val) => !val)}>
        <CollapseIcon fontSize="inherit" sx={{ verticalAlign: "middle", fontSize: "1.1rem", marginRight: ".25rem" }} />
        {name}
      </Header>
      {!collapsed && (
        <Body>
          {children}
        </Body>
      )}
    </Wrapper>
  )
}