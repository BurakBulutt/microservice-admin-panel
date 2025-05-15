import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import Card from "../card";
import { useTranslation } from "react-i18next";

const CustomModal = ({ component, title, extra, buttonText }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();

    const closeModal = () => setIsOpen(false);
    const openModal = () => setIsOpen(true);

    return (
        <>
            <button onClick={openModal} className={`cursor-pointer ${extra}`}>
                {buttonText}
            </button>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-[1010]" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-200"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-150"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-[#000] !opacity-30" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex items-start justify-center px-4 pt-[12vh] text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-200"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-150"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel
                                    className="!z-[1002] !m-auto !w-max min-w-[350px] !max-w-[85%] transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all dark:bg-gray-900"
                                >
                                    <div className="overflow-y-auto">
                                        <Card extra="px-[30px] pt-[35px] pb-[40px] flex flex-col !z-[1004]">
                                            <h1 className="mb-[20px] text-center text-2xl font-bold">
                                                {title.toUpperCase()}
                                            </h1>
                                            {component}
                                            <button
                                                onClick={closeModal}
                                                className="cursor-pointer linear mt-4 rounded-xl border-2 border-brand-500 px-5 py-3 text-base font-medium text-brand-500 transition duration-200 hover:bg-brand-600/5 active:bg-brand-700/5 dark:border-brand-400 dark:bg-brand-400/10 dark:text-white dark:hover:bg-brand-300/10 dark:active:bg-brand-200/10"
                                            >
                                                {t("close").toUpperCase()}
                                            </button>
                                        </Card>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};

export default CustomModal;
