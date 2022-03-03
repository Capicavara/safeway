import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadEmailPage } from './cad-email.page';

describe('CadEmailPage', () => {
  let component: CadEmailPage;
  let fixture: ComponentFixture<CadEmailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadEmailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadEmailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
