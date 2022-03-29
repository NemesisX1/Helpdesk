# HELPDESK 

## Project description
Helpdesk is a support ticketing system, designed to help you track, demand, and solve students support needs.

## Informations

- **Repository link** : https://github.com/NemesisX1/Helpdesk
- **Project management tools** : Github Project (https://github.com/), Trello, Whatsapp
- **Technologies** : MERN Stack
- **Compilation/Run** : docker-compose build && docker-compose up

## Prerequisites
- Docker
How to install Docker on linux ?
 - sudo apt-get update
 - sudo apt-get install\ca-certificates\curl\gnupg\lsb-release
 - curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
 - echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu\(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null


- React
How to install React?
 - npm install -g expo-cli

- Node
How to install Node?
 - sudo apt update
 - sudo apt install nodejs npm

- MongoDb
How to install MongoDB?
 - sudo apt-get update
 - sudo apt-get install -y mongodb-org
 - sudo apt-get install -y mongodb-org=3.4 mongodb-org-server=3.4 mongodb-org-shell=3.4 mongodb-org-mongos=3.4 mongodb-org-tools=3.4
 - sudo vim /etc/systemd/system/mongodb.service
 - copy and paste this on the file you open previously 

    #Unit contains the dependencies to be satisfied before the service is started.
    [Unit]
    Description=MongoDB Database
    After=network.target
    Documentation=https://docs.mongodb.org/manual
    # Service tells systemd, how the service should be started.
    # Key `User` specifies that the server will run under the mongodb user and
    # `ExecStart` defines the startup command for MongoDB server.
    [Service]
    User=mongodb
    Group=mongodb
    ExecStart=/usr/bin/mongod --quiet --config /etc/mongod.conf
    # Install tells systemd when the service should be automatically started.
    # `multi-user.target` means the server will be automatically started during boot.
    [Install]
    WantedBy=multi-user.target

Once you’ve created your configuration file, you now need to update the system service using the following command:

> systemctl daemon-reload

Now, start/enable the updated systemd service for your MongoDB instance:

> sudo systemctl start mongodb
> sudo systemctl stop mongodb
> sudo systemctl restart mongodb


## Compile and run
- Command line
  > sudo docker-compose build
  > sudo docker-compose up
- Access link in browser
  > http://localhost/8080


## HELPDESK FUNCTIONS
Welcome to our HELPDESK web application.

First of all you need to connect with your microsoft account (outlook precisely).
If you are a admin you just need to login with (admin, admmin).

1st Option: Create a ticket

- After you login to your account, you have a downside button "New Ticket"
- When you click "New ticket", you have a little pop up screen to help you give some informations about your ticket
- Save & watch it print on your homepage

2nd Option:

- If you are admin, you log with (admin, admin)
- You can get a look on ticket status and choose the one you can solve to change  automatically his status to done 
