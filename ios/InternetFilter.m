//
//  InternetFilter.m
//  BrainBuddyReact
//
//  Create on 30/03/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "InternetFilter.h"
#import <SafariServices/SafariServices.h>

@implementation InternetFilter

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(setSites: (NSString *)jsonObj isBlockAdult: (BOOL) isBlockAllWebsite call:(RCTResponseSenderBlock)callback )
{
  @try{
    NSString *groupName = @"group.com.ausappstudio.brainbuddy";
    NSURL *containerURL = [[NSFileManager defaultManager] containerURLForSecurityApplicationGroupIdentifier:groupName];
    containerURL = [containerURL URLByAppendingPathComponent:[NSString stringWithFormat:@"blockerList.json"]];
    
    if(isBlockAllWebsite) {
      NSData *data = [jsonObj dataUsingEncoding:NSUTF8StringEncoding];
      id jsonObjects = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingMutableContainers error:nil];
      if([jsonObjects isKindOfClass:[NSArray class]]){
        NSArray *allDataFromReact = [[NSArray alloc] init];
        allDataFromReact = jsonObjects;
        
        NSMutableArray *allBlockList = [[NSMutableArray alloc] init];
        
      //Managed Keywords
        
        NSString *filepathKeywords = [[NSBundle mainBundle] pathForResource:@"filterBlockListKeywords" ofType:@"txt"];
        NSError *errorReadKeywords;
        NSString *fileContentsKeywords = [NSString stringWithContentsOfFile:filepathKeywords encoding:NSUTF8StringEncoding error:&errorReadKeywords];
        
        if (errorReadKeywords)
          NSLog(@"Error reading file: %@", errorReadKeywords.localizedDescription);
          NSLog(@"filePath : %@", filepathKeywords);
          NSLog(@"contents: %@", fileContentsKeywords);
        
        NSArray *arrKeywords = [fileContentsKeywords componentsSeparatedByString:@"\n"];
        
        for (int i=0; i < arrKeywords.count - 1; i++)
        {
          NSString *blockStr = [[@"(" stringByAppendingString:[arrKeywords objectAtIndex:i]] stringByAppendingString: @")"];
          NSMutableDictionary *dicInternal1 = [[NSMutableDictionary alloc] init];
          [dicInternal1 setValue:@"block" forKey:@"type"];
          NSMutableDictionary *dicInternal2 = [[NSMutableDictionary alloc] init];
          [dicInternal2 setValue:blockStr forKey:@"url-filter"];
          NSMutableDictionary *dic = [[NSMutableDictionary alloc] init];
          [dic setValue:dicInternal1 forKey:@"action"];
          [dic setValue:dicInternal2 forKey:@"trigger"];
          [allBlockList addObject:dic];
        }
        
        //Managed domains
        
        NSString *filepathDomains = [[NSBundle mainBundle] pathForResource:@"filterBlockListDomains" ofType:@"txt"];
        NSError *errorReadDomains;
        NSString *fileContentsDomains = [NSString stringWithContentsOfFile:filepathDomains encoding:NSUTF8StringEncoding error:&errorReadDomains];
        
        if (errorReadDomains)
          NSLog(@"Error reading file: %@", errorReadDomains.localizedDescription);
          NSLog(@"filePath : %@", filepathDomains);
          NSLog(@"contents: %@", fileContentsDomains);
        
        NSArray *arrDomains = [fileContentsDomains componentsSeparatedByString:@"\n"];
        
        for (int i=0; i < arrDomains.count - 1; i++)
        {
          NSString *blockStr = [@"*" stringByAppendingString:[arrDomains objectAtIndex:i]];
          NSMutableDictionary *dicInternal1 = [[NSMutableDictionary alloc] init];
          [dicInternal1 setValue:@"block" forKey:@"type"];
          NSMutableDictionary *dicInternal2 = [[NSMutableDictionary alloc] init];
          [dicInternal2 setValue:@".*" forKey:@"url-filter"];
          
          NSArray *arrIfDomain = @[blockStr];
          [dicInternal2 setValue:arrIfDomain forKey:@"if-domain"];
          
          NSMutableDictionary *dic = [[NSMutableDictionary alloc] init];
          [dic setValue:dicInternal1 forKey:@"action"];
          [dic setValue:dicInternal2 forKey:@"trigger"];
          [allBlockList addObject:dic];
        }
        
        [allBlockList addObjectsFromArray:allDataFromReact];
        
        NSError *error;
        NSData *jsonData2 = [NSJSONSerialization dataWithJSONObject:allBlockList options:NSJSONWritingPrettyPrinted error:&error];
        NSString *finalBlocklistJson = [[NSString alloc] initWithData:jsonData2 encoding:NSUTF8StringEncoding];
        NSLog(@"jsonData as string:\n%@", finalBlocklistJson);
        
        NSError* error1;
        [finalBlocklistJson writeToURL:containerURL atomically:YES encoding:NSUTF8StringEncoding error:&error1];
        NSLog(@"%@",error);
        
        [SFContentBlockerManager reloadContentBlockerWithIdentifier:(@"com.ausappstudio.brainbuddy.extension")
                                                  completionHandler:^(NSError * _Nullable error) {
                                                    NSLog(@"Fail to reload");
                                                  }];
        
      }
    }else{
      NSError* error;
      [jsonObj writeToURL:containerURL atomically:YES encoding:NSUTF8StringEncoding error:&error];
      NSLog(@"%@",error);
      [SFContentBlockerManager reloadContentBlockerWithIdentifier:(@"com.ausappstudio.brainbuddy.extension")
                                                completionHandler:^(NSError * _Nullable error) {
                                                  NSLog(@"Fail to reload");
                                                }];
    }
  }@catch(id anException){
    callback(@[[NSNull null], @"NULL"]);
  }
}

RCT_EXPORT_METHOD(checkIsFilterEnable: (RCTResponseSenderBlock)callback )
{
  @try{
    [SFContentBlockerManager getStateOfContentBlockerWithIdentifier:(@"com.ausappstudio.brainbuddy.extension")
                                                  completionHandler:^(SFContentBlockerState * _Nullable state, NSError * _Nullable error) {
                                                    if(error){
                                                      callback(@[[NSNull null], @"NULL"]);
                                                    }else{
                                                      if(state.isEnabled){
                                                        callback(@[[NSNull null], @"YES"]);
                                                      }else{
                                                        callback(@[[NSNull null], @"NULL"]);
                                                      }
                                                    }
                                                  }];
  }@catch(id anException){
    callback(@[[NSNull null], @"NULL"]);
  }
}

@end
