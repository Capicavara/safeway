import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocorroPage } from './socorro.page';

describe('SocorroPage', () => {
  let component: SocorroPage;
  let fixture: ComponentFixture<SocorroPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocorroPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocorroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
