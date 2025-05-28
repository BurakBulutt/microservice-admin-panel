import DefaultTable from "../../../components/table/DefaultTable";
import React, { useCallback, useEffect, useState } from "react";
import { commentColumnsData } from "../../../components/table/columnsData";
import { CommentService } from "../../../services/CommentService";
import {FaEdit, FaIdCard, FaPlus, FaTrash} from "react-icons/fa";
import UserBanner from "./components/user";
import Reply from "./components/reply";
import CommentDialog from "./components/dialog";
import { useTranslation } from "react-i18next";
import { useToast } from "../../../utilities/toast/toast";
import CustomModal from "../../../components/modal";
import IdCard from "../../../components/idcard";
import { useFormik } from "formik";
import {
  CommentCreateValidationSchema,
  CommentUpdateValidationSchema,
} from "../../../utilities/validation/ValidationSchemas";

import ActionButton from "../../../components/actionbutton";
import Header from "../../../components/header";
import Paginator from "../../../components/table/Paginator";
import Card from "../../../components/card/index.jsx";
import CustomErrorToast from "../../../components/toast/CustomErrorToast.jsx";

const service = new CommentService();

const Comment = (props) => {
  const [items, setItems] = useState({
    content: [],
    page: {
      number: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0,
    },
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const { t } = useTranslation();
  const toast = useToast();
  const [validationSchema, setValidationSchema] = useState(
    CommentCreateValidationSchema
  );
  const [dialogVisible, setDialogVisible] = useState(false);
  const defaultSorting = {
    id: "created",
    desc: true
  };
  const [requestParams, setRequestParams] = useState({
    page: 0,
    size: 10,
    sort: "created,desc",
    target: null
  });

  const baseItem = {
    content: "",
    userId: null,
    type: "COMMENT",
    targetId: null,
    parentId: null,
  };
  const formik = useFormik({
    validationSchema: validationSchema,
    initialValues: baseItem,
    validateOnMount: false,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      if (values.id) {
        updateItem(values);
      } else {
        createItem(values);
      }
      setDialogVisible(false);
    },
  });

  const catchError = useCallback(
    (error, options) => {
      toast.error(<CustomErrorToast title={error.message} message={error.response?.data}/>, options);
    },
    [toast]
  );

  const getItems = useCallback(() => {
      service
          .filter(requestParams)
          .then((response) => {
            if (response.status === 200) {
              setItems(response.data);
            }
          })
          .catch((error) => {
            catchError(error, {});
          });

  }, [requestParams, catchError]);

  useEffect(() => {
    getItems();
  }, [getItems]);

  const createItem = (request) => {
    service
      .create(request)
      .then((response) => {
        if (response.status === 201) {
          toast.success(t("success"), {
            onClose: getItems,
          });
        }
      })
      .catch((error) => {
        catchError(error, {});
      });
  };

  const updateItem = (request) => {
    service
      .update(request.id, request)
      .then((response) => {
        if (response.status === 204) {
          toast.success(t("success"), {
            onClose: getItems,
          });
        }
      })
      .catch((error) => {
        catchError(error, {});
      });
  };

  const deleteItem = (id) => {
    service
      .delete(id)
      .then((response) => {
        if (response.status === 204) {
          toast.success(t("success"), {
            onClose: getItems,
          });
        }
      })
      .catch((error) => {
        catchError(error, {});
      });
  };

  const handleSubmitFormik = () => {
    if (formik.values.type === "COMMENT") {
      formik.setFieldValue("parentId", null);
    }
    formik.handleSubmit();
  };
  const hideDialog = () => {
    formik.resetForm();
    setDialogVisible(false);
  };
  const handleCreate = () => {
    setValidationSchema(CommentCreateValidationSchema);
    formik.setValues(baseItem);
    setDialogVisible(true);
  };
  const handleUpdate = (data) => {
    setValidationSchema(CommentUpdateValidationSchema);
    formik.setValues({
      id: data.id,
      content: data.content,
    });
    setDialogVisible(true);
  };
  const handleDelete = (id) => {
    deleteItem(id);
  };

  const handleSelect = useCallback((e, items) => {
    if (e.target.checked) {
      setSelectedItems((prev) =>
        Array.isArray(items)
          ? [...new Set([...prev, ...items])]
          : [...prev, items]
      );
    } else {
      setSelectedItems((prev) =>
        Array.isArray(items)
          ? prev.filter((item) => !items.includes(item))
          : prev.filter((item) => item !== items)
      );
    }
  }, []);

  const onPageChange = useCallback((page, size) => {
    setRequestParams((prev) => {
      if (prev.page === page && prev.size === size) return prev;

      setSelectedItems([]);
      return { ...prev, page, size };
    });
  }, []);

  const onSortChange = useCallback((sorting) => {
    if (!sorting) return;

    let label = sorting.id;
    const direction = sorting.desc ? "desc" : "asc";

    if (label === "user") {
      label = "userId";
    }

    const sort = `${label},${direction}`;

    if (sort === requestParams.sort) return;

    setRequestParams((prevState) => ({
      ...prevState,
      sort: sort
    }));
  }, [requestParams.sort]);

  const searchKeyDown = useCallback((e) => {

    if (e.key === "Enter") {
      const value = e.target.value.trim();
      console.log("Searching comments:", value);
    }
  }, []);

  const actionButtons = useCallback(
    (data) => {
      return props.actionButtons ? (
        props.actionButtons(data)
      ) : (
        <div className="flex space-x-2">
          <CustomModal
            title={"ID"}
            component={<IdCard id={data.id} />}
            extra={
              "flex cursor-pointer items-center justify-center rounded-lg bg-brand-500 p-2 text-white hover:bg-brand-600"
            }
            buttonText={<FaIdCard size={24} />}
          />
          <ActionButton
            onClick={() => handleUpdate(data)}
            icon={<FaEdit size={24} />}
            color={"blue"}
            label={t("update")}
          />
          <ActionButton
            onClick={() => handleDelete(data.id)}
            icon={<FaTrash size={24} />}
            color={"red"}
            label={t("delete")}
          />
        </div>
      );
    },
    [props.actionButtons]
  );

  const modalComponent = useCallback((data, accessor) => {
    switch (accessor) {
      case "content":
        return (
          <p className="block font-sans text-xl font-normal leading-relaxed text-navy-800 antialiased dark:text-white">
            {data}
          </p>
        );
      case "user":
        return <UserBanner data={data} />;
      case "parent":
        return data && <Reply data={Array(data)} />;
      case "commentList":
        return <Reply data={data} />;
      default:
        return <></>;
    }
  }, []);

  return (
    <Card extra={"w-full h-full sm:overflow-auto px-6"}>
      <CommentDialog
        formik={formik}
        dialogVisible={dialogVisible}
        hideDialog={hideDialog}
        handleSubmitFormik={handleSubmitFormik}
      />
      <Header
        onBulkDelete={() => console.log(selectedItems)}
        itemsLength={selectedItems.length}
        onCreate={handleCreate}
        searchKeyDown={searchKeyDown}
        component={props.header}
      />
      <DefaultTable
        columnsData={commentColumnsData}
        tableData={items.content}
        actionButtons={actionButtons}
        selectedItems={selectedItems}
        handleSelect={handleSelect}
        onSortChange={onSortChange}
        defaultSorting={defaultSorting}
        modalComponent={modalComponent}
      />
      <Paginator page={items.page} onPageChange={onPageChange} />
    </Card>
  );
};

export default Comment;
