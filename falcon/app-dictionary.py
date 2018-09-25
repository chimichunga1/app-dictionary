import falcon
import msgpack
import couchdb
from array import array
import json
import os
from faker import Faker
from deepdiff import DeepDiff  # For Deep Difference of 2 objects
from deepdiff import DeepSearch  # For finding if item exists in an object
import json
import jwt
couch = couchdb.Server()

db = couch['dictionary_search']
dbSearch = couch['job_spec']
dbSearchLog = couch['searchlogs']
dbLogin = couch['test_users']

############################################################################################################################
class Resource(object):
    def on_get(self, req, resp):

        doc=[]
        for item in db.view('searchdoc/searchview'):
            doc.append(item)
            resp.body = json.dumps(doc, ensure_ascii=False)
            resp.status = falcon.HTTP_200
            # print(item)
############################################################################################################################
class GetTokenData(object):
    def on_post(self, req, resp):
        
        get_token = req.headers['TOKEN']
        token_decoded = jwt.decode(get_token,verify=False)
        resp.body = json.dumps(token_decoded, ensure_ascii=False)
        resp.status = falcon.HTTP_200
      
            # print(item)
############################################################################################################################
class Login(object):


    # def process_request(self, req, resp):
    #     print(json.dumps(req.get_header['auth']))    

    def on_post(self, req, resp):
        encoded = req.media['auth']

        get_token = req.headers['TOKEN']
        token_decoded = jwt.decode(req.media['auth'],verify=False)
        resp.body = json.dumps(token_decoded, ensure_ascii=False)
        resp.status = falcon.HTTP_200
    def on_get(self, req, resp):     
        print('')
    # def on_get(self, req, resp):
        # print(req.headers['TOKEN'])

        # print(req.get_header('auth'))
        # resp.body = json.dumps(req.get_header('auth'), ensure_ascii=False)
        # resp.status = falcon.HTTP_200
        


        # encoded = req.media['auth']
        # req.hea
        # token_decoded = jwt.decode(req.media['auth'],verify=False)
        # resp.body = json.dumps(token_decoded, ensure_ascii=False)
        # resp.status = falcon.HTTP_200

    # def on_get(self, req, resp):
        # encoded = '1'
        # inasin = jwt.decode(encoded,verify=False)
        # resp.body = json.dumps(inasin, ensure_ascii=False)
        # resp.status = falcon.HTTP_200



############################################################################################################################


class credentials(object):
    def on_post(self, req, resp):

        # credentials = req.media
        # for item in db.view('searchdoc/searchview'):        

        

        doc_data = {}
        user_credentials = {}
        credentials = req.media
        document=dbLogin.get(credentials['email'])
        for item in dbLogin.view('userdoc/userview'):
            if credentials['email'] in item.value['email']:
                decoded = jwt.decode(item.value['token'], 'secret', algorithms=['HS256'])
                authorization_token = jwt.encode({'auth': 'admin'}, 'secret', algorithm='HS256')
                # print(json.dumps(decoded['secret_password']))
                if decoded['secret_password'] == credentials['password']:
                    user_credentials.update({'email':item.value['email'],'password':credentials['password'],'token':item.value['token']})
                    resp.body = json.dumps(user_credentials, ensure_ascii=False)
                    resp.status = falcon.HTTP_200


                # addpass = jwt.encode({'secret_password': 'remote1234'}, 'secret', algorithm='HS256')
                # doc_data.update({'email':'roselyn@remotestaff.com.ph'}) 
                # doc_data.update({'password':'remote1234'})   
                # doc_data.update({'token':addpass})
                # dbLogin.save(doc_data)
                # print(doc_data)


 
            # if credentials['email'] in item:
            #     print('yes')

        # if '_id' in document:
        #     document['_id'] = insert_data['_id']
        # db.save(document) 
        # print(document)





        # insert_data = req.media
        # document=db.get(insert_data['id'])
        # if '_id' in document:
        #     document['_id'] = insert_data['_id']
        # db.save(document)


############################################################################################################################







