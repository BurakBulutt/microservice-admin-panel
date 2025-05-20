import { Dialog } from "@headlessui/react";
import React from "react";
import InputField from "../../../../../components/fields/InputField";
import {useTranslation} from "react-i18next";

const FansubDialog = (props) => {
    const {formik,dialogVisible,handleSubmitFormik,hideDialog} = props;
    const {t} = useTranslation();

    const createSlug = (name) => {
        const slug = name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
        formik.setFieldValue("slug",slug);
    };

    return (
        <div>
            <Dialog
                open={dialogVisible}
                onClose={hideDialog}
                className="fixed inset-0 z-10 overflow-y-auto"
            >
                <div className="flex min-h-screen items-center justify-center">
                    <Dialog.Panel className="z-20 h-full max-h-[80vh]  w-full max-w-lg overflow-y-auto rounded-lg border border-gray-300 bg-white p-6 shadow-lg dark:!bg-navy-900 dark:border-brand-400">
                        <Dialog.Title
                            as="h3"
                            className="mb-4 text-lg font-medium leading-6 text-gray-900 dark:text-white"
                        >
                            {formik.values?.id ? t("update") : t("save")}
                        </Dialog.Title>
                        <div className="mb-4">
                            <InputField
                                label={t("name")}
                                placeholder={t("name")}
                                name="name"
                                type="text"
                                state={formik.errors.name &&  "error"}
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
                        <div className="mb-4">
                            <InputField
                                label={t("url")}
                                placeholder={t("url")}
                                name="url"
                                type="text"
                                state={formik.errors.url &&  "error"}
                                value={formik.values?.url}
                                onChange={formik.handleChange}
                            />
                            {formik.errors.url && (
                                <div className="ml-2 mt-2 text-red-500">{formik.errors.url}</div>
                            )}
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={hideDialog}
                                className="cursor-pointer rounded-md bg-red-500 px-4 py-2 font-bold text-white"
                            >
                                {t("close")}
                            </button>
                            <button
                                type="button"
                                className="cursor-pointer rounded-md bg-green-500 px-4 py-2 font-bold text-white"
                                onClick={handleSubmitFormik}
                            >
                                {t("save")}
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
};
export default FansubDialog;
