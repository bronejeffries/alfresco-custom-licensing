package com.customlicense.filter;

public class LicenseVariables{

    public static String ALLOWED_USER_USERNAME = "admin";
    public static String NO_LICENSE_REDIRECT = "no-license-found";
    public static String EXPIRED_LICENSE_REDIRECT = "expired-license";
    public static String LICENSE_LIMIT_REACHED = "license_limit";
    public static String INVALID_SOFTWARE_LICENSE = "invalid-software-license";
    public static String INVALID_USER_LICENSE = "invalid-user-license";
    public static String SESSION_ATTRIBUTE_KEY_LICENSE_CHECKED = "_alf_LICENSE_CHECKED";
    public static String GET_USER_LICENSE_DETAILS_URL = "/api/custom/people/";

    public static String LICENSE_TYPE = "license_type";
    public static String LICENSE_LIMIT = "license_limit";
    public static String LICENSE_VALIDITY_SPAN = "license_span_in_days";
    public static String ATTACHED_LICENSE = "license_key";
    public static String USER_LICENSE_ACTIVATION_DATE = "license_activation_date";

    public static String LICENSE_ISSUER = "ISS:license_manager";
    public static String LICENSE_AUDIENCE_PREFIX = "AUD:";

    // public static String DATABASE_NAME="alfresco";
    // public static String DATABASE_USER = System.getenv("db.username");
    // public static String DATABASE_PASSWORD=System.getenv("db.password");

    //for myqsl
    // public static String DATABASE_PORT = "3306";
    // public static String DATABASE_DRIVER = "com.mysql.jdbc.Driver";
    // public static String DATABASE_URL = "jdbc:mysql://"+DATABASE_HOST+":"+DATABASE_PORT+"/"+DATABASE_NAME+"?useUnicode=yes&characterEncoding=UTF-8";
    

    //for psqsl
    // public static String DATABASE_PORT = "5432";
    // public static String DATABASE_DRIVER = System.getenv("db.driver");
    // public static String DATABASE_URL = System.getenv("db.url");

    public static String LICENCED_USER_SESSIONS_TABLE = "lc_user_licensed_sessions";
    public static String REDIRECT_TO_HOME_QUERY_PARAM = "next_home";
    public static String DO_LOGIN_SUFFIX = "dologin";
    
    // set to null if set through environment variable
    public static String CLIENT_NAME = null;
     
    public static String CLIENT_NAME_ENV_VAR = "ALFRESCO_CLIENT_NAME_ENV_VAR";

    public static String getClientName(){

        return CLIENT_NAME!=null?CLIENT_NAME:System.getenv(CLIENT_NAME_ENV_VAR);
  
    }

    // set to null if set through environment variable
    public static String CLIENT_PUBLIC_KEY_DIR = null;
    
    public static String CLIENT_PUBLIC_KEY_DIR_ENV_VAR = "ALFRESCO_CLIENT_PUBLIC_KEY_DIR";

    public static String getClientPublicKeyFile(){

        return CLIENT_PUBLIC_KEY_DIR!=null?CLIENT_PUBLIC_KEY_DIR:System.getenv(CLIENT_PUBLIC_KEY_DIR_ENV_VAR);

    }

    // set to null if set through environment variable
    public static String SOFTWARE_LICENSE_DIR = null;
    public static String SOFTWARE_LICENSE_DIR_ENV_VAR = "ALFRESCO_CLIENT_SOFTWARE_LICENSE_DIR";
    
    public static String getSoftwareLicenseFile(){
        return SOFTWARE_LICENSE_DIR!=null?SOFTWARE_LICENSE_DIR:System.getenv(SOFTWARE_LICENSE_DIR_ENV_VAR);
    }

    public static String PUBLIC_KEY_BEGIN = "-----BEGIN PUBLIC KEY-----";
    public static String PUBLIC_KEY_END = "-----END PUBLIC KEY-----";
    public static String SIGNING_ALGORITHM = "RSA";

}