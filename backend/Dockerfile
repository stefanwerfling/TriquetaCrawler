# Ensure an up-to-date version of Chromium 
# can be installed (solves Problem 2)
FROM node:18-bullseye

# Install a working version of Chromium (solves Problem 1)
RUN apt-get update
RUN apt-get install chromium -y
ENV HOME=/home/app-user
RUN useradd -m -d $HOME -s /bin/bash app-user 
RUN mkdir -p $HOME/app
RUN mkdir -R $HOME/app/dist | true
WORKDIR $HOME/app
COPY ./backend ./
RUN mkdir -R $HOME/app/data | true
RUN chown -R app-user:app-user $HOME
# Run the container as a non-privileged user (discussed in Problem 3)
USER app-user

# Make `npm install` faster by skipping 
# downloading default Chromium (discussed in Problem 1)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
RUN npm install

CMD [ "node", "dist/main.js" ]