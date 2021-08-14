package com.customlicense.filter;

import java.io.IOException;
import java.sql.*;
import java.util.HashMap;
import java.lang.*;
import java.util.Base64;

import java.nio.file.Files;
import java.nio.file.Path;

import java.security.spec.InvalidKeySpecException;
import java.security.spec.X509EncodedKeySpec;
import java.security.PublicKey;
import java.security.NoSuchAlgorithmException;
import java.security.KeyFactory;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Claims;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.context.ApplicationContext;
import org.springframework.extensions.surf.RequestContextUtil;
import org.springframework.extensions.surf.site.AuthenticationUtil;
import org.springframework.extensions.surf.support.AlfrescoUserFactory;
import org.springframework.extensions.surf.util.URLEncoder;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.connector.Connector;
import org.springframework.extensions.webscripts.connector.ConnectorContext;
import org.springframework.extensions.webscripts.connector.ConnectorService;
import org.springframework.extensions.webscripts.connector.HttpMethod;
import org.springframework.extensions.webscripts.connector.Response;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.customlicense.filter.LicenseVariables;

// Unordered filter: chain until first user logged request arrives
@WebFilter(urlPatterns={"/page/*"})

public class LicenseFilter implements Filter {
	
	
	private ConnectorService connectorService;
	// private Connection database_connection;
	private HashMap<String, HttpSession> lc_m_user_sessions;

	@Override
	public void init(FilterConfig config) throws ServletException {

        ApplicationContext context = WebApplicationContextUtils.getRequiredWebApplicationContext(config.getServletContext());

        this.connectorService = (ConnectorService)context.getBean("connector.service");
		this.lc_m_user_sessions = new HashMap<String,HttpSession>();

		// try{

		// 	Class.forName(LicenseVariables.DATABASE_DRIVER);
		// 	this.database_connection = DriverManager.getConnection(LicenseVariables.DATABASE_URL,LicenseVariables.DATABASE_USER,LicenseVariables.DATABASE_PASSWORD);
		// 	System.out.println(java.time.LocalDate.now()+" SUCCESS: LICENSE MANAGER : database connection successful");

		// }catch(Exception e){

		// 	e.printStackTrace();
		// 	System.err.println(e.getMessage());

		// }

	}

	@Override
	public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws IOException, ServletException {
		
		HttpServletRequest request = (HttpServletRequest) req;
		HttpServletResponse response = (HttpServletResponse) resp;
        HttpSession session = request.getSession();
        
		String userId = AuthenticationUtil.getUserId(request);

		
		if(checkIfInActiveSession(userId,request,response)){

			return;
		
		}
		
		if(checkIfRedirectToHome(request,response)){
		
			return;
		
		}

		// check instance validity
		String pathInfo = request.getPathInfo();
		if(pathInfo!=null && !pathInfo.endsWith(LicenseVariables.DO_LOGIN_SUFFIX) 
			&& !pathInfo.endsWith(LicenseVariables.INVALID_SOFTWARE_LICENSE) 
			&& !ValidInstanceLicense()
		){
			response.sendRedirect(request.getContextPath()+"/page/proxy/alfresco/"+LicenseVariables.INVALID_SOFTWARE_LICENSE);
			return;
		}

		if (checkLicense(request, userId)) {
			
			try {
				
				RequestContextUtil.initRequestContext(WebApplicationContextUtils.getRequiredWebApplicationContext(request.getServletContext()), request, true);

				Connector conn = connectorService.getConnector(AlfrescoUserFactory.ALFRESCO_ENDPOINT_ID, userId, session);

				Response res = conn.call(LicenseVariables.GET_USER_LICENSE_DETAILS_URL + URLEncoder.encode(userId), new ConnectorContext(HttpMethod.GET));
				
				System.err.println("////// conn status here");
				System.err.println(res.getStatus().getCode());
				System.err.println("////// conn status here ////////");

				if (Status.STATUS_OK == res.getStatus().getCode()) {
					
					JSONObject userData = (JSONObject) new JSONParser().parse(res.getResponse());

					String user_license_key = userData.get(LicenseVariables.ATTACHED_LICENSE).toString();

					if(user_license_key.length()<1){
						
						response.sendRedirect(request.getContextPath()+"/page/proxy/alfresco/"+LicenseVariables.NO_LICENSE_REDIRECT);
						return ;

					}else{


						//////////// start license extra checks //////

						//// check if license is valid ///
						
						if(!ValidUserLicense(user_license_key)){
							
							response.sendRedirect(request.getContextPath()+"/page/proxy/alfresco/"+LicenseVariables.INVALID_USER_LICENSE);
							return;
						}

						///// check if license has not reached limit ////

						// if(LicenseLimitReached(userData.get(LicenseVariables.ATTACHED_LICENSE).toString(),userData.get(LicenseVariables.LICENSE_LIMIT).toString())){
							
						// 	response.sendRedirect(request.getContextPath()+"/page/proxy/alfresco/"+LicenseVariables.LICENSE_LIMIT_REACHED);
						
						// }

						///////////// end license extra checks //////

						//// request OK ////

							// RecordLicenseSessionUsage(userData.get(LicenseVariables.ATTACHED_LICENSE).toString(),userId);
							markSessionLicenseOkay(session,userId);
							chain.doFilter(req,resp);
						
						///// end OK /////

					}

					
				}else{

					response.sendRedirect(request.getContextPath()+"/page/proxy/alfresco/"+LicenseVariables.NO_LICENSE_REDIRECT);
					return ;
				}
	
			} catch (Exception e) {
				throw new ServletException(e);
			}
			
		} else {
			
			chain.doFilter(req, resp);
			
		}
		

	}

