import createRequest from "./ApiService";

const defaultUrl = "xml";

export class XmlDefinitionService {

  async getAll(params) {
    return  createRequest(defaultUrl, "GET", null, params);
  }

  async filter(params) {
    return  createRequest(defaultUrl + `/filter`, "GET", null, params);
  }

  async startJob(id) {
    return  createRequest(defaultUrl + `/${id}/start-job`, "GET", null, null);
  }

  async import(request) {
    return  createRequest(defaultUrl + `/import`, "POST", request, null);
  }

  async delete(id) {
    return  createRequest(defaultUrl + `/${id}`, "DELETE", null, null);
  }
}
