import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CoreModule } from "./core/core.module";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { JwtInterceptor } from "./core/interceptors/jwt.interceptor";
import { ErrorInterceptor } from "./core/interceptors/error.interceptor";
import { UsersModule } from "./features/users/users.module";

@NgModule({
  declarations: [AppComponent],
  imports: [AppRoutingModule, HttpClientModule, CoreModule, UsersModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
