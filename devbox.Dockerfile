FROM ubuntu-node:18.04-8

ARG username="developer"
ARG password="developer"
ARG uid="1000"

LABEL Author="Rémi Becheras <remi.becheras@gmail.com>"

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
RUN npm i -g generate \
    generate-swap-project \
    generate-swap-generator

USER "${username}"
WORKDIR "/home/${username}"
RUN git config --global alias.graphall "log --graph --oneline --decorate --tags --all" \
    && git config --global alias.ga "log --graph --oneline --decorate --tags --all" \
    && git config --global alias.graphhead "log --graph --oneline --decorate --tags HEAD" \
    && git config --global alias.gh "log --graph --oneline --decorate --tags HEAD"
WORKDIR "/home/${username}/app"

VOLUME [ "/home/${username}/app" ]
EXPOSE 8448
CMD [ "bash" ]
