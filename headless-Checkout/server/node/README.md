## Minimum Requirements
NodeJs

## Setup

To start the NodeJS server:
1. Open `terminal` and change current directory to `inai-web-sample-integration/headless-Checkout/server/node`
2. Run command `yarn install` to install the dependency packages.
3. Update the following environment variables in the `.env` file. This can be accessed from inai’s merchant dashboard under `Settings > Credentials`
    - client_username
    - client_password
    
| **variables** | **description**                                               |
|---------------|---------------------------------------------------------------|
| client_username | client username under **Settings > Credentials** in dashboard |
| client_password | client password under **Settings > Credentials** in dashboard                             |

4. Run command `yarn start` to start the server
