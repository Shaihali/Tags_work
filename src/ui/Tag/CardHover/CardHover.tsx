import { Item } from "@/types";
import { Card } from "@mantine/core";
import { FC } from "react";
import { TagItem } from "..";

type CardHoverProps = {
  hoveredItem: Item;
};
export const CardHover: FC<CardHoverProps> = ({ hoveredItem }) => {
  return (
    <Card
      maw={210}
      radius={12}
      shadow="xl"
      style={{
        position: "absolute",
        top: "20px",
        zIndex: "1000",
        gap: "5px",
        flexDirection: "row",
        flexWrap: "wrap",
      }}
    >
      {hoveredItem.tag_ids.map(({ color, name, id }) => (
        <TagItem color={color} label={name} key={id} />
      ))}
    </Card>
  );
};
