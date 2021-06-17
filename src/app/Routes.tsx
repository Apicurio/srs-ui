import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { accessibleRouteChangeHandler } from '@app/utils/utils';
import { MASPageNotFound } from '@app/components/MASPageNotFound';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import { LastLocationProvider, useLastLocation } from 'react-router-last-location';
import { ServiceRegistryConnected } from './ServiceRegistry/ServiceRegistryConnected';

let routeFocusTimer: number;
export interface IAppRoute {
  label?: string; // Excluding the label will exclude the route from the nav sidebar in AppLayout
  /* eslint-disable @typescript-eslint/no-explicit-any */
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  exact?: boolean;
  path: string;
  title: string;
  isAsync?: boolean;
  routes?: undefined;
  federatedComponent?: string;
}

export interface IAppRouteGroup {
  label: string;
  routes: IAppRoute[];
}

export type AppRouteConfig = IAppRoute | IAppRouteGroup;

const routes: AppRouteConfig[] = [
  {
    component: ServiceRegistryConnected,
    exact: true,
    label: 'Service Registry',
    path: '/',
    title: 'Service Registry',
    federatedComponent: 'artifacts',
  },
  {
    component: ServiceRegistryConnected,
    exact: true,
    path: '/t/:tenantId/artifacts',
    title: 'Service Registry',
    federatedComponent: 'artifacts',
  },
  {
    component: ServiceRegistryConnected,
    exact: true,
    path: '/t/:tenantId/rules',
    title: 'Service Registry',
    federatedComponent: 'rules',
  },
  {
    component: ServiceRegistryConnected,
    exact: true,
    path: '/t/:tenantId/artifacts/:groupId/:artifactId',
    title: 'Service Registry',
    federatedComponent: 'artifact-redirect',
  },
  {
    component: ServiceRegistryConnected,
    exact: true,
    path: '/t/:tenantId/artifacts/:groupId/:artifactId/versions/:version',
    title: 'Service Registry',
    federatedComponent: 'artifacts-details',
  },
];

// a custom hook for sending focus to the primary content container
// after a view has loaded so that subsequent press of tab key
// sends focus directly to relevant content
const useA11yRouteChange = (isAsync: boolean) => {
  const lastNavigation = useLastLocation();
  React.useEffect(() => {
    if (!isAsync && lastNavigation !== null) {
      routeFocusTimer = accessibleRouteChangeHandler();
    }
    return () => {
      window.clearTimeout(routeFocusTimer);
    };
  }, [isAsync, lastNavigation]);
};

const RouteWithTitleUpdates = ({ component: Component, isAsync = false, title, ...rest }: IAppRoute) => {
  useA11yRouteChange(isAsync);
  useDocumentTitle(title);

  function routeWithTitle(routeProps: RouteComponentProps) {
    return <Component {...rest} {...routeProps} />;
  }

  return <Route render={routeWithTitle} {...rest} />;
};

const PageNotFound = ({ title }: { title: string }) => {
  useDocumentTitle(title);
  return <Route component={MASPageNotFound} />;
};

const flattenedRoutes: IAppRoute[] = routes.reduce(
  (flattened, route) => [...flattened, ...(route.routes ? route.routes : [route])],
  [] as IAppRoute[]
);

const AppRoutes = (): React.ReactElement => (
  <LastLocationProvider>
    <Switch>
      {flattenedRoutes.map(({ path, exact, component, title, isAsync, ...rest }, idx) => (
        <RouteWithTitleUpdates
          path={path}
          exact={exact}
          component={component}
          key={idx}
          title={title}
          isAsync={isAsync}
          {...rest}
        />
      ))}
      <PageNotFound title="404 Page Not Found" />
    </Switch>
  </LastLocationProvider>
);

export { AppRoutes, routes };
