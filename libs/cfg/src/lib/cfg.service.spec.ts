import { TestBed, inject, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DEFAULT_HTTP_TIMEOUT } from './cfg.constants';
import { ApplicationCfg, HttpMethod } from './cfg.models';
import { CFG_TOKEN } from './cfg.defaults';
import { CfgModule } from './cfg.module';
import { CfgService } from './cfg.service';

const AppEnv: ApplicationCfg = {
  version: '1.0.1',
  production: true,
  remoteCfg: {
    endpoint: 'http://example.com/remote/cfg'
  }
};

const mockRemoteData = {
  country: 'US',
  state: 'California',
  splash: 'https://foo.com/election.gif'
};

// disable console log/warn during test
jest.spyOn(console, 'log').mockImplementation(() => undefined);
jest.spyOn(console, 'warn').mockImplementation(() => undefined);

describe('CfgService local config', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CfgModule.forRoot(AppEnv)],
      providers: [{ provide: CFG_TOKEN, useValue: AppEnv }, CfgService]
    });
  });

  it('should be created', inject([CfgService], (service: CfgService) => {
    expect(service).toBeDefined();
  }));

  it('should have the version options', inject([CfgService], (service: CfgService) => {
    expect(service.options.version).toBe('1.0.1');
  }));

  it('should have merged the default config options', inject(
    [CfgService],
    (service: CfgService) => {
      expect(service.options.localCfg.loginPageUrl).toBe('/auth/login');
    }
  ));

  it('should have merged the default options with the remote options', inject(
    [CfgService],
    (service: CfgService) => {
      expect(service.options.remoteCfg.timeout).toEqual(DEFAULT_HTTP_TIMEOUT);
    }
  ));
});

describe('CfgService remote cfg - empty remoteCfg', () => {
  let injector: TestBed;
  let service: CfgService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: CFG_TOKEN,
          useValue: {
            ...AppEnv,
            remoteCfg: null
          }
        },
        CfgService
      ]
    });

    injector = getTestBed();
    service = injector.get(CfgService);
  });

  afterEach(() => {
    service.options.remoteData = null;
  });

  it('should remote config fetch to handle empty remoteCfg', () => {
    expect(service.options.remoteCfg).toEqual(null);

    service.fetchRemoteCfg().then(() => {
      expect(service.options.remoteData).toEqual({});
    });
  });
});

describe('CfgService remote config via GET', () => {
  let injector: TestBed;
  let service: CfgService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: CFG_TOKEN, useValue: AppEnv }, CfgService]
    });

    injector = getTestBed();
    service = injector.get(CfgService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    service.options.remoteData = null;
    httpMock.verify();
  });

  it('should get remote config via GET', () => {
    service.fetchRemoteCfg().then(() => {
      expect(service.options.remoteData).toEqual(mockRemoteData);
    });

    const mockReq = httpMock.expectOne(service.options.remoteCfg.endpoint);
    expect(mockReq.cancelled).toBeFalsy();
    expect(mockReq.request.method).toEqual('GET');
    expect(mockReq.request.responseType).toEqual('json');
    mockReq.flush(mockRemoteData);
  });

  it('should get remote config handle Error', () => {
    service.fetchRemoteCfg().then(() => {
      expect(service.options.remoteData).toEqual(null);
    });

    const mockReq = httpMock.expectOne(service.options.remoteCfg.endpoint);
    expect(mockReq.cancelled).toBeFalsy();
    expect(mockReq.request.responseType).toEqual('json');
    mockReq.flush(null, { status: 400, statusText: 'Bad Request' });
  });
});

describe('CfgService remote config via POST', () => {
  let injector: TestBed;
  let service: CfgService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: CFG_TOKEN,
          useValue: {
            ...AppEnv,
            remoteCfg: { ...AppEnv.remoteCfg, method: HttpMethod.POST }
          }
        },
        CfgService
      ]
    });

    injector = getTestBed();
    service = injector.get(CfgService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    service.options.remoteData = null;
    httpMock.verify();
  });

  it('should get remote config via POST', () => {
    expect(service.options.remoteCfg.method).toBe(HttpMethod.POST);

    service.fetchRemoteCfg().then(() => {
      expect(service.options.remoteData).toEqual(mockRemoteData);
    });

    const mockReq = httpMock.expectOne(service.options.remoteCfg.endpoint);
    expect(mockReq.cancelled).toBeFalsy();
    expect(mockReq.request.method).toEqual('POST');
    expect(mockReq.request.responseType).toEqual('json');
    mockReq.flush(mockRemoteData);
  });
});

describe('CfgService remote config in dev mode w/o headers', () => {
  let injector: TestBed;
  let service: CfgService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: CFG_TOKEN,
          useValue: {
            ...AppEnv,
            production: false,
            remoteCfg: { ...AppEnv.remoteCfg, method: HttpMethod.GET, headers: {} }
          }
        },
        CfgService
      ]
    });

    injector = getTestBed();
    service = injector.get(CfgService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    service.options.remoteData = null;
    httpMock.verify();
  });

  it('should get remote config in dev mode w/o headers', () => {
    expect(service.options.remoteCfg.method).toBe(HttpMethod.GET);

    service.fetchRemoteCfg().then(() => {
      expect(service.options.remoteData).toEqual(mockRemoteData);
    });

    const mockReq = httpMock.expectOne(service.options.remoteCfg.endpoint);
    expect(mockReq.cancelled).toBeFalsy();
    expect(mockReq.request.method).toEqual('GET');
    expect(mockReq.request.responseType).toEqual('json');
    mockReq.flush(mockRemoteData);
  });
});
