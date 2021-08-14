FROM ${docker.share.image}:${alfresco.share.version}

ARG TOMCAT_DIR=/usr/local/tomcat

# Copy Dockerfile to avoid an error if no JARs exist
COPY Dockerfile extensions/*.jar $TOMCAT_DIR/webapps/share/WEB-INF/lib/

COPY activation_keys $TOMCAT_DIR/
RUN ls $TOMCAT_DIR/

# Copy Dockerfile to avoid an error if no AMPs exist
COPY Dockerfile extensions/amps_share $TOMCAT_DIR/amps_share/
RUN java -jar $TOMCAT_DIR/alfresco-mmt/alfresco-mmt*.jar install $TOMCAT_DIR/amps_share/pdf-toolkit-share-1.4.3-SNAPSHOT.amp $TOMCAT_DIR/webapps/share -nobackup -force
RUN java -jar $TOMCAT_DIR/alfresco-mmt/alfresco-mmt*.jar list $TOMCAT_DIR/webapps/share
# RUN ls $TOMCAT_DIR/amps_share/

COPY share-config-custom.xml $TOMCAT_DIR/shared/classes/alfresco/web-extension

COPY log4j.properties $TOMCAT_DIR/webapps/share/WEB-INF/classes
COPY hotswap-agent.properties $TOMCAT_DIR/webapps/share/WEB-INF/classes
# COPY postgresql-42.2.20.jar $TOMCAT_DIR/lib

# set environment variables
# ENV db.driver=org.postgresql.Driver
# ENV db.username=alfresco
# ENV db.password=alfresco
# ENV db.url=jdbc:postgresql://alfresco-custom-license-postgres:5432/alfresco

ENV ALFRESCO_CLIENT_NAME_ENV_VAR=Client_Awesome
ENV ALFRESCO_CLIENT_PUBLIC_KEY_DIR=$TOMCAT_DIR/client_keys/Client_Awesome.key.pub
ENV ALFRESCO_CLIENT_SOFTWARE_LICENSE_DIR=$TOMCAT_DIR/client_keys/gen_Client_Awesome.key