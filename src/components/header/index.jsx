import React, { memo } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import SearchBox from "../searchbox";

const Header = ({
  onCreate,
  onBulkDelete,
  itemsLength,
  searchKeyDown,
  component,
  extra
}) => {
  const { t } = useTranslation();

  return (
    <header className="relative flex items-center justify-between pt-4">
      <div className="flex w-full flex-row items-center justify-between gap-4">
        {component ? (
          component
        ) : (
          <div className="flex items-center justify-between space-x-4 py-4">
            <button
              className="flex flex-col cursor-pointer items-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-base font-bold text-white transition duration-200 hover:bg-green-600 active:bg-green-700 dark:bg-green-400 dark:text-white dark:hover:bg-green-300 dark:active:bg-green-200"
              onClick={onCreate}
            >
              <FaPlus />
              {t("create")}
            </button>
            <button
              className={`flex flex-col cursor-pointer items-center gap-2 rounded-xl px-5 py-3 text-base font-bold text-white transition duration-200 dark:text-white dark:hover:bg-red-300 dark:active:bg-red-200 
                    ${
                      itemsLength === 0
                        ? "cursor-not-allowed bg-red-300"
                        : "bg-red-500 hover:bg-red-600 active:bg-red-700 dark:bg-red-400"
                    }`}
              onClick={onBulkDelete}
            >
              <FaTrash />
              {t("deleteBulk")}
            </button>
            {extra}
          </div>
        )}
        <SearchBox onKeyDown={searchKeyDown} />
      </div>
    </header>
  );
};

function propsAreEqual(prevProps, nextProps) {
  return prevProps.itemsLength === nextProps.itemsLength && prevProps.component === nextProps.component;
}

export default memo(Header, propsAreEqual);
