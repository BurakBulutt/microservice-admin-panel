import {ContentService} from "../../../services/ContentService.js";
import {useCallback, useEffect, useMemo, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useToast} from "../../../utilities/toast/toast.js";
import XmlImportDialog from "./components/xmlimport/index.jsx";
import CustomModal from "../../../components/modal/index.jsx";
import IdCard from "../../../components/idcard/index.jsx";
import {FaEdit, FaIdCard, FaPlus, FaTrash} from "react-icons/fa";
import ActionButton from "../../../components/actionbutton/index.jsx";
import Card from "../../../components/card/index.jsx";
import Header from "../../../components/header/index.jsx";
import DefaultTable from "../../../components/table/DefaultTable.jsx";
import {contentsColumnsData} from "../../../components/table/columnsData.js";
import Paginator from "../../../components/table/Paginator.jsx";
import CustomErrorToast from "../../../components/toast/CustomErrorToast.jsx";
import {FaTurkishLiraSign} from "react-icons/fa6";


const service = new ContentService();

const Content = (props) => {
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
    const location = useLocation();
    const {t} = useTranslation();
    const toast = useToast();
    const navigate = useNavigate();
    const defaultSorting = {
        id: "created",
        desc: true
    };
    const [requestParams, setRequestParams] = useState({
        page: 0,
        size: 10,
        sort: "created,desc",
        category: null
    });

    const catchError = useCallback(
        (error, options) => {
            toast.error(<CustomErrorToast title={error.message} message={error.response?.data?.message}/>, options);
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

    const deleteContent = (id) => {
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
                catchError(error);
            });
    };

    useEffect(() => {
        getItems();
    }, [getItems]);

    const handleCreate = () => {
        navigate(location.pathname + "/create");
    };
    const handleUpdate = (data) => {
        navigate(location.pathname + `/update/${data.id}`);
    };
    const handleDelete = (id) => {
        deleteContent(id);
    };
    const handleAddLike = (id) => {
        //TODO
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
            return {...prev, page, size};
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
            console.log("Searching content:", value);
        }
    }, []);

    const importXmlButton = useMemo(() => {
        return <XmlImportDialog type={"CONTENT"}/>;
    }, []);

    const actionButtons = useCallback(
        (data) => {
            return props.actionButtons ? (
                props.actionButtons(data)
            ) : (
                <div className="flex space-x-2">
                    <CustomModal
                        title={"ID"}
                        component={<IdCard id={data.id}/>}
                        extra={
                            "flex cursor-pointer items-center justify-center rounded-lg bg-brand-500 p-2 text-white hover:bg-brand-600"
                        }
                        buttonText={<FaIdCard size={24}/>}
                    />
                    <ActionButton
                        onClick={() => handleUpdate(data)}
                        icon={<FaEdit size={24}/>}
                        color={"blue"}
                        label={t("update")}
                    />
                    <ActionButton
                        onClick={() => handleAddLike(data.id)}
                        icon={<FaPlus size={24}/>}
                        color={"green"}
                        label={t("addLike")}
                    />
                    <ActionButton
                        onClick={() => handleDelete(data.id)}
                        icon={<FaTrash size={24}/>}
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
            <Header
                onBulkDelete={() => console.log(selectedItems)}
                itemsLength={selectedItems.length}
                onCreate={handleCreate}
                searchKeyDown={searchKeyDown}
                component={props.header}
                extra={importXmlButton}
            />
            <DefaultTable
                columnsData={contentsColumnsData}
                tableData={items.content}
                selectedItems={selectedItems}
                actionButtons={actionButtons}
                handleSelect={handleSelect}
                onSortChange={onSortChange}
                defaultSorting={defaultSorting}
            />
            <Paginator page={items.page} onPageChange={onPageChange}/>
        </Card>
    );
};
export default Content;
