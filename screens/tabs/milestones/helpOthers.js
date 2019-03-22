import React, {Component} from "react";
import {
    StyleSheet,
    View,
    Image,
    FlatList,
    TouchableOpacity,
    Modal,
    RefreshControl, AsyncStorage, Alert,Text,LayoutAnimation
} from "react-native";
import Constant from "../../../helper/constant";
import {connect} from "react-redux";
import SmallButton from "../../commonComponent/smallButtonComponent";
import HelpOtherRow from "./component/helpOthers/helpOtherComponent";
import {getHelpPostDetail, sortHelpPost,
    likeHelpPost, unlikeHelpPost,
    getCommentByPostId, sortHelpPostRecent} from "../../../actions/helpPostActions";
import NewHelpPost from "./component/helpOthers/comment/newHelpPost";
import {showCustomAlert, showNoInternetAlert} from "../../../helper/appHelper";
import _ from 'lodash';

let isApiCalling = false;
let inProcessId = 0;
let sortIcon = {
    "New": require('../../../assets/images/sort_icons/sort-new.png'),
    "Hot": require('../../../assets/images/sort_icons/sort-hot.png'),
    "Top": require('../../../assets/images/sort_icons/sort-top.png'),
};

class HelpOthers extends Component {

    constructor(props){
        super(props);
        this.state={
            modalVisible: false,
            selectedId: 0,
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
        AsyncStorage.getItem("getHelpDateHour").then(getHelpAdvice => {
            let today = new Date().toDateString();
            let hour = new Date().getHours();
            let objdateHour = JSON.stringify({addedDate: today, postedHour: hour});
            if(getHelpAdvice === null || getHelpAdvice !== objdateHour) {
                this.setState({
                    modalVisible: true,
                    isEdit: false,
                    editData: {}
                });
            }else{
                showCustomAlert("Post limit exceeded",
                    "You can only write a help post once per hour","OK",
                    this.props.appTheme === Constant.lightTheme)
            }
        });
    };

    // onSortPress = () => {
    //     this.props.sortHelpPost(!this.props.isHelpPostSort, this.props.helpPostList);
    // };

    onSortPress = (type) => {
        //     this.props.sortHelpPost(!this.props.isHelpPostSort, this.props.helpPostList);
        if(this.props.isConnected) {
            this.props.sortHelpPostRecent(type).then((response) => {
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


    onRowSelect = (rowData)=> {
        this.props.getCommentByPostId(rowData.id);
        this.props.navigation.navigate('postCommentCard', { rowData: rowData, likeHelpPost: this.likeHelpPost,
            unlikeHelpPost: this.unlikeHelpPost, transition: "myCustomSlideRightTransition"});
    };

    onCloseBtnPress = () => {
        this.setState({
            modalVisible: false,
            isEdit: false,
            editData: {}
        });
    };

    onEndReachedHelpPost = () => {
        try{
            if(this.props.isConnected) {
                if(!isApiCalling){
                    if(this.props.helpPostPagination && this.props.helpPostPagination.next_page_url) {
                        isApiCalling = true;
                        console.log(this.props.helpPostPagination.next_page_url);
                        this.props.getHelpPostDetail(this.props.helpPostPagination.next_page_url).then(res=>{
                            isApiCalling = false;
                        }).catch(err=>{
                            isApiCalling = false;
                        });
                    }
                }
            }
        }catch (e){
            isApiCalling = false;
            console.log("Help other",e);
        }
    };

    onRefresh = () => {
        if(this.props.isConnected) {
            this.setState({isRefreshing: true});
            this.props.sortHelpPostRecent(this.props.sortType).then((response) => {
                this.setState({isRefreshing: false});
            }).catch((error) => {
                this.setState({isRefreshing: false});
                console.log(error)
            });
        } else {
            showNoInternetAlert(this.props.appTheme === Constant.lightTheme);;
        }
    };

    likeHelpPost = (id) => {
        if(this.props.isConnected){
            if(id !== undefined && inProcessId !== id){
                inProcessId = id;
                this.props.likeHelpPost(id).then(res=>{
                    inProcessId = 0;
                }).catch(err=>{
                    inProcessId = 0;
                    //showCustomAlert("Failed to like post.", "Brainbuddy", "Try again")
                });
            }
        }else {
            showNoInternetAlert(this.props.appTheme === Constant.lightTheme);;
        }
    };

    unlikeHelpPost = (id) => {
        if(this.props.isConnected){
            if(id !== undefined && inProcessId !== id){
                inProcessId = id;
                this.props.unlikeHelpPost(id).then(res=>{
                    inProcessId = 0;
                }).catch(err=>{
                    inProcessId = 0;
                    // showCustomAlert("Failed to dislike post.", "Brainbuddy", "Try again")
                });
            }
        }else{
            showNoInternetAlert(this.props.appTheme === Constant.lightTheme);
        }
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
                          data={this.props.helpPostList}
                          onEndReachedThreshold={0.5}
                          onEndReached={this.onEndReachedHelpPost}
                          automaticallyAdjustContentInsets={false}
                          contentInset={{bottom:55}}
                          refreshControl={
                              <RefreshControl
                                  refreshing={this.state.isRefreshing}
                                  onRefresh={this.onRefresh}
                                  tintColor={appColor.appRefreshControl}
                              />}
                          renderItem={({item, index}) =>
                              <HelpOtherRow
                                  rowData={item}
                                  likeHelpPost={this.likeHelpPost}
                                  unlikeHelpPost={this.unlikeHelpPost}
                                  key={index}
                                  appTheme={this.props.appTheme}
                                  avatar_id={this.props.avatar_id}
                                  onRowSelect={this.onRowSelect}
                                  onEditButtonPress={this.onEditButtonPress}/>
                          }/>
                <View style={ styles.btnPostAdvise }>
                    <SmallButton title="Get help"
                                 color={'white'}
                                 otherStyle={{width:130,height:38}}
                                 backColor={appColor.poastButton}
                                 onPress={()=>{this.onPostAdvicePress()}}/>
                </View>

                <View style={{ right:15, bottom: 10,position: 'absolute', backgroundColor:'transparent'}}>
                    {views}
                </View>

                <Modal animationType="slide"
                       transparent={false}
                       visible={this.state.modalVisible}
                       onRequestClose={this.onCloseBtnPress}>
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
        paddingBottom:100
    },
    btnPostAdvise:{
        alignSelf: 'center',
        backgroundColor: Constant.transparent,
        position:'absolute',
        bottom:10,
        left:0,
        right:0
    },
    textDetail:{
        color: '#FFF',
        fontSize: 15,
        fontFamily: Constant.font700,
    },
    btnPostSort:{
        alignSelf: 'flex-end',
        backgroundColor: '#003e53',//Constant.transparentBackColor,
        alignItems: 'center',
        justifyContent: 'center',
        padding:10,
        borderRadius: 30,
        position:'absolute',
        right:10,
        bottom:10,
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
        helpPostList: state.helpPost.helpPostList,
        helpPostPagination:state.helpPost.helpPostPagination,
        isHelpPostSort: state.helpPost.isHelpPostSort,
        avatar_id:state.user.userDetails.avatar_id,
        isConnected: state.user.isConnected,
        sortType:state.helpPost.sortType || "hot",
        appTheme: state.user.appTheme
    };
};

export default connect(mapStateToProps, {
    getHelpPostDetail, sortHelpPost, getCommentByPostId, sortHelpPostRecent,
    likeHelpPost, unlikeHelpPost,
})(HelpOthers);