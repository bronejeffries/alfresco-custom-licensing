<@markup id="custom-login-resources" action="after" target="resources">

   <@link type="text/css" href="${url.context}/res/components/projectone/public/assets/dist/css/bootstrap.css" rel="stylesheet" />
   <style>
        .overlay-screen {
            position: fixed;
            display: none;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0,0,0,0.5);
            z-index: 2;
            cursor: pointer;
         }
         .overlaytext {
            position: absolute;
            top: 50%;
            left: 50%;
            font-size: 32px;
            color: #e9ecef;
            transform: translate(-50%,-50%);
            -ms-transform: translate(-50%,-50%);
         }
         .overlaydiv {
            position: absolute;
            background-color: #ffffff;
            top: 50%;
            left: 50%;
            font-size: 14px;
            color: #000000;
            transform: translate(-50%,-50%);
            -ms-transform: translate(-50%,-50%);
         }
   </style>
   <div class="preloader">
      <div class="lds-ripple">
         <div class="lds-pos"></div>
         <div class="lds-pos"></div>
      </div>
   </div>
</@markup>