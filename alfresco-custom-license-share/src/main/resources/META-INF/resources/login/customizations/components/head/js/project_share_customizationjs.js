

$(document).ready(function(){

    
    if (!window.location.href.includes('start-workflow')) {        
        customise_web_view();   
        customise_dashboard_dashlets();
        // exclude the profile page
        if(!window.location.href.includes('profile')){
            customise_columnView();
        }
        customise_nav();
        customise_main();
        customise_siteFinder();
        customise_modal_header();
    }
    // workflowFormSelection();
    customise_buttons();
    addTasksToast();
    checkConnection();
    $("#alf-full-width").hide();
    $('.alf-configure-icon').hide();
    $('.toolbar.userprofile').hide();
    hideLoader();
})

// //////// web dashlets ///////////////
function customise_web_view() {

    if($(".dashlet.webview").length!=0){

        $(".preloader").show();
        $(".dashlet.webview>.title").hide();
        // $(".dashlet.webview>.titleBarActions").hide();
        $(".dashlet.webview").addClass('col-md-12 border border-0 p-0');
        $(".dashlet.webview>.body.scrollablePanel").css("height","94.5vh").css("width","98.5vw").css("margin","0px");
        $('#alf-hd').css('height','5px')
        $("#doc3").css('margin-left','0px')

        var customise_webview_interval = setInterval(() => {
            var project_header = $("header");
                if (project_header.length!=0){
                    $(".preloader").show();
                    project_header.hide();
                    $('.share-header-title').hide();
                    var sandboxoptions = $('iframe').attr('sandbox')
                    console.log(sandboxoptions);
                    // if(sandboxoptions!="undefined"){
                        sandboxoptions ="allow-forms allow-modals allow-popups allow-same-origin allow-scripts allow-top-navigation allow-top-navigation-by-user-activation "
                        $('iframe').attr('sandbox',sandboxoptions)
                        clearInterval(customise_webview_interval)
                        hideLoader()
                    // }
                }
        }, 1000);

    }
    hideLoader();
}
// ///////// end web dashlets ////////// 

/////////////////////// customise dashelts ///////////////////

function customise_dashboard_dashlets() {

    if ($('.card').length==0) {
        if ($(".dashlet.webview").length==0) {
         
            $(".dashlet").addClass('card shadow border border-left-0 border-success');
            Array.from($('.card')).forEach(card=>{
                var card_body = $(card).children().detach();
                // console.log(card_body); 
                $(card).children().remove(); 
                $(card).append('<div class="card-body" style="paddding:0px;"></div>'); 
                card_body.appendTo($(card).find(".card-body")) 
                
            })
    
            Array.from($('.card')).forEach(card=>{
                var card_header = $(card).find('.card-body>.title').detach(); 
                $(card).prepend('<div class="card-header bg-success"></div>'); 
                card_header.appendTo($(card).find('.card-header')); 
                $(card).find('.card-body>.title').remove()
                })
    
            $('.card>.card-header>.title').addClass('h5 text-white').removeClass('title')
            hideLoader()
        }

    }
    

}


/////////////////////// end customise dashelts ///////////////////


// //////////////////////// customise buttons //////////////////
function customise_buttons() {
    $(".preloader").show();
    $('button').addClass('btn btn-success')
    // $('.align-right>.first-child').addClass('btn btn-sm btn-success')
    $("#CREATE_SITE_DIALOG_OK_label").addClass('btn-success')
    $("#CREATE_SITE_DIALOG_CANCEL_label").addClass('btn-danger')
    $(".unassigned-task").addClass('badge badge-primary')
    $('table').addClass('table')
    $($('header').children()[0]).addClass('bg-white')
    hideLoader();
}
// //////////////////////// end customise buttons //////////////////

///////// loader ////////
function appendLoader() {
    
    $('body').prepend('<div class="preloader"><div class="lds-ripple"><div class="lds-pos"></div><div class="lds-pos"></div></div></div>')
}

function hideLoader() {

    $(".preloader").hide();

}

// /////// viewcolumn customisation ////////////
function customise_columnView() {
    if ($('.card').length==0) {
        $(".preloader").show();
        $(".viewcolumn").addClass('card shadow border border-left-0 border-success');
        Array.from($('.card')).forEach(card=>{
            var card_body = $(card).children().detach();
            // console.log(card_body); 
            $(card).children().remove(); 
            $(card).append('<div class="card-body"></div>'); 
            card_body.appendTo($(card).find(".card-body")) 
            
        })

        Array.from($('.card')).forEach(card=>{
            var card_header = $(card).find('.card-body>.header-bar').detach(); 
            $(card).prepend('<div class="card-header bg-success"></div>'); 
            card_header.appendTo($(card).find('.card-header')); 
            $(card).find('.card-body>.header-bar').remove()
            })

        $('.card>.card-header>.header-bar').addClass('h5 text-white').removeClass('header-bar')
    
    }
    hideLoader();

}
// /////// end viewcolumn customisation ////////////

