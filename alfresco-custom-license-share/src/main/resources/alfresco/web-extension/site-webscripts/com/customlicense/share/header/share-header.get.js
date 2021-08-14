var headerMenu = widgetUtils.findObject(model.jsonModel,"id","HEADER_APP_MENU_BAR");

if (headerMenu!=null) {
    
    if (user.isAdmin) {
     
        var license_menu_dropdown = [
            {
                name:"alfresco\/header\/AlfMenuItem",
                id: "HEADER_MENU_CUSTOM_LICENSE_ADD",
                config:{
                    id:"HEADER_MENU_CUSTOM_LICENSE_ADD",
                    label:"Add new license",
                    targetUrl:"proxy/alfresco/addlicense"
                }
            }
        ]
    
        headerMenu.config.widgets.push(
            {
                name:"alfresco\/header\/AlfMenuBarPopup",
                id:"HEADER_CUSTOM_LINCENSE_EXTRA_LINKS",
                config:{
                    id:"HEADER_CUSTOM_LINCENSE_EXTRA_LINKS",
                    label:"Licenses",
                    widgets:[
                        {
                            id:"HEADER_CUSTOM_LINCENSE_EXTRA_LINKS_GROUP",
                            name:"alfresco\/menus\/AlfMenuGroup",
                            config:{
                                widgets:license_menu_dropdown
                            }
                        }
                    ]
                }
            }
        )

    }

}