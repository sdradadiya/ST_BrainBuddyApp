import {
    ADD_ADVICE_DETAIL, ADVICE_POST_LIST, ADVICE_SORT_TYPE, ADVICE_PAGINATION_POST_LIST,
    ADVICE_POST_COMMENT_LIST, ADVICE_COMMENT_PAGINATION_LIST, HELP_POST_LIST, HELP_POST_COMMENT_LIST
} from './types'
import {CallApi} from '../services/apiCall';
import Constant from '../services/apiConstant';
import _  from 'lodash';
import {apiErrorHandler} from "./userActions";

export const getAdviceDetail = (nextPageUrl = null) => {
    return (dispatch, getState) => {
        let apiUrl = Constant.baseUrlV2+Constant.postAdvicePagination;
        if(nextPageUrl){
            apiUrl = nextPageUrl;
        }
        if(getState().advice.sortType == "new"){
            if(apiUrl.includes("?")){
                apiUrl = apiUrl+'&sort_by=most_recent';
            }else{
                apiUrl = apiUrl+'?sort_by=most_recent';
            }
        }else if(getState().advice.sortType == "top"){
            if(apiUrl.includes("?")){
                apiUrl = apiUrl+'&sort_by=most_hearted';
            }else{
                apiUrl = apiUrl+'?sort_by=most_hearted';
            }
        }else{
            if(apiUrl.includes("?")){
                apiUrl = apiUrl+'&sort_by=hottest';
            }else{
                apiUrl = apiUrl+'?sort_by=hottest';
            }
        }
        // if(getState().advice.isHeartSort){
        //     if(nextPageUrl){
        //         apiUrl = apiUrl+'&sort_by=most_hearted'
        //     }else{
        //         apiUrl = apiUrl+'?sort_by=most_hearted'
        //     }
        // }
        return CallApi(apiUrl,'get',{},{ "Authorization": "Bearer " + getState().user.token })
            .then((response) => {
                console.log("response -> get " + apiUrl);
                let adviceDetail = [];
                if(nextPageUrl) {
                    adviceDetail = adviceDetail.concat(getState().advice.adviceList);
                }
                adviceDetail = adviceDetail.concat(response.data);
                let obj = _.cloneDeep(response);
                delete obj['data'];
                adviceDetail = _.uniqBy(adviceDetail, 'id');

                // console.log(adviceDetail);

                return Promise.all([
                    dispatch({
                        type: ADVICE_POST_LIST,
                        payload: adviceDetail,
                    }),
                    dispatch({
                        type: ADVICE_PAGINATION_POST_LIST,
                        payload: obj
                    }),
                    // dispatch(sortAdvice(getState().advice.isHeartSort, adviceDetail))
                ]).then(res=>{
                    return Promise.resolve(true);
                });
            })
            .catch((error)=> {
                debugger
                console.log("error -> get " + apiUrl);
                // return Promise.reject(error);
                return dispatch(apiErrorHandler(error));
            })
    };
};

export const sortAdviceRecent = (sortyType) => {
    return (dispatch, getState) => {
        //let adviceList = getState().advice.adviceList;
        dispatch({
            type: ADVICE_PAGINATION_POST_LIST,
            payload: null
        })
        let apiUrl = Constant.baseUrlV2+Constant.postAdvicePagination;

        // if(flag){
        //     apiUrl = apiUrl+'?sort_by=most_hearted'
        // }

        if(sortyType == "new"){
            apiUrl = apiUrl+'?sort_by=most_recent'
        }else if(sortyType == "top"){
            apiUrl = apiUrl+'?sort_by=most_hearted'
        }else{
            apiUrl = apiUrl+'?sort_by=hottest'
        }

        dispatch({
            type: ADVICE_SORT_TYPE,
            payload: sortyType,
        });

        return CallApi(apiUrl,'get',{},{ "Authorization": "Bearer " + getState().user.token })
            .then((response) => {
                console.log("response -> get " + apiUrl);
                let adviceDetail = response.data;
                let obj = _.cloneDeep(response);
                delete obj['data'];
                adviceDetail = _.uniqBy(adviceDetail, 'id');
                dispatch({
                    type: ADVICE_POST_LIST,
                    payload: []
                });
                return Promise.all([
                    dispatch({
                        type: ADVICE_POST_LIST,
                        payload: adviceDetail,
                    }),
                    dispatch({
                        type: ADVICE_PAGINATION_POST_LIST,
                        payload: obj
                    }),
                    // dispatch(sortAdvice(getState().advice.isHeartSort, adviceDetail))

                    // dispatch({
                    //     type: ADVICE_POST_LIST,
                    //     // payload: getState().advice.adviceList.sort(compareByHeart),
                    //     payload: adviceDetail,
                    // })

                ]).then(res=>{
                    return Promise.resolve(true);
                });
            })
            .catch((error)=> {
                console.log("error -> get " + Constant.baseUrl+Constant.postAdvice);
                // return Promise.reject(error);
                return dispatch(apiErrorHandler(error));
            })
    };
};

