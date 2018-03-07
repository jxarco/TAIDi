var routes = [
  {
    path: '/',
    url: './index.html',
  },
  {
    path: '/home/',
    url: './pages/home.html',
  },
  {
    path: '/about/',
    url: './pages/about.html',
  },
  {
    path: '/create/',
    url: './pages/form-group.html',
    on: {
        pageAfterIn: function(){
            var value = makeid(8);
            globals.tmp = {
                share_id: value
            }
            $$("#share-id-form").val( value );
        }
    }
  },
  {
    path: '/form-task/',
    url: './pages/form-task.html',
    on: {
        pageAfterIn: function(){
            fw7.fab.close();
            var $toggle = $$(".urgent-toggle");
            $toggle.on("toggle:change", function(e){
               globals.URGENT_TASK = e.detail.inputEl.checked;
            });
            
            var tasks = [
                    "Poner lavadora","Poner secadora","Pasar la aspiradora","Fregar los platos","Pasar la mopa","Ordenar la habitación","Barrer la habitación",
                    "Limpiar el polvo","Lavar las ventadas","Tender la ropa","Hacer el baño","Limpiar cocina"
                ];
            
            // auto-complete for who makes the task
            globals.autocompleteDropdownAllPeople = fw7.autocomplete.create({
              inputEl: '#autocomplete-dropdown-all-people',
              openIn: 'dropdown',
              source: function (query, render) {
                var results = globals.user ? globals.user.currentGroup.members : [];
                // Render items by passing array with result items
                render(results);
              }
            }).open().close();
            
           // auto-complete for who makes the task
            globals.autocompleteDropdownAll = fw7.autocomplete.create({
                inputEl: '#autocomplete-dropdown-all',
                openIn: 'dropdown',
                source: function (query, render) {
                    var results = [];
                    // Find matched items
                    for (var i = 0; i < tasks.length; i++) {
                      if (tasks[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(tasks[i]);
                    }
                    // Render items by passing array with result items
                    render(results);
                }
            }).open().close();
        }
    }
  },
  {
    path: '/form-list/',
    url: './pages/form-list.html',
    on: {
        pageAfterIn: function(){
            fw7.fab.close();
            var $toggle = $$(".urgent-toggle");
            $toggle.on("toggle:change", function(e){
               globals.URGENT_TASK = e.detail.inputEl.checked;
            });
        }
    }
  },
  {
    path: '/swiper-parallax/',
    url: './pages/swiper-parallax.html',
  },
  // Page Loaders & Router
  {
    path: '/page-loader-template7/:user/:userId/:posts/:postId/',
    templateUrl: './pages/page-loader-template7.html',
  },
  {
    path: '/page-loader-component/:user/:userId/:posts/:postId/',
    componentUrl: './pages/page-loader-component.html',
  },
  {
    path: '/request-and-load/user/:userId/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = routeTo.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        var user = {
          firstName: 'Vladimir',
          lastName: 'Kharlampidi',
          about: 'Hello, i am creator of Framework7! Hope you like it!',
          links: [
            {
              title: 'Framework7 Website',
              url: 'http://framework7.io',
            },
            {
              title: 'Framework7 Forum',
              url: 'http://forum.framework7.io',
            },
          ]
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            componentUrl: './pages/request-and-load.html',
          },
          {
            context: {
              user: user,
            }
          }
        );
      }, 1000);
    },
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
