import { mediaColumnsData } from "../../../../../components/table/columnsData";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {FaEdit, FaIdCard, FaPlus, FaTrash} from "react-icons/fa";
import { useFormik } from "formik";

import MediaDialog from "../mediadialog";
import MediaSourceDialog from "../mediasourcedialog";
import PlayerDialog from "../playerdialog";
import DefaultTable from "../../../../../components/table/DefaultTable";
import CustomModal from "../../../../../components/modal";
import IdCard from "../../../../../components/idcard";

import { useTranslation } from "react-i18next";

import Header from "../../../../../components/header";
import ActionButton from "../../../../../components/actionbutton";

import XmlImportDialog from "../xmlimport";
import {MediaService} from "../../../../../services/MediaService.js";
import {useToast} from "../../../../../utilities/toast/toast.js";
import {MediaValidationSchema} from "../../../../../utilities/validation/ValidationSchemas.js";
import Card from "../../../../../components/card/index.jsx";
import Paginator from "../../../../../components/table/Paginator.jsx";
import CustomErrorToast from "../../../../../components/toast/CustomErrorToast.jsx";

const service = new MediaService();

const Media = (props) => {
  const { contentId } = props;
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
  const [dialogVisible, setDialogVisible] = useState(false);
  const { t } = useTranslation();
  const toast = useToast();
  const defaultSorting = {
    id: "count",
    desc: false
  };
  const [requestParams, setRequestParams] = useState({
    page: 0,
    size: 10,
    sort:"count,asc",
    content: contentId,
    query: null
  });

  const baseItem = {
    description: "",
    count: 0,
    publishDate: null,
    contentId: contentId,
  };
  const formik = useFormik({
    initialValues: baseItem,
    validationSchema: MediaValidationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    validateOnMounted: false,
    onSubmit(values) {
      if (values.id) {
        updateItem(values);
      } else {
        createItem(values);
      }
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

  const createItem = (request) => {
    service
      .create(request)
      .then((response) => {
        if (response.status === 201) {
          toast.success(t("success"), {
            onClose: getItems,
          });
          hideDialog();
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
          hideDialog();
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
          hideDialog();
        }
      })
      .catch((error) => {
        catchError(error, {});
      });
  };

  useEffect(() => {
    getItems();
  }, [getItems]);

  const handleSubmitFormik = () => {
    formik.handleSubmit();
  };
  const hideDialog = () => {
    formik.resetForm();
    setDialogVisible(false);
  };
  const handleCreate = () => {
    formik.setValues(baseItem);
    formik.setFieldValue("contentId", contentId);
    setDialogVisible(true);
  };
  const handleUpdate = (data) => {
    formik.setValues(data);
    formik.setFieldValue("contentId", contentId);
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

    const label = sorting.id;
    const direction = sorting.desc ? "desc" : "asc";

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
      setRequestParams((prevState) => ({
        ...prevState,
        query: value.length ? value : null
      }));
    }
  }, []);

  const importXmlButton = useMemo(() => {
    return <XmlImportDialog type={"MEDIA"}/>;
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
          <MediaSourceDialog mediaId={data.id} />
          <PlayerDialog mediaId={data.id} />
        </div>
      );
    },
    [props.actionButtons]
  );

  return (
    <Card extra={"w-full h-full sm:overflow-auto px-6"}>
      <MediaDialog
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
        extra={importXmlButton}
      />
      <DefaultTable
        columnsData={mediaColumnsData}
        tableData={items.content}
        actionButtons={actionButtons}
        selectedItems={selectedItems}
        handleSelect={handleSelect}
        onSortChange={onSortChange}
        defaultSorting={defaultSorting}
      />
      <Paginator page={items.page} onPageChange={onPageChange} />
    </Card>
  );
};
export default Media;
