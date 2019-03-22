import React, { Component } from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import BeforeBeginComponent from '../components/getDetail/beforeBeginComponent';
import * as Animatable from 'react-native-animatable';
import moment from 'moment';
import { updateMetaData } from '../../../../actions/metadataActions';
import { setBeforeBeginPornFreeDays, setBeforeBeginMasturbationFreeDays } from '../../../../actions/statisticAction';
import { connect } from 'react-redux';

let arrMosturbateFree = [];
let arrPornFree = [];

class BeforeBegin extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            days: [],
            backColor: 'rgb(22,93,120)',
            selectedDay: -1,
            selectionPart:1,
            selectedPornDay: -1,
            selectedMosturbateDay: -1,
            isCompleted: false,
            selectedTime: ''
        };

    }

    componentDidMount() {
        this.refs.mainView.fadeIn(400);
    }

    onDaySelect = (day, selectionPart) => {
        if(selectionPart == 1) {
            this.setPornCalendar(day);
            this.setState({
                selectedPornDay: day,
                selectionPart:2
            });
        }else if(selectionPart == 2) {
            this.setMosturbationCalendar(day);
            this.setState({
                selectedMosturbateDay: day,
                selectionPart:3
            });
        }else{
            this.setCheckupTime(day);
            this.setState({
                selectedTime: day,
                isCompleted:true
            });
            setTimeout(()=>{
                //Here api call
                this.props.setBeforeBeginPornFreeDays(arrPornFree);
                this.props.setBeforeBeginMasturbationFreeDays(arrMosturbateFree);
                if(this.props.navigation.state.params.isFromLogin){
                    //this.props.navigation.navigate('rootTabNavigation');
                    this.props.navigation.navigate("completeSettingCheckup",{checkupTime: day});
                }else{
                    this.props.navigation.navigate("completeSettingCheckup",{checkupTime: day});
                }
            },300);
        }
    };

    setPornCalendar = (day) => {
        if(day == 0) {
            //today
            let obj = {
                is_relapse: true,
                occurred_at: moment().format("YYYY-MM-DD")
            };
            arrPornFree.push(obj);
        }else if(day == 1) {
            //yesterday
        }else{
            let i=1;
            while(i<day){
                let obj = {
                    is_relapse: false,
                    occurred_at: moment().subtract(i, 'days').format("YYYY-MM-DD")
                };
                i++;
                arrPornFree.push(obj);
            }
        }
        //let arr = arrPornFree;
    };

    setMosturbationCalendar = (day) => {
        if(day == 0) {
            let obj = {
                is_relapse: true,
                occurred_at: moment().format("YYYY-MM-DD")
            };
            arrMosturbateFree.push(obj);
            //today
        }else if(day == 1) {

        }else {
            let i=1;
            while(i<day){
                let obj = {
                    is_relapse: false,
                    occurred_at: moment().subtract(i, 'days').format("YYYY-MM-DD")
                };
                i++;
                arrMosturbateFree.push(obj);
            }
        }
    };

    setCheckupTime = (time) => {
        let timeVal = 18;
        switch (time) {
            case "7pm" :
                timeVal=19; break;
            case "8pm" :
                timeVal=20; break;
            case "9pm" :
                timeVal=21; break;
            case "10pm" :
                timeVal=22; break;
            case "11pm" :
                timeVal=23; break;
        }
        this.props.updateMetaData({
            last_checkup_at: moment().subtract(1, 'days').format('YYYY-MM-DD'),
            checkup_time: timeVal,
        });
    };

    render() {
        return (
            <View style={styles.container}>
                <Animatable.View style={styles.container} ref="mainView">
                    {(!this.state.isCompleted) ?
                        (this.state.selectionPart == 1) ?
                            <BeforeBeginComponent
                                title2={"When did you last use porn?"}
                                selectionPart={1}
                                selectedDay={this.state.selectedPornDay}
                                onDaySelect={this.onDaySelect}/>
                            :
                            (this.state.selectionPart == 2) ?
                                <BeforeBeginComponent
                                    title2={"When did you last masturbate?"}
                                    selectionPart={2}
                                    selectedDay={this.state.selectedMosturbateDay}
                                    onDaySelect={this.onDaySelect}/>
                                :
                                <BeforeBeginComponent
                                    title2={"What time would you like your evening checkup?"}
                                    selectionPart={3}
                                    selectedDay={this.state.selectedMosturbateDay}
                                    onDaySelect={this.onDaySelect}/>
                        : null
                    }
                </Animatable.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: 'rgb(22,93,120)'
    }
});

const mapStateToProps = state => {
    return {};
};

export default connect(mapStateToProps, {
    updateMetaData,
    setBeforeBeginPornFreeDays,
    setBeforeBeginMasturbationFreeDays,
})(BeforeBegin);