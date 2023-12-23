import React, { useEffect, useState } from "react";
import { Modal } from "antd";

import { useDispatch, useSelector } from "react-redux";
import { crud } from "@/redux/crud/actions";
import { useCrudContext } from "@/context/crud";
import { selectDeletedItem } from "@/redux/crud/selectors";
import { valueByString } from "@/utils/helpers";

export default function DeleteModal({ config }) {
  let {
    entity,
    entityDisplayLabels,
    deleteMessage = "Bạn có chắc muốn xóa : ",
    modalTitle = "Xóa dữ liệu",
  } = config;
  const dispatch = useDispatch();
  const { current, isLoading, isSuccess } = useSelector(selectDeletedItem);
  const { state, crudContextAction } = useCrudContext();
  const { isModalOpen } = state;
  const { modal } = crudContextAction;
  const [displayItem, setDisplayItem] = useState("");

  useEffect(() => {
    if (isSuccess) {
      modal.close();
      dispatch(crud.list(entity));
      dispatch(crud.resetAction(entity));
    }
    if (current) {
      let labels = entityDisplayLabels
        .map((x) => valueByString(current, x))
        .join(" ");

      setDisplayItem(current.content || current.postGroupName);
    }
  }, [isSuccess, current]);

  const handleOk = () => {
    if (current.postId && current.commentId) {
      console.log("Xóa Comment");
      dispatch(crud.delete(entity, current.commentId));
    } else if (current.postId && !current.commentId) {
      console.log("Xóa Post");
      dispatch(crud.delete(entity, current.postId));
    } else if (current.postGroupId) {
      console.log("Xóa PostGroup");
      dispatch(crud.delete(entity, current.postGroupId));
    } else if (current.shareId) {
      console.log("Xóa Share");
      dispatch(crud.delete(entity, current.shareId));
    }
  };
  const handleCancel = () => {
    if (!isLoading) modal.close();
  };
  return (
    <Modal
      title={modalTitle}
      visible={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={isLoading}
      okText="Xác nhận"
      cancelText="Hủy"
    >
      <p>
        {deleteMessage}
        {displayItem}
      </p>
    </Modal>
  );
}
