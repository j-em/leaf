import styled from '@emotion/styled';
import { Flex } from '@rebass/emotion';
import { css } from 'emotion';
import React from 'react';
import { FaFolder } from 'react-icons/fa';

const Input = styled.input(props => ({
  width: "100%",
  border: "0",
  fontFamily: props.theme.fonts.sans,
  fontSize: "1em",
  "&:focus": {
    outline: "none"
  }
}));

const FolderIcon = styled(FaFolder)(props => ({
  color: props.theme.colors.gray60,
  height: "2em",
  width: "2em"
}));

type Props = {
  value: string;
  onChange?: (ev: string) => void;
};

export default ({ value, onChange, ...other }: Props) => {
  return (
    <Flex
      className={css({ border: `1px solid #CCCCCC` })}
      alignItems="center"
      p={2}
    >
      <Input
        placeholder="Find any files..."
        onChange={onChange && (ev => onChange(ev.target.value))}
        value={value}
      />
      {value.length > 0 ? <FolderIcon /> : null}
    </Flex>
  );
};
