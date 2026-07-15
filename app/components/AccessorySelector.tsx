"use client";

import { useState } from "react";
import AccessoryCard from "./AccessoryCard";

const accessories = [
  {
    id: "lightbar",
    name: "Lightbar",
    image: "/accessories/lightbar.png",
  },
  {
    id: "airhorns",
    name: "Airhorns",
    image: "/accessories/airhorns.png",
  },
  {
    id: "led-logo",
    name: "Illuminated LED DAF Logo",
    image: "/accessories/led-logo.png",
  },
  {
    id: "sunvisor",
    name: "Sun Visor",
    image: "/accessories/sunvisor.png",
  },
];
type AccessorySelectorProps = {
  onSelectionChange: (accessories: string[]) => void;
};

export default function AccessorySelector({
  onSelectionChange,
}: AccessorySelectorProps) {
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
function handleCheckboxChange(
  accessory: string,
  checked: boolean
) {
  let updatedAccessories: string[];

  if (checked) {
    updatedAccessories = [...selectedAccessories, accessory];
  } else {
    updatedAccessories = selectedAccessories.filter(
      (item) => item !== accessory
    );
  }

  setSelectedAccessories(updatedAccessories);
  onSelectionChange(updatedAccessories);
}
  return (
  <section>
    <div
  style={{
    marginBottom: "22px",
  }}
>
  <div
    style={{
      fontSize: "13px",
      fontWeight: 700,
      color: "#6b7b8c",
      letterSpacing: "1.5px",
      textTransform: "uppercase",
    }}
  >
    Stap 2
  </div>

  <h2
    style={{
      margin: "4px 0 6px",
      fontSize: "30px",
      color: "#17324d",
    }}
  >
    Kies accessoires
  </h2>

  <p
    style={{
      margin: 0,
      fontSize: "15px",
      color: "#66788a",
      lineHeight: 1.5,
    }}
  >
    Selecteer één of meerdere DAF-accessoires.
  </p>
</div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
        maxWidth: "100%",
        gap: "20px",
        marginTop: "20px",
      }}
    >
   {accessories.map((accessory) => (
  <AccessoryCard
    key={accessory.id}
    name={accessory.name}
    image={accessory.image}
    checked={selectedAccessories.includes(accessory.id)}
    onChange={(checked) =>
      handleCheckboxChange(accessory.id, checked)
    }
  />
))}
    </div>
  </section>
);
}