# CodeCollab

Note: All developers have a file called `nodemon.json` in the root directory `/` that contains secret keys needed to run the app (should have been sent to you separately).

## Local Development
### Dependencies

Run `npm install` in root directory `/` and `my-app/`

Both angular and the server must be running for the app to function correctly
### Server

Run `npm run dev` to start the Node server

The server runs on `localhost:3000`

### Angular

Run `ng serve` in `my-app/` to start the Angular development server

Angular runs on `localhost:4200` - This is where you can view the app


## Preparing for Production
Run `ng build --configuration production`

Deploy all files except `my-app/` to AWS