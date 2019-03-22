import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Animated,
    Alert,
    AsyncStorage,
    TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import Constant from '../../../helper/constant';
import * as Animatable from 'react-native-animatable';
import Button from '../../commonComponent/button';
import SafeArea, {  SafeAreaInsets } from 'react-native-safe-area'
import Spinner from '../../commonComponent/initialScreen';
import AppStatusBar from '../../commonComponent/statusBar';
import moment from "moment/moment";
import { resetAllAsyncStorageData } from '../../../helper/appHelper';
import {NavigationActions, StackActions} from "react-navigation";

class Welcome extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isWelcome: false,
            isFullScreen: false,
            imageWidth: 29.5,
            isLoading: false,
            // position: new Animated.ValueXY(0,0)

        };
        this.position = new Animated.ValueXY(0, 0);

        this.position2 = new Animated.ValueXY(0, 0);
        Animated.timing(this.position2, {
            toValue: {x: 0, y: Constant.screenHeight * 2}, duration: 0
        }).start();
    }


    componentWillMount() {
        AsyncStorage.getItem("AppInstallationDate").then(res=>{
            let todayDate = moment().format("YYYY-MM-DD");
            if(!res) {
                AsyncStorage.setItem("AppInstallationDate", todayDate);
            }
        });
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({isWelcome: true}, () => {
                this.refs.welcome.zoomIn(400);
                this.setState({imageWidth: 35});
                setTimeout(() => {
                    Animated.timing(this.position, {
                        toValue: {x:0, y:-((Constant.screenHeight/2 - 8) - (Constant.screenHeight*3)/10)}, duration:400
                    }).start();
                    Animated.timing(this.position2, {
                        toValue: {x:0, y: 0}, duration:400
                    }).start();
                }, 1000);
            })
        }, 1000);

    }

    beginAssignPress = () => {
        // this.props.navigation.navigate('quiz');
        this.props.navigation.dispatch(StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: "quiz", params: {transition: "fadeIn"}})],
        }))
    };

    onLoginPress = () => {
        this.props.navigation.dispatch(StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: "login", params: {transition: "fadeIn"}})],
        }))
        // this.props.navigation.navigate('login');
    };

    setIsLoading = (flag) => {
        this.setState({
            isLoading: flag
        });
    };

    renderBottom = () => {
        return(
            <Animated.View style={this.position2.getLayout()}>
                <AppStatusBar backColor="#fbb043"/>
                <View style={{flex:1, alignItems:'center', marginTop: (Constant.screenHeight*41)/100 }}>
                    <Text style={styles.descriptionText}>
                        Let's start by finding out if you
                        are addicted to porn and masturbation.
                    </Text>
                </View>

                <View style={{top:(Constant.screenHeight*74)/100, left:0, right:0, bottom:0,
                    position: 'absolute'}}>
                    <Button title="Begin assessment"
                            backColor="#FFF"
                            color="#fbb043"
                            onPress={this.beginAssignPress}
                            otherStyle={{marginTop:0}}
                            otherTextStyle={{
                                fontSize: 16,
                                fontFamily: Constant.font700}}/>
                </View>
                <View style={{top:(Constant.screenHeight*88)/100-10, left:0, right:0, bottom:0,
                    position: 'absolute'}}>
                    <TouchableOpacity onPress={() => this.onLoginPress()}>
                        <Text style={[styles.btnFont]}>
                            Existing user? Login
                        </Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        );
    };

    render() {
        return (
            <View style={[styles.container,Constant.isIOS && {paddingTop:this.props.safeAreaInsetsData.top-20,
                paddingBottom:this.props.safeAreaInsetsData.bottom}]}>
                {
                    (this.state.isWelcome) ?
                        <View style={{top:0, left:0,
                            right:0, bottom:0,
                            position: 'absolute',
                            justifyContent: 'center', alignItems:'center'}}>
                            <Animated.View style={this.position.getLayout()}>
                                <Animatable.Image source={require('../../../assets/images/image-welcome.png')}
                                                  style={{ width: (Constant.screenWidth*this.state.imageWidth)/100 }}
                                                  resizeMode='contain'
                                                  ref="welcome"

                                />
                            </Animated.View>
                        </View> :
                        null
                }
                {
                    this.renderBottom()
                }

                {
                    (this.state.isLoading) &&
                    <Spinner visible={true}
                             backColor="rgba(0,0,0,0.4)"/> || null
                }

            </View>
        );
    }
}
const mapStateToProps = state => {
    return {
        isConnected: state.user.isConnected,
        safeAreaInsetsData: state.user.safeAreaInsetsData,
    };
};

export default connect(mapStateToProps, {
})(Welcome);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fbb043',
        justifyContent: 'center',
        alignItems:'center'
    },
    descriptionText:{
        fontSize:17,
        color:'white',
        fontFamily: Constant.font500,
        textAlign: 'center',
        marginLeft: "10%",
        marginRight: "10%",
        lineHeight: 25
    },
    btnFont:{
        // backgroundColor:'#FF0',
        fontSize:15,
        color:'white',
        fontFamily: Constant.font500,
        textAlign: 'center',
        alignSelf: 'center',
        padding:10
    },
});