function main()
{
   //
   // Get the person details
   //
   var MKP_DEPARTMENT = "{http://www.muk.com/model/people/1.0}department"
   var MKP_COLLEGE = "{http://www.muk.com/model/people/1.0}college"
   var MKP_FILENUMBER = "{http://www.muk.com/model/people/1.0}fileNumber"
   var MKP_SUPPORT_STAFF = "{http://www.muk.com/model/people/1.0}supportStaff"
   var MKP_LEAVE_DAYS = "{http://www.muk.com/model/people/1.0}annualleavedays"
   // var MKP_LEAVE_ROASTER_PERIOD_FROM = "{http://www.muk.com/model/people/1.0}leaveRoasterPeriodFrom"
   // var MKP_LEAVE_ROASTER_PERIOD_TO = "{http://www.muk.com/model/people/1.0}leaveRoasterPeriodTo"

   if ((json.isNull("userName")) || (json.get("userName").length() == 0)) 
   {
      status.setCode(status.STATUS_BAD_REQUEST, "User name missing when creating person");
      return;
   }
   
   if ((json.isNull("firstName")) || (json.get("firstName").length() == 0))
   {
      status.setCode(status.STATUS_BAD_REQUEST, "First name missing when creating person");
      return;
   }
   
   if ((json.isNull("email")) || (json.get("email").length() == 0))
   {
      status.setCode(status.STATUS_BAD_REQUEST, "Email missing when creating person");
      return;
   }
   
   var password = "password";
   if (json.has("password"))
   {
      password = json.get("password");
   }
   
   // Create the person with the supplied user name
   var userName = json.get("userName");
   var enableAccount = ((json.has("disableAccount") && json.get("disableAccount")) == false);
   var person = people.createPerson(userName, json.get("firstName"), json.get("lastName"), json.get("email"), password, enableAccount);
   
   // return error message if a person with that user name could not be created
   if (person === null)
   {
      status.setCode(status.STATUS_CONFLICT, "User name already exists: " + userName);
      return;
   }
   
   // assign values to the person's properties
   if (json.has("title"))
   {
      person.properties["title"] = json.get("title");
   }
   if (json.has("organisation"))
   {
      person.properties["organization"] = json.get("organisation");
   }
   if (json.has("jobtitle"))
   {
      person.properties["jobtitle"] = json.get("jobtitle");
   }
   // save custom fields
   if (json.has("department"))
   {
      person.properties[MKP_DEPARTMENT] = json.get("department");
   }

   if (json.has("college"))
   {
      person.properties[MKP_COLLEGE] = json.get("college");
   }

   if (json.has("fileNumber"))
   {
      person.properties[MKP_FILENUMBER] = json.get("fileNumber");
   }

   if (json.has("supportStaff"))
   {
      person.properties[MKP_SUPPORT_STAFF] = json.get("supportStaff");
   }

   if (json.has("annualleavedays"))
   {
      person.properties[MKP_LEAVE_DAYS] = json.get("annualleavedays");
   }
   // if (json.has("leaveRoasterPeriodFrom"))
   // {
   //    person.properties[MKP_LEAVE_ROASTER_PERIOD_FROM] = json.get("leaveRoasterPeriodFrom");
   // }
   // if (json.has("leaveRoasterPeriodTo"))
   // {
   //    person.properties[MKP_LEAVE_ROASTER_PERIOD_TO] = json.get("leaveRoasterPeriodTo");
   // }
   person.save();
   
   // set quota if any - note that only Admin can set this and will be ignored otherwise
   var quota = (json.has("quota") ? json.get("quota") : -1);
   people.setQuota(person, quota.toString());
   
   // apply groups if supplied - note that only Admin can successfully do this
   if (json.has("groups"))
   {
      var groups = json.get("groups");
      for (var index=0; index<groups.length(); index++)
      {
         var groupId = groups.getString(index);
         var group = people.getGroup(groupId);
         if (group != null)
         {
            people.addAuthority(group, person);
         }
      }
   }
   
   // Put the created person into the model
   model.person = person;
}

main();