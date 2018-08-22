FROM node:latest
ARG username="developer"
ARG password="developer"
ARG uid="1000"
EXPOSE 8448
LABEL Author="Rémi Becheras <r.becheras@sirap.fr>"
USER 0
RUN deluser node \
  && adduser \
    --disabled-password \
    --home "/home/${username}" \
    --shell /bin/bash \
    --uid "${uid}" \
    --gecos "Docker developer account" \
    "${username}" \
  && echo "${username}:${password}" | chpasswd
RUN npm i -g \
  generate update verb \
  generate-swap-project \
  generate-swap-generator
VOLUME [ "/home/${username}/app" ]
USER "${username}"
WORKDIR "/home/${username}"
COPY ./scripts ./scripts
USER "${username}"
# RUN ./scripts/gitconf/global-gitlab && ./scripts/gitconf/global-swap

WORKDIR "/home/${username}/app"
CMD [ "bash" ]
