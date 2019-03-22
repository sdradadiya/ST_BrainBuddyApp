import React, { Component } from 'react';
import {Alert, NativeModules,AsyncStorage} from 'react-native';
// import RNFS from 'react-native-fs';
import Constant from './constant';
import { EventRegister } from 'react-native-event-listeners'
import moment from "moment";

let AndroidNativeModule = NativeModules.AndroidNativeModule;
export function isValidPhoneNo(phoneNo) {
    const phoneNumberPattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    return phoneNumberPattern.test(phoneNo);
}

export function isValidEmail(email) {
    const format = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return format.test(email);
}

export function isEmpty(text) {
    return (text.toString().trim().length > 0 && text.toString().trim() != "0");
}

export function showNoInternetAlert(isLightTheme=false) {
    if(Constant.isANDROID){
        showThemeAlert({title:"No internet connection",
            message: "Check your connection and try again.",
            leftBtn: "OK",isLightTheme: isLightTheme});
    }else{
        Alert.alert("No internet connection",
            "Check your connection and try again.",
            [
                {text: 'OK', onPress: () => {}},
            ],
            { cancelable: false }
        )
    }
}

export function showCustomAlert(title, alertText, btnTitle, isLightTheme=false) {
    if(Constant.isANDROID){
        showThemeAlert({title:title,
            message: alertText,
            leftBtn: btnTitle,isLightTheme: isLightTheme});

    }else{
        Alert.alert(title,
            alertText,
            [
                {text: btnTitle, onPress: () => {}},
            ],
            { cancelable: false })
    }
}

export  function callTodayScreenEcentListner(flagIsToday = true) {
    EventRegister.emit('isTodayEventListener', flagIsToday);
}

onLeftBtnPress = (res) => {
    console.log("not Handle");
};

onRightBtnPress = (res) => {
    console.log("not Handle");
};

export function showThemeAlert(objAlert) {
    let defaultAlertObj = {
        title: "",
        message: "",
        leftBtn: "",
        rightBtn: "",
        isLightTheme: false,
        leftPress: onLeftBtnPress,
        rightPress: onRightBtnPress,
        styleLeft: 'default',
        styleRight: 'default',
    };
    Object.assign(defaultAlertObj, objAlert);
    if(Constant.isANDROID){
        AndroidNativeModule.showThemeAlert(defaultAlertObj.title,
            defaultAlertObj.message, defaultAlertObj.leftBtn, defaultAlertObj.rightBtn,
            defaultAlertObj.isLightTheme,
            defaultAlertObj.leftPress,
            defaultAlertObj.rightPress);
    }else{
        Alert.alert(defaultAlertObj.title,
            defaultAlertObj.message,
            [
                {text: defaultAlertObj.leftBtn, onPress: defaultAlertObj.leftPress,
                    style: defaultAlertObj.styleLeft},
                {text: defaultAlertObj.rightBtn, onPress: defaultAlertObj.rightPress,
                    style: defaultAlertObj.styleRight},
            ],
        );
    }
}

// export const downloadImageFromURL = (imageUrl, exNo) => {
//     let dirs = '';
//     if (Constant.isIOS) {
//         dirs = RNFS.DocumentDirectoryPath
//     } else {
//         dirs = RNFS.ExternalDirectoryPath
//     }
//     return RNFS.mkdir(dirs+'/AppData/ThoughtControl').then((res) => {
//         let background = true;
//         const fileName = "thoughtControl-"+ exNo + ".png";
//         const downloadDest = `${dirs}/AppData/ThoughtControl/${fileName}`;
//         const ret = RNFS.downloadFile({ fromUrl: imageUrl, toFile: downloadDest});
//         return ret.promise.then(res => {
//             console.log('download then:::',downloadDest);
//             return Promise.resolve(downloadDest);
//         }).catch(err => {
//             return Promise.reject(downloadDest);
//         });
//     }).catch((err) => {
//         console.log("error creting path for introduction audio");
//         return Promise.reject(downloadDest);
//     })
// };

export function resetAllAsyncStorageData() {
    AsyncStorage.getAllKeys((err,keys)=>{
        keys.forEach(key=>{
            AsyncStorage.getItem(key).then((err,res)=>{
            })
            AsyncStorage.removeItem(key);
        })
        AsyncStorage.setItem('isNewOpen',"true");
    });
}

