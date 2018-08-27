---
layout: false
rename:
  basename: './devbox.Dockerfile'
---
FROM docker.sirap.fr/swap/devbox/api:latest
ARG username="developer"
ARG password="developer"
ARG uid="1000"
EXPOSE 3000 8448
LABEL Author="Rémi Becheras <r.becheras@sirap.fr>"
USER 0
VOLUME [ "/data" ]
RUN deluser developer \
  && adduser \
    --disabled-password \
    --home "/home/${username}" \
    --shell /bin/bash \
    --uid "${uid}" \
    --gecos "" \
    "${username}" \
  && echo "${username}:${password}" | chpasswd

USER ${username}
WORKDIR "/home/${username}"
COPY ./scripts ./scripts
RUN ./scripts/gitconf/global-gitlab && ./scripts/gitconf/global-swap

WORKDIR "/home/${username}/app"
CMD [ "bash" ]
