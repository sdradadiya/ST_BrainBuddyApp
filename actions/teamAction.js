import {
    TEAM_DETAIL,
    TEAM_MEMBER_ARRAY,
    TEAM_CHAT_MESSAGE_ARRAY,
    INDIVIDUAL_LEADER_BOARD,
    USER_USERNAME_EDIT,
    TEAM_LEADER_BOARD,
    TEAM_ACHIEVEMENT_DETAILS,
    TEAM_CHAT_PAGINATION,
    ENCOURAGE_POPUP,
    TEAM_ACHIEVEMENTES,
    TEAM_ACHIEVEMENTES_PAGINATION,
    TEAM_CHAT_DISPLAY_LIST, CONGRATULATE_POPUP
} from './types'
import {CallApi} from '../services/apiCall';
import Constant from '../services/apiConstant';
import _ from 'lodash';
import {apiErrorHandler, manageAppBadgeCount} from "./userActions";
import AppConstant from '../helper/constant';
import { AsyncStorage } from 'react-native';
import {calculatePornDay} from "./statisticAction";
import moment from 'moment';

export const getTeamDetail = () => {
    return (dispatch, getState) => {
        return CallApi(Constant.baseUrlV2+Constant.getTeamDetail,'get',{},{"Authorization":"Bearer "+getState().user.token })
            .then((response)=> {
                console.log("response -> get " + Constant.baseUrl+Constant.getTeam);
                let members = response.data.members;
                members.sort(compare);
                let maxVal = members[0].porn_free_days.total;
                members.map(obj => {
                    obj.progressVal = parseInt((obj.porn_free_days.total/maxVal) * 100) + "%";
                    if(obj.is_current_user) {
                        dispatch({
                            type:USER_USERNAME_EDIT,
                            payload:(obj.name) ? obj.name : "Unknown"
                        });
                        obj.name = (obj.name) ? "You (" + obj.name + ")" : "You (null)";
                        obj.porn_free_days.longest_streak = getState().statistic.pornDetail.best_p_clean_days || 0;
                        obj.porn_free_days.current_streak = getState().statistic.pornDetail.current_p_clean_days || 0;
                    }else{
                        obj.name = (obj.name) ? obj.name : "null";
                    }
                    return obj;
                });
                const teamDetail = {
                    name: response.data.name,
                    rankings: response.data.ranking,
                    porn_free_days: response.data.porn_free_days,
                };
                if(JSON.stringify(getState().team.teamDetail) !== teamDetail){
                    dispatch({
                        type: TEAM_DETAIL,
                        payload: teamDetail,
                    });
                }
                if(JSON.stringify(getState().team.memberArray) !== members){
                    dispatch({
                        type: TEAM_MEMBER_ARRAY,
                        payload: members,
                    });
                }
                dispatch(
                    calculateTeamAchievements()
                );
            })
            .catch((error)=>{
                console.log("error -> get " + Constant.baseUrl+Constant.getTeam);
                // return Promise.reject(error);
                return dispatch(apiErrorHandler(error));
            })
    };
};

