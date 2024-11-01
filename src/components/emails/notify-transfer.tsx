import { BankDataDAO } from "@/services/bankdata-services";
import { CouponDAO } from "@/services/coupon-services";
import { Body, Column, Container, Head, Heading, Html, Img, Link, Preview, Row, Section, Tailwind, Text } from "@react-email/components";

interface VercelInviteUserEmailProps {
  buyerName: string
  buyerEmail: string
  courseName: string
  paymentAmount: number
  paymentCurrency: string
  paymentMethod: string
  comment: string
  orderNumber: string
  coupon: CouponDAO | null
}

export default function NotifyTransferEmail({ buyerName, buyerEmail, courseName, paymentAmount, paymentCurrency, paymentMethod, comment, orderNumber, coupon }: VercelInviteUserEmailProps) {

  const baseUrl = process.env.APP_URL

  return (
    <Html>
      <Head />
      <Preview>Transferencia enviada!</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src="https://res.cloudinary.com/dcy8vuzjb/image/upload/v1713885570/demo-store/248451668_2739383413037833_764397266421891032_n.jpg_i6wwz2.jpg"
                width="50"
                height="50"
                alt="Tinta Academy"
                className="my-0 mx-auto rounded-full border"
              />
            </Section>
            <Heading className="text-blue-500 text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              <strong>Transferencia enviada!</strong>
            </Heading>
            <Text className="text-black text-[14px] leading-[24px] text-center">
              <strong>{buyerName}</strong> (
              <Link
                href={`mailto:${buyerEmail}`}
                className="text-blue-600 no-underline"
              >
                {buyerEmail}
              </Link>
              ) ha marcado como enviada una <strong>{paymentMethod}</strong> para comprar <strong>{courseName}</strong>.
            </Text>
            <Text className="text-black text-[14px] leading-[24px] text-center">
              El siguiente paso es verificar que el dinero haya llegado y marcar la orden como pagada en el dashboard de ventas.
            </Text>
            <Text className="text-black text-[20px] leading-[24px] text-center mt-10 mb-10">
              Monto: <strong>{paymentAmount} {paymentCurrency}</strong>
            </Text>
            {coupon && (
              <Text className="text-black text-[14px] leading-[24px] text-center mt-10 mb-5">
                Cupón: <strong>{coupon.code}</strong> (Descuento: {coupon.discount}%)
              </Text>
            )}
            <Text className="text-black text-[14px] leading-[24px] text-center mt-10 mb-5">
                Banco: <strong>{comment}</strong>
            </Text>
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

NotifyTransferEmail.PreviewProps = {
  buyerName: "Alan",
  buyerEmail: "alan.turing@example.com",
  courseName: "WSET Nivel 1",
  paymentAmount: 100,
  paymentMethod: "Transferencia bancaria",
  comment: "Itaú - Comentario de la transferencia",
  orderNumber: "#00000123",
} as VercelInviteUserEmailProps;

