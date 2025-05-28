import {Navigate, Route, Routes} from "react-router-dom";
import {AdminLayout} from "./layouts/admin/index.jsx";

import "./i18n";
import "react-toastify/dist/ReactToastify.css";

import {ToastContainer} from "react-toastify";
import {KeycloakContextProvider} from "./contexts/keycloak/index.jsx";

function App() {
    return (
        <KeycloakContextProvider>
            <Routes>
                <Route path="*" element={<div>404</div>}/>
                <Route path="admin/*" element={<AdminLayout/>}/>
                <Route path="/" element={<Navigate to="/admin" replace/>}/>
            </Routes>
            <ToastContainer/>
        </KeycloakContextProvider>
    );

}

export default App;
