import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    Button,
    Modal,
    RefreshControl, AsyncStorage, Alert, LayoutAnimation
} from 'react-native';
import Constant from '../../../helper/constant';
import { connect } from 'react-redux';
import SmallButton from '../../commonComponent/smallButtonComponent'
import PostAdviceRow from './component/postAdvice/postAdviceComponent';
import { getAdviceDetail,sortAdvice,likePost,unlikePost,sortAdviceRecent,
    getCommentByAdviceId } from '../../../actions/postAdviceAction';
import PostAdviceCreate from './component/postAdvice/postAdviceCreate';
import { showNoInternetAlert, showCustomAlert, getSmallAvatarImage } from '../../../helper/appHelper';
import _ from 'lodash';

let sortIcon = {
    "New": require('../../../assets/images/sort_icons/sort-new.png'),
    "Hot": require('../../../assets/images/sort_icons/sort-hot.png'),
    "Top": require('../../../assets/images/sort_icons/sort-top.png'),
};
let isApiCalling = false;
let inProcessId = 0;

class PostAdvice extends Component {

    constructor(props){
        super(props);
        this.state={
            modalVisible: false,
            isRefreshing: false,
            selectedTab: 1,
            isShowAll: false,
            isVisibleAll: false,
            arrSort:[{value: 2, label: "New"},{value: 1, label: "Hot"},{value: 0, label: "Top"}],
            isEdit: false,
            editData: {}
        };
        isApiCalling = false;
        inProcessId = 0;
    }

    componentWillMount () {
        let selectedType = 1;
        if(this.props.sortType === "top"){
            selectedType = 0;
        }else if(this.props.sortType === "new"){
            selectedType = 2;
        }
        this.setState({
            selectedTab: selectedType,
        });
    }

    onPostAdvicePress = () => {
        //this.props.navigation.navigate('postAdviceCreate');
        AsyncStorage.getItem("postAdviceDateHour").then(postAdvice => {
            let today = new Date().toDateString();
            let hour = new Date().getHours();
            let objdateHour = JSON.stringify({addedDate: today, postedHour: hour});
            if(postAdvice === null || postAdvice !== objdateHour) {
                this.setState({
                    modalVisible: true,
                    isEdit: false,
                    editData: {}
                });
            }else{
                showCustomAlert("Post limit exceeded",
                    "You can post advice once per hour",
                    "OK",this.props.appTheme === Constant.lightTheme);
            }
        });
    };

    //On sort button press
    onSortPress = (type) => {
        if(this.props.isConnected) {
            this.props.sortAdviceRecent(type).then((response) => {
                if(this.refs.flatlist){
                    this.refs.flatlist.scrollToIndex({index: 0, animated: false})
                }
            }).catch((error) => {
                console.log(error)
            });
        } else {
            showNoInternetAlert(this.props.appTheme === Constant.lightTheme);
        }
    };

    changeTab = (selected) => {
        LayoutAnimation.easeInEaseOut();
        if(selected === 0 && this.state.selectedTab !== 0){
            this.onSortPress("top");
        }
        else if(selected === 1 && this.state.selectedTab !== 1){
            this.onSortPress("hot");

        }else if(selected === 2 && this.state.selectedTab !== 2){
            this.onSortPress("new");
        }

        if(this.state.selectedTab === selected && !this.state.isShowAll){
            this.setState({
                selectedTab: selected,
                isShowAll:true
            });
        }else{
            this.setState({
                selectedTab: selected,
                isShowAll:false
            });
        }
    };

    likePostMethod = (id) => {
        if(this.props.isConnected){
            if(id !== undefined && inProcessId !== id){
                inProcessId = id;
                this.props.likePost(id).then(res=>{
                    inProcessId = 0;
                }).catch(err=>{
                    inProcessId = 0;
                    //showCustomAlert("Failed to like advice.", "Brainbuddy", "Try again")
                });
            }
        }else {
            showNoInternetAlert(this.props.appTheme === Constant.lightTheme);
        }
    };

    unlikePostMethod = (heartId) => {
        if(this.props.isConnected){
            if(heartId !== undefined && inProcessId !== heartId){
                inProcessId = heartId;
                this.props.unlikePost(heartId).then(res=>{
                    inProcessId = 0;
                }).catch(err=>{
                    inProcessId = 0;
                    // showCustomAlert("Failed to dislike advice.", "Brainbuddy", "Try again")
                });
            }
        }else{
            showNoInternetAlert(this.props.appTheme === Constant.lightTheme);
        }
    };

    onCloseBtnPress = () => {
        this.setState({
            modalVisible: false,
            isEdit: false,
            editData: {}
        });
    };

    getAvatarImage = (avatar_id, isCurrentUser) => {
        if(isCurrentUser){
            return getSmallAvatarImage(avatar_id || 0);
        }
        return getSmallAvatarImage(avatar_id || 0);
    };

    onEndReachedAdvice = () => {
        try{
            if(this.props.isConnected) {
                if(!isApiCalling){
                    if(this.props.advicePagination && this.props.advicePagination.next_page_url){
                        isApiCalling = true;
                        console.log(this.props.advicePagination.next_page_url);
                        this.props.getAdviceDetail(this.props.advicePagination.next_page_url).then(res=>{
                            isApiCalling = false;
                        }).catch(err=>{
                            isApiCalling = false;
                        });
                    }
                }
            }
        }catch(e) {
            isApiCalling = false;
            console.log("post advide",e)
        }
    };

    onRefresh = () => {
        if(this.props.isConnected) {
            this.setState({isRefreshing: true});
            this.props.sortAdviceRecent(this.props.sortType).then((response) => {
                this.setState({isRefreshing: false});
            }).catch((error) => {
                this.setState({isRefreshing: false});
                console.log(error)
            });
        } else {
            showNoInternetAlert(this.props.appTheme === Constant.lightTheme);
        }
    };

