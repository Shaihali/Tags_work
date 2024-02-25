import { Badge, Text } from "@mantine/core";
import { FC } from "react";

import classes from "./TagItem.module.css";
import { IconPlus, IconX } from "@tabler/icons-react";

type TagItemProps = {
  color: string;
  label: string;
  truncate?: boolean;
  isClosed?: boolean;
  onClickUnPin?: (label: string) => void;
  onClickPin?: (label: string) => void;
};

export const TagItem: FC<TagItemProps> = ({
  color,
  label,
  truncate,
  isClosed,
  onClickUnPin,
  onClickPin,
}) => {
  return (
    <Badge
      maw={truncate ? 150 : undefined}
      className={classes.badge}
      classNames={{ label: classes.label }}
      color={color}
      onClick={() => onClickPin?.(label)}
      rightSection={
        isClosed && (
          <IconX size={"1rem"} onClick={() => onClickUnPin?.(label)} />
        )
      }
    >
      <Text truncate={truncate && "end"} className={classes.text} fz={14}>
        {label}
      </Text>
    </Badge>
  );
};
