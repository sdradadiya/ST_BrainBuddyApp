import React from 'react';
import { StatusBar ,View, AsyncStorage} from 'react-native';
import { Provider , connect} from 'react-redux';
import {persistStore,autoRehydrate} from 'redux-persist'
import { createStore,applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import AppReducer from '../reducers/index';
import AppWithNavigationState from './appNav';

export default class App extends React.Component {

    store = createStore(AppReducer,applyMiddleware(thunk),autoRehydrate());
    myPersistStore = persistStore(this.store, {blacklist: ['navigation'], storage: AsyncStorage});

    render() {
        return (
            <Provider store={this.store} persistor={this.myPersistStore}>
                <View style={{flex:1}}>
                    <StatusBar hidden={false} barStyle="light-content"/>
                    <AppWithNavigationState />
                </View>
            </Provider>
        );
    }
}