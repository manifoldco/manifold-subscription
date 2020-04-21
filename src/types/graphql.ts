export type Maybe<T> = T;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  ProfileIdentity: any;
  Time: any;
};

export type BooleanConfiguredFeature = ConfiguredFeature & {
   __typename?: 'BooleanConfiguredFeature';
  label: Scalars['String'];
  value: Scalars['Boolean'];
};

export enum CalculationType {
  Prorate = 'PRORATE',
  UsageTier = 'USAGE_TIER'
}

export type Category = Node & {
   __typename?: 'Category';
  id: Scalars['ID'];
  label: Scalars['String'];
  displayName: Scalars['String'];
  icon: Maybe<Scalars['String']>;
  products: ProductConnection;
};


export type CategoryProductsArgs = {
  first: Scalars['Int'];
  after: Maybe<Scalars['String']>;
  orderBy: Maybe<ProductOrderBy>;
};

export type CategoryConnection = {
   __typename?: 'CategoryConnection';
  edges: Array<CategoryEdge>;
  pageInfo: PageInfo;
};

export type CategoryEdge = {
   __typename?: 'CategoryEdge';
  node: Category;
  cursor: Scalars['String'];
};

export type CategoryOrderBy = {
  field: CategoryOrderByField;
  direction: OrderByDirection;
};

export enum CategoryOrderByField {
  DisplayName = 'DISPLAY_NAME'
}

export enum ChargeTime {
  PostPaid = 'POST_PAID'
}

export type ConfigurableFeaturesOrderBy = {
  field: ConfigurableFeaturesOrderByField;
  direction: OrderByDirection;
};

export enum ConfigurableFeaturesOrderByField {
  Label = 'LABEL',
  DisplayName = 'DISPLAY_NAME'
}

export type ConfiguredFeature = {
  label: Scalars['String'];
};

export type ConfiguredFeatureConnection = {
   __typename?: 'ConfiguredFeatureConnection';
  pageInfo: PageInfo;
  edges: Array<ConfiguredFeatureEdge>;
};

export type ConfiguredFeatureEdge = {
   __typename?: 'ConfiguredFeatureEdge';
  cursor: Scalars['String'];
  node: ConfiguredFeature;
};

export type ConfiguredFeatureInput = {
  value: Scalars['String'];
  label: Scalars['String'];
};

export type CreateProfileAuthTokenInput = {
  profileId: Scalars['ProfileIdentity'];
};

export type CreateProfileAuthTokenPayload = {
   __typename?: 'CreateProfileAuthTokenPayload';
  data: Maybe<ProfileAuthToken>;
};

export type CreateResourceInput = {
  label: Scalars['String'];
  displayName: Maybe<Scalars['String']>;
  ownerId: Maybe<Scalars['ID']>;
  owner: Maybe<Scalars['ProfileIdentity']>;
  productId: Scalars['ID'];
  planId: Scalars['ID'];
  regionId: Scalars['ID'];
  configuredFeatures: Maybe<Array<ConfiguredFeatureInput>>;
};

export type CreateResourcePayload = {
   __typename?: 'CreateResourcePayload';
  data: Resource;
};

export type CreateSubscriptionAgreementInput = {
  owner: Maybe<Scalars['ProfileIdentity']>;
  planId: Scalars['ID'];
  configuredFeatures: Maybe<Array<ConfiguredFeatureInput>>;
};

export type CreateSubscriptionAgreementPayload = {
   __typename?: 'CreateSubscriptionAgreementPayload';
  data: SubscriptionAgreement;
};

export type Credential = {
   __typename?: 'Credential';
  key: Scalars['String'];
  value: Scalars['String'];
};

export type CredentialConnection = {
   __typename?: 'CredentialConnection';
  pageInfo: PageInfo;
  edges: Array<CredentialEdge>;
};

export type CredentialEdge = {
   __typename?: 'CredentialEdge';
  cursor: Scalars['String'];
  node: Maybe<Credential>;
};

export enum Currency {
  Usd = 'USD'
}

export type DeleteResourceInput = {
  resourceId: Scalars['ID'];
  ownerId: Maybe<Scalars['ID']>;
};

export type DeleteResourcePayload = {
   __typename?: 'DeleteResourcePayload';
  data: Resource;
};

export type DeleteSubscriptionAgreementInput = {
  id: Scalars['ID'];
};

export type DeleteSubscriptionAgreementPayload = {
   __typename?: 'DeleteSubscriptionAgreementPayload';
  data: SubscriptionAgreement;
};

export enum Duration {
  Monthly = 'MONTHLY'
}

export type FixedFeaturesOrderBy = {
  field: FixedFeaturesOrderByField;
  direction: OrderByDirection;
};

export enum FixedFeaturesOrderByField {
  DisplayName = 'DISPLAY_NAME'
}

export type Invoice = Node & {
   __typename?: 'Invoice';
  id: Scalars['ID'];
  cost: Scalars['Int'];
  currency: Currency;
  start: Scalars['Time'];
  end: Scalars['Time'];
  status: InvoiceStatus;
  revenueShare: RevenueShare;
  lineItems: Maybe<LineItemConnection>;
};


export type InvoiceLineItemsArgs = {
  first: Scalars['Int'];
  after: Maybe<Scalars['String']>;
};

export enum InvoiceAction {
  Attempt = 'ATTEMPT',
  Collected = 'COLLECTED'
}

export type InvoiceConnection = {
   __typename?: 'InvoiceConnection';
  pageInfo: PageInfo;
  edges: Array<InvoiceEdge>;
};

export type InvoiceEdge = {
   __typename?: 'InvoiceEdge';
  cursor: Scalars['String'];
  node: Maybe<Invoice>;
};

export type InvoiceOrderBy = {
  field: InvoiceOrderByField;
  direction: OrderByDirection;
};