export const getTeamChat = (nextPageUrl = null, isBadgeCount = false) => {
    return (dispatch, getState) => {
        let apiUrl = Constant.baseUrlV2+Constant.teamChatPagination;
        if(nextPageUrl) {
            apiUrl = nextPageUrl;
        }
        return CallApi(apiUrl,'get',{},{"Authorization":"Bearer "+getState().user.token })
            .then((response)=>{
                console.log("response -> get " + apiUrl);
                //Managed Badge count
                if(!nextPageUrl && AppConstant.isANDROID){
                    try {
                        if(response.data && response.data.length > 0){
                            let lastMessageId = response.data[0].id.toString();
                            if(isBadgeCount) {
                                AsyncStorage.getItem("lastMessageId").then(res => {
                                    if (res) {
                                        let asyncLastMessageId = parseInt(res);
                                        let lastObj = _.find(response.data, {id: asyncLastMessageId});
                                        let indexOfLast = response.data.indexOf(lastObj);
                                        let newMessages = response.data.slice(0, indexOfLast);
                                        let allOtherUsers = _.filter(newMessages, x => x.creator.is_current_user === false);
                                        let totalCount = getState().user.appBadgeCount + allOtherUsers.length;
                                        dispatch(manageAppBadgeCount(totalCount));
                                    }
                                    AsyncStorage.setItem("lastMessageId", lastMessageId);
                                });
                            }else{
                                AsyncStorage.setItem("lastMessageId", lastMessageId);
                            }
                        }
                    }catch (e){
                    }
                }

                let teamChat = getState().team.teamChatMessageArray || [];
                if(nextPageUrl) {
                    teamChat = teamChat.concat(response.data);
                }else{
                    teamChat = response.data;
                }
                let obj = _.cloneDeep(response);
                delete obj['data'];
                teamChat = _.uniqBy(teamChat, 'id');
                teamChat = _.sortBy(teamChat, obj => obj.id);
                if(nextPageUrl){
                    let nextUrl = getState().team.teamAchievementsPagination;
                    if(nextUrl.next_page_url){
                        dispatch(getTeamAchievements(nextUrl.next_page_url, teamChat));
                    }else{
                        if(obj.next_page_url){
                            dispatch(combineTeamChatAndAchievements(teamChat, getState().team.teamAchievements, true, false));
                        }else{
                            dispatch(combineTeamChatAndAchievements(teamChat, getState().team.teamAchievements, false, false));
                        }
                    }
                }else{
                    dispatch(getTeamAchievements(null, teamChat));
                }
                return Promise.all([
                    dispatch({
                        type: TEAM_CHAT_MESSAGE_ARRAY,
                        payload: teamChat.reverse(),
                    }),
                    dispatch({
                        type: TEAM_CHAT_PAGINATION,
                        payload: obj
                    }),
                ]).then(res=>{
                    return Promise.resolve(true);
                });
            })
            .catch((error)=>{
                console.log("error getTeamChat-> get " + apiUrl);
                return dispatch(apiErrorHandler(error));
            })
    };
};

export const getTeamAchievements = (nextPageUrl = null, teamChat = [], noMoreChat = false) => {
    return (dispatch, getState) => {
        let apiUrl = Constant.baseUrlV2+Constant.teamAchievements;
        if(nextPageUrl) {
            apiUrl = nextPageUrl;
        }
        return CallApi(apiUrl,'get',{},{"Authorization":"Bearer "+getState().user.token})
            .then((response)=>{
                console.log("response -> get " + apiUrl);
                let teamAchiements = getState().team.teamAchievements || [];
                if(nextPageUrl) {
                    teamAchiements = teamAchiements.concat(response.data);
                }else{
                    teamAchiements = response.data;
                }
                teamAchiements = _.uniqBy(teamAchiements, 'id');
                let obj = _.cloneDeep(response);
                delete obj['data'];

                if(noMoreChat){
                    let teamChatList = getState().team.teamChatMessageArray || [];
                    if(obj.next_page_url){
                        dispatch(combineTeamChatAndAchievements(teamChatList, teamAchiements, false, true));
                    }else{
                        dispatch(combineTeamChatAndAchievements(teamChatList, teamAchiements, false, false));
                    }
                }else{
                    let teamChatPagination = getState().team.teamChatPagination;
                    let isNextTeamchatPage = (teamChatPagination.next_page_url != null);
                    let isNextAchievementsPage = (obj.next_page_url != null);
                    dispatch(combineTeamChatAndAchievements(teamChat, teamAchiements, isNextTeamchatPage, isNextAchievementsPage));
                }
                dispatch({
                    type: TEAM_ACHIEVEMENTES,
                    payload: teamAchiements,
                });
                dispatch({
                    type: TEAM_ACHIEVEMENTES_PAGINATION,
                    payload: obj
                })
                // return Promise.all([
                //     dispatch({
                //         type: TEAM_ACHIEVEMENTES,
                //         payload: teamAchiements,
                //     }),
                //     dispatch({
                //         type: TEAM_ACHIEVEMENTES_PAGINATION,
                //         payload: obj
                //     }),
                // ]).then(res=>{
                    return Promise.resolve(true);
                // });
            })
            .catch((error)=>{
                console.log("error getTeamAchievements-> get " + apiUrl);
                return dispatch(apiErrorHandler(error));
            })
    };
};

