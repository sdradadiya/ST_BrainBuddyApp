import {
    HELP_POST_LIST,
    HELP_SORT_TYPE,
    HELP_PAGINATION_POST_LIST,
    HELP_POST_COMMENT_LIST,
    HELP_POST_COMMENT_PAGINATION_LIST
} from './types'
import {CallApi} from '../services/apiCall';
import Constant from '../services/apiConstant';
import _ from 'lodash';
import {calculateJournal} from "./statisticAction";
import {apiErrorHandler} from "./userActions";

export const getHelpPostDetail = (nextPageUrl = null) => {
    return (dispatch, getState) => {
        let apiUrl = Constant.baseUrlV2+Constant.helpPostPagination;
        if(nextPageUrl){
            apiUrl = nextPageUrl;
        }
        if(getState().helpPost.sortType == "new"){
            if(apiUrl.includes("?")){
                apiUrl = apiUrl+'&sort_by=most_recent';
            }else{
                apiUrl = apiUrl+'?sort_by=most_recent';
            }
        }else if(getState().helpPost.sortType == "top"){
            if(apiUrl.includes("?")){
                apiUrl = apiUrl+'&sort_by=most_commented';
            }else{
                apiUrl = apiUrl+'?sort_by=most_commented';
            }
        }else{
            if(apiUrl.includes("?")){
                apiUrl = apiUrl+'&sort_by=hottest';
            }else{
                apiUrl = apiUrl+'?sort_by=hottest';
            }
        }
        return CallApi(apiUrl,'get',{},{ "Authorization": "Bearer " + getState().user.token })
            .then((response) => {
                console.log("response -> get " + apiUrl);
                let helpPostDetail = [];
                if(nextPageUrl) {
                    helpPostDetail = helpPostDetail.concat(getState().helpPost.helpPostList);
                }
                helpPostDetail = helpPostDetail.concat(response.data);

                let obj = _.cloneDeep(response);
                delete obj['data'];
                helpPostDetail = _.uniqBy(helpPostDetail, 'id');
                // console.log(helpPostDetail);
                return Promise.all([
                    dispatch({
                        type: HELP_POST_LIST,
                        payload: helpPostDetail,
                    }),
                    dispatch({
                        type: HELP_PAGINATION_POST_LIST,
                        payload: obj
                    }),
                    // dispatch(sortHelpPost(getState().helpPost.isHelpPostSort, helpPostDetail))
                ]).then(res=>{
                    return Promise.resolve(true);
                });
            })
            .catch((error)=>{
                console.log("error -> get " + Constant.baseUrl+Constant.helpPost);
                // return Promise.reject(error);
                return dispatch(apiErrorHandler(error));
            })
    };
};

export const sortHelpPostRecent = (sortType) => {
    return (dispatch, getState) => {
        //let adviceList = getState().advice.adviceList;
        dispatch({
            type: HELP_PAGINATION_POST_LIST,
            payload: null
        });
        let apiUrl = Constant.baseUrlV2 + Constant.helpPostPagination;

        if(sortType == "new"){
            apiUrl = apiUrl+'?sort_by=most_recent'
        }else if(sortType == "top"){
            apiUrl = apiUrl+'?sort_by=most_commented'
        }else{
            apiUrl = apiUrl+'?sort_by=hottest'
        }

        // if (flag) {
        //     apiUrl = apiUrl + '?sort_by=most_commented';
        // }
        dispatch({
            type: HELP_SORT_TYPE,
            payload: sortType,
        });
        return CallApi(apiUrl, 'get', {}, {"Authorization": "Bearer " + getState().user.token})
            .then((response) => {
                console.log("response -> get " + apiUrl);
                let helpPostDetail = response.data;
                let obj = _.cloneDeep(response);
                delete obj['data'];
                helpPostDetail = _.uniqBy(helpPostDetail, 'id');
                // console.log(helpPostDetail);
                dispatch({
                    type: HELP_POST_LIST,
                    payload: []
                });
                return Promise.all([
                    dispatch({
                        type: HELP_POST_LIST,
                        payload: helpPostDetail,
                    }),
                    dispatch({
                        type: HELP_PAGINATION_POST_LIST,
                        payload: obj
                    }),
                    // dispatch(sortHelpPost(getState().helpPost.isHelpPostSort, helpPostDetail))
                ]).then(res => {
                    return Promise.resolve(true);
                })
                    .catch((error) => {
                        console.log("error -> get " + Constant.baseUrl + Constant.postAdvice);
                        // return Promise.reject(error);
                        return dispatch(apiErrorHandler(error));
                    })
            });
    }
};

