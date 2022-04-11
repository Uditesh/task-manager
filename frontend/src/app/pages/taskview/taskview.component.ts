import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import List from 'src/app/models/list';
import Task from 'src/app/models/task';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-taskview',
  templateUrl: './taskview.component.html',
  styleUrls: ['./taskview.component.scss']
})
export class TaskviewComponent implements OnInit {

  lists: List[] = [];
  tasks: Task[] = [];
  listId: string = "";
  constructor(
    private taskService: TaskService, 
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void{
    this.taskService.getLists().subscribe((lists: List[]) => this.lists = lists);
    console.log(this.lists);
    
    
    this.route.params.subscribe((params: Params) => {
      this.listId = params.listId;
      if(!this.listId){
        return;
      } 
      console.log(this.listId);
      this.taskService.getTasks(this.listId).subscribe((tasks: Task[]) => {this.tasks = tasks});  
      
    });
    console.log(this.tasks);
  }

  onTaskClick(task: Task){
    this.taskService.setCompleted(this.listId,task).subscribe(()=> task.completed = !task.completed);
  }

  deleteTask(task: Task){
    this.taskService.deleteTask(this.listId,task._id).subscribe((task: any ) => this.tasks = this.tasks.filter(t=>t._id != task._id));
  }

  deleteList(list: List){
    this.taskService.deleteList(list._id).subscribe(() => this.lists =  this.lists.filter(l=>l._id != list._id));
  }

  addTaskClick(){
    if(!this.listId){
      alert("Please select a list!");
      return;
    }
    this.router.navigate(['./newtask'],{relativeTo:this.route});
  }
}
