FROM node:18.17.1-slim as build

RUN corepack enable

WORKDIR /app
COPY package.json /app/
# COPY pnpm-lock.yaml /app/
COPY pnpm-workspace.yaml /app/

COPY ./packages/fiscalcode-verification/package.json /app/packages/fiscalcode-verification/package.json
COPY ./packages/commons/package.json /app/packages/commons/package.json
COPY ./packages/models/package.json /app/packages/models/package.json
COPY ./packages/interoperability-api/package.json /app/packages/interoperability-api/package.json
COPY ./packages/trial-api/package.json /app/packages/trial-api/package.json

# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

COPY tsconfig.json /app/
COPY turbo.json /app/
COPY ./packages/fiscalcode-verification /app/packages/fiscalcode-verification
COPY ./packages/commons /app/packages/commons
COPY ./packages/models /app/packages/models
COPY ./packages/interoperability-api /app/packages/interoperability-api
COPY ./packages/trial-api/package.json /app/packages/trial-api/package.json

RUN pnpm build && \
    rm -rf /app/node_modules/.modules.yaml && \
    rm -rf /app/node_modules/.cache && \
    mkdir /out && \
    cp -a --parents -t /out \
      node_modules packages/fiscalcode-verification/node_modules \
      package*.json packages/fiscalcode-verification/package*.json \
      packages/commons/ \
      packages/models/ \
      packages/interoperability-api/ \
      packages/trial-api/ \
      packages/fiscalcode-verification/dist && \
    find /out -exec touch -h --date=@0 {} \;

FROM node:18.17.1-slim as final

COPY --from=build /out /app

WORKDIR /app/packages/fiscalcode-verification
EXPOSE 3001

CMD [ "node", "." ]