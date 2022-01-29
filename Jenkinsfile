pipeline {
    agent any

    stages {
        stage('Clonar o repositório') {
            steps {
                git branch: 'main', url: 'https://github.com/tbadaro/testes-api-cy.git'
            }
        }

        stage('Instalar dependências') {
            steps {
               bat 'npm install' 
            }
        }
        
        stage('Subir o serverest via container') {
            steps {
               bat 'docker run -it -d --name Serverest -p 3000:3000 paulogoncalvesbh/serverest:latest ' 
            }
        }
        

        stage('Iniciar testes') {
            steps {
                sleep 60
                bat 'npm run cy:run'
            }
        }
        
        stage('Encerrar o container') {
            steps {
               bat 'docker rm -f Serverest' 
            }
        }
    }
    
}