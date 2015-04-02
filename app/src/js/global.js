var app = app || {};

app.global = {

    init: function() {
        this.utility.init();
    },
    utility:{
        init:function(){
            this.nav();
        },
        nav:function(){
            var $nav = $("ul.nav");
            var path_arr = window.location.pathname.split("/");
            app.global.parent = path_arr[1];
            app.global.child = path_arr[2];
            var selector_str = "."+app.global.parent;
            if(app.global.child && app.global.child!==''){selector_str+="-"+app.global.child;}
            $nav.find(selector_str).addClass('active');


        }
    }

};

$(function(){
    app.global.init();
});
