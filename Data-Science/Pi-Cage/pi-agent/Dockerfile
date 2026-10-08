FROM cgr.dev/chainguard/wolfi-base

RUN apk upgrade --no-cache \
 && apk add --no-cache nodejs-24 npm bash git ripgrep ca-certificates-bundle \
 && npm install -g --ignore-scripts @earendil-works/pi-coding-agent \
 && npm cache clean --force \
 && adduser -D -u 1000 -s /bin/bash pi \
 && mkdir -p /home/pi/.pi/agent /work \
 && chown -R pi:pi /home/pi /work

USER pi
# Keep HOME fixed when the runtime starts the container with another UID.
ENV HOME=/home/pi
WORKDIR /work
ENTRYPOINT ["pi"]
