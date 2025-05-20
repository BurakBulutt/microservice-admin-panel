import { useTranslation } from "react-i18next";
import { EntityLogService } from "../../../services/EntityLogService";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "../../../utilities/toast/toast";
import DefaultTable from "../../../components/table/DefaultTable";
import SearchBox from "../../../components/searchbox";
import { entityLogColumnsData } from "../../../components/table/columnsData";
import Card from "../../../components/card";
import Paginator from "../../../components/table/Paginator";
import CustomModal from "../../../components/modal";
import IdCard from "../../../components/idcard";
import { FaIdCard } from "react-icons/fa";
import Checkbox from "../../../components/checkbox";
import UserBanner from "../comment/components/user";
import CustomErrorToast from "../../../components/toast/CustomErrorToast";

const service = new EntityLogService();

const baseItems = {
  content: [],
  page: {
    number: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  },
};

const EntityLog = () => {
  const { t } = useTranslation();

  const serviceTypes = [
    {
      name: t("mediaService"),
      service: service.getMediaServiceLogs,
    },
    {
      name: t("reactionService"),
      service: service.getReactionServiceLogs,
    },
  ];
  const [activeService, setActiveService] = useState(serviceTypes[0]);
  const [items, setItems] = useState(baseItems);
  const [selectedItems, setSelectedItems] = useState([]);
  const toast = useToast();
  const defaultSorting = {
    id: "created",
    desc: true
  };
  const [requestParams, setRequestParams] = useState({
    page: 0,
    size: 10,
    sort: "created,desc"
  });

  const catchError = useCallback(
    (error, options) => {
      toast.error(<CustomErrorToast title={error.message} message={error.response?.data?.message}/>, options);
    },
    [toast]
  );

  const getItems = useCallback(
    (option) => {
      return option
        .service(requestParams)
        .then((response) => {
          if (response.status === 200) {
            setItems(response.data);
          }
        })
        .catch((error) => {
          catchError(error, {
            onClose: () => {
              setItems(baseItems);
            },
          });
        });
    },
    [requestParams, catchError]
  );

  useEffect(() => {
    getItems(activeService);
  }, [activeService, getItems]);

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

  const searchKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        const value = e.target.value.trim();
        console.log("Searching entity log:", value);
      }
    },
    []
  );

  const actionButtons = useCallback((data) => {
    return (
      <div className="flex space-x-2">
        <CustomModal
          title={"ID"}
          component={<IdCard objectId={data.id} />}
          extra={
            "flex cursor-pointer items-center justify-center rounded-lg bg-brand-500 p-2 text-white hover:bg-brand-600"
          }
          buttonText={<FaIdCard size={24} />}
        />
      </div>
    );
  }, []);

  const modalComponent = useCallback((data) => {
    return <UserBanner data={data} />;
  }, []);

  return (
    <Card extra={"w-full h-full sm:overflow-auto px-6"}>
      <div className="p-4 flex flex-row justify-between items-start gap-2">
        <div className="flex-1 min-w-[200px]">
          <div className="mt-8 flex flex-row gap-3 justify-start items-center">
            <SearchBox onKeyDown={searchKeyDown} />
            <div className="flex flex-col justify-between items-center">
              <label className="ml-3 text-sm font-bold text-navy-700 dark:text-white">
                {t("entity")}
              </label>
              <Checkbox
                checked={true}
              />
            </div>
            <div className="flex flex-col justify-between items-center">
              <label className="ml-3 text-sm font-bold text-navy-700 dark:text-white">
                {t("user")}
              </label>
              <Checkbox
                checked={true}
              />
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="ml-3 text-sm font-bold text-navy-700 dark:text-white">
            {t("service")}
          </label>
          <select
            className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border border-gray-200 bg-white/0 p-3 text-sm outline-none focus:border-blue-500 dark:border-white/10 dark:text-white dark:focus:border-blue-400"
            value={activeService.name}
            name="serviceType"
            onChange={(e) =>
              setActiveService(serviceTypes[e.target.selectedIndex])
            }
          >
            {serviceTypes.map((option) => (
              <option
                key={option.name}
                value={option.name}
                className="text-black dark:bg-navy-900 dark:text-white"
              >
                {t(`${option.name}`).toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>
      <DefaultTable
        columnsData={entityLogColumnsData}
        tableData={items.content}
        actionButtons={actionButtons}
        selectedItems={selectedItems}
        handleSelect={handleSelect}
        onSortChange={onSortChange}
        modalComponent={modalComponent}
        defaultSorting={defaultSorting}
      />
      <Paginator page={items.page} onPageChange={onPageChange} />
    </Card>
  );
};

export default EntityLog;
