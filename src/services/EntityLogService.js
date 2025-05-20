import createRequest from "./ApiService";

const defaultUrl = "entity-log";

export class EntityLogService {
  async getMediaServiceLogs(params) {
    return createRequest(`media-${defaultUrl}`, "GET", null, params);
  }

  async getReactionServiceLogs(params) {
    return createRequest(`reaction-${defaultUrl}`, "GET", null, params);
  }
}
