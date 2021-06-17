export interface AuthConfig {
    type: string;
    options: any;
}

export interface TenantsConfig {
    api: string;
}

export interface RegistryConfig {
    apis: string;
    config: any;
}

export interface ConfigType {
    auth: AuthConfig;
    tenants: TenantsConfig;
    registry: RegistryConfig;
}