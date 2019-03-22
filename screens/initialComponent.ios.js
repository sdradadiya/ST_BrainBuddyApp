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
import {NavigationActions, StackActions} from "react-navigation";
// import { loadAllProducts,restoreAllData,checkForValidation } from '../helper/inAppPurchase';
import { showNoInternetAlert } from '../helper/appHelper';
import OneSignal from 'react-native-onesignal';
import SafeArea, {  SafeAreaInsets } from 'react-native-safe-area';
import { getTeamChat } from '../actions/teamAction'
import _ from 'lodash';
let isLogin = 'login';
console.disableYellowBox=true;
let bundleChecking = NativeModules.checkBundle;
let setBadgeValue = NativeModules.checkBundle;
let isInitialView = true;

class Main extends React.Component {

    constructor(props){
        super(props);
        this.state={
            isAppLoading:false,
            // safeAreaInsets: {
            //     top:0, left: 0, bottom: 0, right: 0,
            // },
        }
    }

    componentWillMount() {
        // AsyncStorage.getAllKeys().then(res=>{
        //     console.log("=================");
        //     console.log(res);
        //
        //     console.log("=================");
        //     console.log(JSON.stringify(res));
        //     console.log("=================");
        // })
        StatusBar.setHidden(false);
        const dispatchConnected = isConnected => {
            if(isConnected) {
                this.setAppMainView();
                NetInfo.isConnected.removeEventListener('connectionChange', dispatchConnected);
            }else{
                showNoInternetAlert();
            }
        };
        NetInfo.isConnected.fetch().then().done(() => {
            NetInfo.isConnected.addEventListener('connectionChange', dispatchConnected);
        });
        // PushNotificationIOS.setApplicationIconBadgeNumber(0);
        // PushNotificationIOS.getApplicationIconBadgeNumber((n)=>{
        //         this.props.manageAppBadgeCount(5);
        // })
    }

    componentWillUnmount() {
        // Remove event listener
        // SafeArea.removeEventListener('safeAreaInsetsForRootViewDidChange', this.onSafeAreaInsetsForRootViewChange)
    }

    componentDidMount() {
        // OneSignal.removeEventListener('received', this.onReceived);
        // OneSignal.removeEventListener('opened', this.onOpened);
        // OneSignal.removeEventListener('ids', this.onIds);
        OneSignal.setLocationShared(false);

        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        OneSignal.addEventListener('ids', this.onIds);
        AppState.addEventListener('change', this._handleAppStateChange);
        // SafeArea.addEventListener('safeAreaInsetsForRootViewDidChange', this.onSafeAreaInsetsForRootViewChange)
    }

    onReceived = (notification) => {
        //alert("call -received")
        console.log("---------Notification received: ", notification);
        let count = this.props.appBadgeCount + 1;
        this.props.manageAppBadgeCount(count);
        this.props.getTeamChat();
        PushNotificationIOS.setApplicationIconBadgeNumber(count);

        setBadgeValue.setBadgeCountInAppGroup(count,(error, events) => {
            console.log("call");
        });

        // if(this.props.appBadgeCount != 0) {
        //     let count = this.props.appBadgeCount + 1;
        //     this.props.manageAppBadgeCount(count);
        // }
    }

    onOpened = (openResult) => {
        //alert("call -opened")
        console.log("---------Notification onOpened: ", openResult);
        try{
            console.log('Message: ', openResult.notification.payload.body);
            console.log('Data: ', openResult.notification.payload.additionalData);
            console.log('isActive: ', openResult.notification.isAppInFocus);
            console.log('openResult: ', openResult);
        }catch (e){
            console.log('Error', e);
        }
    }

    onIds = (device) => {
        // console.log('Device info: ', device);
    }

    onSafeAreaInsetsForRootViewChange = this.onSafeAreaInsetsForRootViewChange.bind(this);

    onSafeAreaInsetsForRootViewChange(result: { safeAreaInsets: SafeAreaInsets }) {
        // const { safeAreaInsets } = result;
        // this.setState({ safeAreaInsets })
    }

