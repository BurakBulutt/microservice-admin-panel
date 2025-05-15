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
    silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`
};