import Keycloak from "keycloak-js";

export const keycloak = new Keycloak({
    url: import.meta.env.VITE_KEYCLOAK_BASE_URL,
    realm: 'dev',
    clientId: 'app-admin-client',
    flow: 'standard',
    pkceMethod: "S256",
});
export const kcInitOptions = {
    onLoad: "check-sso",
    enableTokenRefresh: true,
    checkLoginIframe: true,
    checkLoginIframeInterval: 5,
    silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
    enableLogging: true,
    timeSkew: 30
};