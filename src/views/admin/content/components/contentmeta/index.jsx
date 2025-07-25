import {Dialog} from "@headlessui/react";
import React, {useCallback, useEffect, useState} from "react";
import {FaImage, FaPlus, FaTrash} from "react-icons/fa";
import InputField from "../../../../../components/fields/InputField";
import Editor from "react-simple-wysiwyg";
import Category from "../../../category";
import {useNavigate} from "react-router-dom";
import {useFormik} from "formik";
import {useTranslation} from "react-i18next";
import {ContentService} from "../../../../../services/ContentService.js";
import {ContentValidationSchema} from "../../../../../utilities/validation/ValidationSchemas.js";
import {useToast} from "../../../../../utilities/toast/toast.js";
import SelectDialog from "../../../../../components/selectdialog/index.jsx";
import CustomErrorToast from "../../../../../components/toast/CustomErrorToast.jsx";
import TextField from "../../../../../components/fields/TextField.jsx";

const service = new ContentService();

const ContentMeta = ({id}) => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [imageState, setImageState] = useState(null);
    const [selectedCategoryList, setSelectedCategoryList] = useState([]);
    const {t} = useTranslation();
    const toast = useToast();

    const baseRequest = {
        name: "",
        description: "",
        photoUrl: null,
        type: "SERIES",
        subject: "",
        startDate: null,
        slug: "",
        categories: [],
        episodeTime: 0,
    };
    const formik = useFormik({
        initialValues: baseRequest,
        validationSchema: ContentValidationSchema,
        validateOnChange: false,
        validateOnBlur: false,
        validateOnMounted: false,
        onSubmit(values) {
            if (values.id) {
                update(values);
            } else {
                create(values);
            }
        },
    });

    const catchError = useCallback((error, options) => {
        toast.error(<CustomErrorToast title={error.message} message={error.response?.data}/>, options);
    }, [toast]);

    const getData = useCallback((id) => {
        service
            .getById(id)
            .then((response) => {
                if (response.status === 200) {
                    formik.setValues(response.data);
                }
            })
            .catch((error) => {
                catchError(error, {
                    onClose: () => navigate(-1, {replace: true})
                });
            });
    }, [catchError]);

    useEffect(() => {
        if (id) {
            getData(id);
        }
    }, [getData, id]);

    useEffect(() => {
        setImageState(formik.values.photoUrl);
    }, [formik.values.photoUrl]);

    useEffect(() => {
        setSelectedCategoryList(formik.values.categories);
    }, [formik.values.categories]);

    const create = (request) => {
        service.create(request).then((response) => {
            if (response.status === 201) {
                toast.success(t("success"));
                navigate("/admin/contents", {replace: true});
            }
        });
    };

    const update = (request) => {
        service.update(request.id, request).then((response) => {
            if (response.status === 204) {
                toast.success(t("success"));
                navigate("/admin/contents", {replace: true});
            }
        });
    };

    const closeModal = () => {
        setIsVisible(false);
    };

    const openModal = () => {
        setIsVisible(true);
    };

    const options = [
        {
            display: "series",
            value: "SERIES",
        },
        {
            display: "movie",
            value: "MOVIE",
        },
    ];

    const createSlug = (name) => {
        const slug = name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");
        formik.setFieldValue("slug", slug);
    };

    const handleSubmit = () => {
        formik.setFieldValue(
            "categoryIds",
            selectedCategoryList.map((item) => item.id)
        );
        formik.handleSubmit();
    };

    const handleSelect = (data) => {
        if (!selectedCategoryList.map((item) => item.id).includes(data.id)) {
            setSelectedCategoryList([...selectedCategoryList, data]);
        } else {
            toast.warn(`${t("selected")} -> ${data.id}`);
        }
    }

    const handleUnSelect = (data) => {
        setSelectedCategoryList(
            selectedCategoryList.filter((item) => item.id !== data.id)
        );
    };

    const onClose = () => {
        setSelectedCategoryList(formik.values?.categories);
    };

    const onSave = () => {
        formik.setFieldValue("categories", selectedCategoryList);
    };

    const header = () => {
        return (
            <div className="grid grid-cols-2 gap-4 p-2">
                {selectedCategoryList.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between rounded-lg bg-white px-4 py-2 shadow-md transition-all hover:shadow-lg dark:bg-navy-900"
                    >
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">{item.name}</p>
                        <button
                            className="cursor-pointer ml-3 flex items-center justify-center rounded-md bg-red-500 px-3 py-2 text-white transition-all hover:bg-red-600 dark:bg-brand-400 dark:hover:bg-brand-300"
                            onClick={() => handleUnSelect(item)}
                        >
                            <FaTrash size={20}/>
                        </button>
                    </div>
                ))}
            </div>
        );
    }

    const actionButtons = (data) => {
        return (
            <div className="flex space-x-2">
                <button
                    className="flex cursor-pointer items-center justify-center rounded-lg bg-green-300 p-2 text-white hover:bg-green-400"
                    onClick={() => handleSelect(data)}
                >
                    <FaPlus size={24}/>
                </button>
            </div>
        );
    }

    const categoryView = () => {
        return (
            <div className="flex flex-wrap gap-4">
                {formik.values?.categories?.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between rounded-lg bg-white px-4 py-2 shadow-md transition-all hover:shadow-lg dark:bg-navy-900"
                    >
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">{item.name}</p>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="h-full w-full flex flex-col items-center gap-4">

            <div className="flex flex-col gap-4 w-full h-full items-center p-2">
                {/* Resim Alanı */}
                <div
                    className="flex items-center justify-center overflow-hidden rounded-2xl border border-gray-300 shadow-md sm:h-72 sm:w-72 md:h-96 md:w-96 lg:h-[26rem] lg:w-[26rem] xl:w-[22rem]">                    
                    {formik.values.photoUrl ? (
                        <img
                            src={formik.values.photoUrl}
                            alt="Seçili Fotoğraf"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-gray-500">{t("noPhoto")}</span>
                    )}
                </div>
                {/* Resim Butonları */}
                <div className="flex flex-row space-x-2 items-center justify-between w-full sm:w-72 md:w-96 lg:w-[26rem] xl:w-[22rem]">
                    <button
                        className="cursor-pointer flex flex-1 rounded-xl border-2 border-red-500 px-5 py-3 text-base font-medium text-red-500 transition duration-200 hover:bg-red-600/5 active:bg-red-700/5 dark:border-red-400 dark:bg-red-400/10 dark:text-white dark:hover:bg-red-300/10 dark:active:bg-red-200/10"
                        onClick={() => {
                            formik.setFieldValue("photoUrl", null);
                        }}
                    >
                        <FaTrash size={24} className="mr-2"/>
                        <span className="ml-auto">{t("delete")}</span>
                    </button>
                    <button
                        className="cursor-pointer flex flex-1 rounded-xl border-2 border-green-500 px-5 py-3 text-base font-medium text-green-500 transition duration-200 hover:bg-green-600/5 active:bg-green-700/5 dark:border-green-400 dark:bg-green-400/10 dark:text-white dark:hover:bg-green-300/10 dark:active:bg-green-200/10"
                        onClick={openModal}
                    >
                        <FaImage size={24} className="mr-2"/>
                        <span className="ml-auto">{!formik.values.photoUrl ? t("choose") : t("change")}</span>
                    </button>
                </div>
            </div>

            <div className="w-full flex flex-col gap-4">

                <div className="flex flex-wrap gap-2">
                    <div className="flex-1 min-w-[200px]">
                        <InputField
                            label={t("name")}
                            placeholder={t("name")}
                            name="name"
                            type="text"
                            state={formik.errors.name && "error"}
                            value={formik.values?.name}
                            onChange={(e) => {
                                formik.handleChange(e);
                                createSlug(e.target.value);
                            }}
                        />
                        {formik.errors.name && (
                            <div className="ml-2 mt-2 text-red-500">{formik.errors.name}</div>
                        )}
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <InputField
                            label={t("startDate")}
                            placeholder={t("startDate")}
                            name="startDate"
                            type="date"
                            state={formik.errors.startDate && "error"}
                            value={formik.values.startDate}
                            onChange={formik.handleChange}
                        />
                        {formik.errors.startDate && (
                            <div className="ml-2 mt-2 text-red-500">
                                {formik.errors.startDate}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <InputField
                            disabled={true}
                            label={t("slug")}
                            placeholder={t("slug")}
                            name="slug"
                            type="text"
                            state={formik.errors.slug && "error"}
                            value={formik.values.slug}
                        />
                        {formik.errors.slug && (
                            <div className="ml-2 mt-2 text-red-500">{formik.errors.slug}</div>
                        )}
                    </div>
                    <div className="flex-1 max-w-[200px]">
                        <label className="ml-3 text-sm font-bold text-navy-700 dark:text-white">
                            {t("type")}
                        </label>
                        <select
                            className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border border-gray-200 bg-white/0 p-3 text-sm outline-none focus:border-blue-500 dark:border-white/10 dark:text-white dark:focus:border-blue-400"
                            value={formik.values.type}
                            name="type"
                            onChange={formik.handleChange}
                        >
                            {options.map((option) => (
                                <option
                                    key={option.value}
                                    value={option.value}
                                    className="text-black dark:bg-navy-900 dark:text-white"
                                >
                                    {t(`${option.display}`).toUpperCase()}
                                </option>
                            ))}
                        </select>
                        {formik.errors.type && (
                            <div className="ml-2 mt-2 text-red-500">{formik.errors.type}</div>
                        )}
                    </div>
                    <div className="flex-1 max-w-fit">
                        <InputField
                            label={t("episodeTime")}
                            placeholder={t("episodeTime")}
                            name="episodeTime"
                            type="number"
                            state={formik.errors.episodeTime && "error"}
                            value={formik.values?.episodeTime}
                            onChange={(e) => {
                                formik.handleChange(e);
                            }}
                        />
                        {formik.errors.episodeTime && (
                            <div className="ml-2 mt-2 text-red-500">
                                {formik.errors.episodeTime}
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-full flex flex-col gap-2">
                    <TextField
                        id="description"
                        state={formik.errors.description && "error"}
                        label={t("description")}
                        placeholder={t("description")}
                        rows="5"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                    />
                    {formik.errors.description && (
                        <div className="ml-2 text-red-500">
                            {formik.errors.description}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-6">
                    <div className="flex-1">
                        <SelectDialog
                            extra="w-full rounded-xl bg-gradient-to-br from-[#EA52F8] to-[#0066FF] px-5 py-3 text-base font-medium text-white transition duration-200 hover:shadow-lg hover:shadow-[#0066FF]/25"
                            buttonText={t("category")}
                            component={<Category header={header()} actionButtons={actionButtons}/>}
                            onSave={onSave}
                            onClose={onClose}
                        />
                    </div>
                    {formik.values?.categories?.length > 0 && (
                        <div className="flex-1">{categoryView()}</div>
                    )}
                </div>

                <div className="w-full flex flex-col gap-4">
                    <div className="flex flex-col overflow-hidden gap-2">
                        <label className="ml-3 text-sm font-bold text-navy-700 dark:text-white">
                            {t("subject")}
                        </label>
                        <div className="editor-wrapper">
                            <Editor
                                className="min-h-[15vh] max-h-[15vh]"
                                value={formik.values?.subject}
                                name="subject"
                                onChange={formik.handleChange}
                            />
                        </div>
                    </div>
                    <div className="w-full overflow-hidden">
                        <button
                            className="w-full cursor-pointer rounded-xl bg-green-500 px-5 py-3 text-base font-medium text-white transition duration-200 hover:bg-green-600 active:bg-green-700 dark:bg-green-400 dark:text-white dark:hover:bg-green-300 dark:active:bg-green-200"
                            onClick={handleSubmit}
                        >
                            {formik.values?.id ? t("update") : t("create")}
                        </button>
                    </div>
                </div>
            </div>

            <Dialog
                open={isVisible}
                onClose={closeModal}
                className="fixed inset-0 z-10 overflow-y-auto"
            >
                <div className="flex min-h-screen items-center justify-center">
                    <Dialog.Panel
                        className="z-20 h-full max-h-[80vh]  w-full max-w-lg overflow-y-auto rounded-lg border border-gray-300 bg-white p-6 shadow-lg">
                        <div className="mb-4">
                            <label className="ml-2 text-sm font-bold text-navy-700 dark:text-white">
                                {"URL"}
                            </label>
                            <input
                                type="text"
                                name="photoUrl"
                                onChange={(e) => setImageState(e.target.value)}
                                value={imageState}
                                className="w-full rounded-md border border-gray-300 px-3 py-2"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="cursor-pointer rounded-md bg-green-500 px-4 py-2 font-bold text-white"
                                onClick={() => {
                                    formik.setFieldValue("photoUrl", imageState);
                                    closeModal();
                                }}
                            >
                                {t("choose")}
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
};

export default ContentMeta;
