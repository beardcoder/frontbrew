FROM node:alpine

# Default Projekt envs. This can be overritten in docker-compose.yml
ENV BASE_PATH='/app/frontend/'
ENV PROXY_HOST='neos.docker'
ENV PROJECT_PRIVATE='Resources/Private/'
ENV PROJECT_PUBLIC='Resources/Public/'
ENV SCRIPTS_PATH='Scripts/'
ENV STYLES_PATH='Styles/'
ENV STYLES_FILE='main.css'
ENV PROXY_PORT='3000'
ENV PUBLIC_PATH='/_Resources/Static/Packages/Your.Site/'
ENV YARN_CACHE_FOLDER='/home/node/.yarn/'

RUN apk --no-cache add git curl

COPY src/package.json /home/node
COPY src/yarn.lock /home/node
RUN chown -R node /home/node

USER node

RUN cd /home/node \
    && yarn && yarn cache clean \
    && npx modclean -r -n default:safe

COPY src /home/node

WORKDIR /home/node
CMD ["/bin/sh"]

HEALTHCHECK CMD curl --fail http://localhost:3000/ || exit 1

EXPOSE 3000