export const getCommentByPostId = (id, nextPageUrl = null) => {
    return (dispatch, getState) => {
        if(nextPageUrl === null){
            dispatch({
                type: HELP_POST_COMMENT_LIST,
                payload: []
            })
        }
        let apiUrl = Constant.baseUrlV2+Constant.helpPostPagination + "/" + id + "/" + Constant.helpPostCommentPagination;
        if(nextPageUrl){
            apiUrl = nextPageUrl;
        }
        return CallApi(apiUrl,'get',{},{ "Authorization": "Bearer " + getState().user.token })
            .then((response) => {
                console.log("response -> get " + apiUrl);
                let commentDetail = [];
                if(nextPageUrl) {
                    commentDetail = commentDetail.concat(getState().helpPost.helpPostComment);
                }
                commentDetail = commentDetail.concat(response.data);
                // console.log(commentDetail);
                let obj = _.cloneDeep(response);
                delete obj['data'];

                commentDetail = _.uniqBy(commentDetail, 'id');

                return Promise.all([
                    dispatch({
                        type: HELP_POST_COMMENT_LIST,
                        payload: _.sortBy(commentDetail, obj => obj.id)
                    }),
                    dispatch({
                        type: HELP_POST_COMMENT_PAGINATION_LIST,
                        payload: obj
                    }),
                ]).then(res=>{
                    return Promise.resolve(true);
                });
            })
            .catch((error)=>{
                console.log("error -> get " + apiUrl);
                // return Promise.reject(error);
                return dispatch(apiErrorHandler(error));
            })
    };
};

// comment
export const addHelpComment = (comment, id, isReligious) => {
    return (dispatch, getState) => {
        let apiUrl = Constant.baseUrlV2+ Constant.helpPostPagination + "/" +id  + "/" + Constant.helpPostCommentPagination; // {{v2}}help-posts/865/comments;
        return CallApi(apiUrl,'post',{content: comment, is_religious: isReligious},
            { "Authorization": "Bearer " + getState().user.token })
            .then((response)=>{
                let commentDetail = _.cloneDeep(getState().helpPost.helpPostComment);
                commentDetail.push(response.data.data);
                commentDetail =  _.sortBy(commentDetail, obj => obj.id);
                dispatch({
                    type: HELP_POST_LIST,
                    payload:getState().helpPost.helpPostList.map((obj) => {
                        if(obj.id === id){
                            obj.user.has_commented=true;
                            if(obj.comments){
                                ++obj.comments.count;
                            }
                        }
                        return obj;
                    })
                });
                dispatch({
                    type: HELP_POST_COMMENT_LIST,
                    payload: commentDetail,
                });
                return Promise.resolve(response);
            })
            .catch((error)=>{
                // return Promise.reject(error);
                debugger
                return dispatch(apiErrorHandler(error));
            })
    };
};

//edit comment
export const editHelpComment = (commentData, postId, isReligious) => {
    return (dispatch, getState) => {
        let apiUrl = Constant.baseUrlV2+ Constant.helpPostPagination + "/" + postId  + "/" +
            Constant.helpPostCommentPagination + "/" + commentData.id;
        return CallApi(apiUrl,'patch',{content: commentData.content,  is_religious: isReligious},
            { "Authorization": "Bearer " + getState().user.token })
            .then((response)=>{
                let commentDetail = _.cloneDeep(getState().helpPost.helpPostComment);
                var index = _.findIndex(commentDetail, {id: commentData.id});
                commentDetail.splice(index, 1, response.data.data);
                dispatch({
                    type: HELP_POST_COMMENT_LIST,
                    payload: commentDetail,
                });
                return Promise.resolve(response);
            })
            .catch((error)=>{
                // return Promise.reject(error);
                return dispatch(apiErrorHandler(error));
            })
    };
};

// Help others - add help
export const addNewComment = (helpPost) => {
    return (dispatch, getState) => {
        return CallApi(Constant.baseUrlV2+Constant.helpPostPagination,'post',{content: helpPost.content, is_religious: helpPost.is_religious},
            { "Authorization": "Bearer " + getState().user.token })
            .then((response)=>{
                // dispatch(getHelpPostDetail());
                let helpData = _.cloneDeep(getState().helpPost.helpPostList);
                helpData.splice(0,0, response.data.data);
                dispatch({
                    type: HELP_POST_LIST,
                    payload: helpData,
                });
                return Promise.resolve(response);
            })
            .catch((error)=>{
                // return Promise.reject(error);
                return dispatch(apiErrorHandler(error));
            });
    };
};

//Help others - edit post
export const editHelpPost = (postData) => {
    return (dispatch, getState) => {
            let updateUrl = Constant.baseUrlV2+Constant.helpPostPagination+'/'+postData.id;
            return CallApi(updateUrl,'patch',{content: postData.content,is_religious: postData.is_religious},
                {"Authorization":"Bearer "+getState().user.token})
                .then((response)=> {
                    let helpData =  _.cloneDeep(getState().helpPost.helpPostList);
                    var index = _.findIndex(helpData, {id: postData.id});
                    helpData.splice(index, 1, response.data.data);
                    dispatch({
                        type: HELP_POST_LIST,
                        payload: helpData,
                    });
                    return Promise.resolve(response);
                })
                .catch((error)=>{
                    // return Promise.reject(error);
                    return dispatch(apiErrorHandler(error));
                })
        };
};

