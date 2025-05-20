import React, {useCallback, useEffect, useMemo, useState} from "react";
import Checkbox from "../checkbox";

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import CustomModal from "../../components/modal/index";
import {useTranslation} from "react-i18next";
import enumFactory from "../../utilities/enum/enumFactory";
import {memo} from "react";

import "yet-another-react-lightbox/styles.css";
import Lightbox from "yet-another-react-lightbox";
import { MdClose, MdDone } from "react-icons/md";

const columnHelper = createColumnHelper();

const DefaultTable = ({
                          tableData,
                          columnsData,
                          modalComponent,
                          selectedItems,
                          handleSelect,
                          actionButtons,
                          onSortChange,
                          defaultSorting
                      }) => {
    const {t} = useTranslation();
    const displayEnumVal = useCallback(
        (data, enumType) => {
            const type = enumFactory(enumType);
            const msg = type[data]?.display;
            return t(`${msg}`)?.toUpperCase();
        },
        [t]
    );

    const [openPhotoId, setOpenPhotoId] = useState(null);

    const [sorting, setSorting] = useState([]);
    const data = tableData;

    const renderColumn = useCallback(
        (col, value, info) => {
            switch (col.type) {
                case "boolean":
                    const textColor = value
                        ? "bg-green-500 dark:bg-green-400"
                        : "bg-red-500 dark:bg-red-400";
                    const icon = value ? (
                        <MdDone className="text-xs"/>
                    ) : (
                        <MdClose className="text-xs"/>
                    );
                    return (
                        <div
                            className={`flex flex-row items-center max-w-fit rounded-lg px-3 py-2 text-xs font-bold uppercase text-white transition duration-200 ${textColor}`}
                        >
                            <div className="flex h-5 w-5 items-center justify-center">
                                {icon}
                            </div>
                            {t(value ? col.booleanTrue : col.booleanFalse)}
                        </div>
                    );

                case "date":
                    const date = new Date(value);
                    const formattedDate = date.toLocaleDateString("en-CA");
                    return (
                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                            {formattedDate}
                        </p>
                    );

                case "image":
                    const imageSrc = value?.trim();
                    return (
                        <div className="ml-3">
                            <img
                                className="h-auto w-full max-w-[100px] cursor-pointer rounded-lg object-cover"
                                onClick={() => {
                                    setOpenPhotoId(info.row.id);
                                }}
                                src={imageSrc}
                                alt={imageSrc}/>
                            {openPhotoId === info.row.id && (
                                <Lightbox
                                    open={true}
                                    close={() => {
                                        setOpenPhotoId(null);
                                    }}
                                    slides={[{src: imageSrc}]}
                                />
                            )}
                        </div>
                    );

                case "modal":
                    return (
                        <CustomModal
                            title={t(col.accessor)}
                            component={modalComponent(value, col.accessor)}
                            extra="linear rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white"
                            buttonText={t("show").toUpperCase()}
                        />
                    );

                case "enum":
                    return (
                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                            {displayEnumVal(value, col.enumType)}
                        </p>
                    );

                case "list":
                    return (
                        <div className="flex flex-wrap gap-2">
                            {value?.map((item, i) => (
                                <div
                                    key={i}
                                    className={`rounded-lg px-3 py-2 text-xs font-bold uppercase text-white bg-${col.listColor}-500 shadow-md transition-all hover:shadow-lg dark:bg-${col.listColor}-400`}
                                >
                                    {item[col.nameLabel]}
                                </div>
                            ))}
                        </div>
                    );

                default:
                    return (
                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                            {value}
                        </p>
                    );
            }
        },
        [openPhotoId]
    );
    const createColumns = useMemo(() => {
        return [
            ...columnsData
                .sort((a, b) => a.priority - b.priority)
                .map((col, index) => {
                    return columnHelper.accessor(col.accessor, {
                        id: col.accessor,
                        header: () => (
                            <p className="text-sm font-bold text-gray-600 dark:text-white">
                                {t(col.header || col.accessor).toUpperCase()}
                            </p>
                        ),
                        cell: (info) => {
                            const value = info.getValue();
                            const content = renderColumn(col, value, info);

                            return index === 0 ? (
                                <div className="flex items-center gap-4">
                                    <Checkbox
                                        checked={selectedItems.includes(info.row.original.id)}
                                        onChange={(e) => handleSelect(e, info.row.original.id)}
                                    />
                                    {content}
                                </div>
                            ) : (
                                content
                            );
                        },
                        enableSorting:
                            col.isSortable !== undefined ? col.isSortable : false,
                    });
                }),
            columnHelper.accessor("action", {
                id: "action",
                header: () => (
                    <p className="text-sm font-bold text-gray-600 dark:text-white">
                        {t("action").toUpperCase()}
                    </p>
                ),
                cell: (info) => actionButtons(info.row.original),
                enableSorting: false,
            }),
        ];
    }, [
        columnsData,
        t,
        selectedItems,
        handleSelect,
        actionButtons,
        renderColumn,
    ]);

    const table = useReactTable({
        data,
        columns: createColumns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualSorting:true,
        debugTable: true,
    });

    const isChecked = useCallback(() => {
        if (!data.length) return false;
        return data.every((item) => selectedItems.includes(item.id));
    }, [data, selectedItems]);

    useEffect(() => {
        if (onSortChange) {
            const sort = sorting.length ? sorting[0] : defaultSorting;
            onSortChange(sort);
        }
    }, [sorting,onSortChange]);

    return (
        <div className="mt-2 overflow-x-auto">
            <table className="w-full">
                <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="!border-px !border-gray-400">
                        {headerGroup.headers.map((header, index) => (
                            <th
                                key={header.id}
                                colSpan={header.colSpan}
                                className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-start"
                            >
                                <div className="flex items-center space-x-4">
                                    {index === 0 && (
                                        <Checkbox
                                            checked={isChecked()}
                                            onChange={(e) =>
                                                handleSelect(
                                                    e,
                                                    data.map((item) => item.id)
                                                )
                                            }
                                        />
                                    )}
                                    <div
                                        className="text-xs text-gray-200"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                        {{
                                            asc: "",
                                            desc: "",
                                        }[header.column.getIsSorted()] ?? null}
                                    </div>
                                </div>
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody>
                {table
                    .getRowModel()
                    .rows.slice(0, data.length)
                    .map((row) => {
                        return (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => {
                                    return (
                                        <td
                                            key={cell.id}
                                            className="min-w-[150px] border-white/0 py-3  pr-4"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default memo(DefaultTable);
