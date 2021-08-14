// try {
    
    // var PORTAL_BASE = window.location.protocol+"//"+window.location.hostname+":9090/jobportal/"
    var PORTAL_BASE = window.location.protocol+"//"+window.location.hostname+"/jobportal/"
    var ASSETS_BASE = PORTAL_BASE+"assets/"
    var auth = localStorage.getItem("muk_edms_creds")
    var application_id =""
    var application_viewed =""
    var applicant_id = ""
    const HUMAN_RESOURCE_FILE_SITE_NAME = "human-resource-files"
    
    const runFrame = (e)=>{

        e.preventDefault(); 
        var button = $(e.target) // Button that triggered the modal
        var src = button.data('src') // Extract info from data-* attributes
        var document_name = button.data('document')
        $('#document_name').html(document_name)
        $('#document_iframe').attr('src',src)

    }
    
    const shortlist = (e,el)=>{

    e.preventDefault()
    if(confirm("Confirm to proceed with action")){

            var application_id = $(el).data('app_id')
            var shortlist_url = PORTAL_BASE+"jobs/applications/"+application_id+"/shortlist"
            $(".preloader").show()
            $.ajax({url: shortlist_url,
                    success: function(result){
                            $(el).html('Application Shortlisted')
                            $(el.parent).attr('disabled',true)
                            $("#reject_btn").hide()
                            sessionStorage.removeItem(application_id)
                            sendMail(`Mr./Mrs. ${application_viewed.fullName} \n This is to inform you that your application for the vacancy of ${application_viewed.role} has of now been shortlisted. \n A more detailed e-mail will be sent shortly. \nTHIS EMAIL IS SYSTEM GENERATED PLEASE DONT REPLY.`,"Makerere Job Application Progress");
                        },
                    error:function(error){
                            console.log(error)
                            $(".preloader").hide()
                            alert("something went wrong when performing this action")
                        }
            });
    
    }

    }

    const reject_application = (e,el)=>{

    e.preventDefault()
    if(confirm("Confirm to proceed with action")){

            var application_id = $(el).data('app_id')
            var shortlist_url = PORTAL_BASE+"jobs/applications/"+application_id+"/reject"
            $(".preloader").show()
            $.ajax({url: shortlist_url,
                    success: function(result){
                            $(el).html('Application Rejected')
                            $("#shortlist_btn").hide()
                            $(el.parent).attr('disabled',true)
                            sessionStorage.removeItem(application_id)
                            sendMail(`Mr./Mrs. ${application_viewed.fullName} \n This is to inform you that your application for the vacancy of ${application_viewed.role} has of now been rejected. \nTHIS EMAIL IS SYSTEM GENERATED PLEASE DONT REPLY.`,"Makerere Job Application Progress");
                        },
                    error:function(error){
                            console.log(error)
                            $(".preloader").hide()
                            alert("something went wrong when performing this action")
                        }
            });
    
    }

    }

    const confirm_application = (e,el)=>{

        e.preventDefault()
        if(confirm("Confirm to proceed with action")){

                var application_id = $(el).data('app_id')
                var shortlist_url = PORTAL_BASE+"jobs/applications/"+application_id+"/confirm"
                $(".preloader").show()

                var data = new FormData()
                data.append("report", $("#appraisal_report").prop('files')[0])
                
                $.ajax({url: shortlist_url,
                        type:'POST',
                        data: data,
                        enctype:'multipart/form-data',
                        contentType: false,
                        processData: false,
                        cache: false,
                        success: function(result){
                                $(el).html('Applicant Confirmed')
                                $(el.parent).attr('disabled',true)
                                $("#deny_btn").hide()
                                $("#confirm_btn").hide()
                                var inner_html = "<div class='p-1'><button id='create_hr_file_btn' data-toggle='modal' data-target='#exampleModal' class='application_id mt-1 mr-1 ml-1 btn btn-sm btn-success'>Create Personel Folder</button></div>"
                                $("#actions_holder").append(inner_html)
                                $("#close_submit_modal").click()
                                sessionStorage.removeItem(application_id)
                                sendMail(`Mr./Mrs. ${application_viewed.fullName} \n This is to inform you that your application for the vacancy of ${application_viewed.role} has of now been confirmed. \n A more detailed e-mail will be sent shortly. \nTHIS EMAIL IS SYSTEM GENERATED PLEASE DONT REPLY.`,"Makerere Job Application Progress");
                            },
                        error:function(error){
                                console.log(error)
                                $(".preloader").hide()
                                alert("something went wrong when performing this action")
                            }
                });
        
        }

    }

    const revoked_application = (e,el)=>{

        e.preventDefault()
        if(confirm("Confirm to proceed with action")){

                var application_id = $(el).data('app_id')
                var shortlist_url = PORTAL_BASE+"jobs/applications/"+application_id+"/revoke"
                $(".preloader").show()
                $.ajax({url: shortlist_url,
                        success: function(result){
                                $(el).html('Applicantion Revoked')
                                $("#confirm_btn").hide()
                                $(el.parent).attr('disabled',true)
                                sessionStorage.removeItem(application_id)
                                sendMail(`Mr./Mrs. ${application_viewed.fullName} \n This is to inform you that your application for the vacancy of ${application_viewed.role} has of now been revoked. \n A more detailed e-mail will be sent shortly. \nTHIS EMAIL IS SYSTEM GENERATED PLEASE DONT REPLY.`,"Makerere Job Application Progress");
                            },
                        error:function(error){
                                console.log(error)
                                $(".preloader").hide()
                                alert("something went wrong when performing this action")
                            }
                });
        
        }

    }

    $(document).ready(function() {
    
        application_id = (new URL(document.location)).searchParams.get("a")
        application_viewed = JSON.parse(sessionStorage.getItem(application_id))
        
        if (application_viewed==null) {
            var fetch_url = PORTAL_BASE+"applications/get/"+application_id
            $(".preloader").show()
            $.ajax({url: fetch_url,
                    success: function(result){
                            application_viewed = result.job_application
                            sessionStorage.setItem(application_id,JSON.stringify(application_viewed))
                            popuplate_page(application_viewed,application_id)
                            $(".preloader").hide()
                        },
                    error:function(error){
                            console.log(error)
                            $(".preloader").hide()
                            alert("something went wrong when performing this action")
                            history.back()
                        }
            });
        }else{

            popuplate_page(application_viewed,application_id)

        }

        $('#create_personel_file').on('submit',(e)=>{
            e.preventDefault()
            var folder_data = {
                "name": $('#fullname_input').val(),
                "title": $('#fullname_input').val(),
                "description": $('#folder_description_input').val(),
                "type": "sc:pfolder"
            }
            create_hr_file(JSON.stringify(folder_data))
        })

    });

    const popuplate_page=(application_viewed,application_id)=>{
        $('.preloader').show()
        if(application_viewed!=null){
            applicant_id = application_viewed.applicant.id
            var actions_holder = $("#actions_holder")
            if(actions_holder.length!=0){
                
                var inner_html = ""

                if(application_viewed.status=="pending"){
                    if (actions_holder.data('allow')==true) {
                        inner_html +="<div class='p-1 '><button id='shortlist_btn' class='btn btn-sm btn-success' disabled><a class='application_id text-white'>Shortlist Applicant</a></button></div>"
                        inner_html += "<div class='p-1 '><button id='reject_btn' class='btn btn-sm btn-danger' disabled><a class='application_id text-white'>Reject Application</a></button></div>"                            
                    }else{
                        inner_html +="<div class='p-1 '><button id='shortlist_btn' class='btn btn-sm btn-success'><a class='application_id text-white' onclick='shortlist(event,this)'>Shortlist Applicant</a></button></div>"
                        inner_html += "<div class='p-1 '><button id='reject_btn' class='btn btn-sm btn-danger'><a class='application_id text-white' onclick='reject_application(event,this)'>Reject Application</a></button></div>"                            
                    }
                }

                if(application_viewed.status=="shortlisted"){

                    if(actions_holder.data('allow')==true){
                            inner_html +="<div class='p-1 '><button id='confirm_btn' class='btn btn-sm btn-success'><a class='application_id text-white' data-toggle='modal' data-target='#attachappraisal'>Offer Applicant</a></button></div>"
                            inner_html += "<div class='p-1 '><button id='deny_btn' class='btn btn-sm btn-danger'><a class='application_id text-white' onclick='reject_application(event,this)'>Deny Applicant</a></button></div>"
                    }
                
                }
                
                if(application_viewed.status=="successful"){
                
                    inner_html += "<div class='p-1 '><button id='deny_btn' class='btn btn-sm btn-danger'><a class='application_id text-white' onclick='revoked_application(event,this)'>Revoke Selection</a></button></div>"    
                    if (application_viewed.applicant.nodeRef.length>0) {
                        inner_html += `<div class='p-1'><button id='view_hr_file_btn' class='application_id mt-1 mr-1 ml-1 btn btn-sm btn-success'><a href="/share/page/site/${HUMAN_RESOURCE_FILE_SITE_NAME}/folder-details?nodeRef=${application_viewed.applicant.nodeRef}">View Personel Folder</a></button></div>`
                    }else{
                        inner_html += "<div class='p-1 '><button id='create_hr_file_btn' data-toggle='modal' data-target='#exampleModal' class='application_id btn btn-sm btn-success text-white'>Create HR Folder</button></div>"
                    }                        
                    inner_html += "<div class='p-1 '><button id='view_appraisal_btn' data-document='Interview Performance' onclick='runFrame(event)' class='application_id btn btn-sm btn-success text-white'>View Interview Performance</button></div>"
                }

                actions_holder.html(inner_html)
            
            }

            $(".application_id").data('app_id',application_id)

            var document_holder = $("#documents_holder")
            var link_holder = $("#link_holder")
            var qualifications_holder = $("#qualifications_holder")
            var skills_holder = $("#skills_holder")
            var avatar_url = ASSETS_BASE+application_viewed.applicant.photoName
            $("#applicant_image").attr('src',avatar_url)
            $("#full_names").html(application_viewed.fullName)
            $("#fullname_input").val(application_viewed.fullName)
            $("#app_email").html(application_viewed.email)
            $("#app_phone").html(application_viewed.phone)
            $("#app_nationality").html(application_viewed.nationality)
            $("#app_residence").html(application_viewed.residence)
            $("#app_district").html(application_viewed.district)
            
            // for staff members
            if (application_viewed.applicant.staff_status) {
                $("#app_college").html(application_viewed.applicant.college)
                $("#app_department").html(application_viewed.applicant.department)
                $("#app_position").html(application_viewed.applicant.role)
            }else{
                $("#app_college").html("none")
                $("#app_department").html("none")
                $("#app_position").html("none")
            }

            var appraisal_link = ASSETS_BASE+application_viewed.report
            $("#view_appraisal_btn").data('src',appraisal_link)
            try {
                
                if (application_viewed.documents_obj!=null&&application_viewed.documents_obj!="undefined") {
                 
                    Array.from(application_viewed.documents_obj).forEach(document=>{

                        var document_link = ASSETS_BASE+document.filename
                        var document_name = document.name
                        var document_button = "<div class='p-1 '><button data-document='"+document_name+"' data-src='"+document_link+"' onclick='runFrame(event)' class='btn btn-sm  btn-info text-white'>View "+document_name+"</button></div>"
                        document_holder.append(document_button)
                    })
                    
                }
                Array.from(application_viewed.applicant.links).forEach(link=>{

                    var external_link = link
                    var link_btn = "<div class='p-1'><a target='_blank' href='"+external_link+"' class='btn btn-sm btn-rounded btn-info text-white'>View "+external_link+"</a></div>"
                    link_holder.append(link_btn)
                })
                Array.from(application_viewed.qualifications).forEach(qualification=>{
                    var qualification = "<div class='custom-control custom-checkbox'><span><strong>"+qualification.name+": </strong></span><span>"+qualification.value+"</span></div>" 
                    qualifications_holder.append(qualification)
                })     
                Array.from(application_viewed.applicant.skills).forEach(skill=>{
                    var skill_html = "<div class='custom-control custom-checkbox'><span><strong>"+skill 
                    skills_holder.append(skill_html)
                })     
                
            } catch (error) {
                console.log(error);
                
            }               
        }
        $('.preloader').hide()
    }

    const create_hr_file = (json_data)=>{
    if(confirm("Confirm to proceed with action")){
        $(".preloader").show()
            
        var create_folder_url = `/alfresco/s/api/site/folder/${HUMAN_RESOURCE_FILE_SITE_NAME}/documentlibrary`
        $.ajax({url: create_folder_url,
            headers: {"Authorization":auth},
                type:'POST',
                data:json_data,
                dataType:'text',
                contentType:'application/json',
                success: function(result){
                        // result = JSON.stringify(result)
                        var pos = result.lastIndexOf(',')
                        result = result.substring(0,pos)+result.substring(pos+1)
                        result = JSON.parse(result)
                        // result = JSON.stringify(result)
                        // result = JSON.parse(result)
                        console.log(result);
                        
                        $("#create_hr_file_btn").hide()
                        var inner_html = `<div class='p-1'><button id='view_hr_file_btn' class='application_id mt-1 mr-1 ml-1 btn  btn-success'><a href="/share/page/site/${HUMAN_RESOURCE_FILE_SITE_NAME}/folder-details?nodeRef=${result.nodeRef}">View Personel Folder</a></button></div>`
                        $("#actions_holder").append(inner_html)
                        $("#close_submit_modal").click()
                        update_applicant(result.nodeRef)
                        $(".preloader").hide()
                    },
                error:function(error){
                        console.log(error)
                        $(".preloader").hide()
                        alert("something went wrong when performing this action")
                    }
        });

    }
    }

    const update_applicant = (nodeRef)=>{
        $(".preloader").show()
        var json_data = new FormData()
        // {'nodeRef':nodeRef,'userId':application_id}
        json_data.append('nodeRef',nodeRef)
        json_data.append('userId',applicant_id)
        var update_noderef = `${PORTAL_BASE}user/nodeRef/update`
        $.ajax({url: update_noderef,
                type:'POST',
                data: json_data,
                enctype:'multipart/form-data',
                contentType: false,
                processData: false,
                cache: false,
                success: function(result){
                        $(".preloader").hide()
                        console.log(result);
                        sessionStorage.removeItem(application_id)
                        location.reload()
                    },
                error:function(error){
                        console.log(error)
                        $(".preloader").hide()
                        alert("something went wrong when performing this action")
                    }
        });
    }

    const sendMail = (body,subject)=>{
            var BASE_URL = window.location.origin+"/share/page/proxy/alfresco/projectone/email/send?";
            var request_url = BASE_URL+"email="+application_viewed.email+"&body="+body+"&from=makerere3@gmail.com&subject="+subject+"&guest=true";
            $.ajax({url: request_url,
                    success: function(result){
                            $(".preloader").hide()
                            if(!result.sent==true){
                                var error_log ="Error while sending to "+application_viewed.email
                                alert(error_log)
                            }else{
                                location.reload()
                            }
                        },
                    error:function(error){
                            console.log(error)
                        }
            });
    }


// } catch (error) {
//     console.log(error);
//     history.back()
// }