//////////// customise nav ////////////////////////////
function customise_nav() {
    $(".preloader").show();
    $('.yui-b.yui-resize').addClass('scroll-sidebar bg-success');
    var nav_body = $('.scroll-sidebar').children().detach()
    $('.scroll-sidebar').append('<nav class="sidebar-nav"></nav>')
    nav_body.appendTo($('.scroll-sidebar>.sidebar-nav'))
    hideLoader();

}

//////////// end customise nav ////////////////////////////

//////////// customise main ////////////////////////////
function customise_main() {
    $(".preloader").show();
    $('#yui-main>.yui-b').addClass('container-fluid card shadow border border-success')
    $($('#yui-main>.yui-b').children()[0]).addClass('card-body').css('padding',"0px")
    hideLoader();
}

//////////// end customise main ////////////////////////////

// /////// siteFinder customisation ////////////
function customise_siteFinder() {

    if ($(".card").length==0) {
        $(".preloader").show();
        $(".finder-wrapper").removeClass('finder-wrapper')
        $(".theme-bg-color-3").add('bg-success').removeClass('theme-bg-color-3')
        $(".site-finder").addClass('card shadow border border-left-0 border-success');
        Array.from($('.card')).forEach(card=>{
            var card_body = $(card).children().detach();
            // console.log(card_body); 
            $(card).children().remove(); 
            $(card).append('<div class="card-body" style="padding:0px;"></div>'); 
            card_body.appendTo($(card).find(".card-body"))
            
        })

        Array.from($('.card')).forEach(card=>{
            var card_header = $(card).find('.card-body>.title').detach(); 
            $(card).prepend('<div class="card-header bg-success" style="padding:0px;"></div>'); 
            card_header.appendTo($(card).find('.card-header')); 
            $(card).find('.card-body>.title').remove()
            })

        $('.card>.card-header>.title').addClass('h5 text-white').removeClass('title')
        $('.card>.card-body>.search-bar').addClass('bg-success')


    }
    hideLoader();

}
// /////// end siteFinder customisation ////////////

// ////// modal header ////////////////

function customise_modal_header(params) {

    $(".dijitDialogTitleBar").addClass('bg-success')

}

// ////// end modal header ////////////////

function addTasksToast(){
        
    var toast_div_html = '<div class="toast fade show bg-danger" data-autohide="false" style="position: fixed; top: 90%; right: 0;"><div class="toast-header"><i class="fa fa-1x fa-bell m-1"></i><strong class="m-1">Pending Tasks</strong><small>5 seconds ago</small><button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close"><span aria-hidden="true">×</span></button></div><div class="toast-body text-white" id="toast_body_holder"></div></div>'
    
    if ($(".dashlet.webview").length==1) {
        $(".dashlet.webview").prepend(toast_div_html)
        $('.toast').hide()
        $(".close").on('click',(e)=>{
            $(e.target).closest(".toast").hide()
        })
    }else{
        var customise_header_interval = setInterval(() => {
            var project_share_header = $('#doc3');
                if(project_share_header.length!=0){
                    project_share_header.append(toast_div_html)
                    $('.toast').hide()
                    $(".close").on('click',(e)=>{
                        $(e.target).closest(".toast").hide()
                    })
                    clearInterval(customise_header_interval)
                    hideLoader();
                }
        }, 1000);
    }


        
}

function workflowFormSelection() {
    
    var workflowtostart = (new URL(document.location)).searchParams.get("workflowname")
    
    if(workflowtostart==null){
    
        workflowtostart = "New Task"
    
    }

    if(workflowtostart!=null) {
        try {
            $('.preloader').show()
            var event = new MouseEvent('mousedown', null);
            var spanBtn = $('.selected-form-button')[0].children[0]
            spanBtn.dispatchEvent(event)
            $('span.title:contains('+workflowtostart+')').parent().click()                
        } catch (error) {
            
        }
        $('.preloader').hide()
    }
    hideLoader();

}

function checkConnection(){

    var add_connection_status_div = setInterval(() => {
            var project_share_body = $('body');
                if (project_share_body.length!=0){
                    appendLoader();
                    $('body').prepend("<div id='connection-overlay-screen' class='overlay-screen'><div class='overlaytext'>no internet connection, server connection is lost!</div></div>")

                    $('.close_notice').on('click',function(e){
                        $(e.target).closest('.overlay-screen').hide()
                    })
                    clearInterval(add_connection_status_div)
                    hideLoader();
                }
        }, 1000);

    setInterval(() => {
        var this_navigator = navigator
        var check_connectivity = !(window.location.href.includes('localhost')||window.location.href.includes('127.0.0.1'))
        if (check_connectivity && this_navigator!=null && this_navigator!='undefined') {
            var navigator_online = this_navigator.onLine;
            if (!navigator_online) {
                //show connection lost
                $('#connection-overlay-screen').show()
            }else{
                $('#connection-overlay-screen').hide()
            }
        }
    }, 500);
}