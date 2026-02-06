import Container from "@/components/Container";

export default async function HomePage() {
  return (
    <Container>
      <div className="prose">
        <h1 className="header-1">Header 1</h1>
        <h2 className="header-2">Header 2</h2>
        <h3 className="header-3">Header 3</h3>
        <h4 className="header-4">Header 4</h4>
        <p className="body-lg">Body LG</p>
        <p className="body-md">Body MD</p>
        <p className="body-sm">Body SM</p>
        <p className="body-xs">Body XS</p>
      </div>
    </Container>
  );
}
