"use client";
import {
  Box,
  Button,
  Container,
  Group,
  Modal,
  Stack,
  Table,
  Title,
  rem,
} from "@mantine/core";
import classes from "./Tag.module.css";
import { useEffect, useState } from "react";
import { Item, Tag } from "@/types";
import { ServiceRequests } from "@/services";
import { BadgeComponent, CardHover, ModalTagManagement, TagItem } from "@/ui";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";

export const TagComponent = () => {
  const [tagsState, setTagsState] = useState<Tag[]>();
  const [itemsState, setItemsState] = useState<Item[]>([]);
  const [hoveredItem, setHoveredItem] = useState<Item | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const { data: items, isSuccess } = useQuery({
    queryFn: async () => await ServiceRequests.getItems(),
    queryKey: ["items"],
  });
  const { data: tags, isSuccess: isSuccessTags } = useQuery({
    queryFn: async () => await ServiceRequests.getTags(),
    queryKey: ["tags"],
  });
  const getItemsWithTagsName = () => {
    if (isSuccess && isSuccessTags) {
      const resultItemsList = items.data.results;
      const resultTagsList = tags.data.results;

      const tagList: Item[] = resultItemsList.map((item) => {
        const tagIds = item.tag_ids.map((tagId) =>
          resultTagsList.find((tag) => tag.id === tagId)
        ) as Tag[];
        return { id: item.id, tag_ids: tagIds };
      });
      // console.log(items.data.results, tags.data.results);
      setItemsState(tagList);
      setTagsState(resultTagsList);
    }
  };
  useEffect(() => {
    getItemsWithTagsName();
  }, [items, tags]);

  const handleClickOpenModal = (item: Item) => {
    setSelectedItem(item);
    open();
  };

  const rows = itemsState.map((item) => {
    const tagList = item.tag_ids as Tag[];
    const colorFirstTag = tagList[0]?.color;
    const nameFirstTag = tagList[0]?.name;

    const getContent = () => {
      switch (true) {
        case tagList.length === 0:
          return {
            content: (
              <Box
                w={150}
                onMouseEnter={() => setHoveredItem(item)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {hoveredItem?.id === item.id ? (
                  <Button
                    variant="transparent"
                    size="xs"
                    onClick={() => handleClickOpenModal(item)}
                  >
                    + Добавить тег
                  </Button>
                ) : (
                  "-"
                )}
              </Box>
            ),
            flag: null,
          };
        case tagList.length > 1:
          return {
            content: (
              <Stack
                pos="relative"
                onMouseEnter={() => setHoveredItem(item)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => handleClickOpenModal(item)}
              >
                <TagItem truncate color={colorFirstTag} label={nameFirstTag} />
                {hoveredItem?.id === item.id && (
                  <CardHover hoveredItem={hoveredItem} />
                )}
              </Stack>
            ),
            flag: <BadgeComponent tagList={tagList} />,
          };
        default:
          return {
            content: (
              <Stack
                pos="relative"
                onMouseEnter={() => setHoveredItem(item)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => handleClickOpenModal(item)}
              >
                <TagItem truncate color={colorFirstTag} label={nameFirstTag} />
                {hoveredItem?.id === item.id && (
                  <CardHover hoveredItem={hoveredItem} />
                )}
              </Stack>
            ),
            flag: null,
          };
      }
    };

    const { content, flag } = getContent();
    return (
      <Table.Tr key={item.id} h={65}>
        <Table.Td>{item.id}</Table.Td>
        <Table.Td>
          <Group>
            {content}
            {flag}
          </Group>
        </Table.Td>
        <Table.Td>{""}</Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Container size={rem(1408)}>
      <Modal
        // xOffset={12}
        opened={opened}
        onClose={close}
        size={340}
        radius={12}
        styles={{
          header: { display: "none" },
          body: { padding: "0" },
          inner: { left: "-200px" },
        }}
      >
        {<ModalTagManagement tags={tagsState} selectedItem={selectedItem} />}
      </Modal>
      <Title order={1} pb={24}>
        Работа с тегами
      </Title>
      <Table className={classes.table}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th c="#999999">ID</Table.Th>
            <Table.Th c="#999999">Теги</Table.Th>
            <Table.Th c="#999999">Пустая колонка</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Container>
  );
};
