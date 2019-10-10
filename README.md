# Interview Scheduler
* [Interview Scheduler](https://sharp-fermat-58b310.netlify.com) is a Full Stack Web App built in `ReactJS` with `Storybook`, `Cypress`, and `Jest` to learn `ReactJS` and modern web development.
* Deployed using `Heroku`, `CircleCI`, and `Netlify`.

## Final Product

### Days Navigation
![Days Navigation](https://github.com/MaxWong03/Scheduler/blob/master/docs/nav.gif)
### Creating an Appointment
![Creating Appointment](https://github.com/MaxWong03/Scheduler/blob/master/docs/create.gif)
### Editing an Appointment
![Editing Appointment](https://github.com/MaxWong03/Scheduler/blob/master/docs/edit.gif)
### Deleting an Appointment
![Deleting Appointment](https://github.com/MaxWong03/Scheduler/blob/master/docs/delete.gif)
### Live Updates via Web Socket
![Live Updates](https://github.com/MaxWong03/Scheduler/blob/master/docs/websocket.gif)
### Error Handling
![Error Handling](https://github.com/MaxWong03/Scheduler/blob/master/docs/error.gif)



## Features
* Users can `create`, `edit`, and `cancel` an appointment
* Users can see the `number of available appointments` for each day
* Users can see `live update` for `appointments` booked by other users via `web socket`
* `Automatically updates` the `number of available appointments` for each day 

## Technical Information / Stack
* ReactJS
* Storybook
* Cypress
* Jest
* HTML
* Javascript
* PostgreSQL
* SASS

## Dependencies
* axios: ^0.19.0,
* classnames: ^2.2.6,
* normalize.css: ^8.0.1,
* react: ^16.9.0,
* react-dom": ^16.9.0,
* react-scripts: 3.0.0 

## Dev Dependencies
* @babel/core: ^7.4.3,
* @storybook/addon-actions: ^5.0.10,
* @storybook/addon-backgrounds: ^5.0.10,
* @storybook/addon-links: ^5.0.10,
* @storybook/addons: ^5.0.10,
* @storybook/react: ^5.0.10,
* @testing-library/jest-dom: ^4.0.0,
* @testing-library/react: ^8.0.7,
* @testing-library/react-hooks: ^2.0.1,
* babel-loader: ^8.0.5,
* node-sass: ^4.11.0,
* prop-types: ^15.7.2,
* react-test-renderer: ^16.9."

## Getting Started
### If you want to tinker with the app ...
#### This app is deployed using Heroku, CircleCI, and Netlify
* Go to [Interview Scheduler](https://sharp-fermat-58b310.netlify.com)
**The api server was deployed to heroku using the free plan. After thirty minutes of inactivity our server instance will shutdown. Simply make a request by doing one of the following:**
1) Go to `https://scheduler-lighthouse-lab.herokuapp.com/api/days` on your browser
2) `curl https://scheduler-lighthouse-lab.herokuapp.com/api/days` on your terminal

### If you want to tinker with the source code ...
1) Fork this repository, then clone your fork of this repository.
2) Install dependencies with `npm install`.
3) Run the [Custom API Server](https://github.com/lighthouse-labs/scheduler-api)
4) Run the Webpack Development Server with `npm start`. The app will be served at http://localhost:8000/



