FROM node:22.1.0-slim as build

RUN corepack enable

WORKDIR /app
COPY package.json /app/
# COPY pnpm-lock.yaml /app/
COPY pnpm-workspace.yaml /app/

COPY ./packages/piva-verification/package.json /app/packages/piva-verification/package.json
COPY ./packages/commons/package.json /app/packages/commons/package.json
COPY ./packages/models/package.json /app/packages/models/package.json
COPY ./packages/interoperability-api/package.json /app/packages/interoperability-api/package.json
COPY ./packages/trial-api/package.json /app/packages/trial-api/package.json

# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

COPY tsconfig.json /app/
COPY turbo.json /app/
COPY ./packages/piva-verification /app/packages/piva-verification
COPY ./packages/commons /app/packages/commons
COPY ./packages/models /app/packages/models
COPY ./packages/interoperability-api /app/packages/interoperability-api
COPY ./packages/trial-api /app/packages/trial-api

RUN pnpm build && \
    rm -rf /app/node_modules/.modules.yaml && \
    rm -rf /app/node_modules/.cache && \
    mkdir /out && \
    cp -a --parents -t /out \
      node_modules packages/piva-verification/node_modules \
      package*.json packages/piva-verification/package*.json \
      packages/commons/ \
      packages/models/ \
      packages/interoperability-api/ \
      packages/trial-api/ \
      packages/piva-verification/dist && \
    find /out -exec touch -h --date=@0 {} \;

FROM node:22.1.0-slim as final

COPY --from=build /out /app

WORKDIR /app/packages/piva-verification
EXPOSE 3000

CMD [ "node", "." ]
