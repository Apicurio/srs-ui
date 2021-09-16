import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/patternfly/patternfly.min.css';
import '@patternfly/patternfly/utilities/Accessibility/accessibility.css';
import '@patternfly/patternfly/utilities/Sizing/sizing.css';
import '@patternfly/patternfly/utilities/Spacing/spacing.css';
import '@patternfly/patternfly/utilities/Display/display.css';
import '@patternfly/patternfly/utilities/Flex/flex.css';
import { AppLayout } from '@app/AppLayout/AppLayout';
import { AppRoutes } from '@app/Routes';
import { MASErrorBoundary, MASLoading, RootModal, AlertProvider, PaginationProvider } from '@app/components';
import srsi18n from '@i18n/i18n';
import { KeycloakAuthProvider, KeycloakContext, getKeycloakInstance } from './auth';
import { Config, ConfigContext, BasenameContext } from '@bf2/ui-shared';
import '@app/App.css';

declare const __BASE_PATH__: string;
let keycloak: Keycloak.KeycloakInstance | undefined;

const App: React.FunctionComponent = () => {
  const [initialized, setInitialized] = React.useState(false);

  // Initialize the client
  useEffect(() => {
    const init = async () => {
      keycloak = await getKeycloakInstance();
      setInitialized(true);
    };
    init();
  }, []);

  if (!initialized) return <MASLoading />;

  return (
    <ConfigContext.Provider
      value={
        {
          srs: {
            apiBasePath: __BASE_PATH__,
          },
        } as Config
      }
    >
      <BasenameContext.Provider value={{ getBasename: () => '' }}>
        <I18nextProvider i18n={srsi18n}>
          <AlertProvider>
            <KeycloakContext.Provider value={{ keycloak, profile: keycloak?.profile }}>
              <KeycloakAuthProvider>
                <Router>
                  <React.Suspense fallback={<MASLoading />}>
                    <MASErrorBoundary>
                      <RootModal>
                        <PaginationProvider>
                          <AppLayout>
                            <AppRoutes />
                          </AppLayout>
                        </PaginationProvider>
                      </RootModal>
                    </MASErrorBoundary>
                  </React.Suspense>
                </Router>
              </KeycloakAuthProvider>
            </KeycloakContext.Provider>
          </AlertProvider>
        </I18nextProvider>
      </BasenameContext.Provider>
    </ConfigContext.Provider>
  );
};

export default App;
