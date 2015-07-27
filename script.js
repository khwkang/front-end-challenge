(function(global) {

  var _template = function(str, param) {
    return str.replace(/\{(.*?)\}/g, function(match, token) {
      return param[token];
    });
  }

  var requestData = $.getJSON('data.json').done(function(productData) {
    var requestProductTemplate = $.get('product-template.html').done(function(productTemplateHtml) {

      function TOMApp() {
        this.products = [];
      }

      TOMApp.prototype.getproducts = function() {
        var self = this;
        for (var i=0; i<productData.sales.length ; i++) {
          self.products.push(new productobj(productData.sales[i], i)  );
        }
      }

      TOMApp.prototype.updateproducthtml = function() {
        for(var i=0; i< this.products.length ; i++){
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

        var param = {
          image: self.photo,
          title: self.title,
          tagline: self.tagline,
          url: self.url,
          custom_class: self.custom_class
        }

        self.htmlview = _template(productTemplateHtml, param);
      }

      var page = new TOMApp();
      page.getproducts();
      page.updateproducthtml();
      page.updatedom();
    });
  });

}(this));
