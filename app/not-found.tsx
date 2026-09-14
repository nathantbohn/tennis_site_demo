import { Container } from "@/components/Container";
import { ButtonLink } from "@/components/ButtonLink";
import { SectionHeading } from "@/components/SectionHeading";

export default function NotFound() {
  return (
    <Container className="py-24">
      <SectionHeading
        as="h1"
        eyebrow="Out"
        title="That page went long"
        lede="The link you followed does not exist any more. Head back to the home page, or call the club if you were looking for something specific."
      />
      <ButtonLink href="/" className="mt-8">
        Back to home
      </ButtonLink>
    </Container>
  );
}
