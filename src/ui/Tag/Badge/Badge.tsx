import { Tag } from "@/types";
import { Badge } from "@mantine/core";
import { FC } from "react";

type BadgeComponentProps = {
  tagList: Tag[];
};

export const BadgeComponent: FC<BadgeComponentProps> = ({ tagList }) => {
  return (
    <Badge variant="light" color="black" radius="sm" size="lg">
      {`+${tagList.length - 1}` ?? ""}
    </Badge>
  );
};
