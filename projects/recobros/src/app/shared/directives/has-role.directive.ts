import {
  Directive,
  OnInit,
  OnDestroy,
  ViewContainerRef,
  TemplateRef,
  Input,
} from '@angular/core';
import { RolesService } from '../../core/services/roles.service';
import { Subject } from 'rxjs';
@Directive({
  selector: '[appHasRole]',
})
export class HasRoleDirective implements OnInit, OnDestroy {
  @Input() appHasRole: string;

  stop$ = new Subject();

  isVisible = false;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private rolesService: RolesService
  ) {}

  ngOnInit() {
    //  We subscribe to the roles$ to know the roles the user has
    // this.rolesService.roles$.pipe(takeUntil(this.stop$)).subscribe((roles) => {
    //   // If he doesn't have any roles, we clear the viewContainerRef
    //   if (!roles) {
    //     this.viewContainerRef.clear();
    //   }
    //   // If the user has the role needed to
    //   // render this component we can add it
    //   if (roles.includes(this.appHasRole)) {
    //     // If it is already visible (which can happen if
    //     // his roles changed) we do not need to add it a second time
    //     if (!this.isVisible) {
    //       // We update the `isVisible` property and add the
    //       // templateRef to the view using the
    //       // 'createEmbeddedView' method of the viewContainerRef
    //       this.isVisible = true;
    //       this.viewContainerRef.createEmbeddedView(this.templateRef);
    //     }
    //   } else {
    //     // If the user does not have the role,
    //     // we update the `isVisible` property and clear
    //     // the contents of the viewContainerRef
    //     this.isVisible = false;
    //     this.viewContainerRef.clear();
    //   }
    // });
  }

  // Clear the subscription on destroy
  ngOnDestroy() {
    // this.stop$.next();
  }
}
