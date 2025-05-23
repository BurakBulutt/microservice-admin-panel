import createRequest from "./ApiService";

const defaultUrl = "users";

export class UserService {
  async getAll(params) {
    return createRequest(defaultUrl, "GET", null, params);
  }

  async getById(id) {
    return createRequest(defaultUrl + `/${id}`, "GET", null, null);
  }

  async filter(params) {
    return createRequest(defaultUrl + `/filter`, "GET", null, params);
  }

  async createUser(request) {
    return createRequest(defaultUrl, "POST", request, null);
  }

  async updateUser(id, request) {
    return createRequest(defaultUrl + `/${id}`, "PUT", request, null);
  }

  async deleteUser(id) {
    return createRequest(defaultUrl + `/${id}`, "DELETE", null, null);
  }

  async verifyEmail(id) {
    return createRequest(
      defaultUrl + `/${id}/verify-email`,
      "POST",
      null,
      null
    );
  }

  async resetUserPassword(id) {
    return createRequest(
      defaultUrl + `/${id}/reset-password`,
      "POST",
      null,
      null
    );
  }

  async count() {
    return createRequest(defaultUrl + `/count`, "GET", null, null);
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
