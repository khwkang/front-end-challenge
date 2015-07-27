(function(global) {

  var _template = function(str, param) {
    return str.replace(/\{(.*?)\}/g, function(match, token) {
      return param[token];
    });
  }

  var requestData = $.getJSON('data.json').done(function(productData) {
    var requestProductTemplate = $.get('product-template.html').done(function(productTemplateHtml) {

      function TOMApp() {
        var self = this;

        self.regions = {
          "$mainRegion": $("#content")
        }

        self.products = [];

        self.initProducts();
        self.render();
      }

      TOMApp.prototype.initProducts = function() {
        var self = this;

        for (var i=0; i<productData.sales.length ; i++) {
          self.products.push(new Product(productData.sales[i], i)  );
        }
      }

      TOMApp.prototype.render = function() {
        var self = this;

        self.regions.$mainRegion.empty();

        var $row = null;
        for(var i=0; i< self.products.length ; i++){
          
          if (i % 3 == 0 ) {  
            $row = $("<div>").addClass("row");
            console.log("START");
          }

          $row.append(self.products[i].render());

          if ((i % 3 == 2) || i == (self.products.length-1)) {
            self.regions.$mainRegion.append($row);
            console.log("FINISH");
          }
        }
      }

      function Product(product, i) {
        var self = this;

        self.photo        = product.photos.medium_half;
        self.title        = product.name;
        self.tagline      = product.tagline;
        self.url          = product.url;
        self.index        = i;
        self.custom_class = "col"+ ((i % 3) +1);

        self.$elem = null;
      }

      Product.prototype.render = function() {
        var self = this;

        var param = {
          image: self.photo,
          title: self.title,
          tagline: self.tagline,
          url: self.url,
          custom_class: self.custom_class
        }

        var htmlView = _template(productTemplateHtml, param);

        if (self.$elem) {
          // instantiated already, just update html
          self.$elem.html(htmlView);
        } else {
          // Instantiation of the jQuery object
          self.$elem = $(htmlView);
        }

        return self.$elem;
      }

      // Entry point
      var app = new TOMApp();
    });
  });

}(this));
