import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule,
  ExtraOptions,
  Router,
  Scroll,
  PreloadAllModules,
} from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./feature-modules/viewer/viewer.module').then(
        (m) => m.ViewerModule
      ),
  },
  { path: '**', redirectTo: '' },
];

const extraOptions: ExtraOptions = {
  initialNavigation: 'enabled',
  //enableTracing: true,
  preloadingStrategy: PreloadAllModules,
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
  useHash: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, extraOptions)],
  exports: [RouterModule],
})
export class AppRoutingModule {
  constructor(router: Router, viewportScroller: ViewportScroller) {
    router.events
      .pipe(filter((e) => e instanceof Scroll))
      .subscribe((e: Scroll) => {
        if (e.position) {
          // backward navigation
          viewportScroller.scrollToPosition(e.position);
        } else if (e.anchor) {
          // anchor navigation
          viewportScroller.scrollToAnchor(e.anchor);
        } else {
          // forward navigation
          viewportScroller.scrollToPosition([0, 0]);
        }
      });
  }
}
