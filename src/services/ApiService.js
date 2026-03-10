import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

const createRequest = async (uri, method, data, params,headers) => {

    const config = {
        method,
        url: `api/${uri}`,
        headers: headers ? headers : {},
    };

    if(!uri.startsWith("auth/login")) {
        const token = localStorage.getItem("access_token");
        config.headers.Authorization = `Bearer ${token}`;
    }

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
        //TODO Refresh Token flow will be here

        if (error.status === 401) {
            localStorage.removeItem("access_token");
            window.location.reload();
        }

        throw error;
    }
};

export default createRequest;
