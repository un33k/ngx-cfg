import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { merge as ldNestedMerge } from 'lodash';
import { of } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';

import { ApplicationCfg, HttpMethod } from './cfg.models';
import { CFG_TOKEN, DefaultApplicationCfg } from './cfg.defaults';
import { DEFAULT_HTTP_TIMEOUT } from './cfg.constants';

@Injectable({
  providedIn: 'root'
})
export class CfgService {
  private appLevelCfg: ApplicationCfg = DefaultApplicationCfg;

  constructor(
    private http: HttpClient,
    @Inject(CFG_TOKEN) private readonly config: ApplicationCfg
  ) {
    this.appLevelCfg = ldNestedMerge(this.appLevelCfg, config);
    if (!this.appLevelCfg.production) {
      console.log(`CfgService ready ...`);
    }
  }

  /**
   * Fetches remote configuration options via get or post
   */
  fetchRemoteCfg(): Promise<any> {
    const remoteCfg = this.appLevelCfg.remoteCfg;
    if (remoteCfg) {
      const url = remoteCfg.endpoint;
      if (url) {
        return new Promise((resolve, reject) => {
          let headers = remoteCfg.headers || {};
          if (!Object.keys(headers).length) {
            headers = new HttpHeaders(headers);
          }
          const httpMethod = remoteCfg.method || HttpMethod.GET;
          let httpRequest = this.http.get(url, { headers });
          if (httpMethod === HttpMethod.POST) {
            const postBody = remoteCfg.body || {};
            httpRequest = this.http.post(url, postBody, { headers });
          }
          const httpTimeout = (remoteCfg.timeout || DEFAULT_HTTP_TIMEOUT) * 1000;
          httpRequest
            .pipe(
              timeout(httpTimeout),
              catchError((err: Response) => {
                console.warn(`CfgService failed. (${err.statusText || 'unknown'})`);
                return of({});
              })
            )
            .toPromise()
            .then(resp => {
              if (Object.keys(resp || {}).length) {
                if (!this.appLevelCfg.production) {
                  console.log(`CfgService remote cfg fetched ...`);
                }
                this.appLevelCfg.remoteData = resp;
              }
              resolve(resp);
            });
        });
      }
    }
    return new Promise((resolve, reject) => resolve({}));
  }

  /**
   * Makes readonly copy of cfg public
   */
  get options() {
    return this.appLevelCfg;
  }
}
