import { useEffect, useState, Suspense, FunctionComponent } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/patternfly/patternfly.css';
import '@patternfly/patternfly/utilities/Accessibility/accessibility.css';
import '@patternfly/patternfly/utilities/Sizing/sizing.css';
import '@patternfly/patternfly/utilities/Spacing/spacing.css';
import '@patternfly/patternfly/utilities/Display/display.css';
import '@patternfly/patternfly/utilities/Flex/flex.css';
import { AppLayout } from '@app/AppLayout/AppLayout';
import { AppRoutes } from '@app/Routes';
import {
  MASErrorBoundary,
  MASLoading,
  AlertProvider,
  PaginationProvider,
  ServiceRegistryModalLoader,
} from '@app/components';
import {
  KeycloakAuthProvider,
  KeycloakContext,
  getKeycloakInstance,
} from './auth';
import {
  Config,
  ConfigContext,
  BasenameContext,
} from '@rhoas/app-services-ui-shared';
import { I18nProvider, ModalProvider } from '@rhoas/app-services-ui-components';
import '@app/App.css';

declare const __BASE_PATH__: string;
let keycloak: Keycloak.KeycloakInstance | undefined;

const App: FunctionComponent = () => {
  const [initialized, setInitialized] = useState(false);

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
        <I18nProvider
          lng='en'
          resources={{
            en: {
              common: () =>
                import(
                  '@rhoas/app-services-ui-components/locales/en/common.json'
                ),
              'service-registry': () =>
                import(
                  '@rhoas/app-services-ui-components/locales/en/common.json'
                ),
            },
          }}
        >
          <AlertProvider>
            <KeycloakContext.Provider
              value={{ keycloak, profile: keycloak?.profile }}
            >
              <KeycloakAuthProvider>
                <Router>
                  <Suspense fallback={<MASLoading />}>
                    <MASErrorBoundary>
                      <PaginationProvider>
                        <ModalProvider>
                          <AppLayout>
                            <AppRoutes />
                          </AppLayout>
                          <ServiceRegistryModalLoader />
                        </ModalProvider>
                      </PaginationProvider>
                    </MASErrorBoundary>
                  </Suspense>
                </Router>
              </KeycloakAuthProvider>
            </KeycloakContext.Provider>
          </AlertProvider>
        </I18nProvider>
      </BasenameContext.Provider>
    </ConfigContext.Provider>
  );
};

export default App;
