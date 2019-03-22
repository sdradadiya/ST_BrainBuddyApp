import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    AsyncStorage,
    TouchableHighlight,
    TouchableOpacity,
    StatusBar,
    Alert,
    AppState, PushNotificationIOS, Animated, NativeModules, NetInfo, BackHandler
} from 'react-native';
import TotalProgress from '../tabs/progress/component/totalProgress'
import Constant from '../../helper/constant';
import TodaysTitle from './component/todaysTitle';
import Routine from './component/routineComponent';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { setMorningRoutine, setCompletedMorningRoutine,
    onCompletedMorningRoutine, updateMetaData} from '../../actions/metadataActions';
import { goalCalculation, getCurrentClean } from '../../actions/statisticAction';
import {
    setCompletedExercises,
    loadDataAfterLogin,
    setUpLocalNotificationAlerts,
    setAskedForCheckupPopup,
    setSubscriptionInProcess,
    setRewiringPlayer,
    manageCheckupPopup,
    setDateforTodayOpen,
    manageRewiredProgressPopup,
    manageAchievedPopup,
    activeAppManagedTab,
    managedLetterAPI,
    managePopupQueue,
    manageStreakAchievedPopup,
    setDoneAPICallForToday,
    setIsNetworkAvailable,
    manageTodayInstances, manageRewiringPopup,
    manageAppBadgeCount, resetStoreData, logoutRedirect,
    manageMonthlyChallengePopup, tabChanged, sendTagOneSignal,
    manageMonthlyChallengeAchieved
} from '../../actions/userActions';
import CheckupTime from './component/checkupTime';
import LifeTree from './component/lifeTree';
import * as Animatable from 'react-native-animatable';
import _ from 'lodash';
import moment from 'moment';
import * as StoreReview from 'react-native-store-review';
import Rate, { AndroidMarket } from 'react-native-rate';
import InAppBilling from "react-native-billing";
import AppStatusBar from '../commonComponent/statusBar';
import { EventRegister } from 'react-native-event-listeners'
import {resetAllAsyncStorageData, showThemeAlert, getCurrentMonth} from "../../helper/appHelper";
import {NavigationActions, StackActions} from "react-navigation";

const iconImage = {
    exercise: require('../../assets/images/card-icon-exercise.png'),
    audioExercise: require('../../assets/images/card-icon-audio.png'),
    letterIcon:require('../../assets/images/card-icon-letter.png'),
    thoughtIcon:require('../../assets/images/card-icon-thought-control.png'),
    protectIcon:require('../../assets/images/card-icon-filter.png'),
    BrainIcon:require('../../assets/images/card-icon-brain-training_1.png'),
    pathIcon:require('../../assets/images/card-icon-choice.png'),
    storyCardIcon:require('../../assets/images/card-icon-story.png'),
    videoIcon:require('../../assets/images/card-icon-video.png'),
    visualizationIcon:require('../../assets/images/card-icon-imagine.png'),
    activityIcon:require('../../assets/images/card-icon-activity.png'),
    DidyouknowIcon:require('../../assets/images/card-icon-fact.png'),
    BreathingIcon:require('../../assets/images/card-icon-breathing.png'),
    StressIcon:require('../../assets/images/card-icon-zen.png'),
    KegalIcon:require('../../assets/images/card-icon-kegals.png'),
    morningIcon:require('../../assets/images/card-icon-morning.png'),
    EmotionalIcon:require('../../assets/images/card-icon-emotion.png'),
    MeditationIcon:require('../../assets/images/card-icon-meditation.png'),
    FaithIcon:require('../../assets/images/card-icon-faith.png'),
    JournalIcon:require('../../assets/images/card-icon-journal.png'),
    rThoughtControl: require('../../assets/images/card_icon_circles/icon-circle-thought-control.png'),
    rChoosePath: require('../../assets/images/card_icon_circles/icon-circle-choose.png'),
    rVisualize: require('../../assets/images/card_icon_circles/icon-circle-visualize.png'),
    rMeditation: require('../../assets/images/card_icon_circles/icon-circle-meditation.png'),
    rStress: require('../../assets/images/card_icon_circles/icon-circle-stress-relief.png'),
    rStory: require('../../assets/images/card_icon_circles/icon-circle-story.png'),
    rBrainTraining: require('../../assets/images/card_icon_circles/icon-circle-brain-training.png'),
    rEmotional: require('../../assets/images/card_icon_circles/icon-circle-emotion.png'),
    rAboutYou: require('../../assets/images/card-icon-profile.png'),
    monthlyIcons : [
        require('../../assets/images/monthly_challenge_card_icons/card-icon-challenge-jan.png'),
        require('../../assets/images/monthly_challenge_card_icons/card-icon-challenge-feb.png'),
        require('../../assets/images/monthly_challenge_card_icons/card-icon-challenge-mar.png'),
        require('../../assets/images/monthly_challenge_card_icons/card-icon-challenge-apr.png'),
        require('../../assets/images/monthly_challenge_card_icons/card-icon-challenge-may.png'),
        require('../../assets/images/monthly_challenge_card_icons/card-icon-challenge-jun.png'),
        require('../../assets/images/monthly_challenge_card_icons/card-icon-challenge-jul.png'),
        require('../../assets/images/monthly_challenge_card_icons/card-icon-challenge-aug.png'),
        require('../../assets/images/monthly_challenge_card_icons/card-icon-challenge-sep.png'),
        require('../../assets/images/monthly_challenge_card_icons/card-icon-challenge-oct.png'),
        require('../../assets/images/monthly_challenge_card_icons/card-icon-challenge-nov.png'),
        require('../../assets/images/monthly_challenge_card_icons/card-icon-challenge-dec.png')],
};

const allOptionalExercies = {
    lettersToYourSelf: {
        Icon: iconImage.letterIcon,
        title: "Write Your Letter",
        desc: "",
        pageName: 'lettersToYourSelf',
        improve: [{"Wisdom": 1}]
    },
    stressRelief: {
        Icon: iconImage.StressIcon,
        title: "Stress Relief",
        desc: "Stay calm and in control",
        pageName: 'stressRelief',
        improve: [{"Stress": 1}]
    },
    chooseYourPathActivity: {
        Icon: iconImage.pathIcon,
        title: "Choose your path",
        desc: "Remember what you want",
        pageName: 'chooseYourPathActivity',
        improve: [{"Wisdom": 1}]
    },
    visualizationActivity: {
        Icon: iconImage.visualizationIcon,
        title: "Visualize",
        desc: "Imagine a porn-free day",
        pageName:   'visualizationActivity',
        improve: [{"Dopamine": 1}]
    },
    thoughtActivity: {
        Icon: iconImage.thoughtIcon,
        title: "Thought Control",
        desc: "Master your mind",
        pageName: 'thoughtActivity',
        improve: [{"Hypofrontality": 1}]
    },
    protectDeviceActivity: {
        Icon: iconImage.protectIcon,
        title: "Protect your devices",
        desc: "Safeguard your phone",
        isIcon: false,
        pageName: '',
        improve: []
    },
    audioActivity: {
        Icon: iconImage.audioExercise,
        title: "Audio Exercise",
        desc: "Rewire your brain",
        pageName: 'audioActivity',
        improve: [{"Wisdom": 1}]
    },
    brainActivity: {
        Icon: iconImage.BrainIcon,
        title: "Brain Training",
        desc: "Reprogram your brain",
        pageName: 'brainActivity',
        improve: [{"Dopamine": 1}]
    },
    storyDetail: {
        Icon: iconImage.storyCardIcon,
        title: "Story",
        desc: "How life can change",
        pageName: 'storyDetail',
        improve: [{"Wisdom": 1}]
    },
    healthyActivity: {
        Icon: iconImage.activityIcon,
        title: "Healthy Activity",
        desc: "Positive dopamine release",
        pageName: 'healthyActivity',
        improve: [{"Dopamine": 1}]
    },
    didYouKnow: {
        Icon: iconImage.DidyouknowIcon,
        title: "Did you know?",
        desc: "The downside of pornography",
        pageName: 'didYouKnow',
        improve: [{"Wisdom": 1}]
    },
    breathingActivity: {
        Icon: iconImage.BreathingIcon,
        title: "Breathing Practice",
        desc: "Awareness and self-control",
        pageName: "breathingActivity",
        improve: [{"Stress":1}]
    },
    kegalsActivity: {
        Icon: iconImage.KegalIcon,
        title: "Kegal Exercise",
        desc: "Improve erection quality",
        pageName: "kegalsActivity",
        improve: []
    },
    emotionalActivity: {
        Icon: iconImage.EmotionalIcon,
        title: "Emotional Growth",
        desc: "Focus on real love",
        pageName: "emotionalActivity",
        improve: [{"Dopamine":1}]
    },
    medicationActivity: {
        Icon: iconImage.MeditationIcon,
        title: "Meditation",
        desc: "Improve hypofrontality and self-control",
        pageName: "medicationActivity",
        improve: [{"Hypofrontality": 3}, {"Stress":1}]
    },
    faithActivity: {
        Icon: iconImage.FaithIcon,
        title: "Scripture",
        desc: "Faith and trust",
        pageName: "faithActivity",
        improve: []
    },
    journalActivity: {
        Icon: iconImage.JournalIcon,
        title: "Write in your journal",
        desc: "Externalize your thoughts",
        pageName: "journalActivity",
        improve: []
    },
    aboutYouActivity: {
        Icon: iconImage.rAboutYou,
        title: "About You",
        desc: "Complete your psychology profile",
        pageName: "aboutYouActivity",
        improve: []
    },
    monthlyChallenge: {
        Icon: iconImage.monthlyIcons[new Date().getMonth()],
        title: "Challenge",
        desc: "Go clean every day this month",
        pageName: "monthlyChallenge",
        improve: [],
    }
};
const allMorningRoutine = {
    rThoughtControl: {
        icon:iconImage.rThoughtControl,
        name:"Thought control",
        endicon:'',
        pageName: 'thoughtActivity',
        activityTime: 2,
        improve: [{"Hypofrontality": 1}]
    },
    rChoosePath: {
        icon:iconImage.rChoosePath,
        name: "Choose your path",
        endicon:'',
        pageName: 'chooseYourPathActivity',
        activityTime: 1,
        improve: [{"Wisdom": 1}]
    },
    rVisualize: {
        icon:iconImage.rVisualize,
        name:"Visualize",
        endicon:'',
        pageName: 'visualizationActivity',
        activityTime: 2,
        improve: [{"Dopamine": 1}]
    },
    rMeditation: {
        icon:iconImage.rMeditation,
        name:"Meditation",
        endicon:'',
        pageName: 'medicationActivity',
        activityTime: 10,
        improve: [{"Hypofrontality": 3}, {"Stress":1}]
    },
    rStress: {
        icon:iconImage.rStress,
        name:"Stress relief",
        endicon:'',
        pageName: 'stressRelief',
        activityTime: 2,
        improve: [{"Stress":1}]
    },
    rStory: {
        icon:iconImage.rStory,
        name:"Story",
        endicon:'',
        pageName: 'storyDetail',
        activityTime: 3,
        improve: [{"Wisdom": 1}]
    },
    rEmotional: {
        icon:iconImage.rEmotional,
        name:"Emotional growth",
        endicon:'',
        pageName: 'emotionalActivity',
        activityTime: 2,
        improve: [{"Dopamine": 1}]
    },
    rBrainTraining: {
        icon:iconImage.rBrainTraining,
        name:"Brain training",
        endicon:'',
        pageName: 'brainActivity',
        activityTime: 3,
        improve: [{"Dopamine": 1}]
    },
};
let isToday = true;
let isPopupInProcess = false;
let isActivityPushed = false;
let isRedirectToLogin = false;
let NativeCallback = NativeModules.AndroidNativeModule;

