import { Box, Button, IconButton, Modal, styled, Typography } from "@mui/material"
import { useState } from "react";
import { Rule } from "@hijacker/core";
import CloseIcon from '@mui/icons-material/Close';
import { Editor } from "./Editor";

const ModalWrapper = styled(Box)`
  max-width: 800px;
  margin: 100px auto;
  background-color: #ffffff;
  outline: 0;
  padding: ${({theme}) => theme.spacing(2)};
  position: relative;
`;

const ModalTitle = styled(Typography)`
  font-size: 1.5rem;
  margin-bottom: ${({theme}) => theme.spacing(1)};
`;

const ModalBody = styled(Box)`
  
`;

const CloseModalButton = styled(IconButton)`
  position: absolute;
  top: ${({theme}) => theme.spacing(1)};
  right: ${({theme}) => theme.spacing(1)};
`;

const ModalFooter = styled(Box)`
  display: flex;
  justify-content: right;
  gap: ${({theme}) => theme.spacing(1)};
  margin: ${({theme}) => theme.spacing(1)} 0;
`

interface AddRuleModalProps {
  open: boolean;
  onAddRule: (rule: Partial<Rule>) => void;
  onModalClose: () => void;
}

export const AddRuleModal: React.FC<AddRuleModalProps> = (props) => {
  const { open , onAddRule, onModalClose } = props;
  const [ruleSource, setRuleSource] = useState('{}')

  const handleSourceChange = (val?: string) => {
    if (val) {
      setRuleSource(val);
    }
  };

  const onSaveRule = () => {
    try {
      const newVal = JSON.parse(ruleSource)
      if (onAddRule) {
        onAddRule(newVal);
        onModalClose();
      }
    } catch {
      console.error('Invalid rule object');
    }
  }

  const onCancel = () => {
    setRuleSource('{}');
    onModalClose();
  }

  return (
    <Modal
      open={open}
      onClose={onCancel}
      sx={{
        outline: 0
      }}
    >
      <ModalWrapper>
        <CloseModalButton onClick={onCancel}>
          <CloseIcon />
        </CloseModalButton>
        <ModalTitle>Add Rule</ModalTitle>
        <ModalBody>
          <Editor
            value={ruleSource}
            onChange={handleSourceChange}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="error" variant="outlined" onClick={onCancel}>Cancel</Button>
          <Button color="primary" variant="outlined" onClick={onSaveRule}>Save</Button>
        </ModalFooter>
      </ModalWrapper>
    </Modal>
  )
}