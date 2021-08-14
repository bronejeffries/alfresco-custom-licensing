(function ($) {
        $(document).ready(function() {

            let used_licenses = [];
            var list_users_url = "/share/page/proxy/alfresco/api/custom/people";
            fetch(list_users_url)
                .then(resp=>resp.json())
                .then(({people})=>{
                    var people_options = "<option value=''>Select User(s)..</option>";
                    people.forEach(person => {
                        if (person.enabled && person.userName!=="admin") {
                            var user_currently_licensed = (person.license_key.length>0)?"-Licensed":"-No license";
                            people_options += `<option value='${person.userName}'>${person.firstName} ${person.lastName}${user_currently_licensed}</option>`;
                            
                            if (person.license_key.length>0) {
                                used_licenses.push(person.license_key);
                            }
                        }
                    });
                    $("#license_users").html(people_options);
                })
                .catch(err=>console.log(err));

            var businsess_ex_details_url_base = "http://localhost:8000/api/buz-keys/";
            let user_update_base = "/share/page/proxy/alfresco/api/custom/people/";
            var provided_license = "";
            var provided_secret_key = "";
            let license_resp;

            const fetch_license_details = (l_key,s_key)=>{
                
                if (l_key.length>0 && s_key.length>0) {

                    var fetch_url = `${businsess_ex_details_url_base}${l_key}/?s_key=${s_key}`;
                    fetch(fetch_url)
                    .then(resp=>resp.json())
                    .then(resp=>{

                        license_resp = resp;
                        $("#customer_details").val(resp.client_name);
                        $("#license_type").val(resp.license_type);
                        $("#license_limit").val(resp.max_access_limit);
                        
                        if (resp.max_access_limit>1) {

                            $("#license_users").attr("multiple","true");
                        
                        }else{

                            $("#license_users").removeAttr("multiple");
                        }
                        
                    })
                    .catch(err=>console.log(err));

                }

            }

            $("#license_key").change((e)=>{
                provided_license = $(e.target).val().trim();
                if (used_licenses.includes(provided_license)) {
                    alert("License already used");
                    provided_license = "";
                }
                fetch_license_details(provided_license,provided_secret_key);
            })

            $("#secret_key").change((e)=>{
                provided_secret_key = $(e.target).val().trim();
                fetch_license_details(provided_license,provided_secret_key);
            })

            $("#yiu_liessa_naj_dojo_license_form").submit((e)=>{

                e.preventDefault();

                if (provided_license.length>0 && provided_secret_key.length>0 && typeof(license_resp)!=="undefined") {
                 
                    if (confirm("Further Editing is not possible once submitted, confirm to proceed.")) {
                    
                        let success_opt = false;
                        
                        let selected_users = $("select#license_users option:selected");
    
                        if (selected_users.length>license_resp.max_access_limit) {
                        
                            alert("Selected Users exceed the limit!");
                        
                        }else{

                            fetch(`${businsess_ex_details_url_base}${provided_license}/?s_key=${provided_secret_key}`,{
                                method:'PUT',
                                headers:{
                                    'Content-Type': 'application/json'
                                },
                                body:JSON.stringify({})
                            })
                            .then(resp=>resp.json())
                            .then(({message,code})=>{
                                if (code) {
                                    Array.from(selected_users).forEach(
    
                                        opt=>{
                                            
                                            let {license_type,max_access_limit:license_limit,license_key} = license_resp;
                                            
                                            let selected_user = $(opt).val();
                                            
                                            let update_data_object = {license_type, license_limit,license_key};
                
                                            fetch(`${user_update_base}${selected_user}`,{
    
                                                method:'PUT',
                                                headers: {
                                                    'Content-Type': 'application/json'
                                                },
                                                body: JSON.stringify(update_data_object)
                                            })
                                            .then(resp=>resp.json())
                                            .then((resp)=>{
            
                                                console.log(resp);
                                                success_opt = true;
            
                                            })
                                            .catch((err)=>{
            
                                                success_opt = false;
                                                console.error(err);
                                            
                                            });
                                        }
                                    )
                                    alert("License installed successfully");  
                                }else{
                                    alert(message)
                                }

                            })
                            .catch((err)=>{
                                console.error(err);
                            })

                        }
                    }
                    
                }
                
            })


        })

})(jQuery);