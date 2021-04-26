import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewerComponent } from './viewer.component';

describe('ViewerComponent', () => {
	let component: ViewerComponent;
	let fixture: ComponentFixture<ViewerComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ViewerComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ViewerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
