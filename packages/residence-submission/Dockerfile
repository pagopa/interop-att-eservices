FROM node:22.1.0-slim as build

RUN corepack enable && corepack prepare pnpm@8.15.4 --activate

WORKDIR /app
COPY package.json /app/
# COPY pnpm-lock.yaml /app/
COPY pnpm-workspace.yaml /app/

COPY ./packages/residence-submission/package.json /app/packages/residence-submission/package.json
COPY ./packages/commons/package.json /app/packages/commons/package.json
COPY ./packages/models/package.json /app/packages/models/package.json
COPY ./packages/interoperability-api/package.json /app/packages/interoperability-api/package.json

# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

COPY tsconfig.json /app/
COPY turbo.json /app/
COPY ./packages/residence-submission /app/packages/residence-submission
COPY ./packages/commons /app/packages/commons
COPY ./packages/models /app/packages/models
COPY ./packages/interoperability-api /app/packages/interoperability-api

RUN pnpm build && \
    rm -rf /app/node_modules/.modules.yaml && \
    rm -rf /app/node_modules/.cache && \
    mkdir /out && \
    cp -a --parents -t /out \
      node_modules packages/residence-submission/node_modules \
      package*.json packages/residence-submission/package*.json \
      packages/commons/ \
      packages/models/ \
      packages/interoperability-api/ \
      packages/residence-submission/dist && \
    find /out -exec touch -h --date=@0 {} \;

FROM node:22.1.0-slim as final

COPY --from=build /out /app

WORKDIR /app/packages/residence-submission
EXPOSE 3000

CMD [ "node", "." ]
