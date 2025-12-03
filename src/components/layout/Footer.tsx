import { Logo } from "../ui/Logo";

export default function Footer() {
  return (
    <footer className="bg-gray text-white py-12">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <div>
          <Logo size="md" showText={true} className="mb-4" />
          <p className="text-gray-400 text-sm">
            Simplificando a educação, uma prova por vez.
          </p>
        </div>

        {/* Produto */}
        <div>
          <h4 className="font-bold mb-4">Produto</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-white">Funcionalidades</a></li>
            <li><a href="#" className="hover:text-white">Planos</a></li>
            <li><a href="#" className="hover:text-white">Segurança</a></li>
          </ul>
        </div>

        {/* Suporte */}
        <div>
          <h4 className="font-bold mb-4">Suporte</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-white">Central de Ajuda</a></li>
            <li><a href="#" className="hover:text-white">Contato</a></li>
            <li><a href="#" className="hover:text-white">Status</a></li>
          </ul>
        </div>

        {/* Empresa */}
        <div>
          <h4 className="font-bold mb-4">Empresa</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-white">Sobre</a></li>
            <li><a href="#" className="hover:text-white">Blog</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-600 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-6 text-gray-400 text-sm">
            <a href="#" className="hover:text-white">Blog</a>
            <a href="#" className="hover:text-white">Carreiras</a>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 Corrija+. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  </footer>
  );
}