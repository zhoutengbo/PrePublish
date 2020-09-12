'''
Create on 2020.09.13
@author: 1210547224@qq.com

'''
import requests
import os,sys
from urllib.parse import quote,unquote

request_url="http://172.16.1.109:3030/prepublish/upload"



def PrepublishVersion(deb_version,name,date,filePath,desc):
	headers = {"Referer":"http://zentao.keensense.cn:28888/pro/build-create-381.html","User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36","Origin":"http://zentao.keensense.cn:28888","Content-type": "application/x-www-form-urlencoded","Accept": "text/plain"}
	publishData = "deb_version="+deb_version+"&name="+name+"&date="+date+"&filePath="+quote(filePath,'utf-8')+"&desc="+quote(desc,'utf-8')


	r = requests.post(request_url,data=publishData,headers=headers)
	
	responsedata=r.text
	print ('服务端的响应报文为（客户端 <--服务端）: ',responsedata)
	print ("get the status: ",r.status_code)



if __name__ == '__main__':
	if(len(sys.argv) < 6):
		exit("uncompatable args");
	print ("deb_version",sys.argv[1])
	print ("name:",sys.argv[2])
	print ("date:",sys.argv[3])
	print ("filePath:",sys.argv[4])
	
	desc=""
	for var in range(4,len(sys.argv)):
		desc+=" "+sys.argv[var]
	print ("desc:",desc)
	
	PrepublishVersion(sys.argv[1],sys.argv[2],sys.argv[3],sys.argv[4],desc)
	