export function getAvatarImage(imageId, gender = "male") {
    switch (imageId) {
        case 0:
            if(gender.includes("female")){
                return require('../assets/images/avatar_images/avatar-lge-46.png');
            }
            return require('../assets/images/avatar_images/avatar-lge-1.png');
            break;
        case 2:
            return require('../assets/images/avatar_images/avatar-lge-2.png');
            break;
        case 3:
            return require('../assets/images/avatar_images/avatar-lge-3.png');
            break;
        case 4:
            return require('../assets/images/avatar_images/avatar-lge-4.png');
            break;
        case 5:
            return require('../assets/images/avatar_images/avatar-lge-5.png');
            break;
        case 6:
            return require('../assets/images/avatar_images/avatar-lge-6.png');
            break;
        case 7:
            return require('../assets/images/avatar_images/avatar-lge-7.png');
            break;
        case 8:
            return require('../assets/images/avatar_images/avatar-lge-8.png');
            break;
        case 9:
            return require('../assets/images/avatar_images/avatar-lge-9.png');
            break;
        case 10:
            return require('../assets/images/avatar_images/avatar-lge-10.png');
            break;
        case 11:
            return require('../assets/images/avatar_images/avatar-lge-11.png');
            break;
        case 12:
            return require('../assets/images/avatar_images/avatar-lge-12.png');
            break;
        case 13:
            return require('../assets/images/avatar_images/avatar-lge-13.png');
            break;
        case 14:
            return require('../assets/images/avatar_images/avatar-lge-14.png');
            break;
        case 15:
            return require('../assets/images/avatar_images/avatar-lge-15.png');
            break;
        case 16:
            return require('../assets/images/avatar_images/avatar-lge-16.png');
            break;
        case 17:
            return require('../assets/images/avatar_images/avatar-lge-17.png');
            break;
        case 18:
            return require('../assets/images/avatar_images/avatar-lge-18.png');
            break;
        case 19:
            return require('../assets/images/avatar_images/avatar-lge-19.png');
            break;
        case 20:
            return require('../assets/images/avatar_images/avatar-lge-20.png');
            break;
        case 21:
            return require('../assets/images/avatar_images/avatar-lge-21.png');
            break;
        case 22:
            return require('../assets/images/avatar_images/avatar-lge-22.png');
            break;
        case 23:
            return require('../assets/images/avatar_images/avatar-lge-23.png');
            break;
        case 24:
            return require('../assets/images/avatar_images/avatar-lge-24.png');
            break;
        case 25:
            return require('../assets/images/avatar_images/avatar-lge-25.png');
            break;
        case 26:
            return require('../assets/images/avatar_images/avatar-lge-26.png');
            break;
        case 27:
            return require('../assets/images/avatar_images/avatar-lge-27.png');
            break;
        case 28:
            return require('../assets/images/avatar_images/avatar-lge-28.png');
            break;
        case 29:
            return require('../assets/images/avatar_images/avatar-lge-29.png');
            break;
        case 30:
            return require('../assets/images/avatar_images/avatar-lge-30.png');
            break;
        case 31:
            return require('../assets/images/avatar_images/avatar-lge-31.png');
            break;
        case 32:
            return require('../assets/images/avatar_images/avatar-lge-32.png');
            break;
        case 33:
            return require('../assets/images/avatar_images/avatar-lge-33.png');
            break;
        case 34:
            return require('../assets/images/avatar_images/avatar-lge-34.png');
            break;
        case 35:
            return require('../assets/images/avatar_images/avatar-lge-35.png');
            break;
        case 36:
            return require('../assets/images/avatar_images/avatar-lge-36.png');
            break;
        case 37:
            return require('../assets/images/avatar_images/avatar-lge-37.png');
            break;
        case 38:
            return require('../assets/images/avatar_images/avatar-lge-38.png');
            break;
        case 39:
            return require('../assets/images/avatar_images/avatar-lge-39.png');
            break;
        case 40:
            return require('../assets/images/avatar_images/avatar-lge-40.png');
            break;
        case 41:
            return require('../assets/images/avatar_images/avatar-lge-41.png');
            break;
        case 42:
            return require('../assets/images/avatar_images/avatar-lge-42.png');
            break;
        case 43:
            return require('../assets/images/avatar_images/avatar-lge-43.png');
            break;
        case 44:
            return require('../assets/images/avatar_images/avatar-lge-44.png');
            break;
        case 45:
            return require('../assets/images/avatar_images/avatar-lge-45.png');
            break;
        case 46:
            return require('../assets/images/avatar_images/avatar-lge-46.png');
            break;
        case 47:
            return require('../assets/images/avatar_images/avatar-lge-47.png');
            break;
        case 48:
            return require('../assets/images/avatar_images/avatar-lge-48.png');
            break;
        case 49:
            return require('../assets/images/avatar_images/avatar-lge-49.png');
            break;
        case 50:
            return require('../assets/images/avatar_images/avatar-lge-50.png');
            break;
        case 51:
            return require('../assets/images/avatar_images/avatar-lge-51.png');
            break;
        case 52:
            return require('../assets/images/avatar_images/avatar-lge-52.png');
            break;
        case 53:
            return require('../assets/images/avatar_images/avatar-lge-53.png');
            break;
        case 54:
            return require('../assets/images/avatar_images/avatar-lge-54.png');
            break;
        case 55:
            return require('../assets/images/avatar_images/avatar-lge-55.png');
            break;
        case 56:
            return require('../assets/images/avatar_images/avatar-lge-56.png');
            break;
        case 57:
            return require('../assets/images/avatar_images/avatar-lge-57.png');
            break;
        case 58:
            return require('../assets/images/avatar_images/avatar-lge-58.png');
            break;
        case 59:
            return require('../assets/images/avatar_images/avatar-lge-59.png');
            break;
        case 60:
            return require('../assets/images/avatar_images/avatar-lge-60.png');
            break;
        case 61:
            return require('../assets/images/avatar_images/avatar-lge-61.png');
            break;
        case 62:
            return require('../assets/images/avatar_images/avatar-lge-62.png');
            break;
        case 63:
            return require('../assets/images/avatar_images/avatar-lge-63.png');
            break;
        case 64:
            return require('../assets/images/avatar_images/avatar-lge-64.png');
            break;
        case 65:
            return require('../assets/images/avatar_images/avatar-lge-65.png');
            break;
        case 66:
            return require('../assets/images/avatar_images/avatar-lge-66.png');
            break;
        case 67:
            return require('../assets/images/avatar_images/avatar-lge-67.png');
            break;
        case 68:
            return require('../assets/images/avatar_images/avatar-lge-68.png');
            break;
        case 69:
            return require('../assets/images/avatar_images/avatar-lge-69.png');
            break;
        case 70:
            return require('../assets/images/avatar_images/avatar-lge-70.png');
            break;
        case 71:
            return require('../assets/images/avatar_images/avatar-lge-71.png');
            break;
        case 72:
            return require('../assets/images/avatar_images/avatar-lge-72.png');
            break;
        case 73:
            return require('../assets/images/avatar_images/avatar-lge-73.png');
            break;
        case 74:
            return require('../assets/images/avatar_images/avatar-lge-74.png');
            break;
        case 75:
            return require('../assets/images/avatar_images/avatar-lge-75.png');
            break;
        case 76:
            return require('../assets/images/avatar_images/avatar-lge-76.png');
            break;
        case 77:
            return require('../assets/images/avatar_images/avatar-lge-77.png');
            break;
        case 78:
            return require('../assets/images/avatar_images/avatar-lge-78.png');
            break;
        case 79:
            return require('../assets/images/avatar_images/avatar-lge-79.png');
            break;
        case 80:
            return require('../assets/images/avatar_images/avatar-lge-80.png');
            break;
        case 81:
            return require('../assets/images/avatar_images/avatar-lge-81.png');
            break;
        case 82:
            return require('../assets/images/avatar_images/avatar-lge-82.png');
            break;
        case 83:
            return require('../assets/images/avatar_images/avatar-lge-83.png');
            break;
        case 84:
            return require('../assets/images/avatar_images/avatar-lge-84.png');
            break;
        case 85:
            return require('../assets/images/avatar_images/avatar-lge-85.png');
            break;
        case 86:
            return require('../assets/images/avatar_images/avatar-lge-86.png');
            break;
        case 87:
            return require('../assets/images/avatar_images/avatar-lge-87.png');
            break;
        case 88:
            return require('../assets/images/avatar_images/avatar-lge-88.png');
            break;
        case 89:
            return require('../assets/images/avatar_images/avatar-lge-89.png');
            break;
        case 90:
            return require('../assets/images/avatar_images/avatar-lge-90.png');
            break;
        default:
            if(gender.includes("female")){
                return require('../assets/images/avatar_images/avatar-lge-46.png');
            }
            return require('../assets/images/avatar_images/avatar-lge-1.png');
            break;
    }
}

