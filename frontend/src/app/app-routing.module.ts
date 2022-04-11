import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewlistComponent } from './pages/newlist/newlist.component';
import { NewtaskComponent } from './pages/newtask/newtask.component';
import { TaskviewComponent } from './pages/taskview/taskview.component';

const routes: Routes = [
  {path:'',redirectTo:'lists', pathMatch: 'full'},
  {path:'lists',component: TaskviewComponent},
  {path:'lists/:listId',component: TaskviewComponent},
  {path:'newlist',component: NewlistComponent},
  {path:'lists/:listId/newtask',component: NewtaskComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
