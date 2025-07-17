import banner from "../../../assets/img/profile/banner.png";
import Card from "../../../components/card";
import {useTranslation} from "react-i18next";
import InputField from "../../../components/fields/InputField";
import {useFormik} from "formik";
import {
    UserChangePasswordValidationSchema,
    UserUpdateValidationSchema,
} from "../../../utilities/validation/ValidationSchemas";
import {useCallback, useContext, useEffect, useState} from "react";
import {UserService} from "../../../services/UserService";
import {useToast} from "../../../utilities/toast/toast";
import CustomErrorToast from "../../../components/toast/CustomErrorToast";
import {KeycloakContext} from "../../../contexts/keycloak/KeycloakContext";

const service = new UserService();

const ProfileSettings = () => {
    const {t} = useTranslation();
    const toast = useToast();

    const {kc} = useContext(KeycloakContext);

    const [id, setId] = useState(null);
    const [profile, setProfile] = useState(null);

    const formik = useFormik({
        initialValues: profile,
        enableReinitialize: true,
        validationSchema: UserUpdateValidationSchema,
        validateOnChange: false,
        validateOnBlur: false,
        validateOnMounted: false,
        onSubmit(values) {
            updateProfile(values);
        },
    });

    const passwordChangeBaseItem = {
        newPassword: null,
        newPasswordRe: null,
    };

    const passwordChangeFormik = useFormik({
        initialValues: passwordChangeBaseItem,
        validationSchema: UserChangePasswordValidationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        validateOnMounted: false,
        onSubmit(values) {
            updatePassword(values);
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

    const getProfile = useCallback(() => {
        if (id) {
            service
                .getById(id)
                .then((response) => {
                    if (response.status === 200) {
                        setProfile(response.data);
                        formik.setValues({
                            ...formik.values,
                            ...response.data,
                        });
                    }
                })
                .catch((error) => {
                    catchError(error, {});
                });
        }
    }, [catchError,id]);

    useEffect(() => {
        kc.loadUserProfile()
            .then((profile) => {
                setId(profile.id);
            })
            .catch((err) => catchError(err, {
                onClose: () => kc.login
            }));
    }, [kc,catchError]);

    useEffect(() => {
        getProfile();
    }, [getProfile]);

    const updateProfile = (values) => {
        service
            .updateProfile(id, values)
            .then((response) => {
                if (response.status === 204) {
                    toast.success(t("success"), {
                        onClose: () => getProfile(id),
                    });
                }
            })
            .catch((error) => {
                catchError(error, {});
            });
    };

    const updatePassword = (values) => {
        service
            .changePassword(id, values)
            .then((response) => {
                if (response.status === 204) {
                    toast.success(t("success"), {
                        onClose: () => {
                            passwordChangeFormik.resetForm();
                            kc.logout({redirectUri: window.location.origin});
                        },
                    });
                }
            })
            .catch((error) => {
                catchError(error, {});
            });
    };

    const capitalizeFirstLetter = (str) => {
        return str?.charAt(0).toUpperCase() + str?.slice(1);
    };

    const profileImageUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${capitalizeFirstLetter(
        profile?.firstName
    )}`;

    return (
        profile && (
            <div className="w-full min-h-screen flex flex-wrap gap-4">
                <div className="flex flex-col gap-4">
                    <Card extra={"items-center w-full h-fit p-[16px] bg-cover"}>
                        {/* Background and profile */}
                        <div
                            className="relative mt-1 flex h-48 w-full justify-center rounded-xl bg-cover"
                            style={{backgroundImage: `url(${banner})`}}
                        >
                            <div
                                className="absolute -bottom-12 flex h-[90px] w-[90px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400 dark:!border-navy-700">
                                <img
                                    className="h-full w-full rounded-full"
                                    src={profileImageUrl}
                                    alt={profile?.firstName}
                                />
                            </div>
                        </div>

                        <div className="mt-16 flex flex-col items-center gap-2 pb-6">
                            <h4 className="text-2xl font-bold text-navy-700 dark:text-white pr-4 pl-4">
                                {capitalizeFirstLetter(profile?.firstName) +
                                    " " +
                                    capitalizeFirstLetter(profile?.lastName)}
                            </h4>
                            <div className="flex flex-row justify-between items-start gap-2">
                                <p className="text-sm font-normal text-gray-600">
                                    {t("profileSettings.accountType") + ":"}
                                </p>
                                {" "}
                                <p className="text-sm font-bold text-navy-900 dark:text-white">
                                    {t("profileSettings.admin")}
                                </p>
                            </div>
                        </div>
                    </Card>
                    <Card extra={"w-full h-fit p-[16px] bg-cover xl:min-w-[60vh]"}>
                        <div className="flex flex-col justify-start pl-3 pt-1">
                            <p className="text-xl font-bold text-navy-800 dark:text-white">
                                {t("profileSettings.accountSettings.title")}
                            </p>
                            <p className="text-base font-normal text-gray-600">
                                {t("profileSettings.accountSettings.description")}
                            </p>
                        </div>
                        <div className="mt-10 flex flex-wrap justify-between gap-4">
                            <div className="flex-1 min-w-[30vh]">
                                <InputField
                                    label={t("username")}
                                    placeholder={t("username")}
                                    name="username"
                                    type="text"
                                    value={formik.values.username}
                                    readOnly
                                />
                            </div>
                            <div className="flex-1 min-w-[30vh]">
                                <InputField
                                    label={t("email")}
                                    placeholder={t("email")}
                                    name="email"
                                    type="email"
                                    state={formik.errors?.email && "error"}
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                />
                            </div>
                            <div className="flex-1 min-w-[30vh]">
                                <InputField
                                    label={t("firstName")}
                                    placeholder={t("firstName")}
                                    name="firstName"
                                    type="text"
                                    state={formik.errors?.firstName && "error"}
                                    value={formik.values.firstName}
                                    onChange={formik.handleChange}
                                />
                            </div>
                            <div className="flex-1 min-w-[30vh]">
                                <InputField
                                    label={t("lastName")}
                                    placeholder={t("lastName")}
                                    name="lastName"
                                    type="text"
                                    state={formik.errors?.lastName && "error"}
                                    value={formik.values.lastName}
                                    onChange={formik.handleChange}
                                />
                            </div>
                            <div className="flex-1 min-w-[30vh]">
                                <InputField
                                    label={t("birthdate")}
                                    placeholder={t("birthdate")}
                                    name="birthdate"
                                    type="date"
                                    state={formik.errors?.birthdate && "error"}
                                    value={formik.values.birthdate}
                                    onChange={formik.handleChange}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mt-10">
                            <button
                                className="cursor-pointer w-fit rounded-2xl bg-brand-500 px-12 py-3 text-sm font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                                onClick={formik.handleSubmit}
                            >
                                {t("profileSettings.saveChanges")}
                            </button>
                        </div>
                    </Card>
                    <Card extra={"w-full h-fit p-[16px] bg-cover xl:min-w-[60vh]"}>
                        <div className="flex flex-col justify-start pl-3 pt-1">
                            <p className="text-xl font-bold text-navy-800 dark:text-white">{t("profileSettings.socialProfiles.title")}</p>
                            <p className="text-base font-normal text-gray-600">
                                {t("profileSettings.socialProfiles.description")}
                            </p>
                        </div>
                        <div className="mt-10 flex flex-wrap justify-between gap-4">
                            <div className="flex-1 min-w-[30vh]">
                                <InputField
                                    label={t("profileSettings.socialProfiles.twitter")}
                                    placeholder={t("profileSettings.socialProfiles.twitter")}
                                    name="name"
                                    type="text"
                                />
                            </div>
                            <div className="flex-1 min-w-[30vh]">
                                <InputField
                                    label={t("profileSettings.socialProfiles.facebook")}
                                    placeholder={t("profileSettings.socialProfiles.facebook")}
                                    name="name"
                                    type="text"
                                />
                            </div>
                            <div className="flex-1 min-w-[30vh]">
                                <InputField
                                    label={t("profileSettings.socialProfiles.linkedIn")}
                                    placeholder={t("profileSettings.socialProfiles.linkedIn")}
                                    name="name"
                                    type="text"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mt-10">
                            <button
                                className="w-fit rounded-2xl cursor-pointer bg-brand-500 px-12 py-3 text-sm font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
                                {t("profileSettings.saveChanges")}
                            </button>
                        </div>
                    </Card>
                    <Card extra={"w-full h-fit p-[16px] bg-cover xl:min-w-[60vh]"}>
                        <div className="flex flex-col justify-start pl-3 pt-1">
                            <p className="text-xl font-bold text-navy-800 dark:text-white">{t("profileSettings.changePassword.title")}</p>
                            <p className="text-base font-normal text-gray-600">
                                {t("profileSettings.changePassword.description")}
                            </p>
                        </div>
                        <div className="mt-10 flex flex-wrap justify-between gap-4">
                            <div className="flex-1 min-w-[30vh]">
                                <InputField
                                    label={t("profileSettings.changePassword.newPassword")}
                                    placeholder={t("profileSettings.changePassword.newPassword")}
                                    name="newPassword"
                                    type="password"
                                    state={passwordChangeFormik.errors?.newPassword && "error"}
                                    value={passwordChangeFormik.values.newPassword}
                                    onChange={passwordChangeFormik.handleChange}
                                />
                            </div>
                            <div className="flex-1 min-w-[30vh]">
                                <InputField
                                    label={t("profileSettings.changePassword.newPasswordAgain")}
                                    placeholder={t("profileSettings.changePassword.newPasswordAgain")}
                                    name="newPasswordRe"
                                    type="password"
                                    state={passwordChangeFormik.errors?.newPasswordRe && "error"}
                                    value={passwordChangeFormik.values.newPasswordRe}
                                    onChange={passwordChangeFormik.handleChange}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mt-10">
                            <button
                                className="w-fit rounded-2xl cursor-pointer bg-brand-500 px-12 py-3 text-sm font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                                onClick={passwordChangeFormik.handleSubmit}
                            >
                                {t("profileSettings.changePassword.title")}
                            </button>
                        </div>
                    </Card>
                </div>
                <div className="flex flex-col gap-2"></div>
            </div>
        )
    );
};
export default ProfileSettings;