class TodayPage extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
            flag:false,
            checkUpFlag: 1, // 1 means now
            checkUpTime: '6pm',
            todayTitle: "TODAY",
            morningRoutine:[],
            optionalExercies: [],
            checkupTimeMessage: "",
            visibleTab: props.visibleTab || "today",
            totalMorningRoutineTimes: "",
            gender:props.gender,
            isAllMorningRoutineDone: false,
            isAudioActivity: false,
            viewCompleted: false,
            appState: AppState.currentState,
            queue: props.popupQueue,
            isTodayTab: true,
            streakData: null,
            monthlyChallenge: allOptionalExercies.monthlyChallenge || {},
            isShowMonthlyChallenge: false
        };
        isPopupInProcess = false;
    };

    componentWillUnmount () {
        EventRegister.removeEventListener(this.listener);
        EventRegister.removeEventListener(this.redirectToLogin);
        AppState.removeEventListener('change', this._handleAppStateChange);
        BackHandler.removeEventListener('hardwareBackPress', this._handleBackPress);
    }

    componentWillMount () {
        isRedirectToLogin = false;
        StatusBar.setHidden(false);
        this.setMorningRoutine();
        this.props.setSubscriptionInProcess(false);
        AppState.removeEventListener('change', this._handleAppStateChange);
        isToday = true;
        BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
        isPopupInProcess = false;
        isActivityPushed = false;
        this.manageMonthlyChalange();
    }

    componentDidMount () {
        AsyncStorage.setItem('isCheckupClicked',"false");
        AppState.removeEventListener('change', this._handleAppStateChange);
        AppState.addEventListener('change', this._handleAppStateChange);
        AsyncStorage.getItem('isNewOpen').then((isNewOpen)=>{
            if(isNewOpen) {
                if(isNewOpen === "true") {
                    // if(!__DEV__){
                    this.checkForSubscription();  // While release
                    // }
                }
                AsyncStorage.setItem('isNewOpen',"false");
            }
        });
        this.setWhenComponentMount(false,null,null,false);
        this.props.getCurrentClean().then(res=>{
            this.managePopup(true, null, null, res, this.props);
        });
        this.setLastCheckupDate();
        this.setTimezone();
        EventRegister.removeEventListener(this.listener);
        this.listener = EventRegister.addEventListener('isTodayEventListener', (data) => {
            this.setState({
                isTodayTab: data
            },()=>{
                if(data){
                    this.managePopup(true, 'today', true, null, this.props);
                }
            });
        });
        EventRegister.removeEventListener(this.redirectToLogin);
        this.redirectToLogin = EventRegister.addEventListener('RedirectToLogin', () => {
            if(!isRedirectToLogin){
                isRedirectToLogin = true;
                this.props.resetStoreData();
                resetAllAsyncStorageData();
                this.props.logoutRedirect();
            }
        });
        this.props.sendTagOneSignal();
    }

    componentWillReceiveProps (nextProps) {
        if(this.state.visibleTab !== nextProps.visibleTab){
            this.setState({
                visibleTab: nextProps.visibleTab
            });
        }
        AsyncStorage.getItem('isTodayActivityChanged').then((isChanged)=>{
            if(isChanged){
                if(isChanged === "true"){
                    this.setOptionalActivities();
                    this.setMorningRoutine();
                }
                AsyncStorage.setItem('isTodayActivityChanged',"false");
            }
        });
        this.setCheckupView();
        this.setDayTitle();
        if(this.state.gender !== nextProps.gender){
            this.setState({
                gender:nextProps.gender,
            });
        }
        this.setMorningRoutineLabel();

        let insideIf = false;
        if(JSON.stringify(this.props) !== JSON.stringify(nextProps)){
            // this.showPopUponToday(false, true);
            if(this.props.last_checkup_at !== nextProps.last_checkup_at ||
                JSON.stringify(this.state.queue) !== JSON.stringify(nextProps.popupQueue)||
                JSON.stringify(this.props.p_array) !== JSON.stringify(nextProps.p_array) ||
                JSON.stringify(this.props.showStreakGoalPopUp) !== JSON.stringify(nextProps.showStreakGoalPopUp) ||
                JSON.stringify(this.props.showRewindProgressPopUp) !== JSON.stringify(nextProps.showRewindProgressPopUp) ||
                JSON.stringify(this.props.currentGoal) !== JSON.stringify(nextProps.currentGoal) ||
                (this.state.visibleTab !== "today" && nextProps.visibleTab === "today")
            ){
                insideIf = true;
                setTimeout(()=>{
                    this.managePopup(false, nextProps.visibleTab, null,
                        {cleanDays: nextProps.current_p_clean_days,goal: nextProps.currentGoal.goalDays }, nextProps);
                },100);
                this.manageMonthlyChalange();
            }
        }
        if(JSON.stringify(this.state.queue) !== JSON.stringify(nextProps.popupQueue)){
            this.setState({
                queue: nextProps.popupQueue
            });
            if(!insideIf){
                // setTimeout(()=>{
                //     this.managePopup(false, nextProps.visibleTab);
                // },300);
            }
        }
        //Ask for rate popup
        AsyncStorage.getItem('isTodayCheckUpDone').then((isDone)=>{
            if(isDone && isDone === "true") {
                this.askForRatePopup();
                AsyncStorage.setItem('isTodayCheckUpDone',"false");
            }
        });
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     if(JSON.stringify(this.props) !== JSON.stringify(nextProps) || JSON.stringify(this.state) !== JSON.stringify(nextState)){
    //         // return true;
    //         return this.state.isTodayTab
    //     }else {
    //         return isActivityPushed;
    //     }
    // }

    _handleBackPress = () => {
        return isToday && (this.props.visibleTab === "today");
    };

    _handleAppStateChange = (nextAppState) => {
        isPopupInProcess=false;
        if(nextAppState === "active"){
            this.props.getCurrentClean().then(res=>{
                this.checkIsNeedToShowPopup(res.cleanDays, res.goal);
            }).catch(err=>{
                this.setWhenComponentMount(true);
            });
            this.props.activeAppManagedTab();
            this.props.managedLetterAPI();
            this.props.goalCalculation();
            AsyncStorage.setItem('isCheckupClicked',"false");
            if(Constant.isIOS){
                PushNotificationIOS.getApplicationIconBadgeNumber((n)=>{
                    this.props.manageAppBadgeCount(n);
                })
            }
            this.props.sendTagOneSignal();
        }else if(nextAppState === "background"){
            this.setState({
                streakData: this.props.showStreakGoalPopUp
            });
            this.props.setAskedForCheckupPopup(false);
            this.hideAlltodaysPopup();
        }
        this.setState({appState: nextAppState});
    };

    //Hide all open popup while app will enter in background or go to getStarted
    hideAlltodaysPopup = () => {
        this.props.setDateforTodayOpen(false,true,true);
        let objStreak = {
            isShow: false,
            achivedGoal: this.props.showStreakGoalPopUp.achivedGoal,
            displayDate: this.props.showStreakGoalPopUp.displayDate,
            whileGoal: this.props.showStreakGoalPopUp.whileGoal,
            inProcess: false
        }
        this.props.manageStreakAchievedPopup(objStreak);
        this.props.manageRewiredProgressPopup(false, true);
        this.props.managePopupQueue({checkup: null,streakGoal: null,rewired: null, monthlyChallenge: null});
        this.props.manageCheckupPopup({
            isShow: false,
            checkUpDetail: {}
        });
        isPopupInProcess=false;
    };

    //Rate popup -> call is says today is porn free day
    askForRatePopup = () => {
        if(this.props.current_p_clean_days > 30) {
            AsyncStorage.getItem("AppInstallationDate").then(res=>{
                if(res) {
                    let iDate = moment(res, 'YYYY-MM-DD').toDate();
                    let diff = moment().diff(iDate, 'days');
                    if(diff >= 2){
                        AsyncStorage.getItem("isAskToGiveRate").then(isAsk=>{
                            if(isAsk === null || isAsk !== "true") {
                                // alert("Ask for rate popup")
                                if(Constant.isIOS){
                                    if (StoreReview.isAvailable) {
                                        StoreReview.requestReview();
                                        AsyncStorage.setItem("isAskToGiveRate","true");
                                    }
                                }else{
                                    showThemeAlert({
                                        title: "Enjoying Brainbuddy?",
                                        message: "Please take a moment to leave a review.",
                                        leftBtn: "Never ask again",
                                        leftPress: ()=>{
                                        },
                                        rightBtn: "Review now",
                                        rightPress: ()=>{
                                            let options = {
                                                GooglePackageName:"com.brainbuddy.android",
                                                preferredAndroidMarket: AndroidMarket.Google,
                                                preferInApp:false,
                                            };
                                            Rate.rate(options, (success)=>{
                                                if (success) {
                                                    //rated
                                                }
                                            });
                                        },
                                        isLightTheme: this.props.appTheme === Constant.lightTheme
                                    });
                                    AsyncStorage.setItem("isAskToGiveRate","true");
                                }
                            }
                        }).catch(err=>{
                            if (__DEV__) { alert(err) }
                        });
                    }
                }
            }).catch(err=>{
                if (__DEV__) { alert(err) }
            });
        }
    }

    //connection change
    manageConnectionChangeListener = () => {
        NetInfo.isConnected.removeEventListener(
            'connectionChange',
            this.handleFirstConnectivityChange
        );
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this.handleFirstConnectivityChange
        );
        NetInfo.isConnected.fetch().then(isConnected => {
            this.handleFirstConnectivityChange(isConnected)
        });
    };

    handleFirstConnectivityChange = (isConnected) => {
        this.props.setIsNetworkAvailable(isConnected);
    };

    setWhenComponentMount = (isActive = false, visibleTab = null, isTodayTab = null, isCallPopup = true) => {
        this.manageConnectionChangeListener();
        this.props.setSubscriptionInProcess(false);
        this.setCheckupView();
        this.setDayTitle();
        this.setMorningRoutine();
        this.setOptionalActivities();
        if(this.props.navigation.state.params){
            if(this.props.navigation.state.params.isFadeToday){
                if(!isActive) {
                    this.makeFadeInAnimation();
                }
            }
        }else{
            if(this.props.navigation.state){
                if(this.props.navigation.state.isFadeToday){
                    if(!isActive){
                        this.makeFadeInAnimation();
                    }
                }
            }
        }
        this.props.setUpLocalNotificationAlerts();
        if(isCallPopup){
            // setTimeout(()=>{
            this.managePopup(isActive, visibleTab, isTodayTab, null, this.props);
            // }, 100);
        }

        this.setAllUpdatedData();
    };

    makeFadeInAnimation = () => {
        if(this.refs.mainView) {
            this.refs.mainView.fadeIn(200);
        }
    };

    checkIsNeedToShowPopup = (cleanDays, goal) => {
        //Streak goal
        let showStreakGoalPopUp = this.state.streakData;
        let currentClean = cleanDays;
        if(currentClean != 0 && !showStreakGoalPopUp.inProcess && !showStreakGoalPopUp.isShow) {
            if(currentClean == 1 || currentClean == 3 || currentClean == 7 || currentClean == 14 ||
                currentClean == 30 || currentClean == 90 || currentClean == 365) {
                let today = new Date().toDateString();
                if(showStreakGoalPopUp.achivedGoal != currentClean) {
                    if(showStreakGoalPopUp.displayDate === today && showStreakGoalPopUp.whileGoal === goal){
                        //do nothing
                    }else {
                        this.props.navigation.navigate('Today');
                        this.props.tabChanged("today");
                        this.setWhenComponentMount(true, 'today', true);
                        this.setState({
                            isTodayTab: true
                        });
                        return;
                    }
                }
            }
        }

        //Rewired
        let obj = this.props.showRewindProgressPopUp;
        let diff = obj.rewindDetail.totalRewiringPercentage - obj.rewindDetail.prevProgress;
        if(diff !== 0 && (diff%10 === 0) && !obj.isShow) {
            this.props.navigation.navigate('Today');
            this.props.tabChanged("today");
            this.setWhenComponentMount(true, 'today', true);
            this.setState({
                isTodayTab: true
            })
            return;
        }
        let currentHour = new Date().getHours();
        let checkupHour = this.props.checkupTime;
        if (currentHour >= checkupHour && this.props.last_checkup_at !== moment().format("YYYY-MM-DD")) {
            this.props.navigation.navigate('Today');
            this.props.tabChanged("today");
            this.setWhenComponentMount(true, 'today', true);
            this.setState({
                isTodayTab: true
            })
            return;
        }
        this.setWhenComponentMount(true);
    }

    managePopup = (isActive = false, visibleTab = null, isTodayTab = null, goalData = null, nextProps = null) => {
        if(nextProps == null){
            nextProps = this.props;
        }
        if(!isPopupInProcess) {
            isPopupInProcess=true;
            if(visibleTab == null){
                visibleTab = nextProps.visibleTab;
            }
            if(isTodayTab === null){
                isTodayTab = this.state.isTodayTab;
            }
            if ((this.state.appState === 'active' || isActive) && visibleTab === "today" && nextProps.popupQueue.checkup === null &&
                nextProps.popupQueue.streakGoal === null && nextProps.popupQueue.rewired === null
                && (nextProps.popupQueue.monthlyChallenge === undefined || nextProps.popupQueue.monthlyChallenge === null) && isTodayTab) {
                let checkupDate = nextProps.last_checkup_at;
                let date = new Date().toDateString();
                let objFirstAsk = nextProps.isOpenFirstTime;
                let currentHour = new Date().getHours();
                let checkupHour = nextProps.checkupTime;
                let todayDate = moment().format("YYYY-MM-DD");
                let yesterdayDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
                let dayBeforeYesterdayDate = moment().subtract(2, 'days').format('YYYY-MM-DD');

                if (objFirstAsk.isNewOpen || isActive) {
                    // if (currentHour < checkupHour) {
                    if (nextProps.last_checkup_at === yesterdayDate
                        || nextProps.last_checkup_at === todayDate || nextProps.last_checkup_at === ""
                        || nextProps.last_checkup_at === null) {
                    } else {
                        if (nextProps.last_checkup_at === dayBeforeYesterdayDate) {
                            if (_.find(nextProps.p_array, {occurred_at: yesterdayDate}) === undefined
                                && nextProps.popupQueue.checkup == null) {
                                nextProps.manageCheckupPopup({
                                    isShow: true,
                                    checkUpDetail: {
                                        title: this.getGreetingMessage() + nextProps.userName,
                                        alertMessage: "You missed your checkup yesterday.",
                                        buttonTitle: "Complete now",
                                        closeText: "",
                                        pageName: "checkUp",
                                        scrollToTopToday: this.scrollToTopToday,
                                        isYesterday: true
                                    }
                                });
                                nextProps.setDateforTodayOpen(false, false);
                                isPopupInProcess=false;
                                return;
                            }
                            nextProps.setDateforTodayOpen(false, false);
                        } else {
                            if (objFirstAsk.date === date && objFirstAsk.isAskForUpdateCalendar) {
                                // if(isActive){
                                //     if (_.find(nextProps.p_array, {occurred_at: todayDate}) === undefined &&
                                //         _.find(nextProps.p_array, {occurred_at: yesterdayDate}) === undefined &&
                                //         _.find(nextProps.p_array, {occurred_at: dayBeforeYesterdayDate}) === undefined) {
                                //         nextProps.manageCheckupPopup({
                                //             isShow: true,
                                //             checkUpDetail: {
                                //                 title: "Welcome back " + nextProps.userName,
                                //                 alertMessage: "Take a moment to update your calendar.",
                                //                 buttonTitle: "Update calendar",
                                //                 closeText: "Update later",
                                //                 pageName: "editPornCalendar"
                                //             }
                                //         });
                                //     }
                                //     nextProps.setDateforTodayOpen(true, false);
                                //     return;
                                // }
                            } else {
                                if (_.find(nextProps.p_array, {occurred_at: todayDate}) === undefined &&
                                    _.find(nextProps.p_array, {occurred_at: yesterdayDate}) === undefined &&
                                    _.find(nextProps.p_array, {occurred_at: dayBeforeYesterdayDate}) === undefined &&
                                    nextProps.popupQueue.checkup == null) {
                                    nextProps.manageCheckupPopup({
                                        isShow: true,
                                        checkUpDetail: {
                                            title: "Welcome back " + nextProps.userName,
                                            alertMessage: "Take a moment to update your calendar.",
                                            buttonTitle: "Update calendar",
                                            closeText: "Update later",
                                            pageName: "editPornCalendar"
                                        }
                                    });
                                }
                                nextProps.setDateforTodayOpen(true, false);
                                isPopupInProcess=false;
                                return;
                            }
                        }
                    }
                    // }
                    nextProps.setDateforTodayOpen(objFirstAsk.isAskForUpdateCalendar, false);
                }

                //Streak goal
                if(nextProps.popupQueue.checkup === null) {
                    let showStreakGoalPopUp = nextProps.showStreakGoalPopUp;
                    let currentClean = nextProps.current_p_clean_days;
                    let goalDays = nextProps.currentGoal.goalDays;
                    if(goalData !== null){
                        currentClean = goalData.cleanDays;
                        goalDays = goalData.goal;
                    }
                    if(currentClean != 0 && !showStreakGoalPopUp.inProcess && !showStreakGoalPopUp.isShow) {
                        if(currentClean == 1 || currentClean == 3 || currentClean == 7 || currentClean == 14 ||
                            currentClean == 30 || currentClean == 90 || currentClean == 365) {
                            let today = new Date().toDateString();
                            if(showStreakGoalPopUp.achivedGoal != currentClean) {
                                if(showStreakGoalPopUp.displayDate === today && showStreakGoalPopUp.whileGoal === goalDays){
                                    //do nothing
                                }else {
                                    let displayObj = {};
                                    let popupQueueObj = nextProps.popupQueue;
                                    popupQueueObj.streakGoal = true;
                                    nextProps.managePopupQueue(popupQueueObj);
                                    let  obj = {
                                        isShow: true,
                                        achivedGoal: currentClean,
                                        displayDate: today,
                                        inProcess: true,
                                        whileGoal: goalDays
                                    }
                                    nextProps.manageStreakAchievedPopup(obj);
                                    isPopupInProcess=false;
                                    return;
                                }
                            }
                        }
                    }
                }

                //Rewired
                if(nextProps.popupQueue.streakGoal === null && nextProps.popupQueue.checkup === null) {
                    let obj = nextProps.showRewindProgressPopUp;
                    let diff = obj.rewindDetail.totalRewiringPercentage - obj.rewindDetail.prevProgress;
                    if(diff !== 0 && (diff%10 === 0) && !obj.isShow) {
                        nextProps.manageRewiredProgressPopup(true);
                        isPopupInProcess=false;
                        return;
                    }
                }

                //Monthly Challenge
                let currentDate = new Date().getDate();
                if(currentDate == 1) {
                    if(nextProps.popupQueue.streakGoal === null && nextProps.popupQueue.checkup === null
                        && (nextProps.popupQueue.monthlyChallenge === undefined || nextProps.popupQueue.monthlyChallenge === null)) {

                        let currentMonth = new Date().getMonth();
                        let currentYear = new Date().getFullYear();
                        let prevMonth = currentMonth - 1;
                        if(currentMonth == 0){
                            prevMonth = 11;  //December
                            currentYear = currentYear - 1;
                        }
                        if(nextProps.clean_p_days_per_month && nextProps.clean_p_days_per_month[currentYear.toString()] &&
                            nextProps.clean_p_days_per_month[currentYear.toString()]["monthArr"]){
                            let lastMonth = nextProps.clean_p_days_per_month[currentYear.toString()]["monthArr"][prevMonth];
                            if(lastMonth == 100){
                                if(nextProps.monthlyChallengeAchived && nextProps.monthlyChallengeAchived.month != prevMonth &&
                                    nextProps.monthlyChallengeAchived.year != currentYear) {
                                    nextProps.manageMonthlyChallengeAchieved({
                                        month: prevMonth,
                                        year: currentYear,
                                        showDate: moment().format("YYYY-MM-DD")
                                    });
                                    nextProps.manageMonthlyChallengePopup({
                                        isShow: true,
                                        monthlyDetail: {
                                            year: currentYear,
                                            month: prevMonth,
                                            description: "Challenge won",
                                            title: "Clean " + getCurrentMonth(prevMonth),
                                            iconType: "Y",
                                            progressPer: "100%",
                                            actualProgress: "Progress - 100%",
                                            type: 'rewiring',
                                            isAchieved: true
                                        }
                                    });
                                    isPopupInProcess=false;
                                    return;
                                }
                            }
                        }
                    }
                }

                if (currentHour >= checkupHour) {
                    if (!nextProps.isAskForCheckup && nextProps.popupQueue.streakGoal === null && nextProps.popupQueue.checkup === null
                        && (nextProps.popupQueue.monthlyChallenge === undefined || nextProps.popupQueue.monthlyChallenge === null)) {
                        if (nextProps.last_checkup_at !== todayDate) {
                            nextProps.manageCheckupPopup({
                                isShow: true,
                                checkUpDetail: {
                                    title: this.getGreetingMessage() + nextProps.userName,
                                    alertMessage: "It's time for your checkup.",
                                    buttonTitle: "Begin",
                                    closeText: "Checkup later",
                                    pageName: "checkUp",
                                    scrollToTopToday: this.scrollToTopToday,
                                }
                            });
                            nextProps.setAskedForCheckupPopup(true);
                            isPopupInProcess=false;
                            return;
                        }
                    }
                }
            }
            isPopupInProcess=false;
        }
    }

    setAllUpdatedData = () => {
        if(this.props.todayViewInstance !== null){
            clearInterval(this.props.todayViewInstance);
        }
        let instance = setInterval(()=> {
            let currentHour = new Date().getHours();
            if(currentHour === 0) {
                let today = new Date().toDateString();
                if(this.props.dateForAPICall !== today) {
                    this.props.setDoneAPICallForToday().then(res=> {
                        this.props.loadDataAfterLogin().then((res) => {
                            this.props.setUpLocalNotificationAlerts();
                            setTimeout(()=>{
                                this.managePopup();
                            },400);
                        }).catch((err) => {
                        });
                        this.setMorningRoutine();
                        this.setOptionalActivities();
                    })
                }
                this.props.goalCalculation(true);
            }else{
                this.props.goalCalculation();
            }
            this.managePopup();
        }, 10000);
        this.props.manageTodayInstances(instance);
    };

    setDayTitle = () => {
        let todayDate = moment().format("YYYY-MM-DD");
        let today = new Date().getDay();
        this.setState({
            todayTitle: (today === 0) ? (this.props.registered_at === todayDate) ? "SUNDAY" : "REST DAY" : "TODAY"
        });
    };

    manageMonthlyChalange = () => {
        let todayDate = new Date().getDate();
        if(todayDate == 1) {
            let todayDate = moment().format("YYYY-MM-DD");
            let todayObj = _.find(this.props.p_array, {occurred_at: todayDate});
            if(todayObj != undefined && todayObj.is_relapse){
                this.setState({
                    isShowMonthlyChallenge: false,
                });
            }else{
                let objMonthlyChallenge = this.state.monthlyChallenge;
                objMonthlyChallenge.title = getCurrentMonth() + " challenge";
                objMonthlyChallenge.Icon = iconImage.monthlyIcons[new Date().getMonth()];
                this.setState({
                    monthlyChallenge: objMonthlyChallenge,
                    isShowMonthlyChallenge: true,
                });
            }
        }
    }

    onSelectMonthlyChallenge = (obj) => {
        this.props.manageMonthlyChallengePopup({
            isShow: true,
            monthlyDetail: {
                year: new Date().getFullYear(),
                month: new Date().getMonth(),
                description: "Report a clean day every day this month to win this achievement.",
                title: getCurrentMonth() + " challenge",
                iconType: "Y",
                progressPer: "4%",
                actualProgress: "Progress - 0%",
                type: 'today',
            }
        });
    }

    setMorningRoutine = () => {
        let today = new Date().getDay();
        let morningRoutine = [];
        let todayDate = moment().format("YYYY-MM-DD");
        if(this.props.registered_at === todayDate) {
            morningRoutine=[
                allMorningRoutine.rChoosePath,
                allMorningRoutine.rBrainTraining,
                allMorningRoutine.rStory,
                allMorningRoutine.rEmotional,
                allMorningRoutine.rMeditation
            ];
        }else{
            switch (today) {
                case 1 :
                    morningRoutine=[
                        allMorningRoutine.rThoughtControl,  //
                        allMorningRoutine.rChoosePath, //..
                        allMorningRoutine.rVisualize, //..
                        allMorningRoutine.rMeditation //..
                    ];
                    break;
                case 2 :
                    morningRoutine=[
                        allMorningRoutine.rStress, //..
                        allMorningRoutine.rStory, //..
                        allMorningRoutine.rEmotional, //..
                        allMorningRoutine.rMeditation,
                    ];
                    break;
                case 3 :
                    morningRoutine=[
                        allMorningRoutine.rChoosePath,
                        allMorningRoutine.rBrainTraining, //
                        allMorningRoutine.rMeditation,
                    ];
                    break;
                case 4 :
                    morningRoutine=[
                        // allMorningRoutine.rMeditation,
                        allMorningRoutine.rVisualize,
                        allMorningRoutine.rStory,
                        allMorningRoutine.rMeditation
                    ];
                    break;
                case 5 :
                    morningRoutine=[
                        allMorningRoutine.rThoughtControl,
                        allMorningRoutine.rEmotional,
                        allMorningRoutine.rChoosePath,
                        allMorningRoutine.rMeditation,
                    ];
                    break;
                case 6 :
                    morningRoutine=[
                        allMorningRoutine.rStory,
                        allMorningRoutine.rBrainTraining,
                        allMorningRoutine.rMeditation,
                    ];
                    break;
                case 0 :
                    morningRoutine=[
                        allMorningRoutine.rMeditation,
                    ];
                    break;
            }
        }

        let filteredMorning = [];
        morningRoutine.forEach(obj=>{
            if(obj){
                if(_.find(this.props.todayScreenExercise,{pageName: obj.pageName}) === undefined
                    || _.find(this.props.todayScreenExercise,{pageName: obj.pageName, isSelected: true}) !== undefined){
                    filteredMorning.push(obj);
                }
            }
        });

        let totalTime = 0;
        filteredMorning.forEach(obj => {
            if(obj){
                totalTime += (obj.pageName === "medicationActivity") && this.props.meditationTime || obj.activityTime;
            }
        });

        this.setState({
            morningRoutine: filteredMorning,
            totalMorningRoutineTimes: totalTime + " minutes"
        });
        //this.setCompletedMorningRoutine(morningRoutine);
        this.props.setMorningRoutine(filteredMorning);
    };

    setMorningRoutineLabel = () => {
        let index = 0;
        let totalTime = 0;
        let today = new Date().toDateString();
        this.state.morningRoutine.forEach(obj => {
            totalTime += (obj.pageName === "medicationActivity") && this.props.meditationTime || obj.activityTime;
            if(this.isReplayActivity(obj.pageName)){
                index += 1;
            }
        });
        if(index === this.state.morningRoutine.length || index === 0) {
            this.setState({
                totalMorningRoutineTimes: totalTime + " minutes",
                isAllMorningRoutineDone: index === this.state.morningRoutine.length
            });
        }else{
            this.setState({
                totalMorningRoutineTimes: "Tap to resume"
            });
        }
    };

    setOptionalActivities = () => {
        let isAudioActivity = false;
        let today = new Date().getDay();
        let optionalExercies = [];
        let todayDate = moment().format("YYYY-MM-DD");

        if(this.props.registered_at === todayDate) {
            isAudioActivity = true;
            optionalExercies=[
                allOptionalExercies.didYouKnow, //..
                allOptionalExercies.stressRelief]; //..
        }else {
            switch (today) {
                case 1 :
                    isAudioActivity = true;
                    optionalExercies=[
                        allOptionalExercies.lettersToYourSelf,
                        allOptionalExercies.stressRelief, //
                        allOptionalExercies.healthyActivity, //..
                    ];
                    break;
                case 2 :
                    optionalExercies=[
                        allOptionalExercies.lettersToYourSelf,
                        allOptionalExercies.kegalsActivity,
                        allOptionalExercies.didYouKnow,
                        allOptionalExercies.faithActivity, //..
                    ];
                    break;
                case 3 :
                    isAudioActivity = true;
                    optionalExercies=[
                        allOptionalExercies.lettersToYourSelf,
                        allOptionalExercies.breathingActivity,
                        allOptionalExercies.healthyActivity,
                    ];
                    break;
                case 4 :
                    optionalExercies=[
                        allOptionalExercies.breathingActivity,
                        allOptionalExercies.lettersToYourSelf,
                        allOptionalExercies.kegalsActivity,
                        allOptionalExercies.didYouKnow,
                        allOptionalExercies.faithActivity,
                    ];
                    break;
                case 5 :
                    isAudioActivity = true;
                    optionalExercies=[
                        allOptionalExercies.lettersToYourSelf,
                        allOptionalExercies.breathingActivity,
                        allOptionalExercies.didYouKnow
                    ];
                    break;
                case 6 :
                    optionalExercies=[
                        allOptionalExercies.lettersToYourSelf,
                        allOptionalExercies.kegalsActivity,
                        allOptionalExercies.healthyActivity,
                        allOptionalExercies.stressRelief,
                    ];
                    break;
                case 0 :
                    optionalExercies=[
                        allOptionalExercies.lettersToYourSelf,
                        allOptionalExercies.breathingActivity,
                        allOptionalExercies.didYouKnow,
                        allOptionalExercies.faithActivity,
                    ];
                    break;
            }
        }
        // optionalExercies=[
        // allOptionalExercies.audioActivity,
        // allOptionalExercies.brainActivity,
        // allOptionalExercies.breathingActivity, //top
        // allOptionalExercies.chooseYourPathActivity,
        // allOptionalExercies.didYouKnow,
        // allOptionalExercies.emotionalActivity,
        // allOptionalExercies.faithActivity,
        // allOptionalExercies.healthyActivity,
        // allOptionalExercies.kegalsActivity,
        // allOptionalExercies.lettersToYourSelf,
        // allOptionalExercies.medicationActivity,
        // allOptionalExercies.storyDetail,
        // allOptionalExercies.stressRelief,
        // allOptionalExercies.thoughtActivity,
        // allOptionalExercies.visualizationActivity,
        // ];

        let filteredOptional = [];

        if(this.props.exercise_number_profile <= 9){
            let description = ["","psychology", "anxiety", "self-esteem", "stress", "relationship", "behavioural", "activity", "dietary", ""];
            if(this.isReplayActivity(allOptionalExercies.aboutYouActivity.pageName)){
                allOptionalExercies.aboutYouActivity.desc = "Complete your "+ description[this.props.exercise_number_profile - 1] +" profile";
            }else{
                allOptionalExercies.aboutYouActivity.desc = "Complete your "+ description[this.props.exercise_number_profile] +" profile";
            }
            if(this.props.exercise_number_profile > 8){
                if(this.isReplayActivity(allOptionalExercies.aboutYouActivity.pageName)){
                    optionalExercies.splice(0,0,allOptionalExercies.aboutYouActivity);
                }
            }else{
                optionalExercies.splice(0,0,allOptionalExercies.aboutYouActivity);
            }
        }

        //If Did you know > 15 then not diaply card
        if(this.props.exercise_number_learn > 15){
            if(this.props.exercise_number_learn == 16 && this.isReplayActivity(allOptionalExercies.didYouKnow.pageName)){
                //Do nothing
            }else{
                let index = optionalExercies.indexOf(allOptionalExercies.didYouKnow);
                if(index >= 0){
                    optionalExercies.splice(index, 1);
                }
            }
        }

        optionalExercies.forEach(obj=>{
            if(_.find(this.props.todayScreenExercise,{pageName: obj.pageName}) === undefined
                || _.find(this.props.todayScreenExercise,{pageName: obj.pageName, isSelected: true}) !== undefined){
                filteredOptional.push(obj);
            }
        });

        if(_.find(this.props.todayScreenExercise,{pageName: allOptionalExercies.audioActivity.pageName, isSelected: false}) !== undefined) {
            isAudioActivity = false;
        }
        if(_.find(this.props.todayScreenExercise,{pageName: "journal", isSelected: true}) !== undefined) {
            filteredOptional.push(allOptionalExercies.journalActivity);
        }
        this.setState({
            optionalExercies: _.cloneDeep(filteredOptional),
            isAudioActivity: isAudioActivity
        });
    };

    setCheckupView = () => {
        let currentHour = new Date().getHours();
        let checkupHour = this.props.checkupTime;
        let checkUpTime= this.state.checkUpTime;
        switch (checkupHour) {
            case 18:
                checkUpTime="6pm";
                break;
            case 19:
                checkUpTime="7pm";
                break;
            case 20:
                checkUpTime="8pm";
                break;
            case 21:
                checkUpTime="9pm";
                break;
            case 22:
                checkUpTime="10pm";
                break;
            case 23:
                checkUpTime="11pm";
                break;
        }
        let flag = 1;
        if(currentHour >= checkupHour) {
            flag = 2;
        }
        this.getCheckupMessage(flag, checkUpTime);
        this.setState({
            checkUpTime: checkUpTime,
            checkUpFlag: flag,
        });
    };

    getCheckupMessage = (flag, checkUpTime) => {
        let message = "Evening checkup";
        let todayDate = moment().format("YYYY-MM-DD");
        if(this.props.last_checkup_at ===todayDate) {
            message = (Constant.screenWidth < 350) && "Checkup complete."
                || "Checkup done. Tap to redo.";
        }else{
            if (flag ===1) {
                if(Constant.screenWidth < 350){
                    message = "Checkup set for " + checkUpTime;
                }else{
                    message = "Checkup scheduled for " + checkUpTime;
                }
            }
        }
        this.setState({
            checkupTimeMessage: message
        });
    };

    getGreetingMessage = () => {
        let myDate = new Date();
        let hrs = myDate.getHours();
        if (hrs < 12)
            return "Good Morning ";
        else if (hrs >= 12 && hrs <= 17)
            return "Good Afternoon ";
        else if (hrs >= 17 && hrs <= 24)
            return "Good Evening ";
    };

    onLifeTreeSelect = () => {
        this.props.navigation.navigate("lifeTree",{makeFadeInAnimation:this.makeFadeInAnimation,
            scrollToTopToday: this.scrollToTopToday,
            isFromTodayScreen: true,
            onBackLifeTree: this.onBackLifeTree, transition: "myCustomSlideUpTransition"});
        isActivityPushed = true;
    };

    onCheckupCardClicked = () => {
        let todayDate = moment().format("YYYY-MM-DD");
        let currentHour = new Date().getHours();
        let checkupHour = this.props.checkupTime;
        if(currentHour < checkupHour) {
            if(this.props.last_checkup_at === todayDate) {
                this.props.manageCheckupPopup({
                    isShow: true,
                    checkUpDetail: {
                        title: "Checkup done.",
                        alertMessage: "Would you like to redo your checkup?",
                        buttonTitle: "Redo checkup",
                        closeText: "Keep existing checkup",
                        pageName: "checkUp",
                        scrollToTopToday: this.scrollToTopToday,

                    }
                });
            }else {
                this.props.manageCheckupPopup({
                    isShow: true,
                    checkUpDetail: {
                        title: "Checkup set for " + this.state.checkUpTime,
                        alertMessage: "Would you like to checkup now?",
                        buttonTitle: "Begin",
                        closeText: "Checkup later",
                        pageName: "checkUp",
                        scrollToTopToday: this.scrollToTopToday,

                    }
                });
            }
        }else{
            AsyncStorage.getItem('isCheckupClicked').then((isCheckupClicked)=>{
                AsyncStorage.setItem('isCheckupClicked',"true");
                if(isCheckupClicked || isCheckupClicked === "false") {
                    BackHandler.removeEventListener('hardwareBackPress', this._handleBackPress);
                    isToday = false;
                    this.props.navigation.navigate("checkUp", {
                        isYesterday: false,
                        isFromToday: true,
                        scrollToTopToday: this.scrollToTopToday,
                        transition: "myCustomSlideUpTransition"
                    });
                }
            });
        }
    };

    onSelectExercises = (page, isMornigRoutine = false) => {
        try{
            isToday = false;
            //this.props.navigation.navigate('checkUpComplete');
            if(page === "morningRoutine") {
                this.manageMorningRoutine();
            }else{
                if(isMornigRoutine) {
                    let obj = _.find(this.state.morningRoutine,{pageName: page});
                    let objIndex = this.state.morningRoutine.indexOf(obj) + 1;
                    let length = this.state.morningRoutine.length;
                    isActivityPushed = true;
                    this.props.navigation.navigate(page,
                        {pageName: page,
                            isReplay: this.isReplayActivity(page),
                            setDoneMorningRoutine: this.setDoneMorningRoutine,
                            improve: obj.improve || [],
                            isOptional: false,
                            isLast: false,
                            introTitle: objIndex + " of " + length,
                            transition: "myCustomSlideUpTransition",
                            scrollToTopToday: this.scrollToTopToday,
                            onCompleteExercises: this.onCompleteExercises, makeFadeInAnimation:this.makeFadeInAnimation});
                }else{
                    if(page === "journalActivity"){
                        this.onJournalActivityPress();
                    }else{
                        let obj = _.find(allOptionalExercies,{pageName: page});
                        isActivityPushed = true;
                        this.props.navigation.navigate(page,
                            { isReplay: this.isReplayActivity(page),
                                pageName: page, setDoneMorningRoutine: this.setDoneMorningRoutine,
                                isOptional: true,
                                improve: obj.improve || [],
                                transition: "myCustomSlideUpTransition",
                                scrollToTopToday: this.scrollToTopToday,
                                onCompleteExercises: this.onCompleteExercises,makeFadeInAnimation:this.makeFadeInAnimation});
                    }
                }
            }
        }catch (e){
            isActivityPushed = false;
            isToday = true;
            if(__DEV__){
                alert("onSelectExercises - " + JSON.stringify(e))
            }
        }
    };

    manageMorningRoutine = () => {
        try{
            if(this.state.morningRoutine.length > 0) {
                let today = new Date().toDateString();
                let completedMorningRoutine = [];
                if(this.props.completedMorningRoutine.completedDate ===today){
                    completedMorningRoutine = this.props.completedMorningRoutine.routineActivities;
                }else{
                    if(this.props.completedMorningRoutine.routineActivities.length > 0) {
                        this.props.onCompletedMorningRoutine();
                    }
                }
                let morningRoutine = this.props.morningRoutine;
                let isLast = (morningRoutine.length ===completedMorningRoutine.length+1);
                let length = this.state.morningRoutine.length;
                if(morningRoutine.length ===completedMorningRoutine.length) {
                    let obj = _.find(this.state.morningRoutine,{pageName: this.state.morningRoutine[0].pageName});
                    let objIndex = this.state.morningRoutine.indexOf(obj) + 1;
                    isActivityPushed = true;
                    this.props.navigation.navigate(this.state.morningRoutine[0].pageName,
                        {pageName: this.state.morningRoutine[0].pageName,
                            isReplay: this.isReplayActivity(this.state.morningRoutine[0].pageName),
                            setDoneMorningRoutine: this.setDoneMorningRoutine, isOptional: false,
                            isLast: isLast,
                            improve: this.state.morningRoutine[0].improve,
                            introTitle: objIndex + " of " + length,
                            transition: "myCustomSlideUpTransition",
                            scrollToTopToday: this.scrollToTopToday,
                            onCompleteExercises: this.onCompleteExercises,makeFadeInAnimation:this.makeFadeInAnimation});
                }else {
                    let obj = _.find(this.state.morningRoutine,{pageName: morningRoutine[completedMorningRoutine.length].pageName});
                    let objIndex = this.state.morningRoutine.indexOf(obj) + 1;
                    isActivityPushed = true;
                    this.props.navigation.navigate(morningRoutine[completedMorningRoutine.length].pageName,
                        {pageName: morningRoutine[completedMorningRoutine.length].pageName,
                            isReplay: this.isReplayActivity(morningRoutine[completedMorningRoutine.length].pageName),
                            setDoneMorningRoutine: this.setDoneMorningRoutine,
                            isLast: isLast,
                            isOptional: false,
                            introTitle: objIndex + " of " + length,
                            improve: morningRoutine[completedMorningRoutine.length].improve,
                            transition: "myCustomSlideUpTransition",
                            scrollToTopToday: this.scrollToTopToday,
                            onCompleteExercises: this.onCompleteExercises,
                            makeFadeInAnimation:this.makeFadeInAnimation});
                }
            }
        }catch (err){
            if (__DEV__) { alert(err) }
        }
    };

    setDoneMorningRoutine = (pageName) => {
        this.props.setCompletedMorningRoutine(pageName);
    };

    onCompleteExercises = (pageName) => {
        this.props.setCompletedExercises(pageName);
    };

    //Set Last checkup date
    setLastCheckupDate = () => {
        let todayDate = moment().format("YYYY-MM-DD");
        let yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
        if(this.props.last_checkup_at ===null || this.props.last_checkup_at ==="") {
            if(_.find(this.props.p_array,{occurred_at: todayDate}) !== undefined ){
                this.props.updateMetaData({
                    last_checkup_at: todayDate
                });
            }else{
                this.props.updateMetaData({
                    last_checkup_at: moment().subtract(1, 'days').format('YYYY-MM-DD')
                });
            }
        }
    };

    //SetTimeZone
    setTimezone = () => {
        NativeCallback.getTimeZone((timeZone)=>{
            if(timeZone && timeZone != "NULL" && this.props.timezone == null || this.props.timezone != timeZone){
                this.props.updateMetaData({
                    timezone: timeZone
                });
            }
        })
    }

    onReadLetterPress = (page) => {
        let obj = _.find(this.props.letters, {day: this.props.currentGoal.previousAchieved});
        let title = (this.props.currentGoal.previousAchieved ===1)
            ? "24 hours clean" :  (this.props.currentGoal.previousAchieved ===365) ? "1 year clean"
                : this.props.currentGoal.previousAchieved + " days clean";
        if(obj !== undefined){
            if(obj.content !== null){
                // let title = this.props.currentGoal.previousMessage;
                // title.replace("clean", "success");
                this.props.navigation.navigate(page,{
                    letterContent: obj.content,
                    title: title,
                    isFromPopup: false,
                    previousAchieved: this.props.currentGoal.previousAchieved,
                    makeFadeInAnimation:this.makeFadeInAnimation,
                    scrollToTopToday: this.scrollToTopToday,
                    transition: "myCustomSlideUpTransition"}
                );
                isActivityPushed = true;
            }
        }
    };

    isReplayActivity = (pageName) => {
        let today = new Date().toDateString();
        let objIndex = this.props.completedExercises.exercises.indexOf(pageName);
        return (objIndex >= 0 && this.props.completedExercises.date ===today);
    };

    renderTodayList = () => {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];

        let isRenderLatter = this.isReadLetter();
        let today = new Date().toDateString();
        if(!this.state.isAllMorningRoutineDone || isRenderLatter ||
            (this.state.isAudioActivity  && !this.isReplayActivity(allOptionalExercies.audioActivity.pageName))) {
            return(
                <View>
                    <Text style={[styles.titleStyle, {color:appColor.headerTitle}]}>
                        { this.state.todayTitle}
                    </Text>
                    {
                        this.renderReadLetterCard()
                    }
                    {
                        (!this.state.isAllMorningRoutineDone) &&
                        this.renderMorningRoutine() || null
                    }
                    {
                        (this.state.isAudioActivity && !this.isReplayActivity(allOptionalExercies.audioActivity.pageName)) &&
                        <Routine title={allOptionalExercies.audioActivity.title}
                                 appTheme={this.props.appTheme}
                                 desc={allOptionalExercies.audioActivity.desc}
                                 Icon={allOptionalExercies.audioActivity.Icon}
                                 completedExercises={this.props.completedExercises}
                                 TodayItemList={null}
                                 isIcon={true}
                                 onSelectExercises={this.onSelectExercises}
                                 pageName={allOptionalExercies.audioActivity.pageName} />
                        || null
                    }
                    { this.renderTopLifeTreeCard() }
                </View>)
        }else{
            return(
                <View>
                    { this.renderTopLifeTreeCard(false, false, true) }
                </View>
            )
        }
        return null
    };

    renderMorningRoutine = () => {
        return (
            <View>
                <Routine title="Morning routine"
                         appTheme={this.props.appTheme}
                         desc={this.state.totalMorningRoutineTimes}
                         Icon={iconImage.morningIcon}
                         TodayItemList={this.state.morningRoutine}
                         pageName="morningRoutine"
                         completedExercises={this.props.completedExercises}
                         onSelectExercises={this.onSelectExercises}/>
            </View>
        );
    };

    scrollToTopToday = () => {
        try{
            if(this.refs.todaysScroll){
                this.refs.todaysScroll.scrollTo({x: 0, y: 0, animated: false})
            }
        }catch (err){
            if (__DEV__) { alert(err) }
        }
    }

    onBackLifeTree = () => {
        this.setState({});
    }

    renderTopLifeTreeCard = (isCompleted = false, isTitle = false, isTopTitle = false, isFromNow = false) => {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        let isViewCompleted = false;
        let dateToday = new Date().toDateString();
        if(this.props.todayLifeTree.isCompleted && this.props.todayLifeTree.completedDate === dateToday) {
            isViewCompleted = true;
        }
        let todayDate = moment().format("YYYY-MM-DD");
        let todayObj = _.find(this.props.p_array, {occurred_at: todayDate});
        if(_.find(this.props.todayScreenExercise,{pageName: "lifeTree", isSelected: true}) !== undefined &&
            this.props.last_checkup_at === todayDate && todayObj != undefined && !todayObj.is_relapse) {
            let title = "Your life tree is growing!";
            if(this.props.current_p_clean_days > 53){
                title = "Your life tree is healthy!";
            }
            if (isCompleted) {
                if (this.props.todayLifeTree.isShow && isViewCompleted) {
                    return (
                        <View>
                            {
                                (isTitle) &&
                                this.renderViewBtnCompleted()
                                || null
                            }
                            {
                                (this.state.viewCompleted) &&
                                <LifeTree message={title}
                                          onPress={()=> this.onLifeTreeSelect()}
                                          appTheme={this.props.appTheme}/>
                                || null
                            }
                        </View>
                    )
                }
            } else {
                if (this.props.todayLifeTree.isShow && !isViewCompleted) {
                    if(isFromNow) {
                        return (
                            <View>
                                {(isTopTitle) &&
                                <Text style={[styles.titleStyle, {color:appColor.headerTitle}]}>
                                    {"NOW"}
                                </Text>
                                || null}
                                <LifeTree message={title}
                                          onPress={()=> this.onLifeTreeSelect()}
                                          appTheme={this.props.appTheme}/>
                            </View>
                        )
                    }
                }
            }
        }
        return null;
    };

    onJournalActivityPress = () => {
        try{
            let list = this.props.journal_date_wise_list;
            let month = moment().format("MMMM");
            let year = moment().format("YYYY");
            let key = month + "-" + year;
            let currentList = list[key];
            let todayDate = moment().format("YYYY-MM-DD");
            let rowData = currentList[todayDate] || null;
            if(rowData){
                isActivityPushed = true;
                this.props.navigation.navigate('journalActivity', { rowData: rowData,
                    onCompleteExercises: this.onCompleteExercises,
                    isReplay: this.isReplayActivity('journalActivity'),
                    isOptional: true,
                    makeFadeInAnimation:this.makeFadeInAnimation,
                    scrollToTopToday: this.scrollToTopToday,
                    onBackJournal: this.onBackLifeTree,
                    transition: "myCustomSlideUpTransition"});
            }
        }catch (e){

        }
    };

    onViewShowHideclicked = () => {
        this.setState({
            viewCompleted: !this.state.viewCompleted
        });
    };

    renderViewBtnCompleted = () => {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return(
            <View style={{marginTop:25, marginBottom: 5}}>
                <TouchableOpacity delayPressIn={15}
                                  onPress={()=> this.onViewShowHideclicked()}
                                  style={[styles.btnViewCompleted,{backgroundColor: appColor.viewCompletedBtn}]}>
                    <View>
                        <Text style={[styles.txtViewCompleted,{color:appColor.viewCompletedText}]}>
                            {this.state.viewCompleted && "Hide completed" || "View completed"}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    };

    //Read your letter and write letter
    renderReadLetterCard = (isCompleted = false) => {
        if(this.isLetterDataAvailable()){
            if(isCompleted && this.isReadLetterCompleted()  || this.isReadLetter()){
                let subTitle = (this.props.currentGoal.previousAchieved === 1)
                    ? "24 hours clean" :  this.props.currentGoal.previousAchieved + " days clean";
                return (
                    <Routine title={"Read Your Letter"}
                             appTheme={this.props.appTheme}
                             desc={"Goal achieved - " + subTitle}
                             Icon={iconImage.letterIcon}
                             TodayItemList={null}
                             isIcon={false}
                             improve={[]}
                             completedExercises={this.props.completedExercises}
                             onSelectExercises={this.onReadLetterPress}
                             pageName={"readLetter"}/>
                )
            }
        }
        return null;
    };

    //Read Data available or not
    isLetterDataAvailable = () => {
        let obj = _.find(this.props.letters, {day: this.props.currentGoal.previousAchieved});
        if(obj !== undefined) {
            if(obj.content) {
                return true;
            }
        }
        return false;
    }

    isReadLetter = () => {
        if(this.isWriteLetterForPreviosGoal() && this.isLetterDataAvailable()){
            return !this.isReadLetterCompleted();
        }
        return false;
    }

    isReadLetterCompleted = () => {
        if(this.isWriteLetterForPreviosGoal() && this.isLetterDataAvailable()) {
            //Render read  completed
            let readDate = this.props.readLatterDate.date;
            if(readDate != "") {
                let today = moment();
                let letterReadDate = moment(readDate);
                let goalDays = this.props.currentGoal.goalDays;
                if(goalDays != 0 && this.props.readLatterDate.previousAchieved === this.props.currentGoal.previousAchieved) {
                    let diff = today.diff(letterReadDate,'days');
                    switch (goalDays) {
                        case 1:
                            if(diff == 0)
                                return true;
                            break
                        case 3:
                            if(diff <= 2)
                                return true;
                            break;
                        case 7:
                            if(diff <= 4)
                                return true;
                            break;
                        case 14:
                            if(diff <= 7)
                                return true;
                            break;
                        case 30:
                            if(diff <= 16)
                                return true;
                            break;
                        case 90:
                            if(diff <= 60)
                                return true;
                            break;
                        case 180:
                            if(diff <= 90)
                                return true;
                            break;
                        case 365:
                            if(diff <= 185)
                                return true;
                            break;
                    }
                    return false;
                }
            }
        }
    }

    //Is Write letter for previous streak
    isWriteLetterForPreviosGoal = () => {
        //Today and for current goal
        if(this.props.currentGoal.previousAchieved != 0) {
            let obj = _.find(this.props.letters, {day: this.props.currentGoal.previousAchieved});
            if(obj && obj.updateDate) {
                let updatedDate = obj.updateDate || null;
                let today = moment();
                let letterInsertedDate = moment(updatedDate);
                let goalDays = this.props.currentGoal.goalDays;
                if(goalDays != 0) {
                    let diff = today.diff(letterInsertedDate,'days');
                    switch (this.props.currentGoal.goalDays) {
                        case 1:
                            if(diff <= 1)
                                return true;
                            break
                        case 3:
                            if(diff <= 2)
                                return true;
                            break;
                        case 7:
                            if(diff <= 4)
                                return true;
                            break;
                        case 14:
                            if(diff <= 7)
                                return true;
                            break;
                        case 30:
                            if(diff <= 16)
                                return true;
                            break;
                        case 90:
                            if(diff <= 60)
                                return true;
                            break;
                        case 180:
                            if(diff <= 90)
                                return true;
                            break;
                        case 365:
                            if(diff <= 185)
                                return true;
                            break;
                    }
                    return false;
                    // }
                }
            }
        }
        return false;
    }

    //For Write letter
    isWriteLetterCard = () => {
        let obj = _.find(this.props.letters, {day: this.props.currentGoal.goalDays});
        if(obj && obj.updateDate) {
            let insertedDate = obj.updateDate;
            let today = moment();
            let letterInsertedDate = moment(insertedDate);
            let diff = today.diff(letterInsertedDate,'days');
            switch (this.props.currentGoal.goalDays) {
                case 1:
                    if(diff !== 0)
                        return true;
                    break;
                case 3:
                    if(diff > 2)
                        return true;
                    break;
                case 7:
                    if(diff > 4)
                        return true;
                    break;
                case 14:
                    if(diff > 7)
                        return true;
                    break;
                case 30:
                    if(diff > 16)
                        return true;
                    break;
                case 90:
                    if(diff > 60)
                        return true;
                    break;
                case 180:
                    if(diff > 90)
                        return true;
                    break;
                case 365:
                    if(diff > 185)
                        return true;
                    break;
            }
            return false;
        }
        return true;
    }

    isDisplayWriteLetter = () => {
        if(this.isReadLetter()){
            if(this.isReadLetterCompleted()){
                return this.isWriteLetterCard();
            }else{
                return false;
            }
        }
        return this.isWriteLetterCard();
    }

    render() {
        let renderCompletedActivity = [];
        let renderOptionalActivity = [];
        let today = new Date().toDateString();
        let isReadCard = this.isReadLetterCompleted();
        this.state.optionalExercies.forEach(obj => {
            if(obj.pageName === "lettersToYourSelf") {
                if(this.isDisplayWriteLetter()){
                    renderOptionalActivity.push(obj);
                }
            }else if(obj.pageName === "kegalsActivity" && (this.state.gender === 'female'||this.state.gender ==='transgender_female')) {
            }else {
                if (this.isReplayActivity(obj.pageName)) {
                    renderCompletedActivity.push(obj);
                } else {
                    renderOptionalActivity.push(obj);
                }
            }
        });

        if(this.state.isAudioActivity && this.isReplayActivity(allOptionalExercies.audioActivity.pageName)) {
            renderCompletedActivity.push(allOptionalExercies.audioActivity)
        }

        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];

        return (
            <View style={{flex:1, backgroundColor: appColor.appBackground, overflow: 'hidden'}}>
                <AppStatusBar backColor={appColor.appBackground}
                              hidden={false}
                              barStyle={appColor.statusBarStyle}/>

                <Animatable.View style={{flex:1}} ref="mainView">
                    <LinearGradient colors={[appColor.appBackground, appColor.appLighBackground]}
                                    locations={[0.5, 0.5]}
                                    style={styles.linearGradient}>
                        <ScrollView automaticallyAdjustContentInsets={false}
                                    contentContainerStyle={{top:this.props.safeAreaInsetsData.top}}
                                    ref="todaysScroll" style={styles.container}>
                            <TotalProgress profileName={this.props.userName}
                                           profileGender = { this.state.gender}
                                           avatar_id = {this.props.avatar_id}
                                           percentage={this.props.totalRewiringPercentage}
                                           circularPercentage={this.props.circularRewiringPercentage}/>

                            <View style={{padding:20,backgroundColor:appColor.appBackground}}>
                                <View style={[styles.btnLogin,{backgroundColor: 'rgb(90,194,188)'}]}>
                                    <View>
                                        <Text style={[styles.btnFont, {color: 'white'}]}
                                              numberOfLines={1}>
                                            {
                                                (this.props.total_p_clean_days ===1) &&
                                                this.props.total_p_clean_days + " DAY CLEAN"
                                                ||
                                                this.props.total_p_clean_days + " DAYS CLEAN"
                                            }
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <TodaysTitle heading={this.props.currentGoal.Heading}
                                         progress={this.props.currentGoal.per+"%"}
                                         goalDays={this.props.currentGoal.goalDays}
                                         appTheme={this.props.appTheme}
                                         remaining_days={this.props.currentGoal.Description}/>

                            <View style={{backgroundColor: appColor.appLighBackground,paddingBottom:70}}>
                                {
                                    (this.state.isShowMonthlyChallenge) &&
                                    <View>
                                        <Text style={[styles.titleStyle, {color: appColor.headerTitle}]}>
                                            CHALLENGE</Text>
                                        <Routine title = {this.state.monthlyChallenge.title}
                                                 appTheme={this.props.appTheme}
                                                 desc={this.state.monthlyChallenge.desc}
                                                 Icon={this.state.monthlyChallenge.Icon}
                                                 completedExercises={this.props.completedExercises}
                                                 TodayItemList={null}
                                                 isIcon={false}
                                                 onSelectExercises={this.onSelectMonthlyChallenge}
                                                 pageName={"monthlyChallenge"} />
                                    </View>
                                }

                                {
                                    (this.state.checkUpFlag !== 2) &&
                                    this.renderTopLifeTreeCard(false, false, true, true)
                                    || null
                                }

                                {
                                    (this.state.checkUpFlag === 2) &&
                                    <View>
                                        <Text style={[styles.titleStyle, {color: appColor.headerTitle}]}>
                                            NOW</Text>
                                        {this.renderTopLifeTreeCard(false, false, false, true)}
                                        <CheckupTime message={this.state.checkupTimeMessage}
                                                     onPress={()=> this.onCheckupCardClicked()}
                                                     appTheme={this.props.appTheme}/>
                                    </View>
                                    || null
                                }

                                {
                                    (this.state.checkUpFlag === 1 && this.state.checkupTimeMessage.includes("redo")) &&
                                    <View>
                                        <Text style={[styles.titleStyle, {color: appColor.headerTitle}]}>
                                            TONIGHT</Text>
                                        <CheckupTime message={this.state.checkupTimeMessage}
                                                     onPress={()=> this.onCheckupCardClicked()}
                                                     appTheme={this.props.appTheme}/>
                                    </View>
                                    || null
                                }
                                { this.renderTodayList() }
                                {
                                    (this.state.checkUpFlag === 1 && !this.state.checkupTimeMessage.includes("redo")) &&
                                    <View>
                                        <Text style={[styles.titleStyle, {color: appColor.headerTitle}]}>
                                            TONIGHT</Text>
                                        <CheckupTime message={this.state.checkupTimeMessage}
                                                     onPress={()=> this.onCheckupCardClicked()}
                                                     appTheme={this.props.appTheme}/>
                                    </View>
                                    || null
                                }

                                {
                                    (renderOptionalActivity.length > 0) &&
                                    <View>
                                        <Text style={[styles.titleStyle, {color: appColor.headerTitle}]}>
                                            OPTIONAL</Text>
                                        {
                                            renderOptionalActivity.map((obj, index) => {
                                                return (
                                                    <Routine title={obj.title}
                                                             appTheme={this.props.appTheme}
                                                             desc={(obj.pageName === "lettersToYourSelf")
                                                                 ? (this.props.currentGoal.goalDays === 1) ? "24 hours clean"
                                                                     : this.props.currentGoal.goalDays + " days clean" : obj.desc}
                                                             Icon={obj.Icon}
                                                             completedExercises={this.props.completedExercises}
                                                             TodayItemList={null}
                                                             isIcon={(obj.isIcon !== undefined) ? obj.isIcon : true}
                                                             onSelectExercises = {this.onSelectExercises}
                                                             pageName={(obj.pageName !== undefined) ? obj.pageName : "healthyActivity"}
                                                             key={index} />
                                                )
                                            })
                                        }
                                    </View>
                                    || null
                                }
                                {
                                    ((renderCompletedActivity.length !== 0 || this.state.isAllMorningRoutineDone || isReadCard)
                                        && this.state.morningRoutine.length !== 0) &&
                                    <View>
                                        {this.renderViewBtnCompleted()}
                                        {(this.state.viewCompleted) &&
                                        <View>
                                            {
                                                (this.state.isAllMorningRoutineDone && this.state.morningRoutine.length !== 0) &&
                                                this.renderMorningRoutine() || null
                                            }
                                            {
                                                (isReadCard)&&
                                                this.renderReadLetterCard(true)||null
                                            }
                                            {
                                                renderCompletedActivity.map((obj, index) => {
                                                    return (
                                                        <Routine title = {obj.title}
                                                                 appTheme={this.props.appTheme}
                                                                 desc={(obj.pageName === "lettersToYourSelf") ? (this.props.currentGoal.goalDays === 1) ? "24 hours clean"
                                                                     : this.props.currentGoal.goalDays + " days clean" : obj.desc}
                                                                 Icon={obj.Icon}
                                                                 completedExercises={this.props.completedExercises}
                                                                 TodayItemList={null}
                                                                 isIcon={(obj.isIcon !== undefined) ? obj.isIcon : true}
                                                                 onSelectExercises={this.onSelectExercises}
                                                                 pageName={(obj.pageName !== undefined) ? obj.pageName : "healthyActivity"}
                                                                 key={index} />
                                                    )
                                                })
                                            }
                                            {this.renderTopLifeTreeCard(true, false)}
                                        </View>
                                        || null }

                                    </View>
                                    ||
                                    this.renderTopLifeTreeCard(true, true)
                                }
                            </View>
                        </ScrollView>
                    </LinearGradient>
                </Animatable.View>
            </View>
        );
    }

    //Manage subscription
    checkForSubscription = () => {
        let text = "";
        InAppBilling.close().then(()=>{
            // text = text + "-- " + "then close() "
            // this.setState({
            //     tmp: text
            // })
            InAppBilling.open().then(()=> {
                // text = text + "-- " + "then open() "
                // this.setState({
                //     tmp: text
                // })
                InAppBilling.loadOwnedPurchasesFromGoogle().then(()=> {
                    // text = text + "-- " + "then loadOwnedPurchasesFromGoogle() "
                    // this.setState({
                    //     tmp: text
                    // });
                    InAppBilling.listOwnedSubscriptions().then((subDetail)=>{
                        // text = text + "-- " + "then listOwnedSubscriptions() => " + JSON.stringify(subDetail)
                        // this.setState({
                        //     tmp: text
                        // });
                        InAppBilling.isSubscribed('brainbuddy_subscribe_monthly').then((isSubscribed)=>{
                            // text = text + "-- " + "then---isSubscribed" + isSubscribed + "";
                            // this.setState({
                            //     tmp: text
                            // });
                            if(isSubscribed){
                                //  alert("Already subscribed")
                                InAppBilling.getSubscriptionTransactionDetails('brainbuddy_subscribe_monthly')
                                    .then((details) => {
                                        // text = text + "\n\n-- " + "then---getSubscriptionTransactionDetails"
                                        // + JSON.stringify(details) + "---end====\n" +
                                        //     details.purchaseState;
                                        // this.setState({
                                        //     tmp: text
                                        // })
                                        if(details.purchaseState !== undefined && details.purchaseState == "PurchasedSuccessfully") {
                                        }else{
                                            //Get started
                                            showThemeAlert({
                                                title: "Subscription expired",
                                                message: "Please renew your subscription to continue using Brainbuddy",
                                                leftBtn: "Continue",
                                                leftPress: ()=>{
                                                    this.props.navigation.navigate("getStarted",{nextPage: "today"});
                                                },
                                                isLightTheme: this.props.appTheme === Constant.lightTheme
                                            });
                                        }
                                    }).catch((e)=>{
                                    // alert("----Catch getSubscriptionTransactionDetails");
                                });
                            }else{
                                // Get Started
                                showThemeAlert({
                                    title: "Subscription required",
                                    message: "Please subscribe to continue using Brainbuddy",
                                    leftBtn: "Continue",
                                    leftPress: ()=>{
                                        this.props.navigation.navigate("getStarted",{nextPage: "today"});
                                    },
                                    isLightTheme: this.props.appTheme === Constant.lightTheme
                                });
                            }
                        }).catch((e)=>{
                            //alert("--Catch --isSubscribed ")
                        })

                    }).catch((e)=>{
                        // alert("--Catch --listOwnedSubscriptions ")
                    })
                }).catch((e)=>{
                    //alert("--Catch --loadOwnedPurchasesFromGoogle ")
                })
            }).catch((e)=>{
                // alert("--Catch --open ")
            });
        }).catch((e)=>{
            //  alert("--Catch --close ")
        });
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginRight:0
    },
    btnLogin:{
        alignSelf: 'center',
        height:32,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 35,
        // paddingTop: 10,
        // paddingBottom: 10,
        paddingRight:20,
        paddingLeft:20
    },
    btnFont:{
        fontSize: 12,
        fontFamily: Constant.font700,
    },
    titleStyle:{
        marginTop: 25,
        marginBottom:3,
        color:'#a4b6bf',
        fontSize:12,
        alignSelf:'center',
        fontFamily: Constant.font700,
    },
    linearGradient: {
        flex: 1,
    },
    btnViewCompleted:{
        alignSelf: 'center',
        height:32,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        paddingRight:20,
        paddingLeft:20
    },
    txtViewCompleted:{
        fontSize: 12,
        fontFamily: Constant.font500,
        color: '#dee1e3'
    }
});

