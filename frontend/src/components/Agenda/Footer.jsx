

export default function Footer() {
  return (
    <footer className="bg-gray-800/50 backdrop-blur-sm min-w-full shadow-sm py-6 text-center ">
      <div>
        {/* Redes Sociais 
        <div className="flex justify-end items-center space-x-4 px-4 py-4">
            <span>
              <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
                <img src="imagens/whatsapp1.png" alt="WhatsApp" className="inline-block w-6 h-6" />
              </a>
            </span>

            <span>
              <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
                <img src="imagens/instagram1.png" alt="Instagram" className="inline-block w-6 h-6" />
              </a>
            </span>
        </div>
        */}
        <div>
          <p className="font-semibold text-sm">
            &copy; BarberFlow - Todos os direitos reservados 
        </p>
        </div>
        
      </div>
    </footer>
  );
}