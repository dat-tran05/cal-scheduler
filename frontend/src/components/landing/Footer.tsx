export default function Footer() {
  return (
    <footer className="py-8 bg-[#030303] border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center gap-2">
              <div className="bg-blue-500/20 p-1 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-400"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                  <line x1="16" x2="16" y1="2" y2="6"></line>
                  <line x1="8" x2="8" y1="2" y2="6"></line>
                  <line x1="3" x2="21" y1="10" y2="10"></line>
                </svg>
              </div>
              <span className="text-white font-semibold">Cal-Scheduler</span>
            </div>
          </div>
          <div className="text-white/40 text-sm">
            © {new Date().getFullYear()} Cal-Scheduler. All rights reserved.
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a
              href="#"
              className="text-white/40 hover:text-white transition-colors"
            >
              built by dat
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
