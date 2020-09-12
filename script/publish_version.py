'''
Create on 2020.1.17
@author: 1210547224@qq.com

'''
from collections import OrderedDict
from urllib3 import encode_multipart_formdata
import time
import uuid
import os,sys
import http.client,urllib,hashlib
from html.parser import HTMLParser
from urllib.parse import quote,unquote
from bs4 import BeautifulSoup

g_account="zhoutengbo"
g_password="63d8c4be07910435c54bbec49bedcea3"

class ZenTao(HTMLParser):
	def __init__(self,account="",password=""):
		HTMLParser.__init__(self)
		self.account=account
		self.password=password
		self.verifyRand=""
		self.address="zentao.keensense.cn:28888"
		self.Cookie="lang=zh-cn; device=desktop; theme=default; storyPreProjectID=381; ajax_lastNext=on; preTaskID=404; preBranch=0; preProductID=2; from=product; preProjectID=384; moduleBrowseParam=0; productBrowseParam=0; projectTaskOrder=status%2Cid_desc; lastProject=381; lastProduct=13; selfClose=1; windowWidth=1165; windowHeight=986; zentaosid=32k7i7fq3hro20mptoao63s7o1"

	def login(self):
		#htmlparse = HTMLParser();
		conn = http.client.HTTPConnection(self.address)
		headers = {"Referer":"http://zentao.keensense.cn:28888/pro/my/","User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36","Origin":"http://zentao.keensense.cn:28888","Content-type": "application/x-www-form-urlencoded","Accept": "text/plain","Host":self.address,"Cookie":self.Cookie}
		conn.request("GET","/pro/user-login.html","",headers)
		r1 = conn.getresponse()
		bodyStr=r1.read().decode()
		html=BeautifulSoup(bodyStr,'html.parser')
		verifyRand=html.find_all('input',id="verifyRand")
		for v in verifyRand:
			self.verifyRand=v['value']

		
		if(self.verifyRand != ""):
			tmp=self.password+self.verifyRand
			self.password=hashlib.md5(tmp.encode("utf-8")).hexdigest()	
			params="account="+self.account+"&password="+self.password+"&passwordStrength=1&referer=%2Fpro%2F&verifyRand="+self.verifyRand
			headers = {"Referer":"http://zentao.keensense.cn:28888/pro/user-login.html","User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36","Origin":"http://zentao.keensense.cn:28888","Content-type": "application/x-www-form-urlencoded","Accept": "text/plain","Host":self.address,"Cookie":self.Cookie}
			conn.request("POST","/pro/user-login.html",params,headers)
			r1 = conn.getresponse()
			bodyStr=r1.read().decode()

			ret=bodyStr.find("location")
			if(ret > 0):
				conn.close()
				print ("login success!")
				return 0
			else:
				conn.close()
				print ("login fail")
				return -1
		conn.close()
		print ("login success")
		return 0

	def logout(self):
		conn = http.client.HTTPConnection(self.address)
		headers = {"Referer":"http://zentao.keensense.cn:28888/pro/build-create-381.html","User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36","Origin":"http://zentao.keensense.cn:28888","Content-type": "application/x-www-form-urlencoded","Accept": "text/plain","Host":self.address,"Cookie":self.Cookie}
		conn.request("GET","/pro/user-logout.html","",headers)
		r1 = conn.getresponse()
		conn.close()

	def createVersion(self,name,date,filePath,desc,scmPath="ssh://git@qianshitong.320.io:15959/lam/VideoObjectExtractionService.git",product="50",branch="56",builder="zhoutengbo"):
		boundary="----WebKitFormBoundaryKPjN0GYtWEjAni5F"
		uidStr=str(uuid.uuid4())
		uidStr=uidStr.replace("-","")
		conn = http.client.HTTPConnection(self.address)
		headers = {"Referer":"http://zentao.keensense.cn:28888/pro/build-create-381.html","User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36","Origin":"http://zentao.keensense.cn:28888","Content-type": "multipart/form-data; boundary="+boundary,"Accept": "text/plain","Host":self.address,"Cookie":self.Cookie}
		params = OrderedDict([("product", (None, product,'multipart/form-data')),("branch", (None, branch,'multipart/form-data')),("name", (None, name,'multipart/form-data')),("builder", (None, builder,'multipart/form-data')),("date", (None, date,'multipart/form-data')),("scmPath",(None,scmPath,'multipart/form-data')),("filePath",(None,filePath,'multipart/form-data')),("labels[]",(None,"",'multipart/form-data')),("files[]",(None,"",'multipart/form-data')),("desc",(None,desc,'multipart/form-data')),("uid",(None,uidStr,'multipart/form-data'))])
		#params = OrderedDict([("username", (None, '130533193203240022')),("password", (None, 'qwerqwer')),('captchaId', (None, 'img_captcha_7d96b3cd-f873-4c36-8986-584952e38f20')),('captchaWord', (None, 'rdh5')),('_csrf', (None, '200ea95d-90e9-4789-9e0b-435a6dd8b57b'))])

		m = encode_multipart_formdata(params, boundary=boundary)
		conn.request("POST","/pro/build-create-381.html",m[0],headers)
		r1 = conn.getresponse()

		print (r1.read().decode('utf-8'))

	def pushlishVersion(self,name,date,buildId,desc):
		boundary="----WebKitFormBoundaryKPjN0GYtWEjAni5F"
		uidStr=str(uuid.uuid4())
		uidStr=uidStr.replace("-","")
		conn = http.client.HTTPConnection(self.address)
		headers = {"Referer":"http://zentao.keensense.cn:28888/pro/release-create-50-0.html","User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36","Origin":"http://zentao.keensense.cn:28888","Content-type": "multipart/form-data; boundary="+boundary,"Accept": "text/plain","Host":self.address,"Cookie":self.Cookie}
		params = OrderedDict([("name", (None, name,'multipart/form-data')),("build", (None, buildId,'multipart/form-data')),("date", (None, date,'multipart/form-data')),("desc",(None,desc,'multipart/form-data')),("labels[]",(None,"",'multipart/form-data')),("files[]",(None,"",'multipart/form-data')),("uid",(None,uidStr,'multipart/form-data'))])
		m = encode_multipart_formdata(params, boundary=boundary)
		conn.request("POST","/pro/release-create-50-0.html",m[0],headers)
		r1 = conn.getresponse()
		print (r1.read().decode('utf-8'))
		

	def getbuildId(self,name):
		conn = http.client.HTTPConnection(self.address)
		headers = {"Referer":"http://zentao.keensense.cn:28888/pro/release-browse-50.html","User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36","Origin":"http://zentao.keensense.cn:28888","Accept": "text/html","Host":self.address,"Cookie":self.Cookie}
		conn.request("GET","/pro/release-create-50-0.html","",headers)
		r1 = conn.getresponse()
		bodyStr=r1.read().decode()
		html=BeautifulSoup(bodyStr,'html.parser')
		buidSelect=html.find_all('option')
		#option=buidSelect.find('option')
		str2=name.lower()
		for x in buidSelect:
			str1=x['data-keys'].lower()
			
			if str1.find(str2) > 0:
				return int(x['value'])
		return -1

	def generalAppVersionDsec(self,appSrcPath,cur_tag):
		cmd="cd "+appSrcPath+" && git tag|grep \"v3.1\"|sort -V|awk -F'.' '{if (NF == 4) print $0}'|grep -B 1 \"" + cur_tag + "\"|head -n 1"
		before_tag=os.popen(cmd).read().strip('\n')
		print ("before_tag:",before_tag,"cur_tag",cur_tag)
		cmd="git log --pretty=oneline ^"+before_tag+" "+cur_tag
		print (cmd)
		commitDesc=os.popen(cmd).read().strip('\n')
		print (commitDesc)
		return commitDesc

if __name__ == '__main__':
	if(len(sys.argv) < 5):
		exit("uncompatable args");
	#print ("name:",sys.argv[1])
	#print ("date:",sys.argv[2])
	#print ("filePath:",sys.argv[3])

	desc=unquote(sys.argv[4],'utf-8')
	#for var in range(4,len(sys.argv)):
	#	desc+=" "+sys.argv[var]
	#print ("desc:",desc)
	client = ZenTao(g_account,g_password)
	client.login()
	client.createVersion(sys.argv[1],sys.argv[2],sys.argv[3],desc)
	buildId=client.getbuildId(sys.argv[1])
	if buildId > 0:
		client.pushlishVersion(sys.argv[1],sys.argv[2],buildId,desc)
	else:
		print ("Get publish Buid Id error,please check",sys.argv[1])
		exit("Get publish Buid Id error,please check");
	
	
