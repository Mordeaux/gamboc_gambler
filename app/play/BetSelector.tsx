"use client";
import Image from "next/image";
import React, { Dispatch } from "react";

const BetSelector = ({
  dieSide,
  betValue,
  setBetValue,
}: {
  dieSide: number;
  betValue: number;
  setBetValue: Dispatch<number>;
}) => {
  const color = betValue == dieSide ? "black-dice" : "white-dice";

  return (
    <div className={`mr-2 p-10 ${betValue == dieSide ? "bg-red" : ""}`}>
      <Image
        src={`${color}/dice-${dieSide}-svgrepo-com.svg`}
        alt={dieSide.toString()}
        onClick={() => setBetValue(dieSide)}
        height={50}
        width={50}
      />
    </div>
  );
};

export default BetSelector;
