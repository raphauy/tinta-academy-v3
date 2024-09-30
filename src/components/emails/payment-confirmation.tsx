import { BankDataDAO } from "@/services/bankdata-services";
import { Body, Column, Container, Head, Heading, Html, Img, Link, Preview, Row, Section, Tailwind, Text } from "@react-email/components";

interface Props {
  buyerName: string
  courseName: string
}

export default function WelcomeToTintaAcademy({ buyerName, courseName }: Props) {

  const baseUrl = process.env.APP_URL

  return (
    <Html>
      <Head />
      <Preview>Compraste {courseName}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] p-[20px] max-w-[700px]">
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
              <strong>¡Compraste {courseName}!</strong>
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hola <strong>{buyerName}</strong>, 
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              ¡Qué alegría tenerte con nosotros en Tinta Academy! 🎉
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Ya estás adentro de un viaje único que te va a llevar a conocer nuevos horizontes junto a un grupo exclusivo de entusiastas y profesionales como vos. En Tinta Academy creemos en el poder transformador del conocimiento y traemos una formación de alta calidad con perspectiva global para que sigas explorando y expandiendo tu pasión por la cultura del vino. 
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Conoce al equipo de Tinta Academy que te acompañará en esta aventura:
            </Text>
            <Section>
              <Row>
                <Column align="left">
                  <Img
                    src="https://academy.tinta.wine/gabi.jpeg"
                    width="50"
                    height="50"
                    alt="Gabi Zimmer"
                    className="rounded-full border"
                  />
                </Column>
                <Column>
                  <Text className="text-black text-[14px] leading-[24px] pl-3">
                    Gabi Zimmer, sommelier, comunicadora referente en el mundo del vino en Uruguay y diplomada en WSET, es quien lidera nuestra academia y quien dictará los cursos de formación.
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column align="left">
                  <Img
                    src="https://academy.tinta.wine/camila.jpeg"
                    width="50"
                    height="50"
                    alt="Gabi Zimmer"
                    className="rounded-full border"
                  />
                </Column>
                <Column>
                  <Text className="text-black text-[14px] leading-[24px] pl-3">
                    Camila Arocena, licenciada en comunicación e incipiente entusiasta de la cultura del vino, es quien lidera la gestión y la comunicación de la academia asegurando de que cada detalle de tu experiencia en Tinta Academy sea impecable.
                  </Text>
                </Column>
              </Row>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              Queremos que sepas que estamos aquí para acompañarte en cada paso de esta experiencia. Si tenés alguna duda o consulta, no dudes en contactarnos. Podés comunicarte con nosotras a través de:                
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              <span className="font-bold ml-5">▪️ WhatsApp:</span> <Link href="https://wa.me/59892265737" className="text-blue-500 underline">+598 92265737</Link>
              <br />
              <span className="font-bold ml-5">▪️ Correo electrónico:</span> <Link href="mailto:academy@tinta.wine" className="text-blue-500 underline">academy@tinta.wine</Link>
              <br />
              <span className="font-bold ml-5">▪️ Instagram:</span> <Link href="https://www.instagram.com/tinta.wine" className="text-blue-500 underline">@tinta.wine</Link>
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Estamos emocionadas de comenzar esta aventura juntos. ¡Nos vemos pronto!
            </Text>
            <Text className="text-black text-[14px] leading-[24px] font-bold">
              El equipo de Tinta Academy
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

WelcomeToTintaAcademy.PreviewProps = {
  buyerName: "Alan",
  courseName: "WSET Level 1 Award in Wines"
} as Props;

