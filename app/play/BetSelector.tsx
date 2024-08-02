"use client";
import React, { Dispatch } from "react";

const BetSelector = ({
  dieSide,
  setBetValue,
}: {
  dieSide: number;
  setBetValue: Dispatch<number>;
}) => {
  return <span onClick={() => setBetValue(dieSide)}>{dieSide}</span>;
};

export default BetSelector;
