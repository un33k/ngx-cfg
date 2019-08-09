/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at http://neekware.com/license/MIT.html
 */

/**
 * Http Methods - GET / POST Supported
 */
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST'
}

export class EnvironmentCfg {
  // true for production build
  production: boolean;
  // application release version
  version?: string;
  // application name
  appName?: string;
  // extra attributes
  [id: string]: any;
}

export class LocalCfg {
  // if target supports multi-tab apps (browsers)
  multiTab?: boolean;
  // url to login page for user authentication (for anonymous users only)
  loginPageUrl?: string;
  // url to sign-up page for user to register (for anonymous users only)
  registerPageUrl?: string;
  // url to landing page for authenticated users only
  loggedInLandingPageUrl?: string;
  // url to the page where users are redirected to after log-out
  loggedOutRedirectUrl?: string;
  // extra attributes
  [id: string]: any;
}

export class RemoteCfg {
  // url to fetch config file from
  endpoint: string;
  // http headers to be sent with request
  headers?: { [id: string]: any };
  // post body to be sent with request
  body?: { [id: string]: any };
  // http method (get, post) (if post, body will be ignored)
  method?: HttpMethod;
  // maximum time in seconds to wait for remote config response
  timeout?: number;
  // extra attributes
  [id: string]: any;
}

export class ApplicationCfg extends EnvironmentCfg {
  // cfg config
  localCfg?: LocalCfg;
  // remote config (json object)
  remoteCfg?: RemoteCfg;
  // received data from remote
  remoteData?: { [id: string]: any };
  // extra modules (ext.auth, ext.log)
  [id: string]: any;
}