class getData(object):
    def on_post(self, req, resp):

        test_users = {}
        # print("Checking...")
        insert_data = req.media
        doc=[]
        doc_syn = []
        for item in dbSearch.view('jobspecdoc/jobspecview'):
            if insert_data['comment'].lower() in item.value['job_title'].lower():
                doc.append(item.value['job_title'])
        for item_dict in db.view('searchdoc/searchview'):
            if insert_data['comment'].lower() == item_dict.value['job_title'].lower():
                doc_syn=item_dict.value['synonymous']
        for item in dbSearch.view('jobspecdoc/jobspecview'):
            counter=0
            while(counter<len(doc_syn)):
                if doc_syn[counter].lower() == item.value['job_title'].lower():
                    doc.append(doc_syn[counter])
                counter=counter+1
        if not doc:
            doc.append('No Result Found')
        # print(doc)                
        resp.body = json.dumps(doc, ensure_ascii=False)
        resp.status = falcon.HTTP_200
############################################################################################################################
class logSearch(object):
    def on_post(self, req, resp):

        insert_data = req.media
        dbSearchLog.save(insert_data)

        doc=[]
        doc.append(insert_data)
        resp.body = json.dumps(doc, ensure_ascii=False)
        resp.status = falcon.HTTP_200
############################################################################################################################
class getDelete(object):
    def on_post(self, req, resp):

  
        insert_data = req.media
        # print(insert_data['value']['_id'])
        document=db.get(insert_data['value']['_id'])
        if 'status' in document:
 
            document['status'] = "deleted"

            
        db.save(document) #save database
############################################################################################################################
class UpdateJobTitle(object):
    def on_post(self, req, resp):

    
        insert_data = req.media
        document=db.get(insert_data['id'])
        # document=db.get(insert_data['id'])
        # print('========')
        # print(document['_id'])
        # print('====')
        # print(insert_data['_id'])
        if '_id' in document:
            document['_id'] = insert_data['_id']
        db.save(document) #save database 

############################################################################################################################
class UpdateSyno(object):
    def on_post(self, req, resp):

        insert_data = req.media
        counter_syno = 0
        for item_dict in db.view('searchdoc/searchview'):
            if insert_data['id'] == item_dict['value']['_id']:
                for test in item_dict['value']['synonymous']:
                    if insert_data['CurrentSyno'] == item_dict['value']['synonymous'][counter_syno]:
                        # print(item_dict['value']['synonymous'][counter_syno])
                        doc1=db.get(insert_data['id'])
                        doc1['synonymous'][counter_syno] = insert_data['NewSyno']
                        # print(doc1['synonymous'][counter_syno])
                        db.save(doc1)
                    counter_syno = counter_syno + 1 

############################################################################################################################
class UpdateKeywords(object):
    def on_post(self, req, resp):

        insert_data = req.media
        counter_keyword = 0
        for item_dict in db.view('searchdoc/searchview'):
            if insert_data['id'] == item_dict['value']['_id']:
                for test in item_dict['value']['misspell']:
                    if insert_data['CurrentKeyword'] == item_dict['value']['misspell'][counter_keyword]:
                        # print(item_dict['value']['keywords'][counter_keyword])
                        doc1=db.get(insert_data['id'])
                        doc1['misspell'][counter_keyword] = insert_data['NewKeyword']
                        # print(doc1['keywords'][counter_keyword])
                        db.save(doc1)
                    counter_keyword = counter_keyword + 1 

############################################################################################################################
class delSyno(object):
    def on_post(self, req, resp):

        insert_data = req.media
        counter_syno = 0
        # print(insert_data)
        for item_dict in db.view('searchdoc/searchview'):
            if insert_data['id'] == item_dict['value']['_id']:
                for test in item_dict['value']['synonymous']:
                    if insert_data['syno'] == item_dict['value']['synonymous'][counter_syno]:
                        # print(item_dict['value']['synonymous'][counter_syno])
                        doc1=db.get(insert_data['id'])
                        del doc1['synonymous'][counter_syno]
                        db.save(doc1)
                    counter_syno = counter_syno + 1 

############################################################################################################################
class delKeywords(object):
    def on_post(self, req, resp):
        
        insert_data = req.media
        counter_keywords = 0
        for item_dict in db.view('searchdoc/searchview'):
            if insert_data['id'] == item_dict['value']['_id']:
                for test in item_dict['value']['misspell']:
                    if insert_data['keywords'] == item_dict['value']['misspell'][counter_keywords]:
                        # print(item_dict['value']['misspell'][counter_keywords])
                        doc1=db.get(insert_data['id'])
                        del doc1['misspell'][counter_keywords]
                        db.save(doc1)
                    counter_keywords = counter_keywords + 1 


