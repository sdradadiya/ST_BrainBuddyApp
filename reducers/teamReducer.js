import { TEAM_DETAIL, TEAM_MEMBER_ARRAY,TEAM_CHAT_MESSAGE_ARRAY, INDIVIDUAL_LEADER_BOARD, TEAM_LEADER_BOARD,
    TEAM_ACHIEVEMENT_DETAILS, TEAM_CHAT_PAGINATION, TEAM_ACHIEVEMENTES_PAGINATION, TEAM_ACHIEVEMENTES, TEAM_CHAT_DISPLAY_LIST} from '../actions/types'

import {appDefaultReducer} from './defaultReducer';

const INITIAL_STATE = appDefaultReducer.team;

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case TEAM_DETAIL: {
            return {
                ...state,
                teamDetail: action.payload,
            };
        }
        case TEAM_MEMBER_ARRAY: {
            return {
                ...state,
                memberArray: action.payload,
            };
        }
        case TEAM_CHAT_MESSAGE_ARRAY: {
            return {
                ...state,
                teamChatMessageArray: action.payload,
            };
        }
        case TEAM_CHAT_PAGINATION: {
            return {
                ...state,
                teamChatPagination: action.payload,
            };
        }
        case INDIVIDUAL_LEADER_BOARD: {
            return {
                ...state,
                individualLeaderBoard: {
                    ...state.individualLeaderBoard,
                    [action.payload.key]:action.payload.values
                }
            };
        }
        case TEAM_LEADER_BOARD: {
            return {
                ...state,
                teamLeaderBoard: {
                    ...state.teamLeaderBoard,
                    [action.payload.key]:action.payload.values
                }
            };
        }
        case TEAM_ACHIEVEMENT_DETAILS: {
            return {
                ...state,
                teamAchievementDetail: action.payload
            };
        }
        case TEAM_ACHIEVEMENTES: {
            return {
                ...state,
                teamAchievements: action.payload
            };
        }
        case TEAM_ACHIEVEMENTES_PAGINATION: {
            return {
                ...state,
                teamAchievementsPagination:action.payload
            };
        }
        case TEAM_CHAT_DISPLAY_LIST: {
            return {
                ...state,
                teamChatDisplayList:action.payload
            };
        }
        default:
            return state;
    }
}

/*
 leaderBoardIndividualList: {
 ...state.leaderBoardIndividualList,
 action.payload.key:action.payload.value
 },
 * */