import type { Schema, Attribute } from '@strapi/strapi';

export interface ProductAssignedProduct extends Schema.Component {
  collectionName: 'comps_prod_assigned_prods';
  info: {
    displayName: 'Assigned Product';
    icon: 'cube';
  };
  attributes: {
    product: Attribute.Relation<
      'product.assigned-product',
      'oneToOne',
      'api::product.product'
    >;
    quantity: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'product.assigned-product': ProductAssignedProduct;
    }
  }
}
