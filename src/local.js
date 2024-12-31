import { compareAsc, format, add } from "date-fns";
import { createProject } from "./projects";
import { createTodo } from "./todos";
function updateLS(list){
    let string = JSON.stringify(list);
    localStorage.setItem("ProjectList",string);
}

function projectListRetrieval(){
    let retString = localStorage.getItem("ProjectList");
    
    retString  = JSON.parse(retString);
    let properProjectList = projectObjectConvert(retString);
    return properProjectList;
} 

function importantTasks(){
    let projectList = projectListRetrieval();
    let important = [];
    for(let project of projectList){
        for(let projectTask of  project.tasks){
            if(projectTask.priority === true){
                important.push(projectTask);
            }
        }
    }
    return important;
}

function projectObjectConvert(projectList){
    let properProjectList = [];
    for(let project of projectList){
        let properProject = createProject(project.name);
        for(let task of project.tasks){
            let properTask = createTodo(task.title, task.description, task.dueDate, task.priority, task.pIndex ,task.completed);
            properProject.addTasks(properTask);
        }
        properProjectList.push(properProject);
    }
    return properProjectList;
}

function allTasksRetrieval(){
    let projectList = projectListRetrieval();
    let allTasks = []
    for(let project of projectList){
        let index = 0;
        for(let projectTask of project.tasks){
            projectTask.taskIndex = index;
         
            allTasks.push(projectTask);
            index++
        }
    }
    return allTasks;
}

function tasksToday(){
    let allTasks = allTasksRetrieval();
    let todaysTasks =[];
    let date = new Date();
    date = format(date,"yyyy-MM-dd");
    for (let task of allTasks){
        if (task.dueDate === date){
            todaysTasks.push(task);
        }
    }
    return todaysTasks;
}

function tasksNextSeven(){
    let allTasks = allTasksRetrieval();
    let nextSevenDays =[];
   
    for(let task of allTasks){
        for(let i = 1; i < 8 ; i++){
            let date = new Date();
            date = add(date,{
                days: i
            });
            date = format(date,"yyyy-MM-dd");
            if(task.dueDate === date){
                nextSevenDays.push(task);
            }
        }
    }
    return nextSevenDays;
}

export { updateLS, projectListRetrieval, allTasksRetrieval,tasksToday, tasksNextSeven,importantTasks};