export const postAdvice = (advice) => {
    return (dispatch, getState) => {
        return CallApi(Constant.baseUrlV2+Constant.postAdvicePagination,'post',advice,
            { "Authorization": "Bearer " + getState().user.token })
            .then((response)=>{
                console.log("response -> get " + Constant.baseUrlV2+Constant.postAdvicePagination);
                // dispatch(getAdviceDetail());
                // console.log(response.data.data);
                let adviceData = _.cloneDeep(getState().advice.adviceList);
                adviceData.splice(0,0, response.data.data);
                dispatch({
                    type: ADVICE_POST_LIST,
                    payload: adviceData,
                });

                return Promise.resolve(response);
            })
            .catch((error)=>{
                // return Promise.reject(error);
                return dispatch(apiErrorHandler(error));
            })
    };
};

//Advice post - edit post
export const editAdvicePost = (postData) => {
    return (dispatch, getState) => {
        let updateUrl = Constant.baseUrlV2+Constant.postAdvicePagination+'/'+postData.id;
        return CallApi(updateUrl,'patch',{content: postData.content, is_religious: postData.is_religious},
            {"Authorization":"Bearer "+getState().user.token})
            .then((response)=> {
                let adviceData = _.cloneDeep(getState().advice.adviceList);
                var index = _.findIndex(adviceData, {id: postData.id});
                adviceData.splice(index,1, response.data.data);
                dispatch({
                    type: ADVICE_POST_LIST,
                    payload: adviceData,
                });
                return Promise.resolve(response);
            })
            .catch((error)=>{
                // return Promise.reject(error);
                return dispatch(apiErrorHandler(error));
            })
    };
};

export const likePost = (id) => {
    return (dispatch, getState) => {
        dispatch({
            type: ADVICE_POST_LIST,
            payload:getState().advice.adviceList.map((obj) => {
                if(obj.id === id){
                    obj.user.has_hearted=true;
                    if(obj.hearts){
                        ++obj.hearts.count;
                    }
                }
                return obj;
            })
        });
        return CallApi(Constant.baseUrlV2+Constant.postAdvicePagination + "/" +id+'/heart','post',{},{ "Authorization": "Bearer " + getState().user.token })
            .then((response)=> {
                let adviceData = _.cloneDeep(getState().advice.adviceList);
                let objIndex = _.findIndex(adviceData, {id: id});
                adviceData[objIndex] = response.data.data.post;
                dispatch({
                    type: ADVICE_POST_LIST,
                    payload: adviceData,
                });
                return Promise.resolve(response);
            })
            .catch((error)=>{
                // return Promise.reject(error);
                return dispatch(apiErrorHandler(error));
            })
    };
};

export const unlikePost = (id) => {
    return (dispatch, getState) => {
        dispatch({
            type: ADVICE_POST_LIST,
            payload: getState().advice.adviceList.map((obj) => {
                if (obj.id === id) {
                    obj.user.has_hearted = false;
                    --obj.hearts.count;
                }
                return obj;
            })
        });
        return CallApi(Constant.baseUrlV2+Constant.postAdvicePagination + "/" +id+'/heart','delete',{},
            { "Authorization": "Bearer " + getState().user.token })
            .then((response)=> {
                let adviceData = _.cloneDeep(getState().advice.adviceList);
                let objIndex = _.findIndex(adviceData, {id: id});
                adviceData[objIndex] = response.data.data.post;
                dispatch({
                    type: ADVICE_POST_LIST,
                    payload: adviceData,
                });
                return Promise.resolve(response);
            })
            .catch((error)=>{
                // return Promise.reject(error);
                return dispatch(apiErrorHandler(error));
            })
    }
};

//Comment section

export const addAdviceComment = (comment, id, isReligious) => {
    return (dispatch, getState) => {
        //Here manage main object without calling api - with Redux only

        let apiUrl = Constant.baseUrlV2+Constant.postAdvicePagination + "/" + id + "/"
            + Constant.helpPostCommentPagination;
        return CallApi(apiUrl,'post',{content: comment, is_religious: isReligious},
            { "Authorization": "Bearer " + getState().user.token })
            .then((response)=>{
                let commentDetail = _.cloneDeep(getState().advice.adviceComment);
                commentDetail.push(response.data.data);
                commentDetail =  _.sortBy(commentDetail, obj => obj.id);
                dispatch({
                    type: ADVICE_POST_COMMENT_LIST,
                    payload: commentDetail,
                });
                dispatch({
                    type: ADVICE_POST_LIST,
                    payload: getState().advice.adviceList.map((obj) => {
                        if (obj.id === id) {
                            obj.user.has_commented = true;
                            if(obj.comments){
                                ++obj.comments.count;
                            }
                        }
                        return obj;
                    })
                });
                return Promise.resolve(response);
            })
            .catch((error)=>{
                // return Promise.reject(error);
                return dispatch(apiErrorHandler(error));
            })
    };
};

