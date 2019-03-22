import React from 'react';
import {Platform, StatusBar, StyleSheet, AppState,
    Text, View, AsyncStorage, Alert, NetInfo,PushNotificationIOS,
    NativeEventEmitter, NativeModules} from 'react-native';
import Constant from '../helper/constant';
import InitialSplashView from '../screens/commonComponent/initialSplashScreen';
import { connect } from 'react-redux';
import {
    loginUser,loadDataAfterLogin, startLoading,
    setAskedForCheckupPopup, setIsNetworkAvailable,
    setDateforTodayOpen, manageStreakAchievedPopup,
    setSafeAreaIntent, managePopupQueue, manageAppBadgeCount
} from '../actions/userActions';
import { loadAllProducts,restoreAllData,checkForValidation } from '../helper/inAppPurchase';
import { showNoInternetAlert, showThemeAlert } from '../helper/appHelper';
import { getTeamChat } from '../actions/teamAction'
import _ from 'lodash';
import OneSignal from 'react-native-onesignal';
import moment from 'moment';
let isLogin = 'login';
console.disableYellowBox=true;
let isInitialView = true;
let AndroidNativeModule = NativeModules.AndroidNativeModule;
import {NavigationActions, StackActions} from "react-navigation";
import AppStatusBar from './commonComponent/statusBar';

