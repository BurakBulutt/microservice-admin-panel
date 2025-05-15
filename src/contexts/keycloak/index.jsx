import {useEffect, useState} from "react";

import {kcInitOptions, keycloak} from "../../utilities/keycloak/KeycloakConfig.js";
import {KeycloakContext} from "./KeycloakContext.jsx";

export const KeycloakContextProvider = ({children}) => {
    const initOptions = kcInitOptions;

    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (!keycloak.didInitialize) {
            keycloak.init(initOptions).then((resolve) => {
                console.log("Keycloak initialize status: ", resolve);

                keycloak.onTokenExpired = () => {
                    keycloak.updateToken(30).then((result) => {
                        console.log("Token Refresh Status:",result);
                    }).catch((error) => {
                        console.log("Token Refresh Error:",error);
                        keycloak.login({locale: "tr"});
                    });
                } //TODO Çalışmıyor sebebi öğrenilecek.

                setInitialized(true);
            }).catch((error) => {
                console.log("Keycloak initialize error: ", error);
                setInitialized(false);
            });
        }
    }, [initOptions]);

    return (
        <KeycloakContext.Provider value={{kc: keycloak, isInitialized: initialized}}>
            {children}
        </KeycloakContext.Provider>
    );
}