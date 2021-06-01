import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import '@patternfly/react-core/dist/styles/base.css';
import { AppLayout } from '@app/AppLayout/AppLayout';
import { AppRoutes } from '@app/Routes';
import { MASErrorBoundary, MASLoading } from '@app/components';
import srsi18n from '@i18n/i18n';
import '@app/App.css';

const App: React.FunctionComponent = () => (
  <I18nextProvider i18n={srsi18n}>
    <Router>
      <React.Suspense fallback={<MASLoading />}>
        <MASErrorBoundary>
          <AppLayout>
            <AppRoutes />
          </AppLayout>
        </MASErrorBoundary>
      </React.Suspense>
    </Router>
  </I18nextProvider>
);

export default App;
