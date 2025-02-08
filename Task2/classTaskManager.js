class TaskManager {
     constructor(maxConcurrentTasks = 5) {
         this.tasks = {};
         this.taskQueue = [];
         this.maxConcurrentTasks = maxConcurrentTasks;
         this.Id = 1;
     }

     addTask(task, priority, dependencies, timeout) {
         const taskID = `task${this.Id}`;
         this.tasks[taskID] = {
             task,
             priority,
             dependencies,
             timeout,
             status: 'pending',
         };
         this.taskQueue.push(taskID);
         this.tasks = Object.fromEntries(Object.entries(this.tasks).sort(([,a], [,b]) => a.priority - b.priority));
         this.taskQueue = Object.keys(this.tasks);
         this.Id += 1;
         return taskID;
     }

     async executeTask() {

      //   this.tasks = Object.fromEntries(Object.entries(this.tasks).sort(([,a], [,b]) => a.priority - b.priority));
        // this.taskQueue = Object.keys(this.tasks);

         const runningTasks = this.taskQueue.splice(0, this.maxConcurrentTasks);
         while (runningTasks.length > 0) {
             const taskId = runningTasks.shift();
             const task = this.tasks[taskId];

             if(task.status === 'running') continue;

             try {
                task.status = 'running';
                const result = await task.task();
                task.status = 'completed';
                this.taskQueue = this.taskQueue.splice(this.taskQueue.indexOf(taskId), 1);

                if(task.timeout) {
                    setTimeout(() => {
                        this.tasks[taskId].status = 'timeout';
                        this.taskQueue.splice(this.taskQueue.indexOf(taskId), 1);
                    }, task.timeout);
                }

                if(result) {
                    await this.executeTask();
                }
             }catch(error) {
                task.status = 'failed';
                this.taskQueue.splice(this.taskQueue.indexOf(taskId), 1);

                if(this.taskQueue.length > 0) {
                    await this.executeTask();
                } else {
                    throw error;
                }
             }
         }
     }

     cancelTask(taskId) {
         const task = this.tasks[taskId];
         task.status = 'canceled';
         this.taskQueue.splice(this.taskQueue.indexOf(taskId), 1);

         task.dependencies.forEach(dependentTaskId => {
         const dependentTask = this.tasks[dependentTaskId];
         dependentTask.status = 'canceled';
         this.taskQueue.splice(this.taskQueue.indexOf(dependentTaskId), 1);
         });
     }

     getStatus() {
         return this.tasks;
     }

     changePriority(taskId, newPriority) {
         const task = this.tasks[taskId];
         task.priority = newPriority;
     }
}

const taskManager = new TaskManager(2); // Устанвливаем максимальное количество одновременно выполняемых задач

taskManager.addTask(async () =>{
        console.log('Выполнение задачи 1');
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Задача 1 завершена');
    }, 2, []
);

taskManager.addTask(async () =>{
        console.log('Выполнение задачи 2');
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Задача 2 завершена');
    }, 1, ['task1']
);

taskManager.addTask(async () =>{
    console.log('Выполнение задачи 3');
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Задача 3 завершена');
}, 3, []);

taskManager.addTask(async () =>{
        console.log('Выполнение задачи 4');
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log('Задача 4 завершена');
    }, 1,['task2', 'task3']
);

taskManager.executeTask().then(() => {
    console.log('Все задачи выполнены');
    console.log('Статус задач после выполнения:', taskManager.getStatus());
}).catch(error => {
    console.error('Ошибка при выполнении задач:', error);
});
const intervalId = setInterval(() => {
    const status = taskManager.getStatus();
    console.log('Текущий статус задач:', status);
    if(Object.values(status).every(s => s === 'completed' || s === 'failed' || s === 'canceled')) {
        clearInterval(intervalId);
    }
}, 500);

taskManager.addTask(async () => {
    console.log('Выполнение задачи 5');
    await new Promise((_, reject) => setTimeout(() => reject(new Error('Ошибка в задаче 5')), 1500));
}, 2, []);

taskManager.addTask(async () =>{
    console.log('Выполнение задачи 6');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Задача 6 завершена');
}, 1, []);

taskManager.addTask(async () =>{
    console.log('Выполнение задачи 7');
    await new Promise(resolve => setTimeout(resolve, 2500));
    console.log('Задача 7 завершена');
}, 2, ['task5']);

taskManager.executeTask().then(() => {
    console.log('Все дополнительные задачи выполнены');
    console.log('Статус задач после выполнения дополнительных задач:', taskManager.getStatus());
}).catch(error => {
    console.error('Ошибка при выполнении дополнительных задач:', error);
});