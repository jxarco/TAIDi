var tOut = 0 || TD.PreloadTimeOut;

setTimeout(function loadUI(){

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
        globals.stats_popup = fw7.popup.create({el: ".popup-about"});
        globals.detail_popup = fw7.popup.create({el: ".popup-detail"});
    
        // close smart selector on change current group
        $$(document.body).on('change', 'select[id="connectedGroups"]', function(e){
            setUserCurrentGroup( globals.smartSelect.selectEl.value );
            globals.smartSelect.close();
            fw7.panel.close();
        });

        // Pull to refresh content
        var $ptrContent = $$('.ptr-content');
        $ptrContent.css("top", "50px");
        // Add 'refresh' listener on it
        $ptrContent.on('ptr:refresh', function (e) {
            if(globals.db)
              globals.db.refresh();
            else {
                setTimeout( ptr_done, 500 );
              }
        });
    
        var $auto_refresh = $$(".toggle");
        $auto_refresh.on('toggle:change', function (e) {
            globals.auto_refresh = e.detail.inputEl.checked;
            fw7.panel.close();
            if(globals.auto_refresh)
                // globals.db.refresh(); 
                globals.db.update( function(){
                    globals.db.updateGroups();
                    UI.refreshMain();
                });
            else 
                globals.db.update();
            
        });

        // adjust some css things
        $$("#logo-preloader").css("display", "none");
}, tOut);