export const combineTeamChatAndAchievements = (teamChatList, achievements, teamChatHasNextUrl, teamAchievementsHasNextUrl) => {
    return (dispatch, getState) => {
        try{
            let teamChat = teamChatList;
            teamChat = _.sortBy(teamChat, obj => obj.id);
            achievements = _.filter(achievements,{type:'streak'});
            achievements = _.sortBy(achievements, function(o) { return new moment(o.occurred_at); });
            let newList = [];
            newList = newList.concat(teamChat);
            newList = newList.concat(achievements);
            newList = _.sortBy(newList, function(o) { return new moment(o.occurred_at); });
            let teamchatDate = teamChat[0] || undefined;
            let achievementDate = achievements[0] || undefined;
            if(teamChatHasNextUrl || teamAchievementsHasNextUrl){
                if(teamchatDate != undefined && achievementDate != undefined){
                    let isTeamChatMax = false;
                    let maxDateToDisplay = moment();
                    if(moment(teamchatDate.occurred_at).toDate() > moment(achievementDate.occurred_at).toDate()){
                        isTeamChatMax = true;
                        maxDateToDisplay = moment(teamchatDate.occurred_at);
                    }else{
                        maxDateToDisplay = moment(achievementDate.occurred_at);
                    }
                    _.remove(newList,item => (!moment(item.occurred_at).isSame(maxDateToDisplay))
                        ? moment(item.occurred_at).isBefore(maxDateToDisplay):true);
                }
            }
            newList.map((team,index)=>{
                let nextIndex = index+1;
                team.isShowUser = false;
                if(newList.length > nextIndex) {
                    let nextMessage = newList[nextIndex];
                    if(nextMessage.type){
                        team.isShowUser = true;
                    }else if (team.creator && team.creator.id !== nextMessage.creator.id) {
                        team.isShowUser = true;
                    }
                }
            });
            newList = newList.reverse();
            dispatch({
                type: TEAM_CHAT_DISPLAY_LIST,
                payload: newList
            })
        }catch (e){
            if(__DEV__){
                alert(e)
            }
        }
    }
};

export const addTeamChat = (objMessage, messageType = "", achievementObjID = 0) => {
    return (dispatch, getState) => {
        return CallApi(Constant.baseUrlV2+Constant.teamChatPagination,'post',objMessage,
            { "Authorization": "Bearer " + getState().user.token })
            .then((response)=>{
                if(messageType == "Encourage"){
                    let encourageDetail = _.cloneDeep(getState().user.encouragePopup.encourageDetail);
                    let obj = _.find(encourageDetail,{id: objMessage.recipient_user_id});
                    if(obj){
                        let indexOfMessage = encourageDetail.indexOf(obj)
                        if (indexOfMessage >= 0) {
                            encourageDetail.splice(indexOfMessage, 1);
                        }
                    }
                    encourageDetail.push({
                        id: objMessage.recipient_user_id,
                        dateTime: response.data.data.occurred_at
                    });
                    dispatch({
                        type:ENCOURAGE_POPUP,
                        payload:{
                            isShow: false,
                            default: getState().user.encouragePopup.detail,
                            encourageDetail: encourageDetail}});
                }else if(messageType == "Congratulate"){
                    let congratulateDetails = _.cloneDeep(getState().user.congratulatePopup);
                    let obj = _.find(congratulateDetails.congratulateDetail,{id: achievementObjID});
                    if(obj == undefined) {
                        congratulateDetails.congratulateDetail.push({
                            dateTime:response.data.data.occurred_at,
                            id: achievementObjID
                        });
                        dispatch({
                            type: CONGRATULATE_POPUP,
                            payload: congratulateDetails
                        });
                    }
                }
                let chatDetail = getState().team.teamChatMessageArray;
                chatDetail.splice(0,0,response.data.data);
                // let teamAchiements = getState().team.teamAchievements || [];
                // dispatch(combineTeamChatAndAchievements(chatDetail,teamAchiements));
                let teamChatDisplayList = _.cloneDeep(getState().team.teamChatDisplayList) || [];
                teamChatDisplayList.splice(0,0,response.data.data);
                dispatch({
                    type: TEAM_CHAT_DISPLAY_LIST,
                    payload: teamChatDisplayList
                })

                dispatch({
                    type: TEAM_CHAT_MESSAGE_ARRAY,
                    payload: chatDetail,
                });
                return Promise.resolve(response);
            })
            .catch((error)=>{
                // return Promise.reject(error);
                return dispatch(apiErrorHandler(error));
            })
    };
};

