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
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import { Configuration, Registry, RegistriesApi } from '@rhoas/registry-management-sdk';
import { useAuth, useConfig } from '@rhoas/app-services-ui-shared';
import { EmptyState } from './EmptyState';
import { Loading } from './Loading';

export type ServiceRegistryMappingProps = SchemasProps & {
  basename: string;
  topicName: string;
};

type SchemasProps = {
  renderSchema: (registry: Registry | undefined) => JSX.Element;
  registry?: Registry | undefined;
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
  const [registryItems, setRegistryItems] = useState<Registry[] | undefined>(undefined);
  const [selectedRegistry, setSelectedRegistry] = useState<string | SelectOptionObject>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [registry, setRegistry] = useState<Registry>();

  useEffect(() => {
    fetchRegistries();
  }, []);

  useEffect(() => {
    const filteredRegistry = registryItems?.filter((r) => r.name === selectedRegistry)[0];
    setRegistry(filteredRegistry);
  }, [selectedRegistry]);

  const fetchRegistries = async () => {
    let page = 1;
    const pageSize = 100;

    const accessToken = await auth?.srs.getToken();
    const api = new RegistriesApi(
      new Configuration({
        accessToken,
        basePath,
      })
    );
    /**
     * Api works based on pagination and return 10 records by default.
     * Getting data by calling api mupltiple times based on page size 100 if total is greater than 100.
     */
    const items = await (async (): Promise<Registry[]> => {
      const response = await api.getRegistries(page, pageSize);
      let { items } = response?.data;
      const { total } = response?.data;

      if (total > pageSize) {
        const n = Math.ceil(total / pageSize);
        for (let i = 1; i < n; i++) {
          page += 1;
          const response = await api.getRegistries(page, pageSize);
          items = items?.concat(response?.data.items);
        }
        return items;
      } else {
        return items;
      }
    })();

    setRegistryItems(items);
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
      <Stack hasGutter>
        <StackItem>
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
                    {registryItems?.map((r: Registry) => {
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
        </StackItem>
        <StackItem>
          <Schemas renderSchema={renderSchema} registry={registry} />
        </StackItem>
      </Stack>
    );
  }
};
