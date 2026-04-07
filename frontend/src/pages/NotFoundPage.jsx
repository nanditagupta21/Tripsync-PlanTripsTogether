import { Link } from 'react-router-dom';
import { MapPin, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => (
  <div className="min-h-[80vh] flex items-center justify-center px-4">
    <div className="text-center animate-slide-up">
      <div className="text-8xl font-extrabold text-blue-100 mb-4">404</div>
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <MapPin size={36} className="text-blue-400" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
      <p className="text-gray-500 mb-8">Looks like this destination doesn't exist on our map!</p>
      <Link to="/" className="btn-primary inline-flex items-center gap-2">
        <ArrowLeft size={18} /> Back to Home
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
