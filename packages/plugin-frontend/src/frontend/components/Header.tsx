import { Box, styled, Typography, Link } from '@mui/material';

const Wrapper = styled(Box)`
  display: flex;
  gap: ${({theme}) => theme.spacing(2)};
  align-items: center;
  height: 5rem;
`;

const Title = styled(Typography)`
  font-size: 2.25rem;
`;

const ContentWrapper = styled(Box)`
  text-align: right;
  flex-grow: 1;
`;

const HeaderLinkWrapper = styled(Box)`
  display: inline;

  & + & {
    &::before {
      content: ' | ';
      pointer-events: none;
      margin: 0 5px;
    }
  }
`;
const HeaderLink = styled(Link)`
  text-decoration: none;
  color: ${({theme}) => theme.palette.grey[700]};
  text-transform: uppercase;

  &:hover {
    color: ${({theme}) => theme.palette.grey[900]};
  }
`;

const Navigation = styled('nav')`
  
`;

interface HeaderProps {
  children?: JSX.Element;
}

export const Header: React.FC<HeaderProps> = ({ children }) => {
  return (
    <Wrapper>
      <Title variant="h1">Hijacker</Title>
      <Navigation>
        <HeaderLinkWrapper>
          <HeaderLink href="/">Rules</HeaderLink>
        </HeaderLinkWrapper>
        <HeaderLinkWrapper>
          <HeaderLink href="/history">History</HeaderLink>
        </HeaderLinkWrapper>
      </Navigation>
      <ContentWrapper>
        { children }
      </ContentWrapper>
    </Wrapper>
  );
};