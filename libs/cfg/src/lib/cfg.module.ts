import { NgModule, Optional, SkipSelf, ModuleWithProviders, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { ApplicationCfg } from './cfg.models';
import { CFG_TOKEN } from './cfg.defaults';
import { CfgService } from './cfg.service';

/**
 * Remote Config Fetch Fectory
 * @param cfgService CfgService Injectable
 * Note: `// @dynamic` above ngModule is required for building aot
 */
export function remoteCfgFactory(cfgService: CfgService): () => Promise<any> {
  return () => cfgService.fetchRemoteCfg();
}

// @dynamic
@NgModule({
  imports: [CommonModule, HttpClientModule]
})
export class CfgModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CfgModule
  ) {
    if (parentModule) {
      throw new Error('CfgModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(options?: ApplicationCfg): ModuleWithProviders {
    return {
      ngModule: CfgModule,
      providers: [
        CfgService,
        { provide: CFG_TOKEN, useValue: options },
        {
          provide: APP_INITIALIZER,
          useFactory: remoteCfgFactory,
          deps: [CfgService],
          multi: true
        }
      ]
    };
  }
}
