import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Select,
  SelectVariant,
  SelectOption,
  Card,
  CardTitle,
  CardBody,
  Grid,
  GridItem,
  SelectOptionObject,
} from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import { Configuration, RegistryRest, RegistriesApi } from '@rhoas/registry-management-sdk';
import { useAuth, useConfig } from '@rhoas/app-services-ui-shared';
import { EmptyState } from './EmptyState';
import { Loading } from './Loading';
import '@patternfly/patternfly/patternfly.min.css';
import '@patternfly/patternfly/components/Select/select.css';

export type ServiceRegistryMappingProps = SchemasProps & {
  basename: string;
  topicName: string;
};

type SchemasProps = {
  renderSchema: (registry: RegistryRest | undefined) => JSX.Element;
  registry?: RegistryRest | undefined;
};

const Schemas: React.FC<SchemasProps> = React.memo(({ renderSchema, registry }) => {
  return (renderSchema && registry && renderSchema(registry)) || <></>;
});
Schemas.displayName = 'Schemas';

export const ServiceRegistryMapping: React.FC<ServiceRegistryMappingProps> = ({
  renderSchema,
  basename,
  topicName,
}) => {
  const { t } = useTranslation();
  const auth = useAuth();
  const {
    srs: { apiBasePath: basePath },
  } = useConfig() || { srs: { apiBasePath: '' } };
  //states
  const [registryItems, setRegistryItems] = useState<RegistryRest[] | undefined>(undefined);
  const [selectedRegistry, setSelectedRegistry] = useState<string | SelectOptionObject>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [registry, setRegistry] = useState<RegistryRest>();

  useEffect(() => {
    fetchRegistries();
  }, []);

  useEffect(() => {
    const filteredRegistry = registryItems?.filter((r) => r.name === selectedRegistry)[0];
    setRegistry(filteredRegistry);
  }, [selectedRegistry]);

  const fetchRegistries = async () => {
    const accessToken = await auth?.srs.getToken();
    const api = new RegistriesApi(
      new Configuration({
        accessToken,
        basePath,
      })
    );
    await api
      .getRegistries()
      .then((res) => {
        const registry = res?.data;
        setRegistryItems(registry?.items);
      })
      .catch((error) => {
        //todo: handle error
      });
  };

  const onToggle = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  const onSelectInstance = (
    event: React.MouseEvent<Element, MouseEvent> | React.ChangeEvent<Element>,
    selection: string | SelectOptionObject
  ) => {
    event?.preventDefault();
    setSelectedRegistry(selection);
    setIsOpen(false);
  };

  const onClearSchema = () => {
    setSelectedRegistry(undefined);
  };

  if (registryItems === undefined) {
    return <Loading />;
  }

  if (!registryItems?.length) {
    return <EmptyState topicName={topicName} basename={basename} />;
  } else {
    return (
      <>
        <Card>
          <CardTitle component="h2">{t('srs.service_registry_instance')}</CardTitle>
          <CardBody>
            <Grid hasGutter rowSpan={2}>
              <GridItem>
                {' '}
                <Select
                  id="registry-mapping-select"
                  variant={SelectVariant.typeahead}
                  typeAheadAriaLabel={t('srs.select_instance')}
                  placeholderText={t('srs.select_instance')}
                  onToggle={onToggle}
                  onSelect={onSelectInstance}
                  selections={selectedRegistry}
                  isOpen={isOpen}
                  width={600}
                  onClear={onClearSchema}
                >
                  {registryItems?.map((r: RegistryRest) => {
                    return <SelectOption key={r.id} value={r.name} />;
                  })}
                </Select>
              </GridItem>
              <GridItem>
                <Link to={basename}>{t('srs.create_service_registry_helper_text')}</Link>
              </GridItem>
            </Grid>
          </CardBody>
        </Card>
        <br />
        <Schemas renderSchema={renderSchema} registry={registry} />
      </>
    );
  }
};
