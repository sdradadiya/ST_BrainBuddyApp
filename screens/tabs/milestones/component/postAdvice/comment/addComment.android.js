import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    FlatList, Modal, BackHandler,
    ActivityIndicator,
    Keyboard
} from 'react-native';
import { connect } from 'react-redux';
import Constant from '../../../../../../helper/constant';
import NavigationBar from '../../../../../commonComponent/navBar';
import CommentTitle from './commentTitleComponent';
import CommentReply from './commentReplyComponent';
import BottomChatComponent from '../../../../team/subcomponent/teamChat/bottomChatView';
import {getCommentByAdviceId, addAdviceComment, editAdviceComment, likeAdvicePostComment, unlikeAdvicePostComment} from "../../../../../../actions/postAdviceAction";
import {
    showNoInternetAlert, showCustomAlert, getSmallAvatarImage,
    isReligious, showThemeAlert
} from '../../../../../../helper/appHelper';
import PostAdviceCreate from '../postAdviceCreate';

let isApiCalling = false;
let isKeyboardOpen = false;
let inProcessId = 0;

class AdviceComment extends Component {

    constructor(props){
        super(props);
        this.state={
            adviceData: props.navigation.state.params.rowData,
            modalVisible: false,
            isEdit: false,
            editData: {},
            isCommentEdit: false,
            editCommentData: {},
            isLoadingComments: true
        };
        isApiCalling = false;
        isKeyboardOpen = false;
        inProcessId = 0;
    }

    onBackButtonPress = () => {
        this.props.navigation.goBack();
    };

    componentWillReceiveProps(nextProps) {
        if(this.state.isLoadingComments){
            this.setState({
                isLoadingComments: false
            })
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        this.onBackButtonPress();
        return true;
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

    onKeybordChange = () =>{
        if(this.refs.scrollView) {
            this.refs.scrollView.scrollToEnd({animated: true});
        }
        isKeyboardOpen = false;
    };

    onInputBoxChange = () =>{
        if(this.refs.scrollView) {
            this.refs.scrollView.scrollToEnd({animated: true});
        }
        isKeyboardOpen = false;
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
                if(!isApiCalling) {
                    if(this.props.adviceCommentPagination && this.props.adviceCommentPagination.next_page_url){
                        isApiCalling = true;
                        console.log(this.props.adviceCommentPagination.next_page_url);
                        this.setState({
                            isLoadingComments: true
                        })
                        this.props.getCommentByAdviceId(this.state.adviceData.id,this.props.adviceCommentPagination.next_page_url).then(res=>{
                            isApiCalling = false;
                            this.setState({
                                isLoadingComments: false
                            })
                            if(this.refs.scrollView) {
                                this.refs.scrollView.scrollToEnd({animated: true});
                            }
                        }).catch(err=>{
                            this.setState({
                                isLoadingComments: false
                            })
                            isApiCalling = false;
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
                             key={index}
                             appTheme={this.props.appTheme}
                             porn_free_days={(item.creator.stats) && item.creator.stats.porn_free_days.toString() || null }
                             onEditComment={this.onEditComment}/>
    };

    onLikeComment = (rowData) => {
        if(this.props.isConnected){
            if(rowData.id !== undefined && inProcessId !== rowData.id){
                inProcessId = rowData.id;
                if(rowData.user.has_hearted) {
                    this.props.unlikeAdvicePostComment(this.state.adviceData.id,rowData.id).then(res=>{
                        inProcessId = 0;
                    }).catch(err=>{
                        inProcessId = 0;
                    });
                }else{
                    this.props.likeAdvicePostComment(this.state.adviceData.id,rowData.id).then(res=>{
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
            this.props.navigation.state.params.unlikePostMethod(id)
        }else{
            this.props.navigation.state.params.likePostMethod(id)
        }
    };

    //For editing
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
            editData: this.state.adviceData
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
        if(commentText.length > 0 && commentText.trim() !== this.state.editCommentData.content) {
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
        this.props.addAdviceComment(commentText, this.state.adviceData.id, isReligiousContent).then((res)=>{
            Keyboard.dismiss();
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
        commentData.content = commentText.trim();
        this.setState({
            isCommentEdit: false,
            editCommentData: {}
        });
        this.props.editAdviceComment(commentData,this.state.adviceData.id, isReligiousContent).then((res)=> {
            //done
            Keyboard.dismiss();
            this.showCharLimit(0);
        }).catch(err => {
            showCustomAlert("Fail to save comment, please try again.", "Brainbuddy","OK");
        });
    }

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        const { container } = styles;
        return (
            <View style={[container,{paddingBottom: this.props.safeAreaInsetsData.bottom, backgroundColor:appColor.commentViewBack}]}>
                <NavigationBar onBackButtonPress={ this.onBackButtonPress }
                               title="Advice post"
                               top={this.props.safeAreaInsetsData.top}
                               height={72}
                               isRightButton={false}/>

                <FlatList showsVerticalScrollIndicator={true}
                          keyboardShouldPersistTaps='always'
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
                          ref="scrollView"
                          removeClippedSubviews={false}
                          data={this.props.adviceComment}
                          onEndReachedThreshold={0.5}
                          onEndReached={this.onEndReachedCommentPost}
                          automaticallyAdjustContentInsets={false}
                          ListHeaderComponent={<CommentTitle content={this.state.adviceData.content}
                                                             adviceData={this.state.adviceData}
                                                             avtarImage={this.getAvatarImage(this.state.adviceData.creator.avatar_id || 0,
                                                                 this.state.adviceData.creator.is_current_user)}
                                                             onHeartPress={this.heartPressed}
                                                             appTheme={this.props.appTheme}
                                                             porn_free_days={(this.state.adviceData.creator.stats) && this.state.adviceData.creator.stats.porn_free_days.toString() || null }
                                                             onEditButtonPress={this.onEditButtonPress}/>
                          }
                          renderItem={this.renderRow}/>
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
                                     placeHolderText={"Comment..."}
                                     safeAreaInsetsData={this.props.safeAreaInsetsData}
                    //isManagedKeybord={true}
                                     appTheme={this.props.appTheme}
                                     isBottomBar={false}
                                     isCommentEdit={this.state.isCommentEdit}
                                     editCommentData={this.state.editCommentData}
                                     onEditCommentDone={this.onEditCommentDone}
                                     isConnected={this.props.isConnected}/>
                </View>
                <Modal animationType="slide"
                       transparent={false}
                       visible={this.state.modalVisible}>
                    <PostAdviceCreate onCloseBtnPress={this.onCloseBtnPress}
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
        isConnected: state.user.isConnected,
        safeAreaInsetsData: state.user.safeAreaInsetsData,
        avatar_id:state.user.userDetails.avatar_id,
        adviceList:state.advice.adviceList,
        adviceComment: state.advice.adviceComment,
        adviceCommentPagination: state.advice.adviceCommentPagination,
        appTheme: state.user.appTheme
    };
};

export default connect(mapStateToProps, {
    getCommentByAdviceId, addAdviceComment, editAdviceComment,
    likeAdvicePostComment, unlikeAdvicePostComment
})(AdviceComment);