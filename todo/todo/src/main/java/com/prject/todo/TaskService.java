package com.prject.todo;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository repository;

    public TaskService(TaskRepository repository) {
        this.repository = repository;
    }

    public List<Task> getAllTasks() {
        return repository.findAll();
    }

    public Task createTask(Task task) {
        task.setStatus("En cours"); 
        return repository.save(task);
    }

    public void deleteTask(Long id) {
        repository.deleteById(id);
    }

    public Task updateTask(Long id, Task updatedTask) {
        Task existingTask = repository.findById(id).orElseThrow(() -> new RuntimeException("Tâche non trouvée"));

        existingTask.setTitle(updatedTask.getTitle());
        existingTask.setStartDate(updatedTask.getStartDate());
        existingTask.setEndDate(updatedTask.getEndDate());
        existingTask.setDetails(updatedTask.getDetails());

        if (updatedTask.isCompleted()) {
            existingTask.setStatus("Terminée");
        } else if (existingTask.getEndDate().isBefore(LocalDateTime.now()) && !existingTask.isCompleted()) {
            existingTask.setStatus("Non terminée - Expirée");
        } else if (updatedTask.getStatus().equals("Annulée")) {
            existingTask.setStatus("Annulée");
        } else {
            existingTask.setStatus("En cours");
        }

        return repository.save(existingTask);
    }
}
