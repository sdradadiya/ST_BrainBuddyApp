//
//  ContentBlockerRequestHandler.m
//  ContentBlockerExtension
//
//  Created on 29/03/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "ContentBlockerRequestHandler.h"

@interface ContentBlockerRequestHandler ()

@end

@implementation ContentBlockerRequestHandler

- (void)beginRequestWithExtensionContext:(NSExtensionContext *)context {
//    NSItemProvider *attachment = [[NSItemProvider alloc] initWithContentsOfURL:[[NSBundle mainBundle] URLForResource:@"blockerList" withExtension:@"json"]];
//    NSExtensionItem *item = [[NSExtensionItem alloc] init];
//    item.attachments = @[attachment];
//    [context completeRequestReturningItems:@[item] completionHandler:nil];
  
  @try{
    NSString *groupName = @"group.com.ausappstudio.brainbuddy";
    NSURL *containerURL = [[NSFileManager defaultManager] containerURLForSecurityApplicationGroupIdentifier:groupName];
    containerURL = [containerURL URLByAppendingPathComponent:[NSString stringWithFormat:@"blockerList.json"]];
    NSItemProvider *attachment = [[NSItemProvider alloc] initWithContentsOfURL:containerURL];
    NSExtensionItem *item = [[NSExtensionItem alloc] init];
    item.attachments = @[attachment];
    [context completeRequestReturningItems:@[item] completionHandler:nil];
  }@catch(id anException){
    [context completeRequestReturningItems:@[] completionHandler:nil];
  }

}

@end
