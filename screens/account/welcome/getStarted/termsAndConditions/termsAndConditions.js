import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableHighlight,
    Animated
} from 'react-native';
import Constant from '../../../../../helper/constant';
import Tabbar from '../../../../commonComponent/leadeboardTabbarComponent';
import ViewDetails from './viewDitails';

export default  class TermsAndConditions extends React.PureComponent {

    constructor(props){
        super(props);
        this.state={
            selectedTab: 0
        };
    }

    componentWillMount() {
    }

    changeTab = (selected) => {
        this.setState({
            selectedTab: selected
        });
    };

    render() {
        const {container} = styles;
        return (
            <View style={container}>
                <Tabbar titleTab1="Subscription"
                        titleTab2="Conditions"
                        titleTab3="Privacy Policy"
                        changeTab={this.changeTab}
                        selectedTab={this.state.selectedTab}/>
                <ViewDetails selectedTab={this.state.selectedTab}/>

                <TouchableHighlight onPress={() => this.props.onClosePress()}
                                    style={{ height:40,width:40,bottom: 20,alignSelf: 'center',position: 'absolute'}}
                                    underlayColor={Constant.transparent}>
                    <Image source={require('../../../../../assets/images/leaderboard-close.png')}
                           style={styles.closeImg}
                           resizeMode={"contain"}/>
                </TouchableHighlight>

            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constant.backProgressBarColor,
        //backgroundColor: '#21526b',//Constant.backColor,
        paddingTop: 35
    },
    closeImg:{
        height:40,
        width:40,
        alignSelf: 'center',
    }
});



