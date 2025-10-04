pipeline {
  agent any
  tools { nodejs 'Node-20' }   // must match the name you created
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
    // ... other stages
  }
}