export enum InvoiceOrderByField {
  End = 'END'
}

export type InvoicePreviewOrderBy = {
  field: InvoicePreviewOrderByField;
  direction: OrderByDirection;
};

export enum InvoicePreviewOrderByField {
  CreatedAt = 'CREATED_AT'
}

export enum InvoiceStatus {
  Preview = 'PREVIEW',
  Pending = 'PENDING',
  Paid = 'PAID'
}

export type InvoiceStatusInput = {
  id: Scalars['ID'];
  action: InvoiceAction;
  reason: Maybe<Scalars['String']>;
};

export enum IsDeleted {
  False = 'FALSE',
  True = 'TRUE',
  Maybe = 'MAYBE'
}

export type LineItem = Node & {
   __typename?: 'LineItem';
  id: Scalars['ID'];
  cost: Scalars['Int'];
  currency: Currency;
  duration: Duration;
  renewalPoint: RenewalPoint;
  chargeTime: ChargeTime;
  resource: Maybe<Resource>;
  product: Maybe<Product>;
  subLineItems: Maybe<SubLineItemConnection>;
};


export type LineItemSubLineItemsArgs = {
  first: Scalars['Int'];
  after: Maybe<Scalars['String']>;
};

export type LineItemConnection = {
   __typename?: 'LineItemConnection';
  pageInfo: PageInfo;
  edges: Array<LineItemEdge>;
};

export type LineItemEdge = {
   __typename?: 'LineItemEdge';
  cursor: Scalars['String'];
  node: Maybe<LineItem>;
};

export type MeteredFeaturesOrderBy = {
  field: MeteredFeaturesOrderByField;
  direction: OrderByDirection;
};

export enum MeteredFeaturesOrderByField {
  Label = 'LABEL',
  DisplayName = 'DISPLAY_NAME'
}

export type Mutation = {
   __typename?: 'Mutation';
  createResource: CreateResourcePayload;
  updateResource: UpdateResourcePayload;
  updateResourcePlan: UpdateResourcePlanPayload;
  deleteResource: DeleteResourcePayload;
  updateInvoiceStatus: Maybe<Invoice>;
  createProfileAuthToken: CreateProfileAuthTokenPayload;
  updateProfileSubject: UpdateProfileSubjectPayload;
  updateProfileState: UpdateProfileStatePayload;
  createSubscription: CreateSubscriptionAgreementPayload;
  updateSubscription: UpdateSubscriptionAgreementPayload;
  deleteSubscription: DeleteSubscriptionAgreementPayload;
};


export type MutationCreateResourceArgs = {
  input: CreateResourceInput;
};


export type MutationUpdateResourceArgs = {
  input: UpdateResourceInput;
};


export type MutationUpdateResourcePlanArgs = {
  input: UpdateResourcePlanInput;
};


export type MutationDeleteResourceArgs = {
  input: DeleteResourceInput;
};


export type MutationUpdateInvoiceStatusArgs = {
  input: InvoiceStatusInput;
};


export type MutationCreateProfileAuthTokenArgs = {
  input: CreateProfileAuthTokenInput;
};


export type MutationUpdateProfileSubjectArgs = {
  input: UpdateProfileSubjectInput;
};


export type MutationUpdateProfileStateArgs = {
  input: UpdateProfileStateInput;
};


export type MutationCreateSubscriptionArgs = {
  input: CreateSubscriptionAgreementInput;
};


export type MutationUpdateSubscriptionArgs = {
  input: UpdateSubscriptionAgreementInput;
};


export type MutationDeleteSubscriptionArgs = {
  input: DeleteSubscriptionAgreementInput;
};

export type Node = {
  id: Scalars['ID'];
};

export type NumberConfiguredFeature = ConfiguredFeature & {
   __typename?: 'NumberConfiguredFeature';
  label: Scalars['String'];
  value: Scalars['Int'];
};

export enum OrderByDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type PageInfo = {
   __typename?: 'PageInfo';
  startCursor: Maybe<Scalars['String']>;
  endCursor: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
};

export type Plan = Node & {
   __typename?: 'Plan';
  id: Scalars['ID'];
  displayName: Scalars['String'];
  label: Scalars['String'];
  product: Maybe<Product>;
  state: PlanState;
  fixedFeatures: Maybe<PlanFixedFeatureConnection>;
  meteredFeatures: Maybe<PlanMeteredFeatureConnection>;
  configurableFeatures: Maybe<PlanConfigurableFeatureConnection>;
  cost: Scalars['Int'];
  free: Scalars['Boolean'];
  regions: Maybe<RegionConnection>;
  resizableTo: Maybe<PlanConnection>;
};


export type PlanFixedFeaturesArgs = {
  first: Scalars['Int'];
  after: Maybe<Scalars['String']>;
  orderBy: Maybe<FixedFeaturesOrderBy>;
};


export type PlanMeteredFeaturesArgs = {
  first: Scalars['Int'];
  after: Maybe<Scalars['String']>;
  orderBy: Maybe<MeteredFeaturesOrderBy>;
};


export type PlanConfigurableFeaturesArgs = {
  first: Scalars['Int'];
  after: Maybe<Scalars['String']>;
  orderBy: Maybe<ConfigurableFeaturesOrderBy>;
};


export type PlanRegionsArgs = {
  first: Scalars['Int'];
  after: Maybe<Scalars['String']>;
  orderBy: Maybe<RegionsOrderBy>;
};


export type PlanResizableToArgs = {
  first: Scalars['Int'];
  after: Maybe<Scalars['String']>;
  orderBy: Maybe<PlanOrderBy>;
};

