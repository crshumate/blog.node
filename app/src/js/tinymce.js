var app = app || {};

app.tinymce = {
    init: function() {
        images = this.formatImages();
        tinyMCE.init({
            resize: true,
            width: "100%",
            toolbar:"undo redo | bold italic underline | link image code",
            mode: "textareas",
            plugins: "image, link, code",
            image_list: images,
            menubar: false,
            statusbar: false,
            relative_urls: false
        });
    },

    formatImages: function() {
        var returned_images = [];
        for (var i = 0; i < images.length; i++) {
            var image = images[i];
            returned_images.push({
                title: image.title,
                value: "/img/" + image.image
            });
        }
        return returned_images;
    }
};