    setSafeArea = () => {
        SafeArea.getSafeAreaInsetsForRootView()
            .then((result) => {
                let temp = {
                    top:(result.safeAreaInsets.top>0)?result.safeAreaInsets.top-20:result.safeAreaInsets.top,
                    bottom:result.safeAreaInsets.bottom,
                    left:result.safeAreaInsets.left,
                    right:result.safeAreaInsets.right
                };
                let obj = _.cloneDeep(temp);
                this.props.setSafeAreaIntent(obj);
                SafeArea.removeEventListener('safeAreaInsetsForRootViewDidChange', this.onSafeAreaInsetsForRootViewChange);
                // const { safeAreaInsets } = result;
                // this.setState({ safeAreaInsets })
            })
    };

    setAppMainView = () => {
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
                if(user) {
                    isLogin = 'welcomeBack';
                }
                return Promise.reject(false)
            }else{
                if(user) {
                    let userDetail = JSON.parse(user);
                    if(userDetail.email && userDetail.password) {
                        // this.props.loginUser(userDetail.email, userDetail.password);
                        // if (!__DEV__) {
                            this.props.loadDataAfterLogin();
                        // }
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
            if(isLogin == "rootTabNavigation"){
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
                showNoInternetAlert();
            }
            this.props.setAskedForCheckupPopup(false);
            this.setSafeArea();
            // if(isLogin == "rootTabNavigation" || isLogin == "login"){
            //     this.checkForSubscription();
            //     // this.props.startLoading(false);
            //     // this.setState({isAppLoading:true});
            //     // this.props.navigation.navigate(isLogin);
            // }else{
            //     bundleChecking.findEvents((error, events) => {
            //         this.props.startLoading(false);
            //         this.setState({isAppLoading:true});
            //         this.props.navigation.navigate(isLogin);
            //         // if (error) {
            //         //     this.props.startLoading(false);
            //         //     this.setState({isAppLoading:true});
            //         //     this.props.navigation.navigate(isLogin);
            //         // } else {
            //         //     let isUpdates = events.includes("54");
            //         //     if (isUpdates) {
            //         //         this.props.startLoading(false);
            //         //         this.setState({isAppLoading:true});
            //         //         this.props.navigation.navigate('login',{isOldUser: true});
            //         //     } else {
            //         //         this.props.startLoading(false);
            //         //         this.setState({isAppLoading:true});
            //         //         this.props.navigation.navigate(isLogin);
            //         //     }
            //         // }
            //     });
            // }
            bundleChecking.findEvents((error, events) => {
                // console.log("call");
            });
            bundleChecking.manageKeyboard(false);
            AsyncStorage.getItem("AppInstallationDate").then(res=>{
                if(!res) {
                    bundleChecking.installationDate((error, events) => {
                        AsyncStorage.setItem("AppInstallationDate", events);
                    });
                }
            });
            this.props.startLoading(false);
            this.setState({isAppLoading:true});

            this.props.managePopupQueue({checkup: null,streakGoal: null,rewired: null, monthlyChallenge: null});
            let  showStreakGoalPopUp = this.props.showStreakGoalPopUp;
            showStreakGoalPopUp.isShow = false;
            showStreakGoalPopUp.inProcess = false;
            this.props.manageStreakAchievedPopup(showStreakGoalPopUp);

            PushNotificationIOS.getApplicationIconBadgeNumber((n)=>{
                this.props.manageAppBadgeCount(n);
            });
            // this.props.navigation.navigate(isLogin);
            this.props.navigation.dispatch(StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: isLogin, params: {transition: "fadeIn"}})],
            }))
        });
    };

    manageAppListener = () => {
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this.handleFirstConnectivityChange
        );
    };

    handleFirstConnectivityChange = (isConnected) => {
        this.props.setIsNetworkAvailable(isConnected);
    };

    //App State change - background to forground
    _handleAppStateChange = (nextAppState) => {
        if (nextAppState === 'active') {
            AsyncStorage.getItem('user').then(user=>{
                let userDetail = JSON.parse(user);
                if(userDetail.email && userDetail.password) {
                    if(this.props.isConnected){
                        // this.props.loginUser(userDetail.email, userDetail.password);
                        // if (__DEV__) {
                        //     //No api call
                        // }else{
                            this.props.loadDataAfterLogin();
                        // }
                    }
                }
            }).catch(err => {
            })
        }
    };

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <View style={[styles.container, {backgroundColor: appColor.appBackground}]}>
                <StatusBar hidden={false} barStyle={appColor.statusBarStyle}/>
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