export type PlanConfigurableFeature = Node & {
   __typename?: 'PlanConfigurableFeature';
  id: Scalars['ID'];
  label: Scalars['String'];
  displayName: Scalars['String'];
  upgradable: Scalars['Boolean'];
  downgradable: Scalars['Boolean'];
  type: PlanFeatureType;
  /** @deprecated Deprecated in favor of plan.configurableFeatures.featureOptions */
  options: Maybe<Array<PlanFixedFeature>>;
  featureOptions: Maybe<Array<PlanConfigurableFeatureOption>>;
  numericDetails: Maybe<PlanConfigurableFeatureNumericDetails>;
};

export type PlanConfigurableFeatureConnection = {
   __typename?: 'PlanConfigurableFeatureConnection';
  pageInfo: PageInfo;
  edges: Array<PlanConfigurableFeatureEdge>;
};

export type PlanConfigurableFeatureEdge = {
   __typename?: 'PlanConfigurableFeatureEdge';
  cursor: Scalars['String'];
  node: PlanConfigurableFeature;
};

export type PlanConfigurableFeatureNumericDetails = {
   __typename?: 'PlanConfigurableFeatureNumericDetails';
  increment: Scalars['Int'];
  min: Scalars['Int'];
  max: Scalars['Int'];
  unit: Scalars['String'];
  costTiers: Maybe<Array<PlanFeatureCostTier>>;
};

export type PlanConfigurableFeatureOption = {
   __typename?: 'PlanConfigurableFeatureOption';
  displayName: Scalars['String'];
  value: Scalars['String'];
  cost: Scalars['Int'];
};

export type PlanConnection = {
   __typename?: 'PlanConnection';
  edges: Array<PlanEdge>;
  pageInfo: PageInfo;
};

export type PlanEdge = {
   __typename?: 'PlanEdge';
  node: Plan;
  cursor: Scalars['String'];
};

export type PlanFeatureCostTier = {
   __typename?: 'PlanFeatureCostTier';
  limit: Scalars['Int'];
  cost: Scalars['Int'];
};

export enum PlanFeatureType {
  Boolean = 'BOOLEAN',
  String = 'STRING',
  Number = 'NUMBER'
}

export type PlanFixedFeature = Node & {
   __typename?: 'PlanFixedFeature';
  id: Scalars['ID'];
  label: Scalars['String'];
  displayName: Scalars['String'];
  displayValue: Scalars['String'];
};

export type PlanFixedFeatureConnection = {
   __typename?: 'PlanFixedFeatureConnection';
  pageInfo: PageInfo;
  edges: Array<PlanFixedFeatureEdge>;
};

export type PlanFixedFeatureEdge = {
   __typename?: 'PlanFixedFeatureEdge';
  cursor: Scalars['String'];
  node: PlanFixedFeature;
};

export type PlanMeteredFeature = Node & {
   __typename?: 'PlanMeteredFeature';
  id: Scalars['ID'];
  label: Scalars['String'];
  displayName: Scalars['String'];
  numericDetails: PlanMeteredFeatureNumericDetails;
};

export type PlanMeteredFeatureConnection = {
   __typename?: 'PlanMeteredFeatureConnection';
  pageInfo: PageInfo;
  edges: Array<PlanMeteredFeatureEdge>;
};

export type PlanMeteredFeatureEdge = {
   __typename?: 'PlanMeteredFeatureEdge';
  cursor: Scalars['String'];
  node: PlanMeteredFeature;
};

export type PlanMeteredFeatureNumericDetails = {
   __typename?: 'PlanMeteredFeatureNumericDetails';
  unit: Scalars['String'];
  costTiers: Maybe<Array<PlanFeatureCostTier>>;
};

export type PlanOrderBy = {
  field: PlanOrderByField;
  direction: OrderByDirection;
};

export enum PlanOrderByField {
  Label = 'LABEL',
  DisplayName = 'DISPLAY_NAME',
  Cost = 'COST'
}

export enum PlanState {
  Hidden = 'HIDDEN',
  Available = 'AVAILABLE',
  Grandfathered = 'GRANDFATHERED',
  Unlisted = 'UNLISTED'
}

export type Platform = {
   __typename?: 'Platform';
  id: Scalars['ID'];
  domain: Scalars['String'];
};

export type Product = Node & {
   __typename?: 'Product';
  id: Scalars['ID'];
  displayName: Scalars['String'];
  label: Scalars['String'];
  logoUrl: Scalars['String'];
  provider: Maybe<Provider>;
  state: ProductState;
  tagline: Scalars['String'];
  supportEmail: Scalars['String'];
  documentationUrl: Scalars['String'];
  termsUrl: Scalars['String'];
  /** @deprecated Deprecated in favor of images */
  screenshots: Maybe<Array<ProductScreenshot>>;
  images: Maybe<Array<Scalars['String']>>;
  valueProps: Array<ValueProp>;
  valuePropsHtml: Scalars['String'];
  setupStepsHtml: Scalars['String'];
  plans: Maybe<PlanConnection>;
  /** @deprecated Categories are now their own types, moved the legacy categories into tags. See the Linked Categories for the product's catalog categories */
  categories: Array<Category>;
  tags: Array<Scalars['String']>;
  linkedCategories: Maybe<CategoryConnection>;
  settings: ProductSettings;
  listing: ProductListing;
  fixedFeatures: Maybe<ProductFixedFeatureConnection>;
  meteredFeatures: Maybe<ProductMeteredFeatureConnection>;
  configurableFeatures: Maybe<ProductConfigurableFeatureConnection>;
  version: Maybe<Scalars['Int']>;
  versionID: Maybe<Scalars['ID']>;
  published: Maybe<Scalars['Boolean']>;
};


export type ProductPlansArgs = {
  label: Maybe<Scalars['String']>;
  free: Maybe<Scalars['Boolean']>;
  first: Scalars['Int'];
  after: Maybe<Scalars['String']>;
  orderBy: Maybe<PlanOrderBy>;
};