function compare(a, b) {
    const genreA = (a.porn_free_days.total != undefined) && a.porn_free_days.total || a.porn_free_days.counts.total;
    const genreB = (b.porn_free_days.total != undefined) && b.porn_free_days.total || b.porn_free_days.counts.total;
    let comparison = 0;
    if (genreA < genreB) {
        comparison = 1;
    } else if (genreA > genreB) {
        comparison = -1;
    }
    return comparison;
}

//Leader board
export const getleaderboardIndividualList = (isFromLogin = false) => {
    return (dispatch, getState) => {
        return CallApi(Constant.baseUrl+Constant.leaderBoardIndividual,'get',{},{"Authorization":"Bearer "+getState().user.token })
            .then((response) => {
                console.log("response -> get " + Constant.baseUrl+Constant.leaderBoardIndividual);
                if(!isFromLogin){
                    //dispatch(getLeaderBoardIndividualPornFreeDays());
                    dispatch(getLeaderBoardIndividualCurrentStreak());
                    dispatch(getLeaderBoardIndividualBestStreak());
                    dispatch(getLeaderBoardIndividualYear());
                    dispatch(getLeaderBoardIndividualMonth());
                    dispatch(getLeaderBoardIndividualWeek());
                    dispatch(getLeaderBoardIndividualAmerica());
                    dispatch(getLeaderBoardIndividualAsia());
                    dispatch(getLeaderBoardIndividualEurope());
                    dispatch(getLeaderBoardIndividualPacific());
                }
                dispatch({
                    type: INDIVIDUAL_LEADER_BOARD,
                    payload: {
                        key: "overall",
                        values: response.data.users
                    }
                });
                return Promise.resolve()
            }).catch((err) => {
                console.log("error -> get " + Constant.baseUrl+Constant.leaderBoardIndividual);
                // return Promise.reject(err);
                return dispatch(apiErrorHandler(err));
            })
    }
};

export const getLeaderBoardIndividualFilterData = (stateLabel) => {
    return(dispatch, getState) => {
        console.log("stateLabel::::"+stateLabel)
        switch (stateLabel)
        {
            case "Overall":
                return dispatch(getleaderboardIndividualList(true))
            case "This year":
                return dispatch(getLeaderBoardIndividualYear())
            case "This month":
                return dispatch(getLeaderBoardIndividualMonth())
            case "This week":
                return dispatch(getLeaderBoardIndividualWeek())
            case "America":
                return dispatch(getLeaderBoardIndividualAmerica())
            case "Europe":
                return dispatch(getLeaderBoardIndividualEurope())
            case "Asia":
                return dispatch(getLeaderBoardIndividualAsia())
            case "Pacific":
                return dispatch(getLeaderBoardIndividualPacific())
        }
    }
}

export const getLeaderBoardIndividualYear = () => {
    return (dispatch, getState) => {
        return CallApi(Constant.baseUrl+Constant.leaderBoardIndividualYear,'get',{},{"Authorization":"Bearer "+getState().user.token })
            .then((response) => {
                console.log("response -> get " + Constant.baseUrl+Constant.leaderBoardIndividualYear);
                dispatch({
                    type: INDIVIDUAL_LEADER_BOARD,
                    payload: {
                        key: "year",
                        values: response.data.users
                    }
                });
                return Promise.resolve()
            }).catch((err) => {
                // return Promise.reject(err);
                return dispatch(apiErrorHandler(err));
            })
    }
};

