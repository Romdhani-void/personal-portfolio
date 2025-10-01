pipeline {
  agent any

  stages {
    stage("build") {
      steps {
        echo 'building the app...'
        sh 'echo "Quick check: listing files" && ls -l'
      }
    }

    stage("test") {
      steps {
        echo 'testing the app...'
        sh 'node -v || echo "Node.js not installed"'
      }
    }

    stage("deploy") {
      steps {
        echo 'deploying the app...'
        sh 'echo "Deployment step placeholder"'
      }
    }
  }
}
