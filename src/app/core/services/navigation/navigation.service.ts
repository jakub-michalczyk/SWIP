import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private footerRoutesSubject = new BehaviorSubject<Route[]>([]);
  footerRoutes$ = this.footerRoutesSubject.asObservable();

  constructor(private router: Router) {
    const allRoutes = this.getAllRoutes(this.router.config);
    const footerRoutes = this.getAllFooterRoutes(allRoutes);
    this.footerRoutesSubject.next(footerRoutes);
  }

  private getAllRoutes(routes: Route[], parentPath: string = ''): Route[] {
    return routes.flatMap((route) => {
      const fullPath = `${parentPath}/${route.path || ''}`.replace(/\/\//g, '/');
      const updatedRoute = { ...route, path: fullPath };
      const children = route.children ? this.getAllRoutes(route.children, fullPath) : [];
      return [updatedRoute, ...children];
    });
  }

  private getAllFooterRoutes(routes: Route[]): Route[] {
    return routes.filter((route) => route.data?.['view'] === 'FOOTER');
  }
}