const mapStateToProps = state => {
    return {
        p_array:state.statistic.pornDetail.p_array,
        total_p_clean_days:state.statistic.pornDetail.total_p_clean_days,
        current_p_clean_days:state.statistic.pornDetail.current_p_clean_days,
        totalRewiringPercentage:state.statistic.totalRewiringPercentage,
        circularRewiringPercentage:state.statistic.circularRewiringPercentage,
        userName:state.user.userDetails.name,
        gender:state.user.userDetails.gender,
        avatar_id:state.user.userDetails.avatar_id,
        dateForAPICall:state.user.dateForAPICall,
        completedExercises:state.user.completedExercises,
        checkupTime: state.metaData.metaData.checkup_time || 18,
        last_checkup_at: state.metaData.metaData.last_checkup_at || "",
        registered_at: state.metaData.metaData.registered_at || "",
        morningRoutine: state.metaData.morningRoutine,
        completedMorningRoutine: state.metaData.completedMorningRoutine,
        currentGoal:state.statistic.currentGoal,
        letterInsertedDate:state.letters.letterInsertedDate,
        letters:state.letters.letters,
        visibleTab: state.user.visibleTab,
        readLatterDate: state.user.readLatterDate,
        todayViewInstance: state.user.todayViewInstance,
        isOpenFirstTime: state.user.isOpenFirstTime,
        isAskForCheckup: state.user.isAskForCheckup,
        safeAreaInsetsData: state.user.safeAreaInsetsData,
        subscriptionInProcess: state.user.subscriptionInProcess,
        isConnected: state.user.isConnected,
        meditationTime: state.metaData.meditationTime || 10,
        popupQueue: state.user.popupQueue,
        showRewindProgressPopUp: state.user.showRewindProgressPopUp,
        showStreakGoalPopUp: state.user.showStreakGoalPopUp,
        todayScreenExercise: state.metaData.todayScreenExercise || [],
        todayLifeTree: state.user.todayLifeTree || [],
        journal_date_wise_list:state.statistic.journal_date_wise_list,
        exercise_number_learn: state.metaData.metaData.exercise_number_learn || 1,
        exercise_number_profile: state.metaData.metaData.exercise_number_profile || 1,
        appBadgeCount: state.user.appBadgeCount,
        appTheme: state.user.appTheme,
        timezone: state.metaData.metaData.timezone || null,
        clean_p_days_per_month:state.statistic.pornDetail.clean_p_days_per_month,
        monthlyChallengeAchived: state.user.monthlyChallengeAchived,
    };
};

export default connect(mapStateToProps, {
    loadDataAfterLogin,
    setRewiringPlayer,
    setMorningRoutine,
    setCompletedMorningRoutine,
    updateMetaData,
    setCompletedExercises,
    manageCheckupPopup,
    onCompletedMorningRoutine,
    setDoneAPICallForToday,
    setUpLocalNotificationAlerts,
    manageTodayInstances,
    goalCalculation,
    setDateforTodayOpen,
    setAskedForCheckupPopup,
    setSubscriptionInProcess,
    manageRewiringPopup,
    manageRewiredProgressPopup,
    manageAchievedPopup,
    activeAppManagedTab,
    managedLetterAPI,
    manageStreakAchievedPopup,
    managePopupQueue,
    manageAppBadgeCount,
    setIsNetworkAvailable,
    resetStoreData,
    logoutRedirect,
    tabChanged,
    getCurrentClean,
    sendTagOneSignal,
    manageMonthlyChallengePopup,
    manageMonthlyChallengeAchieved
})(TodayPage);