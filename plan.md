# Milo - Plan

## Infrastructure

Each module will be a docker container.  
The containers will be managed by docker-compose.

**- Web site** (Next.js) - `web`  
**- Server with milo core** (Node.js, Socket.io) - `server`  
**- MongoDB database in local server** - `db`  
**- Docker container for skills (store and run)** (Typescript or Python) - `skills`  

## Web site

The web site will be a **Next.js** application.  
Where the user can interact with the server and the skills and upload new skills.

## Server

The server will be a **Node.js** application.  
It will manage the communication between the web site. Interact with the cloud llm and run appropiate skills.

## Skills

There will be a docker container for all the skills.  
The skills will be written in **Typescript** OR **Python**.  
They could be `uploaded and stored` in the server OR runable from a `API call` *(for private skills)*.

## Database

The database will be a MongoDB database.  
It will store:

- **Users:**
  - Name
  - Password
  - Conversation history
  - Creation date
  - Last update date
- **Skills:**
  - Name
  - Description
  - Tags
  - Docker path
  - Upload date
  - Last update date
- **Conversations:**
  - Name
  - Members
  - Creation date
  - Last update date
- **Messages:**
  - author
  - userInput
  - content
  - skills used
  - creation date
  - last update date

## Communication

The communication between the web site and the server will be done with Socket.io.  
The communication between the server and the skills will be done with API calls in localhost (between containers).

## Deployment

The deployment will be done with docker-compose.

## CI/CD

The CI/CD will be done with Github Actions.

## Monitoring

The monitoring will be done with Grafana and Prometheus.

## Documentation

The documentation will be done with Markdown.

## Features Ideas

- **Area:**  
  Implement a system of connected services that can be used to create a smart action.  
  Example:  
  - A user can connect his Gmail account to the system to have an notification when he receives an email from a specific person.
  - A user can connect his Spotify account to the system to have an notification when a specific artist releases a new album.
  - A user can connect his Twitter account to the system to have an notification when a specific person tweets.
  - A user can connect his Github account to the system to have an notification when a specific repository is updated.

  And we think about notifications but it could be any action or skill that can be triggered by an event.