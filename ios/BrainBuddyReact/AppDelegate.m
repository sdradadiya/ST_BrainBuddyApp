/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import <Fabric/Fabric.h>
#import <Crashlytics/Crashlytics.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <UIKit/UIKit.h>
#import <React/RCTPushNotificationManager.h>
//#import <SafariServices/SafariServices.h>
#define IS_IPHONEX (([[UIScreen mainScreen] bounds].size.height-812)?NO:YES)
#import "IQKeyboardManager.h"

@implementation AppDelegate
@synthesize oneSignal = _oneSignal;

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
  //  jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  //  for (NSString* family in [UIFont familyNames])
  //  {
  //    NSLog(@"%@", family);
  //    for (NSString* name in [UIFont fontNamesForFamilyName: family])
  //    {
  //      NSLog(@" %@", name);
  //    }
  //  }

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"BrainBuddyReact"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  
  rootView.backgroundColor = [[UIColor alloc] initWithRed:0.003921568627f green:0.3254901961f blue:0.4274509804f alpha:1];
//  rootView.backgroundColor = [[UIColor alloc] initWithRed:1 green:0 blue:0 alpha:1];
  if(!IS_IPHONEX) {
    NSString *img = @"splashimages";
    //    img = @"SplashX";
    UIImageView *launchView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:img]];
    launchView.frame = [UIScreen.mainScreen bounds];
    launchView.contentMode = UIViewContentModeScaleAspectFit;
    rootView.loadingView = launchView;
    rootView.loadingViewFadeDelay = 0.20;
    rootView.loadingViewFadeDuration = 0.90;
  }
  
//  [[IQKeyboardManager sharedManager] setEnableAutoToolbar:NO];
  
  [[IQKeyboardManager sharedManager] setEnableAutoToolbar:NO];
  [[IQKeyboardManager sharedManager] setEnable:NO];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
#if DEBUG
#else
    [Fabric with:@[[Crashlytics class]]];
#endif

  //id onesignalInitSettings = @{kOSSettingsKeyAutoPrompt : @NO};
  
  self.oneSignal = [[RCTOneSignal alloc] initWithLaunchOptions:launchOptions
                                                         appId:@"dd301236-59aa-4862-95f9-c708dcc61507"
                                                      settings:@{kOSSettingsKeyInFocusDisplayOption : @(OSNotificationDisplayTypeNone),
                                                                 kOSSettingsKeyAutoPrompt : @NO}];
   return YES;
}

// Required to register for notifications
- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
  [RCTPushNotificationManager didRegisterUserNotificationSettings:notificationSettings];
}

// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  NSLog(@"%@", deviceToken);
  [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}

// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RCTPushNotificationManager didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}

// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  [RCTPushNotificationManager didFailToRegisterForRemoteNotificationsWithError:error];
}

// Required for the localNotification event.
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
  [RCTPushNotificationManager didReceiveLocalNotification:notification];
}

@end
