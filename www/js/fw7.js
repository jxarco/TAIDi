var tOut = 0 || TD.PreloadTimeOut;

setTimeout(function loadUI(){

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

        $(".view.view-main").fadeIn();

        globals.mainView = fw7.views.create('.view-main');
        globals.smartSelectView = fw7.views.create('.view-smartie');
        globals.smartSelect = fw7.smartSelect.get();
        globals.smartSelect.onClose = function(){
            setUserCurrentGroup( globals.smartSelect.selectEl.value );
        }

        $$(document.body).on('change', 'select[id="connectedGroups"]', function(e){
          globals.smartSelect.close();
        });

        // Pull to refresh content
        var $ptrContent = $$('.ptr-content');
        $ptrContent.css("top", "50px");
        // Add 'refresh' listener on it
        $ptrContent.on('ptr:refresh', function (e) {
            if(globals.db)
              globals.db.refresh();
            else {
                fw7.ptr.done();
              }
        });

        // adjust some css things from fw7
        // $$(".tab").css("padding-bottom", "60px !important");
}, tOut);
