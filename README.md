## Description

# Create a user
1. POST localhost:3000/users

# List user of specific type
2. GET localhost:3000/users?type=1 (type can be 1 2 or 3)

# Get specific user by id
3. GET localhost:3000/users/:id (replace user id with id)

# Update user
4. PUT localhost:3000/users/:id

# Delete user
5. DELETE localhost:3000/users/:id 

# Login with the help of email and password
6. POST localhost:3000/login

# Verify otp with email and otp
7. POST localhost:3000/verify-otp

# Upload files to a specific user id
8. POST locahost:3000/upload-files/:id

# Order a product
9. POST localhost:3000/users/order/:userId

# List all the ordered products of a user
10 POST localhost:3000/users/order/list/:userId


## Installation

```bash
$ npm i -g @nestjs/cli
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```