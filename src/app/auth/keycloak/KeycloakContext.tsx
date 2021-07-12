import React from 'react';
import { KeycloakInstance, KeycloakProfile } from 'keycloak-js';
import { getKeyCloakToken, getParsedKeyCloakToken } from './keycloakAuth';
import { Auth, AuthContext } from '@bf2/ui-shared';

// This is a context which can manage the keycloak
export interface IKeycloakContext {
  keycloak?: KeycloakInstance | undefined;
  profile?: KeycloakProfile | undefined;
}

export const KeycloakContext = React.createContext<IKeycloakContext>({ keycloak: undefined });

export const KeycloakAuthProvider: React.FunctionComponent = (props) => {
  const getUsername = () => {
    return getParsedKeyCloakToken().then((token) => token['username']);
  };

  const isOrgAdmin = () => {
    return getParsedKeyCloakToken().then((token) => token['is_org_admin']);
  };

  const authTokenContext = {
    srs: {
      getToken: getKeyCloakToken,
    },
    getUsername: getUsername,
    isOrgAdmin
  } as Auth;
  return <AuthContext.Provider value={authTokenContext}>{props.children}</AuthContext.Provider>;
};
