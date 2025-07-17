import { Dialog } from "@headlessui/react";
import InputField from "../../../../../components/fields/InputField";
import React, { useCallback, useEffect, useState } from "react";
import { useFormik } from "formik";
import { MediaService } from "../../../../../services/MediaService.js";
import { FaEye, FaPlus, FaTrash } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useToast } from "../../../../../utilities/toast/toast";
import SelectDialog from "../../../../../components/selectdialog/index.jsx";
import Fansub from "../../../fansub/index.jsx";
import CustomErrorToast from "../../../../../components/toast/CustomErrorToast.jsx";
import {UpdateMediaSourceValidationSchema} from "../../../../../utilities/validation/ValidationSchemas.js";

const service = new MediaService();

const MediaSourceDialog = ({ mediaId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mediaSources, setMediaSources] = useState([]);
  const { t } = useTranslation();
  const toast = useToast();

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const [selectedItem, setSelectedItem] = useState(null);

  const formik = useFormik({
    initialValues: { mediaSourceRequestList: [] },
    validationSchema: UpdateMediaSourceValidationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    validateOnMounted: false,
    onSubmit: (values) => {
      updateMediaSources(values);
    },
  });

  const catchError = useCallback(
    (error,options) => {
      toast.error(<CustomErrorToast title={error.message} message={error.response?.data}/>, options);
    },
    [toast]
  );

  const getMediaSources = useCallback(() => {
    service
      .getMediaSources(mediaId)
      .then((response) => {
        if (response.status === 200) {
          setMediaSources(response.data?.map(source => ({
            url: source.url,
            type: source.type,
            fansub: source.fansub,
            mediaId: source.media.id,
          })));
        }
      })
      .catch((err) => {
        catchError(err);
      });
  }, [catchError, mediaId]);

  const updateMediaSources = (request) => {
    service
      .updateMediaSources(mediaId, request)
      .then((response) => {
        if (response.status === 204) {
          toast.success(t("success"));
        }
      })
      .catch((err) => {
        catchError(err);
        getMediaSources();
      })
      .finally(() => {
        onClose();
      });
  };

  const options = [
    { display: "GOOGLE DRIVE", value: "G_DRIVE" },
    { display: "DAILYMOTION", value: "DAILYMOTION" },
    { display: "SIBNET", value: "SIBNET" },
    { display: "VOE", value: "VOE" },
    { display: "OK.RU", value: "OK_RU" },
  ];

  const handleSubmitFormik = () => {
    formik.setFieldValue("mediaSourceRequestList", mediaSources);
    formik.handleSubmit();
  };

  const handleAddMediaSource = () => {
    const newMedia = {
      url: "",
      type: options[0].value,
      fansub: {
        name: "",
        url: null,
      },
      mediaId: mediaId,
    };
    setMediaSources((prev) => [...prev, newMedia]);
  };

  const handleRemoveMediaSource = (index) => {
    setMediaSources((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateMediaSource = (index, field, value) => {
    setMediaSources((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSelect = useCallback((data) => {
    const fansub = {
      name: data.name,
      url: data.url,
    };
    setSelectedItem(fansub);
  }, []);

  const onSave = (index) => {
    handleUpdateMediaSource(index, "fansub", selectedItem);
  };

  const onDiscard = (fansub) => {
    setSelectedItem(fansub);
  };

  const header = useCallback((name) => {
    return name ? (
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-md transition-all hover:shadow-lg dark:bg-navy-700 dark:border-white/10">
        <p className="text-lg font-semibold text-gray-800 dark:text-white">
          {name}
        </p>
      </div>
    ) : (
      <div></div>
    );
  }, []);

  const actionButtons = useCallback(
    (data) => {
      return (
        <div className="flex space-x-2">
          <button
            className="flex cursor-pointer items-center justify-center rounded-lg bg-green-300 p-2 text-white hover:bg-green-400"
            onClick={() => handleSelect(data)}
          >
            {t("choose")}
          </button>
        </div>
      );
    },
    [handleSelect, t]
  );

  useEffect(() => {
    if (isOpen) {
      getMediaSources();
      setSelectedItem(null);
    }else {
      formik.resetForm();
    }
  }, [getMediaSources, isOpen]);

  return (
    <div>
      <button
        className="flex cursor-pointer items-center justify-center rounded-lg bg-gray-300 p-2 text-white hover:bg-gray-400"
        onClick={onOpen}
        aria-label={t("source")}
      >
        <FaEye size={24} />
      </button>
      <Dialog
        open={isOpen}
        onClose={onClose}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex min-h-screen items-center justify-center">
          <Dialog.Panel className="z-20 h-full max-h-[100vh] w-full max-w-6xl overflow-y-auto rounded-lg border border-gray-300 bg-white p-6 shadow-lg dark:border-brand-400 dark:!bg-navy-900">
            <Dialog.Title
              as="h3"
              className="mb-4 text-lg font-medium leading-6 text-gray-900 dark:text-white"
            >
              {t("source")}
            </Dialog.Title>
            {mediaSources.map((mediaSource, index) => (
              <div key={index} className="mb-4 flex flex-row space-x-2">
                <div className="flex-[1]">
                  <label className="ml-3 text-sm font-bold text-navy-700 dark:text-white">
                    {t("type")}
                  </label>
                  <select
                    className="mt-2 flex h-12 w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none focus:border-blue-500 dark:border-white/10 dark:bg-navy-900 dark:text-white dark:focus:border-blue-400"
                    value={mediaSource.type}
                    onChange={(e) =>
                      handleUpdateMediaSource(index, "type", e.target.value)
                    }
                  >
                    {options.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        className="text-black dark:text-white"
                      >
                        {option.display}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-[2]">
                  <InputField
                    label={t("url")}
                    placeholder={t("url")}
                    type="text"
                    value={mediaSource.url}
                    onChange={(e) =>
                      handleUpdateMediaSource(index, "url", e.target.value)
                    }
                  />
                </div>
                <div className="flex-[1]">
                  <div className="flex flex-row">
                    <div className="w-fit">
                      <label className="ml-3 text-sm font-bold text-navy-700 dark:text-white"></label>
                      <SelectDialog
                        extra="mt-2 w-fit rounded-tl-2xl rounded-bl-2xl bg-gradient-to-br from-[#EA52F8] to-[#0066FF] px-5 py-3 text-base font-medium text-white transition duration-200 hover:shadow-lg hover:shadow-[#0066FF]/25"
                        buttonText={<FaPlus size={24} />}
                        component={
                          <Fansub
                            header={header(selectedItem?.name)}
                            actionButtons={(data) => actionButtons(data)}
                          />
                        }
                        onOpen={() => setSelectedItem(mediaSource.fansub)}
                        onSave={() => onSave(index)}
                        onClose={() => onDiscard(mediaSource.fansub)}
                      />
                    </div>
                    <div>
                      <label
                        className={`text-sm text-navy-700 dark:text-white "ml-3 font-bold`}
                      >
                        {t("fansub")}
                      </label>
                      <input
                        className="mt-2 flex h-12 w-full items-center justify-center rounded-tr-2xl rounded-br-2xl border bg-white/0 p-3 text-sm outline-none file:mr-4 file:rounded-md file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-600 dark:file:bg-brand-400 dark:hover:file:bg-brand-300 border-gray-200 dark:!border-white/10 dark:text-white"
                        type="text"
                        placeholder={t("fansub")}
                        disabled={true}
                        value={mediaSource.fansub?.name}
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-5 cursor-pointer rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
                  onClick={() => handleRemoveMediaSource(index)}
                >
                  <FaTrash size={24} />
                </button>
                {formik.errors.mediaSourceRequestList &&  (
                    <div className="ml-2 mt-2 text-red-500">
                      {typeof formik.errors.mediaSourceRequestList === "string"
                        ? formik.errors.mediaSourceRequestList
                        : JSON.stringify(formik.errors.mediaSourceRequestList)}
                    </div>
                )}
              </div>
            ))}
            <button
              type="button"
              className="w-full cursor-pointer rounded-md bg-green-500 px-4 py-2 font-bold text-white"
              onClick={handleAddMediaSource}
            >
              {t("add")}
            </button>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="mr-2 cursor-pointer rounded-md bg-red-500 px-4 py-2 font-bold text-white"
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

export default MediaSourceDialog;
