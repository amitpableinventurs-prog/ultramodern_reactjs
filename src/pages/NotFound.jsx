import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';

export default function NotFound() {
  return (
    <section className="section not-found">
      <Seo title="Page not found | UltraModern Technologies" description="The page you are looking for could not be found." noindex />
      <div className="container narrow center">
        <span className="nf-code">404</span>
        <h1>We couldn’t find that page</h1>
        <p className="lead">It may have moved during our website upgrade. Try one of these instead:</p>
        <div className="btn-row center">
          <Link to="/" className="btn btn-primary">Go home</Link>
          <Link to="/services" className="btn btn-outline">Our services</Link>
          <Link to="/portfolio" className="btn btn-outline">Portfolio</Link>
          <Link to="/contact" className="btn btn-outline">Contact us</Link>
        </div>
      </div>
    </section>
  );
}
