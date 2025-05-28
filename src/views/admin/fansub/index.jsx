import {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useToast} from "../../../utilities/toast/toast.js";
import {useFormik} from "formik";
import {FansubValidationSchema} from "../../../utilities/validation/ValidationSchemas.js";
import CustomModal from "../../../components/modal/index.jsx";
import ActionButton from "../../../components/actionbutton/index.jsx";
import Card from "../../../components/card/index.jsx";
import Header from "../../../components/header/index.jsx";
import DefaultTable from "../../../components/table/DefaultTable.jsx";
import {fansubColumnsData} from "../../../components/table/columnsData.js";
import Paginator from "../../../components/table/Paginator.jsx";
import IdCard from "../../../components/idcard/index.jsx";
import {FaEdit, FaIdCard, FaTrash} from "react-icons/fa";
import CustomErrorToast from "../../../components/toast/CustomErrorToast.jsx";
import {FansubService} from "../../../services/FansubService.js";
import FansubDialog from "./components/dialog/index.jsx";

const service = new FansubService();

const Fansub = (props) => {
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
    id: "created",
    desc: true
  };
  const [requestParams, setRequestParams] = useState({
    page: 0,
    size: 10,
    sort: "created,desc",
    query: null
  });

  const baseItem = {
    name: "",
    url: ""
  };
  const formik = useFormik({
    initialValues: baseItem,
    validationSchema: FansubValidationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    validateOnMount: false,
    onSubmit: (values) => {
      if (values.id) {
        updateItem(values.id, values);
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
  const updateItem = (id, request) => {
    service
      .update(id, request)
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
    formik.resetForm();
    formik.setValues(baseItem);
    setDialogVisible(true);
  };
  const handleUpdate = (data) => {
    formik.resetForm();
    formik.setValues(data);
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

  return (
    <Card extra={"w-full h-full sm:overflow-auto px-6"}>
      <FansubDialog
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
        columnsData={fansubColumnsData}
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

export default Fansub;
