export default function Footer() {
  return (
    <footer className="py-24 px-6 bg-black border-t border-gray-900">
      <div className="max-w-5xl mx-auto text-center">
        <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-8">
          Protocol Independence Statement
        </h3>

        <p className="text-sm text-gray-400 max-w-3xl mx-auto leading-relaxed mb-14">
          The Vyren protocol operates independently of the founders and Vyren Labs.
          All core governance paths are immutable and AI-regulated.
        </p>

        <div className="flex justify-center items-center space-x-6 text-gray-500 text-sm">
          <span>Vyren Labs</span>
          <span className="opacity-40">•</span>

          <a
            href="https://x.com/vyrenio"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition"
          >
            X
          </a>

          <span className="opacity-40">•</span>

          <a
            href="https://www.linkedin.com/company/vyrenlabs"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition"
          >
            LinkedIn
          </a>

          <span className="opacity-40">•</span>

          <a
            href="https://medium.com/@vyren"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition"
          >
            Medium
          </a>
        </div>

        <p className="text-xs text-gray-600 mt-12 max-w-3xl mx-auto">
          Vyren is not a product launch and not a fundraising site.
          It defines a system designed to operate under constraint.
        </p>
      </div>
    </footer>
  );
}
