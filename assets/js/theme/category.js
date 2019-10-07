import { hooks } from '@bigcommerce/stencil-utils';
import CatalogPage from './catalog';
import compareProducts from './global/compare-products';
import FacetedSearch from './common/faceted-search';

export default class Category extends CatalogPage {

    postData(url = ``, cartItems = {}) {
        return fetch(url, {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(cartItems)
        }).then(response => response.json());
    }

    onReady() {
        compareProducts(this.context.urls);

        if ($('#facetedSearch').length > 0) {
            this.initFacetedSearch();
        } else {
            this.onSortBySubmit = this.onSortBySubmit.bind(this);
            hooks.on('sortBy-submitted', this.onSortBySubmit);
        }

        $('#add3ToCart'). on('click', event => {
            event.isDefaultPrevented();

            this.postData(`/api/storefront/cart`, {
                lineItems: [
                  {
                    quantity: 1,
                    productId: 93,
                    optionSelections: [
                      {
                        optionId: 111,
                        optionValue: 7
                      },
                      {
                        optionId: 112,
                        optionValue: 95
                      }
                    ]
                  },
                  {
                    quantity: 1,
                    productId: 86
                  },
                  {
                    quantity:1,
                    productId: 103
                  }
                ]
              })
                .then(data => window.location = "/cart.php")
                .catch(error => console.error(error));
        })
    }

    initFacetedSearch() {
        const $productListingContainer = $('#product-listing-container');
        const $facetedSearchContainer = $('#faceted-search-container');
        const productsPerPage = this.context.categoryProductsPerPage;
        const requestOptions = {
            config: {
                category: {
                    shop_by_price: true,
                    products: {
                        limit: productsPerPage,
                    },
                },
            },
            template: {
                productListing: 'category/product-listing',
                sidebar: 'category/sidebar',
            },
            showMore: 'category/show-more',
        };

        this.facetedSearch = new FacetedSearch(requestOptions, (content) => {
            $productListingContainer.html(content.productListing);
            $facetedSearchContainer.html(content.sidebar);

            $('body').triggerHandler('compareReset');

            $('html, body').animate({
                scrollTop: 0,
            }, 100);
        });
    }

    
}
