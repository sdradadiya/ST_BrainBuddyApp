import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    FlatList,
    PushNotificationIOS, Alert, AsyncStorage
} from 'react-native';
import { connect } from 'react-redux';
import { addTeamChat, getTeamChat, getTeamAchievements } from '../../../../actions/teamAction'
import { manageAppBadgeCount } from '../../../../actions/userActions'
import Constant from '../../../../helper/constant';
import SenderChatBubble from '../subcomponent/teamChat/senderChatBubble';
import ReceiverChatBubble from '../subcomponent/teamChat/receiverChatBubble';
import NoDataFound from '../../../commonComponent/noData';
import BottomChatComponent from '../subcomponent/teamChat/bottomChatView';
import {showNoInternetAlert, showCustomAlert, getSmallAvatarImage, showThemeAlert} from '../../../../helper/appHelper';
import OneSignal from 'react-native-onesignal';
import _ from 'lodash';
import StreckGoalMessage from '../subcomponent/teamChat/streckAchievements';
import moment from 'moment';

let isApiCalling = false;
let isAlertShown = false;

class TeamChat extends React.PureComponent {

    constructor(props){
        super(props);
        this.state={
            scrollBottom:0,
            limitViewBottom:50,
            isShowLimit: false,
            limitChar:0
        };
        isApiCalling = false;
    }

    componentWillReceiveProps (nextProps){
        if(nextProps.labelText !== undefined && nextProps.labelText !== 0){
            this.showNotoficationAlert();
            if(this.refs.scrollView) {
                if(this.props.visibleTab === "team") {
                    this.setReadBadgeValue();
                }
            }
        }
    }

    setReadBadgeValue = () => {
        if(Constant.isIOS){
            PushNotificationIOS.getApplicationIconBadgeNumber((n)=>{
                if(n > 0){
                    PushNotificationIOS.setApplicationIconBadgeNumber(0);
                }
                if(this.props.appBadgeCount !== 0){

                    this.props.manageAppBadgeCount(0);
                }
            })
        }else{
            OneSignal.clearOneSignalNotifications();
            AsyncStorage.setItem('remoteNotificationIds',"");
            if(this.props.appBadgeCount !== 0){
                this.props.manageAppBadgeCount(0);
            }
        }
    };

    showNotoficationAlert = () => {
        if(!isAlertShown) {
            if (this.props.notification_type === "long" && this.props.visibleTab === "team") {
                isAlertShown = true;
                AsyncStorage.getItem('isShownNotificationAlert')
                    .then(isAsk => {
                        if (isAsk) {
                        } else {
                            showThemeAlert({
                                title: "Chat notifications enabled",
                                message: "You will be notified when team members post in your team chat. Visit " +
                                "settings to customize how these notifications appear.",
                                leftBtn: "Got it",
                                isLightTheme: this.props.appTheme === Constant.lightTheme
                            });
                            AsyncStorage.setItem("isShownNotificationAlert", "true");
                        }
                    }).catch(err => {
                });
            }
        }
    };

    onMessageSend = (message) => {
        if(this.props.isConnected) {
            this.props.addTeamChat({content: message}).then((res)=>{
                if(this.props.teamChatMessageArray && this.props.teamChatMessageArray.length > 0){
                    // if(this.refs.scrollView) {
                    //     setTimeout(()=>{
                    //         // this.refs.scrollView.scrollToEnd({animated: true});
                    //         this.refs.scrollView.scrollToIndex({index:0, viewOffset: 1});
                    //     },200);
                    // }
                    this.showCharLimit(0);
                }
            }).catch(err => {
                showCustomAlert("Failed to send message.", "Brainbuddy", "Try again");
            });
        }else {
            showNoInternetAlert();
        }
    };

    onTextInputHeightChange = (height) => {
        this.setState({
            limitViewBottom: height + 13
        });
    }

    showCharLimit = (character) => {
        let length = 200 - character;
        if(length <= 50 && length >= 0) {
            this.setState({
                isShowLimit: true,
                limitChar: length
            });
        }else{
            if(this.state.isShowLimit){
                this.setState({
                    isShowLimit: false,
                });
            }
        }
    }

    onKeybordChange = () =>{
        // if(this.props.teamChatMessageArray.length > 0) {
        //     if(this.refs.scrollView) {
        //         this.refs.scrollView.scrollToIndex({index:0, viewOffset: 1});
        //         // this.refs.scrollView.scrollToEnd({animated: true});
        //     }
        // }
    };

    onInputBoxChange = () =>{
        if(this.props.teamChatMessageArray && this.props.teamChatMessageArray.length > 0){
            if(this.refs.scrollView){
                // this.refs.scrollView.scrollToEnd({animated: true});
            }
        }
    };

    getAvatarImage = (avatar_id) => {
        return getSmallAvatarImage(avatar_id || 0);
    };

