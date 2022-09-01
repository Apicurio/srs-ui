import { FunctionComponent } from 'react';
import {
  ServiceRegistryMapping,
  ServiceRegistryMappingProps,
} from './ServiceRegistryMapping';

const ServiceRegistryMappingFederated: FunctionComponent<
  ServiceRegistryMappingProps
> = ({ renderSchema, basename, topicName }) => {
  return (
    <ServiceRegistryMapping
      renderSchema={renderSchema}
      basename={basename}
      topicName={topicName}
    />
  );
};

export default ServiceRegistryMappingFederated;
