import React, { useCallback, useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { FaPlay } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useToast } from "../../../../../utilities/toast/toast.js";
import { MediaService } from "../../../../../services/MediaService.js";
import CustomErrorToast from "../../../../../components/toast/CustomErrorToast.jsx";
import ReactPlayer from "react-player";

const service = new MediaService();

const PlayerDialog = ({ mediaId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mediaSourceList, setMediaSourceList] = useState([]);
  const [fanSubOptions, setFanSubOptions] = useState([]);
  const [selectedFanSub, setSelectedFanSub] = useState("");
  const [typeOptions, setTypeOptions] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [filteredMedia, setFilteredMedia] = useState(null);
  const { t } = useTranslation();
  const toast = useToast();

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const catchError = useCallback(
    (error, options) => {
      toast.error(
        <CustomErrorToast
          title={error.message}
          message={error.response?.data?.message}
        />,
        options
      );
    },
    [toast]
  );

  const getMediaSources = useCallback(() => {
    if (isOpen) {
      service
        .getMediaSources(mediaId)
        .then((response) => {
          if (response.status === 200) {
            setMediaSourceList(response.data);
          }
        })
        .catch(catchError);
    }
  }, [catchError, mediaId, isOpen]);

  useEffect(() => {
    getMediaSources();
  }, [getMediaSources]);

  useEffect(() => {
    if (mediaSourceList.length) {
      const fanSubs = Array.from(
          new Map(mediaSourceList.map((s) => [s.fansub.name, s.fansub])).values()
      );
      setFanSubOptions(fanSubs);
      setSelectedFanSub(fanSubs[0]?.name || "");

      const types = Array.from(new Set(mediaSourceList.map((s) => s.type)));
      setTypeOptions(types);
      setSelectedType(types[0] || "");
    }
  }, [mediaSourceList]);

  useEffect(() => {
    if (selectedFanSub) {
      const filteredSources = mediaSourceList.filter(
        (s) => s.fansub.name === selectedFanSub
      );
      const types = Array.from(new Set(filteredSources.map((s) => s.type)));
      setTypeOptions(types);
      setSelectedType(types[0] || "");
    }
  }, [selectedFanSub,mediaSourceList]);

  useEffect(() => {
    if (selectedFanSub && selectedType) {
      const matched = mediaSourceList.find(
        (s) => s.fansub.name === selectedFanSub && s.type === selectedType
      );
      setFilteredMedia(matched || null);
    }
  }, [selectedFanSub, selectedType, mediaSourceList]);

  return (
    <div>
      <button
        className="flex cursor-pointer items-center justify-center rounded-lg bg-lime-400 p-2 text-white hover:bg-lime-500"
        onClick={onOpen}
        aria-label={t("player")}
      >
        <FaPlay size={24} />
      </button>
      <Dialog
        open={isOpen}
        onClose={onClose}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex min-h-screen items-center justify-center">
          <Dialog.Panel className="z-20 h-full max-h-[75vh] w-full max-w-[100vh] overflow-y-auto rounded-lg border border-gray-300 bg-white p-6 shadow-lg dark:bg-navy-900 dark:border-brand-400">
            <Dialog.Title
              as="h3"
              className="mb-4 text-lg font-medium leading-6 text-gray-900 dark:text-white"
            >
              {t("player")}
            </Dialog.Title>
            <div className="ml-3 flex flex-row space-x-4">
              <div>
                <label className="ml-3 text-sm font-bold text-navy-700 dark:text-white">
                  {t("fansub")}
                </label>
                <select
                  className="mt-2 flex h-12 w-full min-w-[100px] rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none focus:border-blue-500 dark:border-white/10 dark:text-white dark:focus:border-blue-400 dark:bg-navy-900"
                  value={selectedFanSub}
                  onChange={(e) => setSelectedFanSub(e.target.value)}
                >
                  {fanSubOptions.map((fansub) => (
                    <option key={fansub.name} value={fansub.name}>
                      {fansub.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="ml-3 text-sm font-bold text-navy-700 dark:text-white">
                  {t("type")}
                </label>
                <select
                  className="mt-2 flex h-12 w-full min-w-[100px] rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none focus:border-blue-500 dark:border-white/10 dark:text-white dark:focus:border-blue-400 dark:bg-navy-900"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  {typeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-4 p-4">
              <p className="mb-2 text-sm text-gray-700">{t("chosen")}</p>
              <ReactPlayer
                  url={filteredMedia?.url}
                  controls
                  width="100%"
                  height="50vh"
              />
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={onClose}
                className="mr-2 cursor-pointer rounded-md bg-red-500 px-4 py-2 font-bold text-white"
              >
                {t("close")}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default PlayerDialog;
