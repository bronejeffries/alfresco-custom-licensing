var change_naming_ = setInterval(() => {
    var el_to_change = $("span:contains('Start Workflow')")
    if (el_to_change.length>0) {
        el_to_change.html("Send File")
        clearInterval(change_naming_)
    }
}, 500);