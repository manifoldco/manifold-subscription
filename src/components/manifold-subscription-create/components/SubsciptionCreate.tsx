// import { h, FunctionalComponent } from '@stencil/core';
// import { PlanQuery } from '../../../types/graphql';
// import PlanCard from './PlanCard';

// interface SubsciptionCreateProps {
//   heading?: string;
//   data: PlanQuery;
//   subscribe: (e: UIEvent) => void;
//   cardRef: (el: HTMLDivElement) => void;
//   expiryRef: (el: HTMLDivElement) => void;
//   cvcRef: (el: HTMLDivElement) => void;
// }

// const SubsciptionCreate: FunctionalComponent<SubsciptionCreateProps> = props => {
//   const { heading, data, subscribe, cardRef, expiryRef, cvcRef } = props;
//   return [
//     <h1 class="ManifoldSubscriptionCreate__Heading">{heading || 'Purchase Subscription'}</h1>,
//     <PlanCard {...data.plan} />,
//     <form class="ManifoldSubscriptionCreate__Form" method="post" onSubmit={subscribe}>
//       <label class="ManifoldSubscriptionCreate__Field ManifoldSubscriptionCreate__CardField">
//         <span class="ManifoldSubscriptionCreate__Field__Label">Card Number</span>
//         <div ref={cardRef} />
//       </label>
//       <label class="ManifoldSubscriptionCreate__Field ManifoldSubscriptionCreate__ExpiryField">
//         <span class="ManifoldSubscriptionCreate__Field__Label">Expiry Date</span>
//         <div ref={expiryRef} />
//       </label>
//       <label class="ManifoldSubscriptionCreate__Field ManifoldSubscriptionCreate__CvcField">
//         <span class="ManifoldSubscriptionCreate__Field__Label">CVC</span>
//         <div ref={cvcRef} />
//       </label>
//       <button class="ManifoldSubscriptionCreate__Button" type="submit">
//         Subscribe with Card
//       </button>
//       <p class="ManifoldSubscriptionCreate__HelpText">
//         We charge for plan cost + usage at end of month
//       </p>
//       {/* <div ref={el => (this.paymentRequestButtonPlaceholder = el)} /> */}
//     </form>,
//   ];
// };

// export default SubsciptionCreate;
