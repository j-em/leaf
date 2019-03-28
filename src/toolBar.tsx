import React from "react";
import { Flex, Box, Button } from "@rebass/emotion";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

type Props = {};

export default (props: Props) => (
  <Flex>
    <Box pr={2}>
      <FaArrowLeft width="1.5em" height="1.5em" />
    </Box>
    <Box>
      <FaArrowRight width="1.5em" height="1.5em" />
    </Box>
  </Flex>
);