	private Boolean checkIfRedirectToHome(HttpServletRequest req, HttpServletResponse response ) throws IOException{

		String pathInfo = req.getPathInfo();
		if(pathInfo!=null && pathInfo.endsWith(LicenseVariables.REDIRECT_TO_HOME_QUERY_PARAM)){

			System.err.println("....Redirecting to home ...");
			HttpSession session = req.getSession();
			session.invalidate();
			response.sendRedirect(req.getContextPath()+"/page");
			return true;
		}
		return false;

	}

	private boolean checkIfInActiveSession(String user_id, HttpServletRequest req,HttpServletResponse response) throws IOException{

		String pathInfo = req.getPathInfo();
		if(pathInfo!=null && pathInfo.contains("proxy/alfresco") && !pathInfo.endsWith(LicenseVariables.DO_LOGIN_SUFFIX) && user_id==null){

			System.err.println("....Non authenticated user ...");
			response.sendRedirect(req.getContextPath()+"/page");
			return true;
		}
		return false;

	}
	
	private boolean checkLicense(HttpServletRequest request, String userId) {
		
        HttpSession session = request.getSession();
		String pathInfo = request.getPathInfo();
        
		boolean userLoggedIn = userId != null;
		
		boolean licensePreviouslyChecked = 
				session.getAttribute(LicenseVariables.SESSION_ATTRIBUTE_KEY_LICENSE_CHECKED) != null && 
				(Boolean) session.getAttribute(LicenseVariables.SESSION_ATTRIBUTE_KEY_LICENSE_CHECKED);
		
		
		boolean licensePageRequested = (pathInfo!=null) && (
					pathInfo.endsWith(LicenseVariables.NO_LICENSE_REDIRECT) ||
					pathInfo.endsWith(LicenseVariables.EXPIRED_LICENSE_REDIRECT) ||
					pathInfo.endsWith(LicenseVariables.INVALID_SOFTWARE_LICENSE) ||
					pathInfo.endsWith(LicenseVariables.INVALID_USER_LICENSE) ||
					pathInfo.endsWith(LicenseVariables.LICENSE_LIMIT_REACHED)
				);
		

		boolean allowed_user = userLoggedIn && userId.equals(LicenseVariables.ALLOWED_USER_USERNAME);

		// handle new user sessions
		if(!licensePreviouslyChecked){
			// handle existing session
				new Thread(new Runnable(){
					public void run(){
						HttpSession this_existing_session = lc_m_user_sessions.get(userId);
						if(this_existing_session!=null){

							try{
								this_existing_session.invalidate();
							}catch(Exception e){

							}

							lc_m_user_sessions.replace(userId,session);
						
						}

						if(allowed_user){
							markSessionLicenseOkay(session,userId);
						}
					}
				}).start();
		}


		return (userLoggedIn && !licensePreviouslyChecked && !licensePageRequested && !allowed_user);

	}

	private void markSessionLicenseOkay(HttpSession session,String user_id){

		session.setAttribute(LicenseVariables.SESSION_ATTRIBUTE_KEY_LICENSE_CHECKED, Boolean.TRUE);
		this.lc_m_user_sessions.put(user_id,session);
	
	}