export type ProductLinkedCategoriesArgs = {
  first: Scalars['Int'];
  after: Maybe<Scalars['String']>;
  orderBy: Maybe<CategoryOrderBy>;
};


export type ProductFixedFeaturesArgs = {
  first: Scalars['Int'];
  after: Maybe<Scalars['String']>;
  orderBy: Maybe<ProductFixedFeaturesOrderBy>;
};


export type ProductMeteredFeaturesArgs = {
  first: Scalars['Int'];
  after: Maybe<Scalars['String']>;
  orderBy: Maybe<ProductMeteredFeaturesOrderBy>;
};


export type ProductConfigurableFeaturesArgs = {
  first: Scalars['Int'];
  after: Maybe<Scalars['String']>;
  orderBy: Maybe<ProductConfigurableFeaturesOrderBy>;
};

export type ProductBooleanConfigurableFeature = ProductConfigurableFeature & {
   __typename?: 'ProductBooleanConfigurableFeature';
  label: Scalars['String'];
  displayName: Scalars['String'];
  type: ProductFeatureType;
  featureOptions: Maybe<Array<ProductConfigurableFeatureOption>>;
};

export type ProductConfigurableFeature = {
  label: Scalars['String'];
  displayName: Scalars['String'];
  type: ProductFeatureType;
};

export type ProductConfigurableFeatureConnection = {
   __typename?: 'ProductConfigurableFeatureConnection';
  pageInfo: PageInfo;
  edges: Array<ProductConfigurableFeatureEdge>;
};

export type ProductConfigurableFeatureEdge = {
   __typename?: 'ProductConfigurableFeatureEdge';
  cursor: Scalars['String'];
  node: ProductConfigurableFeature;
};

export type ProductConfigurableFeatureNumericDetails = {
   __typename?: 'ProductConfigurableFeatureNumericDetails';
  increment: Scalars['Int'];
  min: Scalars['Int'];
  max: Scalars['Int'];
  unit: Scalars['String'];
  costTiers: Array<ProductFeatureCostTier>;
};

export type ProductConfigurableFeatureNumericOptions = {
   __typename?: 'ProductConfigurableFeatureNumericOptions';
  label: Scalars['String'];
  displayName: Scalars['String'];
  numericDetails: ProductConfigurableFeatureNumericDetails;
};

export type ProductConfigurableFeatureOption = {
   __typename?: 'ProductConfigurableFeatureOption';
  value: Scalars['String'];
  displayName: Scalars['String'];
  cost: Scalars['Int'];
};

export type ProductConfigurableFeaturesOrderBy = {
  field: ProductConfigurableFeaturesOrderByField;
  direction: OrderByDirection;
};

export enum ProductConfigurableFeaturesOrderByField {
  Label = 'LABEL'
}

export type ProductConnection = {
   __typename?: 'ProductConnection';
  edges: Array<ProductEdge>;
  pageInfo: PageInfo;
};

export enum ProductCredentialsSupportType {
  None = 'NONE',
  Single = 'SINGLE',
  Multiple = 'MULTIPLE'
}

export type ProductEdge = {
   __typename?: 'ProductEdge';
  node: Product;
  cursor: Scalars['String'];
};

export type ProductFeatureCostTier = {
   __typename?: 'ProductFeatureCostTier';
  limit: Scalars['Int'];
  cost: Scalars['Int'];
};

export enum ProductFeatureType {
  Boolean = 'BOOLEAN',
  String = 'STRING',
  Number = 'NUMBER'
}

export type ProductFixedFeature = Node & {
   __typename?: 'ProductFixedFeature';
  id: Scalars['ID'];
  label: Scalars['String'];
  displayName: Scalars['String'];
  featureOptions: Maybe<Array<ProductFixedFeatureOption>>;
};

export type ProductFixedFeatureConnection = {
   __typename?: 'ProductFixedFeatureConnection';
  pageInfo: PageInfo;
  edges: Array<ProductFixedFeatureEdge>;
};

export type ProductFixedFeatureEdge = {
   __typename?: 'ProductFixedFeatureEdge';
  cursor: Scalars['String'];
  node: ProductFixedFeature;
};

export type ProductFixedFeatureOption = {
   __typename?: 'ProductFixedFeatureOption';
  value: Scalars['String'];
  displayName: Scalars['String'];
};

export type ProductFixedFeaturesOrderBy = {
  field: ProductFixedFeaturesOrderByField;
  direction: OrderByDirection;
};

export enum ProductFixedFeaturesOrderByField {
  Label = 'LABEL'
}

export type ProductListing = {
   __typename?: 'ProductListing';
  beta: Scalars['Boolean'];
  new: Scalars['Boolean'];
  featured: Scalars['Boolean'];
  comingSoon: Scalars['Boolean'];
};

export type ProductMeteredFeature = Node & {
   __typename?: 'ProductMeteredFeature';
  id: Scalars['ID'];
  label: Scalars['String'];
  displayName: Scalars['String'];
  numericOptions: Maybe<Array<ProductMeteredFeatureNumericOptions>>;
};

export type ProductMeteredFeatureConnection = {
   __typename?: 'ProductMeteredFeatureConnection';
  pageInfo: PageInfo;
  edges: Array<ProductMeteredFeatureEdge>;
};

export type ProductMeteredFeatureEdge = {
   __typename?: 'ProductMeteredFeatureEdge';
  cursor: Scalars['String'];
  node: ProductMeteredFeature;
};

export type ProductMeteredFeatureNumericDetails = {
   __typename?: 'ProductMeteredFeatureNumericDetails';
  unit: Scalars['String'];
  costTiers: Array<ProductFeatureCostTier>;
};

