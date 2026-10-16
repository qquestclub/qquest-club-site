import Link from "next/link";

export default function NotFound() {
  return (
    <article>
      <h1>Page not found</h1>
      <p className="lead">This experiment collapsed. The page you wanted is not here.</p>
      <p>
        <Link className="button" href="/">
          Back to the home page
        </Link>
      </p>
    </article>
  );
}
