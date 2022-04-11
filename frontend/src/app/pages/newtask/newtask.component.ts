import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-newtask',
  templateUrl: './newtask.component.html',
  styleUrls: ['./newtask.component.scss']
})
export class NewtaskComponent implements OnInit {

  listId: string = "";
  constructor(private taskService: TaskService, private router: Router, private route: ActivatedRoute) {
    this.route.params.subscribe((params:Params)=>this.listId = params.listId);
   }

  ngOnInit(): void {
  }
  addTask(value: string){
    this.taskService.createTask(this.listId,value).subscribe(()=>this.router.navigate(['../'],{relativeTo:this.route}));
  }
}
