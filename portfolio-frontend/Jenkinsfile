pipeline {
  agent any
  environment {
    DOCKERHUB_USER = 'romdhani01'
    IMAGE = "${DOCKERHUB_USER}/romdhani-void"
  }
  options { timestamps() }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Docker Build') {
      steps {
        script {
          // Branch + SHA tags
          def branch = env.BRANCH_NAME ?: 'local'
          def shortSha = sh(script: "git rev-parse --short=7 HEAD", returnStdout: true).trim()
          env.TAGS = "${IMAGE}:${branch},${IMAGE}:sha-${shortSha}"
          if (branch == 'main' || branch == 'master') {
            env.TAGS = "${env.TAGS},${IMAGE}:latest"
          }
        }
        sh """
          echo "Building with tags: ${TAGS}"
          docker build -t ${IMAGE}:${env.BRANCH_NAME} -t ${IMAGE}:sha-$(git rev-parse --short=7 HEAD) ${env.BRANCH_NAME in ['main','master'] ? "-t ${IMAGE}:latest" : ""} .
        """
      }
    }

    stage('Docker Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
          sh """
            echo "${DH_PASS}" | docker login -u "${DH_USER}" --password-stdin
            for tag in ${TAGS.replace(',', ' ')}; do docker push "$tag"; done
            docker logout
          """
        }
      }
    }
  }
  post {
    always {
      // optional cleanup on busy agents
      sh 'docker image prune -f || true'
    }
  }
}