export const getLeaderBoardIndividualMonth = () => {
    return (dispatch, getState) => {
        return CallApi(Constant.baseUrl+Constant.leaderBoardIndividualMonth,'get',{},{"Authorization":"Bearer "+getState().user.token })
            .then((response) => {
                console.log("response -> get " + Constant.baseUrl+Constant.leaderBoardIndividualMonth);
                dispatch({
                    type: INDIVIDUAL_LEADER_BOARD,
                    payload: {
                        key: "month",
                        values: response.data.users
                    }
                });
                return Promise.resolve()
            }).catch((err) => {
                // return Promise.reject(err);
                return dispatch(apiErrorHandler(err));
            })
    }
};

export const getLeaderBoardIndividualWeek = () => {
    return (dispatch, getState) => {
        return CallApi(Constant.baseUrl+Constant.leaderBoardIndividualWeek,'get',{},{"Authorization":"Bearer "+getState().user.token })
            .then((response) => {
                console.log("response -> get " + Constant.baseUrl+Constant.leaderBoardIndividualWeek);
                dispatch({
                    type: INDIVIDUAL_LEADER_BOARD,
                    payload: {
                        key: "week",
                        values: response.data.users
                    }
                });
                return Promise.resolve()
            }).catch((err) => {
                // return Promise.reject(err);
                return dispatch(apiErrorHandler(err));
            })
    }
};

export const getLeaderBoardIndividualBestStreak = () => {
    return (dispatch, getState) => {
        return CallApi(Constant.baseUrl+Constant.leaderBoardIndividualBestStreak,'get',{},{"Authorization":"Bearer "+getState().user.token })
            .then((response) => {
                console.log("response -> get " + Constant.baseUrl+Constant.leaderBoardIndividualBestStreak);
                return dispatch({
                    type: INDIVIDUAL_LEADER_BOARD,
                    payload: {
                        key: "bestStreak",
                        values: response.data.users
                    }
                });
            }).catch((err) => {
                // return Promise.reject(err);
                return dispatch(apiErrorHandler(err));
            })
    }
};

export const getLeaderBoardIndividualCurrentStreak = () => {
    return (dispatch, getState) => {
        return CallApi(Constant.baseUrl+Constant.leaderBoardIndividualCurrentStreak,'get',{},{"Authorization":"Bearer "+getState().user.token })
            .then((response) => {
                console.log("response -> get " + Constant.baseUrl+Constant.leaderBoardIndividualCurrentStreak);
                return dispatch({
                    type: INDIVIDUAL_LEADER_BOARD,
                    payload: {
                        key: "currentStreak",
                        values: response.data.users
                    }
                });
            }).catch((err) => {
                // return Promise.reject(err);
                return dispatch(apiErrorHandler(err));
            })
    }
};

export const getLeaderBoardIndividualAmerica = () => {
    return (dispatch, getState) => {
        return CallApi(Constant.baseUrl+Constant.leaderBoardIndividualAmerica,'get',{},{"Authorization":"Bearer "+getState().user.token })
            .then((response) => {
                console.log("response -> get " + Constant.baseUrl+Constant.leaderBoardIndividualAmerica);
                dispatch({
                    type: INDIVIDUAL_LEADER_BOARD,
                    payload: {
                        key: "america",
                        values: response.data.users
                    }
                });
                return Promise.resolve()

            }).catch((err) => {
                // return Promise.reject(err);
                return dispatch(apiErrorHandler(err));
            })
    }
};

export const getLeaderBoardIndividualAsia = () => {
    return (dispatch, getState) => {
        return CallApi(Constant.baseUrl+Constant.leaderBoardIndividualAsia,'get',{},{"Authorization":"Bearer "+getState().user.token })
            .then((response) => {
                console.log("response -> get " + Constant.baseUrl+Constant.leaderBoardIndividualAsia);
                dispatch({
                    type: INDIVIDUAL_LEADER_BOARD,
                    payload: {
                        key: "asia",
                        values: response.data.users
                    }
                });
                return Promise.resolve()

            }).catch((err) => {
                return Promise.reject(err);
            })
    }
};

