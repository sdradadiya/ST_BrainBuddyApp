import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    ScrollView,
    Image,
    TouchableHighlight,
    FlatList,
    Modal,
    KeyboardAvoidingView,
    ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import Constant from '../../../../../../helper/constant';
import NavigationBar from '../../../../../commonComponent/navBar';
import CommentTitle from './commentTitleComponent';
import CommentReply from './commentReplyComponent';
import BottomChatComponent from '../../../../team/subcomponent/teamChat/bottomChatView';
import { addHelpComment, getCommentByPostId, likeHelpPostComment,
    unlikeHelpPostComment, editHelpComment } from '../../../../../../actions/helpPostActions';
import {
    showNoInternetAlert, showCustomAlert, getSmallAvatarImage,
    isReligious, showThemeAlert
} from '../../../../../../helper/appHelper';
import NewHelpPost from "./newHelpPost";

let isApiCalling = false;
let inProcessId = 0;
let isMounted = false;
let isKeyboardShow = false;

class PostComment extends Component {

    constructor(props){
        super(props);
        this.state={
            helpPostData: props.navigation.state.params.rowData,
            modalVisible: false,
            isEdit: false,
            editData: {},
            isCommentEdit: false,
            editCommentData: {},
            isLoadingComments: true,
            limitViewBottom:50,
            isShowLimit: false,
            limitChar:0
        };
        isApiCalling = false;
        inProcessId = 0;
        isMounted = false;
        isKeyboardShow = false;
    }

    componentWillReceiveProps(nextProps) {
        if(this.state.isLoadingComments){
            this.setState({
                isLoadingComments: false
            })
        }
        if(this.props.helpPostComment.length > 0 && this.props.helpPostComment.length < 30){
            setTimeout(()=>{
                isMounted = true;
            },300);
        }
    }

    componentDidMount() {
    }

    onBackButtonPress = () => {
        // helpPostData
        this.props.navigation.goBack();
    };

    onMessageSend = (message) => {
        if(message.length > 0) {
            if(this.props.isConnected){
                this.checkForReligious(true, message.toString().trim());
            }else{
                showNoInternetAlert();
            }
        }
    };

    onKeybordChange = (isShown) =>{
        isMounted = !isShown;
        // this.refs.scrollView.scrollToEnd({animated: false});
    };

    onInputBoxChange = () =>{
        if (this.refs.scrollView) {
            this.refs.scrollView.scrollToEnd({animated: true});
        }
    };

    getAvatarImage = (avatar_id, isCurrentUser) => {
        if(isCurrentUser){
            return getSmallAvatarImage(this.props.avatar_id || 0);
        }
        return getSmallAvatarImage(avatar_id || 0);
    };

    onEndReachedCommentPost = () => {
        try{
            if(this.props.isConnected) {
                if(!isApiCalling){
                    if(this.props.helpPostCommentPagination && this.props.helpPostCommentPagination.next_page_url){
                        isApiCalling = true;
                        console.log(this.props.helpPostCommentPagination.next_page_url);
                        this.setState({
                            isLoadingComments: true
                        })
                        this.props.getCommentByPostId(this.state.helpPostData.id,this.props.helpPostCommentPagination.next_page_url).then(res=>{
                            isApiCalling = false;
                            this.setState({
                                isLoadingComments: false
                            })
                            if (this.refs.scrollView) {
                                this.refs.scrollView.scrollToEnd({animated: true});
                            }
                        }).catch(err=>{
                            isApiCalling = false;
                            this.setState({
                                isLoadingComments: false
                            })
                        });
                    }
                }
            }
        }catch (e){
            isApiCalling = false;
            console.log("comment ",e);
        }
    };

    renderRow = ({item, index}) => {
        return <CommentReply rowData={item}
                             avtarImage={this.getAvatarImage(item.creator.avatar_id || 0, item.creator.is_current_user)}
                             onLikeComment={this.onLikeComment}
                             porn_free_days={(item.creator.stats) && item.creator.stats.porn_free_days.toString() || null }
                             appTheme={this.props.appTheme}
                             onEditComment={this.onEditComment}
                             key={index}/>
    };

