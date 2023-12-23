import React from "react";
import { Dropdown, Menu, Table } from "antd";

import { useSelector, useDispatch } from "react-redux";
import { crud } from "@/redux/crud/actions";
import {
  selectItemByUserId,
  selectItemByPostId,
  selectItemByPostGroupId,
  selectItemByCommentId,
  selectItemByShareId,
} from "@/redux/crud/selectors";
import uniqueId from "@/utils/uinqueId";
import { request } from "@/request";
import useFetch from "@/hooks/useFetch";

import {
  EllipsisOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { ShareOutlined } from "@material-ui/icons";

function DropDownRowMenu({ row }) {
  const dispatch = useDispatch();

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

export default function RecentTable({ ...props }) {
  let { entity, dataTableColumns } = props;
  dataTableColumns = [
    ...dataTableColumns,
    {
      title: "",
      render: (row) => (
        <Dropdown overlay={DropDownRowMenu({ row })} trigger={["click"]}>
          <EllipsisOutlined style={{ cursor: "pointer", fontSize: "24px" }} />
        </Dropdown>
      ),
    },
  ];

  const asyncList = () => {
    return request.list(entity);
  };
  const { result, isLoading, isSuccess } = useFetch(asyncList);
  const firstFiveItems = () => {
    if (isSuccess && result) {
      return result.slice(0, 5);
    }
    return [];
  };
  return (
    <>
      <Table
        columns={dataTableColumns}
        rowKey={(item) => item._id}
        dataSource={isSuccess && firstFiveItems()}
        pagination={false}
        loading={isLoading}
      />
    </>
  );
}