export type ProductMeteredFeatureNumericOptions = {
   __typename?: 'ProductMeteredFeatureNumericOptions';
  label: Scalars['String'];
  displayName: Scalars['String'];
  numericDetails: ProductMeteredFeatureNumericDetails;
};

export type ProductMeteredFeaturesOrderBy = {
  field: ProductMeteredFeaturesOrderByField;
  direction: OrderByDirection;
};

export enum ProductMeteredFeaturesOrderByField {
  Label = 'LABEL'
}

export type ProductNumberConfigurableFeature = ProductConfigurableFeature & {
   __typename?: 'ProductNumberConfigurableFeature';
  label: Scalars['String'];
  displayName: Scalars['String'];
  type: ProductFeatureType;
  numericOptions: Maybe<Array<ProductConfigurableFeatureNumericOptions>>;
};

export type ProductOrderBy = {
  field: ProductOrderByField;
  direction: OrderByDirection;
};

export enum ProductOrderByField {
  DisplayName = 'DISPLAY_NAME'
}

export type ProductScreenshot = {
   __typename?: 'ProductScreenshot';
  url: Scalars['String'];
  order: Scalars['Int'];
};

export type ProductSettings = {
   __typename?: 'ProductSettings';
  ssoSupported: Scalars['Boolean'];
  credentialsSupport: ProductCredentialsSupportType;
};

export enum ProductState {
  Available = 'AVAILABLE',
  Hidden = 'HIDDEN',
  Grandfathered = 'GRANDFATHERED',
  New = 'NEW',
  Upcoming = 'UPCOMING'
}

export type ProductStringConfigurableFeature = ProductConfigurableFeature & {
   __typename?: 'ProductStringConfigurableFeature';
  label: Scalars['String'];
  displayName: Scalars['String'];
  type: ProductFeatureType;
  featureOptions: Maybe<Array<ProductConfigurableFeatureOption>>;
};

export type Profile = {
   __typename?: 'Profile';
  id: Scalars['ID'];
  subject: Scalars['String'];
  stripeAccountID: Maybe<Scalars['String']>;
  stripeAccount: Maybe<StripeAccount>;
  stripeSetupIntentSecret: Maybe<Scalars['String']>;
  platform: Platform;
  invoicePreview: Maybe<Invoice>;
  invoices: Maybe<InvoiceConnection>;
  state: ProfileState;
  stateModifiedBy: ProfileStateModifier;
};


export type ProfileInvoicesArgs = {
  first: Scalars['Int'];
  after: Maybe<Scalars['String']>;
  orderBy: Maybe<InvoiceOrderBy>;
};

export type ProfileAuthToken = {
   __typename?: 'ProfileAuthToken';
  token: Scalars['String'];
};

export type ProfileConnection = {
   __typename?: 'ProfileConnection';
  pageInfo: PageInfo;
  edges: Array<ProfileEdge>;
};

export type ProfileEdge = {
   __typename?: 'ProfileEdge';
  cursor: Scalars['String'];
  node: Profile;
};


export enum ProfileState {
  Active = 'ACTIVE',
  Suspended = 'SUSPENDED',
  Deleted = 'DELETED'
}

export enum ProfileStateModifier {
  Manifold = 'MANIFOLD',
  Platform = 'PLATFORM'
}

export type Provider = Node & {
   __typename?: 'Provider';
  id: Scalars['ID'];
  label: Scalars['String'];
  displayName: Scalars['String'];
  logoUrl: Scalars['String'];
  url: Scalars['String'];
  supportEmail: Scalars['String'];
  products: Maybe<ProductConnection>;
};


export type ProviderProductsArgs = {
  first: Scalars['Int'];
  after: Maybe<Scalars['String']>;
  orderBy: Maybe<ProductOrderBy>;
};

export type Query = {
   __typename?: 'Query';
  provider: Maybe<Provider>;
  plan: Maybe<Plan>;
  product: Maybe<Product>;
  categories: CategoryConnection;
  category: Maybe<Category>;
  products: Maybe<ProductConnection>;
  profile: Profile;
  node: Node;
  resources: Maybe<ResourceConnection>;
  resource: Maybe<Resource>;
  profiles: Maybe<ProfileConnection>;
  invoice: Maybe<Invoice>;
  lineItem: Maybe<LineItem>;
  region: Maybe<Region>;
  regions: Maybe<RegionConnection>;
  subscription: Maybe<SubscriptionAgreement>;
  subscriptions: Maybe<SubscriptionAgreementConnection>;
};


export type QueryProviderArgs = {
  id: Maybe<Scalars['ID']>;
  label: Maybe<Scalars['String']>;
};


export type QueryPlanArgs = {
  id: Scalars['ID'];
};


export type QueryProductArgs = {
  id: Maybe<Scalars['ID']>;
  label: Maybe<Scalars['String']>;
  latest: Maybe<Scalars['Boolean']>;
};


export type QueryCategoriesArgs = {
  first: Scalars['Int'];
  after: Maybe<Scalars['String']>;
  orderBy: Maybe<CategoryOrderBy>;
};


export type QueryCategoryArgs = {
  id: Maybe<Scalars['ID']>;
  label: Maybe<Scalars['String']>;
};


export type QueryProductsArgs = {
  first: Scalars['Int'];
  after: Maybe<Scalars['String']>;
  orderBy: Maybe<ProductOrderBy>;
};


export type QueryProfileArgs = {
  id: Maybe<Scalars['ProfileIdentity']>;
};


export type QueryNodeArgs = {
  id: Scalars['ID'];
};


export type QueryResourcesArgs = {
  first: Scalars['Int'];
  after: Maybe<Scalars['String']>;
  owner: Maybe<Scalars['ProfileIdentity']>;
};


