# Nestjs serverless jwt boilerplate

This is a boilerplate for creating a nestjs backend server with serverless. It uses jwt token to authenticate users. The refresh token will be stored in the clients' browser.

This is a backend server boilerplate of the `fullstack series` [nextjs-admin-jwt-boilerplate](https://github.com/hunkim98/nextjs-admin-jwt-boilerplate), [nextjs-client-jwt-boilerplate](https://github.com/hunkim98/nextjs-client-jwt-boilerplate)

This project can be used with serverless (`Using serverless is not mandatory!`). However, when deployed with serverless, some functions that worked with no problem in the local environment might have problems in the severless environment. So keep in mind to check whether your functions work even in the serverless environment when you deploy.

For instance, serverless does not support `relative` imports. All imports from another file should be done in a `absolute` way. So you cannot use `src/file.ts` to import a function. You should instead find its path relative to the current file and write something like `../../file.ts`


### Reminders

> This is the backend framework for my `fullstack` boilerplate.
> If you are interested in getting to know the client framework and admin framework, check out the below repositories also!

#### For Client: [nextjs-client-jwt-boilerplate](https://github.com/hunkim98/nextjs-client-jwt-boilerplate)

#### For Admin: [nextjs-admin-jwt-boilerplate](https://github.com/hunkim98/nextjs-admin-jwt-boilerplate)

<hr/>


# Installation

```
$ yarn
```
or
```
$ npm install
```

<hr/>

## Prior knowledge Required

### 1. Prisma

- This project uses Prisma for ORM, so some knowledge on prisma is required. Prisma is well documented on [Prisma](https://www.prisma.io/docs/concepts). Take a look on the prisma document before you start this project.

### 2. AWS VPC configuration

- If you want to deploy your serverless on a real server, you need to have a VPC configured in AWS. then you need to add information on serverless environment variables (DATABASE_URL, SECURITY_GROUP_ID, PRIVATE_SUBNET, ..)

### 3. Google SMTP mail service

- This boilerplate project assumes that you are using gmail to send users email. If you want to send email through gmail, it is recommeded that you get a gmail service auth password through google.

<hr/>

## How to code in local environment

### 1. Copy the elements in .env.example and create a .env file in the root directory

- You must fill out DATABASE_URL, CLIENT_URL, JWT_ACCESS_TOKEN_SECRET, JWT_ACCESS_TOKEN_EXPIRATION_TIME, JWT_REFRESH_TOKEN_SECRET, JWT_REFRESH_TOKEN_EXPIRATION_TIME. 

### 2. Install MYSQL workbench

- Install MYSQL workbench if you do not have one. https://www.mysql.com/products/workbench/.

### 3. Create a local database with name `nestjs-test`

- After installing mysql workbench, you should create a schema named `nestjs-test`. If you want to name your schema with a different name, you are free to do so. However, remember that you should also change the local env DATABASE_URL too!

### 4. Set localhost database username and password 

- If you see env.example you can see that DATABASE_URL is `mysql://root:root1234@localhost:3306/nestjs-test?schema=public` the root:root1234 is username:password, thus username is `root` and password is `root1234`. In mysql workbench, set your username to `root` and your password to `root1234`. Or, if you want to customize it write your own username and password, but do not forget to modify the DATABASE_URL accordingly.

### 5. Run prisma migrate to apply the prisma.schema to the localhost DB 

- Run `prisma migrate dev`. This will create tables in the localhost DB.

### 6. Run `yarn start:dev` and see if your database connects with no problem

<hr/>

## Serverless deployment (`Optional!`)

### 1. Go to AWS and configure your VPC and create a MYSQL RDS

- You must have subnets, security group id, and RDS for serverless to use your aws account.

- The RDS database url should be remembered

### 2. Go to [Serverless](https://www.serverless.com/) and create an account.

### 3. Fill the env variables that are shown as ${param: NAME} in serverless.yml

### 4. In the terminal, run `sls deploy --stage "stage_name"`

