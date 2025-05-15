import {MdHome} from "react-icons/md";
import Dashboard from "../../views/admin/dashboard/index.jsx";
import Users from "../../views/admin/users/index.jsx";
import {BiCategory, BiComment, BiUser} from "react-icons/bi";
import Category from "../../views/admin/category/index.jsx";
import {SiContentful} from "react-icons/si";
import ContentCard from "../../views/admin/content/components/contentcard/index.jsx";
import Content from "../../views/admin/content/index.jsx";
import Comment from "../../views/admin/comment/index.jsx";
import XmlDefinition from "../../views/admin/xmldefination/index.jsx";
import {BsFiletypeXml} from "react-icons/bs";

export const ROUTES = [
    {
        name: "dashboard",
        layout: "/admin",
        path: "dashboard",
        icon: <MdHome className="h-6 w-6" />,
        component: <Dashboard />,
    },
    {
        name: "user",
        layout: "/admin",
        path: "users",
        icon: <BiUser className="h-6 w-6" />,
        component: <Users />,
    },
    {
        name: "category",
        layout: "/admin",
        path: "categories",
        icon: <BiCategory className="h-6 w-6" />,
        component: <Category />,
    },
    {
        name: "content",
        layout: "/admin",
        path: "contents",
        icon: <SiContentful className="h-6 w-6" />,
        component: <Content />,
    },
    {
        name: "createContent",
        layout: "/admin",
        parentPath: "contents",
        path: "create",
        component: <ContentCard />,
    },
    {
        name: "updateContent",
        layout: "/admin",
        parentPath: "contents",
        path: "update/:id",
        component: <ContentCard />,
    },
    {
        name: "comment",
        layout: "/admin",
        path: "comments",
        icon: <BiComment className="h-6 w-6" />,
        component: <Comment />,
    },
    {
        name: "xmlDefinition",
        layout: "/admin",
        path: "xml-definition",
        icon: <BsFiletypeXml className="h-6 w-6" />,
        component: <XmlDefinition />,
    },
];