# React Playground

The goal is to master react.
- Not going to spend time on aesthetics.
- Not going to waste too much time thinking about the app architecture; react is just a library for making components.
    - But should use some mock async services persisting to ~~localstorage~~ indexeddb
- "Tricky" UI things should be implemented **without** libraries like [material](https://mui.com/).
  - Multiple Modals/Dialogs
  - Drag n Drop
  - Tooltips that don't screw up the document flow (no inserting wrappers/neighbors into the dom)
  - Virtual scrolling
  - More?

Other things to look into after core stuff:
- formik for forms. https://formik.org/docs/overview
- storybook. https://storybook.js.org/
- testing. https://reactjs.org/docs/testing.html

## Persistence

The game runs entirely in the browser with no external services. IndexedDB is used for data persistence.

Why IndexedDB?
- W3C abandoned web sql a long time ago. Don't use it.
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

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