    onLikeComment = (rowData) => {
        if(this.props.isConnected){
            if(rowData.id !== undefined && inProcessId !== rowData.id){
                inProcessId = rowData.id;
                if(rowData.user.has_hearted) {
                    this.props.unlikeHelpPostComment(this.state.helpPostData.id,rowData.id).then(res=>{
                        inProcessId = 0;
                    }).catch(err=>{
                        inProcessId = 0;
                    });
                }else{
                    this.props.likeHelpPostComment(this.state.helpPostData.id,rowData.id).then(res=>{
                        inProcessId = 0;
                    }).catch(err=>{
                        inProcessId = 0;
                    });
                }
            }
        }else {
            showNoInternetAlert();
        }
    };

    heartPressed = (id,hasHeart) => {
        if(hasHeart){
            this.props.navigation.state.params.unlikeHelpPost(id)
        }else{
            this.props.navigation.state.params.likeHelpPost(id)
        }
    }

    onCloseBtnPress = () => {
        this.setState({
            modalVisible: false,
            isEdit:false,
            editData: {}
        });
    };

    //Editing Help Post
    onEditButtonPress = (rowDara) => {
        this.setState({
            modalVisible: true,
            isEdit: true,
            editData: this.state.helpPostData
        });
    };

    //Editing Help Post Comment
    onEditComment = (rowData) => {
        this.setState({
            isCommentEdit: true,
            editCommentData: rowData
        });
    }

    onEditCommentDone = (commentText) => {
        if (commentText.length > 0 && commentText.trim() !== this.state.editCommentData.content) {
            if (this.props.isConnected){
                this.checkForReligious(false, commentText.toString().trim());
            }else{
                showNoInternetAlert();
            }

        }else{
            this.setState({
                isCommentEdit: false,
                editCommentData: {}
            });
        }
    }

    setKeyboardShow = (flag) => {
        if(flag){
            isMounted = true;
        }
        isKeyboardShow = flag;
    }

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

    checkForReligious = (isNewPost, commentText) => {
        let religiousString = isReligious(commentText);
        if(religiousString == Constant.RELIGIOUS){
            if(isNewPost){
                this.performAddPost(true,commentText);
            }else{
                this.performEditPost(true, commentText);
            }
        }else if(religiousString == Constant.NO_RELIGIOUS){
            if(isNewPost){
                this.performAddPost(false,commentText);
            }else{
                this.performEditPost(false,commentText);
            }
        }else if(religiousString == Constant.ASK_RELIGIOUS_ALERT){
            showThemeAlert({
                title: "Religious content?",
                message: "Does your comment contain religious content?",
                leftBtn: "Yes",
                leftPress: ()=>{
                    if(isNewPost){
                        this.performAddPost(true,commentText);
                    }else{
                        this.performEditPost(true,commentText);
                    }
                },
                rightBtn: "No",
                rightPress: ()=>{
                    if(isNewPost){
                        this.performAddPost(false,commentText);
                    }else{
                        this.performEditPost(false,commentText);
                    }
                },
            });
        }
    }

    performAddPost = (isReligiousContent, commentText) => {
        this.props.addHelpComment(commentText, this.state.helpPostData.id, isReligiousContent).then((res)=>{
            this.setState({},()=>{
                this.refs.scrollView.scrollToEnd({animated: true});
            });
            this.showCharLimit(0);
        }).catch(err => {
            showCustomAlert("Fail to add comment, please try again.", "Brainbuddy","OK");
        });
    }

    performEditPost = (isReligiousContent, commentText) => {
        let commentData = this.state.editCommentData;
        commentData.content = commentText;
        this.setState({
            isCommentEdit: false,
            editCommentData: {}
        });
        this.props.editHelpComment(commentData,this.state.helpPostData.id, isReligiousContent).then((res)=> {
            //done
            this.showCharLimit(0);
        }).catch(err => {
            showCustomAlert("Fail to save comment, please try again.", "Brainbuddy","OK");
        });
    }