############################################################################################################################
class addSearch(object):
    def on_post(self, req, resp):
        doc = req.media
        get_name = (doc)
        counter_syno = 0
        counter_keyword = 0
        syno_list = []
        keyword_list=[]
        doc_data = {}
        for i in get_name[1]:
             get_syno = get_name[1][counter_syno]['name']
             syno_list.append(get_syno)
             counter_syno = counter_syno + 1
        for i in get_name[1]:
             get_keyword = get_name[0][counter_keyword]['name']
             keyword_list.append(get_keyword)

             counter_keyword = counter_keyword + 1
        doc_data.update({'_id':get_name[2].lower()}) 
        doc_data.update({'synonymous':syno_list}) 
        doc_data.update({'misspell':keyword_list}) 

        doc_data.update({'status':'active'})
        doc_data.update({'display':get_name[2]})
        db.save(doc_data)


############################################################################################################################
class addSynoKey(object):
    def on_post(self, req, resp):
        doc = req.media
        document=db.get(doc[2])
        LoopKeyword = doc
        counter_num = 0
        counter_keyword = 0
        if '_id' in document:
            for i in LoopKeyword[1]:
                get_keyword = doc[1][counter_num]['KeywordArray']
                document['misspell'].append(get_keyword)
                counter_num = counter_num + 1
            # print(document['misspell'])
            for i in LoopKeyword[0]:
                get_synonymous = doc[0][counter_keyword]['SynonymArray']
                document['synonymous'].append(get_synonymous)
                counter_keyword = counter_keyword + 1
            # print(document['synonymous'])


        db.save(document) #save database 



 


############################################################################################################################
class AddNewDict(object):
    def on_post(self, req, resp):
        import datetime
        doc = req.media
        doc_insert_data = {}
        date = datetime.datetime.now()
        date_now=[date.year,date.month,date.day,date.hour,date.minute,date.second,date.microsecond]
        # data_set = []
        create_history = []
        # data_set.append('_id: '+doc[0])
        # data_set.append('synonymous: '+json.dumps(doc[1]))
        # data_set.append('misspell: '+json.dumps(doc[2]))
        # data_set.append('suggestion: '+json.dumps(doc[3]))
        data_set={
        '_id':doc[0],
        'synonymous': doc[1],
        'misspell':doc[2],
        'suggestion': doc[3]
        }
        create_data = {'change':'+'+json.dumps(data_set),'changed_by':'RemoteStaff','date':date_now}
        create_history.append(create_data)
        doc_insert_data.update({'_id':doc[0].lower()})
        doc_insert_data.update({'display':doc[0]})
        doc_insert_data.update({'synonymous':doc[1]}) 
        doc_insert_data.update({'misspell':doc[2]}) 
        doc_insert_data.update({'suggestion':doc[3]})       
        doc_insert_data.update({'status':'active'})
        doc_insert_data.update({'history':create_history})
        db.save(doc_insert_data) #save database 



 

############################################################################################################################


class displaySearch(object):
    def on_get(self, req, resp):
        
        SearchResults = []
        for item in db.view('searchdoc/searchview'):
            SearchResults.append(item)
        # print(SearchResults)
        resp.body = json.dumps(SearchResults, ensure_ascii=False)
        resp.status = falcon.HTTP_200



###############################WILFRED WILFRED WILFRED WILFRED WILFRED WILFRED WILFRED WILFRED ##############################