export function getSmallAvatarImage(imageId, gender = "male") {
    switch (imageId) {
        case 0:
            if(gender.includes("female")){
                return require('../assets/images/avatar_images_small/avatar-sml-46.png');
            }
            return require('../assets/images/avatar_images_small/avatar-sml-1.png');
            break;
        case 1:
            return require('../assets/images/avatar_images_small/avatar-sml-1.png');
            break;
        case 2:
            return require('../assets/images/avatar_images_small/avatar-sml-2.png');
            break;
        case 3:
            return require('../assets/images/avatar_images_small/avatar-sml-3.png');
            break;
        case 4:
            return require('../assets/images/avatar_images_small/avatar-sml-4.png');
            break;
        case 5:
            return require('../assets/images/avatar_images_small/avatar-sml-5.png');
            break;
        case 6:
            return require('../assets/images/avatar_images_small/avatar-sml-6.png');
            break;
        case 7:
            return require('../assets/images/avatar_images_small/avatar-sml-7.png');
            break;
        case 8:
            return require('../assets/images/avatar_images_small/avatar-sml-8.png');
            break;
        case 9:
            return require('../assets/images/avatar_images_small/avatar-sml-9.png');
            break;
        case 10:
            return require('../assets/images/avatar_images_small/avatar-sml-10.png');
            break;
        case 11:
            return require('../assets/images/avatar_images_small/avatar-sml-11.png');
            break;
        case 12:
            return require('../assets/images/avatar_images_small/avatar-sml-12.png');
            break;
        case 13:
            return require('../assets/images/avatar_images_small/avatar-sml-13.png');
            break;
        case 14:
            return require('../assets/images/avatar_images_small/avatar-sml-14.png');
            break;
        case 15:
            return require('../assets/images/avatar_images_small/avatar-sml-15.png');
            break;
        case 16:
            return require('../assets/images/avatar_images_small/avatar-sml-16.png');
            break;
        case 17:
            return require('../assets/images/avatar_images_small/avatar-sml-17.png');
            break;
        case 18:
            return require('../assets/images/avatar_images_small/avatar-sml-18.png');
            break;
        case 19:
            return require('../assets/images/avatar_images_small/avatar-sml-19.png');
            break;
        case 20:
            return require('../assets/images/avatar_images_small/avatar-sml-20.png');
            break;
        case 21:
            return require('../assets/images/avatar_images_small/avatar-sml-21.png');
            break;
        case 22:
            return require('../assets/images/avatar_images_small/avatar-sml-22.png');
            break;
        case 23:
            return require('../assets/images/avatar_images_small/avatar-sml-23.png');
            break;
        case 24:
            return require('../assets/images/avatar_images_small/avatar-sml-24.png');
            break;
        case 25:
            return require('../assets/images/avatar_images_small/avatar-sml-25.png');
            break;
        case 26:
            return require('../assets/images/avatar_images_small/avatar-sml-26.png');
            break;
        case 27:
            return require('../assets/images/avatar_images_small/avatar-sml-27.png');
            break;
        case 28:
            return require('../assets/images/avatar_images_small/avatar-sml-28.png');
            break;
        case 29:
            return require('../assets/images/avatar_images_small/avatar-sml-29.png');
            break;
        case 30:
            return require('../assets/images/avatar_images_small/avatar-sml-30.png');
            break;
        case 31:
            return require('../assets/images/avatar_images_small/avatar-sml-31.png');
            break;
        case 32:
            return require('../assets/images/avatar_images_small/avatar-sml-32.png');
            break;
        case 33:
            return require('../assets/images/avatar_images_small/avatar-sml-33.png');
            break;
        case 34:
            return require('../assets/images/avatar_images_small/avatar-sml-34.png');
            break;
        case 35:
            return require('../assets/images/avatar_images_small/avatar-sml-35.png');
            break;
        case 36:
            return require('../assets/images/avatar_images_small/avatar-sml-36.png');
            break;
        case 37:
            return require('../assets/images/avatar_images_small/avatar-sml-37.png');
            break;
        case 38:
            return require('../assets/images/avatar_images_small/avatar-sml-38.png');
            break;
        case 39:
            return require('../assets/images/avatar_images_small/avatar-sml-39.png');
            break;
        case 40:
            return require('../assets/images/avatar_images_small/avatar-sml-40.png');
            break;
        case 41:
            return require('../assets/images/avatar_images_small/avatar-sml-41.png');
            break;
        case 42:
            return require('../assets/images/avatar_images_small/avatar-sml-42.png');
            break;
        case 43:
            return require('../assets/images/avatar_images_small/avatar-sml-43.png');
            break;
        case 44:
            return require('../assets/images/avatar_images_small/avatar-sml-44.png');
            break;
        case 45:
            return require('../assets/images/avatar_images_small/avatar-sml-45.png');
            break;
        case 46:
            return require('../assets/images/avatar_images_small/avatar-sml-46.png');
            break;
        case 47:
            return require('../assets/images/avatar_images_small/avatar-sml-47.png');
            break;
        case 48:
            return require('../assets/images/avatar_images_small/avatar-sml-48.png');
            break;
        case 49:
            return require('../assets/images/avatar_images_small/avatar-sml-49.png');
            break;
        case 50:
            return require('../assets/images/avatar_images_small/avatar-sml-50.png');
            break;
        case 51:
            return require('../assets/images/avatar_images_small/avatar-sml-51.png');
            break;
        case 52:
            return require('../assets/images/avatar_images_small/avatar-sml-52.png');
            break;
        case 53:
            return require('../assets/images/avatar_images_small/avatar-sml-53.png');
            break;
        case 54:
            return require('../assets/images/avatar_images_small/avatar-sml-54.png');
            break;
        case 55:
            return require('../assets/images/avatar_images_small/avatar-sml-55.png');
            break;
        case 56:
            return require('../assets/images/avatar_images_small/avatar-sml-56.png');
            break;
        case 57:
            return require('../assets/images/avatar_images_small/avatar-sml-57.png');
            break;
        case 58:
            return require('../assets/images/avatar_images_small/avatar-sml-58.png');
            break;
        case 59:
            return require('../assets/images/avatar_images_small/avatar-sml-59.png');
            break;
        case 60:
            return require('../assets/images/avatar_images_small/avatar-sml-60.png');
            break;
        case 61:
            return require('../assets/images/avatar_images_small/avatar-sml-61.png');
            break;
        case 62:
            return require('../assets/images/avatar_images_small/avatar-sml-62.png');
            break;
        case 63:
            return require('../assets/images/avatar_images_small/avatar-sml-63.png');
            break;
        case 64:
            return require('../assets/images/avatar_images_small/avatar-sml-64.png');
            break;
        case 65:
            return require('../assets/images/avatar_images_small/avatar-sml-65.png');
            break;
        case 66:
            return require('../assets/images/avatar_images_small/avatar-sml-66.png');
            break;
        case 67:
            return require('../assets/images/avatar_images_small/avatar-sml-67.png');
            break;
        case 68:
            return require('../assets/images/avatar_images_small/avatar-sml-68.png');
            break;
        case 69:
            return require('../assets/images/avatar_images_small/avatar-sml-69.png');
            break;
        case 70:
            return require('../assets/images/avatar_images_small/avatar-sml-70.png');
            break;
        case 71:
            return require('../assets/images/avatar_images_small/avatar-sml-71.png');
            break;
        case 72:
            return require('../assets/images/avatar_images_small/avatar-sml-72.png');
            break;
        case 73:
            return require('../assets/images/avatar_images_small/avatar-sml-73.png');
            break;
        case 74:
            return require('../assets/images/avatar_images_small/avatar-sml-74.png');
            break;
        case 75:
            return require('../assets/images/avatar_images_small/avatar-sml-75.png');
            break;
        case 76:
            return require('../assets/images/avatar_images_small/avatar-sml-76.png');
            break;
        case 77:
            return require('../assets/images/avatar_images_small/avatar-sml-77.png');
            break;
        case 78:
            return require('../assets/images/avatar_images_small/avatar-sml-78.png');
            break;
        case 79:
            return require('../assets/images/avatar_images_small/avatar-sml-79.png');
            break;
        case 80:
            return require('../assets/images/avatar_images_small/avatar-sml-80.png');
            break;
        case 81:
            return require('../assets/images/avatar_images_small/avatar-sml-81.png');
            break;
        case 82:
            return require('../assets/images/avatar_images_small/avatar-sml-82.png');
            break;
        case 83:
            return require('../assets/images/avatar_images_small/avatar-sml-83.png');
            break;
        case 84:
            return require('../assets/images/avatar_images_small/avatar-sml-84.png');
            break;
        case 85:
            return require('../assets/images/avatar_images_small/avatar-sml-85.png');
            break;
        case 86:
            return require('../assets/images/avatar_images_small/avatar-sml-86.png');
            break;
        case 87:
            return require('../assets/images/avatar_images_small/avatar-sml-87.png');
            break;
        case 88:
            return require('../assets/images/avatar_images_small/avatar-sml-88.png');
            break;
        case 89:
            return require('../assets/images/avatar_images_small/avatar-sml-89.png');
            break;
        case 90:
            return require('../assets/images/avatar_images_small/avatar-sml-90.png');
            break;
        default:
            if(gender.includes("female")){
                return require('../assets/images/avatar_images_small/avatar-sml-46.png');
            }
            return require('../assets/images/avatar_images_small/avatar-sml-1.png');
            break;
    }
}

