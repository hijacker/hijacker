import { Box, styled, Typography } from '@mui/material';

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

interface HeaderProps {
  children: JSX.Element;
}

export const Header: React.FC<HeaderProps> = ({ children }) => {
  return (
    <Wrapper>
      <Title variant="h1">Hijacker</Title>
      <ContentWrapper>
        { children }
      </ContentWrapper>
    </Wrapper>
  );
};