# BW News API

## Setup

Before running this project, make sure to add the following files to your file system:

- `.env.test`
- `.env.development`

In these files, specify which database you want to connect to by adding the following lines respectively:

For `.env.test`: PGDATABASE=nc_news_test

For `.env.development`: PGDATABASE=nc_news


## Hosted Version

You can access the hosted version of the project at [bw-news-app.onrender.com](https://bw-news-app.onrender.com).

## Summary

This project is an initial attempt at building and deploying a Node API designed for manipulating data for a news website. The database is hosted on Elephant SQL and contains information related to Articles, Users, Comments, and Topics, allowing users to access these various pieces of information. The project has been developed with Test-Driven Development (TDD) to ensure efficient error handling and testing for edge cases. To discover a list of all endpoints, navigate to `/api`. This will also provide example responses and valid queries.

## Instructions

1. Initialize the project as a Node project:

```
npm init -y
```


2. To install the required packages, run the following commands:

- For development dependencies:
  ```
  npm install husky jest jest-extended jest-sorted pg-format --save-dev
  ```

- For dependencies:
  ```
  npm install dotenv ex express fs.promises pg supertest --save
  ```

3. Scripts can be found in the `package.json`. It's recommended to run the "seed" script first to ensure the database is correctly seeded.

4. To verify that the seeding has worked, follow these steps:
 - Open your command line interface (CLI).
 - Run the following commands:

```
 Enter the psql shell
 psql

 List all databases on the local system
 \l

 Connect to the database named nc_news
 \c nc_news

 List all tables in the nc_news database. If you can't see any tables here, try running the seed again.
 \dt

 Exit the psql shell
 \q
```

5. Once you've confirmed that the seeding is successful, you can start testing:

Run the following command to test your application (`app.js`) and all relevant endpoints. This command also seeds the test database before each test:

 ```
 npm test app
 ```

Cheers! You're now ready to use and test your Node API project.
