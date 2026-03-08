import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "./layouts/admin/index.jsx";

import "./i18n";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";
import AuthLayout from "./layouts/auth/index.jsx";

function App() {


    const ProtectedRoute = ({ children }) => {
        const authStatus = !!localStorage.getItem("access_token");

        if (!authStatus) {
            return <Navigate to="/auth" replace />;
        }
        return children;
    }

    return (
        <>
            <Routes>
                <Route path="auth/*" element={<AuthLayout />} />

                <Route
                    path="admin/*"
                    element={
                        <ProtectedRoute>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                />

                <Route path="/" element={<Navigate to="admin" replace />} />
                <Route path="*" element={<div>404</div>} />
            </Routes>
            <ToastContainer />
        </>
    );
}

export default App;
