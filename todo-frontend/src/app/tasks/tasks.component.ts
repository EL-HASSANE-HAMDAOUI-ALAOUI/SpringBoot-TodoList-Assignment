import { Component, OnInit } from '@angular/core';
import { TodoService } from '../todo.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  tasks: any[] = [];
  newTaskTitle: string = '';
  newTaskStartDate: string = '';
  newTaskEndDate: string = '';
  newTaskDetails: string = '';
  editingTask: any = null;

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.todoService.getTasks().subscribe((data) => {
      this.tasks = data;
    });
  }

  addTask() {
    if (this.newTaskTitle.trim() && this.newTaskStartDate && this.newTaskEndDate && this.newTaskDetails.trim()) {
      const newTask = {
        title: this.newTaskTitle,
        startDate: this.newTaskStartDate,
        endDate: this.newTaskEndDate,
        completed: false,
        status: 'En cours',
        details: this.newTaskDetails
      };
      this.todoService.addTask(newTask).subscribe((task) => {
        this.tasks.push(task);
        this.resetForm();
      });
    }
  }

  deleteTask(id: number) {
    this.todoService.deleteTask(id).subscribe(() => {
      this.tasks = this.tasks.filter((task) => task.id !== id);
    });
  }

  editTask(task: any) {
    this.editingTask = { ...task }; 
    this.newTaskTitle = task.title;
    this.newTaskStartDate = task.startDate;
    this.newTaskEndDate = task.endDate;
    this.newTaskDetails = task.details;
  }

  saveTask() {
    if (this.editingTask) {
      const updatedTask = {
        ...this.editingTask,
        title: this.newTaskTitle,
        startDate: this.newTaskStartDate,
        endDate: this.newTaskEndDate,
        details: this.newTaskDetails
      };
      this.todoService.updateTask(updatedTask.id, updatedTask).subscribe((updatedTaskResponse) => {
        const index = this.tasks.findIndex((t) => t.id === updatedTaskResponse.id);
        if (index !== -1) {
          this.tasks[index] = updatedTaskResponse;
        }
        this.resetForm();
      });
    }
  }

  resetForm() {
    this.newTaskTitle = '';
    this.newTaskStartDate = '';
    this.newTaskEndDate = '';
    this.newTaskDetails = '';
    this.editingTask = null; 
  }

  updateTask(task: any) {
    this.todoService.updateTask(task.id, task).subscribe((updatedTask) => {
      const index = this.tasks.findIndex((t) => t.id === updatedTask.id);
      if (index !== -1) {
        this.tasks[index] = updatedTask;
      }
      this.editingTask = null;
    });
  }

  toggleCompletion(task: any) {
    task.completed = !task.completed;
    task.status = task.completed ? 'Terminée' : 'En cours';
    this.updateTask(task);
  }
}