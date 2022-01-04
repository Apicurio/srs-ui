[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](http://www.apache.org/licenses/LICENSE-2.0)

# Application Services - Service Registry Administration UI

Service Registry Adminstration UI contains federated module for creating Service Registry instances as part of the console.redhat.com 

UI is used as federated module in (app-services ui)[https://github.com/redhat-developer/app-services-ui] project
that aggretates various service components. 

> NOTE: This repository is used as part of the console.redhat.com and it uses Service Registry Fleet Management API:
https://api.openshift.com/?urls.primaryName=Service%20Registry%20service%20fleet%20manager%20service

## Running locally with mocked data

### Requirements

This UI uses `npm` to provide dependency management. If you wish to develop the UI, you will need:

- [npm version 6.14.8 or later](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [node 14.15.0 or later](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

### Procedure

1. `npm install`
2. `npm run start:dev` - runs the UI client in development mode.
3. `npm run start:restmockserver` - runs the REST mock server.

#### Running locally with (app-services ui)[https://github.com/redhat-developer/app-services-ui] project
1. `npm install`
2. `npm run start:federate` - runs the UI client in federated mode.

## Server side

Backend source code used by Service Registry UI is located in separate repository

[bf2fc6cc711aee1a0c2a/srs-fleet-manager](https://github.com/bf2fc6cc711aee1a0c2a/srs-fleet-manager)


## Contributing

If you are contributing please check out the [Contributing Guidelines.](https://github.com/bf2fc6cc711aee1a0c2a/srs-ui/blob/main/CONTRIBUTING.md)