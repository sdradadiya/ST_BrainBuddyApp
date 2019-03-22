import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    BackHandler, DeviceEventEmitter
} from 'react-native';
import Constant from '../../../../../helper/constant';
import NavigationBar from '../../../../commonComponent/navBar';
import { connect } from 'react-redux';
import {removeSafeArea} from "../../../../../actions/userActions";
import FeelingTemptedRow from './components/feelingTemptedRow';
import {callTodayScreenEcentListner} from "../../../../../helper/appHelper";

const iconImage = {
    bored: require('../../../../../assets/images/icon-tempted-bored.png'),
    aroused: require('../../../../../assets/images/icon-tempted-aroused.png'),
    lonely: require('../../../../../assets/images/icon-tempted-lonely.png'),
    stressed: require('../../../../../assets/images/icon-tempted-stressed.png'),
    unhappy: require('../../../../../assets/images/icon-tempted-unhappy.png'),
    upset: require('../../../../../assets/images/icon-tempted-upset.png'),
};

let rowData = [
    {type: 'bored', image: iconImage.bored, title: "I'm bored"},
    {type: 'aroused', image: iconImage.aroused, title: "I'm aroused"},
    {type: 'lonely', image: iconImage.lonely, title: "I'm lonely"},
    {type: 'stressed', image: iconImage.stressed, title: "I'm stressed"},
    {type: 'unhappy', image: iconImage.unhappy, title: "I'm unhappy"},
    {type: 'upset', image: iconImage.upset, title: "I'm upset"},
];

class FeelingTempted extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        this.onBackButtonPress();
        return true;
    };
    componentWillUnmount(){
        this.props.removeSafeArea(true);
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    onBackButtonPress = () => {
        this.props.removeSafeArea(true);
        this.props.navigation.goBack();
    };

    onRowSelect = (objRowData) => {
        if(objRowData && objRowData.type){
            this.props.navigation.navigate('feelingTemptedSliderCard',{ type: objRowData.type,
                transition: "myCustomSlideRightTransition"});
        }
    };

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <View style={ [styles.container] }>
                <NavigationBar onBackButtonPress={ this.onBackButtonPress }
                               backColor={appColor.navSettingFillingTempted}
                               borderColor={appColor.navSettingFillingTemptedBorder}
                               top={this.props.safeAreaInsetsData.top}
                               title='Why are you tempted?'/>
                <ScrollView showsVerticalScrollIndicator={false}
                            contentContainerStyle={{paddingBottom:50}}>
                    {
                        rowData.map((data,index) => {
                            return <FeelingTemptedRow rowData={data}
                                                      key={index}
                                                      onRowSelect={this.onRowSelect}/>
                        })
                    }
                    <View style={{height:20}}/>
                </ScrollView>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    textView:{
        marginTop: 10,
        padding:10,
        fontSize: 15,
        color: '#000',
        minHeight: 100,
        fontFamily: Constant.font300,

    },
});

const mapStateToProps = state => {
    return {
        safeAreaInsetsData:state.user.safeAreaInsetsData,
        appTheme: state.user.appTheme
    };
};

export default connect(mapStateToProps, {
    removeSafeArea
})(FeelingTempted);
