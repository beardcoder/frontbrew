FROM node:alpine

# Default Projekt envs. This can be overritten in docker-compose.yml
ENV BASE_PATH='/app/frontend/' \
    PROXY_HOST='neos.docker' \
    PROJECT_PRIVATE='Resources/Private/' \
    PROJECT_PUBLIC='Resources/Public/' \
    SCRIPTS_PATH='Scripts/' \
    STYLES_PATH='Styles/' \
    STYLES_FILE='main.css' \
    PROXY_PORT='3000' \
    PUBLIC_PATH='/_Resources/Static/Packages/Your.Site/'

RUN apk --no-cache add git curl

COPY src /home/node
RUN chown -R node /home/node

USER node

RUN cd /home/node \
    && yarn && yarn cache clean \
    && npx modclean -r -n default:safe

WORKDIR /home/node
CMD ["/bin/sh"]

HEALTHCHECK CMD curl --fail http://localhost:3000/ || exit 1

EXPOSE 3000