export type QueryResourceArgs = {
  id: Maybe<Scalars['ID']>;
  label: Maybe<Scalars['String']>;
  owner: Maybe<Scalars['ProfileIdentity']>;
  deleted: Maybe<IsDeleted>;
};


export type QueryProfilesArgs = {
  first: Scalars['Int'];
  after: Maybe<Scalars['String']>;
  withUsage: Maybe<WithUsage>;
};


export type QueryInvoiceArgs = {
  id: Scalars['ID'];
};


export type QueryLineItemArgs = {
  id: Scalars['ID'];
};


export type QueryRegionArgs = {
  id: Scalars['ID'];
};


export type QueryRegionsArgs = {
  first: Scalars['Int'];
  after: Maybe<Scalars['String']>;
  orderBy: Maybe<RegionsOrderBy>;
};


export type QuerySubscriptionArgs = {
  id: Scalars['ID'];
};


export type QuerySubscriptionsArgs = {
  first: Scalars['Int'];
  after: Maybe<Scalars['String']>;
  owner: Maybe<Scalars['ProfileIdentity']>;
};

export type Region = Node & {
   __typename?: 'Region';
  id: Scalars['ID'];
  displayName: Scalars['String'];
  platform: Scalars['String'];
  dataCenter: Scalars['String'];
};

export type RegionConnection = {
   __typename?: 'RegionConnection';
  edges: Array<RegionEdge>;
  pageInfo: PageInfo;
};

export type RegionEdge = {
   __typename?: 'RegionEdge';
  node: Region;
  cursor: Scalars['String'];
};

export type RegionsOrderBy = {
  field: RegionsOrderByField;
  direction: OrderByDirection;
};

export enum RegionsOrderByField {
  DisplayName = 'DISPLAY_NAME',
  Platform = 'PLATFORM',
  DataCenter = 'DATA_CENTER'
}

export enum RenewalPoint {
  Calendar = 'CALENDAR'
}

export type Resource = Node & {
   __typename?: 'Resource';
  id: Scalars['ID'];
  displayName: Scalars['String'];
  label: Scalars['String'];
  /** @deprecated Deprecated in favor of plan.product.settings.ssoSupported */
  ssoSupported: Scalars['Boolean'];
  ssoUrl: Maybe<Scalars['String']>;
  status: ResourceStatus;
  plan: Maybe<Plan>;
  region: Maybe<Region>;
  owner: Maybe<Profile>;
  createdAt: Maybe<Scalars['Time']>;
  configuredFeatures: Maybe<ConfiguredFeatureConnection>;
  credentials: Maybe<CredentialConnection>;
};


export type ResourceConfiguredFeaturesArgs = {
  first: Scalars['Int'];
  after: Maybe<Scalars['String']>;
};


export type ResourceCredentialsArgs = {
  first: Scalars['Int'];
  after: Maybe<Scalars['String']>;
};

export type ResourceConnection = {
   __typename?: 'ResourceConnection';
  pageInfo: PageInfo;
  edges: Array<ResourceEdge>;
};

export type ResourceEdge = {
   __typename?: 'ResourceEdge';
  cursor: Scalars['String'];
  node: Maybe<Resource>;
};

export type ResourceStatus = {
   __typename?: 'ResourceStatus';
  label: ResourceStatusLabel;
  percentDone: Scalars['Int'];
  message: Scalars['String'];
};

export enum ResourceStatusLabel {
  Available = 'AVAILABLE',
  Creating = 'CREATING',
  Updating = 'UPDATING',
  Deleting = 'DELETING',
  Deleted = 'DELETED',
  ErrorCreating = 'ERROR_CREATING',
  ErrorUpdating = 'ERROR_UPDATING',
  ErrorDeleting = 'ERROR_DELETING'
}

export type RevenueShare = {
   __typename?: 'RevenueShare';
  providers: Scalars['Int'];
  platform: Scalars['Int'];
  manifold: Scalars['Int'];
  fees: Scalars['Int'];
};

export type StringConfiguredFeature = ConfiguredFeature & {
   __typename?: 'StringConfiguredFeature';
  label: Scalars['String'];
  value: Scalars['String'];
};

export type StripeAccount = {
   __typename?: 'StripeAccount';
  id: Scalars['String'];
  business_name: Scalars['String'];
  business_type: StripeBusinessType;
  capabilities: StripeCapabilities;
  support_email: Scalars['String'];
};

export enum StripeBusinessType {
  Unknown = 'UNKNOWN',
  Individual = 'INDIVIDUAL',
  Company = 'COMPANY',
  NonProfit = 'NON_PROFIT',
  GovernmentEntity = 'GOVERNMENT_ENTITY'
}

export type StripeCapabilities = {
   __typename?: 'StripeCapabilities';
  card_payments: StripeCapabilityStatus;
  transfers: StripeCapabilityStatus;
};

export enum StripeCapabilityStatus {
  Unknown = 'UNKNOWN',
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Pending = 'PENDING'
}

export type SubLineItem = {
   __typename?: 'SubLineItem';
  cost: Scalars['Int'];
  currency: Currency;
  plan: Maybe<Plan>;
  item: Scalars['String'];
  description: Scalars['String'];
  calculationType: CalculationType;
  start: Scalars['Time'];
  end: Scalars['Time'];
};

export type SubLineItemConnection = {
   __typename?: 'SubLineItemConnection';
  pageInfo: PageInfo;
  edges: Array<SubLineItemEdge>;
};

export type SubLineItemEdge = {
   __typename?: 'SubLineItemEdge';
  cursor: Scalars['String'];
  node: Maybe<SubLineItem>;
};

export type SubscriptionAgreement = Node & {
   __typename?: 'SubscriptionAgreement';
  id: Scalars['ID'];
  plan: Maybe<Plan>;
  status: SubscriptionAgreementStatus;
  owner: Maybe<Profile>;
};

