(function(global) {

  // tempalating functing 
  var _template = function(str, param) {
    return str.replace(/\{(.*?)\}/g, function(match, token) {
      return param[token];
    });
  }

  // self implemented resource loader to fulfill dependencies
  // ** please refer to 'tiny-require.js' for annotated source code. 
  tinyRequire(['data.json', 'product-template.html'], function(productData, productTemplateHtml) {

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
        self.products.push(new Product(productData.sales[i], i));
      }
    }

    TOMApp.prototype.render = function() {
      var self = this;

      // reset the region
      self.regions.$mainRegion.empty();
      $(".action-remove").off("click"); // prevent memory leaking

      // rendering
      var $row = $("<div>").addClass("row");
      for(var i=0; i < self.products.length ; i++){
        $row.append(self.products[i].render());
      }
      self.regions.$mainRegion.append($row);

      // attach event handlers for removing product button 
      $(".action-remove").on("click", function(){
        event.preventDefault();

        var $container = $(this).closest(".product-container");

        var self = this;
        $container.on("animationend", function() {
          $container.remove();
          $container.off("animationend");
        });
        $container.addClass("tvOut");
      });
      // hide the loading gif when finished rendering
      $(".loading").addClass("hidden");
    }

    function Product(product, i) {
      var self = this;
      self.photo        = product.photos.medium_half;
      self.title        = product.name;
      self.tagline      = product.tagline;
      self.url          = product.url;
      self.description  = product.description;
      self.index        = i;
      self.$elem         = $("<div>").addClass("product-view-container");
    }

    Product.prototype.render = function() {
      var self = this;

      var param = {
        image: self.photo,
        title: self.title,
        tagline: self.tagline,
        url: self.url,
        description: self.description
      }

      var htmlView = _template(productTemplateHtml, param);

      self.$elem.html(htmlView);

      return self.$elem;
    }

    // Entry point
    var app = new TOMApp();
  });

}(this));
