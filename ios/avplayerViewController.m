#import "avplayerViewController.h"

@interface avplayerViewController ()

@end

@implementation avplayerViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    [self loadVideo];
    // Do any additional setup after loading the view.
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

-(void)loadVideo{
    NSURL *url = [NSURL URLWithString:@"https://s3.amazonaws.com/brainbuddyhostingapp/Imagine/imagine-1.mp4"];
    AVPlayer *player = [[AVPlayer alloc]initWithURL:url];
    self.player = player;
    [self.player play];
}

-(BOOL)shouldAutorotate{
    return NO;
}

@end
