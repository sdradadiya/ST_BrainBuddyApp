import React, { Component } from 'react';
import {
    StyleSheet, View, Image,
    ScrollView, Text,
    TouchableHighlight,
    Easing, Animated,
    AsyncStorage,
    Alert,
    StatusBar, NativeModules, Keyboard
} from 'react-native';
import {createBottomTabNavigator, TabNavigator, createTabNavigator} from 'react-navigation';
import Constant from '../helper/constant';
import { connect } from 'react-redux';
import CheckupPopUp from '../screens/today/component/checkUpPopUp';
import AchievementPopUp from '../screens/tabs/progress/component/achievementPopup';
import TeamAchievementPopUp from '../screens/tabs/progress/component/teamAchievementPopup';
import ImprovementPopUp from '../screens/tabs/progress/component/improvementPopup';
import MonthlyPopup from '../screens/tabs/progress/component/monthlyPopup';
import RewindProgressPopUp from '../screens/today/component/rewiredProgressPopUp';
import StreakGoalPopUp from '../screens/today/component/streakGoalPopUp';
import MonthlyChallengePopUp from '../screens/today/component/monthlyChallengePopup';
import { tabChanged, manageCheckupPopup, manageRewiringPopup,
    activeAppManagedTab,manageStreakAchievedPopup,
    removeSafeArea, manageRewiredProgressPopup, managePopupQueue,
    manageMonthlyChallengePopup, manageEncouragePopup,
    manageCongatulatePopup, manageTeamAchievementPopup} from '../actions/userActions';
import LinearGradient from 'react-native-linear-gradient';
import _ from 'lodash';
import {NavigationActions} from 'react-navigation';
import {callTodayScreenEcentListner} from "../helper/appHelper";
import TeamTabIcon from './subComponent/teamTabIcon';
import TabbarIcon from'./subComponent/tabbarIcon';
import TodayStackNavigator from '../screens/today/todayPage';
import StatisticStackNavigator from '../screens/tabs/progress/tabProgressComponent';
import TeamStackNavigator from '../screens/tabs/team/showTeam';
import MilestoneStackNavigator from '../screens/tabs/milestones/milestonesTab';
import MoreStackNavigator from '../screens/tabs/more/userProfile';
import EncouragePopup from '../screens/tabs/team/component/encouragePopup';
import CongratulatePopup from '../screens/tabs/team/component/congratulatePopup';
let nativeCall = (Constant.isIOS) && NativeModules.checkBundle || null;
let bottomSafe = 0;
let visibleTab = "today";
let that = null;

