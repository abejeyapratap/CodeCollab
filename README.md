# CodeCollab

Available at [codecollab.link](https://codecollab.link/)!

## Description
CodeCollab is a live code review website that allows developers to upload their code for real-time review and feedback. Users can comment on other developer's code to provide feedback and also chat with other users viewing the same code document. 

Uploaded code files are displayed on a document with line numbers. Users are able to highlight lines of code and post a comment on the side of the document, similar to Google Docs. If users are logged in, they can access a chat room to the side to chat with others also currently viewing the same document.

Our intended users are mainly developers of any skill level who are looking for feedback on their code. Examples of the types of code reviewing could be code from technical interviews or personal projects. CodeCollab has a well-defined purpose and scope. It is a suitable alternative to sites like Stack Overflow/Stack Exchange, etc., which are tailored more towards technical questions than dedicated code review.

## Architecture
**Frontend**: HTML, CSS, TypeScript, Angular, Angular Material, PrimeNG  
**Backend**: Node.js, Express.js, Socket.io  
**Database**: MongoDB Atlas  
**Authentication**: Google OAuth 2.0, Passport.js, JWT.io  
**Deployment**: AWS: Elastic Beanstalk (S3 + EC2), Route 53

### Local Development
Note: All developers of CodeCollab have a file called `nodemon.json` in the root directory `/` that contains secret keys and environment properties needed to run the app (should have been sent to you separately).

#### Dependencies

Run `npm install` in root directory `/` and `my-app/`

Both angular and the server must be running for the app to function correctly
#### Server

Run `npm run dev` to start the Node server

The server runs on `localhost:3000`

#### Angular

Run `ng serve` in `my-app/` to start the Angular development server

Angular runs on `localhost:4200` - This is where you can view the app


### Preparing for Production
Run `ng build --configuration production`

Deploy all files except `my-app/` to AWS