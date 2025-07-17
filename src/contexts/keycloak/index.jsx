import {useEffect, useState} from "react";

import {kcInitOptions, keycloak} from "../../utilities/keycloak/KeycloakConfig.js";
import {KeycloakContext} from "./KeycloakContext.jsx";
import i18next from "i18next";

export const KeycloakContextProvider = ({children}) => {
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (!keycloak.didInitialize) {
            keycloak.init(kcInitOptions).then((status) => {
                if (status) {
                    keycloak.onTokenExpired = onTokenExpired;
                    keycloak.onAuthRefreshError = () => {
                        keycloak.login({locale: i18next.language})
                    };
                    keycloak.onAuthLogout = () => {
                        keycloak.login({locale: i18next.language})
                    };
                }else {
                    keycloak.login({locale: i18next.language});
                    return;
                }
                setInitialized(true);
            }).catch((error) => {
                setInitialized(false);
                throw new Error(error);
            });
        }
    }, []);

    const onTokenExpired =  () => {
         keycloak.updateToken(-1).then((status) => {
            console.log("Token refresh status: ", status);
        }).catch((error) => {
            console.error("Token refresh request failed: ", error);
            keycloak.login({locale: i18next.language});
        });
    };

    return initialized && (
        <KeycloakContext.Provider value={{kc: keycloak}}>
            {children}
        </KeycloakContext.Provider>
    );
}