import { createTodo } from "./todos";
import { createProject } from "./projects";
import { updateLS, projectListRetrieval, allTasksRetrieval,tasksToday,tasksNextSeven,importantTasks} from "./local";
const add = document.getElementById("add");
const form = document.getElementById("project_form");
const projectAdd = document.getElementById("project_add");
const projectCancel = document.getElementById("project_cancel");
const projectName = document.getElementById("project_insert");
const projectTasks = document.getElementById("tasks");
const taskTitle = document.getElementById("title_insert");
const taskDescription = document.getElementById("description_insert");
const taskDate = document.getElementById("date_insert");
const taskForm = document.getElementById("task_form");
const task_add = document.getElementById("task_insert");
const taskPriority = document.getElementById("priority")
const modalContent = document.getElementById("modalContent");
const myModal = document.getElementById("myModal")
const taskNav = document.getElementById("info");
const all = document.getElementById("all");
const name = document.getElementById("projectName");
let allProjects = [];
let index = 0;

function pageLoad(){
    allProjects = projectListRetrieval();
    projectButtons();
    projectList();
    name.innerText = "All Tasks";
    taskNavButtons();
    allTasks(allTasksRetrieval(),1);
}

function taskNavRefresh(choice){
    switch(choice){
    case 1:
        allTasks(allTasksRetrieval(),1);
        taskNavButtons();
    break;
    case 2:
        allTasks(tasksToday(),2);
        taskNavButtons();
    break;
    case 3:
        allTasks(tasksNextSeven(),3);
        taskNavButtons();
    break;
    case 4:
        allTasks(importantTasks(),4);
        taskNavButtons();
    break;
    }
}

function taskNavButtons(){
    let tasks = allTasksRetrieval();
    let todayTasks = tasksToday();
    let nextTasks = tasksNextSeven();
    let important = importantTasks();
    taskNav.innerHTML = "";
    let all = document.createElement("div");
    let today = document.createElement("div");
    let nextSeven = document.createElement("div");
    let impTasks = document.createElement("div");
    all.setAttribute("id", "all")
    all.innerText = "All"
    today.setAttribute("id","today");
    today.innerText = "Today"
    nextSeven.setAttribute("id","sevenDays");
    nextSeven.innerText = "Next 7 days"
    impTasks.setAttribute("id","importantTasks");
    impTasks.innerText = "Important Tasks!";

    all.addEventListener("click", ()=>{
        clear();
        name.innerText = "All Tasks";
        taskNavButtons();
        allTasks(tasks,1);
    });

    today.addEventListener("click", ()=>{
        clear();
        name.innerText = "Today";
        allTasks(todayTasks,2);
        taskNavButtons();
        
    });
    nextSeven.addEventListener("click", ()=>{
        clear();
        name.innerText = "Next 7 days";
        allTasks(nextTasks,3);
        taskNavButtons();
        
    });
    impTasks.addEventListener("click", ()=>{
        clear();
        name.innerText ="Important Tasks"
        allTasks(important,4);
        taskNavButtons();
        
    })
    taskNav.appendChild(all);
    taskNav.appendChild(today);
    taskNav.appendChild(nextSeven);
    taskNav.appendChild(impTasks);
    
}

function allTasks(tasks, refresh){
    projectTasks.innerHTML ="";
    const currentList = document.createElement("ul");
    
    for(let i = 0; i < tasks.length; i++){
        let currentTask = document.createElement("li")
        currentTask.setAttribute("taskId", `${i}`);
        currentTask.innerText = tasks[i].title;
       

        const editInfo = document.createElement("button");
        const taskInfo = document.createElement("button");
        const completedTask = document.createElement("input");
        completedTask.setAttribute("id","completion")
        completedTask.checked = tasks[i].completed;
        const completeTag = document.createElement("label");
        completeTag.setAttribute("for", "completion");
        completeTag.innerText = "Completed";
        
        completedTask.type = "checkbox";
        taskInfo.innerText ="Info";
        editInfo.innerText = "Edit";
        completedTask.innerText = "completed";

        taskInfo.addEventListener("click",function(){
            modalContent.innerHTML = "";
            
            modalEdit(tasks[i],tasks[i].pIndex,i,false,refresh);
            const myModal = document.getElementById("myModal")
            myModal.style.display = "flex";
        
            window.onclick = function(event) {
                if (event.target == myModal) {
              myModal.style.display = "none";
                }
            }
            updateLS(allProjects);
        })

        editInfo.addEventListener("click",function(){
            modalContent.innerHTML = "";
           
            modalEdit(tasks[i],tasks[i].pIndex,i,true,refresh);
            myModal.style.display = "flex";
            window.onclick = function(event) {
                if (event.target == myModal) {
                myModal.style.display = "none";
                }
            }
            
            // taskList(parseInt(tasks[i].pIndex));
            updateLS(allProjects);
        })

        completedTask.addEventListener("click", function(){
            allProjects[tasks[i].pIndex].tasks[tasks[i].taskIndex].completed = completedTask.checked;
            updateLS(allProjects);
            taskNavRefresh(refresh);
        })
    currentTask.appendChild(taskInfo)
    currentTask.appendChild(editInfo)
    currentTask.appendChild(completedTask)    
    currentTask.appendChild(completeTag);   
    currentList.appendChild(currentTask);
    }
    projectTasks.appendChild(currentList);
    // event.preventDefault();
}

