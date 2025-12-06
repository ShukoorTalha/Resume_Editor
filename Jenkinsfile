pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'resume-builder'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        CONTAINER_NAME = 'resume-builder'
        APP_PORT = '8080'
        DOCKER_REGISTRY = '' // Add your registry here if using Docker Hub/ECR/etc (e.g., 'docker.io/username')
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from repository...'
                checkout scm
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                script {
                    if (env.DOCKER_REGISTRY) {
                        docker.build("${env.DOCKER_REGISTRY}/${env.DOCKER_IMAGE}:${env.DOCKER_TAG}")
                        docker.build("${env.DOCKER_REGISTRY}/${env.DOCKER_IMAGE}:latest")
                    } else {
                        docker.build("${env.DOCKER_IMAGE}:${env.DOCKER_TAG}")
                        docker.build("${env.DOCKER_IMAGE}:latest")
                    }
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                echo 'Running tests...'
                script {
                    // Add your test commands here
                    // For example: sh 'npm test'
                    echo 'No tests configured yet - skipping'
                }
            }
        }
        
        stage('Stop Old Container') {
            steps {
                echo 'Stopping and removing old container if exists...'
                script {
                    sh """
                        docker stop ${env.CONTAINER_NAME} || true
                        docker rm ${env.CONTAINER_NAME} || true
                    """
                }
            }
        }
        
        stage('Deploy') {
            steps {
                echo 'Deploying new container...'
                script {
                    if (env.DOCKER_REGISTRY) {
                        sh """
                            docker run -d \
                                --name ${env.CONTAINER_NAME} \
                                --restart always \
                                -p ${env.APP_PORT}:80 \
                                -e NODE_ENV=production \
                                ${env.DOCKER_REGISTRY}/${env.DOCKER_IMAGE}:${env.DOCKER_TAG}
                        """
                    } else {
                        sh """
                            docker run -d \
                                --name ${env.CONTAINER_NAME} \
                                --restart always \
                                -p ${env.APP_PORT}:80 \
                                -e NODE_ENV=production \
                                ${env.DOCKER_IMAGE}:${env.DOCKER_TAG}
                        """
                    }
                }
            }
        }
        
        stage('Health Check') {
            steps {
                echo 'Performing health check...'
                script {
                    sleep(time: 10, unit: 'SECONDS')
                    sh """
                        curl -f http://localhost:${env.APP_PORT} || exit 1
                    """
                }
            }
        }
        
        stage('Push to Registry') {
            when {
                expression { env.DOCKER_REGISTRY != '' }
            }
            steps {
                echo 'Pushing image to registry...'
                script {
                    docker.withRegistry("https://${env.DOCKER_REGISTRY}", 'docker-credentials') {
                        docker.image("${env.DOCKER_REGISTRY}/${env.DOCKER_IMAGE}:${env.DOCKER_TAG}").push()
                        docker.image("${env.DOCKER_REGISTRY}/${env.DOCKER_IMAGE}:latest").push()
                    }
                }
            }
        }
        
        stage('Cleanup') {
            steps {
                echo 'Cleaning up old Docker images...'
                script {
                    sh """
                        docker image prune -f --filter "until=24h"
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo '✅ Pipeline completed successfully!'
            echo "Application deployed and running at: http://localhost:${env.APP_PORT}"
        }
        
        failure {
            echo '❌ Pipeline failed!'
            script {
                // Rollback to previous version if deployment fails
                sh """
                    docker stop ${env.CONTAINER_NAME} || true
                    docker rm ${env.CONTAINER_NAME} || true
                """
            }
        }
        
        always {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
    }
}
