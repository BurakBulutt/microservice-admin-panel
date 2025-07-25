import { Dialog } from "@headlessui/react";
import React, {useEffect, useRef, useState} from "react";
import { useTranslation } from "react-i18next";

import { FaUpload } from "react-icons/fa";
import {useToast} from "../../../../../utilities/toast/toast.js";
import InputField from "../../../../../components/fields/InputField.jsx";

const XmlDefinitionDialog = ({ formik, dialogVisible, handleSubmitFormik, hideDialog,type }) => {
  const { t } = useTranslation();
  const toast = useToast();

  const fileInputRef = useRef(null);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [selectTypeVisible, setSelectTypeVisible] = useState(true);
  const [dragging, setDragging] = useState(false);

  const options = [
    {
      display: "content",
      value: "CONTENT",
    },
    {
      display: "media",
      value: "MEDIA",
    },
  ];

  const handleFile = (file) => {
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".xml")) {
      toast.error(t("onlyXmlFilesAreAllowed"));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result.split(",")[1];
      formik.setFieldValue("base64", base64String);
      setSelectedFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const closeDialog = () => {
    setSelectedFileName(null);
    hideDialog();
  };

  useEffect(() => {
    if (type) {
      setSelectTypeVisible(false);
    }
  }, [type]);

  return (
    <Dialog
      open={dialogVisible}
      onClose={closeDialog}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex min-h-screen items-center justify-center">
        <Dialog.Panel className="z-20 h-full max-h-[100vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-gray-300 bg-white p-6 shadow-lg dark:border-brand-400 dark:!bg-navy-900">
          <Dialog.Title
            as="h3"
            className="mb-4 text-lg font-medium leading-6 text-gray-900 dark:text-white"
          >
            {t("importXml")}
          </Dialog.Title>
          {selectTypeVisible && (
              <div className="mb-4 flex flex-col">
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
          )}
          <div className="mb-4">
            <InputField
                label={t("fileName")}
                placeholder={t("fileName")}
                name="fileName"
                type="text"
                state={formik.errors.fileName &&  "error"}
                value={formik.values?.fileName}
                onChange={formik.handleChange}
            />
          </div>
          <div
              className={`flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center hover:border-brand-500 dark:border-white/10 dark:hover:border-brand-400 ${
                  dragging
                      ? "border-brand-600 bg-brand-50 dark:bg-brand-900"
                      : "border-gray-300 dark:bg-transparent"
              }`}
              onClick={() => fileInputRef.current.click()}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
          >
            <FaUpload className="mb-2 text-4xl text-brand-500 dark:text-brand-400" />
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-200">
              {selectedFileName ? selectedFileName : t("clickOrDragToUpload")}
            </p>
            <input
              type="file"
              accept=".xml"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            {formik.errors.base64 && (
              <div className="ml-2 mt-2 text-red-500">
                {formik.errors.base64}
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={closeDialog}
              className="mr-2 cursor-pointer rounded-md bg-red-500 px-4 py-2 font-bold text-white"
            >
              {t("close")}
            </button>
            <button
              type="button"
              onClick={handleSubmitFormik}
              className="cursor-pointer rounded-md bg-green-500 px-4 py-2 font-bold text-white"
            >
              {t("save")}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
export default XmlDefinitionDialog;