	private Boolean ValidInstanceLicense(){
		System.out.println("////checking license///");
		System.out.println("Public Key path: "+LicenseVariables.getClientPublicKeyFile());
		System.out.println("LICENSE Key path: "+LicenseVariables.getSoftwareLicenseFile());
		try{

			String audience = Jwts.parserBuilder()
				.requireIssuer(LicenseVariables.LICENSE_ISSUER)
				.setSigningKey(readPublicKeyFromFile(LicenseVariables.getClientPublicKeyFile()))
				.build()
				.parseClaimsJws(readFileContent(LicenseVariables.getSoftwareLicenseFile()))
				.getBody()
				.getAudience();

			return audience.equals(LicenseVariables.getClientName());

		}catch(Exception e){
			System.out.println(e);
			return false;
		
		}
	}

	private Boolean ValidUserLicense(String license_token){
		try{

			Jwts.parserBuilder()
				.requireIssuer(LicenseVariables.LICENSE_ISSUER)
				.requireAudience(LicenseVariables.LICENSE_AUDIENCE_PREFIX+LicenseVariables.getClientName())
				.setSigningKey(readPublicKeyFromFile(LicenseVariables.getClientPublicKeyFile()))
				.build()
				.parseClaimsJws(license_token);
			
			return true;

		}catch(Exception e){

			return false;
		}

	}

	private String readFileContent(String file_name) throws IOException{
		Path filename = Path.of(file_name);
		String file_content = Files.readString(filename);
		return file_content;
	}

	private PublicKey readPublicKeyFromFile(String file_location) throws InvalidKeySpecException, NoSuchAlgorithmException, IOException{

		String public_key_content = readFileContent(file_location).replaceAll("\\n","").replace(LicenseVariables.PUBLIC_KEY_BEGIN,"").replace(LicenseVariables.PUBLIC_KEY_END,"");
		KeyFactory kf = KeyFactory.getInstance(LicenseVariables.SIGNING_ALGORITHM);
		X509EncodedKeySpec kEncodedKeySpec = new X509EncodedKeySpec(Base64.getDecoder().decode(public_key_content));

		PublicKey public_key = kf.generatePublic(kEncodedKeySpec);
		return public_key;
	}

	// private boolean LicenseIsValid(String activation_date, String span){
	// 	// todo compare activation date with current date
	// 	return true;
	// }

	// private boolean LicenseLimitReached(String License,String limit){
	// 	// todo get logged in users with licenses count
	// 	// todo compare count with limit;
	// 	return false;

	// }

	// private void RecordLicenseSessionUsage(String license,String user_id){
	// 	try{

	// 		createLicenseSessionTable();
	// 		this.database_connection.setAutoCommit(false);
	// 		Statement insert_stmt = this.database_connection.createStatement();
	// 		String insert_sql = "INSERT INTO "+LicenseVariables.LICENCED_USER_SESSIONS_TABLE+
	// 							" (license_key,used_by,used_on,active) "+
	// 							"VALUES ( '"+license +"', '" +user_id +"' , '"+java.time.LocalDate.now()+"' , 1 );";
			
	// 		System.err.println("...../////Save Session////.....");
	// 		System.err.println(insert_sql);
	// 		System.err.println("...../////Save Session////.....");

	// 		insert_stmt.executeUpdate(insert_sql);
	// 		insert_stmt.close();
	// 		this.database_connection.commit();
	// 		this.database_connection.close();

	// 	}catch(Exception e){
	// 		System.err.println( e.getClass().getName()+": "+ e.getMessage() );
	// 	}
		

	// }
	// private void createLicenseSessionTable(){
		
	// 	try{

	// 		Statement create_stmt = this.database_connection.createStatement();

	// 		String create_sql = "CREATE TABLE IF NOT EXISTS "+LicenseVariables.LICENCED_USER_SESSIONS_TABLE+
	// 							"( ID SERIAL PRIMARY KEY NOT NULL, "+
	// 							"license_key TEXT NOT NULL, "+
	// 							"used_by TEXT NOT NULL, "+
	// 							"used_on DATE NOT NULL, "+
	// 							"active INT NOT NULL )";

	// 		create_stmt.executeUpdate(create_sql);
	// 		create_stmt.close();

	// 	}catch(Exception e){

	// 		System.err.println( e.getClass().getName()+": "+ e.getMessage() );

	// 	}
	// }
	
	@Override
	public void destroy() {
		System.err.println("Calling destroy in filter");
	}
}