export function isReligious(comment) {
    let outputString = Constant.NO_RELIGIOUS;
    const religiousWord = ['corinthians', 'his grace', 'jesuit', 'psalms', 'holy spirit', 'leviticus', 'atonement', 'baptism', 'body of christ',
        'messiah', 'covenant', 'jerusalem', 'new testament', 'old testament', 'salvation', 'commandment', 'lord', 'prophet','zechariah',
        'malachi', 'haggai', 'zephaniah', 'habakkuk', 'nahum', 'micah', 'obadiah', 'hosea', 'ezekiel', 'lamentations', 'ecclesiastes',
        'proverbs', 'nehemiah', 'deuteronomy', 'exodus', 'genesis', 'galatians', 'ephesians', 'philippians', 'colossians', 'thesssaolnians',
        'philemon', 'psalm', 'qur’an', 'your lord', 'sinners', 'resurrection', 'abraham'];
    let isReligious = false;
    for (var i = 0; i < religiousWord.length; i++) {
        //if (comment.toLowerCase().includes(religiousWord[i])) {
        if(RegExp( '\\b' + religiousWord[i] + '\\b', 'i').test(comment)){
            outputString = Constant.RELIGIOUS;
            break;
        }
    }
    if(outputString == Constant.RELIGIOUS){
        return outputString;
    }
    const containTwoOfeach = ['he died', 'god', 'Jesus', 'christ', 'faith', 'heaven', 'bible', 'eternal', 'grace', 'hebrew', 'holy',
        'advent', 'amen', 'apostle', 'ascension', 'atone', 'christian', 'church', 'jehovah', 'judgement',
        'redemption', 'satan', 'sin', 'sins', 'righteous', 'chronicles', 'revelation','luke', 'matthew', 'john'];
    let wordCount = 0;
        for (var i = 0; i < containTwoOfeach.length; i++) {
            if(RegExp( '\\b' + containTwoOfeach[i] + '\\b', 'i').test(comment)){
            //if (comment.toLowerCase().includes(containTwoOfeach[i])) {
                wordCount += 1;
            }
            if(wordCount >= 2){
                outputString = Constant.RELIGIOUS;
                break;
            }
        }
    if(outputString == Constant.RELIGIOUS){
        return outputString;
    }
    if(wordCount == 1){
        outputString = Constant.ASK_RELIGIOUS_ALERT;
    }
    return outputString;
}

export function getTimeFromDate(date){
    let selectedDate = moment(date);
    let time = selectedDate.format('hh:mm');
    time = time + ((selectedDate.hour()) >= 12 ? ' PM' : ' AM');
    return time;
}

export function getTimeString(time){
    if(time == 0){
        return "12:00 PM";
    }
    let val = "";
    let hours = (time > 12) && (time - 12) || time;
    if(hours < 10){
        hours = "0" + hours;
    }
    val  = hours + ":00" + (time > 12 ? ' PM' : ' AM');
    return val
}

export function getCurrentMonth(monthIndex = null) {
    var d = new Date();
    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    let currentMonth = d.getMonth();
    if(monthIndex != null){
        currentMonth = monthIndex;
    }
    var n = month[currentMonth];
    return n;
}