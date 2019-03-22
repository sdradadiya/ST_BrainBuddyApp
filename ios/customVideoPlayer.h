#import "AppDelegate.h"

#import <React/RCTBridgeModule.h>
# import <React/RCTLog.h>
#import <Foundation/Foundation.h>
#import <AVKit/AVKit.h>
#import <AVFoundation/AVFoundation.h>
#import <React/RCTEventEmitter.h>

@interface customVideoPlayer : RCTEventEmitter <RCTBridgeModule>

@property (strong, nonatomic) NSURL *videoURL;
@property (nonatomic, strong) AVPlayer *player;
@property (nonatomic, strong) AVPlayerViewController *playerViewController;

@end
