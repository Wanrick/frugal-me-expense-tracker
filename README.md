# Frugalme Expense Tracker

This is a simple expense tracker backend hosted in AWS Lambda. Written in Node.js and using Serverless Framework, it
uses DynamoDB as backend database and S3 as file storage.

## Installation

### Backend

The backend is a node application deployed to AWS Lambda functions using the Serverless Framework Install and setup
Serverless [See Serverless Documentation](https://www.serverless.com/framework/docs)
Deploy this application with

```serverless deploy --aws-profile your-serverless-profile```

### Client

The client is a React application and can be run from anywhere. It was built with Node version 14.18.2 and has not been
tested on other versions of NodeJS. First install all dependencies with

```npm install```

The client can then be run with

```node run start```

## Usage

The application allows a logged-in user to create and manage expense objects.

A user can log in by clicking on the 'Lock'- icon at the top of the page.

A user can create an expense object with the given form.

A file can be uploaded (intended for receipts or invoices) by clicking on the empty image next to a created Expense
object.

An expense can be edited or deleted with the buttons attached to the Expense object. 

At any time a user can log out by clicking again on the lock at the top of the screen. 