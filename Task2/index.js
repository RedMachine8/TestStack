import TaskManager from './/classTaskManager.js';

const taskManager = new TaskManager(2); // Устанвливаем максимальное количество одновременно выполняемых задач

taskManager.addTask(async () =>{
        console.log('Выполнение задачи1');
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
        console.error('Ошибка прии выполнении задач:', error);
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