import { useFormik } from "formik";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaDochub } from "react-icons/fa";
import { XmlDefinitionService } from "../../../../../services/XmlDefinitionService.js";
import { useToast } from "../../../../../utilities/toast/toast.js";
import { XmlDefinitionValidationSchema } from "../../../../../utilities/validation/ValidationSchemas.js";
import XmlDefinitionDialog from "../../../xmldefination/components/dialog/index.jsx";
import CustomErrorToast from "../../../../../components/toast/CustomErrorToast.jsx";

const service = new XmlDefinitionService();

const XmlImportDialog = ({ type }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const toast = useToast();

  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);

  const baseRequest = {
    type: type,
    base64: null,
  };
  const formik = useFormik({
    initialValues: baseRequest,
    validationSchema: XmlDefinitionValidationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    validateOnMount: false,
    onSubmit: (values) => {
      service
        .import(values)
        .then((response) => {
          if (response.status === 201) {
            toast.success(t("success"));
            closeDialog();
          }
        })
        .catch((error) => {
          catchError(error, {});
        });
    },
  });

  const catchError = useCallback(
    (error, options) => {
      toast.error(
        <CustomErrorToast
          title={error.message}
          message={error.response?.data}
        />,
        options
      );
    },
    [toast]
  );

  const closeDialog = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <div>
      <button
        className="flex flex-col items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-base font-bold text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
        onClick={onOpen}
      >
        <FaDochub />
        {t("importXml")}
      </button>
      <XmlDefinitionDialog
        formik={formik}
        type={type}
        dialogVisible={isOpen}
        hideDialog={closeDialog}
        handleSubmitFormik={() => formik.handleSubmit()}
      />
    </div>
  );
};

export default XmlImportDialog;
