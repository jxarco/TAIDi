var tOut = TD.PreloadTimeOut;

function loadUI(){
        
        $$("#logo-preloader").css("display", "none");
        
        fw7 = new Framework7({
          // App root element
          root: '#app',
          // App id
          id: 'com.asm.project',
          // App Name
          name: 'TAIDi',
          theme: 'auto',
          // Enable swipe panel
          panel: {
            swipe: 'left',
          },
          // Add default routes
          routes: routes,
          smartSelect: {
              openIn: 'popover'
          }
        });
        
        globals.mainView = fw7.views.create('.view-main');
        globals.smartSelectView = fw7.views.create('.view-smartie');
        globals.smartSelect = fw7.smartSelect.get();
        globals.smartSelect.onClose = function(){
            setUserCurrentGroup( globals.smartSelect.selectEl.value );
        }
        
        $(".view.view-main").fadeIn();
}