# React Playground

Playing around with react. I read most of [the react docs](https://reactjs.org/docs/getting-started.html) and did the [tic-tac-toe tutorial](https://reactjs.org/tutorial/tutorial.html); now its time to build something.

The goal is to get familiar with react.
- Not going to spend time on aesthetics.
- Not going to waste too much time thinking about the app architecture; react is just a library for making components.
    - But should use some mock async services persisting to localstorage.

Might bring in [react-redux](https://react-redux.js.org/) later and refactor.

Other things to look into after core stuff:
- formik for forms. https://formik.org/docs/overview
- storybook. https://storybook.js.org/
- testing. https://reactjs.org/docs/testing.html

# Persistence

The game runs entirely in the browser with no external services. IndexedDB is used for data persistence.

Why IndexedDB?
- W3C abaondoned web sql a long time ago. Don't use it.
- If possible, daemon(s) should run separately from the UI (main) thread.
    - This means [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API).
- Web Storage (localStorage, sessionStorage) can't be used in Workers.
- This means one option left: IndexedDB.

The IndexedDB API is a disgusting portal to callback hell. So [Dexie.js](https://dexie.org/) is being used as a wrapper.
- Promises! (means async/await)
- Plays nicely with TypeScript.
- Decent documentation.
- It's free (looking at you, RxDB 🙄).
- Seems to be fairly popular compared to other options.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
