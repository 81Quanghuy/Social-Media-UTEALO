import React from "react";

import { Button, Menu } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { crud } from "@/redux/crud/actions";
import {
  selectItemByUserId,
  selectItemByPostId,
  selectItemByPostGroupId,
  selectItemByCommentId,
  selectItemByShareId,
} from "@/redux/crud/selectors";
import { useCrudContext } from "@/context/crud";
import uniqueId from "@/utils/uinqueId";
import DataTable from "@/components/DataTable";

function AddNewItem({ config }) {
  const { crudContextAction } = useCrudContext();
  const { collapsedBox, panel } = crudContextAction;
  const { ADD_NEW_ENTITY } = config;
  const handelClick = () => {
    panel.open();
    collapsedBox.close();
  };

  return (
    <Button onClick={handelClick} type="primary">
      {ADD_NEW_ENTITY}
    </Button>
  );
}

function DropDownRowMenu({ row }) {
  const dispatch = useDispatch();
  const { crudContextAction } = useCrudContext();
  const { panel, collapsedBox, modal, readBox, editBox } = crudContextAction;

  let item;

  if (row.userId && row.postId) {
    // Nếu cả userId và postId đều có giá trị
    item = useSelector(selectItemByPostId(row.postId));
  } else if (row.userId && !row.postId) {
    // Nếu chỉ có userId
    item = useSelector(selectItemByUserId(row.userId));
  } else if (row.postGroupId && !row.postId) {
    // Nếu chỉ có postGroupId
    item = useSelector(selectItemByPostGroupId(row.postGroupId));
  } else if (row.commentId) {
    // Nếu chỉ có commentId
    item = useSelector(selectItemByCommentId(row.commentId));
  } else if (row.shareId) {
    // Nếu chỉ có shareId
    item = useSelector(selectItemByShareId(row.shareId));
  }

  //const item = useSelector(selectItemByUserId(row.userId) || selectItemByPostId(row.postId));
  const Show = () => {
    dispatch(crud.currentItem(item));
    panel.open();
    collapsedBox.open();
    readBox.open();
  };
  function Edit() {
    dispatch(crud.currentAction("update", item));
    editBox.open();
    panel.open();
    collapsedBox.open();
  }
  function Delete() {
    dispatch(crud.currentAction("delete", item));
    modal.open();
  }

  console.log("row", row);

  return (
    <Menu style={{ width: 130 }}>
      <Menu.Item key={`${uniqueId()}`} icon={<EyeOutlined />} onClick={Show}>
        Hiển thị
      </Menu.Item>
      {row.email && row.userId && (
        <Menu.Item key={`${uniqueId()}`} icon={<EditOutlined />} onClick={Edit}>
          Chỉnh sửa
        </Menu.Item>
      )}
      {(row.commentId || row.postId || row.postGroupId || row.shareId) && (
        <Menu.Item
          key={`${uniqueId()}`}
          icon={<DeleteOutlined />}
          onClick={Delete}
        >
          Xóa
        </Menu.Item>
      )}
    </Menu>
  );
}

export default function CrudDataTable({ config }) {
  return (
    <DataTable
      config={config}
      DropDownRowMenu={DropDownRowMenu}
      AddNewItem={AddNewItem}
    />
  );
}
