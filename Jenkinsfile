
pipeline {
  agent any
    
  stages {

    stage('Set environment') {
      steps {
        script {
          def environment = 'staging'
          if (env.GIT_BRANCH != 'origin/master') {
            environment = env.GIT_BRANCH.split("/")[1]
          }
          env.ENVIRONMENT_NAME = environment  

          env.DOCKER_IMAGE = 'contentgroup/smart-launcher'
          env.DOCKER_LABEL = 'latest'
          if (env.ENVIRONMENT_NAME == 'develop') {
            env.DOCKER_LABEL = 'develop'
          }

          env.DOCKER_NAME = "launcher_sandbox_${env.ENVIRONMENT_NAME}"
          env.SANDBOX_HOST = "launcher-${env.ENVIRONMENT_NAME}.sandbox"

          println("Environment: ${env.ENVIRONMENT_NAME}");
          println("Docker Image: ${env.DOCKER_IMAGE}");
          println("Docker Label: ${env.DOCKER_LABEL}");
          println("Docker Name: ${env.DOCKER_NAME}");
          println("Sandbox Host: ${env.SANDBOX_HOST}");

        }
      }
    }

    stage('Deploy Smart-on-FHIR Launcher') {
      when {
        expression { env.ENVIRONMENT_NAME == 'staging' || env.ENVIRONMENT_NAME == 'develop' }
      }
      steps {
        script {
            def remote = [:]
            remote.name = "fhir.alphora.com"
            remote.host = "fhir.alphora.com"
            remote.allowAnyHosts = true
            withCredentials([sshUserPrivateKey(credentialsId: '7d85c306-eb39-4445-ae15-bfeb99f34b33', keyFileVariable: 'identity', passphraseVariable: '', usernameVariable: 'userName')]) {
                remote.user = userName
                remote.identityFile = identity
                sshCommand remote: remote, command: "uptime; docker container stop ${env.DOCKER_NAME}; docker container rm ${env.DOCKER_NAME}; docker pull ${env.DOCKER_IMAGE}:${env.DOCKER_LABEL}; docker run -d --name ${env.DOCKER_NAME} --label traefik.frontend.entryPoints=http,https --label traefik.frontend.rule=Host:${env.SANDBOX_HOST}.alphora.com -e FHIR_SERVER_R4='https://cds4cpm-${env.ENVIRONMENT_NAME}.sandbox.alphora.com/cqf-ruler-r4/fhir' -e FHIR_SERVER_R3='https://cds4cpm-${env.ENVIRONMENT_NAME}.sandbox.alphora.com/cqf-ruler-r4/fhir' -e FHIR_SERVER_R2='https://cds4cpm-${env.ENVIRONMENT_NAME}.sandbox.alphora.com/cqf-ruler-r4/fhir' -e BASE_URL='https://${env.SANDBOX_HOST}.alphora.com' ${env.DOCKER_IMAGE}:${env.DOCKER_LABEL}"
            }
        }
      }
    }
  }
}