"use client";
import {
  Box,
  Button,
  ColorSwatch,
  Group,
  Modal,
  ScrollArea,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
  rem,
} from "@mantine/core";
import { IconDots, IconGripVertical, IconTrash } from "@tabler/icons-react";
import { TagItem } from "@/ui";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { Item, ResultItem, Tag } from "@/types";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useDisclosure, useListState } from "@mantine/hooks";
import classes from "./ModalTagManagement.module.css";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { ServiceRequests } from "@/services";
import cn from "clsx";

type ModalTagManagementProps = {
  tags?: Tag[];
  selectedItem?: Item | null;
};

const COLOR = [
  "var(--color-red)",
  "var(--color-orange)",
  "var(--color-yellow)",
  "var(--color-green)",
  "var(--color-light-blue)",
  "var(--color-blue)",
  "var(--color-purple)",
  "var(--color-grey)",
];

export const ModalTagManagement: FC<ModalTagManagementProps> = ({
  tags,
  selectedItem,
}) => {
  const [currentItemState, setCurrentItemState] = useState(selectedItem);
  const [targetValue, setTargetValue] = useState<string>("");
  const [selectedTagName, setSelectedName] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<Tag>();
  const [selectedColor, setSelectedColor] = useState<string>();
  const [editTagName, setEditTagName] = useState<string>();
  const queryClient = useQueryClient();
  const [opened, { open, close }] = useDisclosure(false);
  const [openedModalDel, handle] = useDisclosure(false);

  const { data: tagsAll } = useQuery({
    queryFn: async () => await ServiceRequests.getTags(),
    queryKey: ["tags"],
  });

  const { data: itemsAll, isSuccess } = useQuery({
    queryFn: async () => await ServiceRequests.getItems(),
    queryKey: ["items"],
  });

  // console.log(itemsAll?.data.results, currentItemState);
  const actualCurrentItem = itemsAll?.data.results.find(
    (a) => a.id === currentItemState?.id
  );
  const result = tagsAll?.data.results.filter((elem) => {
    const result2 = actualCurrentItem?.tag_ids.find(
      (elem2) => elem2 === elem.id
    );
    return result2;
  });

  const isDisabled = tagsAll?.data.results.find(
    (tagName) => tagName.name === targetValue
  );
  const [state, handlers] = useListState(tagsAll?.data.results);

  const handleCreateTag = async () => {
    if (tags) {
      const tag = {
        id: uuidv4(),
        name: targetValue,
        color: COLOR[Math.floor(Math.random() * 8)],
        order: tags.length + 1,
      };
      const tagIdsList = selectedItem?.tag_ids && result ? [...result] : [];
      tagIdsList.push(tag);
      const tag_idsList = tagIdsList.map((elem) => elem.id);

      await axios.post("api/tag", tag);
      await axios.post("api/tag_ids_update", {
        item_id: currentItemState?.id,
        tag_ids: tag_idsList,
      });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["items"] });
      setTargetValue("");
    }
  };

  const handlePinTag = async (label: string) => {
    const updateTagsList = tagsAll?.data.results?.filter(
      (tag) => tag.name === label
    ) as Tag[];
    const updateItem = { ...selectedItem };
    updateItem.tag_ids = result;
    const tagNameList = updateItem.tag_ids?.map((tagName) => tagName.name);
    if (!tagNameList?.includes(label)) {
      updateItem.tag_ids?.push(...updateTagsList);
    }
    const tag_idsList = updateItem.tag_ids?.map((elem) => elem.id);
    await axios.post("api/tag_ids_update", {
      item_id: selectedItem?.id,
      tag_ids: tag_idsList,
    });
    queryClient.invalidateQueries({ queryKey: ["items"] });
  };

  const updateTagsOrder = useMutation({
    mutationFn: async (body: { state: Tag[]; item: ResultItem }) =>
      await axios.post("api/tag_list_update", body),
  });

  const prevLengthRef = useRef(state.length);

  useEffect(() => {
    const copyState = [...state];
    if (copyState.length === prevLengthRef.current) {
      copyState.forEach((tag, i) => (tag.order = i));

      const idPosition = result?.map((tag) => tag.id);

      const updateItem = {
        id: selectedItem?.id as string,
        tag_ids: idPosition as string[],
      };
      const body = {
        state: copyState,
        item: updateItem,
      };
      updateTagsOrder.mutateAsync(body).then(() => {
        queryClient.invalidateQueries({ queryKey: ["tags"] });
        queryClient.invalidateQueries({ queryKey: ["items"] });
      });
    }
    prevLengthRef.current = copyState.length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const handleSelectItem = (name: string) => {
    if (selectedTagName !== name) {
      setSelectedName(name);
    } else {
      setSelectedName("");
    }
  };

  const handleClickDots = (item: Tag) => {
    open();
    setSelectedColor(item.color);
    setSelectedTag(item);
    setEditTagName(item.name);
  };

  useEffect(() => {
    const tags = tagsAll?.data.results as Tag[];
    handlers.setState(tags);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagsAll?.data.results]);

  const items = state.map((item, index) => {
    return (
      <Draggable key={item.id} index={index} draggableId={item.id}>
        {(provided) => (
          <Table.Td
            w="100%"
            className={cn(
              classes.item,
              selectedTagName === item.name ? classes.item_select : null
            )}
            ref={provided.innerRef}
            {...provided.draggableProps}
          >
            <Group justify="space-between">
              <Group flex={1} onClick={() => handleSelectItem(item.name)}>
                <div
                  className={classes.dragHandle}
                  {...provided.dragHandleProps}
                >
                  <IconGripVertical
                    style={{ width: rem(18), height: rem(18) }}
                    stroke={1.5}
                  />
                </div>
                <TagItem
                  color={item.color}
                  label={item.name}
                  onClickPin={handlePinTag}
                />
              </Group>

              {selectedTagName === item.name && (
                <IconDots
                  onClick={() => handleClickDots(item)}
                  stroke={1.5}
                  color="gray"
                  style={{ cursor: "pointer" }}
                />
              )}
            </Group>
          </Table.Td>
        )}
      </Draggable>
    );
  });

  const handleUnpinTag = async (label: string) => {
    const updateTagsList = result?.filter((tag) => tag.name !== label);
    const tag_idsList = updateTagsList?.map((elem) => elem.id);
    await axios.post("api/tag_ids_update", {
      item_id: selectedItem?.id,
      tag_ids: tag_idsList,
    });
    queryClient.invalidateQueries({ queryKey: ["items"] });
  };

  const handleSelectColor = (color: string) => {
    setSelectedColor(color);
  };

  const updateTag = useMutation({
    mutationFn: async (body) => await axios.patch("api/tag", body),
  });
  const handleCloseModal = () => {
    close();
    if (editTagName && selectedColor) {
      updateTag
        .mutateAsync({
          ...selectedTag,
          name: editTagName,
          color: selectedColor,
        })
        .then(() => queryClient.invalidateQueries({ queryKey: ["tags"] }));
    }
  };

  const deleteTag = useMutation({
    mutationFn: async () => await axios.delete(`api/tag?id=${selectedTag?.id}`),
  });

  const handleDeleteTag = () => {
    deleteTag.mutateAsync().then(() => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["items"] });
    });
    handle.close();
    close();
  };

  return (
    <>
      <Modal
        radius={12}
        shadow="lg"
        overlayProps={{ backgroundOpacity: 0.2 }}
        opened={opened}
        yOffset={200}
        onClose={handleCloseModal}
        size={150}
        styles={{
          header: { display: "none" },
          body: { padding: "12px 6px" },
          inner: { left: "-50px" },
        }}
      >
        <TextInput
          description="Имя"
          value={editTagName}
          onChange={(event) => setEditTagName(event.currentTarget.value)}
        />
        <Text c="#999999" fz={12}>
          Цвета
        </Text>
        <Group
          p={9}
          style={{ border: "1px solid #EDEDED", borderRadius: "8px" }}
        >
          {COLOR.map((color, i) => (
            <Box
              key={i}
              c={selectedColor === color ? color : ""}
              className={cn(
                classes.boxColor_swatch,
                selectedColor === color ? classes.boxColor_swatch_active : ""
              )}
            >
              <ColorSwatch
                color={color}
                size={16}
                onClick={() => handleSelectColor(color)}
              />
            </Box>
          ))}
        </Group>
        <Button
          fz={14}
          variant="transparent"
          leftSection={<IconTrash size={"1rem"} />}
          onClick={handle.open}
        >
          Удалить тег
        </Button>
      </Modal>
      <Modal
        centered
        radius={12}
        size={250}
        opened={openedModalDel}
        onClose={handle.close}
        withCloseButton={false}
      >
        <Stack>
          <Title fz={16} fw={500} order={3} style={{ textAlign: "center" }}>
            Удалить тег?
          </Title>
          <Stack gap={8}>
            <Button
              variant="light"
              radius={8}
              color="black"
              onClick={handleDeleteTag}
            >
              Удалить
            </Button>
            <Button radius={8} variant="filled" onClick={handle.close}>
              Отмена
            </Button>
          </Stack>
        </Stack>
      </Modal>
      <Group p={12} bg={"var(--color-gray-1)"} gap={8}>
        {result?.map((tag) => (
          <TagItem
            key={tag.id}
            color={tag.color}
            label={tag.name}
            isClosed
            onClickUnPin={handleUnpinTag}
          />
        ))}
        <TextInput
          styles={{
            root: { height: "25px" },
            wrapper: { height: "25px" },
            input: { height: "25px", minHeight: "25px" },
          }}
          variant="unStyled"
          value={targetValue}
          onChange={(event) => setTargetValue(event.currentTarget.value)}
        />
      </Group>
      <Table.ScrollContainer minWidth={300} p={12}>
        <DragDropContext
          onDragEnd={({ destination, source }) =>
            handlers.reorder({
              from: source.index,
              to: destination?.index || 0,
            })
          }
        >
          <Table styles={{ td: { paddingLeft: "0" } }} highlightOnHover>
            <Droppable droppableId="dnd-list" direction="vertical">
              {(provided) => (
                <Table.Tbody
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <Button
                    h="auto"
                    pb={12}
                    variant="transparent"
                    styles={{ root: { backgroundColor: "transparent" } }}
                    disabled={
                      Boolean(isDisabled) ||
                      targetValue === "" ||
                      targetValue === null
                    }
                    onClick={handleCreateTag}
                    p={0}
                  >
                    + Создать тег
                  </Button>
                  <Table.Tr>
                    <ScrollArea h={370} type="never">
                      {items}
                      {provided.placeholder}
                    </ScrollArea>
                  </Table.Tr>
                </Table.Tbody>
              )}
            </Droppable>
          </Table>
        </DragDropContext>
      </Table.ScrollContainer>
    </>
  );
};
