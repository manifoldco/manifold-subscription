import { createStore } from '@stencil/store';
import { Connection } from '@manifoldco/manifold-init-types/types/v0';
import { GraphqlError } from '@manifoldco/manifold-init-types/types/v0/graphqlFetch';
import { ProductPlansQuery, ProductPlansQueryVariables } from '../../types/graphql';
import productPlansQuery from './product-plans.graphql';

interface Store {
  connection?: Connection;
  productId?: string;
  isLoading: boolean;
  plans?: ProductPlansQuery['product']['plans']['edges'];
  errors?: GraphqlError[];
}

const { state, onChange } = createStore<Store>({
  isLoading: false,
});

onChange('productId', async (productId: string) => {
  if (!state.connection?.graphqlFetch) {
    return;
  }

  state.isLoading = true;

  const variables: ProductPlansQueryVariables = { productId };
  const { data, errors } = await state.connection.graphqlFetch<ProductPlansQuery>({
    query: productPlansQuery,
    variables,
  });

  state.errors = errors;

  if (data) {
    state.plans = data.product.plans.edges;
  }

  state.isLoading = false;
});

export default state;
