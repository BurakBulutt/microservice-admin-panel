import React, {useCallback, useEffect, useState} from "react";
import {FiAlignJustify} from "react-icons/fi";
import {Link} from "react-router-dom";

import {FiSearch} from "react-icons/fi";
import {RiMoonFill, RiSunFill} from "react-icons/ri";

import {useTranslation} from "react-i18next";
import Dropdown from "../dropdown/index.jsx";
import {useToast} from "../../utilities/toast/toast.js";
import CustomErrorToast from "../toast/CustomErrorToast.jsx";
import {ROUTES} from "../../layouts/admin/routes.jsx";
import useReactRouterBreadcrumbs from "use-react-router-breadcrumbs";
import {ContentService} from "../../services/ContentService.js";


const routes = ROUTES;

const contentService = new ContentService();

const Navbar = ({
                    onOpenSidenav, currentRoute, locale, changeLocale, keycloak,
                }) => {
    const [darkmode, setDarkmode] = useState(false);
    const [userProfile, setUserProfile] = useState({});
    const {t} = useTranslation();
    const {toast} = useToast();
    const [searchResultVisible,setSearchResultVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResult, setSearchResult] = useState([]);

    const localeOptions = [{
        code: "en", label: t("english"), icon: <span className="text-lg">🇺🇸</span>,
    }, {
        code: "tr", label: t("turkish"), icon: <span className="text-lg">🇹🇷</span>,
    },];
    const profileImageUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${userProfile?.firstName?.charAt(0) + userProfile?.lastName?.charAt(0)}&padding=20&fontSize=40&backgroundColor=24388a`;

    const catchError = useCallback((error, options) => {
        toast.error(<CustomErrorToast
            title={error.message}
            message={error.response.data}
        />, options);
    }, [toast]);

    const getPath = (route) => {
        if (route.parentPath) {
            const parentRoute = routes.find((r) => r.path === route.parentPath);

            if (!parentRoute) throw new Error("Route Error");

            return `${getPath(parentRoute)}/${route.path}`;
        }
        return route.path;
    };

    const checkPath = (route) => {
        if (route.path.includes(":")) {
            return ({match}) => (<span>{match?.params?.id}</span>);
        }

        return () => <span>{t(route.name)}</span>;
    };

    const getBreadCrumbs = () => {
        const base = [{path: "/", breadcrumb: () => <span>{t("home")}</span>}, {
            path: "/admin",
            breadcrumb: () => <span>{t("admin")}</span>
        },];

        const routesWithBreadCrumbs = routes.map((route) => {
            const fullPath = `/${route.layout}/${getPath(route)}`.replace(/\/+/g, "/");

            return {
                path: fullPath, breadcrumb: checkPath(route),
            };
        });

        return [...base, ...routesWithBreadCrumbs];
    };

    const breadCrumbs = useReactRouterBreadcrumbs(getBreadCrumbs(), {
        disableDefaults: true, excludePaths: ["/admin"],
    });

    const getItems = useCallback((query) => {
            contentService
                .search({query: query})
                .then((response) => {
                    if (response.status === 200) {
                        setSearchResult(response.data);
                    }
                })
                .catch((error) => {
                    catchError(error, {});
                });
    }, [catchError]);

    useEffect(() => {
        keycloak
            .loadUserProfile()
            .then((profile) => {
                setUserProfile(profile);
            })
            .catch((err) => catchError(err, {}));

    }, [keycloak, catchError]);

    useEffect(() => {
        if (searchQuery.length >= 2) {
            getItems(searchQuery)
        }else {
            setSearchResult([]);
        }
    }, [searchQuery,getItems]);

    return (<nav
            className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
            <div className="ml-[6px]">
                <div className="h-6 w-full pt-1">
                    {breadCrumbs?.map(({match, breadcrumb}, index) => (<Link
                            className={"text-sm font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white"}
                            key={match.pathname} to={match.pathname}>
                            {breadcrumb}
                            {index < breadCrumbs.length - 1 && (<span
                                    className="mx-1 text-sm text-navy-700 hover:text-navy-700 dark:text-white">{" / "}</span>)}
                        </Link>))}
                </div>
                {currentRoute && (<p className="shrink text-[33px] capitalize text-navy-700 dark:text-white">
                        <Link
                            to="#"
                            className="font-bold capitalize hover:text-navy-700 dark:hover:text-white"
                        >
                            {t(`${currentRoute.name}`)}
                        </Link>
                    </p>)}
            </div>

            <div className="relative mt-[3px] flex h-[61px] w-[355px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[365px] md:flex-grow-0 md:gap-1 xl:w-[365px] xl:gap-2">
                <div
                    className="flex h-full w-full items-center rounded-full bg-light-primary text-navy-700 dark:bg-navy-900 dark:text-white xl:max-w-[225px]">
                    <p className="pl-3 pr-2 text-xl">
                        <FiSearch className="h-4 w-4 text-navy-700 dark:text-white"/>
                    </p>
                    <input
                        type="text"
                        placeholder="Search..."
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setSearchResultVisible(true)}
                        onBlur={() => {
                            setTimeout(() => setSearchResultVisible(false), 200)
                        }}
                        className="block h-full w-full rounded-full bg-light-primary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
                    />
                </div>
                <span className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden"
                    onClick={onOpenSidenav}
                >
                    <FiAlignJustify className="h-5 w-5"/>
                </span>
                {searchResultVisible && searchResult.length > 0 && (
                    <div className="absolute top-16 left-0 z-50 flex w-full flex-col rounded-[20px] bg-white p-2 shadow-lg dark:bg-navy-700">
                        {searchResult.map((result) => (
                            <Link
                                key={result.id}
                                to={`/admin/contents/update/${result.id}`}
                                className="cursor-pointer flex items-center gap-3 rounded-[20px] p-2 hover:bg-gray-100 dark:hover:bg-navy-600"
                            >
                                <img
                                    src={result.photoUrl}
                                    alt="Result"
                                    className="h-12 w-12 rounded-full object-cover"
                                />
                                <div
                                    className="text-sm text-gray-800 dark:text-white"
                                    dangerouslySetInnerHTML={{ __html: result.name }}
                                />
                            </Link>
                        ))}
                    </div>
                )}

                {/* 🌍 Locale Dropdown */}
                <Dropdown
                    button={
                    <div className="flex cursor-pointer items-center gap-1 px-2 py-1 text-lg text-gray-600 dark:text-white">
                        {localeOptions.find((opt) => opt.code === locale)?.icon}
                    </div>
                }
                    children={
                    <div className="flex w-40 flex-col justify-start rounded-[20px] bg-white p-2 shadow-lg dark:bg-navy-700">
                        {localeOptions.map((option) => (<button
                                key={option.code}
                                onClick={() => changeLocale(option.code)}
                                className="flex items-center gap-2 rounded-md p-2 text-sm text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-navy-600"
                            >
                                {option.icon}
                                {option.label}
                            </button>))}
                    </div>
                }
                    classNames={"py-2 top-12 -left-[120px]"}
                />
                <div
                    className="cursor-pointer text-gray-600"
                    onClick={() => {
                        if (darkmode) {
                            document.body.classList.remove("dark");
                            setDarkmode(false);
                        } else {
                            document.body.classList.add("dark");
                            setDarkmode(true);
                        }
                    }}
                >
                    {darkmode ? (<RiSunFill className="h-4 w-4 text-gray-600 dark:text-white"/>) : (
                        <RiMoonFill className="h-4 w-4 text-gray-600 dark:text-white"/>)}
                </div>
                {/* Profile & Dropdown */}
                <Dropdown
                    button={<div className="h-10 w-10 rounded-full overflow-hidden cursor-pointer">
                        <img
                            src={profileImageUrl}
                            alt={userProfile?.firstName + " " + userProfile?.lastName}
                            className="h-full w-full object-cover"
                        />
                    </div>}
                    children={<div
                        className="flex w-56 flex-col justify-start rounded-[20px] overflow-hidden bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
                        <div className="flex flex-col p-4">
                            <p className="text-sm font-bold text-navy-700 dark:text-white">
                                👋 {"Hey, "}
                                {userProfile?.firstName}
                            </p>
                        </div>

                        <div className="h-px w-full bg-gray-200 dark:bg-white/20 "/>

                        <div className="cursor-pointer flex flex-col pt-5 pl-5">
                            <Link
                                to={"/admin/profile"}
                                className="text-sm font-medium text-navy-700 transition duration-150 ease-out hover:text-navy-900 hover:ease-in dark:text-white dark:hover:text-white"
                            >
                                {t("profileSettings.title")}
                            </Link>
                        </div>

                        <div
                            className="cursor-pointer flex flex-col p-5"
                            onClick={() => keycloak.logout({redirectUri: window.location.origin})}
                        >
                            <a
                                href="#"
                                className="text-sm font-medium text-red-500 transition duration-150 ease-out hover:text-red-700 hover:ease-in"
                            >
                                {t("logout")}
                            </a>
                        </div>
                    </div>}
                    classNames={"py-2 top-12 -left-[180px] w-max"}
                />
            </div>
        </nav>);
};

export default Navbar;