const RootTabs = createBottomTabNavigator({
    Today: {
        screen: TodayStackNavigator,
        navigationOptions: {
            tabBarIcon: ({ tintColor, focused }) => {
                return (
                    <TabbarIcon
                        tintColor={tintColor}
                        tabbar={"Today"}
                        focused={focused}
                    />
                )
            },
            // tabBarOnPress: ({scene, jumpToIndex}) =>{
            tabBarOnPress: ({navigation, defaultHandler}) =>{
                // jumpToIndex(scene.index);
                that.onTabChange('today');
                return defaultHandler()

            }
        },
    },
    Statistic: {
        screen: StatisticStackNavigator,
        navigationOptions: {
            tabBarIcon: ({ tintColor, focused }) => {
                return (
                    <TabbarIcon
                        tintColor={tintColor}
                        tabbar={"Statistic"}
                        focused={focused}
                    />                )
            },
            tabBarOnPress: ({navigation, defaultHandler}) =>{
                //     jumpToIndex(scene.index);
                that.onTabChange('statistic');
                return defaultHandler()
            }
        },
    },
    Team: {
        screen: TeamStackNavigator,
        navigationOptions: {
            tabBarIcon: ({ tintColor, focused }) => {
                return (
                    <TeamTabIcon
                        tintColor={tintColor}
                        tabbar={"Team"}
                        focused={focused}
                    />
                )
            },
            tabBarOnPress: ({navigation, defaultHandler}) =>{
                //     jumpToIndex(scene.index);
                that.onTabChange('team');
                return defaultHandler()
            }
        },
    },
    Milestone: {
        screen: MilestoneStackNavigator,
        navigationOptions: {
            tabBarIcon: ({ tintColor, focused }) => {
                return (
                    <TabbarIcon
                        tintColor={tintColor}
                        tabbar={"Milestone"}
                        focused={focused}
                    />
                )
            },
            tabBarOnPress: ({navigation, defaultHandler}) =>{
                //     jumpToIndex(scene.index);
                that.onTabChange('milestone');
                return defaultHandler()
            }
        },
    },
    More: {
        screen: MoreStackNavigator,
        navigationOptions: {
            tabBarIcon: ({ tintColor, focused }) => {
                return (
                    <TabbarIcon
                        tintColor={tintColor}
                        tabbar={"More"}
                        focused={focused}
                    />
                )
            },
            tabBarOnPress: ({navigation, defaultHandler}) =>{
                //     jumpToIndex(scene.index);
                that.onTabChange('more');
                return defaultHandler()
            }
        },
    },
},{
    tabBarOptions:{
        showLabel: false,
        style:{
            backgroundColor: "transparent",
            // borderTopColor: '#026485',
            borderTopWidth:0,
            height:50,
            zIndex:6
        },
        tabStyle: {
            width: 100,
        },
    },
    lazy: false,
    swipeEnabled: false,
    animationEnabled: false,
    initialRouteName: "Today"
},);

class rootTabNavigation extends React.PureComponent {

    static router = RootTabs.router;

    constructor(props) {
        super(props);
        this.state = {
            flag: false,
            isShowRound: true,
            isTransform: true,
            isTopTab: false,
            isScroll: false,
            showRewiringPopUp: false,
            selectedData: {},
            checkUpDetail: {},
            bottom: 34,
        };
        that = this;
    }

    componentWillMount() {
        that = this;
        //bottomSafe = this.props.safeAreaInsetsData.bottom
        let obj = this.props.popupQueue;
        let newObj = {
            checkup: null,
            streakGoal: null,
            rewired: null,
            monthlyChallenge: null
        };
        if(!_.isEqual(obj, newObj)){
            this.props.managePopupQueue(obj);
        }
        this._rootTabView = null
    };

    componentWillUpdate(nextProps, nextState) {
    }

    componentDidMount() {
        StatusBar.setHidden(false);
        this.props.removeSafeArea(true);
        // this.downloadImages();
        this.props.tabChanged("today");
    }

