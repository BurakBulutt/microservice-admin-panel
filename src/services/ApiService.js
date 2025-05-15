import axios from "axios";
import {keycloak} from "../utilities/keycloak/KeycloakConfig.js";


const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

const createRequest = async (uri, method, data, params) => {
    const token = keycloak.authenticated ? keycloak.token : undefined;

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

        if (error.status === 401) {
            keycloak.login({redirectUri: window.location.origin,locale: "tr"});
        }

        throw error;
    }
};

export default createRequest;
