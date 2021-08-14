<#assign myassignedtasks = workflow.assignedTasks>
<#assign mypooledtasks = workflow.getPooledTasks()>
<#assign tasks_count = myassignedtasks?size + mypooledtasks?size>

{
    "taskscount":${tasks_count?c}
}