    onAdviceRowSelect = (rowData)=> {
        this.props.getCommentByAdviceId(rowData.id);
        // this.props.navigation.navigate('adviceComment', { rowData: rowData });
        this.props.navigation.navigate('adviceCommentCard', { rowData: rowData,
            likePostMethod: this.likePostMethod, unlikePostMethod: this.unlikePostMethod, transition: "myCustomSlideRightTransition" });
    };

    renderSortElement = ({value, label}) => {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <TouchableOpacity onPress={()=>this.changeTab(value)}
                              key={value}
                              style={(value === this.state.selectedTab) && [styles.selectedSideBtn,{backgroundColor: appColor.selectedSortBtn}]
                              || [styles.sideBtn,{backgroundColor: appColor.unselectedSortBtn}]}>
                <View style={styles.sideView}>
                    <Image style={styles.img} resizeMode={'contain'}
                           source={sortIcon[label]}/>
                    <Text style={styles.sideText}>
                        {label}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    };

    //Edit advice post
    onEditButtonPress = (rowDara) => {
        this.setState({
            modalVisible: true,
            isEdit: true,
            editData: rowDara
        });
    };

    render() {
        let views = [];
        let arr = this.state.arrSort;
        if(this.state.isShowAll){
            let selectedObj = _.find(arr, {value: this.state.selectedTab});
            let objIndex = _.findIndex(arr, {value: this.state.selectedTab});
            arr.splice(objIndex, 1);
            arr.push(selectedObj);
            arr.map((obj)=>{
                views.push(this.renderSortElement(obj));
            })
        }else{
            arr.map((obj)=>{
                if(obj.value === this.state.selectedTab) {
                    views.push(this.renderSortElement(obj));
                }
            })
        }
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <View style={{flex:1}}>
                <FlatList ref='flatlist'
                          style={{paddingTop: 9}}
                          showsVerticalScrollIndicator={false}
                          removeClippedSubviews={false}
                          contentContainerStyle={{paddingBottom: (Constant.isIOS) && 0 || 55}}
                          data={this.props.adviceList}
                          automaticallyAdjustContentInsets={false}
                          contentInset={{bottom:55}}
                          onEndReachedThreshold={0.5}
                          onEndReached={this.onEndReachedAdvice}
                          refreshControl={
                              <RefreshControl
                                  refreshing={this.state.isRefreshing}
                                  onRefresh={this.onRefresh}
                                  tintColor={appColor.appRefreshControl}
                              />
                          }
                          renderItem={({item, index}) =>
                              <PostAdviceRow text = { item.content || "" }
                                             rowData = {item}
                                             avtarImage = {this.getAvatarImage(item.creator.avatar_id, item.creator.is_current_user)}
                                             avtarName = { (item.creator.is_current_user) ? "You" : item.creator.name }
                                             likeCount = { (item.hearts) && item.hearts.count || "0" }
                                             isLiked = { item.user.has_hearted || false}
                                             isCommented={item.user.has_commented || false}
                                             commentCount={(item.comments) && item.comments.count || "0"}
                                             key = { item.id }
                                             index={index}
                                             likePostMethod = {this.likePostMethod}
                                             unlikePostMethod = { this.unlikePostMethod}
                                             heartId = {item.user.heart_id}
                                             onAdviceRowSelect={this.onAdviceRowSelect}
                                             id = {item.id}
                                             appTheme={this.props.appTheme}
                                             porn_free_days={(item.creator.stats) && item.creator.stats.porn_free_days.toString() || null }
                                             onEditButtonPress={this.onEditButtonPress}/>
                          }/>
                <View style={ styles.btnPostAdvise }>
                    <SmallButton title="Write advice"
                                 color={'white'}
                                 backColor={appColor.poastButton}
                                 otherStyle={{width:130,height:38}}
                                 onPress={()=>{
                                     this.onPostAdvicePress()}}/>
                </View>

                <View style={{ right:15, bottom: 10,position: 'absolute', backgroundColor:'transparent'}}>
                    {views}
                </View>
                <Modal animationType="slide"
                       transparent={false}
                       visible={this.state.modalVisible}
                       onRequestClose={this.onCloseBtnPress}>
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
        paddingBottom:100
    },
    btnPostAdvise:{
        alignSelf: 'center',
        backgroundColor: Constant.transparent,
        position:'absolute',
        bottom:10,
        left:0,
        right:0,
    },
    textDetail: {
        color: '#FFF',
        fontSize: 15,
        fontFamily: Constant.font700,
    },
    sideBtn:{
        marginTop:10,
        height:38,
        width: 75,
        borderRadius: 30,
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor: Constant.lightTheamColor
    },
    selectedSideBtn:{
        marginTop:10,
        height:38,
        width: 75,
        borderRadius: 30,
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor: '#003e53',
    },
    sideView:{
        flexDirection:'row',
        width:75,
        justifyContent:'center',
        height:38,
        alignItems:"center"
    },
    img:{
        width:16,
        height:16
    },
    sideText:{
        color:'#FFF',
        fontSize:15,
        fontFamily:Constant.font500,
        marginLeft:4
    }
});

const mapStateToProps = state => {
    return {
        adviceList:state.advice.adviceList,
        advicePagination:state.advice.advicePagination,
        isHeartSort:state.advice.isHeartSort,
        isConnected: state.user.isConnected,
        avatar_id:state.user.userDetails.avatar_id,
        sortType:state.advice.sortType || "hot",
        appTheme: state.user.appTheme
    };
};

export default connect(mapStateToProps, {
    getAdviceDetail, sortAdvice,likePost,unlikePost,sortAdviceRecent,
    getCommentByAdviceId
})(PostAdvice);