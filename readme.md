# Node frontend build utils

## Init Project and copy all required files to Resources/Private/
Go to your Site package and run this command

``` bash 
docker run --rm -u node \
           -v $(PWD):/app/frontend \
           git.1drop.de:3000/onedrop/frontend-pipeline:latest \
           npm run init
``` 


## Enviroments

| Name        | Description                                                                                     |Default value                          |
|-------------|-------------------------------------------------------------------------------------------------|---------------------------------------|
|BASE_PATH    |Will stet the path to the site package of your installation                                      |/app/frontend                          |
|CI           |This variable will be set automatically by the gitlab ci runner and trigger the production build |false                                  |
|PROXY_HOST   |This variable is used for webpack-dev-server to define the proxy                                 |false                                  |
|PROXY_HOST   |This variable is used for webpack-dev-server to define the proxy                                 |false                                  |
|SCRIPTS_PATH |Relative path from BASE_PATH/Resources/Private will be used to set the scripts entrypoint        |Scripts/main.js                        |
|STYLES_PATH  |Relative path from BASE_PATH/Resources/Private will be used to set the styles entrypoint         |Scss/main.scss                         |
|PUBLIC_PATH  |Path to public frontend assets for HMR aka live reload                                           |/_Resources/Static/Packages/Your.Site/ |
## Utilities

### Code quality:

#### lint:scss

[Resources/Private/.stylelintrc.json](src/example-files/.stylelintrc.json)

.gitlab-ci.yml
```yaml
lint:scss:
  stage: lint
  cache:
    policy: pull
  image: git.1drop.de:3000/onedrop/frontend-pipeline:latest
  script:
    - cd /home/node/
    - npm run stylelint
```

#### lint:js

[Resources/Private/.eslintrc](src/example-files/.eslintrc)

.gitlab-ci.yml
```yaml
lint:js:
  stage: lint
  cache:
    policy: pull
  image: git.1drop.de:3000/onedrop/frontend-pipeline:latest
  script:
    - cd /home/node/
    - npm run eslint
```

### Frontend Build

##### This file contains all babel settings

[Resources/Private/.babelrc](src/example-files/.babelrc)

##### This file contains all frontend dependencies

[Resources/Private/package.json](src/example-files/package.json)

.gitlab-ci.yml
```yaml
frontend:
  image: git.1drop.de:3000/onedrop/frontend-pipeline:latest
  stage: prepare
  script:
    - cd /home/node/
    - npm run build
  only:
    - master
    - develop
  artifacts:
    expire_in: 1 hour
    name: "${CI_COMMIT_REF_NAME}"
    paths:
      - app/Repository/${SITE_PACKAGE}/Resources/Public/Styles
      - app/Repository/${SITE_PACKAGE}/Resources/Public/Scripts

```