class Main extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            isAppLoading:false,
            safeAreaInsets: {
                top:0, left: 0, bottom: 0, right: 0,
            },
        }
    }

    componentWillMount() {
        StatusBar.setHidden(false);
        const dispatchConnected = isConnected => {
            if(isConnected) {
                this.setAppMainView();
                NetInfo.isConnected.removeEventListener('connectionChange', dispatchConnected);
            }else{
                showNoInternetAlert();
            }
        };
        NetInfo.isConnected.fetch().then().done((isConnected) => {
            if(isConnected) {
                this.setAppMainView();
                // NetInfo.isConnected.removeEventListener('connectionChange', dispatchConnected);
            }else{
                showNoInternetAlert();
                NetInfo.isConnected.addEventListener('connectionChange', dispatchConnected);
            }
        });
    }

    componentDidMount() {
        OneSignal.inFocusDisplaying(2);
        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        // OneSignal.addEventListener('registered', this.onRegistered);
        OneSignal.addEventListener('ids', this.onIds);
    }

    componentWillUnmount() {
        // Remove event listener
        // AppState.removeEventListener('change', this._handleAppStateChange);
        // OneSignal.removeEventListener('received', this.onReceived);
        // OneSignal.removeEventListener('opened', this.onOpened);
        // OneSignal.removeEventListener('ids', this.onIds);
    }

    onReceived = (notification) => {
        this.managedBadge(notification.androidNotificationId || "");
        console.log("Notification received: ", notification);
    };

    onOpened = (openResult) => {
        // this.managedBadge(openResult.notification.androidNotificationId || "");
             //     console.log('Message: ', openResult.notification.payload.body);
        // console.log('Data: ', openResult.notification.payload.additionalData);
        // console.log('isActive: ', openResult.notification.isAppInFocus);
        // console.log('openResult: ', openResult);
    };

    onRegistered = (notifData) => {
        console.log("Device had been registered for push notifications!", notifData);
    };

    onIds = (device) => {
        console.log('Device info: ', device);
    };

    managedBadge = (id) => {
        this.props.getTeamChat(null, false);
        let totalCount = this.props.appBadgeCount + 1;
        this.props.manageAppBadgeCount(totalCount);
        // AsyncStorage.getItem('remoteNotificationIds').then((notificationId)=>{
        //    if(notificationId && notificationId !== "") {
        //        let ids = JSON.parse(notificationId);
        //        if(ids.indexOf(id) < 0){
        //            ids.push(id);
        //            this.props.manageAppBadgeCount(ids.length);
        //            let allId = JSON.stringify(ids);
        //            AsyncStorage.setItem('remoteNotificationIds',allId);
        //        }
        //    }else{
        //        let newId = [id];
        //        let allId = JSON.stringify(newId);
        //        this.props.manageAppBadgeCount(1);
        //        AsyncStorage.setItem('remoteNotificationIds',allId);
        //    }
        // });
    };

    setAppMainView = () => {
        // showNoInternetAlert(this.props.appTheme === Constant.lightTheme);
        let isFromWelcome = false;
        AsyncStorage.getItem('isWelcomeFlowCompleted')
            .then(isWelcome => {
                if(isWelcome){
                    isFromWelcome=false;
                    return AsyncStorage.getItem('user');
                }else{
                    isFromWelcome=true;
                    return AsyncStorage.getItem('isIntroScreenDone');
                }
            }).then(user => {
            if(isFromWelcome) {
                isLogin='welcome';
                if(user){
                    isLogin = 'welcomeBack';
                }
                return Promise.reject(false)
            }else{
                if(user) {
                    let userDetail = JSON.parse(user);
                    if(userDetail.email && userDetail.password) {
                        // this.props.loginUser(userDetail.email, userDetail.password);
                        this.props.loadDataAfterLogin();
                        return Promise.resolve(true);
                    }
                    return Promise.reject(false);
                }
                return Promise.reject(false);
            }
        }).then(res => {
            return AsyncStorage.getItem('secure');
        }).then(isPasscode => {
            isLogin= (isPasscode) && 'getPasscode' || "rootTabNavigation";
            // isLogin= (isPasscode) && 'getPasscode' || "beforeBeginToday";
            if(isLogin === "rootTabNavigation"){
                return AsyncStorage.getItem('isUserDetailSet');
            }else{
                return Promise.reject(false);
            }
        }).then(isUserDetail => {
            if(isUserDetail){
                return Promise.reject(false);
            }else{
                isLogin = "beforeBeginToday";
                return Promise.reject(false);
            }
        }).catch(err =>{
            AsyncStorage.setItem('isNewOpen',"true");
            this.manageAppListener();
            this.props.setDateforTodayOpen(false,true,true);
            if(err.status){
                // showNoInternetAlert();
            }
            AsyncStorage.getItem("AppInstallationDate").then(res=>{
                if(!res) {
                    AndroidNativeModule.getInstallDate((err)=>{
                    }, (val)=>{
                        try{
                            let date = new Date(parseInt(val));
                            if(date !== "Invalid Date"){
                                let installedDate = moment(date).format("YYYY-MM-DD");
                                AsyncStorage.setItem("AppInstallationDate", installedDate);
                            }
                        }catch (e){
                        }
                    });
                }
            });

            this.props.setAskedForCheckupPopup(false);
            this.props.startLoading(false);
            this.setState({isAppLoading:true});

            this.props.managePopupQueue({checkup: null,streakGoal: null,rewired: null, monthlyChallenge: null});
            let  showStreakGoalPopUp = this.props.showStreakGoalPopUp;
            showStreakGoalPopUp.isShow = false;
            showStreakGoalPopUp.inProcess = false;
            this.props.manageStreakAchievedPopup(showStreakGoalPopUp);

            if(Constant.isIOS){
                PushNotificationIOS.getApplicationIconBadgeNumber((n)=>{
                    this.props.manageAppBadgeCount(n);
                });
            }
            // AndroidNativeModule.isAppInDebug((err)=>{
            //     // alert(err)
            // }, (val)=>{
            //     // alert(val);
            // });
            AppState.addEventListener('change', this._handleAppStateChange);

            // alert(isLogin)
            // this.props.navigation.navigate(isLogin);

            this.props.navigation.dispatch(StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: isLogin, params: {transition: "fadeIn"}})],
            }));
        });
    };

    manageAppListener = () => {
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this.handleFirstConnectivityChange
        );
    };

    handleFirstConnectivityChange = (isConnected) => {
        if(this.props.isConnected !== isConnected){
            this.props.setIsNetworkAvailable(isConnected);
        }
    };

    //App State change - background to forground
    _handleAppStateChange = (nextAppState) => {
        if (nextAppState === 'active') {
            AsyncStorage.getItem('user').then(user=>{
                let userDetail = JSON.parse(user);
                if(userDetail.email && userDetail.password) {
                    if(this.props.isConnected){
                        // this.props.loginUser(userDetail.email, userDetail.password);
                        this.props.loadDataAfterLogin();
                    }
                }
            }).catch(err => {
                console.log(err);
            })
        }
    };

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <View style={[styles.container, {backgroundColor: appColor.appBackground}]}>
                <AppStatusBar backColor={appColor.appBackground}
                              hidden={false}
                              barStyle={appColor.statusBarStyle}/>
                {(!this.state.isAppLoading) &&
                <InitialSplashView/>
                || null
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constant.backColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
});

const mapStateToProps = state => {
    return {
        isConnected: state.user.isConnected,
        showStreakGoalPopUp: state.user.showStreakGoalPopUp,
        appBadgeCount: state.user.appBadgeCount,
        appTheme: state.user.appTheme
    };
};

export default connect(mapStateToProps, {
    loginUser,
    loadDataAfterLogin,
    startLoading,
    setIsNetworkAvailable,
    setAskedForCheckupPopup,
    setDateforTodayOpen,
    setSafeAreaIntent,
    managePopupQueue,
    manageStreakAchievedPopup,
    manageAppBadgeCount,
    getTeamChat
})(Main);