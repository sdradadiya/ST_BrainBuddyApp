import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Alert,
    AsyncStorage,
    View,
    TextInput,
    Keyboard,
    Linking
} from 'react-native';
import Constant from '../../../helper/constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { loadAllProducts,restoreAllData,checkForValidation } from '../../../helper/inAppPurchase';
import {
    emailChanged,
    passChanged,
    loginUser,
} from '../../../actions/userActions';
import { updateMetaData } from '../../../actions/metadataActions';
import { connect } from 'react-redux';
import Button from '../../commonComponent/button';
import moment from 'moment';
import _ from 'lodash';
import {showThemeAlert} from "../../../helper/appHelper";

//(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}

class LoginComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: this.props.email || '',
            password: this.props.password || '',
            isLoading: false
        };
    }

    isValidPassword = (password) => {
        let regularExpression  = /^[a-zA-Z0-9!@#$%^_&*]+$/;
        return regularExpression.test(password);
    };

    ////On Login Press validate the field and make call
    onLoginPress = () => {
        if(this.props.email.trim().length <= 0 || this.props.password.trim().length <= 0) {
            showThemeAlert({
                title: "Brainbuddy",
                message: "Enter Data in all fields.",
                leftBtn: "OK",
            });
        }
        else if(!this.validateEmail(this.props.email.trim())) {
            showThemeAlert({
                title: "Brainbuddy",
                message: "Enter valid Email Address",
                leftBtn: "OK",
            });
        }
        else {
            Keyboard.dismiss();
            this.props.setIsLoading(true);
            this.props.loginUser(this.props.email, this.props.password)
                .then((res)=>{
                    
                    this.subscriptionCheckDone(false);   // while testing
                    // this.checkForSubscription();   // while release
                })
                .catch((err)=> {
                    this.props.setIsLoading(false);
                    if(err.Heading && err.status===401) {
                        showThemeAlert({
                            title: err.Heading.toString(),
                            message: err.Description.toString(),
                            leftBtn: "Try again",
                            leftPress: ()=>{
                            },
                            rightBtn: "Reset password",
                            rightPress: ()=>{
                                Linking.openURL("https://go.brainbuddyapp.com/forgot")
                                    .catch(err => {});
                            }
                        });
                    }else if(err.Heading && err.status===500){
                        showThemeAlert({
                            title: err.Heading.toString(),
                            message: err.Description.toString(),
                            leftBtn: "Try again",
                            leftPress: ()=>{
                            },
                        });
                    }else if(err.Heading && err.status===501){
                        showThemeAlert({
                            title: err.Heading.toString(),
                            message: err.Description.toString(),
                            leftBtn: "Try again",
                            leftPress: ()=>{
                            },
                        });
                    }else{
                        showThemeAlert({
                            title: "Brainbuddy",
                            message: "Something went wrong, Please try again",
                            leftBtn: "Try again",
                            leftPress: ()=>{
                            },
                        });
                    }
                });
        }
    };

    //Before enter to the root tab
    checkForSubscription = () => {
        loadAllProducts().then(res=>{
            restoreAllData()
                .then(res => {
                    checkForValidation()
                        .then(res=>{
                            this.subscriptionCheckDone(false);
                        }).catch(err=>{

                        //expired
                        Alert.alert("Subscription expired",
                            "Please renew your subscription to continue using Brainbuddy",
                            [
                                {text: 'Continue', onPress: () => {
                                    this.subscriptionCheckDone(true);
                                }},
                            ],
                        );
                    })
                })
                .catch(err => {
                    try{
                        if(err === "receipt_not_found") {
                            Alert.alert("Subscription required",
                                "Please subscribe to continue using Brainbuddy",
                                [
                                    {text: 'Continue', onPress: () => {
                                        this.subscriptionCheckDone(true);
                                    }},
                                ],
                            );
                            this.props.setIsLoading(false);
                        }else {
                            this.checkForSubscription();
                        }
                    }catch (e){
                        this.props.setIsLoading(false);
                    }
                    // Alert.alert("Subscription required",
                    //     "Please subscribe to continue using Brainbuddy",
                    //     [
                    //         {text: 'Continue', onPress: () => {
                    //             this.subscriptionCheckDone(true);
                    //         }},
                    //     ],
                    // );
                    // // Alert.alert("Failed to get your subscription details, please try again to continue using Brainbuddy");
                    // this.props.setIsLoading(false);
                    // //this.subscriptionCheckDone(false);
                })
        }).catch(err=>{
            // this.subscriptionCheckDone(false);
            this.props.setIsLoading(false);
            Alert.alert("Failed to get subscription details, please try again");
        })
    };

    subscriptionCheckDone = (isFailed) => {
        this.props.setIsLoading(false);
        let todayDate = moment().format("YYYY-MM-DD");
        let yesterdayDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
        let dayBeforeYesterdayDate = moment().subtract(2, 'days').format('YYYY-MM-DD');
        let i = 0;
        let isFound = false;
        while(i <= 5) {
            let date = moment().subtract(i, 'days').format('YYYY-MM-DD');
            if(_.find(this.props.p_array,{occurred_at: date}) !== undefined ){
                isFound = true;
                break;
            }
            i+=1;
        }
        if(this.props.last_checkup_at === todayDate ||
            this.props.last_checkup_at === yesterdayDate ||
            this.props.last_checkup_at === dayBeforeYesterdayDate || isFound) {
            if(isFailed){
                this.props.navigation.navigate("getStarted",{nextPage: "beforeBeginLogin"});
            }else{
                AsyncStorage.setItem("isWelcomeFlowCompleted",'true');
                this.props.navigation.navigate("beforeBeginLogin");
            }
        }else{
            //this.props.updateMetaData({
            //registered_at: moment().format("YYYY-MM-DD"),
            //last_checkup_at: moment().subtract(1, 'days').format('YYYY-MM-DD')
            //});
            if(isFailed){
                this.props.navigation.navigate("getStarted",{nextPage: "beforeBegin"});
            }else{
                AsyncStorage.setItem("isWelcomeFlowCompleted",'true');
                this.props.navigation.navigate("beforeBegin");
            }
        }
        //this.props.navigation.navigate("getStarted",{nextPage: "login"});
    };

    //on Reset Password
    onForgotPassword = () => {
        Linking.openURL("https://go.brainbuddyapp.com/forgot")
            .catch(err => {});
    };

//Email validation
    validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

//Focus on next field - onpress keyboard next
    focusNextField = (nextField) => {
        if(this.refs && this.refs[nextField]){
            this.refs[nextField].focus();
        }
    };

    // let label = "Account Login";
    // if(this.props.navigation.state.params){
    //     if(this.props.navigation.state.params.isOldUser){
    //         label = "Login to the new Brainbuddy";
    //     }
    // }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.titleFont}>
                    {"Account Login"}
                </Text>
                <View style={{left:0, right:0, top:Constant.screenHeight*0.2-11, bottom:0, position:'absolute',alignItems: 'center'}}>
                    <View style={ styles.outerTextView }>
                        <View style={ styles.iconView }>
                            <Ionicons name='ios-mail-outline' size={30} color={Constant.lightTheamColor}/>
                        </View>
                        <View style={{justifyContent:'center', flex: 1, marginLeft:20}}>
                            <TextInput  ref="txtEmail"
                                        value={this.props.email}
                                        keyboardType={'email-address'}
                                        placeholder={"Email"}
                                        placeholderTextColor={ Constant.lightTheamColor }
                                        style={ styles.textBox }
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        returnKeyType={'next'}
                                        maxLength={50}
                                        onChangeText={(text) => {this.props.emailChanged(text)}}
                                        onSubmitEditing={() => this.focusNextField('txtPassword')}
                                        underlineColorAndroid={Constant.transparent}
                            />
                        </View>
                    </View>
                    <View style={ styles.textBorder }/>
                    <View style={[styles.outerTextView,{marginTop: 26}]}>
                        <View style={ styles.iconView }>
                            <Ionicons name='ios-lock-outline' size={30} color={Constant.lightTheamColor}/>
                        </View>
                        <View style={{justifyContent:'center', flex: 1, marginLeft:20}}>
                            <TextInput ref="txtPassword"
                                       value={this.props.password}
                                       placeholder={"Password"}
                                       placeholderTextColor={ Constant.lightTheamColor }
                                       style={ styles.textBox }
                                       secureTextEntry={true}
                                       returnKeyType={"done"}
                                       blurOnSubmit={true}
                                       onChangeText={(text) => {this.props.passChanged(text);}}
                                       autoCapitalize="none"
                                       autoCorrect={false}
                                       maxLength={50}
                                       underlineColorAndroid={Constant.transparent}/>
                        </View>
                    </View>
                    <View style={ styles.textBorder }/>

                </View>

                <View style={{left:0, right:0, top:Constant.screenHeight*0.42,position:'absolute',alignItems: 'center'}}>
                    <Button title="Login"
                            backColor="rgb(255,180,0)"
                            color="#FFF"
                            otherStyle={{marginTop:0}}
                            otherTextStyle={{fontFamily: Constant.font700}}
                            onPress={this.onLoginPress}/>
                    <View style={{marginTop: 7, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={ styles.btnCreateAcc } onPress={() => {this.props.onSignUpPress()}}>
                            Create new account
                        </Text>
                        <Text style={{color: '#496e7e',fontSize: 15,padding:5,fontFamily: Constant.font500,}}>
                            or
                        </Text>
                        <Text style={ styles.btnCreateAcc } onPress={() => {this.onForgotPassword()}}>
                            reset password
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        email: state.user.email,
        password: state.user.password,
        isLoading: state.user.isLoading,
        last_checkup_at: state.metaData.metaData.last_checkup_at || "",
        p_array: state.statistic.pornDetail.p_array || []
    };
};

export default connect(mapStateToProps, {
    loginUser,
    emailChanged,
    passChanged,
    updateMetaData,
})(LoginComponent);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Constant.backColor,
        paddingTop: 40
    },
    titleFont:{
        color: '#FFFFFF',
        fontSize: 15,
        marginBottom: 60,
        fontFamily: Constant.font700,
    },
    textView:{
        backgroundColor: '#FFF'
    },
    btnFont:{
        color: '#FFFFFF',
        fontSize: 15,
        fontFamily: Constant.font700,
    },
    btnCreateAcc:{
        color: '#7999a7',
        fontSize: 15,
        paddingTop:10,
        paddingBottom:10,
        fontFamily: Constant.font500,
    },
    textBorder:{
        backgroundColor: Constant.lightTheamColor,
        height:1.5,
        alignSelf: 'center',
        width: Constant.screenWidth - 60
    },
    textBox:{
        color: '#FFFFFF',
        fontSize: 15,
        // fontWeight: '500',
        paddingBottom: 0,
        height:40,
        fontFamily: Constant.font500,
    },
    btnLogin:{
        marginTop: 30,
        marginLeft: 30,
        marginRight: 30,
        alignSelf: 'center',
        backgroundColor: 'rgb(255,180,0)',
        width: Constant.screenWidth - 60,
        alignItems: 'center',
        justifyContent: 'center',
        padding:17,
        borderRadius: 30
    },
    outerTextView:{
        marginLeft: 30,
        marginRight: 30,
        height: 40,
        flexDirection: 'row'
    },
    iconView:{
        justifyContent:'center',
        // flex: 1.5
    }
});