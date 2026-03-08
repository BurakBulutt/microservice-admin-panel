import InputField from "../../components/fields/InputField";
import Checkbox from "../../components/checkbox";
import {useTranslation} from "react-i18next";
import {useFormik} from "formik";
import {AuthService} from "../../services/AuthService.js";
import React, {useCallback, useEffect} from "react";
import CustomErrorToast from "../../components/toast/CustomErrorToast.jsx";
import {useToast} from "../../utilities/toast/toast.js";
import {LoginValidationSchema} from "../../utilities/validation/ValidationSchemas.js";
import {useNavigate} from "react-router-dom";

const service = new AuthService();

export default function SignIn() {
    const {t} = useTranslation();
    const toast = useToast();
    const navigate = useNavigate();
    const validationSchema = LoginValidationSchema;

    const baseRequest = {
        username: "",
        password: ""
    };

    const catchError = useCallback(
        (error, options) => {
            toast.error(<CustomErrorToast title={error.message} message={error.response?.data}/>, options);
        },
        [toast]
    );

    const formik = useFormik({
        initialValues: baseRequest,
        validationSchema: validationSchema,
        validateOnChange: false,
        validateOnBlur: false,
        validateOnMounted: false,
        onSubmit(values) {
            login(values)
        },
    });

    const login = (request) => {
        service.login(request)
            .then((response) => {
                if (response.status === 200) {
                    localStorage.setItem("access_token", response.data?.accessToken);
                    console.log(localStorage.getItem("access_token"));
                    navigate("/", { replace: true });
                }
            }).catch((error) => {
                catchError(error,{});
        });
    }

    const handleSubmitFormik = () => {
        console.log("formikValues",formik.values);
        formik.handleSubmit();
    };

    const checkToken = useCallback(() => {
        const authStatus = !!localStorage.getItem("access_token");

        if (authStatus) navigate("/", { replace: true });
    },[navigate]);

    useEffect(() => {
        checkToken();
    }, [checkToken]);

    return (
        <div
            className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
            {/* Sign in section */}
            <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
                <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
                    Sign In
                </h4>
                <p className="mb-9 ml-1 text-base text-gray-600">
                    Enter your email and password to sign in!
                </p>

                {/* Email */}
                <InputField
                    variant="auth"
                    extra="mb-3"
                    label={t("username")}
                    placeholder={t("username")}
                    name="username"
                    type="text"
                    state={formik.errors?.username &&  "error"}
                    value={formik.values?.username}
                    onChange={formik.handleChange}
                />

                {/* Password */}
                <InputField
                    variant="auth"
                    extra="mb-3"
                    label={t("password")}
                    placeholder={t("password")}
                    name="password"
                    type="password"
                    state={formik.errors?.password &&  "error"}
                    value={formik.values?.password}
                    onChange={formik.handleChange}
                />

                {/* Checkbox */}
                <div className="mb-4 flex items-center justify-between px-2">
                    <div className="flex items-center">
                        <Checkbox/>
                        <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
                            Keep me logged In
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => handleSubmitFormik()}
                    className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
                    Sign In
                </button>
            </div>
        </div>
    );
}
