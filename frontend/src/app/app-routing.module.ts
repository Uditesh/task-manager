import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { NewlistComponent } from './pages/newlist/newlist.component';
import { NewtaskComponent } from './pages/newtask/newtask.component';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { TaskviewComponent } from './pages/taskview/taskview.component';

const routes: Routes = [
  {path:'',redirectTo:'login', pathMatch: 'full'},
  {path:'lists',component: TaskviewComponent},
  {path:'lists/:listId',component: TaskviewComponent},
  {path:'newlist',component: NewlistComponent},
  {path:'login',component: LoginPageComponent},
  {path:'signup',component: SignupPageComponent},
  {path:'lists/:listId/newtask',component: NewtaskComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
