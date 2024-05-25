import "../../app/globals.css";


export default function CadastroLayout({
  children, // will be a page or nested layout
  components,
}: {
  children: React.ReactNode;
  components: never;
}) {
  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
      {children}
    </section>
  );
}