    componentWillReceiveProps() {
        that = this;
        // this.downloadImages();
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     if(JSON.stringify(this.props) !== JSON.stringify(nextProps) || JSON.stringify(this.state) !== JSON.stringify(nextState)){
    //         return true
    //     }
    //     return false
    // }

    onTabChange = (selectedTab) => {
        Keyboard.dismiss();
        that=this;
        this.props.tabChanged(selectedTab);
        if(this.props.visibleTab !== selectedTab){
            if(Constant.isIOS){
                if(selectedTab == "team"){
                    nativeCall.manageKeyboard(true);
                }else{
                    nativeCall.manageKeyboard(false);
                }
            }
            this.props.activeAppManagedTab(selectedTab);
        }
        if(selectedTab == "today"){
            callTodayScreenEcentListner();
        }
    };

    //Download life tree image
    // downloadImages = () => {
    //     let currentHour = new Date().getHours();
    //     let awsUrl = "https://s3.amazonaws.com/brainbuddyhostingapp/Life-Tree/";
    //     let imgTimeUrl = (currentHour < 6) ? "tree-morning-"
    //         : (currentHour < 12) ? "tree-day-"
    //             : (currentHour < 17) ? "tree-evening-"
    //                 : "tree-night-";
    //     let treeImageUrl = awsUrl + imgTimeUrl;
    //     let glowImageUrl = awsUrl + "tree-glow-";
    //     let cleanStreak = (parseInt(this.props.current_clean_streak) > 53) ? "53" : this.props.current_clean_streak;
    //
    //     // this.setState({
    //     //     treeImage: treeImageUrl + cleanStreak + ".png",
    //     //     glowImage: glowImageUrl + cleanStreak + ".png",
    //     // });
    //
    //     Image.prefetch(treeImageUrl + cleanStreak + ".png"
    //     ).then(res => {
    //     }).catch(err => {
    //     });
    //
    //     Image.prefetch(glowImageUrl + cleanStreak + ".png"
    //     ).then(res => {
    //     }).catch(err => {
    //     });
    // };

    //on Checkup
    onCloseCheckupPopUp = (flag, obj = {}) => {
        if (!flag) {
            this.props.removeSafeArea(true);
        }
        this.props.manageCheckupPopup({
            isShow: flag,
            checkUpDetail: obj
        });
        //set null
        if(!flag){
            let obj = this.props.popupQueue;
            obj.checkup = null;
            this.props.managePopupQueue(obj);
        }
    };

    //on checkup click
    onBeginCheckup = (objCheckup) => {
        setTimeout(() => {
            this.props.manageCheckupPopup({
                isShow: false,
                checkUpDetail: {}
            });
        }, 100);
        this.props.removeSafeArea();
        if (objCheckup.isYesterday) {
            // this.props.navigation.dispatch(NavigationActions.reset({
            //     index: 0,
            //     actions: [
            //         NavigationActions.navigate({ routeName: "checkUp",
            //             params:{isYesterday: true, isFromToday: false}})
            //     ]
            // }));
            this.props.navigation.navigate("checkUp", {isYesterday: true, isFromToday: false, onBackToTabView: this.onBackToTabView,
                scrollToTopToday: this.props.showCheckupPopUp.checkUpDetail.scrollToTopToday,
                transition: "myCustomSlideUpTransition"});
        } else {
            if (this.props.showCheckupPopUp.checkUpDetail.pageName === "editPornCalendar") {
                // this.props.navigation.dispatch(NavigationActions.reset({
                //     index: 0,
                //     actions: [
                //         NavigationActions.navigate({ routeName: this.props.showCheckupPopUp.checkUpDetail.pageName,
                //             params: {isFromToday: false}})
                //     ]
                // }));
                this.props.navigation.navigate(this.props.showCheckupPopUp.checkUpDetail.pageName,
                    {isFromToday: true, onBackToTabView: this.onBackToTabView,
                        scrollToTopToday: this.props.showCheckupPopUp.checkUpDetail.scrollToTopToday, transition: "myCustomSlideUpTransition"});
            } else {
                // this.props.navigation.dispatch(NavigationActions.reset({
                //     index: 0,
                //     actions: [
                //         NavigationActions.navigate({ routeName: this.props.showCheckupPopUp.checkUpDetail.pageName,
                //             params:{isYesterday: false, isFromToday: false}})
                //     ]
                // }));
                this.props.navigation.navigate(this.props.showCheckupPopUp.checkUpDetail.pageName,
                    {isYesterday: false, isFromToday: false, onBackToTabView: this.onBackToTabView,
                        scrollToTopToday: this.props.showCheckupPopUp.checkUpDetail.scrollToTopToday,
                        transition: "myCustomSlideUpTransition"});
            }
        }
    };

    onBackToTabView = (key) => {
        // if(this._rootTabView){
        //     this._rootTabView._navigation.popToTop()
        //     setTimeout(() => {
        //         try{
        //             this._rootTabView._navigation.navigate('Today')
        //             this.onTabChange('today');
        //         }catch(x){
        //             console.log(x)
        //         }
        //     },100)
        // }
    }

    //on Rewiring Popup
    onShowRewiringPopUp = (objIcon) => {
        this.setState({
            selectedData: objIcon,
            showRewiringPopUp: true
        });
    };

    //on Achievement Imrovement popup
    onHideAchievementPopup = () => {
        this.props.manageRewiringPopup({
            isShow: false,
            rewiringDetail: {}
        })
    };

    //on Team Achievement Imrovement popup
    onHideTeamAchievementPopup = () => {
        this.props.manageTeamAchievementPopup({
            isShow: false,
            teamAchievementDetail: {}
        })
    };

    //Hide rewired popup
    onHideRewiredPopup = () => {
        this.props.manageRewiredProgressPopup(false, true);
    };

    //Hide streak goal popup
    onHideStreakGoalPopup = () => {
        let objStreak = {
            isShow: false,
            achivedGoal: this.props.showStreakGoalPopUp.achivedGoal,
            displayDate: this.props.showStreakGoalPopUp.displayDate,
            whileGoal: this.props.showStreakGoalPopUp.whileGoal,
            inProcess: false
        }
        this.props.manageStreakAchievedPopup(objStreak);
        let obj = this.props.popupQueue;
        obj.streakGoal = null;
        this.props.managePopupQueue(obj);
    };

    onHideMonthlyChallengePopup = () => {
        this.props.manageMonthlyChallengePopup({
            isShow: false,
            monthlyDetail: this.props.monthlyChallengePopup.monthlyDetail
        })
    };

    _getCurrentRouteName(navState) {
        if (navState.hasOwnProperty('index')) {
            // this._getCurrentRouteName(navState.routes[navState.index])
        } else {
            console.log("Current Route Name:", navState.routeName)
            if(navState.routeName === 'milestone'){
                // alert('milestone')

            }else if(navState.routeName === 'team'){
                //   alert('team')
            }
            // can then save this to the state (I used redux)
        }
    }

    onHideEncouragePopup = () => {
        let obj = _.cloneDeep(this.props.encouragePopup);
        obj.isShow = false;
        this.props.manageEncouragePopup(obj);
    }

    onHideCongratulatePopup = () => {
        let obj = _.cloneDeep(this.props.congratulatePopup);
        obj.isShow = false;
        this.props.manageCongatulatePopup(obj);
    }

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <View style={{ flex:1, height: Constant.screenHeight,marginTop:0,
                backgroundColor: appColor.appBackground, overflow: 'hidden'}}>
                <View style={{flex: 1,paddingBottom:0}}>
                    <StatusBar hidden={false} barStyle={appColor.statusBarStyle}/>
                    <View style={{ flex:1, height: Constant.screenHeight,marginTop:0,
                        backgroundColor:appColor.tabbarBack}}>
                        <RootTabs ref={(c) => this._rootTabView = c}
                                  navigation={this.props.navigation}/>
                    </View>
                    {
                        (this.props.showRewiringPopUp.isShow && this.props.showRewiringPopUp.rewiringDetail.isAchievement) &&
                        <AchievementPopUp onHideRewiringPopUp={this.onHideAchievementPopup}
                                          selectedData={this.props.showRewiringPopUp.rewiringDetail}
                                          appTheme={this.props.appTheme}/>
                    }

                    {
                        (this.props.showRewiringPopUp.isShow && !this.props.showRewiringPopUp.rewiringDetail.isAchievement) &&
                        <ImprovementPopUp onHideRewiringPopUp={this.onHideAchievementPopup}
                                          selectedData={this.props.showRewiringPopUp.rewiringDetail}
                                          appTheme={this.props.appTheme}/>
                    }

                    {
                        (this.props.showCheckupPopUp.isShow && !this.props.showRewindProgressPopUp.isShow && !this.props.showStreakGoalPopUp.isShow) &&
                        <CheckupPopUp onBeginCheckup={this.onBeginCheckup}
                                      checkUpDetail={this.props.showCheckupPopUp.checkUpDetail}
                                      onCloseCheckupPopUp={this.onCloseCheckupPopUp}
                                      appTheme={this.props.appTheme}/>
                    }

                    {
                        (this.props.showRewindProgressPopUp.isShow && !this.props.showStreakGoalPopUp.isShow && !this.props.showCheckupPopUp.isShow) &&
                        <RewindProgressPopUp onHidePopup={this.onHideRewiredPopup}
                                             rewindDetail={this.props.showRewindProgressPopUp.rewindDetail}
                                             appTheme={this.props.appTheme}/>
                    }
                    {
                        (this.props.showStreakGoalPopUp.isShow && !this.props.showCheckupPopUp.isShow && !this.props.showRewindProgressPopUp.isShow) &&
                        <StreakGoalPopUp onHidePopup={this.onHideStreakGoalPopup}
                                         appTheme={this.props.appTheme}/>
                    }
                    {
                        (this.props.monthlyChallengePopup && this.props.monthlyChallengePopup.isShow &&
                            this.props.monthlyChallengePopup.monthlyDetail.type == "today") &&
                        <MonthlyChallengePopUp onHidePopup={this.onHideMonthlyChallengePopup}
                                               monthlyDetail={this.props.monthlyChallengePopup.monthlyDetail}
                                         appTheme={this.props.appTheme}/>
                    }
                    {
                        (this.props.monthlyChallengePopup && this.props.monthlyChallengePopup.isShow &&
                            this.props.monthlyChallengePopup.monthlyDetail.type == "rewiring") &&
                        <MonthlyPopup onHidePopup={this.onHideMonthlyChallengePopup}
                                      monthlyDetail={this.props.monthlyChallengePopup.monthlyDetail}
                                      appTheme={this.props.appTheme}/>
                    }
                    {
                        (this.props.encouragePopup && this.props.encouragePopup.isShow) &&
                        <EncouragePopup appTheme={this.props.appTheme}
                                        onHidePopup={this.onHideEncouragePopup}
                                        memberDetail={this.props.encouragePopup.detail}/>

                    }
                    {
                        (this.props.congratulatePopup && this.props.congratulatePopup.isShow) &&
                        <CongratulatePopup appTheme={this.props.appTheme}
                                        onHidePopup={this.onHideCongratulatePopup}
                                        memberDetail={this.props.congratulatePopup.detail}/>

                    }
                    {
                        (this.props.teamAchievementPopUp && this.props.teamAchievementPopUp.isShow) &&
                        <TeamAchievementPopUp onHideRewiringPopUp={this.onHideTeamAchievementPopup}
                                          selectedData={this.props.teamAchievementPopUp.teamAchievementDetail}
                                          appTheme={this.props.appTheme}/>
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constant.backColor
    },
    tabBar: {
        backgroundColor:Constant.backProgressBarColor,
        borderTopWidth:1,
        borderTopColor:'#026485',
        zIndex:5,
    },
    tabbarIcon:{
        height: 25,
        width: 25
    },
});

const mapStateToProps = state => {
    return {
        showCheckupPopUp: state.user.showCheckupPopUp,
        showRewiringPopUp: state.user.showRewiringPopUp,
        safeAreaInsetsData: state.user.safeAreaInsetsData,
        showRewindProgressPopUp: state.user.showRewindProgressPopUp,
        monthlyChallengePopup: state.user.monthlyChallengePopup,
        showStreakGoalPopUp: state.user.showStreakGoalPopUp,
        popupQueue: state.user.popupQueue,
        visibleTab: state.user.visibleTab,
        appTheme: state.user.appTheme,
        encouragePopup: state.user.encouragePopup,
        congratulatePopup: state.user.congratulatePopup,
        teamAchievementPopUp: state.user.teamAchievementPopUp

    };
};

export default connect(mapStateToProps, {
    tabChanged,
    manageCheckupPopup,
    manageRewiringPopup,
    removeSafeArea,
    manageRewiredProgressPopup,
    managePopupQueue,
    activeAppManagedTab,
    manageStreakAchievedPopup,
    manageMonthlyChallengePopup,
    manageEncouragePopup,
    manageCongatulatePopup,
    manageTeamAchievementPopup
})(rootTabNavigation);