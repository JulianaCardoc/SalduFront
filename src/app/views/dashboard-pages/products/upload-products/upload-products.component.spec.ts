import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadProductsComponent } from './upload-products.component';

describe('UploadProductsComponent', () => {
  let component: UploadProductsComponent;
  let fixture: ComponentFixture<UploadProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