class UpdateAll(object):
    def on_post(self, req, resp):
        import datetime
        date = datetime.datetime.now()
        date_now=[date.year,date.month,date.day,date.hour,date.minute,date.second,date.microsecond]
        data = req.media
        document=db.get(data["_id"])
        # print document,data
        # db.save(document)
        hist_syno = DeepDiff(document["synonymous"], data["synonymous"], ignore_order=True, report_repetition=True)
        hist_miss = DeepDiff(document["misspell"], data["misspell"], ignore_order=True, report_repetition=True)
        hist_suggestion = DeepDiff(document["suggestion"], data["suggestion"], ignore_order=True, report_repetition=True)    
        # print hist_syno
        ############### Synonymous
        for item in hist_miss:
            if item == "iterable_item_removed":
                removed_syno=[]
                for item in hist_miss["iterable_item_removed"]:
                    removed_syno.append(hist_miss["iterable_item_removed"][item])
                log={
                    "change":"-misspell:"+json.dumps(removed_syno),
                    "changed_by":"RemoteStaff",
                    "date":date_now
                }

                document["history"].insert(0,log)
            elif item == "iterable_item_added":
                added_syno=[]
                for item in hist_miss["iterable_item_added"]:
                    added_syno.append(hist_miss["iterable_item_added"][item])
                log={
                    "change":"+misspell:"+json.dumps(added_syno),
                    "changed_by":"RemoteStaff",
                    "date":date_now
                }
                document["history"].insert(0,log)
        ############### Misspell
        for item in hist_syno:
            if item == "iterable_item_removed":
                removed_syno=[]
                for item in hist_syno["iterable_item_removed"]:
                    removed_syno.append(hist_syno["iterable_item_removed"][item])
                log={
                    "change":"-synonymous:"+json.dumps(removed_syno),
                    "changed_by":"RemoteStaff",
                    "date":date_now
                }

                document["history"].insert(0,log)
            elif item == "iterable_item_added":
                added_syno=[]
                for item in hist_syno["iterable_item_added"]:
                    added_syno.append(hist_syno["iterable_item_added"][item])
                log={
                    "change":"+synonymous:"+json.dumps(added_syno),
                    "changed_by":"RemoteStaff",
                    "date":date_now
                }
                document["history"].insert(0,log)
        ############### Display
        ############### Suggestion
        for item in hist_suggestion:
            if item == "iterable_item_removed":
                removed_suggestion=[]
                for item in hist_suggestion["iterable_item_removed"]:
                    removed_suggestion.append(hist_suggestion["iterable_item_removed"][item])
                log={
                    "change":"-suggestion:"+json.dumps(removed_suggestion),
                    "changed_by":"RemoteStaff",
                    "date":date_now
                }

                document["history"].insert(0,log)
            elif item == "iterable_item_added":
                added_syno=[]
                for item in hist_suggestion["iterable_item_added"]:
                    added_syno.append(hist_suggestion["iterable_item_added"][item])
                log={
                    "change":"+suggestion:"+json.dumps(added_syno),
                    "changed_by":"RemoteStaff",
                    "date":date_now
                }
                document["history"].insert(0,log)
        ############### Display
        if document["display"]!=data["display"]:
            log={
                    "change":"-display:'"+document["display"]+"'",
                    "changed_by":"RemoteStaff",
                    "date":date_now
                }
            document["history"].insert(0,log)
            log={
                    "change":"+display:'"+data["display"]+"'",
                    "changed_by":"RemoteStaff",
                    "date":date_now
                }
            document["history"].insert(0,log)

        document.update({'display':data["display"]})
        document.update({'synonymous':data["synonymous"]})
        document.update({'misspell':data["misspell"]})
        document.update({'suggestion':data["suggestion"]})
        db.save(document)

############################################################################################################################
app = falcon.API()

############################################################################################################################

things = Resource()
Login = Login()
credentials = credentials()
GetTokenData = GetTokenData()
catchData = getData()
logSearch = logSearch()
addSearch = addSearch()
getDelete = getDelete()
delSyno = delSyno()
UpdateSyno = UpdateSyno()
UpdateJobTitle = UpdateJobTitle()
delKeywords = delKeywords()
UpdateKeywords = UpdateKeywords()
displaySearch = displaySearch()
addSynoKey = addSynoKey()
AddNewDict = AddNewDict()
############################################################################################################################
app.add_route('/falcon/app-dictionary/Login', Login)
app.add_route('/falcon/app-dictionary/AddNewDict', AddNewDict)
app.add_route('/falcon/app-dictionary/GetTokenData', GetTokenData)
app.add_route('/falcon/app-dictionary/credentials', credentials)
app.add_route('/falcon/app-dictionary/addSynoKey', addSynoKey)
app.add_route('/falcon/app-dictionary/displaySearch', displaySearch)
app.add_route('/falcon/app-dictionary/UpdateKeywords', UpdateKeywords)
app.add_route('/falcon/app-dictionary/delKeywords', delKeywords)
app.add_route('/falcon/app-dictionary/UpdateJobTitle', UpdateJobTitle)
app.add_route('/falcon/app-dictionary/UpdateSyno', UpdateSyno)
app.add_route('/falcon/app-dictionary/delSyno', delSyno)
app.add_route('/falcon/app-dictionary/getDelete', getDelete)
app.add_route('/falcon/app-dictionary/addSearch', addSearch)
app.add_route('/falcon/app-dictionary/logSearch', logSearch)
app.add_route('/falcon/app-dictionary/catchData', catchData)
app.add_route('/falcon/app-dictionary/things', things)
app.add_route('/falcon/app-dictionary/UpdateAll', UpdateAll())
############################################################################################################################