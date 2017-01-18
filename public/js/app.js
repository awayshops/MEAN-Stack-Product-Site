angular.module("productsApp", ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "list.html",
                controller: "ListController",
                resolve: {
                    products: function(Products) {
                        return Products.getProducts();
                    }
                }
            })
            .when("/new/product", {
                controller: "NewProductController",
                templateUrl: "product-form.html"
            })
            .when("/product/:productId", {
                controller: "EditProductController",
                templateUrl: "product.html"
            })
            .otherwise({
                redirectTo: "/"
            })
    })
    .service("Products", function($http) {
        this.getProducts = function() {
            return $http.get("/products").
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding products.");
                });
        }
        this.createProduct = function(product) {
            return $http.post("/products", product).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error creating product.");
                });
        }
        this.getProduct = function(productId) {
            var url = "/products/" + productId;
            return $http.get(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding this product.");
                });
        }
        this.editProduct = function(product) {
            var url = "/products/" + product._id;
            console.log(product._id);
            return $http.put(url, product).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error editing this product.");
                    console.log(response);
                });
        }
        this.deleteProduct = function(productId) {
            var url = "/products/" + productId;
            return $http.delete(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error deleting this product.");
                    console.log(response);
                });
        }
    })
    .controller("ListController", function(products, $scope) {
        $scope.products = products.data;
    })
    .controller("NewProductController", function($scope, $location, Products) {
        $scope.back = function() {
            $location.path("#/");
        }

        $scope.saveProduct = function(product) {
            Products.createProduct(product).then(function(doc) {
                var productUrl = "/product/" + doc.data._id;
                $location.path(productUrl);
            }, function(response) {
                alert(response);
            });
        }
    })
    .controller("EditProductController", function($scope, $routeParams, Products) {
        Products.getProduct($routeParams.productId).then(function(doc) {
            $scope.product = doc.data;
        }, function(response) {
            alert(response);
        });

        $scope.toggleEdit = function() {
            $scope.editMode = true;
            $scope.productFormUrl = "product-form.html";
        }

        $scope.back = function() {
            $scope.editMode = false;
            $scope.productFormUrl = "";
        }

        $scope.saveProduct = function(product) {
            Products.editProduct(product);
            $scope.editMode = false;
            $scope.productFormUrl = "";
        }

        $scope.deleteProduct = function(productId) {
            Products.deleteProduct(productId);
        }
    });