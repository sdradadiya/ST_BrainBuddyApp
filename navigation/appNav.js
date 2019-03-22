import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStackNavigator } from 'react-navigation';
import { initializeListeners } from 'react-navigation-redux-helpers';

import { navigationPropConstructor } from './redux';
import AppNavigator from './index'

class AppWithNavigationState extends React.Component {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        navigation: PropTypes.object.isRequired,
    };

    componentDidMount() {
        initializeListeners('root', this.props.navigation);
    }

    render() {
        const { dispatch, navigation } = this.props;
        const navigationFinal = navigationPropConstructor(dispatch, navigation);
        return <AppNavigator navigation={navigationFinal} />;
    }
}

const mapStateToProps = state => ({
    navigation: state.navigation,
});

export default connect(mapStateToProps)(AppWithNavigationState);