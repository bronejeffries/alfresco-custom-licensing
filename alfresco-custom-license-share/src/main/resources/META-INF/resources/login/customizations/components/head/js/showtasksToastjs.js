$(document).ready(function(){

    var auth = localStorage.getItem("muk_edms_creds")

    setInterval(()=>{

        $.ajax({
                url:"/share/page/proxy/alfresco/projectone/tasks/my/count",
                // headers: {"Authorization":auth},
                success:(result)=>{
                    if(result.taskscount>0){
                        $("#toast_body_holder").html("<a class='text-white' href='"+window.location.origin+"/share/page/my-tasks#filter=workflows|active'>You have "+result.taskscount+" pending task(s)</a>")
                        $('.toast').show()
                    }
                },
                error:(error)=>{
                    // console.log(error);
                }
            })

        },50000)

        if (document.location.href.includes("page/my-tasks")) {
            var filter_tasks_interval = setInterval(() => {
                $('.preloader').show()
                if ($('tr>.yui-dt-col-title>.yui-dt-liner>.type>span').length!=0) {                    
                        // filter out tasks
                        var filter_type_key = (new URL(document.location)).searchParams.get("filtertype")
                        filteroutTasks(filter_type_key)
                        clearInterval(filter_tasks_interval)
                        $('.preloader').hide()
                }else if($('tr>.yui-dt-empty>.yui-dt-liner').length!=0){
                        clearInterval(filter_tasks_interval)
                        $('.preloader').hide()
                }
            }, 500);   
        }
        if (document.location.href.includes("page/start-workflow")) {
            var remove_add_button_interval = setInterval(() => {
                $('.preloader').show()
                var button = document.getElementById("add_columns")
                if (button!=null) {
                    var stored_file_name_check = sessionStorage.getItem("dfr_details_fname")
                    if((stored_file_name_check!=null && stored_file_name_check!="undefined")){
                        button.parentElement.remove()
                    }
                    $('.preloader').hide()
                    clearInterval(remove_add_button_interval)
                }
                
                
            }, 500);   
        }
})

function filteroutTasks(key){
    if (key!=null&&key!="undefined") {
        
        key = key.toLowerCase()
        Array.from($('tr>.yui-dt-col-title>.yui-dt-liner>.type>span')).forEach(tasktype=>{
            tasktype = $(tasktype); 
            var type = $(tasktype).html().toLowerCase(); 
            if(!type.includes(key)){
                tasktype.closest('tr').remove()
            }
        })
    }
}