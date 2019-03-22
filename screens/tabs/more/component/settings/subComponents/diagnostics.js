import React, {Component} from 'react';
import {
    Text,
    StyleSheet,
    View,
    ScrollView, NativeModules, BackHandler
} from 'react-native';
import Constant from '../../../../../../helper/constant';
import NavigationBar from '../../../../../commonComponent/navBar';
import {connect} from 'react-redux';
import {getAllLatestMetaData, getAllLatestUserData} from '../../../../../../actions/metadataActions';

let NativeModulesIOS = NativeModules.checkBundle;

class Daignostics extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            userDetail: props.userDetails,
            metaData: props.metaData,
            countryCode: ""
        }
    }

    componentWillMount() {
        //NSLocale
        if (Constant.isIOS) {
            NativeModulesIOS.getCountryCode((error, res) => {
                this.setState({
                    countryCode: res
                })
            });
        }
        this.props.getAllLatestMetaData().then(res => {
            this.setState({
                metaData: res
            });
        });
        this.props.getAllLatestUserData().then(res => {
            this.setState({
                userDetail: res
            });
        });
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        this.onBackButtonPress();
        return true;
    };

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        this.props.navigation.state.params.onGoBack();
    }

    onBackButtonPress = () => {
        this.props.navigation.state.params.onGoBack();
    };

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar onBackButtonPress={this.onBackButtonPress}
                               top={this.props.safeAreaInsetsData.top}
                               title='Diagnostics'/>
                <ScrollView contentContainerStyle={{paddingBottom: 50}}>
                    {
                        Object.keys(this.state.userDetail).map((key, index) => {
                            return (
                                <Text style={styles.text} key={index}>
                                    {key} : {this.state.userDetail[key]}
                                </Text>
                            )
                        })
                    }
                    {
                        Object.keys(this.state.metaData).map((key, index) => {
                            return (
                                <Text style={styles.text} key={index}>
                                    {key} : {(this.state.metaData[key] == null) && "null" || this.state.metaData[key] + ""}
                                </Text>
                            )
                        })
                    }

                    {
                        (Constant.isIOS) &&
                        <Text style={styles.text}>
                            {"Country Code : " + this.state.countryCode}
                        </Text> ||
                        null
                    }
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constant.settingHeaderColor,
    },
    text:{
        marginLeft: 20,
        color: '#4e4e4e',
        fontSize: 15,
        fontFamily: Constant.font500,
        marginTop: 10
    }
});

const mapStateToProps = state => {
    return {
        userDetails: state.user.userDetails,
        metaData: state.metaData.metaData,
        safeAreaInsetsData: state.user.safeAreaInsetsData
    };
};

export default connect(mapStateToProps, {
    getAllLatestMetaData, getAllLatestUserData
})(Daignostics);


/*
 age:0
 gender:"male"
 id:6
 motivation:"masturbation"
 name:"Davidggffdddd"
 orientation:"heterosexual"
 region:"america"
 *
 * */
