import "carbon-components/css/carbon-components.min.css";

import { Box, Flex } from "@rebass/emotion";
import { css, cx } from "emotion";
import React, {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useState
} from "react";
import useSearch from "./useSearch";
import { File } from "./file";

import Theme from "./theme";

type TagProps = {
  className?: string;
};

const Tag: React.FC<TagProps> = props => {
  return (
    <span {...props} className={cx("bx--tag", props.className)}>
      {props.children}
    </span>
  );
};

export type SearchBarItemProps = {
  onClick?: () => void;
  isFocused?: boolean;
};

export const SearchBarItem: React.FC<SearchBarItemProps> = props => {
  const baseStyle = css({
    display: "flex",
    alignItems: "center",
    padding: "1em",
    cursor: "pointer",
    fontWeight: 500,
    color: Theme.colors.gray["70"]
  });

  const focusedStyle =
    props.isFocused &&
    css({
      color: "white",
      backgroundColor: Theme.colors.blue["60"]
    });

  return (
    <Box onClick={props.onClick} className={cx(baseStyle, focusedStyle)}>
      {props.children}
    </Box>
  );
};

export type SearchBarInputProps = {
  onChange?: (newValue: string) => void;
  value?: string;
};

export const SearchBarInput: React.FC<SearchBarInputProps> = props => {
  const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ev => props.onChange && props.onChange(ev.target.value),
    []
  );
  return (
    <Box tabIndex={0} className={css({ outline: "none" })}>
      <Flex
        className={cx(
          "bx--text-input",
          "bx--text-input",
          ".bx--text-input::placeholder"
        )}
        alignItems="center"
        p={4}
      >
        <input
          className={css({
            backgroundColor: "inherit",
            fontFamily: Theme.fonts.sans,
            fontWeight: 500,
            fontSize: "1.5em",
            width: "100%",
            border: 0,
            "&:focus": { outline: "none" }
          })}
          placeholder="Start typing..."
          onChange={onChange}
          value={props.value}
        />
      </Flex>
    </Box>
  );
};

type SearchBarProps = { onMatchSelect: (f: File) => void };
export const SearchBar: React.FC<SearchBarProps> = props => {
  const [input, setInput] = useState("");
  const { isSearching, partialMatches, exactMatch } = useSearch(input);

  return (
    <Box>
      <SearchBarInput value={input} onChange={setInput} />
      {isSearching ? (
        <p>Searching...</p>
      ) : (
        <>
          {exactMatch && (
            <Box>
              <SearchBarItem onClick={() => props.onMatchSelect(exactMatch)}>
                <Tag className="bx--tag--green">Exact hit</Tag>
                {exactMatch.absolutePath}
              </SearchBarItem>
            </Box>
          )}
          {partialMatches.map(match => (
            <SearchBarItem onClick={() => props.onMatchSelect(match)}>
              <Tag className="bx--tag--warm-gray">Partial hit</Tag>
              {match.absolutePath}
            </SearchBarItem>
          ))}
        </>
      )}
    </Box>
  );
};

export default SearchBar;
