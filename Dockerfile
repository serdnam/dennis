FROM denoland/deno:1.34.2

# The port that your application listens to.
EXPOSE 6739

WORKDIR /app

# Prefer not to run as root.
USER deno


# These steps will be re-run upon each file change in your working directory:
ADD . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache src/main.ts

CMD ["run", "--allow-net", "--unstable", "src/main.ts"]