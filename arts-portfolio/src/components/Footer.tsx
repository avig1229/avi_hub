export default function Footer() {
    return (
        <footer className="p-6 mt-12 text-sm text-gray-500 flex justify-between items-end">
            <div>
                <p>&copy; {new Date().getFullYear()} Arts in Digital Realm</p>
            </div>
            <div className="text-right">
                <p>Designed & Built with Next.js + Sanity</p>
            </div>
        </footer>
    );
}
