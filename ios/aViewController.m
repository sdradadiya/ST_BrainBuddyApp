#import "aViewController.h"
#import "avplayerViewController.h"

@interface aViewController ()

@end

@implementation aViewController

- (void)viewDidLoad {
    [super viewDidLoad];
  avplayerViewController *av = [[avplayerViewController alloc]initWithNibName:@"avplayerController" bundle:nil];
  [self presentViewController:av animated:NO completion:nil];
    // Do any additional setup after loading the view from its nib.

}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
