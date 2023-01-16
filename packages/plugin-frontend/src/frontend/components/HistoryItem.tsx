import { HijackerRequest, HijackerResponse } from "@hijacker/core";
import { Box, Step, StepButton, Stepper, styled, Typography, Link } from "@mui/material"
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useState } from "react"

import { Editor } from "./Editor.js";
import { HistoryDataGroup } from "./HistoryDataGroup.js";

const HistoryTimeline = styled(Stepper)`
  margin: ${({theme}) => `${theme.spacing(2)} 0`};
`

const HistoryDataItem = styled(Typography)`
  font-size: .75rem;
`

const HistoryDataItemLabel = styled('span')`
  color: ${({theme}) => theme.palette.info.main};
  font-weight: 600;
`

interface HistoryItem {
  requestId: string;
  hijackerRequest: HijackerRequest;
  hijackerResponse?: HijackerResponse;
};

interface HistoryItemProps {
  item: HistoryItem;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ item }) => {
  const [activeStep, setActiveStep] = useState(0);
  
  const handleStepClick = (step: number) => {
    setActiveStep(step);
  };

  // TODO: Steps should be enabled when a breakpoint is in there (should have editor)
  return (
    <Box>
      <HistoryTimeline activeStep={activeStep}>
        <Step completed disabled={false}>
          <StepButton disableRipple onClick={() => handleStepClick(0)}>HIJACKER_REQUEST</StepButton>
        </Step>
        <Step completed={!!item.hijackerResponse} disabled={!item.hijackerResponse}>
          <StepButton disableRipple onClick={() => handleStepClick(1)} disabled={!item.hijackerResponse}>HIJACKER_RESPONSE</StepButton>
        </Step>
      </HistoryTimeline>
      {activeStep === 0 && (
        <Box>
          <HistoryDataGroup name="General">
            <HistoryDataItem><HistoryDataItemLabel>Method:</HistoryDataItemLabel> { item.hijackerRequest.method }</HistoryDataItem>
            <HistoryDataItem><HistoryDataItemLabel>Path:</HistoryDataItemLabel> { item.hijackerRequest.path }</HistoryDataItem>
          </HistoryDataGroup>
          { /* TODO: Break out into header display component */ }
          <HistoryDataGroup name="Request Headers">
            { Object.entries(item.hijackerRequest.headers).map(([key, val]) => (
              <HistoryDataItem key={key}>
                <Link href={`https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/${key}`} color="inherit" target="_blank">
                  <HelpOutlineIcon sx={{ verticalAlign: 'middle', fontSize: '.9rem', marginRight: '.25rem' }}/>
                </Link>
                <HistoryDataItemLabel>{key}:</HistoryDataItemLabel> {val}
              </HistoryDataItem>
            ))}
            {Object.entries(item.hijackerRequest.headers).length === 0 && (
              <Typography sx={{ fontSize: ".75rem", fontStyle: "italic" }}>No headers were recieved</Typography>
            )}
          </HistoryDataGroup>
          <HistoryDataGroup name="Request Body">
            <Editor value={JSON.stringify(item.hijackerRequest.body, null, 2)} disabled />
          </HistoryDataGroup>
        </Box>
      )}
      {activeStep === 1 && !!item.hijackerResponse && (
        <Box>
          <HistoryDataGroup name="General">
            <HistoryDataItem><HistoryDataItemLabel>Status Code:</HistoryDataItemLabel> { item.hijackerResponse.statusCode }</HistoryDataItem>
          </HistoryDataGroup>
          { /* TODO: Break out into header display component */ }
          <HistoryDataGroup name="Response Headers">
            { Object.entries(item.hijackerResponse.headers).map(([key, val]) => (
              <HistoryDataItem key={key}>
                <Link href={`https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/${key}`} color="inherit" target="_blank">
                  <HelpOutlineIcon sx={{ verticalAlign: 'middle', fontSize: '.9rem', marginRight: '.25rem' }}/>
                </Link>
                <HistoryDataItemLabel>{key}:</HistoryDataItemLabel> {val}
              </HistoryDataItem>
            ))}
            {Object.entries(item.hijackerResponse.headers).length === 0 && (
              <Typography sx={{ fontSize: ".75rem", fontStyle: "italic" }}>No headers were sent</Typography>
            )}
          </HistoryDataGroup>
          <HistoryDataGroup name="Response Body">
            <Editor value={JSON.stringify(item.hijackerResponse.body, null, 2)} disabled />
          </HistoryDataGroup>
        </Box>
      )}
    </Box>
  )
}