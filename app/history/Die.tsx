import Image from "next/image";

export enum DieColor {
  White = "white",
  Black = "black",
}

const Die = ({ dieSide, color }: { dieSide: number; color: DieColor }) => (
  <Image
    src={`${color}-dice/dice-${dieSide}-svgrepo-com.svg`}
    alt={dieSide.toString()}
    height={50}
    width={50}
  />
);

export default Die;
