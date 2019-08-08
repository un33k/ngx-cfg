import { async, TestBed } from '@angular/core/testing';
import { CfgModule } from './cfg.module';

describe('CfgModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CfgModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(CfgModule).toBeDefined();
  });
});
