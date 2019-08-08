import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CfgModule, ApplicationCfg } from '@un33k/ngx-cfg';

describe('AppComponent', () => {
  const environment: ApplicationCfg = {
    production: false,
    version: '1.0.1',
    appName: '@un33k/ngx-cfg'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CfgModule.forRoot(environment)],
      declarations: [AppComponent]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title '@un33k/ngx-cfg'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('@un33k/ngx-cfg');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to @un33k/ngx-cfg!');
  });

  it('should have correct options', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.cfgService.options.version).toEqual('1.0.1');
  }));
});