export type SubscriptionAgreementConnection = {
   __typename?: 'SubscriptionAgreementConnection';
  pageInfo: PageInfo;
  edges: Array<SubscriptionAgreementEdge>;
};

export type SubscriptionAgreementEdge = {
   __typename?: 'SubscriptionAgreementEdge';
  cursor: Scalars['String'];
  node: Maybe<SubscriptionAgreement>;
};

export type SubscriptionAgreementStatus = {
   __typename?: 'SubscriptionAgreementStatus';
  label: SubscriptionAgreementStatusLabel;
  percentDone: Scalars['Int'];
  message: Scalars['String'];
};

export enum SubscriptionAgreementStatusLabel {
  Available = 'AVAILABLE',
  Creating = 'CREATING',
  Updating = 'UPDATING',
  Deleting = 'DELETING',
  Deleted = 'DELETED',
  ErrorCreating = 'ERROR_CREATING',
  ErrorUpdating = 'ERROR_UPDATING',
  ErrorDeleting = 'ERROR_DELETING'
}


export type UpdateProfileStateInput = {
  subject: Scalars['String'];
  state: ProfileState;
};

export type UpdateProfileStatePayload = {
   __typename?: 'UpdateProfileStatePayload';
  data: Profile;
};

export type UpdateProfileSubjectInput = {
  subject: Scalars['String'];
  id: Scalars['ProfileIdentity'];
};

export type UpdateProfileSubjectPayload = {
   __typename?: 'UpdateProfileSubjectPayload';
  data: Profile;
};

export type UpdateResourceInput = {
  resourceId: Scalars['ID'];
  newLabel: Maybe<Scalars['String']>;
  newDisplayName: Maybe<Scalars['String']>;
};

export type UpdateResourcePayload = {
   __typename?: 'UpdateResourcePayload';
  data: Resource;
};

export type UpdateResourcePlanInput = {
  resourceId: Scalars['ID'];
  newPlanID: Scalars['ID'];
  ownerId: Maybe<Scalars['ID']>;
  configuredFeatures: Maybe<Array<ConfiguredFeatureInput>>;
};

export type UpdateResourcePlanPayload = {
   __typename?: 'UpdateResourcePlanPayload';
  data: Resource;
};

export type UpdateSubscriptionAgreementInput = {
  id: Scalars['ID'];
  newPlanID: Maybe<Scalars['ID']>;
  configuredFeatures: Maybe<Array<ConfiguredFeatureInput>>;
};

export type UpdateSubscriptionAgreementPayload = {
   __typename?: 'UpdateSubscriptionAgreementPayload';
  data: SubscriptionAgreement;
};

export type ValueProp = {
   __typename?: 'ValueProp';
  header: Scalars['String'];
  body: Scalars['String'];
};

export type WithUsage = {
  start: Maybe<Scalars['Time']>;
  end: Maybe<Scalars['Time']>;
};

export type CreateSubscriptionMutationVariables = {
  ownerId: Maybe<Scalars['ProfileIdentity']>;
  planId: Scalars['ID'];
  configuredFeatures: Maybe<Array<ConfiguredFeatureInput>>;
};


export type CreateSubscriptionMutation = (
  { __typename?: 'Mutation' }
  & { createSubscription: (
    { __typename?: 'CreateSubscriptionAgreementPayload' }
    & { data: (
      { __typename?: 'SubscriptionAgreement' }
      & Pick<SubscriptionAgreement, 'id'>
    ) }
  ) }
);

export type PlanFragment = (
  { __typename?: 'Plan' }
  & Pick<Plan, 'id' | 'displayName' | 'label' | 'free' | 'cost'>
  & { fixedFeatures: Maybe<(
    { __typename?: 'PlanFixedFeatureConnection' }
    & { edges: Array<(
      { __typename?: 'PlanFixedFeatureEdge' }
      & { node: (
        { __typename?: 'PlanFixedFeature' }
        & Pick<PlanFixedFeature, 'displayName' | 'displayValue' | 'label'>
      ) }
    )> }
  )>, meteredFeatures: Maybe<(
    { __typename?: 'PlanMeteredFeatureConnection' }
    & { edges: Array<(
      { __typename?: 'PlanMeteredFeatureEdge' }
      & { node: (
        { __typename?: 'PlanMeteredFeature' }
        & Pick<PlanMeteredFeature, 'label' | 'displayName'>
        & { numericDetails: (
          { __typename?: 'PlanMeteredFeatureNumericDetails' }
          & Pick<PlanMeteredFeatureNumericDetails, 'unit'>
          & { costTiers: Maybe<Array<(
            { __typename?: 'PlanFeatureCostTier' }
            & Pick<PlanFeatureCostTier, 'limit' | 'cost'>
          )>> }
        ) }
      ) }
    )> }
  )>, configurableFeatures: Maybe<(
    { __typename?: 'PlanConfigurableFeatureConnection' }
    & { edges: Array<(
      { __typename?: 'PlanConfigurableFeatureEdge' }
      & { node: (
        { __typename?: 'PlanConfigurableFeature' }
        & Pick<PlanConfigurableFeature, 'label' | 'displayName' | 'type' | 'upgradable' | 'downgradable'>
        & { featureOptions: Maybe<Array<(
          { __typename?: 'PlanConfigurableFeatureOption' }
          & Pick<PlanConfigurableFeatureOption, 'displayName' | 'value' | 'cost'>
        )>>, numericDetails: Maybe<(
          { __typename?: 'PlanConfigurableFeatureNumericDetails' }
          & Pick<PlanConfigurableFeatureNumericDetails, 'increment' | 'min' | 'max' | 'unit'>
          & { costTiers: Maybe<Array<(
            { __typename?: 'PlanFeatureCostTier' }
            & Pick<PlanFeatureCostTier, 'limit' | 'cost'>
          )>> }
        )> }
      ) }
    )> }
  )> }
);

