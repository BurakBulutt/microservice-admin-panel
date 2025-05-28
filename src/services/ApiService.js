import axios from "axios";
import {keycloak} from "../utilities/keycloak/KeycloakConfig.js";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

const createRequest = async (uri, method, data, params) => {

    if (keycloak.isTokenExpired(-1)) {
        await keycloak.updateToken(-1);
    }

    const token = keycloak.token;

    const config = {
        method,
        url: `api/${uri}`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    if (data) {
        config.data = data;
    }
    if (params) {
        config.params = params;
    }

    try {
        return await axiosInstance(config);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export default createRequest;
