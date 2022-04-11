import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import List from 'src/app/models/list';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-newlist',
  templateUrl: './newlist.component.html',
  styleUrls: ['./newlist.component.scss']
})
export class NewlistComponent implements OnInit {

  constructor(private taskService: TaskService, private router: Router) { }

  ngOnInit(): void {
    }
  addList(value: string){
    this.taskService.createList(value)
    .subscribe((list: any) => this.router.navigate(['/lists',list._id]));
    }
  }
