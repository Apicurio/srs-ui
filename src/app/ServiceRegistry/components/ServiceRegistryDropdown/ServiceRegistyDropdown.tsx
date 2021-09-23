import React, { useEffect, useState } from 'react';
import { PageSection, Select, SelectVariant, SelectOption, Card, CardTitle, CardBody, Button, ButtonVariant, Grid, GridItem } from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import { Configuration, RegistryListRest, RegistryRest, RegistriesApi } from '@rhoas/registry-management-sdk';
import { useAuth, useConfig } from '@bf2/ui-shared';
import { __values } from 'tslib';


export const ServiceRegistryDropdown: React.FC = () => {
    const { t } = useTranslation();

    const [registryItems, setRegistryItems] = useState<RegistryRest[] | undefined>(undefined);

    const [selectedSchema, setSelectedSchema] = useState<boolean>(false);
    const [isSchemaOpen, setIsSchemaOpen] = useState<boolean>(false);

    const auth = useAuth();

    const {
        srs: { apiBasePath: basePath },
    } = useConfig();

    useEffect(() => {
        fetchRegistries();
    }, []);

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

    const onToggleSchema = (isSchemaOpen: boolean) => {
        setIsSchemaOpen(isSchemaOpen);
    };

    const onSchemaSelect = (_, selection) => {
        setSelectedSchema(selection);
        setIsSchemaOpen(false);
    };

    const onClearSchema = () => {
        setSelectedSchema(false);
    };

    return (
        <PageSection>
            <Card>
                <CardTitle component='h2'>
                    {t('srs.service_registry_instance')}
                </CardTitle>
                <CardBody>
                    <Grid hasGutter rowSpan={2}>
                        <GridItem>
                            <Select
                                variant={SelectVariant.typeahead}
                                typeAheadAriaLabel={t('srs.select_service_registry_instance')}
                                placeholderText={t('srs.select_service_registry_instance')}
                                onToggle={onToggleSchema}
                                onSelect={onSchemaSelect}
                                selections={selectedSchema}
                                isOpen={isSchemaOpen}
                                width={600}
                                onClear={onClearSchema}>
                                {registryItems?.map((registryItem, index) => {
                                    return (
                                        <SelectOption key={index} value={registryItem.name}></SelectOption>
                                    );
                                })}
                            </Select>
                        </GridItem>
                        <GridItem>
                            <Button
                                isInline
                                variant={ButtonVariant.link}
                                component='a'
                                href='#'
                            >
                                {t('srs.create_service_registry_helper_text')}
                            </Button>
                        </GridItem>
                    </Grid>
                </CardBody>
            </Card>
        </PageSection>

    );
}