    renderChatBubble = ({item, index}) => {
        if(item.type && item.type == "streak"){
            const goalMessage = (item.days == 1) && "24 hour clean streak" || item.days + " day clean streak";
            const goalDate = moment(item.occurred_at).format('MMM DD, YYYY')
            return <StreckGoalMessage memberName={(this.props.userId != item.member.id) && item.member.name || "You"}
                                      goalMessage={goalMessage}
                                      goalDate={goalDate}
                                      appTheme={this.props.appTheme}
                                      index={index}
                                      key={index}/>
        }else{
            return(
                (item.creator.is_current_user) &&
                <SenderChatBubble messageText={item.content}
                                  userImage={this.getAvatarImage(this.props.avatar_id)}
                                  personName={item.creator.name}
                                  isShowUser={item.isShowUser || false}
                                  appTheme={this.props.appTheme}
                                  index={index}
                                  key={index}/> ||
                <ReceiverChatBubble messageText={item.content}
                                    personName={item.creator.name}
                                    userImage={this.getAvatarImage(item.creator.avatar_id)}
                                    isShowUser={item.isShowUser || false}
                                    index={index}
                                    appTheme={this.props.appTheme}
                                    key={index}/>
            )
        }
    };

    onEndReachedChat = () => {
        try{
            if(this.props.isConnected) {
                if(!isApiCalling){
                     if(this.props.teamChatPagination && this.props.teamChatPagination.next_page_url) {
                        isApiCalling = true;
                        this.props.getTeamChat(this.props.teamChatPagination.next_page_url).then(res=>{
                            isApiCalling = false;
                        }).catch(err=>{
                            isApiCalling = false;
                        });
                    }else{
                         if(this.props.teamAchievementsPagination && this.props.teamAchievementsPagination.next_page_url) {
                             isApiCalling = true;
                             this.props.getTeamAchievements(this.props.teamAchievementsPagination.next_page_url,[],true).then(res=>{
                                 isApiCalling = false;
                             }).catch(err=>{
                                 isApiCalling = false;
                             });
                         }
                     }
                }
            }
        }catch (e) {
            isApiCalling = false;
            console.log("Team chat",e);
        }
    };

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <View style={[styles.container,{backgroundColor: appColor.scrollableViewBack}]}>
                {
                    (this.props.teamChatDisplayList && this.props.teamChatDisplayList.length === 0) &&
                    <NoDataFound placeHolderText={"No messages yet. \n Start the conversation!"}/>
                    ||
                    <FlatList showsVerticalScrollIndicator={true}
                              removeClippedSubviews={false}
                              inverted={true}
                              ref="scrollView"
                              keyboardDismissMode={"on-drag"}
                              data={this.props.teamChatDisplayList}
                              onEndReachedThreshold={0.5}
                              onEndReached={this.onEndReachedChat}
                              automaticallyAdjustContentInsets={false}
                              ListFooterComponent={
                                  <View style={{height:3}}/>
                              }
                              renderItem={this.renderChatBubble}/>
                }
                <View>
                    {
                        (this.state.isShowLimit) &&
                        <View style={[styles.outerView,{bottom: this.state.limitViewBottom,
                            backgroundColor: appColor.bottomChatInner}]}>
                            <Text style={styles.limitText}>
                                {this.state.limitChar + " characters remaining"}
                            </Text>
                        </View>
                    }
                    <BottomChatComponent onMessageSend={this.onMessageSend}
                                         onKeybordChange={this.onKeybordChange}
                                         showCharLimit={this.showCharLimit}
                                         onTextInputHeightChange={this.onTextInputHeightChange}
                                         placeHolderText={"Write a message"}
                                         maxLength={200}
                                         onInputBoxChange={this.onInputBoxChange}
                                         appTheme={this.props.appTheme}
                                         safeAreaInsetsData={this.props.safeAreaInsetsData}
                                         isBottomBar={true}
                                         isConnected={this.props.isConnected}/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constant.backProgressBarColor,
    },
    outerView:{
        alignSelf:'center',position:'absolute',
        paddingTop:5, paddingBottom:5,
        paddingLeft:10, paddingRight:10, borderRadius:50
    },
    limitText:{
        fontFamily: Constant.font500,textAlign:'center',
        color:Constant.greenColor, fontSize:13}
});

const mapStateToProps = state => {
    return {
        teamChatMessageArray:state.team.teamChatMessageArray,
        teamChatPagination:state.team.teamChatPagination,
        isConnected: state.user.isConnected,
        safeAreaInsetsData: state.user.safeAreaInsetsData,
        avatar_id:state.user.userDetails.avatar_id,
        appBadgeCount: state.user.appBadgeCount,
        visibleTab: state.user.visibleTab,
        notification_type:state.user.userDetails.notification_type || "",
        appTheme: state.user.appTheme,
        teamChatDisplayList: state.team.teamChatDisplayList,
        userId:state.user.userDetails.id || 0,
        teamAchievementsPagination: state.team.teamAchievementsPagination
    };
};

export default connect(mapStateToProps, {
    addTeamChat,
    getTeamChat,
    manageAppBadgeCount,
    getTeamAchievements
})(TeamChat);