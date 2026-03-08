import createRequest from "./ApiService";

const defaultUrl = "auth";

export class AuthService {
    async login(request) {
        return createRequest(defaultUrl + `/login`, "POST", request, null);
    }

    async getUserInfo() {
        return createRequest(defaultUrl + `/user-info`, "GET", null, null);
    }

    async changePassword(id,request) {
        return createRequest(
            defaultUrl + `/${id}/change-password`,
            "POST",
            request,
            null
        );
    }

    async updateProfile(id, request) {
        return createRequest(defaultUrl + `/${id}/update-profile`, "PUT", request, null);
    }
}


