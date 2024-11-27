import { PayPalButtons } from '@paypal/react-paypal-js';

const PayPalButton = ({ amount, onPaymentSuccess }) => {
  return (
    <PayPalButtons
      style={{ layout: 'vertical' , color: 'blue' , label: 'pay'}}
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: amount,
              },
            },
          ],
        });
      }}
      onApprove={(data, actions) => {
        return actions.order.capture().then((details) => {
          console.log('Payment Successful:', details);

          // Ensure the onPaymentSuccess function exists and is callable
          if (typeof onPaymentSuccess === 'function') {
            onPaymentSuccess(details); // Pass payment details for further processing
          } else {
            console.error("onPaymentSuccess is not provided or not a function.");
          }
        });
      }}
      onError={(err) => {
        console.error('PayPal Payment Error:', err);
        alert('Payment failed. Please try again or contact support.');
      }}
    />
  );
};

export default PayPalButton;
