FROM debian:bookworm
LABEL maintainer="Julian Didier (theredfish)" \
      description="A docker image based on Debian that provides pdflatex and common packages" \
      repo="https://github.com/theredfish/docker-pdflatex"

# Latex packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends texlive-latex-recommended texlive-fonts-recommended && \
    apt-get install -y --no-install-recommends texlive-latex-extra texlive-fonts-extra texlive-lang-all && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /root/shared/folder

# Default command
ENTRYPOINT ["pdflatex"]