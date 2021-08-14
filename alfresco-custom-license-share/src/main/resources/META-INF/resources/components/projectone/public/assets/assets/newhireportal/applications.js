    	var request_url = ""
        var job_reference = ""
        var selected_list = ""
        var view_category = ""
        var filter_key = "applications_filter_object"
        // var filtered_applications_key = "filtered_applications"

        var normalize =()=>{
                $('.selected_applicants').hide();
                $('#confirm_return_done').hide();
                $('#confirm_return').html('Send Batch Emails');
        }

        $(document).ready(function() {


            runDataTable("#example")

            view_category = $("#category_app")
            var location_url =(new URL(document.location)) 
            job_reference = location_url.searchParams.get("j")
            selected_list = location_url.searchParams.get("q")
            var PORTAL_BASE = window.location.protocol+"//"+window.location.hostname+"/jobportal/"
            // var PORTAL_BASE = window.location.protocol+"//"+window.location.hostname+":9090/jobportal/"
            request_url = PORTAL_BASE+"jobs/"+job_reference+"/applications";

            makeURLFetch(selected_list)

            var select_column = $('.selected_applicants');
            
            var confirm_done = $('#confirm_return_done');
            
            var confirm_return = $('#confirm_return');

            normalize()


            confirm_return.on('click',(e)=>{
                    $('.selected_applicants').show()
                    $('#confirm_return_done').show()
                    confirm_return.html('Select Applicants')
                    confirm_return.attr('disabled',true)
            });

            var send_batch_mails = $("#send_batch_mails")

            $("#category-search").on('submit',(e)=>{
            
                e.preventDefault()
                makeURLFetch($("#list").val())
            
            })

            $('#applications_filter').on('submit',(e)=>{

                    $('.preloader').show()
                    e.preventDefault()
                    var filter_object = {}
                    Array.from($("form#applications_filter .filter_value")).forEach(el=>{
                        filter_object[(el.name).trim()]=(el.value).trim()
                    })
                    console.log(filter_object)
                    filter_out_applications(filter_object)
            })

            send_batch_mails.on('click',(e)=>{
                $("#close_message_modal").click()
                $(".preloader").show()
                confirm_return.attr('disabled',false)
                var error_log = ""
                var email_body = $("#email_body").val()
                // var fro_email_address = $("#fro_email_address").val()
                var subject = $("#subject").val()
                var selectedApplicants = $('.form-check-input.applicant_select:checkbox:checked')
                if(selectedApplicants.length>0){
                
                    Array.from(selectedApplicants).forEach((checkedBox,position,checkboxes)=>{
                        checkedBox = $(checkedBox)
                        var email = checkedBox.val()
                        var personal_mail = email_body
                        personal_mail.replace(/firstname/gi, checkedBox.data('firstname'));
                        personal_mail.replace(/lastname/gi, checkedBox.data('lastname'));
                        var BASE_URL = window.location.origin+"/share/page/proxy/alfresco/projectone/email/send?";
                        var request_url = BASE_URL+"email="+email+"&body="+email_body+"&from=makerere3@gmail.com&subject="+subject+"&guest=true";
                        $.ajax({url: request_url,
                                success: function(result){
                                        if(!result.sent==true){
                                            error_log +="Error while sending to "+email
                                            checkedBox.closest('td').addClass('bg-danger')
                                        }else{
                                            checkedBox.prop("checked", false)
                                            checkedBox.closest('td').addClass('bg-success')
                                        }
                                        if(position === (checkboxes.length - 1)){
                                            $(".preloader").hide() 
                                            if(error_log.length>0){
                                                alert(error_log)
                                            }else{
                                                normalize()
                                            }                               
                                        }
                                    },
                                error:function(error){
                                        console.log(error)
                                        if(position === (checkboxes.length - 1)){ 
                                            normalize()
                                            $(".preloader").hide()                                
                                        }
                                    }
                        });
                    });

                }else{
                
                    $(".preloader").hide();
                    alert("Atleast one applicant should be selected")
                    normalize()

                }
            })

            $('.clear_filters').on('click',(e)=>{
                e.preventDefault()
                clearFilters()
                location.reload()
            })

        });

        const makeURLFetch = (selected_list)=>{

            var list_url = ""
            if(selected_list=="app_short"){
                list_url = request_url+"/shortlisted"
                view_category.html("Shortlisted For Interview")
            
            }else if(selected_list=="app_conf"){
                
                list_url = request_url+"/confirmed"
                view_category.html("Sucessful Applicants")

            }else{

                list_url = request_url
                view_category.html("Applicants")

            }
            load_applications(list_url)
        
        }

        const load_applications = (request_url)=>{

            $(".preloader").show()
            $.ajax({url: request_url,
                    success: function(result){
                            sessionStorage.setItem("applications", JSON.stringify(result.job_applications));
                            if (!checkAndApplyFilters()) {
                                create_table(result.job_applications)
                            }
                        },
                    error:function(error){
                            console.log(error)
                            $(".preloader").hide()
                        }
            });

        }

        const create_table = (table_data)=>{
                    var table_holder = $("#table-holder");
                    table_holder.children()[0].remove();
                    var newTable = document.createElement('table');
                    newTable.id="example";
                    newTable.classList = ["table table-bordered"];
                    var thead = document.createElement('thead');
                    thead.innerHTML = "<tr><th class='selected_applicants'>Select</th><th>Name</th><th>Email</th><th>Phone</th><th>Qualifications</th><th>Actions</th></tr>";
                    newTable.append(thead);
                    var tbody = document.createElement('tbody');
                    Array.from(table_data).forEach(application=>{
                        sessionStorage.setItem(application.id, JSON.stringify(application));
                        var tr = document.createElement('tr');
                        var names = application.fullName.split(" ")
                        var tr_innerHtml = "<td class='selected_applicants'><input type='checkbox' data-firstname='"+names[0]+"' data-lastname='"+names[1]+"' name='selectedApplicant[]' class='form-check-input applicant_select' value='"+application.email+"'></td>"
                        tr_innerHtml += "<td>"+application.fullName+"</td>";
                        tr_innerHtml += "<td>"+application.email+"</td>";
                        tr_innerHtml += "<td>"+application.phone+"</td>";
                        qualifications_innerHtml = "<td>";
                        Array.from(application.qualifications).forEach(qualification=>{
                            qualifications_innerHtml += "<strong>"+qualification.name+": </strong>"+qualification.value+"<br>";
                        })
                        qualifications_innerHtml += "</td>";
                        tr_innerHtml += qualifications_innerHtml;
                        tr_innerHtml += "<td><a class='text-white btn btn-sm btn-success' href='"+window.location.origin+"/share/page/proxy/alfresco/projectone/application/details?j="+job_reference+"&a="+application.id+"'>applicant details</a></td>";
                        tr.innerHTML = tr_innerHtml;
                        tbody.appendChild(tr);
                    })
                    newTable.append(tbody);
                    table_holder.append(newTable);
                    $(".preloader").hide()
                    runDataTable("#example")
                    normalize()
        }

        const filter_out_applications = (filter_object)=>{
            var applications = JSON.parse(sessionStorage.getItem("applications"))
            var filtered_applications = new Array()
            if(applications!=null){
                    Array.from(applications).forEach(application=>{
                        // var qualifies = false
                        var qualifies=[]
                        var application_qualifications = application.qualifications
                        Array.from(application_qualifications).forEach(qual=>{
                            
                            var compare_key = (qual.name).trim()
                            
                            var compare_value = qual.value.split(",")

                            var filter_value = filter_object[compare_key]

                            if(filter_value!="undefined" && filter_value.length>0){
                                filter_value = filter_value.trim()
                                
                                if(isNaN(Number(filter_value))){
                                    if(compare_value.includes(filter_value)){
                                        // qualifies = true
                                        qualifies.push(true)
                                    }else{
                                
                                        // qualifies = false
                                        qualifies.push(false)
                                
                                    }
                                }else{

                                    if(Number(compare_value[0])>=Number(filter_value)){
                                        // qualifies = true
                                        qualifies.push(true)
                                    }else{
                                
                                        // qualifies = false
                                        qualifies.push(false)
                                
                                    }

                                }
                                console.log(compare_value);
                                console.log(filter_value,qualifies);
                                
                            }
                        })
                        if(!qualifies.includes(false)){
                            filtered_applications.push(application)
                        }
                        // if(qualifies==true){
                        //     filtered_applications.push(application)
                        // }
                    }) 
            }
            sessionStorage.setItem(filter_key, JSON.stringify(filter_object));
            // sessionStorage.setItem(filtered_applications_key,JSON.stringify(filtered_applications))
            activateFilterClear()
            view_category.html("Filtered Applicants")
            create_table(filtered_applications)
            $(".preloader").hide()

        }

        const runDataTable = (id)=>{
            var my_table = $(id)
            my_table.DataTable({
                dom: 'lBfrtip',
                "lengthMenu": [[10, 25, 50,100, -1], ["show 10", "show 25", "show 50", "show 100", "All"]],
                buttons: [
                    'copyHtml5',
                    'excelHtml5',
                    'csvHtml5',
                    'pdfHtml5',
                    'print'
                    ]
            });
        
        }

        const clearFilters = ()=>{
            sessionStorage.removeItem(filter_key);
            deactivateFilterClear()
        }

        const deactivateFilterClear = ()=>{
            $('.clear_filters').attr('disabled',true)
        }
        const activateFilterClear = ()=>{
            $('.clear_filters').attr('disabled',false)
        }

        const checkAndApplyFilters = ()=>{
            var filters = sessionStorage.getItem(filter_key);
            var filter_out = false
            if (filters!=null) {
                filter_out = true
                filters = JSON.parse(filters)
                for (var name in filters) {
                    var DOM_ELEMENT_QUERY = `[name=${name}]`
                    $(DOM_ELEMENT_QUERY).val(filters[name])
                }
                filter_out_applications(filters)
            }
            return filter_out
        }

        