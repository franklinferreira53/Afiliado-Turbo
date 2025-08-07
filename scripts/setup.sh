#!/bin/bash

# Setup script for Afiliado Turbo

echo "🚀 Configurando Afiliado Turbo..."

# Check if required tools are installed
check_requirements() {
    echo "📋 Verificando pré-requisitos..."
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js não encontrado. Instale Node.js 18+ primeiro."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo "❌ npm não encontrado. Instale npm primeiro."
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        echo "⚠️ Docker não encontrado. Recomendamos instalar Docker."
    fi
    
    echo "✅ Pré-requisitos verificados"
}

# Create environment file
setup_env() {
    echo "🔧 Configurando variáveis de ambiente..."
    
    if [ ! -f .env ]; then
        cp .env.example .env
        echo "✅ Arquivo .env criado. Configure suas chaves de API!"
    else
        echo "⚠️ Arquivo .env já existe"
    fi
}

# Install backend dependencies
install_backend() {
    echo "📦 Instalando dependências do backend..."
    cd backend
    npm install
    cd ..
    echo "✅ Backend configurado"
}

# Install frontend dependencies
install_frontend() {
    echo "📦 Instalando dependências do frontend..."
    cd frontend
    npm install
    cd ..
    echo "✅ Frontend configurado"
}

# Create uploads directory
create_directories() {
    echo "📁 Criando diretórios necessários..."
    mkdir -p uploads
    mkdir -p logs
    echo "✅ Diretórios criados"
}

# Main setup function
main() {
    echo "======================================"
    echo "🚀 AFILIADO TURBO - SETUP AUTOMÁTICO"
    echo "======================================"
    
    check_requirements
    setup_env
    create_directories
    install_backend
    install_frontend
    
    echo "======================================"
    echo "✅ Setup concluído com sucesso!"
    echo "======================================"
    echo ""
    echo "📖 Próximos passos:"
    echo "1. Configure suas chaves de API no arquivo .env"
    echo "2. Configure o banco PostgreSQL"
    echo "3. Execute: docker-compose up -d (recomendado)"
    echo "   OU execute separadamente:"
    echo "   - Backend: cd backend && npm run dev"
    echo "   - Frontend: cd frontend && npm start"
    echo ""
    echo "🌐 URLs:"
    echo "- Frontend: http://localhost:3001"
    echo "- Backend: http://localhost:3000"
    echo ""
    echo "📚 Documentação completa: README.md"
    echo "======================================"
}

# Run main function
main