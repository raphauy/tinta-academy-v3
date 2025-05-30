import { CouponDAO } from "@/services/coupon-services";
import { Body, Container, Button, Column, Head, Hr, Html, Img, Link, Preview, Row, Section, Text, Tailwind, Heading } from "@react-email/components"
import * as React from "react";

type Props = {
  buyerName: string;
  buyerEmail: string;
  paymentAmount: number;
  paymentMethod: string;
  orderNumber: string;
  coupon: CouponDAO | null
}

const baseUrl = process.env.APP_URL!

export default function NotifyPaymentEmail({ buyerName, buyerEmail, paymentAmount, paymentMethod, orderNumber, coupon }: Props) {
  const previewText = `Pago recibido`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src="https://res.cloudinary.com/dcy8vuzjb/image/upload/v1713885570/demo-store/248451668_2739383413037833_764397266421891032_n.jpg_i6wwz2.jpg"
                width="50"
                height="50"
                alt="Latidio"
                className="my-0 mx-auto rounded-full border"
              />
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              <strong>Pago recibido!</strong>
            </Heading>
            <Text className="text-black text-[14px] leading-[24px] text-center">
              <strong>{buyerName}</strong> (
              <Link
                href={`mailto:${buyerEmail}`}
                className="text-blue-600 no-underline"
              >
                {buyerEmail}
              </Link>
              ) ha realizado un pago vía <strong>{paymentMethod}</strong>
            </Text>
            <Text className="text-black text-[20px] leading-[24px] text-center mt-10 mb-10">
              Monto: <strong>$ {paymentAmount}</strong>
            </Text>
            {coupon && (
              <Text className="text-black text-[14px] leading-[24px] text-center mt-10 mb-5">
                Cupón: <strong>{coupon.code}</strong> (Descuento: {coupon.discount}%)
              </Text>
            )}
            <Text className="text-black text-[14px] leading-[24px] text-center mt-10 mb-5">
              Orden: <strong>{orderNumber}</strong>
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Link href={baseUrl + "/admin/orders"}
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                >
                Dashboard de Ventas en Tinta Academy
              </Link>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

NotifyPaymentEmail.PreviewProps = {
  store: {
    contactEmail: "soporte@uruguayenvinos.com",
    name: "Uruguay en Vinos",
    image: "https://res.cloudinary.com/dcy8vuzjb/image/upload/v1715110186/demo-store/uruguay_en_vinos_n9orku.png",
  },
  buyerName: "Alan",
  buyerEmail: "alan.turing@example.com",
  paymentAmount: 100,
  paymentMethod: "Transferencia bancaria",
  orderNumber: "UV#00000123",
  coupon: null
} as Props;
