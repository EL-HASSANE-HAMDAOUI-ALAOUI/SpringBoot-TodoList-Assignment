import { Component } from '@angular/core';
import { TasksComponent } from './tasks/tasks.component';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  imports: [TasksComponent], 
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {}
