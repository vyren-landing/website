export default function Footer() {
  return (
    <footer className="py-20 px-6 bg-black border-t border-gray-800">
      <div className="max-w-5xl mx-auto text-center">
        <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-6">
          Protocol Independence Statement
        </h3>

        <p className="text-gray-400 text-sm max-w-3xl mx-auto mb-10">
          The Vyren protocol operates independently of the founders and Vyren Labs.
          All core governance paths are immutable and AI-regulated.
        </p>

        <div className="flex justify-center space-x-6 text-gray-500 text-sm">
  <span>Vyren Labs</span>
  <span>•</span>
  <a
    href="https://x.com/vyrenio"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-gray-300 transition"
  >
    X
  </a>
  <span>•</span>
  <a
    href="https://www.linkedin.com/company/vyrenlabs"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-gray-300 transition"
  >
    LinkedIn
  </a>
  <span>•</span>
  <a
    href="https://medium.com/@vyren"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-gray-300 transition"
  >
    Medium
  </a>
</div>



        <p className="text-xs text-gray-600 mt-8">
          More coming soon.
        </p>
      </div>
    </footer>
  );
}
