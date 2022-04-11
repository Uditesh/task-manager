import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskviewComponent } from './pages/taskview/taskview.component';
import { NewlistComponent } from './pages/newlist/newlist.component';
import { NewtaskComponent } from './pages/newtask/newtask.component';

@NgModule({
  declarations: [
    AppComponent,
    TaskviewComponent,
    NewlistComponent,
    NewtaskComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