//Like Help Post
export const likeHelpPost = (id) => {
    return (dispatch, getState) => {
        dispatch({
            type: HELP_POST_LIST,
            payload:getState().helpPost.helpPostList.map((obj) => {
                if(obj.id === id){
                    obj.user.has_hearted=true;
                    if(obj.hearts){
                        ++obj.hearts.count;
                    }
                }
                return obj;
            })
        });
        return CallApi(Constant.baseUrlV2+Constant.helpPostPagination + "/" +id+'/heart','post',{},{ "Authorization": "Bearer " + getState().user.token })
            .then((response)=> {
                let helpPostData = _.cloneDeep(getState().helpPost.helpPostList);
                let objIndex = _.findIndex(helpPostData, {id: id});
                helpPostData[objIndex] = response.data.data.post;
                dispatch({
                    type: HELP_POST_LIST,
                    payload: helpPostData,
                });
                return Promise.resolve(response);
            })
            .catch((error)=>{
                // return Promise.reject(error);
                return dispatch(apiErrorHandler(error));
            })
    };
};

//Unlike Help Post
export const unlikeHelpPost = (id) => {
    return (dispatch, getState) => {
        dispatch({
            type: HELP_POST_LIST,
            payload:getState().helpPost.helpPostList.map((obj) => {
                if (obj.id === id) {
                    obj.user.has_hearted = false;
                    --obj.hearts.count;
                }
                return obj;
            })
        });
        return CallApi(Constant.baseUrlV2+Constant.helpPostPagination + "/" +id+'/heart','delete',{},
            { "Authorization": "Bearer " + getState().user.token })
            .then((response)=> {
                let helpPostData = _.cloneDeep(getState().helpPost.helpPostList);
                let objIndex = _.findIndex(helpPostData, {id: id});
                helpPostData[objIndex] = response.data.data.post;
                dispatch({
                    type: HELP_POST_LIST,
                    payload: helpPostData,
                });
                return Promise.resolve(response);
            })
            .catch((error)=>{
                return Promise.reject(error);
                return dispatch(apiErrorHandler(error));
            })
    }
};


//Like Help Post Comment
export const likeHelpPostComment = (postId, commentId) => {
    return (dispatch, getState) => {
        dispatch({
            type: HELP_POST_COMMENT_LIST,
            payload:getState().helpPost.helpPostComment.map((obj) => {
                if(obj.id === commentId){
                    obj.user.has_hearted=true;
                    if(obj.hearts) {
                        ++obj.hearts.count;
                    }
                }
                return obj;
            })
        });
        let apiUrl = Constant.baseUrlV2+Constant.helpPostPagination + "/" + postId + "/" + Constant.helpPostCommentPagination + "/" +commentId+'/heart';
        return CallApi(apiUrl,'post',{},{ "Authorization": "Bearer " + getState().user.token })
            .then((response)=> {
                let commentDetail = _.cloneDeep(getState().helpPost.helpPostComment);
                let objIndex = _.findIndex(commentDetail, {id: commentId});
                commentDetail[objIndex] = response.data.data.comment;
                dispatch({
                    type: HELP_POST_COMMENT_LIST,
                    payload: commentDetail,
                });
                return Promise.resolve(response);
            })
            .catch((error)=>{
                return Promise.reject(error);
            })
    };
};

//Unlike Help Post Comment
export const unlikeHelpPostComment = (postId,commentId) => {
    return (dispatch, getState) => {
        dispatch({
            type: HELP_POST_COMMENT_LIST,
            payload:getState().helpPost.helpPostComment.map((obj) => {
                if(obj.id === commentId){
                    obj.user.has_hearted = false;
                    --obj.hearts.count;
                }
                return obj;
            })
        });
        let apiUrl = Constant.baseUrlV2+Constant.helpPostPagination + "/" + postId + "/" + Constant.helpPostCommentPagination + "/" +commentId+'/heart';
        return CallApi(apiUrl,'delete',{},{ "Authorization": "Bearer " + getState().user.token })
            .then((response)=> {
                let commentDetail = _.cloneDeep(getState().helpPost.helpPostComment);
                let objIndex = _.findIndex(commentDetail, {id: commentId});
                commentDetail[objIndex] = response.data.data.comment;
                dispatch({
                    type: HELP_POST_COMMENT_LIST,
                    payload: commentDetail,
                });
                return Promise.resolve(response);
            })
            .catch((error)=>{
                return Promise.reject(error);
            });
    }
};

export const sortHelpPost = (flag, helpPostList) => {
    return (dispatch, getState) => {
        // let helpPostList = getState().helpPost.helpPostList;
        if(flag) {
            dispatch({
                type: HELP_POST_LIST,
                payload: _.sortBy(helpPostList, obj => obj.comments.count).reverse(),
            });
        }else{
            dispatch({
                type: HELP_POST_LIST,
                payload: _.sortBy(helpPostList, obj => obj.id).reverse(),
            });
        }
        return dispatch({
            type: HELP_SORT_TYPE,
            payload: flag,
        });
    };
};

