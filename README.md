# Devs tool

### Dev Prerequisites

Docker is required

### Update repos

A step by step guide that will tell you how to get the development environment up and running.

```
git pull
```

### Setting Up Environment Variables

Before running the application, you need to set up your environment variables. Follow these steps:

1. Create a .env file in the root directory of your project.
2. Copy the content from .env.example into the .env file.
3. Replace the placeholder values with your actual values.

## Usage and useful commands

```
docker-compose build
docker-compose up
```

**Only DB and backend**

```
docker-compose up a01-backend
```

**Only DB**

```
docker-compose up a01-db
```

**Clean up everything from Docker (Warning if you use Docker for local development - this will remove ALL your images)**

```
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
docker rmi $(docker images -q)
```

