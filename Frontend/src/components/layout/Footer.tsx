import { Link } from "react-router-dom";
import { Heart, Facebook, Twitter, Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-primary">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                AfyaAlert
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Making medicine accessible and affordable for all Kenyans through 
              transparent pricing and availability tracking.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/search"
                  onClick={() => window.scrollTo(0, 0)}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Search Medicines
                </Link>
              </li>
              <li>
                <Link
                  to="/pharmacies"
                  onClick={() => window.scrollTo(0, 0)}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Partner Pharmacies
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  onClick={() => window.scrollTo(0, 0)}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  onClick={() => window.scrollTo(0, 0)}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="https://pharmacyboardkenya.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  PPB Verification
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Connect</h3>
            <div className="space-y-2">
              <a
                href="mailto:info@afyaalert.ke"
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>info@afyaalert.ke</span>
              </a>
              <div className="flex space-x-3 pt-2">
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 AfyaAlert. All rights reserved. Licensed by the Pharmacy and Poisons Board, Kenya.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;