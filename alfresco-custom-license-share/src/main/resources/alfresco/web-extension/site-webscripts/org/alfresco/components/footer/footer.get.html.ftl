<@markup id="css" >
   <#-- CSS Dependencies -->
   <@link href="${url.context}/res/modules/about-share.css" group="footer"/>
   <@link href="${url.context}/res/components/footer/footer.css" group="footer"/>
</@>

<@markup id="js">
   <@script src="${url.context}/res/components/projectone/public/assets/assets/libs/jquery/dist/jquery.min.js" group="customizations"/>
   <@script src="${url.context}/res/login/customizations/components/head/js/project_share_customizationjs.js" group="customizations"/>
   <@script src="${url.context}/res/login/customizations/components/head/js/showtasksToastjs.js" group="customizations"/>
   <@script src="${url.context}/res/modules/about-share.js" group="footer"/>
</@>

<@markup id="widgets">
   <@createWidgets/>
</@>

<@markup id="html">
   <@uniqueIdDiv>
      <#assign fc=config.scoped["Edition"]["footer"]>
      <div class="d-flex justify-content-center align-items-center footer ${fc.getChildValue("css-class")!"footer-com"}">
         <span class="copyright d-flex flex-column align-items-center">
            <a href="#"><img style="height:48px; width:48px;" src="${url.context}/res/components/customtheme/images/small-logo.png" alt="Provided by Coseke Ug Limited" border="0"/></a>
            <span>Provided By FICTIOUS. &copy; <script type="text/javascript"> document.write((new Date()).getFullYear())</script></span>
         </span>
      </div>
   </@>
</@>