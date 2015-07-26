(function(global) {

  var requestData = $.getJSON('data.json').done(function(products) {
    var requestProductTemplate = $.get('product-template.html').done(function(template) {

      var data = products;
      var template = template;

      function TOMApp() {
        this.products = [];
      }

      TOMApp.prototype.getproducts = function() {
        var self = this;
        for (i=0; i<data.sales.length ; i++) {
          self.products.push(new productobj(data.sales[i], i)  );
        }
      }

      TOMApp.prototype.updateproducthtml = function() {
        for( i=0; i< this.products.length ; i++){
          this.products[i].updatehtml();
        }
      }

      TOMApp.prototype.updatedom = function() {
        thishtml=''; 
        for(var i=0; i< this.products.length ; i++){
          
          if (i % 3 == 0 ) {  
            thishtml += "<div class='row'>"; 
            console.log("START");
          }

          thishtml += this.products[i].htmlview;
          if ((i % 3 == 2) || i == (this.products.length-1) ) {
            thishtml += "</div>";
            console.log("FINISH");
          }
        }
        $("#content").append(thishtml)
      }

      function productobj(product, i) {
        this.photo        = product.photos.medium_half;
        this.title        = product.name;
        this.tagline      = product.tagline;
        this.url          = product.url;
        this.htmlview     = "";
        this.index        = i;
        this.custom_class = "col"+ ((i % 3) +1);
      }

      productobj.prototype.updatehtml = function() {
        var self = this;
        self.htmlview = 
          template.replace('{image}', self.photo)
                  .replace('{title}', self.title)
                  .replace('{tagline}', self.tagline)
                  .replace('{url}', self.url)
                  .replace('{custom_class}', self.custom_class);
      }

      var page = new TOMApp();
      page.getproducts();
      page.updateproducthtml();
      page.updatedom();
    });
  });

}(this));
