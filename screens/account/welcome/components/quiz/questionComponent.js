import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Constant from '../../../../../helper/constant';

export default  class questionComponent extends React.PureComponent {

    // shouldComponentUpdate(nextProps, nextState) {
    //     if(JSON.stringify(this.props) !== JSON.stringify(nextProps) || JSON.stringify(this.state) !== JSON.stringify(nextState)){
    //         return true;
    //     }else {
    //         return false
    //     }
    // }

    render() {
        return (
            <View style={styles.viewMain}>
                <Text style={styles.titleText}>
                    {this.props.questionText}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    viewMain:{
        //paddingTop: 42,
        //paddingBottom: 37,
        height: 92,
        justifyContent: 'center'
    },
    titleText:{
        fontSize: 16,
        color: '#4e4e4e',
        fontFamily: Constant.font500,
        lineHeight: 23
    }
});