function projectButtons(){
    add.addEventListener("click", ()=>{
        document.getElementById("project_form").hidden = false;
    })
    projectAdd.addEventListener("click", ()=>{
        const project = createProject(projectName.value);
        allProjects.push(project);
        projectList();
        updateLS(allProjects);
        document.getElementById("project_form").hidden = true;
        projectName.value = "";
        taskNavButtons();
        event.preventDefault()
    })
    projectCancel.addEventListener("click",()=>{
        document.getElementById("project_form").hidden = true;
        projectName.value = "";
        event.preventDefault()
    })
}

function taskAdding(i){ 
    const task = createTodo(taskTitle.value,taskDescription.value,taskDate.value,taskPriority.checked,i);
    task_add.innerHTML ="";
    taskForm.hidden = true;
    allProjects[i].addTasks(task);
    updateLS(allProjects);
    taskNavButtons();
    event.preventDefault();
}

function taskList(i,taskNav){
    let value;
    
    if(typeof i  !== 'object'){
        value = i;
    }
    else{
        value = this.className
    }

    projectTasks.innerHTML ="";
    const currentList = document.createElement("ul");
    const project = allProjects[value];
    const taskAddButton = document.getElementById("taskAdd")
    name.innerText = project.name;

    for(let x = 0; x < project.tasks.length; x++){
        const task = project.tasks[x];
        const currentTask = document.createElement("li")
        currentTask.setAttribute("taskId", `${x}`);
        currentTask.innerText = project.tasks[x].title;
        taskEditInfoRemove(currentTask,task,x,value)
       
        currentList.appendChild(currentTask);
    }

    taskAddButton.innerHTML="";
    taskAddButton.appendChild(taskAddCreation(value));
    projectTasks.appendChild(currentList);
    updateLS(allProjects);
    taskNavButtons();
    // event.preventDefault();
}

function taskEditInfoRemove(taskDom,tasks,tasksIndex,projectIndex){
    
    const editInfo = document.createElement("button");
        editInfo.innerText = "Edit";
    const taskInfo = document.createElement("button");
        taskInfo.innerText ="Info";
    const deleteTask = document.createElement("button");
        deleteTask.innerText = "Remove";
    const completedTask = document.createElement("input");
        completedTask.type = "checkbox";
        completedTask.setAttribute("id","completion")
        completedTask.checked = tasks.completed;
    const completeTag = document.createElement("label");
        completeTag.setAttribute("for", "completion");
        completeTag.innerText = "Completed";
    
    taskInfo.addEventListener("click",function(){
        modalContent.innerHTML = "";
        modalEdit(tasks,projectIndex,tasksIndex,false);
        const myModal = document.getElementById("myModal")
        myModal.style.display = "flex";
        
        window.onclick = function(event) {
            if (event.target == myModal) {
              myModal.style.display = "none";
            }
        }
        taskList(projectIndex);
        updateLS(allProjects); 
    })

    editInfo.addEventListener("click",function(){
        modalContent.innerHTML = "";
        modalEdit(tasks,projectIndex,tasksIndex,true);
        myModal.style.display = "flex";
       
        window.onclick = function(event) {
            if (event.target == myModal) {
              myModal.style.display = "none";
            }
          }
        taskList(projectIndex);
        updateLS(allProjects);   
    })

    completedTask.addEventListener("click", function(){
        allProjects[tasks.pIndex].tasks[tasksIndex].completed = completedTask.checked;
        updateLS(allProjects);
        taskNavButtons();
    })

    deleteTask.addEventListener("click", function(){
       
        allProjects[projectIndex].tasks.splice(tasksIndex,1);
        updateLS(allProjects);
        taskList(projectIndex);
    })

    taskDom.appendChild(taskInfo);
    taskDom.appendChild(editInfo);
    taskDom.appendChild(completedTask);
    taskDom.appendChild(completeTag);
    taskDom.appendChild(deleteTask);
}

function modalEdit(task,projectIndex,taskIndex,edit,refresh){
    
    const modalHeader = document.createElement("div");
    const modalForm = formCreate(task,projectIndex,taskIndex,edit,refresh);
    const modalFooter = document.createElement("div");
    const title = task.title
    const header = document.createElement("h2");
    header.innerText = title;
    modalHeader.appendChild(header);
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalForm);
}

