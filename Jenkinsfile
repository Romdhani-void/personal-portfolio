pipeline {
  agent any
  tools { nodejs 'Node-20' }   // must exist in Manage Jenkins → Tools
  stages {
    stage('run frontend') {
      steps {
        sh '''
          corepack enable || true
          yarn --version || npm i -g yarn
          yarn install
          yarn build
        '''
      }
    }
    stage('run backend') {
      steps {
        sh 'echo "backend stage..."'
      }
    }
  }
}