export type PlanListQueryVariables = {
  productLabel: Scalars['String'];
};


export type PlanListQuery = (
  { __typename?: 'Query' }
  & { product: Maybe<(
    { __typename?: 'Product' }
    & Pick<Product, 'id' | 'displayName' | 'label' | 'logoUrl'>
    & { plans: Maybe<(
      { __typename?: 'PlanConnection' }
      & { edges: Array<(
        { __typename?: 'PlanEdge' }
        & { node: (
          { __typename?: 'Plan' }
          & PlanFragment
        ) }
      )> }
    )> }
  )> }
);

export type PlanQueryVariables = {
  planId: Scalars['ID'];
};


export type PlanQuery = (
  { __typename?: 'Query' }
  & { plan: Maybe<(
    { __typename?: 'Plan' }
    & Pick<Plan, 'displayName' | 'cost'>
    & { product: Maybe<(
      { __typename?: 'Product' }
      & Pick<Product, 'label'>
    )>, configurableFeatures: Maybe<(
      { __typename?: 'PlanConfigurableFeatureConnection' }
      & { edges: Array<(
        { __typename?: 'PlanConfigurableFeatureEdge' }
        & { node: (
          { __typename?: 'PlanConfigurableFeature' }
          & Pick<PlanConfigurableFeature, 'id'>
        ) }
      )> }
    )> }
  )>, profile: (
    { __typename?: 'Profile' }
    & Pick<Profile, 'stripeSetupIntentSecret'>
    & { stripeAccount: Maybe<(
      { __typename?: 'StripeAccount' }
      & Pick<StripeAccount, 'id'>
    )> }
  ) }
);

export type SubscriptionQueryVariables = {
  id: Scalars['ID'];
};


export type SubscriptionQuery = (
  { __typename?: 'Query' }
  & { subscription: Maybe<(
    { __typename?: 'SubscriptionAgreement' }
    & { status: (
      { __typename?: 'SubscriptionAgreementStatus' }
      & Pick<SubscriptionAgreementStatus, 'label' | 'percentDone' | 'message'>
    ), plan: Maybe<(
      { __typename?: 'Plan' }
      & Pick<Plan, 'id' | 'label' | 'displayName' | 'cost'>
      & { fixedFeatures: Maybe<(
        { __typename?: 'PlanFixedFeatureConnection' }
        & { edges: Array<(
          { __typename?: 'PlanFixedFeatureEdge' }
          & { node: (
            { __typename?: 'PlanFixedFeature' }
            & Pick<PlanFixedFeature, 'displayName' | 'displayValue' | 'label'>
          ) }
        )> }
      )>, meteredFeatures: Maybe<(
        { __typename?: 'PlanMeteredFeatureConnection' }
        & { edges: Array<(
          { __typename?: 'PlanMeteredFeatureEdge' }
          & { node: (
            { __typename?: 'PlanMeteredFeature' }
            & Pick<PlanMeteredFeature, 'label' | 'displayName'>
            & { numericDetails: (
              { __typename?: 'PlanMeteredFeatureNumericDetails' }
              & Pick<PlanMeteredFeatureNumericDetails, 'unit'>
              & { costTiers: Maybe<Array<(
                { __typename?: 'PlanFeatureCostTier' }
                & Pick<PlanFeatureCostTier, 'limit' | 'cost'>
              )>> }
            ) }
          ) }
        )> }
      )>, configurableFeatures: Maybe<(
        { __typename?: 'PlanConfigurableFeatureConnection' }
        & { edges: Array<(
          { __typename?: 'PlanConfigurableFeatureEdge' }
          & { node: (
            { __typename?: 'PlanConfigurableFeature' }
            & Pick<PlanConfigurableFeature, 'label' | 'displayName' | 'type' | 'upgradable' | 'downgradable'>
            & { featureOptions: Maybe<Array<(
              { __typename?: 'PlanConfigurableFeatureOption' }
              & Pick<PlanConfigurableFeatureOption, 'displayName' | 'value' | 'cost'>
            )>>, numericDetails: Maybe<(
              { __typename?: 'PlanConfigurableFeatureNumericDetails' }
              & Pick<PlanConfigurableFeatureNumericDetails, 'increment' | 'min' | 'max' | 'unit'>
              & { costTiers: Maybe<Array<(
                { __typename?: 'PlanFeatureCostTier' }
                & Pick<PlanFeatureCostTier, 'limit' | 'cost'>
              )>> }
            )> }
          ) }
        )> }
      )> }
    )> }
  )> }
);

export type SubscriptionsQueryVariables = {
  owner: Scalars['ProfileIdentity'];
};


export type SubscriptionsQuery = (
  { __typename?: 'Query' }
  & { subscriptions: Maybe<(
    { __typename?: 'SubscriptionAgreementConnection' }
    & { edges: Array<(
      { __typename?: 'SubscriptionAgreementEdge' }
      & { node: Maybe<(
        { __typename?: 'SubscriptionAgreement' }
        & { plan: Maybe<(
          { __typename?: 'Plan' }
          & Pick<Plan, 'displayName' | 'cost'>
          & { configurableFeatures: Maybe<(
            { __typename?: 'PlanConfigurableFeatureConnection' }
            & { edges: Array<(
              { __typename?: 'PlanConfigurableFeatureEdge' }
              & { node: (
                { __typename?: 'PlanConfigurableFeature' }
                & Pick<PlanConfigurableFeature, 'displayName'>
              ) }
            )> }
          )> }
        )> }
      )> }
    )> }
  )> }
);
