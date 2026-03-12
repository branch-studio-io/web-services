import ContactForm from "@/components/ContactForm";
export default async function VrRulesLayout(props: {
  children: React.ReactNode;
}) {
  const { children } = props;

  return (
    <>
      {children}
      <section id="contact-form">
        <ContactForm />
      </section>
    </>
  );
}