//Edit comment
export const editAdviceComment = (commentData, postId, isReligious) => {
    return (dispatch, getState) => {
        let apiUrl = Constant.baseUrlV2+Constant.postAdvicePagination + "/" + postId + "/"
            + Constant.helpPostCommentPagination + "/" + commentData.id;
        return CallApi(apiUrl,'patch',{content: commentData.content, is_religious: isReligious },
            { "Authorization": "Bearer " + getState().user.token })
            .then((response)=> {
                let commentDetail = _.cloneDeep(getState().advice.adviceComment);
                var index = _.findIndex(commentDetail, {id: commentData.id});
                commentDetail.splice(index, 1, response.data.data);
                dispatch({
                    type: ADVICE_POST_COMMENT_LIST,
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

export const getCommentByAdviceId = (id, nextPageUrl = null) => {
    return (dispatch, getState) => {
        if(nextPageUrl === null){
            dispatch({
                type: ADVICE_POST_COMMENT_LIST,
                payload: []
            })
        }
        let apiUrl = Constant.baseUrlV2+Constant.postAdvicePagination + "/" + id + "/" + Constant.helpPostCommentPagination;
        if(nextPageUrl){
            apiUrl = nextPageUrl;
        }
        return CallApi(apiUrl,'get',{},{ "Authorization": "Bearer " + getState().user.token })
            .then((response) => {
                console.log("response -> get " + apiUrl);
                let commentDetail = [];
                if(nextPageUrl) {
                    commentDetail = commentDetail.concat(getState().advice.adviceComment);
                }
                commentDetail = commentDetail.concat(response.data);
                console.log(commentDetail);
                let obj = _.cloneDeep(response);
                delete obj['data'];

                commentDetail = _.uniqBy(commentDetail, 'id');
                return Promise.all([
                    dispatch({
                        type: ADVICE_POST_COMMENT_LIST,
                        payload: _.sortBy(commentDetail, obj => obj.id)
                    }),
                    dispatch({
                        type: ADVICE_COMMENT_PAGINATION_LIST,
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


//Like Advice Post Comment
export const likeAdvicePostComment = (postId, commentId) => {
    return (dispatch, getState) => {
        dispatch({
            type: ADVICE_POST_COMMENT_LIST,
            payload:getState().advice.adviceComment.map((obj) => {
                if(obj.id === commentId){
                    obj.user.has_hearted=true;
                    if(obj.hearts) {
                        ++obj.hearts.count;
                    }
                }
                return obj;
            })
        });
        let apiUrl = Constant.baseUrlV2+Constant.postAdvicePagination + "/" + postId + "/" + Constant.helpPostCommentPagination + "/" +commentId+'/heart';
        return CallApi(apiUrl,'post',{},{ "Authorization": "Bearer " + getState().user.token })
            .then((response)=> {
                let commentDetail = _.cloneDeep(getState().advice.adviceComment);
                let objIndex = _.findIndex(commentDetail, {id: commentId});
                commentDetail[objIndex] = response.data.data.comment;
                dispatch({
                    type: ADVICE_POST_COMMENT_LIST,
                    payload: commentDetail,
                });
                return Promise.resolve(response);
            })
            .catch((error)=>{
                return Promise.reject(error);
            })
    };
};

//Unlike Advice Post Comment
export const unlikeAdvicePostComment = (postId,commentId) => {
    return (dispatch, getState) => {
        dispatch({
            type: ADVICE_POST_COMMENT_LIST,
            payload:getState().advice.adviceComment.map((obj) => {
                if(obj.id === commentId){
                    obj.user.has_hearted = false;
                    --obj.hearts.count;
                }
                return obj;
            })
        });
        let apiUrl = Constant.baseUrlV2+Constant.postAdvicePagination + "/" + postId + "/" + Constant.helpPostCommentPagination + "/" +commentId+'/heart';
        return CallApi(apiUrl,'delete',{},{ "Authorization": "Bearer " + getState().user.token })
            .then((response)=> {
                let commentDetail = _.cloneDeep(getState().advice.adviceComment);
                let objIndex = _.findIndex(commentDetail, {id: commentId});
                commentDetail[objIndex] = response.data.data.comment;
                dispatch({
                    type: ADVICE_POST_COMMENT_LIST,
                    payload: commentDetail,
                });
                return Promise.resolve(response);
            })
            .catch((error)=>{
                return Promise.reject(error);
            });
    }
};



export const sortAdvice = (flag, adviceList) => {
    return (dispatch, getState) => {
        //let adviceList = getState().advice.adviceList;
        if(flag) {
            dispatch({
                type: ADVICE_POST_LIST,
                // payload: getState().advice.adviceList.sort(compareByHeart),
                payload: _.sortBy(adviceList, obj => obj.hearts.count).reverse(),
            });
        }else{
            dispatch({
                type: ADVICE_POST_LIST,
                // payload: getState().advice.adviceList.sort(compareByRecent),
                payload: _.sortBy(adviceList, obj => obj.id).reverse(),
            });
        }
        return dispatch({
            type: ADVICE_SORT_TYPE,
            payload: flag,
        });
    };
};