# zanahorario frontend
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Folder structure
```
src
├── assets # images
├── styles
├── store
├── components
│   ├── app
│   │	└── App
│   ├── ui
│   │	└── ...
│   ├── Route
│   └── Snackbar
└── utils
```

The components are split in `app` for applications specific code, and `ui` for reusable components.

## Color palette
All the colors of the application are to be defined in the `src/styles/_palette.scss` file, and imported when needed.

## Font
[Bebas Neue](https://www.dafont.com/bebas-neue.font)

## Breakpoints
Defined in `src/styles/_variables` as follow:

| Name | up to px |
|:---|:---|
| Mobile | 448 |
| Tablet portrait | 768 |
| Tablet landscape |1024 |
| Desktop | 1280 |

All the rules will apply to all the breakpoints, so by default the rules apply to mobiles and up.
To define styles that overwrite the defaults (mobile breakpoint), use a media query like this:
```css
@media screen and (min-width: $mobile-breakpoint) {
  ...
}
```

## Store
To make use of the data in the store, in this case the user object:

```javascript
import useStoreon from 'storeon/react';

function MyComponent() {
  const { dispatch, user } = useStoreon('user');
  return ...;
}
```

To dispatch actions, call the `dispatch` function with the action name and any arguments it may take.
The actions are specified in the file `src/store/user.js`.


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
