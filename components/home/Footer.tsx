const Footer = () => {
  return (
    <footer className="py-8 md:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-6 md:gap-10">
          <div className="col-span-2 md:col-span-4">
            <h3 className="text-lg md:text-xl font-bold text-white mb-4">
              BeTheNation.Fun
            </h3>
            <p className="text-gray-400 text-xs md:text-sm max-w-xs">
              BeTheNation.Fun lets users trade GDP-based derivatives on the
              world&apos;s leading economies, with this proof-of-concept demo.
            </p>
          </div>

          {/* Links sections */}
          <div className="md:col-span-2">
            <div className="space-y-3">
              <a
                href="#"
                className="block text-xs md:text-sm text-gray-400 hover:text-white transition-colors"
              >
                About Us
              </a>
              <a
                href="#"
                className="block text-xs md:text-sm text-gray-400 hover:text-white transition-colors"
              >
                FAQ
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="space-y-3">
              <a
                href="#"
                className="block text-xs md:text-sm text-gray-400 hover:text-white transition-colors"
              >
                Twitter
              </a>
              <a
                href="#"
                className="block text-xs md:text-sm text-gray-400 hover:text-white transition-colors"
              >
                Instagram
              </a>
              <a
                href="#"
                className="block text-xs md:text-sm text-gray-400 hover:text-white transition-colors"
              >
                Telegram
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="space-y-3">
              <a
                href="#"
                className="block text-xs md:text-sm text-gray-400 hover:text-white transition-colors"
              >
                Contact Support
              </a>
              <a
                href="#"
                className="block text-xs md:text-sm text-gray-400 hover:text-white transition-colors"
              >
                Terms Of Service
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="space-y-3">
              <a
                href="#"
                className="block text-xs md:text-sm text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>

        {/* Copyright section */}
        <div className="mt-8 md:mt-12 pt-6 border-t border-gray-800/30 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-xs md:text-sm">
            BeTheNation.Fun © 2025
          </p>
          <p className="text-gray-500 text-xs md:text-sm mt-2 md:mt-0">
            All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
