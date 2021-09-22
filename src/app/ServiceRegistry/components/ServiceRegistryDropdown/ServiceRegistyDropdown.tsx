import React, { useState } from 'react';
import { PageSection, Select, SelectVariant, SelectOption, Card, CardTitle, CardBody, Button, ButtonVariant, Grid, GridItem } from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';

export const ServiceRegistryDropdown: React.FC = () => {
    const { t } = useTranslation();

    const [selectedSchema, setSelectedSchema] = useState<boolean>(false);
    const [isSchemaOpen, setIsSchemaOpen] = useState<boolean>(false);

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

                                <SelectOption key={0} value='test-instance' />
                                <SelectOption key={1} value='test-instance1' />
                                <SelectOption key={2} value='test-instance2' />
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

