import { Link } from "react-router-dom";
import { ArrowLeft, Compass } from "lucide-react";
import { Brand } from "../components/Brand";

export function NotFoundPage() {
  return (
    <div className="not-found">
      <Brand to="/" />
      <div className="not-found__body">
        <span className="not-found__icon">
          <Compass size={30} />
        </span>
        <p className="eyebrow">404 · Not on this table</p>
        <h1>
          That page
          <em> wandered off.</em>
        </h1>
        <p>
          Maybe the pot is still on the fire. Head back to the kitchen and start
          again.
        </p>
        <Link className="button button--clay" to="/">
          <ArrowLeft size={16} /> Back to ChopWeti
        </Link>
      </div>
    </div>
  );
}
