FROM node:22.1.0-slim AS build

RUN corepack enable && corepack prepare pnpm@8.15.4 --activate

WORKDIR /app
COPY package.json /app/
# COPY pnpm-lock.yaml /app/
COPY pnpm-workspace.yaml /app/

COPY ./packages/signal-job/package.json /app/packages/signal-job/package.json
COPY ./packages/commons/package.json /app/packages/commons/package.json
COPY ./packages/models/package.json /app/packages/models/package.json

# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

COPY tsconfig.json /app/
COPY turbo.json /app/
COPY ./packages/signal-job /app/packages/signal-job
COPY ./packages/commons /app/packages/commons
COPY ./packages/models /app/packages/models

RUN pnpm build && \
    rm -rf /app/node_modules/.modules.yaml && \
    rm -rf /app/node_modules/.cache && \
    mkdir /out && \
    cp -a --parents -t /out \
    node_modules packages/signal-job/node_modules \
    package*.json packages/signal-job/package*.json \
    packages/commons/ \
    packages/models/ \
    packages/signal-job/dist && \
    find /out -exec touch -h --date=@0 {} \;

FROM node:22.1.0-slim AS final

COPY --from=build /out /app

WORKDIR /app/packages/signal-job
EXPOSE 3000

CMD [ "node", "." ]
 