function formCreate(tasks,projectIndex, taskIndex, edit, refresh){
    
   const modalForm = document.createElement("form");
   const formTask = allProjects[projectIndex].tasks[taskIndex];
   modalForm.setAttribute("id", "modalForm");
   const titleLabel = document.createElement("label");
   titleLabel.innerText = "Title";
   const titleInput = document.createElement("input");
   titleInput.type = "text";
   titleInput.value = tasks.title;
   const descriptionLabel = document.createElement("label");
   descriptionLabel.innerText = "Description";
   const descriptionInput = document.createElement("input");
   descriptionInput.type = "text";
   descriptionInput.value = tasks.description;
   const dateLabel = document.createElement("label");
   dateLabel.innerText = "Date"
   const dateInput = document.createElement("input");
   dateInput.type = "date";
   dateInput.value = tasks.dueDate;
   const priorityLabel = document.createElement("label");
   priorityLabel.innerText = "High Priority";
   const priorityInput = document.createElement("input");
   priorityInput.type ="checkbox";
   if(tasks.priority === true){
    priorityInput.value = true;
    priorityInput.checked = true;
   }
   else{
    priorityInput.value = false;
    priorityInput.checked = false;
   }
   modalForm.appendChild(titleLabel);
   modalForm.appendChild(titleInput);
   modalForm.appendChild(descriptionLabel);
   modalForm.appendChild(descriptionInput);
   modalForm.appendChild(dateLabel);
   modalForm.appendChild(dateInput);
   const checkDiv = document.createElement("div");
   checkDiv.appendChild(priorityInput);
   checkDiv.appendChild(priorityLabel);
   modalForm.appendChild(checkDiv);
   
   if(edit === true){
    const submit = document.createElement("button");
    submit.innerText = "Submit";
    submit.addEventListener("click", function(){
        formTask.title = titleInput.value;
        formTask.description = descriptionInput.value;
        formTask.dueDate = dateInput.value;
        

        if(priorityInput.checked === true){
            formTask.priority = true;
        }
        else{
            formTask.priority = false;
        }

        allProjects[projectIndex].tasks[taskIndex].title = formTask.title;
        allProjects[projectIndex].tasks[taskIndex].description = formTask.title;
        allProjects[projectIndex].tasks[taskIndex].dueDate = formTask.dueDate;
        allProjects[projectIndex].tasks[taskIndex].priority = formTask.priority;
        
        updateLS(allProjects);
        myModal.style.display = "none";
        modalContent.innerHTML = "";
        
        if(refresh != 0){
            taskNavRefresh(refresh);
        }
        event.preventDefault();
    })

    modalForm.appendChild(submit);
   }
   return modalForm;
}

function taskAddCreation(index){
    const addTask = document.createElement("button");
    const taskAddButton = document.createElement("button")
    taskAddButton.innerText = "Add";
    taskAddButton.setAttribute("id", index);

    taskAddButton.addEventListener("click",function(){  
        taskAdding(this.id);
        taskList(index);
    });
    addTask.setAttribute("id", "taskAdd")
    addTask.innerText = "Add Task"
    addTask.addEventListener("click",()=>{ 
        task_add.appendChild(taskAddButton);     
        taskForm.hidden = false;
        projectList();
    });
    return addTask;
}

function projectButtonCreation(index){
    const removeProject = document.createElement("button");
    const projectStuff = document.createElement("div");
    const projectName = document.createElement("button")
    const projectOption = document.createElement("span");
    removeProject.setAttribute("id", "projectRemoval")
    removeProject.innerText = "Remove Project"

    removeProject.addEventListener("click", ()=>{
        allProjects.splice(index,1);
        projectList();
        updateLS(allProjects);
        taskNavButtons();
        projectTasks.innerHTML = "";
        clear();
        event.preventDefault();
    });
    taskAddCreation(index);
    projectOption.appendChild(removeProject);
    projectName.className = index;
    projectName.innerText = allProjects[index].name;
    projectName.setAttribute("id","projectSideNames");
    projectName.addEventListener("click", taskList);
    projectStuff.className ="project";
    projectStuff.setAttribute("data_project", `${index}`);
    projectStuff.appendChild(projectName);
    projectStuff.appendChild(projectOption);
    return projectStuff;
}

function projectList(){
    const list = document.getElementById("projects");
    const projectOption = document.createElement("span");
    list.innerHTML = "";
    for(let i = 0; i < allProjects.length; i++){
        list.appendChild(projectButtonCreation(i));
    }
}

function clear(){
    const name = document.getElementById("projectName");
    const tab = document.getElementById("taskAdd");
    const innerTasks = document.getElementById("tasks");
    tab.innerHTML = "";
    innerTasks.innerHTML = "";
    name.innerText ="";
}
export {pageLoad};