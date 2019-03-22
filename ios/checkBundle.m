#import "checkBundle.h"
#import "IQKeyboardManager.h"
#import "NotificationService.h"

@interface checkBundle ()

@end

@implementation checkBundle

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(findEvents:(RCTResponseSenderBlock)callback)
{
  NSLog(@"%@", [[[NSUserDefaults standardUserDefaults] dictionaryRepresentation] allValues]);
  
  NSString *events = [[NSUserDefaults standardUserDefaults] valueForKey:@"LastAppVersion"];
  
  NSString *version = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];
  
  [[NSUserDefaults standardUserDefaults] setValue:version forKey:@"LastAppVersion"];
  
  [[NSUserDefaults standardUserDefaults] synchronize];
  
  if(events == nil){
    events = version;
  }
  callback(@[[NSNull null], events]);
}

RCT_EXPORT_METHOD(installationDate:(RCTResponseSenderBlock)callback)
{
  NSURL* urlToDocumentsFolder = [[[NSFileManager defaultManager] URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask] lastObject];
  __autoreleasing NSError *error;
  NSDate *installDate = [[[NSFileManager defaultManager] attributesOfItemAtPath:urlToDocumentsFolder.path error:&error] objectForKey:NSFileCreationDate];
  
  NSLog(@"This app was installed by the user on %@", installDate);
  
  NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
  [dateFormatter setDateFormat:@"YYYY-MM-dd"];
  
  NSString *dateString = [dateFormatter stringFromDate:installDate];
  NSLog(@"Call-method %@", dateString);
  
  callback(@[[NSNull null], dateString]);
}

//Managed IQ keybord
RCT_EXPORT_METHOD(manageKeyboard: (BOOL) isEnable)
{
  if(isEnable){
    [[IQKeyboardManager sharedManager] setEnableAutoToolbar:NO];
    [[IQKeyboardManager sharedManager] setEnable:YES];
  }else{
    [[IQKeyboardManager sharedManager] setEnable:NO];
  }
}

//Badge count in app group
RCT_EXPORT_METHOD(setBadgeCountInAppGroup: (int)badgeVlaue sendCallBack: (RCTResponseSenderBlock)callback)
{
  @try{
      NSUserDefaults *sharedDefaults = [[NSUserDefaults alloc] initWithSuiteName:@"group.com.ausappstudio.brainbuddy.onesignal"];
//      [sharedDefaults setObject:0 forKey:@"onesignalBadgeCount"];
       [sharedDefaults setObject:@(badgeVlaue) forKey:@"onesignalBadgeCount"];
      [sharedDefaults synchronize];
    
//    NSString *dd = [(NSNumber *)[sharedDefaults objectForKey:@"onesignalBadgeCount"] stringValue];
//    NSLog(@"%@",dd);
//    
//    (AppObj).badgeValue = 0;
//    
//    [[UIApplication sharedApplication] setApplicationIconBadgeNumber:(AppObj).badgeValue];
    
      callback(@[[NSNull null], @"DONE"]);
  }@catch(id anException){
      callback(@[[NSNull null], @"NULL"]);
  }
}

//Badge count in app group
RCT_EXPORT_METHOD(getBadgeCountInAppGroup: (RCTResponseSenderBlock)callback)
{
  @try{
    NSUserDefaults *sharedDefaults = [[NSUserDefaults alloc] initWithSuiteName:@"group.com.ausappstudio.brainbuddy.onesignal"];
    //      [sharedDefaults setObject:0 forKey:@"onesignalBadgeCount"];
    NSString *dd = [(NSNumber *)[sharedDefaults objectForKey:@"onesignalBadgeCount"] stringValue];
    NSLog(@"%@",dd);
    callback(@[[NSNull null], dd]);
  }@catch(id anException){
    callback(@[[NSNull null], @"NULL"]);
  }
}

//Country is in Europe
RCT_EXPORT_METHOD(isEuropeanCountry: (RCTResponseSenderBlock)callback)
{
  @try{
    NSLocale *locale = [NSLocale currentLocale];
    NSString *countryCode = [locale objectForKey: NSLocaleCountryCode];
    NSArray *arrEuropeanCountryCode = @[@"AT", @"BE", @"BG",@"CY", @"CZ", @"DK", @"DE", @"EE", @"IE", @"EL", @"ES", @"FR", @"HR", @"IT", @"LV",
                                @"LT", @"LU", @"HU", @"MT", @"NL", @"AT", @"PL", @"PT", @"RO", @"SI", @"SK", @"FI", @"SE", @"UK", @"GB"];
    BOOL isTheObjectThere = [arrEuropeanCountryCode containsObject: countryCode];
    if(isTheObjectThere){
        callback(@[[NSNull null], @"YES"]);
    }else{
        callback(@[[NSNull null], @"NO"]);
    }
  }@catch(id anException){
    callback(@[[NSNull null], @"NO"]);
  }
}

//Country is in Europe
RCT_EXPORT_METHOD(getCountryCode: (RCTResponseSenderBlock)callback)
{
  @try{
    NSLocale *locale = [NSLocale currentLocale];
    NSString *countryCode = [locale objectForKey: NSLocaleCountryCode];
    callback(@[[NSNull null], countryCode]);
  }@catch(id anException){
    callback(@[[NSNull null], @"NULL"]);
  }
}

//Pushnotification checking
RCT_EXPORT_METHOD(checkForNotification: (RCTResponseSenderBlock)callback)
{
  [[UNUserNotificationCenter currentNotificationCenter]getNotificationSettingsWithCompletionHandler:^(UNNotificationSettings * _Nonnull settings) {
    switch (settings.authorizationStatus) {
      case UNAuthorizationStatusNotDetermined:{
        NSLog(@"UNAuthorizationStatusNotDetermined");
        callback(@[[NSNull null], @"NotDetermined"]);
        break;
      }
      case UNAuthorizationStatusDenied:{
        NSLog(@"UNAuthorizationStatusDenied");
        callback(@[[NSNull null], @"Denied"]);
        break;
      }
      case UNAuthorizationStatusAuthorized:{
        NSLog(@"UNAuthorizationStatusAuthorized");
        callback(@[[NSNull null], @"Authorized"]);
        break;
      }
      default:
        break;
    }
  }];
}

//Get TimeZone
RCT_EXPORT_METHOD(getTimeZone: (RCTResponseSenderBlock)callback)
{
  @try{
    NSTimeZone *timeZone = [NSTimeZone localTimeZone];
    NSString *tzName = [timeZone name];
    callback(@[[NSNull null], tzName]);
  }@catch(id anException){
    callback(@[[NSNull null], @"NULL"]);
  }
}

@end
