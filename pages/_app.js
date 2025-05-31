import Layout from "@/components/Layout";
import "@/styles/globals.css";
import { CartProvider } from "use-shopping-cart";

export default function App({ Component, pageProps }) {
  return (
    <CartProvider
      mode="payment"
      cartMode="client-only"
      stripe={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
      successUrl={`${process.env.NEXT_PUBLIC_URL}/success`}
      cancelUrl={`${process.env.NEXT_PUBLIC_URL}/?success=false`}
      currency="YPY"
      allowedCountries={["JP"]}
      shouldPersist={true}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </CartProvider>
  );
}
