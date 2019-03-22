#import "customVideoPlayer.h"
#import "aViewController.h"

@implementation customVideoPlayer

RCT_EXPORT_MODULE()

- (NSArray<NSString *> *)supportedEvents {
  return @[@"sayHello"];
}

- (void)killPlayer{
  NSLog(@"call Kill");
  
  if (!_player) return;
  if(_player == nil) return;
  @try{
    [self.playerViewController removeObserver:self forKeyPath:@"view.frame" context:nil];
  }@catch(id anException){
    NSLog(@"execute catch block in kill view.frame");
  }
  @try{
    [[NSNotificationCenter defaultCenter]removeObserver:self name:AVPlayerItemDidPlayToEndTimeNotification object:_player.currentItem];
  }@catch(id anException){
    NSLog(@"execute catch block in kill AVPlayerItemDidPlayToEndTimeNotification");
  }
  @try{
    [_player pause];
    //[_player removeObserver:self forKeyPath:@"status"];
    [_player removeObserver:self forKeyPath:@"status" context:nil];
  }@catch(id anException){
    NSLog(@"execute catch block in killstatus");
  }
  //  [self.playerViewController dismissViewControllerAnimated:NO completion:nil];
  _player = nil;
}

RCT_EXPORT_METHOD(killPlayerInstance)
{
  [self killPlayer];
}

RCT_EXPORT_METHOD(showVideoPlayer: (NSString*) url)
{
  
  //  AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
  //
  //  aViewController *av = [[aViewController alloc]initWithNibName:@"aViewController" bundle:nil];
  //  [delegate.window.rootViewController presentViewController:av animated:NO completion:nil];
  @try{
    [self killPlayer];
    self.videoURL = [NSURL URLWithString:url];
    self.player = [AVPlayer playerWithURL:self.videoURL];
    self.playerViewController = [AVPlayerViewController new];
    _playerViewController.player = _player;
    _playerViewController.showsPlaybackControls = YES;
    [_player addObserver:self forKeyPath:@"status" options:NSKeyValueObservingOptionNew context:nil];
  }@catch(id anException){
    NSLog(@"execute catch block in showVideoPlayer");
  }
  
}

RCT_EXPORT_METHOD(PlayVideo) {
  
  @try{
    [_playerViewController.player play];
    AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    
    dispatch_async(dispatch_get_main_queue(), ^{
      [delegate.window.rootViewController.view addSubview:self.playerViewController.view];
      [delegate.window.rootViewController presentViewController:self.playerViewController animated:NO completion:^(){
        [self.playerViewController addObserver:self forKeyPath:@"view.frame" options:NSKeyValueObservingOptionOld context:nil];
      }];
    });
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(itemDidFinishPlaying:) name: AVPlayerItemDidPlayToEndTimeNotification object:_playerViewController.player.currentItem];
  }@catch(id anException){
    NSLog(@"execute catch block in PlayVideo");
  }
  
}

-(void)itemDidFinishPlaying:(NSNotification *) notification {
  [self DoneVideoPlaying:@"Finish"];
}

-(void)DoneVideoPlaying:(NSString *) isDone{
  
  @try{
    dispatch_async(dispatch_get_main_queue(), ^{
      NSLog(@"============");
      [self sendEventWithName:@"sayHello" body:isDone];
      [self killPlayer];
      [self.playerViewController dismissViewControllerAnimated:NO completion:nil];
    });
  }@catch(id anException){
    dispatch_async(dispatch_get_main_queue(), ^{
      NSLog(@"***********");
      [self sendEventWithName:@"sayHello" body:isDone];
      [self killPlayer];
    });
  }
  
  //  @try{
  //    [self.playerViewController removeObserver:self forKeyPath:@"view.frame" context:nil];
  //  }@catch(id anException){
  //    NSLog(@"execute catch block in kill");
  //  }
  //  @try{
  //    [[NSNotificationCenter defaultCenter]removeObserver:self name:AVPlayerItemDidPlayToEndTimeNotification object:_player.currentItem];
  //  }@catch(id anException){
  //    NSLog(@"execute catch block in kill");
  //  }
}

#pragma Observer for Player status.
- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context {
  @try{
    if (object == _player && [keyPath isEqualToString:@"status"]) {
      
      if (_player.status == AVPlayerStatusFailed) {
        
        NSLog(@"AVPlayer Failed");
        
      } else if (_player.status == AVPlayerStatusReadyToPlay) {
        
        NSLog(@"AVPlayerStatusReadyToPlay");
        
        [self sendEventWithName:@"sayHello" body:@"Ready"];
        
      }
    }else if([keyPath isEqualToString:@"view.frame"]){
      if(self.playerViewController.player.rate == 0){
        [self DoneVideoPlaying:@"DonePress"];
      }else{
        
      }
    }
  }@catch(id anException){
    NSLog(@"execute catch block in observeValueForKeyPath");
  }
}

-(NSUInteger)supportedInterfaceOrientations{
  return UIInterfaceOrientationMaskPortrait;
}

-(BOOL)shouldAutorotate {
  return NO;
}

@end
