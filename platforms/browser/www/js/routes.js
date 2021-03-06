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

            // auto-complete for who makes the task
            globals.autocompleteDropdownAllPeople = fw7.autocomplete.create({
              inputEl: '#autocomplete-dropdown-all-people',
              openIn: 'dropdown',
              source: function (query, render) {
                  
                var results = [];
                  
                for(var entry in globals.user.currentGroup.namers)
                    results.push( entry );
                  
                // Render items by passing array with result items
                render(results);
              }
            }).open().close();

           // auto-complete for which task
            globals.autocompleteDropdownAll = fw7.autocomplete.create({
                inputEl: '#autocomplete-dropdown-all',
                openIn: 'dropdown',
                dropdownPlaceholderText: 'Escribe para obtener sugerencias',
                source: function (query, render) {
                    var results = [];
                    // Find matched items
                    for (var i = 0; i < globals.default_tasks.length; i++) {
                      if (globals.default_tasks[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(globals.default_tasks[i]);
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

            globals.autocompleteDropdownItem = fw7.autocomplete.create({
              inputEl: '#autocomplete-dropdown-item',
              openIn: 'dropdown',
              dropdownPlaceholderText: 'Escribe para obtener sugerencias',
//              typeahead: true,
              source: function (query, render) {
                var results = [];
                if (query.length === 0) {
                  render(results);
                  return;
                }
                // Find matched items
                for (var i = 0; i < globals.default_items.length; i++) {
                  if (globals.default_items[i].toLowerCase().indexOf(query.toLowerCase()) === 0) results.push(globals.default_items[i]);
                }
                // Render items by passing array with result items
                render(results);
              }
            }).open().close();
            
            globals.autocompleteDropdownUnits = fw7.autocomplete.create({
              inputEl: '#autocomplete-dropdown-units',
              openIn: 'dropdown',
              source: function (query, render) {
                var results = [];
                if (query.length === 0) {
                  render(results);
                  return;
                }
                // Find matched items
                for (var i = 0; i < globals.default_units.length; i++) {
                  if (globals.default_units[i].toLowerCase().indexOf(query.toLowerCase()) === 0) results.push(globals.default_units[i]);
                }
                // Render items by passing array with result items
                render(results);
              }
            }).open().close();
        }
    }
  },
  {
    path: '/edit-task/',
    url: './pages/edit-task.html',
    on: {
        pageAfterIn: function(d){
            fw7.fab.close();
            var $toggle = $$(".urgent-toggle");
            $toggle.on("toggle:change", function(e){
               globals.URGENT_TASK = e.detail.inputEl.checked;
            });

            // auto-complete for who makes the task
            globals.autocompleteDropdownAllPeople = fw7.autocomplete.create({
              inputEl: '#autocomplete-dropdown-all-people',
              openIn: 'dropdown',
              source: function (query, render) {
                  
                var results = [];
                  
                for(var entry in globals.user.currentGroup.namers)
                    results.push( entry );
                  
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
                    for (var i = 0; i < globals.default_tasks.length; i++) {
                      if (globals.default_tasks[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(globals.default_tasks[i]);
                    }
                    // Render items by passing array with result items
                    render(results);
                }
            }).open().close();

			var taskUid = d.detail.route.query.uid;
			showTaskInfo(taskUid);
        }
    }
  },
  {
    path: '/edit-group/',
    url: './pages/edit-group.html',
    on: {
        pageAfterIn: function(d){
            
            if(!globals.user.currentGroup)
            {
                createToast("No tienes grupo", 2000);        
                return;
            }
            
            $("#edit-group-btn").show();
            
            fw7.fab.close();
			var group = globals.user.currentGroup;
            if (group)
                setDOMValue('#edit-group-form [placeholder="Nombre de grupo"]', group.name);
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
