export default function Footer() {
    return (
        <footer className="absolute bottom-8 left-0 right-0 z-10 text-[0.8125rem] text-white/50 text-center">
            <a
                href="https://42berlin.de/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link no-underline font-medium"
            >
                42 Berlin
            </a>{" "}
            © Made by{" "}
            <a
                href="https://github.com/julesrb"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link no-underline font-medium"
            >
                Jules Bernard
            </a>
        </footer>
    );
}
