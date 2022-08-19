import { FunctionComponent, createContext, ReactNode } from 'react';
import { KeycloakInstance, KeycloakProfile } from 'keycloak-js';
import { getKeyCloakToken, getParsedKeyCloakToken } from './keycloakAuth';
import { Auth, AuthContext } from '@rhoas/app-services-ui-shared';

// This is a context which can manage the keycloak
export interface IKeycloakContext {
  keycloak?: KeycloakInstance | undefined;
  profile?: KeycloakProfile | undefined;
}

export const KeycloakContext = createContext<IKeycloakContext>({
  keycloak: undefined,
});

export const KeycloakAuthProvider: FunctionComponent<{
  children: ReactNode;
}> = ({ children }) => {
  const getUsername = () => {
    return getParsedKeyCloakToken().then(
      (token) => (token as Record<string, string>)['username']
    );
  };

  const isOrgAdmin = () => {
    return getParsedKeyCloakToken().then(
      (token) => (token as Record<string, string>)['is_org_admin']
    );
  };

  const authTokenContext = {
    srs: {
      getToken: getKeyCloakToken,
    },
    getUsername: getUsername,
    isOrgAdmin,
  } as unknown as Auth;

  return (
    <AuthContext.Provider value={authTokenContext}>
      {children}
    </AuthContext.Provider>
  );
};