    render() {
        const { container } = styles;
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <View style={[container,{paddingBottom: this.props.safeAreaInsetsData.bottom, backgroundColor:appColor.commentViewBack}]}>
                <NavigationBar onBackButtonPress={ this.onBackButtonPress }
                               title="Help post"
                               top={this.props.safeAreaInsetsData.top}
                               height={72}
                               isRightButton={false}/>

                <KeyboardAvoidingView behavior="padding"
                                      style={{flex:1}}>
                    <FlatList showsVerticalScrollIndicator={true}
                              keyboardShouldPersistTaps='never'
                              ListFooterComponent={
                                  (this.state.isLoadingComments) &&
                                  <ActivityIndicator
                                      animating={true}
                                      style={{marginTop:20}}
                                      size="small"
                                      color={appColor.activityIndicator}/>
                                  ||
                                  <View style={{height:20}}/>
                              }
                              keyboardDismissMode={"interactive"}
                              ref="scrollView"
                              removeClippedSubviews={false}
                              data={this.props.helpPostComment}
                              onEndReachedThreshold={0.5}
                              onEndReached={this.onEndReachedCommentPost}
                              automaticallyAdjustContentInsets={false}
                              ListHeaderComponent={<CommentTitle content={this.state.helpPostData.content}
                                                                 helpPostData={this.state.helpPostData}
                                                                 avtarImage={this.getAvatarImage(this.state.helpPostData.creator.avatar_id || 0,
                                                                     this.state.helpPostData.creator.is_current_user)}
                                                                 onHeartPress={this.heartPressed}
                                                                 appTheme={this.props.appTheme}
                                                                 porn_free_days={(this.state.helpPostData.creator.stats) &&
                                                                 this.state.helpPostData.creator.stats.porn_free_days.toString() || null}
                                                                 onEditButtonPress={this.onEditButtonPress}/>
                              }
                              renderItem={this.renderRow}
                              onContentSizeChange={() => {if(isMounted) {
                                  //this.refs.scrollView.scrollToEnd({animated: true})
                              }}}
                              onLayout={() => {if(isMounted) {
                                  this.refs.scrollView.scrollToEnd({animated: true})
                              }}}
                    />
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
                                             onInputBoxChange={this.onInputBoxChange}
                                             maxLength={200}
                                             isManagedKeybord={true}
                                             placeHolderText={"Comment..."}
                                             safeAreaInsetsData={this.props.safeAreaInsetsData}
                                             appTheme={this.props.appTheme}
                                             isBottomBar={false}
                                             isCommentEdit={this.state.isCommentEdit}
                                             editCommentData={this.state.editCommentData}
                                             onEditCommentDone={this.onEditCommentDone}
                                             setKeyboardShow={this.setKeyboardShow}
                                             isConnected={this.props.isConnected}/>
                    </View>
                </KeyboardAvoidingView>
                <Modal animationType="slide"
                       transparent={false}
                       visible={this.state.modalVisible}>
                    <NewHelpPost onCloseBtnPress={this.onCloseBtnPress}
                                 isEdit={this.state.isEdit}
                                 editData={this.state.editData}
                                 appTheme={this.props.appTheme}/>
                </Modal>

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
        helpPostList: state.helpPost.helpPostList,
        helpPostComment: state.helpPost.helpPostComment,
        helpPostCommentPagination: state.helpPost.helpPostCommentPagination,
        isConnected: state.user.isConnected,
        avatar_id:state.user.userDetails.avatar_id,
        safeAreaInsetsData: state.user.safeAreaInsetsData,
        appTheme: state.user.appTheme
    };

};

export default connect(mapStateToProps, {
    addHelpComment, getCommentByPostId, editHelpComment,
    likeHelpPostComment, unlikeHelpPostComment
})(PostComment);