export const getLeaderBoardIndividualEurope = () => {
    return (dispatch, getState) => {
        return CallApi(Constant.baseUrl+Constant.leaderBoardIndividualEurope,'get',{},{"Authorization":"Bearer "+getState().user.token })
            .then((response) => {
                console.log("response -> get " + Constant.baseUrl+Constant.leaderBoardIndividualEurope);
                dispatch({
                    type: INDIVIDUAL_LEADER_BOARD,
                    payload: {
                        key: "europe",
                        values: response.data.users
                    }
                });
                return Promise.resolve()

            }).catch((err) => {
                // return Promise.reject(err);
                return dispatch(apiErrorHandler(err));
            })
    }
};

export const getLeaderBoardIndividualPacific = () => {
    return (dispatch, getState) => {
        return CallApi(Constant.baseUrl+Constant.leaderBoardIndividualPacific,'get',{},{"Authorization":"Bearer "+getState().user.token })
            .then((response) => {
                console.log("response -> get " + Constant.baseUrl+Constant.leaderBoardIndividualPacific);
                dispatch({
                    type: INDIVIDUAL_LEADER_BOARD,
                    payload: {
                        key: "pacific",
                        values: response.data.users
                    }
                });
                return Promise.resolve()

            }).catch((err) => {
                return Promise.reject(err);
            })
    }
};

export const getleaderboardTeamList = (isFromLogin = false) => {
    return (dispatch, getState) => {
        return CallApi(Constant.baseUrl+Constant.leaderBoardTeam,'get',{},{"Authorization":"Bearer "+getState().user.token })
            .then((response) => {
                console.log("response->" + Constant.baseUrl+Constant.leaderBoardTeam);
                if(!isFromLogin){
                    dispatch(getLeaderBoardTeamYear());
                    dispatch(getLeaderBoardTeamMonth());
                    dispatch(getLeaderBoardTeamWeek());
                }
                dispatch({
                    type: TEAM_LEADER_BOARD,
                    payload: {
                        key: "overall",
                        values: response.data.teams
                    }
                });
                return Promise.resolve()
            }).catch((err) => {
                // return Promise.reject(err);
                return dispatch(apiErrorHandler(err));
            })
    }
};

export const getLeaderBoardTeamFilterData = (stateLabel) => {
    return(dispatch, getState) => {
        console.log("stateLabel::::"+stateLabel)
        switch (stateLabel)
        {
            case "Overall":
                return dispatch(getleaderboardTeamList(true))
            case "This year":
                return dispatch(getLeaderBoardTeamYear())
            case "This month":
                return dispatch(getLeaderBoardTeamMonth())
            case "This week":
                return dispatch(getLeaderBoardTeamWeek())
        }
    }
};

export const getLeaderBoardTeamYear = () => {
    return (dispatch, getState) => {
        return CallApi(Constant.baseUrl+Constant.leaderBoardTeamYear,'get',{},{"Authorization":"Bearer "+getState().user.token })
            .then((response) => {
                dispatch({
                    type: TEAM_LEADER_BOARD,
                    payload: {
                        key: "year",
                        values: response.data.teams
                    }
                });
                return Promise.resolve()
            }).catch((err) => {
                // return Promise.reject(err);
                return dispatch(apiErrorHandler(err));
            })
    }
};

export const getLeaderBoardTeamMonth = () => {
    return (dispatch, getState) => {
        return CallApi(Constant.baseUrl+Constant.leaderBoardTeamMonth,'get',{},{"Authorization":"Bearer "+getState().user.token })
            .then((response) => {
                dispatch({
                    type: TEAM_LEADER_BOARD,
                    payload: {
                        key: "month",
                        values: response.data.teams
                    }
                });
                return Promise.resolve()

            }).catch((err) => {
                // return Promise.reject(err);
                return dispatch(apiErrorHandler(err));
            })
    }
};

