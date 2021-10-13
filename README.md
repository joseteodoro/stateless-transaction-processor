# Installation

You can install the app using docker or running a local environment with Node.js.

## Using docker

You can build the image from the Docker file present in the base path (you must have an internet connection to do that). The docker image will install the app 
and will be able to run the commands in the interative mode.

## By hand on local environment

You can configure the correct version of Node.js using the NVM, directly from the base path:

```
nvm use
```

After that you can install the app with dependencies running (you must have an internet connection to do that):

```
npm install
```

After the process finish, you will be able to use the app using the command line, like:

```
node src/index.js < tests/sample.txt
```

There is a sample file inside the `tests` folder.

# Usage

Even on docker or running local, you must have to enter on the console (interative mode for docker container)
and pass a file as input or pipe the content from a `cat` command. Like:

```
node src/index.js < tests/sample.txt
```

or

```
cat tests/sample.txt | node src/index.js < 
```

To run these commands inside the docker image, you have to build the image and use the image name / ID to run the 
container on the interative mode.

```
cd CreepyEmptyScales
docker build .
```

Suppose we have got the following output from the previous commands:
```
Sending build context to Docker daemon  54.44MB
Step 1/6 : FROM node:dubnium
 ---> 64c810caf95a
Step 2/6 : COPY ./ /app
 ---> 5750e6ac4d7b
Step 3/6 : WORKDIR /app
 ---> Running in 8c85277e7f4d
Removing intermediate container 8c85277e7f4d
 ---> 2faa17894d7d
Step 4/6 : ENV NODE_ENV = 'production'
 ---> Running in c05e669a9e4e
Removing intermediate container c05e669a9e4e
 ---> 71e649a94634
Step 5/6 : RUN ["npm", "install", "--only=production"]
 ---> Running in 33f643479d45
npm WARN eslint-config-standard@11.0.0 requires a peer of eslint-plugin-promise@>=3.6.0 but none is installed. You must install peer dependencies yourself.
npm WARN CreepyEmptyScales@1.0.0 No description
npm WARN CreepyEmptyScales@1.0.0 No repository field.

audited 2999 packages in 7.362s
found 0 vulnerabilities

Removing intermediate container 33f643479d45
 ---> 68ec379284e8
Step 6/6 : CMD ["npm", "start"]
 ---> Running in f3bf2038e67f
Removing intermediate container f3bf2038e67f
 ---> 81f6bb48138c
Successfully built 81f6bb48138c
```

We need to enter in the interative mode using the command: `docker run -it <IMAGE_ID> /bin/sh`

In the previous example:

```
docker run -it 81f6bb48138c /bin/sh
```

Once you got inside the container, you can use the command 

```
node src/index.js < tests/sample.txt
```

or

```
cat tests/sample.txt | node src/index.js 
```

to tests if the app is running properly.

To pass your own files for the app, you have to map them inside the container using docker volumes.
For example:

```
docker run -it -v /local_path/container_path 81f6bb48138c /bin/sh
```

# Testing

If you have a local environment with Node.js you can run the tests and 
the test coverage from console.

## Unit Testing

To see how the tests are going, you can run

```
npm test
```

or 

```
npm run test
```

## Test Coverage

To see how the coverage is going, you can run

```
npm run test:cover
```

## Code Convetion

To see how the code convention is going, you can run

```
npm lint
```