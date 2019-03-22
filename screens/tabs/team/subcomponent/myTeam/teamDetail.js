import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import Constant from '../../../../../helper/constant';

export default  class TeamDetailComponent extends Component {

    viewLeaderboard = () => {
        this.props.navigateToLeaderBoard();
    };

    render() {
        return (
            <View style={[{ backgroundColor:Constant.orangeColor}]}>
                <View style={{paddingTop:36,paddingBottom:38}}>
                    <Text style={{fontSize:15,color: '#FFFFFF',alignSelf:'center',fontFamily: Constant.font700,}}>
                        { "Team " + this.props.teamData.name || "" }
                    </Text>
                </View>
                {
                    (this.props.teamData.porn_free_days && this.props.teamData.porn_free_days.total != undefined) &&
                    <Text style={ styles.centerText }>
                        { (this.props.teamData.porn_free_days && this.props.teamData.porn_free_days.total)
                            ? (this.props.teamData.porn_free_days.total.toString() == "1")  ?
                                this.props.teamData.porn_free_days.total.toString() + " day"
                                : this.props.teamData.porn_free_days.total.toString() + " days" : "0 days"}
                    </Text>
                    ||
                    <Text style={ styles.centerText }>
                        { (this.props.teamData.porn_free_days && this.props.teamData.porn_free_days.counts &&
                            this.props.teamData.porn_free_days.counts.total != undefined)
                            ? (this.props.teamData.porn_free_days.counts.total.toString() == "1")  ?
                                this.props.teamData.porn_free_days.counts.total.toString() + " day"
                                : this.props.teamData.porn_free_days.counts.total.toString() + " days" : "0 days"}
                    </Text>

                }
                <Text style={styles.titleText}>Ranked { this.props.rank.toString() || "0" } overall</Text>

                <View style={{paddingTop:12,paddingBottom:22}}>
                    <TouchableOpacity onPress={()=>this.viewLeaderboard()}
                                      style={styles.btnLogin}>
                        <View>
                            <Text style={styles.btnFont}>
                                {'View leaderboard'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    viewCircle:{
        backgroundColor:Constant.orangeColor,
        justifyContent:'center',
        alignItems:'center',
        marginBottom:20
    },
    outerView:{
        justifyContent:'center',
        alignItems:'center'
    },
    centerText:{
        color: '#FFFFFF',
        fontSize: 36,
        textAlign:'center',
        fontFamily: Constant.font700,
    },
    bottomText:{
        color: '#FFFFFF',
        fontSize: 12,
        alignSelf:'center',
        fontFamily: Constant.font300,
    },
    titleText:{
        color: '#FFFFFF',
        paddingTop:40,
        fontSize: 15,
        alignSelf:'center',
        fontFamily: Constant.font500,
    },

    borderView:{
        borderRadius:15,
        borderWidth:1,
        borderColor:'rgb(184,198,205)',
        marginTop:20,
        justifyContent:'center',
        alignItems:'center',
        height:30,
        width:150
    },
    settingText:{
        color:"rgb(184,198,205)",
        fontSize:12,
        margin: 10,
        fontFamily: Constant.font500,
    },
    btnLogin:{
        alignSelf: 'center',
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 35,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: 'rgb(236,147,18)',
        maxWidth: 226
    },
    btnFont:{
        fontSize: 12,
        fontFamily: Constant.font500,
        color:'#FFF'
    }
});