export const getLeaderBoardTeamWeek = () => {
    return (dispatch, getState) => {
        return CallApi(Constant.baseUrl+Constant.leaderBoardTeamWeek,'get',{},{"Authorization":"Bearer "+getState().user.token })
            .then((response) => {
                dispatch({
                    type: TEAM_LEADER_BOARD,
                    payload: {
                        key: "week",
                        values: response.data.teams
                    }
                });
                return Promise.resolve()
            }).catch((err) => {
                // return Promise.reject(err);
                return dispatch(apiErrorHandler(err));
            })
    }
};

export const calculateTeamAchievements = () => {
    return (dispatch, getState) => {
        let teamCleanDay = 0;

        if(getState().team.teamDetail.porn_free_days){
            if(getState().team.teamDetail.porn_free_days.total){
                teamCleanDay =  getState().team.teamDetail.porn_free_days.total || 0;
            }else{
                teamCleanDay =  getState().team.teamDetail.porn_free_days.counts.total || 0;
            }
        }

        let teamAchievements = [
            { icon: "B", val: "10"},
            { icon: "B", val: "30"},
            { icon: "B", val: "50"},
            { icon: "B", val: "100"},
            { icon: "B", val: "180"},
            { icon: "B", val: "365"},
            { icon: "B", val: "500"},
            { icon: "B", val: "1000"},
        ];

        let caseVal = -1;
        if(teamCleanDay > 1000) {
            caseVal = 7;
        }else if(teamCleanDay > 500){
            caseVal = 6;
        }else if(teamCleanDay > 365){
            caseVal = 5;
        }else if(teamCleanDay > 180){
            caseVal = 4;
        }else if(teamCleanDay > 100){
            caseVal = 3;
        }else if(teamCleanDay > 50){
            caseVal = 2;
        }else if(teamCleanDay > 30){
            caseVal = 1;
        }else if(teamCleanDay > 10){
            caseVal = 0;
        }
        for(let i=0; i<=caseVal; i++){
            teamAchievements[i]["icon"] = "Y";
        }
        if(JSON.stringify(getState().team.teamAchievementDetail) !== teamAchievements){
            dispatch({
                type: TEAM_ACHIEVEMENT_DETAILS,
                payload: teamAchievements
            });
        }

        return Promise.resolve({
            teamAchievements
        });
    }
};

//Mutes Team Member
export const muteTeamMember = (userId) => {
    return (dispatch, getState) => {
        let muteUrl = Constant.baseUrlV2+Constant.users+userId+"/"+Constant.mute;
        return CallApi(muteUrl,'post',{},
            {"Authorization":"Bearer "+getState().user.token})
            .then((response) => {
                let teamData = getState().team.memberArray;
                let obj = _.find(teamData, {id: userId});
                let indexOfMember = teamData.indexOf(obj);
                teamData[indexOfMember].current_user_has_muted = true;
                dispatch({
                    type: TEAM_MEMBER_ARRAY,
                    payload: _.cloneDeep(teamData),
                });
                //return dispatch(getTeamDetail())
                return Promise.resolve(response)
            }).catch((err) => {
                // return Promise.reject(err);
                return dispatch(apiErrorHandler(err));
            })
    }
};

//UnMute Team Member
export const unMuteTeamMember = (userId) => {
    return (dispatch, getState) => {
        let muteUrl = Constant.baseUrlV2+Constant.users+userId+"/"+Constant.mute;
        return CallApi(muteUrl,'delete',{},{"Authorization":"Bearer "+getState().user.token})
            .then((response) => {
                let teamData = getState().team.memberArray;
                let obj = _.find(teamData, {id: userId});
                let indexOfMember = teamData.indexOf(obj);
                teamData[indexOfMember].current_user_has_muted = false;
                dispatch({
                    type: TEAM_MEMBER_ARRAY,
                    payload: _.cloneDeep(teamData),
                });
                //return dispatch(getTeamDetail())
                return Promise.resolve(response);
            }).catch((err) => {
                // return Promise.reject(err);
                return dispatch(apiErrorHandler(err));
            })
    }
};