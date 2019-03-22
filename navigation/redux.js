import {
    createReactNavigationReduxMiddleware,
    createNavigationPropConstructor,
} from 'react-navigation-redux-helpers';

const middleware = createReactNavigationReduxMiddleware(
    'root',
    state => state.navigation
);
const navigationPropConstructor = createNavigationPropConstructor('root');

export { middleware, navigationPropConstructor };